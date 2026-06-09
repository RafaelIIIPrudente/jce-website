# AGENTS.md

Canonical AI-agent entry point for the jce-website repository. Read this before editing. Human contributors should read [CONTRIBUTING.md](./CONTRIBUTING.md); Claude Code agents should read this then [CLAUDE.md](./CLAUDE.md).

## Project

JC Electrofields Power System corporate marketing site. Stack, scripts, and folder layout in [README.md](./README.md).

## Commands

| Purpose           | Command                                                     |
| ----------------- | ----------------------------------------------------------- |
| Install           | `pnpm install`                                              |
| Dev server        | `pnpm dev` (Turbopack, port 3000)                           |
| Build             | `pnpm build`                                                |
| Lint              | `pnpm lint` (ESLint flat config)                            |
| DB schema → local | `pnpm db:push`                                              |
| DB migration SQL  | `pnpm db:generate`                                          |
| DB GUI            | `pnpm db:studio`                                            |
| Unit tests        | not wired — Vitest installed, no `vitest.config.ts`         |
| E2E tests         | not wired — Playwright installed, no `playwright.config.ts` |

## Entry points and key files

- `app/layout.tsx` — root layout, fonts, providers, metadata title template.
- `app/(marketing)/layout.tsx` — marketing route group layout (header + footer).
- `app/(marketing)/page.tsx` — home; section pages live under `app/(marketing)/<slug>/page.tsx`.
- `proxy.ts` — Next middleware: refreshes Supabase session and gates `/dashboard`, `/settings`. Throws on empty Supabase env — see Quirks below.
- `env.ts` — `@t3-oss/env-nextjs` + Zod schema. Single source of truth for environment variables.
- `lib/supabase/{client,server,middleware}.ts` — never mix; pick the one matching your execution context.
- `lib/db/schema.ts` — Drizzle table definitions (`profiles`, `tenants`, `tenant_members`).
- `components/site-header.tsx`, `components/site-footer.tsx` — site chrome used by the marketing layout.

## Architectural rules (canonical)

Compressed AI-readable contract. Rationale and long-form discussion in [`BASEPLATE.md`](./BASEPLATE.md) § 4 "Architectural Conventions". Human-prose version in [README.md § Architectural rules](./README.md#architectural-rules).

1. Server Components by default. `'use client'` only at the leaf needing browser APIs, state, effects, or client-only libraries.
2. Import `env` from `@/env` only. Never read `process.env` outside `env.ts` and `next.config.ts`.
3. Use `supabase.auth.getUser()` (verifies the JWT). Never `getSession()` (trusts the cookie).
4. Enable RLS before the first insert on any multi-tenant table. Policies key off `auth.uid()` and `tenant_id`.
5. Service-role keys are server-only. Gate with `import 'server-only'`.
6. Server actions for mutations from your UI. Route handlers only for webhooks, OAuth callbacks, external APIs, and AI streaming.
7. All conditional class composition uses `cn()` from `lib/utils.ts`. Never concatenate class strings.
8. Lucide imports are named only: `import { Check } from 'lucide-react'`.
9. `motion` from `motion/react`. Never `framer-motion`.

> Quality bar beyond these rules — maintainability, performance, accessibility (WCAG 2.2 AA), SEO, and the canonical folder map — lives in [CLAUDE.md → Engineering Standards](./CLAUDE.md#engineering-standards--scalable--maintainable--production-ready).

## Git & commits

- **Never commit or push.** Make your changes and leave them in the working tree for the user's personal review — the only thing that commits is the user, or an explicit "commit this" instruction from them. This binds **every** agent, swarm, and executor session.
- When work is done, surface a `git status` + `git diff` summary of what changed; do not create commits, tags, or checkpoint branches.
- Enforced for ruflo / claude-flow by `CLAUDE_FLOW_DISABLE_AUTOCOMMIT=1` + `AUTO_PUSH=false` in `.claude/settings.json` (the auto-commit / checkpoint helper scripts honor this kill-switch). No auto-commit hook is wired.

## When-you-edit-X-also-update-Y

- New protected route under `/dashboard` or `/settings` → add the prefix to `PROTECTED_PREFIXES` in `proxy.ts:7`.
- New Drizzle table → enable RLS in a migration before the first insert; add policies referencing `auth.uid()` (and `tenant_id` if multi-tenant).
- New environment variable → declare in `env.ts` under `server` or `client`, add to `runtimeEnv`, append to `.env.example` with an inline comment, and add to the Vercel project for both Production and Preview.
- New page under `app/(marketing)/<slug>/` → export `metadata.title` as a short string; the root layout's title template (`app/layout.tsx:19-22`) appends ` — JC Electrofields`.
- New `'use client'` component → push the boundary as far down the tree as possible (rule 1).

## Quirks and known limits

- `proxy.ts` early-returns `NextResponse.next()` when `env.NEXT_PUBLIC_SUPABASE_URL` or `env.NEXT_PUBLIC_SUPABASE_ANON_KEY` is unset — the marketing site renders without Supabase configured. Session refresh and `PROTECTED_PREFIXES` gating only activate once `.env.local` is populated. The four Supabase keys are declared `.optional()` in `env.ts` for this reason.
- `.env.local` is gitignored. On a fresh clone it exists only as a copy of `.env.example` with empty values.
- No CI workflows are wired up — `.github/workflows/` does not exist.
- No `vitest.config.ts` or `playwright.config.ts` is checked in despite the test runners being installed.
- No `lib/db/migrations/` directory exists yet — first `pnpm db:generate` creates it.
- One initial commit on branch `project-setup`; that branch is also `origin/HEAD`. There is no `main` branch.

## Style and conventions

- Path alias `@/*` → repo root (`tsconfig.json:22-24`). Prefer `@/...` over relative imports across directory boundaries.
- Import order: external packages first, then `@/` aliases, blank line between groups. Match existing files.
- Component file names: kebab-case (`site-header.tsx`); exported symbols PascalCase. Pages export default; everything else named.
- TypeScript strict with `noUncheckedIndexedAccess` (`tsconfig.json:7-8`). Handle `undefined` from array and index access explicitly.
- Tailwind v4 — CSS-first config in `app/globals.css`. There is no `tailwind.config.ts`. Use design tokens (`bg-background`, `text-muted-foreground`, etc.), not raw colors.
- shadcn primitives in `components/ui/` are owned source — edit them; do not re-add via the CLI without diffing first.
