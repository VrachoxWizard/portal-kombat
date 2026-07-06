import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Molimo unesite valjanu e-mail adresu" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Već ste prijavljeni na naš newsletter!",
      });
    }

    // Save to database
    await prisma.subscriber.create({
      data: { email },
    });

    return NextResponse.json({
      success: true,
      message: "Uspješno ste se prijavili na naš newsletter!",
    });
  } catch (error) {
    console.error("Newsletter subscribe API error:", error);
    return NextResponse.json(
      { error: "Došlo je do pogreške prilikom prijave" },
      { status: 500 }
    );
  }
}
