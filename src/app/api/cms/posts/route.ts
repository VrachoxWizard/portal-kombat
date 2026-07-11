import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getSession,
  requireSession,
  authErrorResponse,
} from "@/lib/auth-utils";
import { PostType, PublishStatus, Prisma, TrustLevel } from "@prisma/client";
import { revalidatePostPaths } from "@/lib/revalidate";

interface SimpleCitation {
  url?: string;
}

// Get all posts for CMS management
export async function GET(req: NextRequest) {
  try {
    requireSession(await getSession());
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return NextResponse.json(res.body, { status: res.status });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  try {
    const whereClause: Prisma.PostWhereInput = {};

    if (type) whereClause.type = type as PostType;
    if (status) whereClause.status = status as PublishStatus;
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("CMS GET posts API error:", error);
    return NextResponse.json({ error: "Greška na poslužitelju" }, { status: 500 });
  }
}

// Create a new post
export async function POST(req: NextRequest) {
  let session;
  try {
    session = requireSession(await getSession());
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return NextResponse.json(res.body, { status: res.status });
    return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
  }

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
      trustLevel = "REPORT",
      citations = [],
    } = body;

    const isEditorOrAdmin = session.user.role === "ADMIN" || session.user.role === "EDITOR";
    if (status === "PUBLISHED" && !isEditorOrAdmin) {
      return NextResponse.json(
        { error: "Samo urednik ili administrator mogu objaviti članak" },
        { status: 403 }
      );
    }

    if (trustLevel === "CONFIRMED" && status === "PUBLISHED") {
      const citationsList = Array.isArray(citations) ? (citations as Partial<SimpleCitation>[]) : [];
      const hasValidCitation = citationsList.some(
        (c) => c && typeof c.url === "string" && c.url.trim() !== ""
      );
      if (!hasValidCitation) {
        return NextResponse.json(
          { error: "Službeno potvrđeni članci moraju sadržavati barem jedan vjerodostojan izvor (URL)." },
          { status: 400 }
        );
      }
    }

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Naslov, slug i sadržaj su obavezni" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.post.findUnique({
      where: { slug },
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

    // Create post transaction
    const newPost = await prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          title,
          slug,
          excerpt,
          content,
          featuredImage: featuredImage || null,
          type: type as PostType,
          status: status as PublishStatus,
          trustLevel: trustLevel as TrustLevel,
          citations: citations || null,
          authorId: session.user.id,
          categoryId: categoryId || null,
          publishedAt: status === "PUBLISHED" ? new Date() : null,
          tags: {
            connect: tagConnectOrCreate.map((t) => ({ id: t.id })),
          },
        },
      });

      if (type === "PREDICTION" && prediction) {
        const fA = prediction.fighterA
          ? await tx.fighter.findFirst({
              where: { name: { equals: prediction.fighterA.trim(), mode: "insensitive" } },
            })
          : null;
        const fB = prediction.fighterB
          ? await tx.fighter.findFirst({
              where: { name: { equals: prediction.fighterB.trim(), mode: "insensitive" } },
            })
          : null;

        await tx.prediction.create({
          data: {
            postId: post.id,
            fighterA: prediction.fighterA || "",
            fighterB: prediction.fighterB || "",
            fighterAId: fA?.id || null,
            fighterBId: fB?.id || null,
            eventId: prediction.eventId || null,
            winner: prediction.winner || "",
            method: prediction.method || "",
            predictedRound: prediction.predictedRound || null,
            confidenceScore: Number(prediction.confidenceScore) || 50,
            keyReasoning: prediction.keyReasoning || "",
          },
        });
      }

      return post;
    });

    revalidatePostPaths(newPost.slug, newPost.type);

    return NextResponse.json(newPost);
  } catch (error) {
    console.error("CMS POST create API error:", error);
    const message = error instanceof Error ? error.message : "Došlo je do pogreške";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
