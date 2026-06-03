# CLAUDE.md

Guidance for Claude Code agents (CLI, IDE extension, SDK) working in this repo. Read [AGENTS.md](./AGENTS.md) first — it is the canonical AI-agent contract. This file only adds Claude Code-specific items on top.

## Project

JC Electrofields Power System corporate marketing site. See [README.md](./README.md) for stack, setup, and folder layout.

## What this file adds on top of AGENTS.md

- Skill mappings for common tasks in this repo.
- Subagent dispatch guidance for this codebase.
- Memory-system hints — what is worth persisting across sessions.
- Claude Code-specific gotchas not in AGENTS.md.

## Scripts Claude Code should know

| Script             | When                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `pnpm dev`         | Default for any UI or route work. Returns 500 on every route until `.env.local` is populated — see Memory hints below.   |
| `pnpm lint`        | Before declaring a task done that touched `.ts`/`.tsx`. Husky `lint-staged` also runs on commit (`.husky/pre-commit:1`). |
| `pnpm db:push`     | After editing `lib/db/schema.ts`. Local-only — never against a remote DB.                                                |
| `pnpm db:studio`   | Drizzle Studio UI for inspecting the local DB.                                                                           |
| `pnpm db:generate` | Produce migration SQL from a schema diff. Writes to `lib/db/migrations/`, which does not exist until the first run.      |

## Skill mappings

| Task                                                 | Preferred skill        |
| ---------------------------------------------------- | ---------------------- |
| New page under `app/(marketing)/`                    | `nextjs-developer`     |
| Component work in `components/`                      | `react-expert`         |
| Full-stack feature (UI + server action + table)      | `fullstack-guardian`   |
| Schema changes or RLS policies                       | `postgres-pro`         |
| Diagnosing the `proxy.ts` empty-env crash or any 500 | `debugging-wizard`     |
| Hardening auth, input validation, security headers   | `secure-code-guardian` |
| Playwright E2E (no config yet — see CONTRIBUTING.md) | `playwright-expert`    |
| Pre-PR review                                        | `code-reviewer`        |

For planning a multi-file change, dispatch the `Plan` subagent before editing. For "where does X live" lookups across the repo, dispatch `Explore` (quick or medium). For open-ended research that needs synthesis, use `general-purpose`. Skip subagents for single-file edits with a known target.

## Memory hints

Worth persisting across sessions in this project:

- **Site IA**: Home, About Us, Product & Services, Professional Services, Projects (sub-pages: Solar Farm, Distribution Utility, NGCP), Contact Us — all under `app/(marketing)/`.
- **Supabase posture**: `proxy.ts` short-circuits with `NextResponse.next()` when `env.NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are unset, so the marketing site boots without a Supabase instance. Auth gating and session refresh resume automatically once `.env.local` is populated. `.env.local` is gitignored.
- **Stack identity**: see [README.md § Stack](./README.md#stack) — do not assume the BASEPLATE.md stack is fully wired up. Stripe, Inngest, and the AI SDK are installed but unused for a corporate marketing site.
- **Live reference site**: <https://www.jcepower.com> — the IA above mirrors this.
- **Official Facebook**: <https://web.facebook.com/JCElectrofields> — canonical social link; lives in `SITE.social.facebook` (`lib/content/site.ts`), which drives the footer + contact page.

Do not memorize anything that can be re-derived from `README.md`, `BASEPLATE.md`, or `git log`.

## Claude Code-specific gotchas

- The repo has no project-local `.claude/` directory yet. If you add slash commands or project-scoped skills, place them under `.claude/commands/` and `.claude/skills/`. None exist as of the initial commit.
- `BASEPLATE.md` is 41KB — do not read it in full unless the question is architectural. Spot-read sections by anchor (`§ 4`, `§ 5`, etc.).
- Sentry instrumentation in `next.config.ts:8-14` and `instrumentation.ts:3-10` activates even without `SENTRY_AUTH_TOKEN`. Errors during dev will attempt to phone home; this is harmless but expected.
