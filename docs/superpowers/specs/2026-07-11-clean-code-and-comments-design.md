# 2026-07-11 Clean Code & Comments Design Spec

## Goal
Improve codebase maintainability, readability, and documentation by refactoring duplicate logic, adding complete JSDoc annotations, explaining complex logic blocks, and adhering to modern Next.js 16/React 19 conventions.

## Proposed Changes

### Section 1: DRY Refactoring & Utility JSDocs
- **`src/lib/sync.ts`**:
  - Remove duplicate local implementation of `slugify`.
  - Import the centralized, tested, and Croatian-aware `slugify` from `src/lib/slugify.ts`.
  - Add JSDoc headers to all functions (`formatCroatianDate`, `fetchTextHttps`, `syncUfcEvents`).
  - Add detailed inline comments explaining the logic for unfolding ICS lines and parsing `VEVENT` blocks.
- **`src/lib/slugify.ts`**:
  - Document the behavior of the Croatian-aware slugify (mapping diacritics like Đ/Š/Ć/Č/Ž to standard equivalents).
- **`src/lib/autoLink.ts`**:
  - Document the `autoLinkFighters` function.
  - Explain the regex-based AST extraction strategy where code blocks, links, and images are isolated as unique string placeholders to prevent double-linking.

### Section 2: Database & Caching JSDocs
- **`src/lib/cached-data.ts`**:
  - Add JSDoc indicating it is a server-only module.
  - Explain modern Next.js 16 `"use cache"` directive usage, including caching parameters like `cacheLife` and `cacheTag`.
- **`src/lib/posts.ts`** & **`src/lib/predictions.ts`**:
  - Add comprehensive JSDocs detailing database filtering options, pagination returns, and mock data fallback mechanisms.

### Section 3: RSS parser JSDocs
- **`src/lib/externalNews.ts`**:
  - Document RSS feed extraction.
  - Add JSDoc for XML entities decoding helper.
  - Inline comments explaining RSS structure regex match patterns.

## Verification
- Run `pnpm test` to ensure all tests (including `slugify.test.ts` and `layout.test.ts`) continue to pass.
- Run `pnpm lint` to ensure zero ESLint warnings and errors.
- Run `pnpm build` to verify the Next.js production build completes without issues.
