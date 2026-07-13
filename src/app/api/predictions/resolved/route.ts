import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const resolvedPredictions = await prisma.prediction.findMany({
      where: {
        resolvedAt: {
          not: null,
        },
      },
      select: {
        id: true,
        fighterA: true,
        fighterB: true,
        winner: true,
        method: true,
        predictedRound: true,
        confidenceScore: true,
        keyReasoning: true,
        votesFighterA: true,
        votesFighterB: true,
        actualWinner: true,
        actualMethod: true,
        actualRound: true,
        isCorrect: true,
        resolvedAt: true,
        post: {
          select: {
            title: true,
            slug: true,
            featuredImage: true,
          },
        },
      },
      orderBy: {
        resolvedAt: "desc",
      },
    });

    return NextResponse.json(resolvedPredictions);
  } catch (error) {
    console.error("Greška pri dohvaćanju riješenih predikcija:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
