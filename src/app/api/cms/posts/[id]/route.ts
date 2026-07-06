import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { PostType, PublishStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Get details of a single post (for editing)
export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
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

    return NextResponse.json(post);
  } catch (error) {
    console.error("CMS GET single post error:", error);
    return NextResponse.json({ error: "Greška na poslužitelju" }, { status: 500 });
  }
}

// Update a post
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
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

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Naslov, slug i sadržaj su obavezni" },
        { status: 400 }
      );
    }

    // Check slug uniqueness (excluding current post)
    const existing = await prisma.post.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Članak s ovim slugom već postoji" },
        { status: 400 }
      );
    }

    // Resolve tags (find or create)
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

    // Update post transaction
    const updatedPost = await prisma.$transaction(async (tx) => {
      // Find current post to check if type changed or prediction exists
      const currentPost = await tx.post.findUnique({
        where: { id },
        include: { prediction: true },
      });

      if (!currentPost) {
        throw new Error("Članak ne postoji");
      }

      // Update fields
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
          // Set new tags connections
          tags: {
            set: [], // Clear all current connections
            connect: tagConnectOrCreate.map((t) => ({ id: t.id })),
          },
        },
      });

      // Handle prediction details
      if (type === "PREDICTION" && prediction) {
        if (currentPost.prediction) {
          // Update existing prediction
          await tx.prediction.update({
            where: { id: currentPost.prediction.id },
            data: {
              fighterA: prediction.fighterA || "",
              fighterB: prediction.fighterB || "",
              winner: prediction.winner || "",
              method: prediction.method || "",
              predictedRound: prediction.predictedRound || null,
              confidenceScore: Number(prediction.confidenceScore) || 50,
              keyReasoning: prediction.keyReasoning || "",
            },
          });
        } else {
          // Create new prediction
          await tx.prediction.create({
            data: {
              postId: id,
              fighterA: prediction.fighterA || "",
              fighterB: prediction.fighterB || "",
              winner: prediction.winner || "",
              method: prediction.method || "",
              predictedRound: prediction.predictedRound || null,
              confidenceScore: Number(prediction.confidenceScore) || 50,
              keyReasoning: prediction.keyReasoning || "",
            },
          });
        }
      } else {
        // If type changed from PREDICTION, or no prediction was provided, delete prediction record
        if (currentPost.prediction) {
          await tx.prediction.delete({
            where: { id: currentPost.prediction.id },
          });
        }
      }

      return post;
    });

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    console.error("CMS PUT update post API error:", error);
    return NextResponse.json(
      { error: error.message || "Došlo je do pogreške" },
      { status: 500 }
    );
  }
}

// Delete a post
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CMS DELETE post API error:", error);
    return NextResponse.json({ error: "Greška na poslužitelju" }, { status: 500 });
  }
}
