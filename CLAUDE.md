# CombatPortal HR — Developer Cheat Sheet

Reference guide for commands, configurations, and coding styles.

## CLI Commands

### Local Development & Server
*   Install dependencies: `pnpm install`
*   Start dev server: `pnpm dev`
*   Build production bundle: `pnpm build`
*   Start production server: `pnpm start`

### Testing & Linting
*   Run unit tests (Vitest): `pnpm test`
*   Run linter (ESLint): `pnpm lint`

### Database & Migrations (Prisma)
*   Generate Prisma client: `pnpm prisma generate`
*   Apply pending migrations (Production): `pnpm prisma migrate deploy`
*   Push local schema changes (Development): `pnpm prisma db push`
*   Seed mock database: `pnpm prisma db seed`
*   Import real 2026 fighter and event data: `pnpm tsx prisma/seed-real-data.ts`

## Code Conventions & Standards

### File Structure & Routing (Next.js 16)
*   **App Router**: Place routing layouts, pages, loading states, and route handlers under `src/app/`.
*   **Components**: Store UI and layout components inside `src/components/` (subdivided into `ui`, `layout`, `article`, `prediction`, `cms`, `kontakt`).
*   **Libraries**: Place utility logic, DB clients, and shared helpers in `src/lib/`.
*   **Path Aliases**: Use `@/` to import from the `src/` directory (e.g. `import { prisma } from "@/lib/prisma"`).

### Text Processing & Internationalization
*   This portal operates in the Croatian language (`lang="hr"`).
*   **Slugify**: Always use the central `slugify` helper in `src/lib/slugify.ts` when converting strings to URL slugs. Do NOT duplicate slugify regex logic.
*   **Fighter Links**: Always use `autoLinkFighters` in `src/lib/autoLink.ts` to scan markdown text and inject links to fighter profile pages safely.

### Type Safety
*   Strict TypeScript configuration is enforced. Do not use `any`. Provide explicit parameters and return typings for helper functions.
