# Markdown Documentation Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade project reference files `CLAUDE.md`, `README.md`, and `AGENTS.md` to establish clear developer guides, local setup commands, entity schemas, and agent instruction guidelines.

**Architecture:** We will rewrite `CLAUDE.md` to be an english developer reference sheet, `README.md` to be a detailed, visual Croatian user guide with architecture diagrams, and `AGENTS.md` to support safety constraints for automated helpers.

**Tech Stack:** Markdown.

## Global Constraints
- Target clean builds with zero lint errors and zero warnings.
- Keep tests aligned with vitest configuration.
- Preserve the existing Next.js agents rule block in `AGENTS.md`.

---

### Task 1: CLAUDE.md Visual & Context Upgrade

**Files:**
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: Project scripts and configuration
- Produces: Detailed English developer cheat sheet for commands and styles

- [ ] **Step 1: Overwrite CLAUDE.md with a detailed command reference**

Modify [CLAUDE.md](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/CLAUDE.md):
Overwrite the entire file with:
```markdown
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
```

- [ ] **Step 2: Commit changes**

Run command:
```bash
git add CLAUDE.md
git commit -m "docs: upgrade CLAUDE.md with detailed command cheat sheet"
```

---

### Task 2: README.md Croatian Visual & Technical Upgrade

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: Database schema, page routes, pre-configured roles
- Produces: Polished Croatian README with architecture map, schema description, and tables

- [ ] **Step 1: Overwrite README.md with visual Croatian documentation**

Modify [README.md](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/README.md):
Overwrite the entire file with:
```markdown
# CombatPortal HR

Hrvatski portal za borilačke sportove (MMA, boks, kickboks) s blogom, predikcijama, profilima boraca i ugrađenim CMS-om.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.0-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-7.8-2d3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?logo=postgresql)

---

## 🏗️ Struktura projekta

```
src/
├── app/                  # Next.js App Router (Rute, Stranice, API)
│   ├── api/              # API rute (sinkronizacija, CMS, pretraga, komentari)
│   ├── borci/            # Javni profili i baza boraca
│   ├── cms/              # CMS administracija i sučelje
│   ├── novosti/          # Domaće i vanjske borilačke novosti
│   ├── predikcije/       # Analize i predikcije borbi
│   └── layout.tsx        # Globalni izgled s 3D ambientom
├── components/           # Reupotrebljive React komponente
│   ├── article/          # Komponente vezane uz članke i komentare
│   ├── cms/              # CMS forme i specifična polja
│   ├── layout/           # Zaglavlje, podnožje, sidebar i ticker
│   └── ui/               # Globalni UI elementi (3D arene, gumbi, badgevi)
└── lib/                  # Biblioteke i pomoćne funkcije
    ├── auth-utils.ts     # Autentifikacija i CMS autorizacija
    ├── prisma.ts         # Prisma klijent baza
    ├── cached-data.ts    # Next.js 16 caching sloj ("use cache")
    └── sync.ts           # Sinkronizacija događaja s UFC kalendarom
```

---

## 🗄️ Baza podataka (Entity Data Model)

Aplikacija koristi PostgreSQL s Prismom. Glavne relacije:
*   **User**: CMS korisnici s ulogama (`ADMIN`, `EDITOR`). Imaju profile i autore su članaka/predikcija.
*   **Post**: Članci koji mogu biti tipa `NEWS`, `BLOG` ili `PREDICTION`. Povezani su s autorom (`User`), kategorijom (`Category`) i tagovima (`Tag`).
*   **Fighter**: Baza boraca s omjerima (npr. "22-6-0") i detaljima.
*   **Event**: UFC i ostali borilački događaji, sinkronizirani iz ICS kalendara. Povezani s dva borca (`Fighter`).
*   **Prediction**: Povezane s postovima tipa `PREDICTION`. Sadrže podatke o borbi, prognoziranom pobjedniku i točnosti prognoze.

---

## 🔑 CMS Uloge i Pristup

CMS sustavu možete pristupiti na ruti `/cms/login`. Predefinirani lokalni računi:

| Korisnički račun (E-mail) | Lozinka | Uloga | Opis |
| :--- | :--- | :--- | :--- |
| `mvukusic67@gmail.com` | `Passwod2026!` | `ADMIN` | Glavni administrator |
| `marko.horvat@combatportal.hr` | `marko1234` | `ADMIN` | Urednik / MMA analitičar |
| `ivan.kovacevic@combatportal.hr` | `ivan1234` | `EDITOR` | Novinar (kreira skice članaka) |

*   **ADMIN**: Može objavljivati članke, brisati komentare, dodavati pretplatnike i sinkronizirati UFC podatke.
*   **EDITOR**: Može pisati i uređivati skice članaka, ali ne može direktno objavljivati na portal (zahtijeva odobrenje admina).

---

## 🚀 Lokalno postavljanje i pokretanje

1.  **Instalacija paketa**:
    ```bash
    pnpm install
    ```
2.  **Okolišne varijable**:
    Kopirajte `.env.example` u `.env` i podesite vezu na bazu podataka:
    ```bash
    DATABASE_URL="postgresql://user:password@localhost:5432/combatportal?sslmode=disable"
    ```
3.  **Priprema baze**:
    Pokrenite migracije i uvezite standardni seed (korisnike i bazu boraca):
    ```bash
    pnpm prisma db push
    pnpm prisma db seed
    ```
4.  **Uvoz stvarnih podataka iz 2026. godine**:
    ```bash
    pnpm tsx prisma/seed-real-data.ts
    ```
5.  **Pokretanje razvojnog poslužitelja**:
    ```bash
    pnpm dev
    ```
    Otvorite [http://localhost:3000](http://localhost:3000) u pregledniku.
```

- [ ] **Step 2: Commit changes**

Run command:
```bash
git add README.md
git commit -m "docs: upgrade README.md with visual layout and database architecture"
```

---

### Task 3: AGENTS.md Agent Rules Upgrade & Verification

**Files:**
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: Agent rules and linter tools
- Produces: Visualized agent instructions, clean build confirmation

- [ ] **Step 1: Append agent guidelines to AGENTS.md**

Modify [AGENTS.md](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/AGENTS.md):
Append agent guidelines under the Next.js block:
```markdown
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Modifications & Safety Guidelines

For all automated agents pair-programming on this repository:

## Code Modification Rules
1.  **Comment Integrity**: Always preserve all existing code comments, docstrings, and JSDoc blocks that are unrelated to your current edit. Do not delete them.
2.  **DRY Utility Enforcement**: Never duplicate logic. If you need string slugification or profile link injection, import them from `src/lib/slugify.ts` and `src/lib/autoLink.ts`.
3.  **Strict Typing**: Always define explicit types in TypeScript files. Avoid the use of `any` types.

## Verification Checklist
Before submitting a pull request or marking any task as complete:
1.  Verify the project compiles by running `pnpm build`.
2.  Ensure Vitest tests pass by running `pnpm test`.
3.  Confirm ESLint linter runs clean with zero warnings or errors by running `pnpm lint`.
```

- [ ] **Step 2: Run build, tests, and linter**

Run commands:
```bash
pnpm lint
pnpm test
pnpm build
```
Expected output: All validation steps pass successfully.

- [ ] **Step 3: Commit and finalize**

Run command:
```bash
git add AGENTS.md
git commit -m "docs: add agent modifications guidelines to AGENTS.md"
```
