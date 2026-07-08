import { prisma } from "./prisma";

// Weight class mapping from UFC weights to Croatian category names
const WEIGHT_CLASSES: Record<string, string> = {
  "125": "Muha (Flyweight)",
  "135": "Bantam (Bantamweight)",
  "145": "Pero (Featherweight)",
  "155": "Laka (Lightweight)",
  "170": "Velter (Welterweight)",
  "185": "Srednja (Middleweight)",
  "205": "Poluteška (Light Heavyweight)",
  "265": "Teška (Heavyweight)",
};

// Helper to convert Date to Croatian day + month string (e.g. "12. srpnja")
function formatCroatianDate(date: Date): string {
  const day = date.getDate();
  const months = [
    "siječnja",
    "veljače",
    "ožujka",
    "travnja",
    "svibnja",
    "lipnja",
    "srpnja",
    "kolovoza",
    "rujna",
    "listopada",
    "studenoga",
    "prosinca",
  ];
  const monthName = months[date.getMonth()];
  return `${day}. ${monthName}`;
}

// Slugify helper
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

// Interface for parsed event
interface ParsedEvent {
  uid: string;
  summary: string;
  startDate: Date;
  location: string;
  description: string;
}

export async function syncUfcEvents() {
  console.log("Starting UFC Events synchronization...");
  try {
    const res = await fetch("https://raw.githubusercontent.com/clarencechaan/ufc-cal/ics/UFC.ics", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch UFC calendar: ${res.statusText}`);
    }

    const rawText = await res.text();

    // Unwrap folded lines in ICS file (lines starting with space/tab continue the previous line)
    const unwrappedText = rawText.replace(/\r?\n[ \t]/g, "");

    // Regex to split into VEVENT blocks
    const veventRegex = /BEGIN:VEVENT[\s\S]*?END:VEVENT/g;
    const veventBlocks = unwrappedText.match(veventRegex) || [];

    const parsedEvents: ParsedEvent[] = [];

    for (const block of veventBlocks) {
      const uidMatch = block.match(/UID:(.*)/);
      const summaryMatch = block.match(/SUMMARY:(.*)/);
      const dtstartMatch = block.match(/DTSTART;?.*:(.*)/);
      const locationMatch = block.match(/LOCATION:(.*)/);
      const descriptionMatch = block.match(/DESCRIPTION:(.*)/);

      if (!uidMatch || !summaryMatch || !dtstartMatch) continue;

      const uid = uidMatch[1].trim();
      const summary = summaryMatch[1].trim();
      const dtstartStr = dtstartMatch[1].trim(); // e.g., 20260712T010000Z
      const location = locationMatch ? locationMatch[1].trim().replace(/\\,/g, ",") : "";
      
      // Replace escaped newlines in description
      let description = descriptionMatch ? descriptionMatch[1].trim() : "";
      description = description.replace(/\\n/g, "\n").replace(/\\,/g, ",");

      // Parse date: YYYYMMDDTHHMMSSZ
      const year = parseInt(dtstartStr.substring(0, 4), 10);
      const month = parseInt(dtstartStr.substring(4, 6), 10) - 1;
      const day = parseInt(dtstartStr.substring(6, 8), 10);
      const hour = parseInt(dtstartStr.substring(9, 11), 10) || 0;
      const minute = parseInt(dtstartStr.substring(11, 13), 10) || 0;
      const startDate = new Date(Date.UTC(year, month, day, hour, minute));

      parsedEvents.push({
        uid,
        summary,
        startDate,
        location,
        description,
      });
    }

    // Sort events by date ascending
    parsedEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    // Only process future or very recent events (last 2 days to next 6 months)
    const now = new Date();
    const cutoff = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const activeEvents = parsedEvents.filter((e) => e.startDate >= cutoff).slice(0, 8);

    console.log(`Parsed ${parsedEvents.length} events, processing ${activeEvents.length} active/upcoming events...`);

    let syncCount = 0;

    for (const e of activeEvents) {
      // Try to parse the main matchup from description or summary
      // In the calendar, description contains: "Main Card\n--------------------\n• Conor McGregor vs. Max Holloway @170"
      // Or simply: "• Magomed Ankalaev (#1) vs. Khalil Rountree Jr. (#5) @205"
      let fighterA = "";
      let fighterB = "";
      let weightClass = "Teška (Heavyweight)"; // Default fallback

      const mainFightLineMatch = e.description.match(/•\s*(.*?)\s*vs\.\s*(.*?)(?:\s*@(\d+))?(?:\r?\n|$)/);

      if (mainFightLineMatch) {
        // Strip rankings like (#1) or (#12) from names
        fighterA = mainFightLineMatch[1].replace(/\s*\(\s*#\d+\s*\)/g, "").trim();
        fighterB = mainFightLineMatch[2].replace(/\s*\(\s*#\d+\s*\)/g, "").trim();
        
        const weightCode = mainFightLineMatch[3];
        if (weightCode && WEIGHT_CLASSES[weightCode]) {
          weightClass = WEIGHT_CLASSES[weightCode];
        }
      } else {
        // Fallback to parsing from summary (e.g., "UFC 329: McGregor vs Holloway 2")
        const matchupPart = e.summary.includes(":") ? e.summary.split(":")[1] : e.summary;
        if (matchupPart.toLowerCase().includes(" vs")) {
          const split = matchupPart.split(/ vs\.? /i);
          fighterA = split[0].trim();
          // Remove trailing rematch numbers like "2" or "3" from fighter name
          fighterB = split[1].replace(/\s+\d+$/, "").trim();
        }
      }

      if (!fighterA || !fighterB) {
        console.warn(`Could not parse matchup for event: ${e.summary}`);
        continue;
      }

      // Ensure both fighters exist in the database
      const fighterAObj = await ensureFighterExists(fighterA, weightClass);
      const fighterBObj = await ensureFighterExists(fighterB, weightClass);

      // Format event date for display in Croatian (e.g. "12. srpnja")
      const formattedDate = formatCroatianDate(e.startDate);

      // Check if event already exists by date and fighter matchup
      const existingEvent = await prisma.event.findFirst({
        where: {
          OR: [
            {
              fighterAId: fighterAObj.id,
              fighterBId: fighterBObj.id,
            },
            {
              fighterAId: fighterBObj.id,
              fighterBId: fighterAObj.id,
            },
            {
              event: { contains: e.summary.split(":")[0], mode: "insensitive" },
              date: formattedDate,
            }
          ],
        },
      });

      const eventName = e.summary; // e.g. "UFC 329: McGregor vs Holloway 2"

      if (existingEvent) {
        // Update existing event to ensure latest info
        await prisma.event.update({
          where: { id: existingEvent.id },
          data: {
            fighterA: fighterAObj.name,
            fighterB: fighterBObj.name,
            fighterAId: fighterAObj.id,
            fighterBId: fighterBObj.id,
            event: eventName,
            date: formattedDate,
          },
        });
      } else {
        // Create new event
        await prisma.event.create({
          data: {
            fighterA: fighterAObj.name,
            fighterB: fighterBObj.name,
            fighterAId: fighterAObj.id,
            fighterBId: fighterBObj.id,
            event: eventName,
            date: formattedDate,
          },
        });
        syncCount++;
      }
    }

    console.log(`UFC Events sync finished. Added ${syncCount} new events.`);
    return { success: true, processed: activeEvents.length, added: syncCount };
  } catch (error) {
    console.error("Error synchronizing UFC events:", error);
    return { success: false, error: String(error) };
  }
}

// Look up or create a fighter profile dynamically
async function ensureFighterExists(name: string, weightClass: string) {
  const slug = slugify(name);

  // Check if fighter exists by exact slug or exact name
  let fighter = await prisma.fighter.findFirst({
    where: {
      OR: [
        { slug },
        { name: { equals: name, mode: "insensitive" } },
      ],
    },
  });

  if (!fighter) {
    // Determine random/mock stance and record for visual completeness
    const stances = ["Orthodox", "Southpaw", "Switch"];
    const stance = stances[Math.floor(Math.random() * stances.length)];
    
    const wins = Math.floor(Math.random() * 12) + 12; // 12 to 24 wins
    const losses = Math.floor(Math.random() * 4); // 0 to 3 losses
    const draws = Math.random() > 0.8 ? 1 : 0;
    const record = `${wins}-${losses}-${draws}`;

    const placeholders = [
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=400&h=400&q=80", // boxing gloves
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=400&h=400&q=80", // mma cage
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&h=400&q=80", // heavy bag
      "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?auto=format&fit=crop&w=400&h=400&q=80", // ringside
    ];
    const imageUrl = placeholders[Math.floor(Math.random() * placeholders.length)];

    fighter = await prisma.fighter.create({
      data: {
        name,
        slug,
        weightClass,
        record,
        stance,
        imageUrl,
        bio: `${name} je profesionalni UFC borac koji se natječe u ${weightClass.toLowerCase()} kategoriji. Službeno dodan putem automatske sinkronizacije rasporeda borbi.`,
      },
    });
    console.log(`Created new fighter profile for: ${name}`);
  }

  return fighter;
}

export async function triggerAutoSync(label: string = "default") {
  try {
    const lastEvent = await prisma.event.findFirst({
      orderBy: { createdAt: "desc" },
    });
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (!lastEvent || lastEvent.createdAt < oneHourAgo) {
      console.log(`Auto-triggering background UFC events sync from ${label}...`);
      await syncUfcEvents();
    }
  } catch (err) {
    console.error(`Background sync error from ${label}:`, err);
  }
}

