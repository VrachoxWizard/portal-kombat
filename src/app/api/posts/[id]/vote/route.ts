import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { fighter } = body;

    if (fighter !== "A" && fighter !== "B") {
      return NextResponse.json(
        { error: "Nevaljali kut borca. Mora biti 'A' ili 'B'." },
        { status: 400 }
      );
    }

    const prediction = await prisma.prediction.findUnique({
      where: { postId: id },
    });

    if (!prediction) {
      return NextResponse.json(
        { error: "Predikcija nije pronađena za ovu objavu." },
        { status: 404 }
      );
    }

    const updated = await prisma.prediction.update({
      where: { postId: id },
      data: {
        votesFighterA: fighter === "A" ? { increment: 1 } : undefined,
        votesFighterB: fighter === "B" ? { increment: 1 } : undefined,
      },
      select: {
        votesFighterA: true,
        votesFighterB: true,
      },
    });

    return NextResponse.json({
      success: true,
      votesFighterA: updated.votesFighterA,
      votesFighterB: updated.votesFighterB,
    });
  } catch (error) {
    console.error("Greška prilikom glasanja:", error);
    return NextResponse.json(
      { error: "Greška prilikom spremanja glasa u bazu." },
      { status: 500 }
    );
  }
}
