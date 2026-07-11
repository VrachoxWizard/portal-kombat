# 2026-07-11 Markdown Documentation Upgrade Design Spec

## Goal
Improve codebase documentation and project context by visually upgrading and detailing `README.md`, `CLAUDE.md`, and `AGENTS.md` to adhere to modern trends, conventions, and agent instructions.

## Proposed Changes

### Section 1: `CLAUDE.md` Upgrade
- Structure it to outline:
  - CLI commands for developer use (Build, Run Dev, Test, Lint).
  - Database operations (Prisma generate, migrate deploy, db push, standard seed, real-data seed).
  - Code Style and Conventions (Tailwind v4 classes, TypeScript strict types, import aliases, and Croatian-aware text helpers).

### Section 2: `README.md` Visual and Technical Upgrade (in Croatian)
- Include:
  - Technology badges for the stack.
  - Unicode directory map of `src/` to outline structure.
  - Schema breakdown of main entities (User, Post, Fighter, Event, Prediction, Subscriber).
  - CMS user roles and pre-configured logins table.
  - Verification checklist for production deployment.

### Section 3: `AGENTS.md` Upgrade
- Retain:
  - Next.js agent warning rules block.
- Add:
  - Code preservation rules (preserving unrelated comments).
  - Type constraint rules (no generic `any` types).
  - Verification guidelines (running tests and linter before marking tasks complete).

## Verification
- Verify that markdown files render cleanly on GitHub markdown display.
- Run `pnpm lint` to make sure we didn't break any lint rules (though markdown isn't typically linted by ESLint in this project).
