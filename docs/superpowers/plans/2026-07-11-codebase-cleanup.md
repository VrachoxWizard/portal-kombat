# Codebase Cleanup & Lint Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the codebase by removing unused files, reorganizing unit tests, updating ESLint and Git ignore rules, and fixing all lint warnings and errors.

**Architecture:** We will surgically delete unused templates, rename and co-locate layout tests, update ESLint configuration to ignore system folders, and resolve all unused imports and variables across the project files.

**Tech Stack:** Next.js 16, TypeScript, ESLint 9, Vitest, Git.

## Global Constraints
- Target clean builds with zero lint errors and zero warnings.
- Keep tests aligned with vitest configuration.
- Do not remove database logic when fixing seed files.

---

### Task 1: Delete Unused and Junk Files

**Files:**
- Delete: `curl-output.html`
- Delete: `public/file.svg`
- Delete: `public/globe.svg`
- Delete: `public/next.svg`
- Delete: `public/vercel.svg`
- Delete: `public/window.svg`

**Interfaces:**
- Consumes: None
- Produces: Clean public and root directories

- [ ] **Step 1: Delete curl-output.html**

Run command in PowerShell:
```powershell
Remove-Item -Path "curl-output.html" -Force
```

- [ ] **Step 2: Delete unused SVGs in the public folder**

Run command in PowerShell:
```powershell
Remove-Item -Path "public/file.svg", "public/globe.svg", "public/next.svg", "public/vercel.svg", "public/window.svg" -Force
```

- [ ] **Step 3: Commit changes**

Run command:
```bash
git add public/
git commit -m "style: remove unused default template assets and junk html file"
```

---

### Task 2: Reorganize Tests, Gitignore, and ESLint Configuration

**Files:**
- Modify: `.gitignore`
- Modify: `eslint.config.mjs`
- Modify: `vitest.config.ts`
- Move: `src/app/typography.test.ts` to `src/app/layout.test.ts`

**Interfaces:**
- Consumes: Test environment and Next.js structure
- Produces: Renamed test file and updated configurations

- [ ] **Step 1: Add .superpowers/ to .gitignore**

Modify [.gitignore](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/.gitignore) to add `.superpowers/` at the end:
```diff
# local credentials
cms-pristup.txt
deployment-setup.txt
+.superpowers/
```

- [ ] **Step 2: Untrack existing .superpowers files**

Run command:
```bash
git rm -r --cached .superpowers
```
Expected output: Removing files in `.superpowers/...` from the Git index.

- [ ] **Step 3: Exclude .agents/ and .superpowers/ in ESLint**

Modify [eslint.config.mjs](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/eslint.config.mjs):
```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".agents/**",
    ".superpowers/**",
  ]),
]);

export default eslintConfig;
```

- [ ] **Step 4: Move typography test to layout test**

Run command:
```powershell
Move-Item -Path "src/app/typography.test.ts" -Destination "src/app/layout.test.ts" -Force
```

- [ ] **Step 5: Verify tests still pass**

Run command:
```bash
pnpm test
```
Expected output: All unit tests pass, including layout.test.ts.

- [ ] **Step 6: Commit changes**

Run command:
```bash
git add .gitignore eslint.config.mjs src/app/layout.test.ts
git commit -m "config: ignore agent folders in ESLint/Git, and rename typography.test.ts to layout.test.ts"
```

---

### Task 3: Resolve Source Code Linter Warnings & Errors

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/app/borci/page.tsx`
- Modify: `src/app/api/newsletter/subscribe/route.ts`
- Modify: `src/app/api/cms/posts/route.ts`
- Modify: `src/app/api/cms/posts/[id]/route.ts`
- Modify: `prisma/seed-real-data.ts`

**Interfaces:**
- Consumes: App API and component structures
- Produces: Warn-free and error-free TypeScript compilations

- [ ] **Step 1: Fix Header.tsx unused imports**

Modify [Header.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/layout/Header.tsx#L8-L10):
Remove the unused `duration` and `EASE_OUT` imports.
```diff
-import { motion, useScroll, useTransform, AnimatePresence, duration } from "framer-motion";
+import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
-import { Swords, Menu, X, ChevronRight, Bell, Sparkles, EASE_OUT } from "lucide-react";
+import { Swords, Menu, X, ChevronRight, Bell, Sparkles } from "lucide-react";
```

- [ ] **Step 2: Fix borci/page.tsx unused import**

Modify [page.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/borci/page.tsx#L8-L10):
Remove the unused `Activity` icon import.
```diff
-import { Search, Trophy, Calendar, Users, Award, TrendingUp, ShieldAlert, Activity } from "lucide-react";
+import { Search, Trophy, Calendar, Users, Award, TrendingUp, ShieldAlert } from "lucide-react";
```

- [ ] **Step 3: Fix subscribe/route.ts unused variable**

Modify [route.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/api/newsletter/subscribe/route.ts#L48):
Log the error in the catch block rather than leaving `err` completely unused.
```diff
-  } catch (err) {
+  } catch (err) {
+    console.error("Newsletter subscribe error:", err);
```

- [ ] **Step 4: Fix posts/route.ts unused variable**

Modify [route.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/api/cms/posts/route.ts#L7):
Remove unused `isAdmin` variable or check.
If `isAdmin` is not used, remove it or replace the destructuring. Let's inspect the code or remove the declaration.
```diff
-    const { user, isAdmin } = await requireAuth();
+    const { user } = await requireAuth();
```

- [ ] **Step 5: Fix posts/[id]/route.ts unused variable**

Modify [route.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/api/cms/posts/%5Bid%5D/route.ts#L8):
Remove unused `isAdmin` variable:
```diff
-    const { user, isAdmin } = await requireAuth();
+    const { user } = await requireAuth();
```

- [ ] **Step 6: Fix seed-real-data.ts unused variable assignment**

Modify [seed-real-data.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/seed-real-data.ts#L94):
Remove the variable assignment `const pereira =` but keep the database insert.
```diff
-  const pereira = await prisma.fighter.create({
+  await prisma.fighter.create({
```

- [ ] **Step 7: Commit changes**

Run command:
```bash
git add src/ prisma/
git commit -m "fix: resolve lint warnings for unused variables and imports"
```

---

### Task 4: Verification and Final Check

**Files:** None (testing task)

**Interfaces:**
- Consumes: Fully clean codebase
- Produces: Clean linter status and built application

- [ ] **Step 1: Run the linter**

Run command:
```bash
pnpm lint
```
Expected output: No problems found, command completes with exit code 0.

- [ ] **Step 2: Run unit tests**

Run command:
```bash
pnpm test
```
Expected output: All 6 tests pass successfully.

- [ ] **Step 3: Run the build**

Run command:
```bash
pnpm build
```
Expected output: Production build completes successfully without TypeScript or build compilation errors.
