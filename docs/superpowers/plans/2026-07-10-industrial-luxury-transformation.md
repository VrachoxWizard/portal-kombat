# CombatPortal HR — Industrial Luxury Masterpiece Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform CombatPortal HR into an Awwwards-tier "Industrial Luxury" experience by upgrading the typography, colors, layout structures, page transitions, and interactive details.

**Architecture:** Upgrade the frontend CSS design tokens in `globals.css` to implement the double-bezel surface system. Rebuild the navigation headers and content cards as highly responsive React components with custom spring animations. Re-layout the homepage into an asymmetric bento grid.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, Lucide icons, Jest/Vitest for unit testing.

## Global Constraints

- **Typography**: Clash Display for display headings, JetBrains Mono for stats/data, Plus Jakarta Sans for body text.
- **Surface Design**: Double-bezel architecture for all major cards and containers (outer frame + inner core).
- **Aesthetic**: Dark Obsidian (`#030408` / `#070a14`), Vibrant Rose-Red (`#e11d48`) accents, 0px border-radius, clean thin borders.
- **Animations**: Exclusively transform and opacity for GPU performance; custom spring physics (`cubic-bezier(0.32, 0.72, 0, 1)`).
- **Responsive Design**: Mobile-first fluid collapse; vertical scroll stacks below 768px, no hardcoded heights.
- **Language**: Croatian (`hr`) only, no external localization libraries.

---

### Task 1: Design System Foundation

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx:1-24, 76-83`

**Interfaces:**
- Consumes: Tailwind v4 config, next/font/google
- Produces: CSS custom properties for color system, font families, double-bezel helper classes, and spring transitions.

- [ ] **Step 1: Write/Update unit test for typography config**
  Create/verify a test to ensure fonts are loaded correctly in layout.
  Run test: `pnpm test`
  Expected: PASS

- [ ] **Step 2: Load fonts in layout.tsx**
  Add Fontshare's Clash Display CDN link in `globals.css` or load via standard CSS import, and configure JetBrains Mono in `layout.tsx`.
  ```typescript
  // src/app/layout.tsx
  import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
  
  const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-plus-jakarta-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
  });

  const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
    weight: ["400", "700"],
  });
  ```

- [ ] **Step 3: Update globals.css with new design system variables**
  ```css
  /* src/app/globals.css */
  @import url('https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap');

  :root {
    --background: #030408;
    --foreground: #f8fafc;
    --card: #0a0d18;
    --card-foreground: #f8fafc;
    
    --primary: #e11d48;
    --primary-glow: rgba(225, 29, 72, 0.2);
    --primary-ember: rgba(225, 29, 72, 0.05);

    --accent-gold: #d4a853;
    --accent-gold-glow: rgba(212, 168, 83, 0.15);

    --fighter-blue: #3b82f6;
    --fighter-red: #ef4444;
    
    --font-sans: var(--font-plus-jakarta-sans), system-ui, sans-serif;
    --font-display: 'Clash Display', var(--font-space-grotesk), system-ui, sans-serif;
    --font-mono: var(--font-jetbrains-mono), monospace;

    /* Machined Bezels & Shadows */
    --shadow-brutalist: 4px 4px 0px 0px rgba(22, 28, 50, 0.8);
    --shadow-brutalist-hover: 6px 6px 0px 0px #e11d48;
    --ease-out-premium: cubic-bezier(0.32, 0.72, 0, 1);
  }
  
  /* Double bezel system */
  .bezel-outer {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 3px;
    box-shadow: var(--shadow-brutalist);
    transition: all 180ms var(--ease-out-premium);
  }
  .bezel-inner {
    background: var(--card);
    border: 1px solid rgba(255, 255, 255, 0.03);
    position: relative;
  }
  ```

- [ ] **Step 4: Verify styles build correctly**
  Run: `pnpm build`
  Expected: PASS

- [ ] **Step 5: Commit changes**
  ```bash
  git add src/app/globals.css src/app/layout.tsx
  git commit -m "design: establish font tokens, color system, and double-bezel utilities"
  ```

---

### Task 2: Floating Island Navigation & Shell

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/MobileBottomNav.tsx`
- Modify: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `@/components/ui/Magnetic`, Framer Motion spring config
- Produces: Floating header design, full-screen staggered mobile menu, responsive footer with double-bezel cards.

- [ ] **Step 1: Re-design Header.tsx to use Floating Island structure**
  Make the header floating with `max-w-6xl mx-auto mt-4 px-4` instead of full-width, apply `.bezel-outer` and `.bezel-inner`. Add backdrop blur and scale down on scroll.
  Configure mobile menu takeover with Framer Motion entry reveals for links.
  ```typescript
  // src/components/layout/Header.tsx
  // Floating pill layout instead of sticky top bar
  <header className="fixed top-4 left-4 right-4 z-50 transition-premium">
    <div className="bezel-outer max-w-7xl mx-auto">
      <div className="bezel-inner flex h-14 items-center justify-between px-6 bg-card/90 backdrop-blur-md">
        {/* Navigation Logo & Links */}
      </div>
    </div>
  </header>
  ```

- [ ] **Step 2: Re-design MobileBottomNav.tsx**
  Change the mobile bottom nav into a floating glass pill centered at the bottom of the screen.
  ```typescript
  // src/components/layout/MobileBottomNav.tsx
  <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-card/85 backdrop-blur-lg border border-white/10 rounded-full px-6 py-2 shadow-lg flex gap-8 items-center md:hidden">
    {/* Nav items */}
  </div>
  ```

- [ ] **Step 3: Update Footer.tsx with double-bezel container**
  Apply outer bezel to the newsletter subscription container inside the footer.

- [ ] **Step 4: Verify navigation renders and interactive animations work**
  Run: `pnpm dev` and check navigation overlays.
  Expected: Links click, mobile menu slides up cleanly with staggered items.

- [ ] **Step 5: Commit changes**
  ```bash
  git add src/components/layout/Header.tsx src/components/layout/MobileBottomNav.tsx src/components/layout/Footer.tsx
  git commit -m "design: implement floating island navigation and mobile nav pill"
  ```

---

### Task 3: Cinematic Homepage & Bento Layout

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/article/HeroArticle.tsx`
- Modify: `src/components/article/ArticleCard.tsx`
- Modify: `src/components/layout/Sidebar.tsx`

**Interfaces:**
- Consumes: `getPostListing`, `Sidebar`, `ArticleCard`
- Produces: Asymmetric Bento Grid home layout, parallax hero headers, and double-bezel interactive card overlays.

- [ ] **Step 1: Redesign HeroArticle.tsx**
  Give the hero article full-bleed scaling, Clash Display typography, and double-bezel outer structure. Add a dramatic left accent edge that glows.
  ```typescript
  // src/components/article/HeroArticle.tsx
  <article className="bezel-outer w-full min-h-[500px]">
    <div className="bezel-inner h-full flex flex-col md:grid md:grid-cols-12 border-l-2 border-primary accent-edge-glow">
      {/* Content */}
    </div>
  </article>
  ```

- [ ] **Step 2: Redesign ArticleCard.tsx**
  Implement the double-bezel container. Modify the hover transition to translate, zoom, and glow the border.
  ```typescript
  // src/components/article/ArticleCard.tsx
  <article className="bezel-outer hover:translate-y-[-3px] hover:shadow-brutalist-hover group">
    <div className="bezel-inner h-full border-l-2 border-transparent group-hover:border-primary transition-premium">
      {/* Card contents */}
    </div>
  </article>
  ```

- [ ] **Step 3: Implement Bento Grid inside page.tsx**
  Re-arrange list items to use bento sizing:
  ```typescript
  // src/app/page.tsx
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Map through items with index-based grid classes */}
    {listItems.map((post, idx) => (
      <div key={post.id} className={
        idx === 0 ? "md:col-span-2 md:row-span-2" : 
        idx === 3 ? "md:col-span-1 md:row-span-2" : ""
      }>
        <ArticleCard post={post} />
      </div>
    ))}
  </div>
  ```

- [ ] **Step 4: Update Sidebar.tsx widget boxes**
  Wrap widgets in `.bezel-outer` and `.bezel-inner` to keep consistency.

- [ ] **Step 5: Verify build**
  Run: `pnpm build`
  Expected: PASS

- [ ] **Step 6: Commit changes**
  ```bash
  git add src/app/page.tsx src/components/article/HeroArticle.tsx src/components/article/ArticleCard.tsx src/components/layout/Sidebar.tsx
  git commit -m "design: implement asymmetric bento grid and double-bezel cards on homepage"
  ```

---

### Task 4: Premium Content Pages & Matchup Presentations

**Files:**
- Modify: `src/app/predikcije/page.tsx`
- Modify: `src/app/borci/page.tsx`
- Modify: `src/components/prediction/PredictionWidget.tsx`
- Modify: `src/app/clanak/[slug]/page.tsx`

**Interfaces:**
- Consumes: Predictions & Fighter data from Prisma database
- Produces: UFC-broadcast styled fighter profile grids, interactive VS matchup screens, and a premium reading layout.

- [ ] **Step 1: Redesign Fighter cards in borci/page.tsx**
  Create broadcast-style fighter display boxes. Name in oversized Clash Display Italic, record in JetBrains Mono. Add color corner strips.
  ```typescript
  // src/app/borci/page.tsx
  // Inner core of fighter card
  <div className="bezel-inner flex flex-col items-center">
    <div className="h-2 bg-fighter-blue w-full" /> {/* Corner strip */}
    {/* Record and Details */}
  </div>
  ```

- [ ] **Step 2: Update PredictionWidget.tsx and Prediction Cards**
  Build a dedicated split-column layout for Fighter A vs Fighter B with confidence score bars and a red/blue split accent design.
  ```typescript
  // src/components/prediction/PredictionWidget.tsx
  <div className="grid grid-cols-12 gap-0 bezel-outer">
    <div className="col-span-5 bg-fighter-blue/10 p-4 text-left border-r border-white/5">Fighter A</div>
    <div className="col-span-2 flex items-center justify-center font-display font-black text-primary bg-background">VS</div>
    <div className="col-span-5 bg-fighter-red/10 p-4 text-right">Fighter B</div>
  </div>
  ```

- [ ] **Step 3: Refine reading page layout (clanak/[slug]/page.tsx)**
  Improve reading elements: add a glowing reading progress bar container at the top of the header, place a clean table of contents box using the bezel styling, and style quotes with the left border glow.

- [ ] **Step 4: Verify and run unit tests**
  Run: `pnpm test`
  Expected: All tests PASS

- [ ] **Step 5: Commit changes**
  ```bash
  git add src/app/predikcije/page.tsx src/app/borci/page.tsx src/components/prediction/PredictionWidget.tsx src/app/clanak/\[slug\]/page.tsx
  git commit -m "design: deliver broadcast-style fighter cards and interactive predictions"
  ```
