# .claude/

Project-local Claude Code configuration for jce-website. Parent guides: [`AGENTS.md`](../AGENTS.md) (canonical AI-agent contract) and [`CLAUDE.md`](../CLAUDE.md) (Claude Code-specific additions).

## Commands

Slash commands invocable as `/<name>` inside Claude Code:

- `/add-shadcn` — install a shadcn primitive into `components/ui/`.
- `/new-form` — react-hook-form + Zod + shadcn Form wired to a server action.
- `/new-marketing-page` — page under `app/(marketing)/<slug>/`.
- `/new-route-handler` — `app/api/<segment>/route.ts` for webhooks, OAuth, external APIs, AI streaming.
- `/new-server-action` — UI-initiated mutation returning the project's `Result` type.
- `/new-supabase-table` — add a Drizzle table to `lib/db/schema.ts`.
- `/new-migration` — generate and apply Drizzle migration SQL.
- `/new-rls-policy` — enable RLS and add policies for a table.

## Skills

On-demand pattern guides loaded by Claude Code:

- `drizzle-patterns` — pgTable composition, FKs, composite PKs, timestamps, tenant_id.
- `supabase-patterns` — three SSR clients, `getUser` vs. `getSession`, service-role gating, `proxy.ts`.
- `nextjs-app-router-conventions` — route groups, special files, metadata template, server-by-default.
- `error-handling-patterns` — discriminated `Result`, `error.tsx`, `notFound()`, Sentry capture.
- `shadcn-and-tailwind-v4` — CSS-first `@theme`, Nova preset, `cn()`, design tokens.
- `marketing-site-patterns` — site IA, metadata template, SEO files, OG image generation.

## Hooks

- `hooks/quality-gate.sh` — runs on Claude Code's `Stop` event. Enforces rules 2, 3, and 9 via `grep`, then runs `pnpm lint`. Blocks the response on failure.

  Make it executable after a fresh clone:

  ```bash
  chmod +x .claude/hooks/quality-gate.sh
  ```

## Settings

- `settings.json` — committed, project-scoped. Registers the quality-gate hook and allowlists common `pnpm` / `git` / `gh` commands so they do not prompt.
- `settings.local.json` — gitignored, per-user overrides. Empty by default.
