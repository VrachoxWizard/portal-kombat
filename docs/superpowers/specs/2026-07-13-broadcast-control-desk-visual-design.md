# CombatPortal HR — Broadcast Control Desk & Visual Overlay Design Spec

**Date**: 2026-07-13  
**Status**: Approved  
**Approach**: Build a React Theme Context, a floating bottom-right control pod widget, and a global CSS shader/utility layer inside `globals.css` to allow live custom CRT scanline toggles, cyber grids, and glowing corner brackets.

---

## Design Objectives

1. **Interactive Controls**: Users can toggle global visual layers in real-time via a floating dashboard. Toggles persist in `localStorage`.
2. **Scanlines Shaders**: Renders a scrolling, overlay CRT monitor texture that adds retro broadcast grit.
3. **Cyber-Grid Backdrops**: Dynamic digital gridlines in the background that react to mouse coordinates or display glowing ambient patterns.
4. **Bezel Corner Brackets**: Adds high-tech neon orange/gold corner frames around `.bezel-outer` panels, which fade into flat borders when telemetry is turned off.

---

## Proposed Changes

### 1. Global Styles Configuration

#### [MODIFY] [globals.css](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/globals.css)
Add CSS variables and utility classes:
- `.hud-scanlines::after`: Global overlay with repeating linear-gradients and keyframe scroll animations.
- `.hud-grid-neon` & `.hud-grid-dim`: Neon cyan/gold grid backgrounds using background-images with radial masking.
- `.hud-telemetry`: Enhances `.bezel-outer` and `.bezel-inner` to overlay glowing corner brackets using `::before` and `::after` coordinate markers.

---

### 2. Context & Control Desk Component

#### [NEW] [BroadcastThemeContext.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/layout/BroadcastThemeContext.tsx)
A client-side provider storing:
- `scanlines` (boolean)
- `grid` ("neon" | "dim" | "off")
- `telemetry` (boolean)
Injects these values as active classes (`hud-scanlines`, `hud-grid-neon`, etc.) directly on the layout wrapper element.

#### [NEW] [BroadcastConsoleDesk.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/layout/BroadcastConsoleDesk.tsx)
A floating bottom-right collapsible pod.
- **Collapsed**: A pulsing radar circle with `[SYS CONFIG]` tag.
- **Expanded**: Slides out into a terminal tuner console:
  - Toggles for Scanlines (Green / Off).
  - Toggles for Cyber-Grid (Neon / Dim / Off).
  - Toggles for Telemetry Brackets (Orange / Off).
  - Small decorative CSS dials, blinking signals, and coordinate streams.

---

### 3. Layout Integration

#### [MODIFY] [layout.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/layout.tsx)
- Wrap the main application structure inside `<BroadcastThemeProvider>`.
- Render the `<BroadcastConsoleDesk />` floating component next to the viewport bottom.

---

## Verification Plan

### Automated Verification
1. Confirm the app compiles cleanly: `pnpm build`
2. Run linter and tests: `pnpm lint`, `pnpm test`

### Manual Verification
- Open the home page and click the `[SYS CONFIG]` toggle in the bottom right corner.
- Toggle Scanlines: Verify the faint CRT lines appear and start scrolling.
- Toggle Cyber-Grid: Verify the neon/dim cyan grid lines appear in the page background.
- Toggle Telemetry: Verify the glowing brackets appear around the site's main widgets.
- Reload the page and verify all state overrides persist from `localStorage`.
