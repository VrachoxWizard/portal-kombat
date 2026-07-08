import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({ posts: [], fighters: [], events: [] });
  }

  try {
    // 1. Search posts
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
      },
      take: 5,
    });

    // 2. Search fighters
    const fighters = await prisma.fighter.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { team: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        weightClass: true,
      },
      take: 5,
    });

    // 3. Search events
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { event: { contains: q, mode: "insensitive" } },
          { fighterA: { contains: q, mode: "insensitive" } },
          { fighterB: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
    });

    return NextResponse.json({ posts, fighters, events });
  } catch (error) {
    console.error("Unified search API error:", error);
    return NextResponse.json({ error: "Greška na poslužitelju" }, { status: 500 });
  }
}
