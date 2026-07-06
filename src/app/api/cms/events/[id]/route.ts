import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getSession,
  requireSession,
  requireAdmin,
  authErrorResponse,
} from "@/lib/auth-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(await getSession());
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return NextResponse.json(res.body, { status: res.status });
  }

  const { id } = await params;

  try {
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CMS DELETE event API error:", error);
    return NextResponse.json({ error: "Greška na poslužitelju" }, { status: 500 });
  }
}
