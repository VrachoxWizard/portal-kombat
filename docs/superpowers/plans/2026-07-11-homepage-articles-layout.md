# Homepage Articles Layout Seeding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Seed 4 new combat sports articles, 5 new fighters, and 3 new events into the PostgreSQL database using `prisma/seed-real-data.ts` to fill the homepage grid layout.

**Architecture:** Extend the existing Node.js Prisma seeding script (`prisma/seed-real-data.ts`) to programmatically insert the required categories, fighters, events, and posts with real-world 2026 contexts, and execute the seeding command.

**Tech Stack:** Next.js 16, Prisma ORM, PostgreSQL.

## Global Constraints
- Target File: [seed-real-data.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/seed-real-data.ts)
- Total Articles: 7 (1 Hero + 6 grid cards)
- Timeframe: July - September 2026

---

### Task 1: Update Real Data Seeding Script

**Files:**
- Modify: [seed-real-data.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/seed-real-data.ts)

**Interfaces:**
- Produces: Updated schema seeding logic.

- [ ] **Step 1: Update the seeding code in `prisma/seed-real-data.ts`**
  Modify [seed-real-data.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/seed-real-data.ts) to define and seed the 5 new fighters (Anthony Joshua, Kristian Prenga, Filip Hrgović, Moses Itauma, Ivan Vitasović), the `boks` category, the 3 new events, and the 4 new articles.

- [ ] **Step 2: Verify code syntax**
  Compile the seeding script or check for syntax errors.

- [ ] **Step 3: Commit updates**
  ```bash
  git add prisma/seed-real-data.ts
  git commit -m "feat: add additional fighters, events and articles to real-data seed"
  ```

---

### Task 2: Database Seeding & UI Verification

**Files:**
- Modify: None.

- [ ] **Step 1: Execute database seeding**
  Run the real data seed command to reset the database and insert the 7 articles.
  Run: `npx tsx prisma/seed-real-data.ts`
  Expected: Command outputs:
  ```
  Započinjem uvoz stvarnih podataka...
  Baza očišćena od starih podataka.
  Stvarni borci kreirani.
  Stvarni događaji kreirani.
  Provjerene vijesti kreirane.
  Uspješno obavljen uvoz stvarnih podataka!
  ```

- [ ] **Step 2: Start local development server**
  Run: `pnpm dev`
  Expected: Server starts successfully at `http://localhost:3000`.

- [ ] **Step 3: Verify home page article grid**
  Open the browser and load `http://localhost:3000/`.
  Expected:
  - Homepage displays exactly 7 articles (1 large Hero article + 6 grid cards).
  - The grid forms two full rows of 3 columns, and there are no empty columns or layout gaps.
  - Clicking on "Boks" filter shows the 2 new boxing articles.
  - Clicking on "MMA" filter shows the MMA articles.
