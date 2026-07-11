# Kinetic Telemetry Divider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the homepage's typographic section divider into a moving kinetic marquee styled with HUD telemetry lines, coordinate markers, and a layered gradient mask for the live indicator.

**Architecture:** Use CSS animations (`ticker-track` and a new `ticker-track-no-pause` class) to drive a zero-JS scrolling text marquee. Layer absolute grid lines, coordinate tags, and a gradient masking block over the text using standard CSS grid/flex layers.

**Tech Stack:** React, Next.js (App Router), Tailwind CSS.

## Global Constraints
- Do not use emojis in code, markup, or text.
- Maintain full viewport stability and responsive boundaries.
- Keep animation layouts hardware-accelerated (use transform/opacity).
- Ensure all builds pass without compile errors.

---

### Task 1: Extend CSS Marquee styling in Globals CSS

**Files:**
- Modify: `src/app/globals.css:435-442`

**Interfaces:**
- Produces: `.ticker-track-no-pause` CSS utility class which overrides hover pause behaviors.

- [ ] **Step 1: Write the css modification**

Add the `.ticker-track-no-pause` class override to `src/app/globals.css` at the end of the marquee section to prevent the background text from stopping when the user hovers over it.

```css
.ticker-track-no-pause:hover,
.ticker-track-no-pause:focus-within {
  animation-play-state: running !important;
}
```

- [ ] **Step 2: Run verification**

Run: `pnpm build`
Expected: Successful compilation with no errors.

- [ ] **Step 3: Commit changes**

```bash
git add src/app/globals.css
git commit -m "style: add ticker-track-no-pause helper utility"
```

---

### Task 2: Implement Kinetic Telemetry Divider in Page

**Files:**
- Modify: `src/app/page.tsx:101-113`

**Interfaces:**
- Consumes: `.ticker-track-no-pause` from `globals.css`

- [ ] **Step 1: Write the updated Page component layout**

Modify the divider section inside `src/app/page.tsx` to include the HUD crosshair elements, Zagreb GPS coordinates (`45.8153° N, 15.9879° E`), dashed ruler borders, dual-layer live status badge, and the infinite scrolling text track.

Replace lines 101 to 113 with the following code block:

```tsx
      {/* Massive Off-screen Typographic Divider (Kinetic Telemetry HUD) */}
      {!isFiltered && (
        <div className="relative w-screen max-w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden select-none pointer-events-none mb-12 h-24 sm:h-32 md:h-40 flex items-center bg-gradient-to-r from-black via-primary/[0.03] to-black border-y border-dashed border-white/10">
          
          {/* HUD Grid Overlay Marks */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Top-left tick corner */}
            <div className="absolute top-2 left-6 w-3 h-3 border-l border-t border-primary/30" />
            {/* Bottom-right tick corner */}
            <div className="absolute bottom-2 right-6 w-3 h-3 border-r border-b border-primary/30" />
            
            {/* GPS coordinates telemetry */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden sm:flex flex-col text-[8px] font-mono font-black text-slate-500 tracking-wider text-right">
              <span>LOC: ZAGREB, CROATIA</span>
              <span className="text-primary/75">SYS: 45.8153° N, 15.9879° E</span>
              <span>DEV: MATCH_PORTAL_V2</span>
            </div>
          </div>

          {/* Live Status indicator with fading backdrop mask */}
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-black via-black/85 to-transparent flex items-center pl-6 z-20 pointer-events-auto">
            <div className="flex items-center gap-2.5">
              <span className="text-[9px] font-black font-mono tracking-widest text-primary uppercase border border-primary/30 px-2 py-1 bg-primary/5">
                PRIJENOS UŽIVO
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
            </div>
          </div>

          {/* Infinite Marquee Text Loop */}
          <div className="ticker-track ticker-track-no-pause flex gap-8 whitespace-nowrap z-0">
            <h2 className="text-6xl sm:text-8xl md:text-9xl font-black italic tracking-tighter text-slate-800/15 uppercase font-display select-none text-stroke-red text-glow-red leading-none">
              NAJNOVIJE OBJAVE • LATEST FIGHTS • NASLOVNICA • NAJNOVIJE OBJAVE • LATEST FIGHTS • NASLOVNICA
            </h2>
            <h2 className="text-6xl sm:text-8xl md:text-9xl font-black italic tracking-tighter text-slate-800/15 uppercase font-display select-none text-stroke-red text-glow-red leading-none">
              NAJNOVIJE OBJAVE • LATEST FIGHTS • NASLOVNICA • NAJNOVIJE OBJAVE • LATEST FIGHTS • NASLOVNICA
            </h2>
          </div>

        </div>
      )}
```

- [ ] **Step 2: Run build to verify types and compilation**

Run: `pnpm build`
Expected: Successful static page generation and build completion.

- [ ] **Step 3: Run Vitest unit tests**

Run: `pnpm test`
Expected: All tests pass.

- [ ] **Step 4: Commit changes**

```bash
git add src/app/page.tsx
git commit -m "feat: upgrade landing page divider to kinetic telemetry HUD design"
```
