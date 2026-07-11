# Phase 1: "Going Live" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the CombatPortal homepage into a live sports broadcast control room with upgraded 3D arena, broadcast-style UI chrome, page transitions, and premium loading states.

**Architecture:** Extend the existing design system with broadcast tokens (colors, fonts, motion), add React `<ViewTransition>` wrappers for page navigation animations, upgrade the 3D arena's lighting/camera/particles, and restyle loading states with a "signal acquisition" aesthetic. All new components are client components under `src/components/ui/` following the existing bezel/brutalist patterns.

**Tech Stack:** Next.js 16 (App Router), React 19 `<ViewTransition>`, Tailwind CSS v4, Three.js, Framer Motion, Barlow Condensed font (via `next/font/google`)

> **Scope note:** The 3D Arena upgrade (volumetric spotlights, camera choreography, enhanced particles) is a 1,319-line component that requires its own focused sub-plan (`Phase 1B`). This plan covers all other Phase 1 deliverables — the broadcast UI chrome, view transitions, loading states, and homepage layout upgrades. GSAP will be added in Phase 1B or Phase 2 when scroll-linked animations are implemented.

## Global Constraints

- Next.js 16.2.10 — check `node_modules/next/dist/docs/` before using any API
- React 19.2.4 — `<ViewTransition>` is available via React, enabled by `experimental.viewTransition` in next.config
- Tailwind CSS v4 — uses `@theme inline {}` block in globals.css for token registration
- TypeScript strict — explicit types required, no `any`
- All existing comments and docstrings must be preserved
- Utility logic imports from `src/lib/slugify.ts` and `src/lib/autoLink.ts` — never duplicate
- Verification: `pnpm build`, `pnpm test`, `pnpm lint` must all pass

---

### Task 1: Design System — Broadcast Tokens & Font

**Files:**
- Modify: `src/app/globals.css:1-136` (add broadcast CSS variables and Tailwind theme tokens)
- Modify: `src/app/layout.tsx:1-24` (add Barlow Condensed font import)
- Modify: `src/lib/motion.ts` (add broadcast motion presets)
- Test: `src/app/layout.test.ts` (existing — verify still passes)

**Interfaces:**
- Produces: CSS variables `--broadcast-cyan`, `--broadcast-amber`, `--broadcast-emerald`, `--signal-white` available globally; Tailwind classes `text-broadcast-cyan`, `bg-broadcast-amber`, etc.; CSS variable `--font-condensed`; motion exports `springBroadcast`, `springCountdown`

- [ ] **Step 1: Add broadcast CSS variables to `:root` block**

In `src/app/globals.css`, after line 34 (`--fighter-red: #ef4444;`), add the broadcast color tokens:

```css
  /* Broadcast Control Room palette */
  --broadcast-cyan: #06b6d4;
  --broadcast-cyan-glow: rgba(6, 182, 212, 0.2);
  --broadcast-amber: #f59e0b;
  --broadcast-amber-glow: rgba(245, 158, 11, 0.2);
  --broadcast-emerald: #10b981;
  --broadcast-emerald-glow: rgba(16, 185, 129, 0.2);
  --signal-white: #e2e8f0;
```

- [ ] **Step 2: Register broadcast tokens in `@theme inline` block**

In `src/app/globals.css`, inside the `@theme inline {}` block (after line 116, `--color-fighter-red`), add:

```css
  --color-broadcast-cyan: var(--broadcast-cyan);
  --color-broadcast-cyan-glow: var(--broadcast-cyan-glow);
  --color-broadcast-amber: var(--broadcast-amber);
  --color-broadcast-amber-glow: var(--broadcast-amber-glow);
  --color-broadcast-emerald: var(--broadcast-emerald);
  --color-broadcast-emerald-glow: var(--broadcast-emerald-glow);
  --color-signal-white: var(--signal-white);
```

- [ ] **Step 3: Add Barlow Condensed font to layout.tsx**

In `src/app/layout.tsx`, after the `JetBrains_Mono` import (line 3), add `Barlow_Condensed`:

```tsx
import { Plus_Jakarta_Sans, JetBrains_Mono, Barlow_Condensed } from "next/font/google";
```

After the `jetbrainsMono` constant (line 23), add:

```tsx
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["700", "900"],
});
```

In the `<html>` tag's className (line 79), add the new variable:

```tsx
className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} ${barlowCondensed.variable} h-full antialiased dark`}
```

- [ ] **Step 4: Register condensed font in CSS**

In `src/app/globals.css`, after `--font-mono` (line 38), add:

```css
  --font-condensed: var(--font-barlow-condensed), 'Barlow Condensed', system-ui, sans-serif;
```

In the `@theme inline` block (after `--font-mono`, line 129), add:

```css
  --font-condensed: var(--font-condensed);
```

- [ ] **Step 5: Add broadcast motion presets to motion.ts**

In `src/lib/motion.ts`, append after line 11:

```typescript
export const springBroadcast = { type: "spring" as const, stiffness: 400, damping: 35 };
export const springCountdown = { type: "spring" as const, stiffness: 500, damping: 25 };

export const broadcastTransition = {
  entrance: 0.35,
  wipe: 0.4,
  flash: 0.08,
  statReveal: 0.6,
} as const;
```

- [ ] **Step 6: Add broadcast CSS utility classes to globals.css**

At the end of `src/app/globals.css`, append:

```css
/* ── Broadcast Control Room utilities ── */
.font-condensed {
  font-family: var(--font-condensed);
}

.broadcast-glow-cyan {
  box-shadow: 0 0 12px var(--broadcast-cyan-glow), inset 0 0 6px var(--broadcast-cyan-glow);
}

.broadcast-glow-amber {
  box-shadow: 0 0 12px var(--broadcast-amber-glow), inset 0 0 6px var(--broadcast-amber-glow);
}

@keyframes broadcast-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.animate-broadcast-pulse {
  animation: broadcast-pulse 2s ease-in-out infinite;
}

@keyframes signal-sweep {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.animate-signal-sweep {
  animation: signal-sweep 1.5s ease-in-out;
}
```

- [ ] **Step 7: Run tests to verify nothing is broken**

Run: `pnpm build`
Expected: Successful build with no errors

Run: `pnpm test`
Expected: All existing tests pass

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/lib/motion.ts
git commit -m "feat: add broadcast control room design tokens, Barlow Condensed font, and motion presets"
```

---

### Task 2: BroadcastBadge Component

**Files:**
- Create: `src/components/ui/BroadcastBadge.tsx`
- Test: `src/components/ui/BroadcastBadge.test.tsx`

**Interfaces:**
- Consumes: CSS variables from Task 1 (`--broadcast-cyan`, `--broadcast-amber`, etc.)
- Produces: `<BroadcastBadge variant="live" | "breaking" | "replay" | "poll-active" | "fight-week" />` component

- [ ] **Step 1: Write failing test**

Create `src/components/ui/BroadcastBadge.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BroadcastBadge } from "./BroadcastBadge";

describe("BroadcastBadge", () => {
  it("renders LIVE badge with correct text", () => {
    render(<BroadcastBadge variant="live" />);
    expect(screen.getByText("LIVE")).toBeDefined();
  });

  it("renders BREAKING badge with correct text", () => {
    render(<BroadcastBadge variant="breaking" />);
    expect(screen.getByText("BREAKING")).toBeDefined();
  });

  it("renders custom label when provided", () => {
    render(<BroadcastBadge variant="live" label="UŽIVO" />);
    expect(screen.getByText("UŽIVO")).toBeDefined();
  });

  it("applies pulse class for live variant", () => {
    const { container } = render(<BroadcastBadge variant="live" />);
    const badge = container.firstElementChild;
    expect(badge?.className).toContain("animate-broadcast-pulse");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/ui/BroadcastBadge.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement the component**

Create `src/components/ui/BroadcastBadge.tsx`:

```tsx
import React from "react";

type BroadcastVariant = "live" | "breaking" | "replay" | "poll-active" | "fight-week";

interface BroadcastBadgeProps {
  variant: BroadcastVariant;
  label?: string;
  className?: string;
}

const VARIANT_CONFIG: Record<BroadcastVariant, {
  defaultLabel: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  glowClass: string;
  pulse: boolean;
}> = {
  live: {
    defaultLabel: "LIVE",
    bgClass: "bg-primary/15",
    textClass: "text-primary",
    borderClass: "border-primary/40",
    glowClass: "shadow-[0_0_10px_rgba(225,29,72,0.4)]",
    pulse: true,
  },
  breaking: {
    defaultLabel: "BREAKING",
    bgClass: "bg-broadcast-amber/15",
    textClass: "text-broadcast-amber",
    borderClass: "border-broadcast-amber/40",
    glowClass: "broadcast-glow-amber",
    pulse: true,
  },
  replay: {
    defaultLabel: "REPLAY",
    bgClass: "bg-white/5",
    textClass: "text-slate-400",
    borderClass: "border-white/10",
    glowClass: "",
    pulse: false,
  },
  "poll-active": {
    defaultLabel: "POLL ACTIVE",
    bgClass: "bg-broadcast-cyan/15",
    textClass: "text-broadcast-cyan",
    borderClass: "border-broadcast-cyan/40",
    glowClass: "broadcast-glow-cyan",
    pulse: true,
  },
  "fight-week": {
    defaultLabel: "FIGHT WEEK",
    bgClass: "bg-primary/20",
    textClass: "text-primary",
    borderClass: "border-primary/50",
    glowClass: "shadow-[0_0_14px_rgba(225,29,72,0.5)]",
    pulse: true,
  },
};

export const BroadcastBadge: React.FC<BroadcastBadgeProps> = ({
  variant,
  label,
  className = "",
}) => {
  const config = VARIANT_CONFIG[variant];
  const displayLabel = label || config.defaultLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black font-condensed tracking-[0.2em] uppercase border ${config.bgClass} ${config.textClass} ${config.borderClass} ${config.glowClass} ${config.pulse ? "animate-broadcast-pulse" : ""} select-none ${className}`}
    >
      {config.pulse && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {displayLabel}
    </span>
  );
};

export default BroadcastBadge;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/ui/BroadcastBadge.test.tsx`
Expected: PASS — all 4 tests pass

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/BroadcastBadge.tsx src/components/ui/BroadcastBadge.test.tsx
git commit -m "feat: add BroadcastBadge component with live/breaking/replay/poll-active/fight-week variants"
```

---

### Task 3: StatReveal Counter Component

**Files:**
- Create: `src/components/ui/StatReveal.tsx`
- Test: `src/components/ui/StatReveal.test.tsx`

**Interfaces:**
- Consumes: Motion presets from `src/lib/motion.ts` (`broadcastTransition.statReveal`)
- Produces: `<StatReveal value={number} suffix?: string prefix?: string />` — animated counter that counts up from 0 when scrolled into view

- [ ] **Step 1: Write failing test**

Create `src/components/ui/StatReveal.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatReveal } from "./StatReveal";

describe("StatReveal", () => {
  it("renders the target value as text content", () => {
    render(<StatReveal value={42} />);
    // The component should show the final value in a span for SSR/accessibility
    expect(screen.getByText("42")).toBeDefined();
  });

  it("renders with prefix and suffix", () => {
    render(<StatReveal value={95} prefix="W:" suffix="%" />);
    expect(screen.getByText("W:")).toBeDefined();
    expect(screen.getByText("%")).toBeDefined();
  });

  it("has aria-label with the full value", () => {
    render(<StatReveal value={27} label="Wins" />);
    const el = screen.getByLabelText("Wins: 27");
    expect(el).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/ui/StatReveal.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement the component**

Create `src/components/ui/StatReveal.tsx`:

```tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

interface StatRevealProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  duration?: number;
  className?: string;
}

export const StatReveal: React.FC<StatRevealProps> = ({
  value,
  prefix,
  suffix,
  label,
  duration = 600,
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          if (prefersReduced) {
            setDisplayValue(value);
            return;
          }

          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.round(eased * value));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  const ariaLabel = label ? `${label}: ${value}` : undefined;

  return (
    <span
      ref={ref}
      className={`inline-flex items-baseline gap-0.5 font-condensed font-black tabular-nums ${className}`}
      aria-label={ariaLabel}
      role={label ? "img" : undefined}
    >
      {prefix && <span className="text-[0.6em] opacity-70">{prefix}</span>}
      <span>{hasAnimated ? displayValue : value}</span>
      {suffix && <span className="text-[0.6em] opacity-70">{suffix}</span>}
    </span>
  );
};

export default StatReveal;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/ui/StatReveal.test.tsx`
Expected: PASS — all 3 tests pass

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/StatReveal.tsx src/components/ui/StatReveal.test.tsx
git commit -m "feat: add StatReveal animated counter component with IntersectionObserver"
```

---

### Task 4: CountdownTimer Component

**Files:**
- Create: `src/components/ui/CountdownTimer.tsx`
- Test: `src/components/ui/CountdownTimer.test.tsx`

**Interfaces:**
- Consumes: CSS variables from Task 1; `BroadcastBadge` from Task 2
- Produces: `<CountdownTimer targetDate={string} urgency?: "normal" | "approaching" | "fight-week" />` — live ticking countdown

- [ ] **Step 1: Write failing test**

Create `src/components/ui/CountdownTimer.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CountdownTimer } from "./CountdownTimer";

describe("CountdownTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-11T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders countdown segments", () => {
    render(<CountdownTimer targetDate="2026-07-18T12:00:00Z" />);
    // Should show days, hours, minutes, seconds labels
    expect(screen.getByText("DANA")).toBeDefined();
    expect(screen.getByText("SATI")).toBeDefined();
    expect(screen.getByText("MIN")).toBeDefined();
    expect(screen.getByText("SEK")).toBeDefined();
  });

  it("renders correct day count for a 7-day countdown", () => {
    render(<CountdownTimer targetDate="2026-07-18T12:00:00Z" />);
    expect(screen.getByText("07")).toBeDefined();
  });

  it("renders 'ZAVRŠENO' when target date is in the past", () => {
    render(<CountdownTimer targetDate="2026-07-01T12:00:00Z" />);
    expect(screen.getByText("ZAVRŠENO")).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/ui/CountdownTimer.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement the component**

Create `src/components/ui/CountdownTimer.tsx`:

```tsx
"use client";

import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
  urgency?: "normal" | "approaching" | "fight-week";
  compact?: boolean;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: string): TimeLeft | null {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const URGENCY_STYLES: Record<string, string> = {
  normal: "border-white/10",
  approaching: "border-broadcast-amber/40 broadcast-glow-amber",
  "fight-week": "border-primary/50 shadow-[0_0_14px_rgba(225,29,72,0.4)]",
};

const pad = (n: number): string => n.toString().padStart(2, "0");

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  urgency = "normal",
  compact = false,
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calcTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 text-[9px] font-black font-condensed tracking-[0.15em] uppercase text-slate-500 border border-white/10 bg-white/5 ${className}`}
      >
        ZAVRŠENO
      </span>
    );
  }

  const segments: { value: string; label: string }[] = [
    { value: pad(timeLeft.days), label: "DANA" },
    { value: pad(timeLeft.hours), label: "SATI" },
    { value: pad(timeLeft.minutes), label: "MIN" },
    { value: pad(timeLeft.seconds), label: "SEK" },
  ];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold tracking-wider tabular-nums ${className}`}
      >
        {pad(timeLeft.days)}d {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 border ${URGENCY_STYLES[urgency]} bg-black/60 p-1 ${className}`}
      aria-label={`Odbrojavanje: ${timeLeft.days} dana, ${timeLeft.hours} sati, ${timeLeft.minutes} minuta`}
    >
      {segments.map((seg, i) => (
        <React.Fragment key={seg.label}>
          <div className="flex flex-col items-center px-1.5 py-0.5 min-w-[28px]">
            <span className="font-condensed font-black text-sm leading-none tabular-nums text-signal-white">
              {seg.value}
            </span>
            <span className="text-[7px] font-mono font-bold text-slate-500 tracking-wider mt-0.5">
              {seg.label}
            </span>
          </div>
          {i < segments.length - 1 && (
            <span className="text-primary/40 font-black text-[10px] self-start mt-0.5" aria-hidden="true">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CountdownTimer;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/ui/CountdownTimer.test.tsx`
Expected: PASS — all 3 tests pass

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/CountdownTimer.tsx src/components/ui/CountdownTimer.test.tsx
git commit -m "feat: add CountdownTimer component with urgency tiers and compact mode"
```

---

### Task 5: BroadcastStrip — On-Air Status Bar

**Files:**
- Create: `src/components/ui/BroadcastStrip.tsx`
- Modify: `src/app/layout.tsx:104-110` (insert BroadcastStrip above Header)

**Interfaces:**
- Consumes: `BroadcastBadge` from Task 2; `CountdownTimer` from Task 4; CSS variables from Task 1
- Produces: `<BroadcastStrip />` — thin "on-air" bar at the very top of the page

- [ ] **Step 1: Create the BroadcastStrip component**

Create `src/components/ui/BroadcastStrip.tsx`:

```tsx
"use client";

import React, { useState, useEffect } from "react";
import BroadcastBadge from "./BroadcastBadge";

export const BroadcastStrip: React.FC = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("hr-HR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const dateStr = new Date().toLocaleDateString("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-7 bg-black/95 border-b border-white/5 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 select-none">
      {/* Left: On-Air indicator */}
      <div className="flex items-center gap-3">
        <BroadcastBadge variant="live" label="ON AIR" className="text-[7px] px-1.5 py-0.5" />
        <span className="hidden sm:inline text-[8px] font-mono font-bold text-slate-600 tracking-wider">
          SIGNAL: STABLE
        </span>
      </div>

      {/* Center: Network name */}
      <span className="text-[8px] font-condensed font-black tracking-[0.25em] text-slate-500 uppercase hidden md:inline">
        COMBATPORTAL NETWORK
      </span>

      {/* Right: Date + Time */}
      <div className="flex items-center gap-3">
        <span className="text-[8px] font-mono font-bold text-slate-600 tracking-wider hidden sm:inline">
          {dateStr}
        </span>
        <span className="h-3 w-px bg-white/10 hidden sm:inline" aria-hidden="true" />
        <span className="text-[9px] font-mono font-black text-broadcast-cyan tabular-nums tracking-wider">
          {time}
        </span>
      </div>
    </div>
  );
};

export default BroadcastStrip;
```

- [ ] **Step 2: Add BroadcastStrip to root layout**

In `src/app/layout.tsx`, import the component (after the existing imports, around line 11):

```tsx
import BroadcastStrip from "@/components/ui/BroadcastStrip";
```

Inside the `<div className="relative z-10 flex flex-col min-h-screen pt-24 md:pt-36">` (line 104), replace the opening to add the strip and adjust padding for the new 28px bar:

Replace:
```tsx
        <div className="relative z-10 flex flex-col min-h-screen pt-24 md:pt-36">
```

With:
```tsx
        <BroadcastStrip />
        <div className="relative z-10 flex flex-col min-h-screen pt-[calc(1.75rem+6rem)] md:pt-[calc(1.75rem+9rem)]">
```

This adds `1.75rem` (28px, the strip height) to the existing `6rem` / `9rem` padding.

- [ ] **Step 3: Verify build**

Run: `pnpm build`
Expected: Successful build

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/BroadcastStrip.tsx src/app/layout.tsx
git commit -m "feat: add BroadcastStrip on-air status bar to root layout"
```

---

### Task 6: View Transitions — "Camera Cut" Page Transitions

**Files:**
- Modify: `next.config.ts:3-7` (enable `experimental.viewTransition`)
- Modify: `src/app/globals.css` (add view transition CSS animations)
- Modify: `src/app/layout.tsx` (wrap content in `<ViewTransition>`, anchor header)
- Modify: `src/components/layout/Header.tsx:101` (add `viewTransitionName` to header)

**Interfaces:**
- Consumes: Next.js 16 `<ViewTransition>` from React; CSS animations
- Produces: Automatic page transition animations on every navigation

- [ ] **Step 1: Enable viewTransition in next.config.ts**

In `next.config.ts`, add `viewTransition: true` to the `experimental` object:

```typescript
  experimental: {
    viewTransition: true,
    optimizePackageImports: ["lucide-react"],
  },
```

- [ ] **Step 2: Add view transition CSS animations to globals.css**

At the end of `src/app/globals.css`, append:

```css
/* ── View Transitions: Broadcast Camera Cuts ── */
:root {
  --vt-duration-exit: 150ms;
  --vt-duration-enter: 250ms;
}

/* Anchor the header during transitions */
::view-transition-group(site-header) {
  animation: none;
}

/* Forward navigation: content slides left */
::view-transition-old(.nav-forward) {
  --slide-offset: -60px;
  animation:
    var(--vt-duration-exit) ease-in both vt-fade reverse,
    400ms ease-in-out both vt-slide reverse;
}
::view-transition-new(.nav-forward) {
  --slide-offset: 60px;
  animation:
    var(--vt-duration-enter) ease-out var(--vt-duration-exit) both vt-fade,
    400ms ease-in-out both vt-slide;
}

/* Back navigation: content slides right */
::view-transition-old(.nav-back) {
  --slide-offset: 60px;
  animation:
    var(--vt-duration-exit) ease-in both vt-fade reverse,
    400ms ease-in-out both vt-slide reverse;
}
::view-transition-new(.nav-back) {
  --slide-offset: -60px;
  animation:
    var(--vt-duration-enter) ease-out var(--vt-duration-exit) both vt-fade,
    400ms ease-in-out both vt-slide;
}

/* Default crossfade for untyped transitions */
::view-transition-old(.broadcast-crossfade) {
  animation: var(--vt-duration-exit) ease-in both vt-fade reverse;
}
::view-transition-new(.broadcast-crossfade) {
  animation: var(--vt-duration-enter) ease-out var(--vt-duration-exit) both vt-fade;
}

@keyframes vt-fade {
  from {
    filter: blur(2px);
    opacity: 0;
  }
  to {
    filter: blur(0);
    opacity: 1;
  }
}

@keyframes vt-slide {
  from {
    translate: var(--slide-offset);
  }
  to {
    translate: 0;
  }
}

/* Suppress view transitions when user prefers reduced motion */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

- [ ] **Step 3: Wrap layout content in ViewTransition**

In `src/app/layout.tsx`, add the import at the top:

```tsx
import { ViewTransition } from "react";
```

Wrap the `<main>` element with a `<ViewTransition>`:

Replace:
```tsx
          <main id="main-content" className="flex-1">
            {children}
          </main>
```

With:
```tsx
          <main id="main-content" className="flex-1">
            <ViewTransition
              enter={{
                "nav-forward": "nav-forward",
                "nav-back": "nav-back",
                default: "broadcast-crossfade",
              }}
              exit={{
                "nav-forward": "nav-forward",
                "nav-back": "nav-back",
                default: "broadcast-crossfade",
              }}
            >
              {children}
            </ViewTransition>
          </main>
```

- [ ] **Step 4: Anchor the header during transitions**

In `src/components/layout/Header.tsx`, on the `<motion.header>` element (line 101-103), add the inline style:

Replace:
```tsx
      <motion.header
        className="fixed top-4 left-4 right-4 z-50 pointer-events-none"
      >
```

With:
```tsx
      <motion.header
        className="fixed top-4 left-4 right-4 z-50 pointer-events-none"
        style={{ viewTransitionName: "site-header" }}
      >
```

- [ ] **Step 5: Verify build**

Run: `pnpm build`
Expected: Successful build

Run: `pnpm test`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add next.config.ts src/app/globals.css src/app/layout.tsx src/components/layout/Header.tsx
git commit -m "feat: add View Transitions with broadcast camera-cut animations"
```

---

### Task 7: Loading States — "Signal Acquisition" Upgrade

**Files:**
- Modify: `src/app/loading.tsx` (restyle with broadcast signal acquisition effect)
- Modify: `src/app/globals.css` (add signal acquisition keyframes)
- Modify: `src/components/ui/SkeletonCard.tsx` (use broadcast cyan shimmer)

**Interfaces:**
- Consumes: CSS variables from Task 1 (`--broadcast-cyan`), broadcast keyframes
- Produces: Upgraded loading states with broadcast aesthetic

- [ ] **Step 1: Add signal acquisition CSS keyframes to globals.css**

At the end of `src/app/globals.css`, append:

```css
/* ── Signal Acquisition Loading ── */
@keyframes signal-acquire {
  0% {
    opacity: 0;
    border-color: transparent;
    transform: translateY(4px);
  }
  30% {
    opacity: 0.4;
    border-color: var(--broadcast-cyan);
  }
  100% {
    opacity: 1;
    border-color: var(--border);
    transform: translateY(0);
  }
}

.skeleton-broadcast {
  background: linear-gradient(
    90deg,
    rgba(6, 182, 212, 0.02) 25%,
    rgba(6, 182, 212, 0.08) 50%,
    rgba(6, 182, 212, 0.02) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
  border: 1px solid var(--broadcast-cyan);
  border-opacity: 0.15;
}

.signal-acquire {
  animation: signal-acquire 0.6s ease-out both;
}
```

- [ ] **Step 2: Update SkeletonCard to use broadcast shimmer**

In `src/components/ui/SkeletonCard.tsx`, replace all occurrences of `skeleton-shimmer` with `skeleton-broadcast` in both `SkeletonCard` and `SkeletonHero` components. This is a simple find-and-replace within the file.

- [ ] **Step 3: Update loading.tsx with broadcast signal acquisition**

In `src/app/loading.tsx`, replace the outer wrapping div (line 65-70) to add a broadcast status indicator:

Replace:
```tsx
    <div
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12"
      aria-busy="true"
      aria-live="polite"
      aria-label="Učitavanje sadržaja"
    >
```

With:
```tsx
    <div
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12"
      aria-busy="true"
      aria-live="polite"
      aria-label="Učitavanje sadržaja"
    >
      {/* Broadcast signal acquisition indicator */}
      <div className="flex items-center justify-center gap-3 py-2">
        <div className="flex gap-1" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1.5 bg-broadcast-cyan/60"
              style={{
                height: `${8 + i * 3}px`,
                animation: `broadcast-pulse 1.5s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
        <span className="text-[9px] font-mono font-bold text-broadcast-cyan tracking-widest uppercase animate-broadcast-pulse">
          ACQUIRING SIGNAL...
        </span>
      </div>
```

Also update the `skeleton-shimmer` references in this file's `SkeletonCard` component to `skeleton-broadcast`.

- [ ] **Step 4: Verify build**

Run: `pnpm build`
Expected: Successful build

Run: `pnpm test`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/app/loading.tsx src/app/globals.css src/components/ui/SkeletonCard.tsx
git commit -m "feat: upgrade loading states with broadcast signal acquisition aesthetic"
```

---

### Task 8: Homepage Broadcast Control Bar & Channel Labels

**Files:**
- Modify: `src/app/page.tsx:77-144` (add broadcast control bar, channel labels, enhanced marquee)
- Modify: `src/components/layout/Sidebar.tsx:105-116` (add "POLL ACTIVE" badge to Glas Naroda)

**Interfaces:**
- Consumes: `BroadcastBadge` from Task 2; `CountdownTimer` from Task 4; CSS from Task 1
- Produces: Upgraded homepage with broadcast chrome elements

- [ ] **Step 1: Add broadcast control bar above 3D arena on homepage**

In `src/app/page.tsx`, add the import for `CountdownTimer` and `BroadcastBadge`:

```tsx
import CountdownTimer from "@/components/ui/CountdownTimer";
import BroadcastBadge from "@/components/ui/BroadcastBadge";
```

Before the `<CombatArena3D>` wrapper (line 80), insert the broadcast control bar:

```tsx
      {!isFiltered && currentPage === 1 && (
        <>
          {/* Broadcast Control Bar */}
          <div className="flex items-center justify-between px-4 py-2 mb-2 border border-white/5 bg-black/80 backdrop-blur-sm select-none">
            <div className="flex items-center gap-3">
              <BroadcastBadge variant="live" label="UŽIVO" className="text-[7px]" />
              <span className="text-[8px] font-mono font-bold text-slate-600 tracking-wider hidden sm:inline">
                ZAGREB, CROATIA
              </span>
            </div>
            {upcomingEvents.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-condensed font-black text-slate-500 tracking-widest uppercase hidden md:inline">
                  NEXT EVENT:
                </span>
                <CountdownTimer
                  targetDate={upcomingEvents[0].date}
                  compact
                  className="text-broadcast-cyan"
                />
              </div>
            )}
          </div>

          <ScrollAnimationWrapper className="mb-12">
            <CombatArena3D upcomingEvents={upcomingEvents} />
          </ScrollAnimationWrapper>
        </>
      )}
```

Remove the existing `<ScrollAnimationWrapper className="mb-12">` block wrapping `<CombatArena3D>` (lines 80-83) since it's now included above.

- [ ] **Step 2: Add broadcast "channel" label to the articles section**

In `src/app/page.tsx`, before the `<SectionHeading>` component (line 148-154), add a channel label:

```tsx
          <ScrollAnimationWrapper>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[9px] font-condensed font-black text-primary/60 tracking-[0.3em] uppercase">
                CH.01
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <SectionHeading
              title={isFiltered ? "Rezultati pretraživanja" : "Najnovije objave"}
              icon={Flame}
              as={heroPost ? "h2" : "h1"}
            />
          </ScrollAnimationWrapper>
```

- [ ] **Step 3: Add "POLL ACTIVE" badge to Glas Naroda widget in sidebar**

In `src/components/layout/Sidebar.tsx`, add the import:

```tsx
import BroadcastBadge from "@/components/ui/BroadcastBadge";
```

Before the `<GlasNarodaWidget>` component (line 106), add a badge:

Replace:
```tsx
      {activePrediction && (
        <GlasNarodaWidget
```

With:
```tsx
      {activePrediction && (
        <div className="space-y-2">
          <BroadcastBadge variant="poll-active" className="w-full justify-center" />
          <GlasNarodaWidget
```

And close the new `<div>` after the `<GlasNarodaWidget>` closing (find the corresponding `/>` and add `</div>`):

After:
```tsx
        />
```

Add:
```tsx
        </div>
```

- [ ] **Step 4: Enhance the marquee divider with broadcast accents**

In `src/app/page.tsx`, replace the marquee divider section (lines 102-144). At the top of the divider `<div>`, add a red accent bar:

Before the existing `<div className="relative w-screen..."` marquee div, add:

```tsx
          <div className="w-screen max-w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[3px] bg-primary shadow-[0_0_10px_rgba(225,29,72,0.4)]" />
```

In the marquee live status badge, add a broadcast styling — change the text inside the badge from `PRIJENOS UŽIVO` to use `BroadcastBadge`:

Replace the inner status badge span (line 123-125):
```tsx
              <span className="text-[9px] font-black font-mono tracking-widest text-primary uppercase border border-primary/30 px-2 py-1 bg-primary/5">
                PRIJENOS UŽIVO
              </span>
```

With the import-based badge (add `BroadcastBadge` import if not already added):
```tsx
              <BroadcastBadge variant="live" label="PRIJENOS UŽIVO" className="text-[8px]" />
```

- [ ] **Step 5: Verify build and test**

Run: `pnpm build`
Expected: Successful build

Run: `pnpm test`
Expected: All tests pass

Run: `pnpm lint`
Expected: Zero warnings/errors

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/layout/Sidebar.tsx
git commit -m "feat: add broadcast control bar, channel labels, and POLL ACTIVE badge to homepage"
```

---

### Task 9: Sidebar CountdownTimers for Upcoming Fights

**Files:**
- Modify: `src/components/layout/Sidebar.tsx:124-161` (add countdown timers to fight cards)

**Interfaces:**
- Consumes: `CountdownTimer` from Task 4
- Produces: Each upcoming fight card now shows a live countdown timer

- [ ] **Step 1: Add CountdownTimer import to Sidebar**

In `src/components/layout/Sidebar.tsx`, add the import:

```tsx
import CountdownTimer from "@/components/ui/CountdownTimer";
```

- [ ] **Step 2: Add countdown timer to each fight card**

In `src/components/layout/Sidebar.tsx`, inside the fight card `<div>` (around line 128-160), after the fighter names row (after line 159, before the closing `</div>`), add:

```tsx
                <div className="mt-2.5 pt-2 border-t border-white/5 flex justify-center relative z-10">
                  <CountdownTimer targetDate={fight.date} compact className="text-[9px] text-slate-400" />
                </div>
```

- [ ] **Step 3: Verify build**

Run: `pnpm build`
Expected: Successful build

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Sidebar.tsx
git commit -m "feat: add live countdown timers to sidebar upcoming fight cards"
```

---

### Task 10: Final Verification & Integration Test

**Files:**
- No new files — verification pass only

**Interfaces:**
- Consumes: All Tasks 1-9
- Produces: Verified, clean build ready for deployment

- [ ] **Step 1: Full build verification**

Run: `pnpm build`
Expected: Successful build with no errors or warnings

- [ ] **Step 2: Test suite**

Run: `pnpm test`
Expected: All tests pass (existing + new BroadcastBadge, StatReveal, CountdownTimer tests)

- [ ] **Step 3: Lint check**

Run: `pnpm lint`
Expected: Zero ESLint warnings or errors

- [ ] **Step 4: Visual smoke test**

Start dev server: `pnpm dev`
Manually verify in browser at `http://localhost:3000`:
- [ ] BroadcastStrip visible at top with ticking clock and ON AIR badge
- [ ] Homepage shows broadcast control bar above 3D arena
- [ ] Marquee divider has red accent bar and broadcast badge
- [ ] Channel label (CH.01) visible above article grid
- [ ] Sidebar fight cards show countdown timers
- [ ] Glas Naroda widget has POLL ACTIVE badge
- [ ] Loading states use cyan broadcast shimmer
- [ ] Page transitions animate with crossfade between routes
- [ ] Skeleton cards have broadcast cyan tint

- [ ] **Step 5: Commit any final adjustments**

```bash
git add -A
git commit -m "chore: Phase 1 'Going Live' — broadcast control room foundation complete"
```
