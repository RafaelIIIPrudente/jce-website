# jce — project baseplate

Production-ready Next.js + Supabase + Tailwind + shadcn baseplate. Scaffolded from [`BASEPLATE.md`](./BASEPLATE.md).

Use this as a template for new SaaS dashboards, marketing sites, internal tools, 3D experiences, or AI apps.

## Stack

- **Next.js 16** (App Router, Turbopack, RSC)
- **React 19**
- **Tailwind v4** (CSS-first via `@theme` in `app/globals.css` — no `tailwind.config.ts`)
- **shadcn/ui** (Radix base, Nova preset, neutral) — components owned in `components/ui/`
- **Supabase** — Postgres + Auth + Storage via `@supabase/ssr`
- **Drizzle ORM** + `postgres` driver
- **Zod 4** for runtime validation
- **TanStack Query** (client), **Zustand** (client state), **react-hook-form** (forms)
- **Sentry**, **PostHog**, **Pino**, **Vercel Analytics/Speed Insights**
- **Stripe**, **Resend** (+ React Email), **Inngest**, **Upstash Ratelimit**
- **Vercel AI SDK** (+ Anthropic + OpenAI providers)
- **Vitest** (unit), **Playwright** (e2e), **Prettier + ESLint + Husky + lint-staged**

## Quick start

```bash
# 1. Install
pnpm install

# 2. Copy env template and fill in values
cp .env.example .env.local
# Required at minimum:
#   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
#   SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL
# Everything else is optional — the schema in env.ts marks 3rd-party keys as .optional()

# 3. Start local Supabase (requires Docker Desktop)
pnpm dlx supabase@latest start
# Copy the printed API URL, anon key, service_role key, DB URL into .env.local

# 4. Generate + push schema to the local DB
pnpm db:push

# 5. Run dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command            | What it does                            |
| ------------------ | --------------------------------------- |
| `pnpm dev`         | Next dev server (Turbopack)             |
| `pnpm build`       | Production build                        |
| `pnpm start`       | Serve the production build              |
| `pnpm lint`        | ESLint                                  |
| `pnpm db:generate` | Generate migration SQL from schema diff |
| `pnpm db:push`     | Push schema directly to DB (dev only)   |
| `pnpm db:studio`   | Drizzle Studio web UI                   |

## Folder structure

```
app/                    # App Router — route groups (marketing) / (auth) / (app) intended
  layout.tsx            # Server Component — Providers + Toaster
  providers.tsx         # 'use client' — TanStack Query + PostHog
  error.tsx             # Sentry-reporting error boundary
  loading.tsx           # Suspense fallback
  not-found.tsx         # 404
  page.tsx              # Home
components/ui/          # shadcn primitives (owned source — edit freely)
lib/
  supabase/             # client.ts / server.ts / middleware.ts — never mix
  db/                   # schema.ts / client.ts / migrations/
  utils.ts              # cn() helper (clsx + tailwind-merge)
proxy.ts                # Refreshes Supabase session on every request, gates (app) routes
env.ts                  # Type-safe env via @t3-oss/env-nextjs + Zod
sentry.{server,edge}.config.ts
instrumentation.ts      # Next 15+ server/edge Sentry hook
instrumentation-client.ts  # Client-side Sentry init
drizzle.config.ts
```

## Architectural rules

These are enforced by convention, not tooling — but if you violate them you'll regret it:

1. **Default to Server Components.** Add `'use client'` only at the leaf that needs browser APIs, state, effects, or client-only libraries (R3F, motion, react-hook-form, TanStack Query).
2. **Read `env` from `@/env`, never `process.env`.** The exception is `env.ts` itself.
3. **Use `getUser()`, not `getSession()`** — `getSession` trusts the cookie; `getUser` verifies the JWT.
4. **Enable RLS before the first insert** on every multi-tenant table. Policies key off `auth.uid()` and `tenant_id`.
5. **Service-role keys** are server-only — gate with `import 'server-only'`.
6. **Server actions for mutations from your UI.** Route handlers only for webhooks, OAuth callbacks, external APIs, and AI streaming.
7. **Stripe webhooks must be route handlers** (need raw request body for signature verification).
8. **All conditional class composition uses `cn()`** from `lib/utils.ts`. Never concatenate class strings manually.
9. **Lucide named imports only**: `import { Check } from 'lucide-react'`.
10. **`motion` from `motion/react`**, never `framer-motion`.

Full architectural detail in [`BASEPLATE.md`](./BASEPLATE.md).

## Using this as a template for new projects

This repo is designed to be cloned or used as a GitHub template.

**Per-project changes:**

- `package.json` → `"name"`
- `app/layout.tsx` → `metadata.title` / `description`
- `.env.local` → new Supabase project, new third-party keys
- `next.config.ts` → `SENTRY_ORG` / `SENTRY_PROJECT` (auto-read from env)
- `README.md` → replace this file

**Keep verbatim:** every dependency version, `env.ts` schema shape, providers, middleware, Supabase clients, Drizzle skeleton, error/loading/not-found, husky/lint-staged, tsconfig strictness, `pnpm-workspace.yaml` allowBuilds.

## License

Private — adapt as you wish for your own projects.
