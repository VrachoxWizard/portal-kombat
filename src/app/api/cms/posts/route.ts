import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { PostType, PublishStatus } from "@prisma/client";

// Get all posts for CMS management
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  try {
    const whereClause: any = {};

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
  const session = await getSession();
  if (!session) {
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
      tagNames = [], // Array of tag names string e.g. ["UFC", "Stipe Miocic"]
      prediction,
    } = body;

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
          authorId: session.user.id,
          categoryId: categoryId || null,
          publishedAt: status === "PUBLISHED" ? new Date() : null,
          tags: {
            connect: tagConnectOrCreate.map((t) => ({ id: t.id })),
          },
        },
      });

      if (type === "PREDICTION" && prediction) {
        await tx.prediction.create({
          data: {
            postId: post.id,
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

      return post;
    });

    return NextResponse.json(newPost);
  } catch (error: any) {
    console.error("CMS POST create API error:", error);
    return NextResponse.json(
      { error: error.message || "Došlo je do pogreške" },
      { status: 500 }
    );
  }
}
