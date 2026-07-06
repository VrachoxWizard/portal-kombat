import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/auth-utils";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { error: "Došlo je do pogreške prilikom odjave" },
      { status: 500 }
    );
  }
}
