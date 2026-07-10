# CombatPortal HR — Industrial Luxury Masterpiece Transformation

**Direction:** Evolve the existing "Gritty Brutalist Fight Magazine" identity into **"Industrial Luxury"** — surgical precision meets arena intensity. Awwwards-tier polish while keeping the brutalist DNA strong.

**Intensity:** Intense but controlled. Premium machined surfaces, not raw aggression. Think aerospace instrument panels, not underground fight club.

---

## 1. Design Thesis

**"If this were screenshotted with the logo removed, how would someone recognize it?"**

> The site should be recognizable by: the contrast between razor-sharp industrial edges and warm atmospheric red arena glows, the oversized italic condensed typography that screams fight culture, and the physical "machined hardware" feel of every card and surface — as if each UI element were CNC-milled from dark steel.

### Aesthetic Formula

```
Industrial Luxury = Brutalist Structure × Premium Materiality × Arena Atmosphere × Controlled Motion
```

- **Brutalist Structure**: 0px radii, offset shadows, hard borders, uppercase everything
- **Premium Materiality**: Double-bezel nested surfaces, hairline inner glows, machined depth
- **Arena Atmosphere**: Controlled red/indigo ambient lighting, not overwhelming — like arena spotlights seen from distance
- **Controlled Motion**: Spring physics, not linear; purposeful entry animations, not decorative spam

---

## 2. Design System Upgrades

### 2.1 Typography

**Current**: Space Grotesk (display) + Plus Jakarta Sans (body) — good foundation but not distinctive enough.

**Upgrade**:
- **Display**: Switch to `Clash Display` (variable weight) — a brutalist geometric display face with the sharp, angular character that screams combat sports. Used for all headings, navigation, badges.
- **Body**: Keep `Plus Jakarta Sans` — it's readable and pairs well. Upgrade usage with tighter tracking on labels, more generous line-height in article prose.
- **Accent/Data**: `JetBrains Mono` for stats, records, confidence percentages — reinforces the "instrument panel" feel.

### 2.2 Color System Refinement

Keep the obsidian base and rose-red primary. Refine with more nuance:

```css
/* Refined palette */
--bg-canvas: #030408;           /* Deeper, near-black with blue undertone */
--bg-canvas-raised: #070a14;
--surface-card: #0a0d18;        /* Slightly bluer, more premium */
--surface-elevated: #0f1324;
--surface-machined: #12162a;    /* NEW: inner card surface */

/* Primary remains #e11d48 but with refined accent hierarchy */
--primary: #e11d48;
--primary-glow: rgba(225, 29, 72, 0.15);
--primary-ember: rgba(225, 29, 72, 0.06);

/* Gold accent for featured/premium elements */
--accent-gold: #d4a853;         /* Warmer, less "default yellow" */
--accent-gold-glow: rgba(212, 168, 83, 0.15);

/* Combat-specific semantic colors */
--fighter-a: #3b82f6;           /* Blue corner */
--fighter-b: #ef4444;           /* Red corner */
--correct: #10b981;
--incorrect: #ef4444;
```

### 2.3 Surface Architecture — The "Double-Bezel" System

Every card/container gets the **machined hardware** treatment (outer shell + inner core):

```
┌─────────────────────────────┐  ← Outer shell: bg-white/[0.02], ring-1 ring-white/[0.06], p-[3px]
│ ┌─────────────────────────┐ │
│ │                         │ │  ← Inner core: bg-surface-card, inset shadow highlight,
│ │     Actual content      │ │     border-l-2 border-primary (accent edge)
│ │                         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

- Cards don't sit flat — they have physical depth
- Each card gets a **2px left-edge accent** in primary color (like a machined chamfer)
- Hover state: the accent edge glows, the brutalist offset shadow intensifies

### 2.4 Shadows & Depth

```css
/* Layered shadow system */
--shadow-base: 0 1px 2px rgba(0,0,0,0.4);
--shadow-brutalist: 4px 4px 0px 0px rgba(22, 28, 50, 0.8);
--shadow-brutalist-hover: 6px 6px 0px 0px #e11d48;
--shadow-inner-glow: inset 0 1px 0 rgba(255,255,255,0.04);
--shadow-arena: 0 0 60px rgba(225, 29, 72, 0.08);
```

### 2.5 Motion System

```css
/* Spring-based, not linear */
--ease-out-premium: cubic-bezier(0.32, 0.72, 0, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--motion-hover: 180ms;
--motion-entrance: 500ms;
--motion-page: 350ms;
```

**Rules:**
- Animate ONLY `transform` and `opacity`
- Scroll-triggered entries use Framer Motion `whileInView` with `translate-y-6 opacity-0 → translate-y-0 opacity-100`
- Hover micro-interactions: `scale(0.98)` on press, magnetic pull on buttons
- Page transitions: shared layout animation for article → detail view

---

## 3. Component-by-Component Upgrades

### 3.1 Navigation — Floating Island Header

**Current**: Standard sticky header with gradient bg, full-width.

**Upgrade**:
- **Desktop**: Floating pill navigation detached from edges (`mt-4 mx-6 rounded-none` with the double-bezel). On scroll, it collapses tighter and gains backdrop-blur.
- **Active indicator**: Instead of just a bottom bar, the active link gets a glowing red underline with `box-shadow: 0 2px 8px rgba(225,29,72,0.4)`.
- **Category sub-nav**: Below main nav, categories displayed as machined metal tab-pills with the left-accent-edge treatment.
- **Mobile menu**: Full-screen takeover with staggered mask reveal (links slide up from `translate-y-12 opacity-0` with incremental delay). Heavy `backdrop-blur-3xl`. Large condensed typography.

### 3.2 Homepage — The Arena Experience

**Current**: 3D arena (1300+ line Three.js), hero article, article grid, sidebar.

**Upgrades**:
1. **3D Arena**: Keep and polish — add post-processing bloom effect on the arena lights, smoother camera orbit, ensure the fight card overlay has the double-bezel treatment.
2. **Hero Article**: Expand to full-viewport height on page 1. Implement **parallax image** effect (image scrolls at 0.7x speed). The text side gets a dramatic oversized drop-cap in Clash Display. Border changes from `border-2` to the double-bezel nested architecture.
3. **Article Grid**: Replace the standard 2-column grid with an **Asymmetric Bento Layout** — first card spans full width (horizontal), next two are 1:1 ratio cards, then a tall narrow card paired with a short wide card. This creates visual rhythm that breaks generic blog patterns.
4. **Sidebar**: Each section gets the double-bezel treatment. The "Upcoming Fights" cards get a **mini VS matchup layout** with fighter names on opposing sides and a pulsing red VS badge in the center.

### 3.3 Article Cards — Physical Tactile Objects

**Current**: Clean cards with image, badges, title, excerpt, author/date footer.

**Upgrades**:
- **Double-bezel architecture**: Outer shell wraps each card
- **Hover effect upgrade**: Instead of just `translate(-3px, -3px)`, implement:
  1. Card lifts via `translate(-3px, -3px)`
  2. Brutalist shadow intensifies to primary color
  3. Left accent edge glows (`box-shadow: inset 3px 0 0 var(--primary)`)
  4. Image zooms subtly (`scale(1.04)`)
  5. Title color transitions to primary
- **Prediction cards**: Get a specialized treatment with fighter names on opposing sides, a diagonal VS slash, and a confidence meter bar

### 3.4 Hero Article — Full-Bleed Cinematic

**Upgrade**:
- Full-bleed (edge-to-edge, breaking the `max-w-7xl` container)
- Image side gets Ken Burns + subtle parallax
- Text side: oversized Clash Display heading, dramatic drop-cap, amber "FEATURED" badge with glow
- Bottom metadata bar: monospace data typography (JetBrains Mono for reading time, date)
- Red accent line at the bottom of the hero (`h-1 bg-primary w-full`)

### 3.5 Article Reading Experience

**Current**: Nice prose styling with drop-cap and brutalist blockquotes.

**Upgrades**:
- **Reading progress bar**: Upgrade from simple bar to a glowing red line with trail effect (`box-shadow: 0 0 10px var(--primary)`)
- **Table of Contents**: Floating sticky sidebar on desktop, collapsible on mobile. Active heading highlighted with red accent.
- **Pull quotes**: Oversized, italic, with red quote marks and a subtle red left border glow
- **In-article images**: Get the double-bezel frame treatment
- **Author bio at bottom**: Card with avatar, name, bio, and link to author page. Double-bezel treatment.

### 3.6 Fighter Profiles — Broadcast Graphics

**Current**: Simple card grid with image, name, record, weight class, team.

**Upgrades**:
- **Fighter cards**: Redesign as "stat cards" inspired by UFC broadcast lower-thirds
  - Fighter image with red/blue corner indicator strip at top
  - Name in oversized condensed italic Clash Display
  - Record displayed in JetBrains Mono with color-coded W-L-D
  - Weight class as a machined pill badge
  - Hover: card lifts, corner indicator pulses
- **Fighter profile page** (at `/borci/[slug]`): Full broadcast overlay treatment
  - Large hero image with fighter name overlaid in massive condensed type
  - Stats panel with bar graphs for win methods (KO/Sub/Dec)
  - Fight history timeline
  - Related predictions

### 3.7 Predictions — VS Matchup Presentations

**Current**: Standard article cards with inline text "Fighter A VS Fighter B".

**Upgrades**:
- **Prediction cards**: Specialized component with:
  - Two-column layout: Fighter A (left, blue tint) vs Fighter B (right, red tint)
  - Diagonal slash divider with "VS" badge
  - Confidence meter: Animated arc/bar showing percentage
  - Method badge (KO, Submission, Decision) as color-coded pill
  - Result overlay (if resolved): ✓ or ✗ with green/red overlay
- **Prediction Widget** (in article): Full-width VS comparison with fighter images, key stats, and the prediction breakdown

### 3.8 Mobile Experience

**Current**: Responsive collapse with mobile bottom nav.

**Upgrades**:
- **Bottom nav**: Upgrade to floating pill with backdrop-blur, not edge-to-edge. Active tab gets red dot indicator.
- **Cards**: On mobile, cards get a touch-optimized hover state (brief `scale(0.98)` on press).
- **Hero**: Stacked layout with image on top, fading into text below. Maintain atmospheric glow.
- **Swipe gestures**: On fighter profiles and prediction comparisons, allow horizontal swipe between entries.
- **Safe areas**: Proper `env(safe-area-inset-*)` support for notched devices.

### 3.9 Page Transitions

**New feature**: Smooth transitions between pages using Next.js View Transitions API.

- **Article list → Article detail**: The clicked card image expands to fill the hero area (shared element transition).
- **Page-level fade**: Content fades out/in with a subtle `translate-y-4` shift.
- **Loading state**: Skeleton cards with the shimmer effect already in place, but refined to use the double-bezel frame.

### 3.10 Micro-Interactions Everywhere

- **Buttons**: `scale(0.98)` on press, shadow lift on hover, inner icon translates diagonally
- **Links**: Underline slides in from left on hover (using `::after` pseudo-element)
- **Tags/Badges**: Subtle glow pulse on hover
- **Scroll-to-top**: Floating pill button, appears with spring animation after scrolling 200px
- **Command Palette (⌘K)**: Backdrop-blur overlay, staggered result entry animations
- **Newsletter form**: Success state with green glow border transition
- **Trending ticker**: Pause on hover, speed indicator badge

---

## 4. New CSS Utilities

```css
/* Double-bezel wrapper */
.bezel-outer { ... }
.bezel-inner { ... }

/* Accent edge (left border glow) */
.accent-edge { border-left: 2px solid var(--primary); }
.accent-edge-glow { box-shadow: inset 3px 0 8px var(--primary-glow); }

/* Corner indicators (fighter blue/red) */
.corner-blue { ... }
.corner-red { ... }

/* Data typography (monospace for stats) */
.font-data { font-family: var(--font-mono); }

/* Arena spotlight ambient */
.spotlight-red { ... }
.spotlight-indigo { ... }
```

---

## 5. What We're NOT Changing

- **Tech stack**: Next.js 16, React 19, Tailwind v4, Prisma 7, PostgreSQL — stays
- **Routing**: All existing routes stay the same
- **CMS**: No changes to the CMS backend
- **Data model**: Prisma schema stays — we're purely upgrading the frontend presentation
- **Content**: All existing content, articles, fighters, predictions remain
- **Functionality**: Filters, search, pagination, newsletter, comments — all stay, just get visual upgrades
- **Accessibility**: We maintain and improve a11y (focus states, semantic HTML, ARIA)
- **Language**: Croatian (hr) — no changes

---

## 6. Phased Implementation

### Phase 1: Design System Foundation
- New typography setup (Clash Display + JetBrains Mono)
- Refined color tokens in globals.css
- Double-bezel surface system (`.bezel-outer`, `.bezel-inner`)
- Updated shadow/depth system
- Motion utilities and spring constants
- New CSS utility classes

### Phase 2: Shell & Navigation
- Header → Floating island redesign
- Footer refinement with double-bezel
- Mobile bottom nav → floating pill
- Trending ticker polish
- Page transition system

### Phase 3: Homepage & Cards
- Hero article → full-bleed cinematic
- Article cards → double-bezel + enhanced hover
- Asymmetric bento grid layout
- Sidebar → machined surfaces
- 3D Arena polish

### Phase 4: Content Pages
- Article reading experience (progress bar, ToC, prose upgrades)
- News/Blog listing pages
- Predictions → VS matchup cards
- Fighter profiles → broadcast graphics
- Contact, About, Search pages

### Phase 5: Micro-Interactions & Polish
- Button/link hover interactions
- Scroll animations refinement
- Mobile-specific polish
- Command palette animations
- Loading/error/empty state upgrades
- Cross-browser testing

---

## Open Questions

> [!IMPORTANT]
> **Font sourcing**: Clash Display is from Fontshare (free). Should we self-host it or use a CDN? Self-hosting gives better performance and no FOUT. JetBrains Mono is on Google Fonts.

> [!IMPORTANT]
> **View Transitions API**: Next.js 16 has experimental support for the View Transitions API. Should we use this (modern, progressive enhancement) or stick with Framer Motion layout animations (wider browser support, more control)?

> [!NOTE]
> **3D Arena scope**: The CombatArena3D component is 1300+ lines. The "polish" work (bloom, smoother orbit) is self-contained but non-trivial. Should we treat it as a separate phase or include it in Phase 3?
