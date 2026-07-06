import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json({ error: "Greška pri dohvaćanju komentara" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(`comment:${ip}`)) {
      return NextResponse.json(
        { error: "Previše komentara. Pokušajte ponovo za minutu." },
        { status: 429 }
      );
    }

    const { id: postId } = await params;
    const { authorName, content } = await req.json();

    if (!authorName || !content || !content.trim()) {
      return NextResponse.json({ error: "Ime i komentar su obavezni" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorName: authorName.trim(),
        content: content.trim(),
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json({ error: "Greška pri spremanju komentara" }, { status: 500 });
  }
}
