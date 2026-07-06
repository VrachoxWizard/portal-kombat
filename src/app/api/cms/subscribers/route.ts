import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, requireSession, authErrorResponse } from "@/lib/auth-utils";

export async function GET() {
  try {
    requireSession(await getSession());
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return NextResponse.json(res.body, { status: res.status });
  }

  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error("CMS GET subscribers API error:", error);
    return NextResponse.json({ error: "Greška na poslužitelju" }, { status: 500 });
  }
}
