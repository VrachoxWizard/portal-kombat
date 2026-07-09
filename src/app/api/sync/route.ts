import { NextRequest, NextResponse } from "next/server";
import { syncUfcEvents } from "@/lib/sync";
import { connection } from "next/server";

export async function GET(req: NextRequest) {
  await connection();
  try {
    // Basic authorization: optional secret parameter if wanted, e.g. /api/sync?secret=123
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    
    // We can verify a secret in production if wanted, but keep it open or check environment
    const expectedSecret = process.env.SYNC_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await syncUfcEvents();
    
    return NextResponse.json({
      success: true,
      message: "Synchronization completed successfully.",
      result,
    });
  } catch (error) {
    console.error("Sync API error:", error);
    return NextResponse.json(
      { error: "Synchronization failed", details: String(error) },
      { status: 500 }
    );
  }
}
