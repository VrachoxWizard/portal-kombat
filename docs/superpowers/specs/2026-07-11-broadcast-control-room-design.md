# CombatPortal HR — "Broadcast Control Room" Design Spec

**Date**: 2026-07-11  
**Status**: Approved  
**Approach**: Transform the existing brutalist editorial portal into a live sports broadcast production experience  
**Delivery**: 4 phased sprints, each delivering a polished set of improvements

---

## Design Direction

The current portal has strong brutalist DNA — bezel systems, scanlines, stencil labels, diagonal slashes, CRT textures. We are **promoting** this from "editorial magazine" to "live sports production control room." Every page should feel like a broadcast monitor in an ESPN-level control room.

**Inspirations**: ESPN SportsCenter graphics, UFC broadcast overlays, F1 HUD telemetry, Bloomberg Terminal aesthetics.

---

## Design System Evolution

### Color Palette Extension

| Token | Value | Purpose |
|---|---|---|
| `--primary` | `#e11d48` (red) | Stays — "on-air" red, primary brand |
| `--broadcast-cyan` | `#06b6d4` | "Signal active" / stats / data viz |
| `--broadcast-amber` | `#f59e0b` | "Breaking" / urgent / countdowns |
| `--broadcast-emerald` | `#10b981` | "Confirmed" / correct predictions |
| `--signal-white` | `#e2e8f0` | High-contrast HUD text |

### Typography Addition

- **Existing**: Clash Display (display) + Plus Jakarta Sans (body) + JetBrains Mono (data)
- **New**: `Barlow Condensed` (weight 700/900) for broadcast-style "lower thirds", stat overlays, and HUD labels — the condensed sports graphic font seen on ESPN/UFC broadcasts
- Load via `next/font/google` with latin subset only

### Motion Vocabulary

| Pattern | Used For | Implementation |
|---|---|---|
| Camera Cut | Page transitions | View Transitions API + GSAP `clip-path` wipes fallback |
| Signal Acquisition | Loading states | Scanline + noise → content resolve |
| Countdown Pulse | Event timers | Scale + glow pulse on each tick |
| Stat Reveal | Numbers/charts | Counter animation + stagger |
| Lower Third Slide | Metadata overlays | Slide-in from left with accent bar |

### New Component Primitives

- **`<BroadcastBadge>`** — "LIVE", "BREAKING", "REPLAY" badges with pulse animations
- **`<LowerThird>`** — Broadcast-style metadata overlay (name, title, stats)
- **`<CountdownTimer>`** — Fight night countdown with dramatic urgency (days/hours/minutes/seconds)
- **`<StatReveal>`** — Animated number counter for stats (counts up from 0)
- **`<ChannelWipe>`** — Page transition wrapper using View Transitions API
- **`<BroadcastStrip>`** — Thin persistent "on-air" status bar
- **`<RadarChart>`** — SVG radar/spider chart for fighter skill visualization
- **`<DonutChart>`** — SVG donut chart for win method breakdowns

---

## Phase 1: "Going Live" — Homepage + Transitions + Loading

### 1A. 3D Arena Upgrade → "The Broadcast Set"

**File**: `src/components/ui/CombatArena3D.tsx` (1,319 lines — will be refactored)

Changes:
- **Volumetric spotlights**: Two colored spotlights (blue corner / red corner) slowly sweeping across arena floor with dynamic light casting
- **Particle atmosphere**: Subtle floating dust/ember particles drifting through the scene — "arena haze" effect
- **Camera choreography**: Replace static OrbitControls with automated cinematic camera that dollies between dramatic angles (low wide → overhead → corner close-up) with smooth easing. User interaction still overrides
- **Fight card overlay**: Fight info becomes a broadcast-style floating glass panel — fighter names in condensed type with blue/red corner accents, animated VS badge, countdown timer
- **Rhythmic glow**: Ring-edge glow that pulses rhythmically (simulated heartbeat, no audio) to make the arena feel alive

### 1B. Homepage Layout Enhancement

**File**: `src/app/page.tsx`

Changes:
- **Broadcast Control Bar** (new component): Thin persistent bar above 3D arena — `LIVE • ZAGREB, CROATIA • [countdown to next event] • [current date/time in mono]`
- **Enhanced marquee divider**: Add solid red accent bar on top, "NAJNOVIJE" broadcast label badge on left, slightly reduced text size for elegance
- **Article grid "channel" labels**: Each section gets broadcast-style labels — `CH.01 VIJESTI`, `CH.02 BLOG`, `CH.03 PREDIKCIJE`
- **Sidebar upgrades**: Upcoming fights cards get live countdown timers (days/hours/minutes) with ticking animation. Glas Naroda widget gets "POLL ACTIVE" broadcast indicator

### 1C. Page Transitions → "Camera Cuts"

**New file**: `src/components/ui/ChannelWipe.tsx`  
**Modified**: `src/app/layout.tsx`

Implementation:
- Next.js 16 View Transitions API as primary mechanism
- **Diagonal wipe**: `clip-path` animation from bottom-left to top-right
- **Color flash**: Brief 80ms red flash overlay during transition
- **Content resolve**: New page fades in with quick scanline sweep top-to-bottom, then sharpens
- GSAP ScrollTrigger for scroll-linked animations within pages

### 1D. Loading States → "Signal Acquisition"

**Modified files**: `src/app/loading.tsx`, `src/components/ui/SkeletonCard.tsx`

Phases:
1. **0-200ms**: Dark screen with CRT scanlines sweeping vertically
2. **200-500ms**: Content shapes resolve as glitchy wireframes (border-only skeletons with position jitter)
3. **500ms+**: Wireframes fill with shimmer using broadcast cyan color
4. **Global nav bar**: Segmented "signal strength" blocks that fill left-to-right during navigation

---

## Phase 2: "On Air" — Articles + Header + Navigation

### 2A. Header → "Broadcast Control Panel"

**Modified file**: `src/components/layout/Header.tsx`  
**New file**: `src/components/layout/BroadcastStrip.tsx`

Changes:
- **Broadcast strip** (new, above header): 28px bar spanning full viewport — `◉ ON AIR` pulsing red indicator left, `COMBATPORTAL NETWORK` center, ticking date/time mono right, separated by thin vertical dividers, dark background with noise texture
- **Signal strength icon**: Next to logo, 4 segmented bars that subtly animate
- **Active nav indicator**: Replace red underline with filled red block behind text ("channel selected" on broadcast switcher)
- **Scroll behavior**: Broadcast strip collapses into header on scroll (clock merges into header bar)
- **Mobile menu**: Full-screen "control room" takeover — items as numbered channels (01. NASLOVNICA, 02. NOVOSTI...) with staggered entrance, scanline sweep background

### 2B. Article Pages → "Cinematic Broadcast Feature"

**Modified files**: `src/app/clanak/[slug]/page.tsx`, `src/components/article/HeroArticle.tsx`  
**New files**: `src/components/article/ChapterNav.tsx`, `src/components/article/UpNextPanel.tsx`

Changes:
- **Hero treatment**: Full-viewport hero image with enhanced Ken Burns, vignette overlay, lower-third metadata slide-in (author + date + reading time slides from left, pins briefly, retracts)
- **Chapter navigation** (new component): Auto-detect `h2` headings, create floating "segment selector" on left rail — like broadcast segment switching, shows per-segment progress
- **Pull quotes**: Full-width breakout with diagonal slash background, lower-third attribution, red accent bar
- **Stat callouts**: Inline stats auto-detect and get `<StatReveal>` treatment — animate from 0 on scroll into view
- **"Up Next" panel** (new component): Related articles at end of article in broadcast-style `COMING UP NEXT` panel with auto-advancing progress bar
- **Reading progress**: Restyled as segmented broadcast progress indicator (discrete blocks, not smooth bar)

### 2C. Comment Section Enhancement

**Modified files**: `src/components/article/CommentSection.tsx` (or equivalent)

Changes:
- **"Fan Zone" wrapper**: Bezel container with `FAN ZONE • LIVE REACTIONS` broadcast header
- **New comment animation**: Slide-in with red flash on left border ("new signal received")
- **Engagement counter**: `<StatReveal>` counter animation for comment count

---

## Phase 3: "Fighter Intelligence" — Fighter Profiles + Prediction Gamification

### 3A. Fighter Profiles → "Tactical HUD Dashboard"

**Modified files**: `src/app/borci/page.tsx`, `src/app/borci/[slug]/page.tsx`  
**New files**: `src/components/fighters/RadarChart.tsx`, `src/components/fighters/FightTimeline.tsx`, `src/components/fighters/WinMethodChart.tsx`, `src/components/fighters/PhysicalComparison.tsx`

**Listing page `/borci` changes**:
- "Fighter Database" broadcast header with scanline texture — `FIGHTER DATABASE • [count] PROFILES INDEXED`
- Fighter cards as mini HUD panels — diagonal image crop, condensed display name, record as segmented stat blocks (W/L/D in emerald/red/amber)
- Filter bar as "command console" broadcast switcher buttons
- Search input as "SCAN DATABASE" terminal with blinking cursor

**Detail page `/borci/[slug]` changes**:
- Full-width hero portrait with vignette, massive condensed italic name overlay, blue/red corner indicator
- **Tactical Profile stat grid** (2×3 bento):
  - Radar/spider chart (skills: striking, grappling, cardio, power, chin, TD defense) — animated draw-in on mount
  - Win method donut chart (KO% / SUB% / DEC%) — animated segments
  - Fight timeline (last 5-8 fights, W/L color coded, opponent names, events)
  - Physical comparison (reach/height overlay against upcoming opponent)
  - Record counter (`<StatReveal>` — 27 / 1 / 0 with dramatic scale-in)
  - Active streak (winning = fire trail, losing = cracked surface)
- **"Intel Report"** section: Bio as declassified intelligence document — mono header, red classified stamp, editorial prose

### 3B. Prediction System → "Analyst Command Center"

**Modified files**: `src/app/predikcije/page.tsx`, `src/components/prediction/PredictionWidget.tsx`, `src/components/prediction/PredictionStatsBanner.tsx`, `src/components/layout/GlasNarodaWidget.tsx`  
**New files**: `src/components/prediction/Leaderboard.tsx`, `src/components/prediction/BeltBadge.tsx`, `src/lib/prediction-tracking.ts`

**Predictions listing changes**:
- "War Room" broadcast header — `PREDICTION CENTER • ANALYST COMMAND • [accuracy]% LIFETIME ACCURACY`
- Stats banner → full broadcast ticker with `<StatReveal>` counters
- Urgency-tiered prediction cards:
  - `> 7 days`: Standard with countdown
  - `3-7 days`: Amber "APPROACHING" border pulse
  - `< 3 days`: Red "FIGHT WEEK" glow + intensified countdown
  - Resolved: Grayscale + `RESULT: [CORRECT/INCORRECT]` stamp

**Prediction Leaderboard** (new feature, localStorage-based):
- "Analyst Rankings" board tracking reader prediction accuracy
- Belt system based on correct predictions:
  - 0-2: `AMATEUR` (white badge)
  - 3-5: `PROSPECT` (blue badge)
  - 6-10: `CONTENDER` (gold badge)
  - 11+: `CHAMPION` (red belt icon with glow)
- Streak tracking (consecutive correct = fire counter)
- Broadcast-style rankings table with rank, belt icon, streak, accuracy %

**Glas Naroda Widget upgrade**:
- Animated face-off visualization after voting (Expert vs Community)
- Percentage split bar with dramatic animation
- "CONSENSUS" (>60/40) or "SPLIT DECISION" (<60/40) label

---

## Phase 4: "Mobile Command" — Mobile + Performance + Polish

### 4A. Mobile Experience → "Pocket Broadcast Monitor"

**Modified files**: `src/components/layout/MobileBottomNav.tsx`, various page components  
**New files**: `src/components/ui/SwipeableCards.tsx`, `src/components/ui/BottomSheet.tsx`

Changes:
- **Bottom nav upgrade**: Broadcast switcher with channel numbers above icons (`01`, `02`...), active tab red fill + pulse dot, micro scale bounce on transition
- **Swipeable fight cards**: Homepage upcoming fights as horizontal snap carousel on mobile, signal-strength dot indicators
- **Fighter stat bottom sheets**: Tapping stat category opens slide-up bottom sheet with detail breakdown
- **Mobile article reading**: Chapter nav as swipeable pill bar fixed at top, edge-to-edge pull quotes, swipeable "Up Next" card
- **Touch interactions**: Scale-down on press (0.97), spring bounce on release
- **3D arena fallback**: On limited GPU devices, replace Three.js with 2D "broadcast graphic" (animated gradient background with HUD overlay data, no WebGL)

### 4B. Performance Budget

| Metric | Budget |
|---|---|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| JS Bundle (main) | < 150KB gzipped |
| 3D Arena chunk | Lazy loaded, < 200KB gzipped |

Strategies:
- Three.js tree-shaking (import only used modules)
- GSAP splitting (only `gsap/core` + `ScrollTrigger`)
- View Transitions API (native browser, zero JS cost) with GSAP fallback
- `React.lazy()` + `Suspense` for 3D arena, radar charts, leaderboard
- `next/font/google` for Barlow Condensed with latin subset + weight 700/900 only
- Progressive enhancement: complex animations only if `prefers-reduced-motion: no-preference`

### 4C. Final Polish

- Micro-animation audit: consistent spring configs, timing, easing across all interactive elements
- Color consistency: broadcast colors (cyan, amber) used purposefully, no palette clashes
- Dark mode contrast: all surfaces meet WCAG AA minimum
- Sound design hooks (optional, off by default): `data-sfx` attributes on key interactions for future audio integration, no audio files shipped
- Print stylesheet: clean text layout for articles (hide 3D, nav, broadcast chrome)

---

## Architecture Notes

### File Organization

New components follow existing patterns:
```
src/components/
├── ui/
│   ├── BroadcastBadge.tsx        # "LIVE", "BREAKING", "REPLAY" badges
│   ├── BroadcastStrip.tsx        # Top "on-air" status bar
│   ├── ChannelWipe.tsx           # Page transition wrapper
│   ├── CountdownTimer.tsx        # Fight countdown with urgency tiers
│   ├── LowerThird.tsx            # Broadcast metadata overlay
│   ├── StatReveal.tsx            # Animated number counter
│   ├── SwipeableCards.tsx        # Mobile swipeable carousel
│   ├── BottomSheet.tsx           # Mobile bottom sheet panel
│   ├── DonutChart.tsx            # SVG donut chart
│   └── RadarChart.tsx            # SVG radar/spider chart
├── article/
│   ├── ChapterNav.tsx            # Floating segment selector for long articles
│   └── UpNextPanel.tsx           # "Coming Up Next" related articles
├── prediction/
│   ├── Leaderboard.tsx           # Analyst rankings board
│   └── BeltBadge.tsx             # Prediction rank badges
└── fighters/
    ├── FightTimeline.tsx         # Horizontal fight history
    ├── WinMethodChart.tsx        # Donut chart wrapper
    └── PhysicalComparison.tsx    # Reach/height overlay
```

### Dependencies

- **GSAP** (`gsap`): Page transitions, scroll-triggered animations. Import only `gsap/core` + `ScrollTrigger`
- **Barlow Condensed** font: Via `next/font/google`, latin subset, weights 700/900
- No new heavy dependencies. Radar/donut charts are custom SVG, not chart libraries.

### Data Model Addition (Phase 3)

Prediction leaderboard uses `localStorage` only — no schema changes needed. Structure:

```typescript
interface PredictionRecord {
  predictionId: string;
  chosenFighter: 'fighterA' | 'fighterB';
  timestamp: number;
  isCorrect: boolean | null;
}

interface UserPredictionProfile {
  records: PredictionRecord[];
  currentStreak: number;
  longestStreak: number;
  totalCorrect: number;
  totalPredictions: number;
}
```

---

## Verification Plan

### Automated Tests
- `pnpm build` — verify compilation succeeds
- `pnpm test` — verify all existing Vitest tests pass
- `pnpm lint` — verify zero ESLint warnings/errors

### Manual Verification
- Visual review of each modified page in browser at 1920px, 1440px, 768px, and 375px viewports
- Page transition smoothness check (navigate between 3+ pages)
- Loading state verification (throttle network in DevTools)
- 3D arena performance on both desktop and mobile viewport
- Lighthouse audit targeting performance budget metrics
- `prefers-reduced-motion` testing (all animations disabled gracefully)
