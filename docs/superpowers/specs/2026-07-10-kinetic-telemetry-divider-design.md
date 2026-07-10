# Design Spec: Kinetic Telemetry Divider

This document outlines the design and implementation details for upgrading the homepage typographic divider into a kinetic telemetry HUD element.

## 1. Objectives
- Add continuous, ambient motion to the homepage using a zero-JS CSS marquee.
- Ground the section in a "Command Center" / "Tactile Telemetry" look using grid coordinates, coordinate labels, and crosshairs.
- Ensure the "Live" indicator has high visibility and remains legible by layering a gradient mask underneath it.

## 2. Component Design & Layout

### A. Layout Structure
```
+-------------------------------------------------------------------+
| [Ruler border: border-t border-dashed border-white/10]             |
|                                                                   |
| [Live Badge] >> (slides behind) >> [ Marquee Text Loop -> ]        |
| [Zagreb GPS]                                                      |
|                                                                   |
| [Ruler border: border-b border-dashed border-white/10]             |
+-------------------------------------------------------------------+
```

- **Height**: `h-24 sm:h-32 md:h-40`
- **Background**: Horizontal gradient starting dark black on the edges, fading into a very subtle red tint in the center (`from-black via-primary/5 to-black`).
- **Borders**: Top and bottom borders styled as dashed tactical ruler lines (`border-y border-dashed border-white/10`).

### B. Kinetic Marquee (Zero-JS)
- Uses the existing `.ticker-track` CSS class which triggers the infinite horizontal slide.
- Repeated blocks of: `NAJNOVIJE OBJAVE • LATEST FIGHTS • NASLOVNICA` to guarantee seamless coverage on ultrawide screens.
- Sliding text size: `text-6xl sm:text-8xl md:text-9xl` styled with a thin red stroke and glow effect (`text-stroke-red text-glow-red`).

### C. Telemetry HUD Details
- **GPS Coordinates**: Embedded small text: `[ 45.8153° N, 15.9879° E // ARENA ZAGREB ]` placed on the right or next to the live badge.
- **HUD Grid ticks**: Tiny corner markers `+` and lines (`border-l border-t border-primary/20`) inside the banner to look like a scope or target reticle.

### D. Live Badge Masking
- The live indicator `PRIJENOS UŽIVO` with the pulsing dot is absolute-positioned on the left.
- To prevent text from rendering over it and causing legibility issues, a gradient backdrop `bg-gradient-to-r from-black via-black/80 to-transparent` is layered underneath the badge, causing the moving text to dissolve cleanly as it passes.

## 3. Implementation Plan
1. Create/Modify the typographic divider code in `src/app/page.tsx`.
2. Clean up any styling in `globals.css` if necessary.
3. Test locally and verify the build.
