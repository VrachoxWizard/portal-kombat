# CombatPortal HR — Prediction Voting System (Glas Naroda) Design Spec

This specification outlines the design and architecture for adding an interactive **Prediction Voting System ("Glas Naroda")** to CombatPortal HR. This feature introduces gamification by allowing public visitors to cast anonymous votes on upcoming matchups, comparing community sentiment against official editorial forecasts.

---

## 1. Overview & Goals

- **Gamification**: Drive user engagement by allowing readers to pick a winner (Blue Corner vs. Red Corner) for upcoming fight cards.
- **Interactive UI**: Show real-time progress bars comparing the community's split percentages vs. the portal's confidence score.
- **State Persistence**: Utilize client-side `localStorage` to track already voted matchups, preventing vote stuffing and restoring state immediately on page load.
- **Dynamic API**: Increment vote counts atomically in the database via a REST endpoint.
- **Speed & Simplicity**: Implement clean counts directly on the `Prediction` model, adhering to YAGNI and avoiding unnecessary user authentication overhead.

---

## 2. Database Schema Changes

Modify [schema.prisma](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/schema.prisma) to add two new fields with defaults on the `Prediction` model:

```prisma
model Prediction {
  id               String @id @default(cuid())
  postId           String @unique
  post             Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  // Existing fields...
  fighterA         String
  fighterB         String
  winner           String
  method           String
  predictedRound   String?
  confidenceScore  Int
  keyReasoning     String @db.Text
  
  // NEW: Vote count fields
  votesFighterA    Int @default(0)
  votesFighterB    Int @default(0)
  
  // Existing fields...
  actualWinner     String?
  actualMethod     String?
  actualRound      String?
  isCorrect        Boolean?
  resolvedAt       DateTime?
}
```

### Database Synchronization Steps
1. Push local changes: `pnpm prisma db push`
2. Generate TypeScript client definitions: `pnpm prisma generate`
3. Seed default votes in `prisma/seed.ts` and `prisma/seed-real-data.ts` to ensure initial values are loaded.

---

## 3. API Endpoint Specification

Create a dynamic route handler at `src/app/api/posts/[id]/vote/route.ts`.

### Request Configuration
- **URL**: `/api/posts/[id]/vote`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Payload**:
  ```json
  {
    "fighter": "A" // or "B"
  }
  ```

### Response Codes
- **200 OK**: Vote successfully counted. Returns the updated vote aggregates.
  ```json
  {
    "success": true,
    "votesFighterA": 45,
    "votesFighterB": 57
  }
  ```
- **400 Bad Request**: Missing or invalid request fields.
- **404 Not Found**: Post or related prediction record not found in the database.
- **500 Internal Server Error**: Database connection or transaction failure.

### Implementation Logic
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { fighter } = body;

    if (fighter !== "A" && fighter !== "B") {
      return NextResponse.json(
        { error: "Nevaljali kut borca. Mora biti 'A' ili 'B'." },
        { status: 400 }
      )
    }

    const prediction = await prisma.prediction.findUnique({
      where: { postId: id },
    });

    if (!prediction) {
      return NextResponse.json(
        { error: "Predikcija nije pronađena za ovu objavu." },
        { status: 404 }
      );
    }

    const updated = await prisma.prediction.update({
      where: { postId: id },
      data: {
        votesFighterA: fighter === "A" ? { increment: 1 } : undefined,
        votesFighterB: fighter === "B" ? { increment: 1 } : undefined,
      },
      select: {
        votesFighterA: true,
        votesFighterB: true,
      },
    });

    return NextResponse.json({
      success: true,
      votesFighterA: updated.votesFighterA,
      votesFighterB: updated.votesFighterB,
    });
  } catch (error) {
    console.error("Greška prilikom glasanja:", error);
    return NextResponse.json(
      { error: "Greška prilikom spremanja glasa u bazu." },
      { status: 500 }
    );
  }
}
```

---

## 4. UI Components Specification

### 4.1 Sidebar "Glas Naroda" Widget (`GlasNarodaWidget.tsx`)

Create a client-side component at `src/components/layout/GlasNarodaWidget.tsx` and integrate it into the homepage sidebar.

- **Header HUD**: Stencil micro-label `⚡ GLAS NARODA` with a pulsing light.
- **Matchup Display**: Show the two fighters' names in Clash Display Italic, separated by a red `VS` badge.
- **Interactive State**:
  - Read `localStorage` for `cp-vote-${predictionId}`.
  - If **Not Voted**: Render two large buttons.
    - Left Button (Blue Corner): `Glasaj za [FighterA]`
    - Right Button (Red Corner): `Glasaj za [FighterB]`
    - Highlight on hover (blue/red accent border glows).
  - If **Voted**: Render a horizontal percentage progress bar.
    - Left side: Blue color representing Fighter A percentage.
    - Right side: Red color representing Fighter B percentage.
    - Animation: Spring reveal of the bars (`framer-motion`).
    - Subtext: Displays total votes cast and a label indicating if the community consensus aligns with the portal's expert pick.

```typescript
interface GlasNarodaProps {
  predictionId: string;
  postId: string;
  fighterA: string;
  fighterB: string;
  initialVotesA: number;
  initialVotesB: number;
  postSlug: string;
  expertWinner: string;
}
```

### 4.2 In-Article Voting Widget Integration (`PredictionWidget.tsx`)

Enhance [PredictionWidget.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/prediction/PredictionWidget.tsx) to act as the direct in-article voting terminal:

- Accept `predictionId`, `postId`, `initialVotesA`, and `initialVotesB` as optional props.
- If props are provided and the prediction is active (`resolvedAt` is null):
  - Add the interactive voting controls inside the matchup panel.
  - Check the same `localStorage` key (`cp-vote-${predictionId}`) to keep voting choices synchronized.
  - Render a clear community split chart comparison against the portal's confidence bar chart, creating an interesting "Narod vs. Portal" visual comparison.

---

## 5. Verification Plan

### 5.1 Automated Verification
- **Prisma Schema Compilation**: Confirm fields are parsed successfully by running `pnpm prisma generate`.
- **API Tests**: Write a Vitest integration test at `src/app/api/posts/[id]/vote/vote.test.ts` mock-calling the endpoint to ensure correct increment behavior and error responses.
- **Linter & Build Validation**: Run `pnpm lint` and `pnpm build` to verify TypeScript typings.

### 5.2 Manual Verification
1. Open the homepage, navigate to the sidebar, and cast a vote on the featured fight card.
2. Confirm the widget immediately shows progress bars with updated percentages without a page reload.
3. Open a separate tab, read the corresponding prediction article, and verify that the voting widget displays the exact same voted state and percentage results.
4. Refresh the page to verify that the voted state is persisted via `localStorage` and cannot be re-voted.
