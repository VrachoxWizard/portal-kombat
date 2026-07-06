import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getSession,
  requireSession,
  requireAdmin,
  authErrorResponse,
  isAdmin,
} from "@/lib/auth-utils";
import { PostType, PublishStatus } from "@prisma/client";
import { revalidatePostPaths } from "@/lib/revalidate";
import { computePredictionCorrectness } from "@/lib/prediction-constants";
import { createPreviewToken } from "@/lib/preview";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function resolvePredictionData(
  prediction: Record<string, unknown>,
  existing?: { winner: string; resolvedAt: Date | null } | null
) {
  const data = {
    fighterA: String(prediction.fighterA || ""),
    fighterB: String(prediction.fighterB || ""),
    eventId: prediction.eventId ? String(prediction.eventId) : null,
    winner: String(prediction.winner || ""),
    method: String(prediction.method || ""),
    predictedRound: prediction.predictedRound
      ? String(prediction.predictedRound)
      : null,
    confidenceScore: Number(prediction.confidenceScore) || 50,
    keyReasoning: String(prediction.keyReasoning || ""),
    actualWinner: null as string | null,
    actualMethod: null as string | null,
    actualRound: null as string | null,
    isCorrect: null as boolean | null,
    resolvedAt: null as Date | null,
  };

  if (prediction.resolve === true && prediction.actualWinner) {
    const actualWinner = String(prediction.actualWinner);
    data.actualWinner = actualWinner;
    data.actualMethod = prediction.actualMethod
      ? String(prediction.actualMethod)
      : null;
    data.actualRound = prediction.actualRound
      ? String(prediction.actualRound)
      : null;
    data.isCorrect = computePredictionCorrectness(
      String(prediction.winner || existing?.winner || ""),
      actualWinner
    );
    data.resolvedAt = new Date();
  } else if (prediction.clearResolution === true) {
    data.actualWinner = null;
    data.actualMethod = null;
    data.actualRound = null;
    data.isCorrect = null;
    data.resolvedAt = null;
  }

  return data;
}

// Get details of a single post (for editing)
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    requireSession(await getSession());
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return NextResponse.json(res.body, { status: res.status });
  }

  const { id } = await params;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true,
        prediction: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Članak nije pronađen" }, { status: 404 });
    }

    const previewToken = createPreviewToken(post.slug);

    return NextResponse.json({
      ...post,
      previewUrl: `/clanak/${post.slug}?preview=${previewToken}`,
    });
  } catch (error) {
    console.error("CMS GET single post error:", error);
    return NextResponse.json({ error: "Greška na poslužitelju" }, { status: 500 });
  }
}

// Update a post
export async function PUT(req: NextRequest, { params }: RouteParams) {
  let session;
  try {
    session = requireSession(await getSession());
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return NextResponse.json(res.body, { status: res.status });
    return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      type = "NEWS",
      status = "DRAFT",
      categoryId,
      tagNames = [],
      prediction,
    } = body;

    if (status === "PUBLISHED" && !isAdmin(session.user.role)) {
      return NextResponse.json(
        { error: "Samo administrator može objaviti članak" },
        { status: 403 }
      );
    }

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Naslov, slug i sadržaj su obavezni" },
        { status: 400 }
      );
    }

    const existing = await prisma.post.findFirst({
      where: { slug, id: { not: id } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Članak s ovim slugom već postoji" },
        { status: 400 }
      );
    }

    const tagConnectOrCreate = await Promise.all(
      tagNames.map(async (name: string) => {
        const slugified = name
          .toLowerCase()
          .replace(/[đ|Đ]/g, "d")
          .replace(/[š|Š]/g, "s")
          .replace(/[ć|Ć|č|Č]/g, "c")
          .replace(/[ž|Ž]/g, "z")
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");

        return prisma.tag.upsert({
          where: { slug: slugified },
          create: { name, slug: slugified },
          update: {},
        });
      })
    );

    const updatedPost = await prisma.$transaction(async (tx) => {
      const currentPost = await tx.post.findUnique({
        where: { id },
        include: { prediction: true },
      });

      if (!currentPost) {
        throw new Error("Članak ne postoji");
      }

      const post = await tx.post.update({
        where: { id },
        data: {
          title,
          slug,
          excerpt,
          content,
          featuredImage: featuredImage || null,
          type: type as PostType,
          status: status as PublishStatus,
          categoryId: categoryId || null,
          publishedAt:
            status === "PUBLISHED"
              ? currentPost.publishedAt || new Date()
              : null,
          tags: {
            set: [],
            connect: tagConnectOrCreate.map((t) => ({ id: t.id })),
          },
        },
      });

      if (type === "PREDICTION" && prediction) {
        const fA = prediction.fighterA
          ? await tx.fighter.findFirst({
              where: {
                name: { equals: prediction.fighterA.trim(), mode: "insensitive" },
              },
            })
          : null;
        const fB = prediction.fighterB
          ? await tx.fighter.findFirst({
              where: {
                name: { equals: prediction.fighterB.trim(), mode: "insensitive" },
              },
            })
          : null;

        const predictionData = {
          ...resolvePredictionData(prediction, currentPost.prediction),
          fighterAId: fA?.id || null,
          fighterBId: fB?.id || null,
        };

        if (currentPost.prediction) {
          await tx.prediction.update({
            where: { id: currentPost.prediction.id },
            data: predictionData,
          });
        } else {
          await tx.prediction.create({
            data: {
              postId: id,
              ...predictionData,
            },
          });
        }
      } else if (currentPost.prediction) {
        await tx.prediction.delete({
          where: { id: currentPost.prediction.id },
        });
      }

      return post;
    });

    revalidatePostPaths(updatedPost.slug, updatedPost.type);

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("CMS PUT update post API error:", error);
    const message = error instanceof Error ? error.message : "Došlo je do pogreške";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Delete a post
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(await getSession());
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return NextResponse.json(res.body, { status: res.status });
  }

  const { id } = await params;

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    await prisma.post.delete({ where: { id } });

    if (post) {
      revalidatePostPaths(post.slug, post.type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CMS DELETE post API error:", error);
    return NextResponse.json({ error: "Greška na poslužitelju" }, { status: 500 });
  }
}
