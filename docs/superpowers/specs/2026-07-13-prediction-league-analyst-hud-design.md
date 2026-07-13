# CombatPortal HR — Prediction League & Analyst Gamification Design Spec

**Date**: 2026-07-13  
**Status**: Approved  
**Approach**: Build a dedicated client-side gamified league portal under `/liga` using client storage, static leaderboard comparisons, SVG championship belt badges, and a telemetry simulator dashboard.

---

## Design Objectives

1. **Gamified Rankings**: Display user's stats (Wins, Losses, Accuracy, Streak) from their local prediction choices.
2. **SVG Championship Belt Badge**: An elaborate SVG badge that dynamically morphs between four styles (Amateur, Prospect, Contender, Champion) with corresponding neon glowing outlines.
3. **League Dashboard Page (`/liga`)**: A complete dashboard combining the user's Analyst Profile Card, the Belt Badge, a Live Leaderboard compared against expert writers and community members, and a Test Simulator.
4. **Historical Seeding**: Insert resolved historical match predictions in the database to enable retroactive voting.

---

## Proposed Changes

### 1. Database & Seeding Updates

#### [MODIFY] [seed-real-data.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/seed-real-data.ts)
Add 8-10 historical resolved predictions from 2025/2026 (e.g., Jon Jones vs. Stipe Miocic UFC 309, Alex Pereira vs. Khalil Rountree) with `actualWinner`, `actualMethod`, `actualRound`, `isCorrect: true`, and `resolvedAt = new Date()`.

---

### 2. High-Tech Visual Components

#### [NEW] [BeltBadge.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/fighters/BeltBadge.tsx)
An SVG-based vector rendering of a championship combat fight belt.
- **Tiers**:
  - `AMATEUR` (0-2 wins): Steel plate, white strap, no glow.
  - `PROSPECT` (3-5 wins): Blue plate accents, blue strap, cyan edge-glow.
  - `CONTENDER` (6-10 wins): Gold plate, gold trim strap, amber-gold aura.
  - `CHAMPION` (11+ wins): Flashing ruby plate, crown emblem, pulsing red aura.
- Renders active text labels displaying the current title rank.

#### [NEW] [LeagueLeaderboard.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/fighters/LeagueLeaderboard.tsx)
A clean, broadcast-themed rankings board showing:
- Expert writers: Marko Horvat (82% accuracy), Mislav Vukušić (75% accuracy).
- Mock community users: `CroCopFan99`, `BadrHariZagreb`, `UfcGuruZg`.
- The current user dynamically inserted and ranked in their exact position relative to their wins.

#### [NEW] [LeagueSimulator.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/fighters/LeagueSimulator.tsx)
A telemetry-themed collapsible control bar.
- Buttons to manually trigger state overrides (e.g. "Simuliraj 4 pobjede", "Simuliraj 12 pobjeda (Prvak)") to test badge visual designs and animations instantly.

---

### 3. Pages & Endpoints

#### [NEW] [route.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/api/predictions/resolved/route.ts)
A Next.js API Route Handler returning a list of all resolved predictions:
`GET /api/predictions/resolved` returning `[ { id, fighterA, fighterB, actualWinner, isCorrect, postId } ]`.

#### [NEW] [page.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/liga/page.tsx)
The Prediction League dashboard page.
- Loads resolved predictions from `/api/predictions/resolved`.
- Calculates current local user statistics comparing predictions database IDs with `localStorage.getItem('cp-vote-' + id)`.
- Renders user Analyst Card, `<BeltBadge>`, `<LeagueSimulator>`, and `<LeagueLeaderboard>`.

#### [MODIFY] [page.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/predikcije/page.tsx)
Add an promotional broadcast bar linking readers to `/liga`:
`LIGA ANALITIČARA • SAZNAJ SVOJ RANGLISTU I ŠAMPIONSKI POJAS →`

---

## Verification Plan

### Automated Verification
1. Run Prisma seed imports to populate resolved predictions.
2. Confirm app compiles: `pnpm build`
3. Run linter and tests: `pnpm lint`, `pnpm test`

### Manual Verification
- Open `/liga` in the browser.
- Verify the BeltBadge renders as "AMATEUR" by default.
- Click "Simuliraj 12 pobjeda" in the Simulator Panel and check if the belt transforms into the flashing red "CHAMPION" belt.
- Verify user stats match the simulated values.
