# CombatPortal HR — Fighter Intelligence & VS HUD Comparison Design Spec

**Date**: 2026-07-13  
**Status**: Approved  
**Approach**: Extend database schemas to track tactical statistics, and implement high-fidelity SVG graphics to compare fighters side-by-side in a "Telemetry Overlay HUD" layout.

---

## Design Objectives

1. **Extend Fighter Profiles**: Transform the static bio card into a tactical stats page featuring skill radar charts and win-method breakdowns.
2. **Dynamic VS HUD Page (`/borci/vs`)**: Allow users to dynamically select any two fighters from the database and compare their physical stats, skill ratings, and win methods in a single unified dashboard.
3. **Seamless Matchup Integration**: Link directly to the comparison HUD from fight predictions, pre-loading both fighters automatically.

---

## Proposed Changes

### 1. Database & Schema Updates

#### [MODIFY] [schema.prisma](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/schema.prisma)
Extend the `Fighter` model with numerical attributes representing:
- Skill stats (0-100): striking, grappling, power, cardio, chin, and takedown defense (`tdDefense`).
- Win methods (percentages, sum to 100): `koPct`, `subPct`, `decPct`.

```prisma
model Fighter {
  // Existing fields...
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  weightClass String
  record      String   
  stance      String?
  team        String?
  imageUrl    String?
  bio         String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // NEW: Tactical Skill Attributes (0-100 scale)
  striking    Int      @default(70)
  grappling   Int      @default(70)
  power       Int      @default(70)
  cardio      Int      @default(70)
  chin        Int      @default(70)
  tdDefense   Int      @default(70)

  // NEW: Win Methods Breakdown (Percentages, sum = 100)
  koPct       Int      @default(34)
  subPct      Int      @default(33)
  decPct      Int      @default(33)

  predictionsAsA Prediction[] @relation("FighterA")
  predictionsAsB Prediction[] @relation("FighterB")
  eventsAsA      Event[]      @relation("EventFighterA")
  eventsAsB      Event[]      @relation("EventFighterB")
}
```

#### [MODIFY] [seed.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/seed.ts) & [seed-real-data.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/seed-real-data.ts)
Update database seeds to populate realistic ratings for fighters (e.g. Mirko "Cro Cop" Filipović gets high striking and power; Jon Jones gets high grappling and takedown defense).

---

### 2. High-Tech Visual Components

#### [NEW] [RadarChart.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/fighters/RadarChart.tsx)
An SVG-based spider/radar chart drawing fighter profiles.
- Support rendering a single fighter (profile detail view) or overlaying two fighters (Blue Corner vs. Red Corner in the VS HUD).
- Style matching the Broadcast Control Room theme: dark transparent polygons, bright glowing borders, dashed radial grid lines, and Barlow Condensed labels.

#### [NEW] [WinMethodChart.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/fighters/WinMethodChart.tsx)
An SVG Donut Chart representing a fighter's win methods (KO, Submission, Decision).
- Animated SVG dash-offset segments on component mount.
- Legend displaying percentages in their respective segment colors (Red for KO, Blue for Submission, Amber for Decision).

#### [NEW] [PhysicalComparison.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/fighters/PhysicalComparison.tsx)
A comparison table/grid displaying physical telemetry: Height, Reach, Stance, Age, and Record.
- Highlights the fighter with the physical advantage (e.g., higher reach) using gold/cyan glowing borders and tags.

#### [NEW] [FighterSelector.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/fighters/FighterSelector.tsx)
A client-side autocomplete input that fetches fighters dynamically from the `/api/fighters/search` endpoint and loads them into the VS HUD.

---

### 3. Pages & Integrations

#### [NEW] [route.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/api/fighters/search/route.ts)
A Next.js API Route Handler performing fast database lookups of fighters:
`GET /api/fighters/search?q={query}` returning `{ id, name, slug, weightClass, record, imageUrl }`.

#### [NEW] [page.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/borci/vs/page.tsx)
The dedicated Comparison page.
- Select Fighter A (Blue Corner) and Fighter B (Red Corner) dynamically.
- Renders the **Telemetry Overlay HUD**:
  - Top: Symmetrical nameplates with corner color accents.
  - Middle: Overlay Radar Chart displaying both fighter profiles.
  - Lower: Physical comparison rows highlighting advantages.
  - Bottom: Side-by-side win method donut charts.

#### [MODIFY] [page.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/borci/%5Bslug%5D/page.tsx)
Integrate the `<RadarChart>` and `<WinMethodChart>` components into the existing fighter profile page layout. Add a direct link button: `USPOREDI S DRUGIM BORCEM` -> `/borci/vs?fighterA={slug}`.

#### [MODIFY] [PredictionWidget.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/prediction/PredictionWidget.tsx)
Inside prediction widgets on article pages, inject a telemetry button:
`TAKTICKA USPOREDBA` -> `/borci/vs?fighterA={slugA}&fighterB={slugB}`.

---

## Verification Plan

### Automated Verification
1. Run Prisma client code generation:
   `pnpm prisma generate`
2. Run database push and seed commands:
   `pnpm prisma db push`
   `pnpm prisma db seed`
   `pnpm tsx prisma/seed-real-data.ts`
3. Run tests and verify compiler type-safety:
   `pnpm test`
   `pnpm build`
4. Confirm clean lint rules:
   `pnpm lint`

### Manual Verification
- Navigate to `/borci/filipovic` to verify the new radar and donut chart rendering.
- Open `/borci/vs` and test search selection for two fighters. Verify that both shapes superimpose on the radar chart and physical advantages highlight correctly.
- Click "Takticka Usporedba" from a prediction article to verify correct preloading.
