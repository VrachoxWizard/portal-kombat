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
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("CMS GET categories error:", error);
    return NextResponse.json({ error: "Greška na poslužitelju" }, { status: 500 });
  }
}
