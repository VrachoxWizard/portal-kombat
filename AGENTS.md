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
