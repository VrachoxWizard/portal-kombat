import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "info@combatportal.hr";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(`contact:${ip}`)) {
    return NextResponse.json(
      { error: "Previše zahtjeva. Pokušajte ponovo za minutu." },
      { status: 429 }
    );
  }

  try {
    const { name, email, subject, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Ime, e-mail i poruka su obavezni." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Unesite valjanu e-mail adresu." },
        { status: 400 }
      );
    }

    const payload = {
      from: "CombatPortal HR <onboarding@resend.dev>",
      to: CONTACT_EMAIL,
      replyTo: email.trim(),
      subject: subject?.trim()
        ? `[Kontakt] ${subject.trim()}`
        : `[Kontakt] Poruka od ${name.trim()}`,
      text: `Ime: ${name.trim()}\nE-mail: ${email.trim()}\n\n${message.trim()}`,
    };

    if (RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(RESEND_API_KEY);
      const { error } = await resend.emails.send(payload);
      if (error) {
        console.error("Resend error:", error);
        return NextResponse.json(
          { error: "Greška pri slanju poruke. Pokušajte kasnije." },
          { status: 500 }
        );
      }
    } else {
      console.log("[Contact form - no RESEND_API_KEY]", payload);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Greška na poslužitelju." },
      { status: 500 }
    );
  }
}
