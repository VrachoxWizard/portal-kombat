import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
  }

  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("CMS GET events API error:", error);
    return NextResponse.json({ error: "Greška na poslužitelju" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fighterA, fighterB, event, date } = body;

    if (!fighterA || !fighterB || !event || !date) {
      return NextResponse.json(
        { error: "Sva polja (Borac A, Borac B, Događaj, Datum) su obavezna" },
        { status: 400 }
      );
    }

    const fA = fighterA
      ? await prisma.fighter.findFirst({
          where: { name: { equals: fighterA.trim(), mode: "insensitive" } },
        })
      : null;
    const fB = fighterB
      ? await prisma.fighter.findFirst({
          where: { name: { equals: fighterB.trim(), mode: "insensitive" } },
        })
      : null;

    const newEvent = await prisma.event.create({
      data: {
        fighterA,
        fighterB,
        fighterAId: fA?.id || null,
        fighterBId: fB?.id || null,
        event,
        date,
      },
    });

    return NextResponse.json(newEvent);
  } catch (error) {
    console.error("CMS POST event API error:", error);
    return NextResponse.json({ error: "Došlo je do pogreške" }, { status: 500 });
  }
}
