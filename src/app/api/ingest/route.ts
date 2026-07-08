import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateEventPaths } from "@/lib/revalidate";

// Mock external sports API data
const MOCK_EXTERNAL_EVENTS = [
  {
    fighterA: "Jon Jones",
    fighterB: "Stipe Miočić",
    event: "UFC 316: Las Vegas",
    date: "14. studenog",
    externalId: "ext-ufc-316-main",
  },
  {
    fighterA: "Rico Verhoeven",
    fighterB: "Levi Rigters",
    event: "Glory Collision 7",
    date: "7. prosinca",
    externalId: "ext-glory-col-7",
  },
  {
    fighterA: "Filip Hrgović",
    fighterB: "Daniel Dubois",
    event: "Boks: London Revanš",
    date: "12. prosinca",
    externalId: "ext-box-hrgovic-dubois",
  },
  {
    fighterA: "Islam Makhachev",
    fighterB: "Arman Tsarukyan",
    event: "UFC 318: Anaheim",
    date: "18. siječnja",
    externalId: "ext-ufc-318-main",
  },
];

export async function POST(req: NextRequest) {
  // Simple auth check for internal cron triggers (e.g., token in header)
  const authHeader = req.headers.get("Authorization");
  const cronToken = process.env.INGEST_CRON_TOKEN;

  if (cronToken && authHeader !== `Bearer ${cronToken}`) {
    return NextResponse.json({ error: "Nedopušten pristup" }, { status: 401 });
  }

  try {
    const results = [];

    for (const extEvent of MOCK_EXTERNAL_EVENTS) {
      // Find matching fighters in our DB to link them correctly
      const fA = await prisma.fighter.findFirst({
        where: { name: { equals: extEvent.fighterA.trim(), mode: "insensitive" } },
      });
      const fB = await prisma.fighter.findFirst({
        where: { name: { equals: extEvent.fighterB.trim(), mode: "insensitive" } },
      });

      // Upsert the event based on event name and date combination
      const event = await prisma.event.create({
        data: {
          fighterA: extEvent.fighterA,
          fighterB: extEvent.fighterB,
          fighterAId: fA?.id || null,
          fighterBId: fB?.id || null,
          event: extEvent.event,
          date: extEvent.date,
        },
      });

      results.push(event);
    }

    if (results.length > 0) {
      revalidateEventPaths();
    }

    return NextResponse.json({
      success: true,
      message: `Uspješno uvezeno/ažurirano ${results.length} događaja.`,
      events: results,
    });
  } catch (error) {
    console.error("Ingest API error:", error);
    return NextResponse.json(
      { error: "Neuspjelo uvoženje sportskih podataka" },
      { status: 500 }
    );
  }
}
