# CONTRIBUTING.md

Guide for human engineers contributing to jce-website. AI-agent guidance lives in [AGENTS.md](./AGENTS.md); Claude Code-specific notes in [CLAUDE.md](./CLAUDE.md).

## Prerequisites

You need Node (Next 16 requires 18.18 or newer), pnpm, and Docker Desktop if you want to run Supabase locally. The lockfile is `pnpm-lock.yaml` — do not switch package managers.

## First-time setup

The canonical quick start is in [README.md § Quick start](./README.md#quick-start). Run those steps before anything else.

A couple of things README.md does not call out:

- If `pnpm dev` boots but every route returns 500, your `.env.local` is empty. The four required Supabase vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`) must all be populated, because `proxy.ts` runs on every request and crashes when they are missing. The fastest path is running `pnpm dlx supabase@latest start` and pasting its printed output into `.env.local`.
- The Husky pre-commit hook runs `lint-staged`, which runs ESLint and Prettier on changed files. If a commit appears to hang, check that Husky was installed — it bootstraps via the `prepare` script during `pnpm install`.

## Branch and commit conventions

There is one commit on branch `project-setup`, which is currently both the default and the main working branch. No formal branch-naming or commit-message convention has been established yet — when one is, update this section.

For now: short imperative commit subjects ("add contact form", "fix proxy guard"), a feature-branch-per-PR workflow against `project-setup`, and rebase rather than merge when bringing a branch up to date.

## Pull requests

No CI is wired up yet — `.github/workflows/` does not exist. Before opening a PR, run locally:

1. `pnpm lint` — must pass.
2. Manually verify the affected pages render at `http://localhost:3000`. Remember the middleware crash above: a broken `.env.local` produces 500s unrelated to your change.
3. If you touched the database schema, run `pnpm db:push` against a fresh local Supabase and confirm no drift.

Review expectations: keep PRs focused (one feature or one fix), include screenshots for UI changes, and call out anything that needs a follow-up issue.

## Adding a new marketing page

1. Create `app/(marketing)/<slug>/page.tsx`.
2. Export `metadata` with a short `title` string. The root layout's title template (`app/layout.tsx:19-22`) appends ` — JC Electrofields` automatically.
3. The page inherits the header and footer from `app/(marketing)/layout.tsx` — do not re-import them.
4. Add a link to the new page in `components/site-header.tsx` if it should appear in the top nav.

## Adding a new database table

1. Edit `lib/db/schema.ts` to define the table with Drizzle.
2. Run `pnpm db:generate` to produce migration SQL under `lib/db/migrations/` (the directory is created on first run).
3. Apply with `pnpm db:push` against your local Supabase.
4. **Before the first insert in any environment**, enable RLS on the table and add policies keyed off `auth.uid()` (and `tenant_id` if the table is multi-tenant). See [AGENTS.md § Architectural rules](./AGENTS.md#architectural-rules-canonical) rule 4 and `BASEPLATE.md § 4` for the full pattern.

## Adding an environment variable

1. Add the key to `env.ts` under `server` (anything secret) or `client` (only `NEXT_PUBLIC_*` keys, exposed to the browser).
2. Add the same key to `runtimeEnv` in `env.ts` — boot fails fast if a key is missing here.
3. Append to `.env.example` with an inline comment describing what the variable is for.
4. Add the variable to the Vercel project for both Production and Preview environments before the next deploy.

## Testing

Vitest is installed for unit tests and Playwright for E2E, but neither has a config file checked in (`vitest.config.ts` and `playwright.config.ts` are missing). Adding tests requires creating those configs first. Until then, manual verification at `http://localhost:3000` is the only gate.

When test configs land, the expectation is: unit tests for `lib/` and any non-trivial server actions; Playwright specs for critical user paths (home, contact form submission, any auth flow that gets added).

## Getting help

For architectural questions, start with `BASEPLATE.md`. For operational questions (commands, file locations, conventions), `AGENTS.md`. For project-status questions ("what is working, what isn't"), `git log` and this file. There is no internal chat channel or owner mapping documented in the repo yet — add one here when the team grows.
