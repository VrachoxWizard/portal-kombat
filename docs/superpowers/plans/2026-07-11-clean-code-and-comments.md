# Clean Code & Comments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor duplicate code, document complex matching algorithms, and add rich JSDocs for TypeScript type safety and caching behaviors to improve overall codebase cleanliness and maintainability.

**Architecture:** We will replace the local `slugify` clone in `sync.ts` with the imported central helper, and add module-level and function-level JSDocs outlining parameters, caching logic, and side effects.

**Tech Stack:** Next.js 16, TypeScript, React 19.

## Global Constraints
- Target clean builds with zero lint errors and zero warnings.
- Keep tests aligned with vitest configuration.
- Do not modify database query logic, only improve annotations and comments.

---

### Task 1: DRY Refactoring of `sync.ts` and Utilities JSDocs

**Files:**
- Modify: `src/lib/sync.ts`
- Modify: `src/lib/slugify.ts`
- Modify: `src/lib/autoLink.ts`

**Interfaces:**
- Consumes: `src/lib/slugify.ts` export
- Produces: Import-based `slugify` usage in `sync.ts` with complete JSDoc annotations

- [ ] **Step 1: Refactor sync.ts to import slugify and add JSDocs**

Modify [sync.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/lib/sync.ts):
- Remove `function slugify(text: string): string` block.
- Import `slugify` from `./slugify`.
- Add JSDoc headers for `formatCroatianDate`, `fetchTextHttps`, and `syncUfcEvents`.
- Add inline comments for the unfolding and block split logic.
```typescript
import { prisma } from "./prisma";
import https from "node:https";
import { slugify } from "./slugify";

// Weight class mapping from UFC weights to Croatian category names
const WEIGHT_CLASSES: Record<string, string> = {
  "125": "Muha (Flyweight)",
  "135": "Bantam (Bantamweight)",
  "145": "Pero (Featherweight)",
  "155": "Laka (Lightweight)",
  "170": "Velter (Welterweight)",
  "185": "Srednja (Middleweight)",
  "205": "Poluteška (Light Heavyweight)",
  "265": "Teška (Heavyweight)",
};

/**
 * Formats a JavaScript Date object into a Croatian month-long string format.
 * Example output: "11. srpnja" or "14. studenoga".
 * 
 * @param date The date object to format.
 * @returns The formatted date string in Croatian.
 */
function formatCroatianDate(date: Date): string {
  const day = date.getDate();
  const months = [
    "siječnja",
    "veljače",
    "ožujka",
    "travnja",
    "svibnja",
    "lipnja",
    "srpnja",
    "kolovoza",
    "rujna",
    "listopada",
    "studenoga",
    "prosinca",
  ];
  const monthName = months[date.getMonth()];
  return `${day}. ${monthName}`;
}

// ... remaining file content ...
```

- [ ] **Step 2: Add JSDoc to slugify.ts**

Modify [slugify.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/lib/slugify.ts):
Add JSDoc describing mapping behavior for Croatian characters:
```typescript
/**
 * Converts a string into a URL-friendly slug.
 * Replaces Croatian diacritics (Đ/Š/Ć/Č/Ž) with standard English letters,
 * strips special characters, replaces whitespaces with hyphens, and trims margins.
 * 
 * @param text The input string to convert.
 * @returns The generated slug.
 */
export function slugify(text: string): string {
  // ... existing replacement logic ...
}
```

- [ ] **Step 3: Add JSDocs and comments to autoLink.ts**

Modify [autoLink.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/lib/autoLink.ts):
Add JSDoc explaining regular expression extraction.
```typescript
/**
 * Automatically wraps mentions of fighter names in Markdown link syntax.
 * Performs AST-like isolation of existing links, images, and code blocks
 * to ensure that text inside existing elements is not double-linked or modified.
 * 
 * @param text The markdown text content to process.
 * @param entities An array of fighter entities containing name and slug.
 * @returns The processed markdown text containing fighter links.
 */
export function autoLinkFighters(text: string, entities: AutoLinkEntity[]): string {
  // ... existing code ...
}
```

- [ ] **Step 4: Verify tests and run linter**

Run commands:
```bash
pnpm test
pnpm lint
```
Expected output: All tests pass, and linter remains completely clean.

- [ ] **Step 5: Commit changes**

Run command:
```bash
git add src/lib/sync.ts src/lib/slugify.ts src/lib/autoLink.ts
git commit -m "refactor: apply DRY for slugify, and document core utilities"
```

---

### Task 2: Database and Caching Services JSDocs

**Files:**
- Modify: `src/lib/cached-data.ts`
- Modify: `src/lib/posts.ts`
- Modify: `src/lib/predictions.ts`

**Interfaces:**
- Consumes: Next.js Cache API, Prisma client
- Produces: Well-documented service files

- [ ] **Step 1: Document cached-data.ts caching behavior**

Modify [cached-data.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/lib/cached-data.ts):
Add JSDoc indicating it is a server-only cache module and explaining `"use cache"` directive:
```typescript
/**
 * @module ServerOnly
 * Caching layer for database queries using Next.js 16 `"use cache"` directive.
 * Configures cache tags and expiration times to optimize page load speeds.
 */
import { getPredictionStats } from "@/lib/predictions";
import { cacheLife, cacheTag } from "next/cache";

/**
 * Retrieves cached statistics for fighter predictions.
 * Configured with a 5-minute revalidation time and 1-hour hard expiration.
 * 
 * @param authorId Optional author ID to filter stats.
 * @param year Optional year to filter stats.
 * @returns Prediction stats object.
 */
export async function getCachedPredictionStats(authorId?: string, year?: number) {
  // ...
```

- [ ] **Step 2: Document posts.ts query logic**

Modify [posts.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/lib/posts.ts):
Add JSDocs for database listing and retrieval methods:
```typescript
/**
 * Fetches a single public post matching a given slug.
 * Supports token-signed preview access for drafts.
 * Falls back to mock data if database is offline.
 * 
 * @param slug The unique article URL identifier.
 * @param options Optional parameters containing a preview token.
 * @returns PublicPost object or null if not found.
 */
export async function getPublicPost(
  slug: string,
  options?: { previewToken?: string }
): Promise<PublicPost | null> {
  // ...
```

- [ ] **Step 3: Document predictions.ts queries**

Modify [predictions.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/lib/predictions.ts):
Add JSDoc for prediction stats and predictions list retrieval.
```typescript
/**
 * Calculates correct/incorrect predictions statistics for a given author or year.
 * Aggregates results from database records or fallback mock values.
 * 
 * @param filter Optional author ID and year criteria.
 * @returns An object containing stats count and percentage.
 */
export async function getPredictionStats(filter?: { authorId?: string; year?: number }) {
  // ...
```

- [ ] **Step 4: Commit changes**

Run command:
```bash
git add src/lib/cached-data.ts src/lib/posts.ts src/lib/predictions.ts
git commit -m "docs: add JSDocs for database queries and caching layers"
```

---

### Task 3: Feed Parser Documentation & Final Verification

**Files:**
- Modify: `src/lib/externalNews.ts`

**Interfaces:**
- Consumes: RSS feeds
- Produces: Documented parser and verified build

- [ ] **Step 1: Document externalNews.ts parser**

Modify [externalNews.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/lib/externalNews.ts):
Add JSDoc for XML entity decoding and RSS feed retrieval.
```typescript
/**
 * Fetches external combat sports RSS feeds (MMA Junkie, Boxing News 24).
 * Parses items using regular expressions, extracts imagery from media tags,
 * and normalizes the output into standard ExternalArticle objects.
 * Saves results under server-side caching (revalidated every 5 minutes).
 * 
 * @returns A promise resolving to an array of normalized articles.
 */
export async function fetchExternalNews(): Promise<ExternalArticle[]> {
  // ...
```

- [ ] **Step 2: Run linter and tests**

Run commands:
```bash
pnpm lint
pnpm test
```
Expected output: Zero linter issues, all tests pass.

- [ ] **Step 3: Run production build check**

Run command:
```bash
pnpm build
```
Expected output: Success.

- [ ] **Step 4: Commit and finalize**

Run command:
```bash
git add src/lib/externalNews.ts
git commit -m "docs: document RSS feed parser and finalize clean code task"
```
