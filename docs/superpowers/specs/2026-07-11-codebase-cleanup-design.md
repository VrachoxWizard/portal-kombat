# 2026-07-11 Codebase Cleanup & Lint Optimization Design

## Goal
Improve codebase readability, folder and file structure, remove unused configuration and default template assets, and resolve ESLint errors/warnings to ensure a clean build and testing state.

## Scope & Proposed Changes

### 1. Structural Cleanup & File Reorganization
*   **Junk File Deletion**:
    *   `curl-output.html` in the root (empty junk file).
    *   `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, and `public/window.svg` (unused Next.js boilerplates).
*   **Test Reorganization**:
    *   Rename `src/app/typography.test.ts` to `src/app/layout.test.ts` to represent the file it actually tests (`src/app/layout.tsx`).
*   **Git Rules Optimization**:
    *   Add `.superpowers/` to `.gitignore`.
    *   Remove `.superpowers/` tracked files from Git index without deleting them locally.

### 2. Configuration & ESLint Improvements
*   **ESLint Configuration**:
    *   Exclude `.agents/**` and `.superpowers/**` folders from being scanned in `eslint.config.mjs` by adding them to `globalIgnores`.
*   **Linter Fixes (Unused variables/imports)**:
    *   `src/components/layout/Header.tsx`: Remove unused imports `duration` and `EASE_OUT`.
    *   `src/app/borci/page.tsx`: Remove unused import `Activity`.
    *   `src/app/api/newsletter/subscribe/route.ts`: Remove or log unused `err`.
    *   `src/app/api/cms/posts/route.ts` & `src/app/api/cms/posts/[id]/route.ts`: Remove unused `isAdmin` variable.
    *   `prisma/seed-real-data.ts`: Remove unused `pereira` variable assignment while preserving the DB create statement.

## Verification
*   Execute `pnpm test` to verify all test suites (including the renamed `layout.test.ts`) pass.
*   Execute `pnpm lint` to ensure no linting warnings or errors remain.
*   Execute `pnpm build` to verify the Next.js production build completes without issues.
