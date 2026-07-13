import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const excludeSlug = searchParams.get("exclude") || "";

    const fighters = await prisma.fighter.findMany({
      where: {
        AND: [
          query
            ? {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { slug: { equals: query, mode: "insensitive" } },
                  { team: { contains: query, mode: "insensitive" } },
                  { weightClass: { contains: query, mode: "insensitive" } },
                ],
              }
            : {},
          excludeSlug
            ? {
                slug: { not: excludeSlug },
              }
            : {},
        ],
      },
      orderBy: { name: "asc" },
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        weightClass: true,
        record: true,
        imageUrl: true,
        stance: true,
        team: true,
        striking: true,
        grappling: true,
        power: true,
        cardio: true,
        chin: true,
        tdDefense: true,
        koPct: true,
        subPct: true,
        decPct: true,
        height: true,
        reach: true,
      },
    });

    return NextResponse.json(fighters);
  } catch (error) {
    console.error("Fighter search API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
