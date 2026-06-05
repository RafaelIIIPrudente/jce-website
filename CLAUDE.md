# CLAUDE.md

Guidance for Claude Code agents (CLI, IDE extension, SDK) working in this repo. Read [AGENTS.md](./AGENTS.md) first — it is the canonical AI-agent contract. This file only adds Claude Code-specific items on top.

## Project

JC Electrofields Power System corporate marketing site, plus the internal JCE System ERP dashboard. See [README.md](./README.md) for stack, setup, and folder layout.

## Source of truth — SRS

[`docs/JCE_System_SRS_v1.0_Draft.md`](./docs/JCE_System_SRS_v1.0_Draft.md) (v1.72 Draft) is the **canonical requirements document** for the JCE System — the total SRS. When requirements conflict, the SRS wins over the design-handoff prototypes (`docs/FINAL JCE PROJECT DESIGN/`) and over `docs/JCE-IMPLEMENTATION-PLAN.md`. Its sections map onto the build: §3 RBAC (roles, role×module matrix, cross-module read grants) · §4 HR · §5 Accounting (§5.2 Payroll … §5.9 Reporting) · §6 PMG (§6.6 Accomplishment, §6.10 MR workflow) · §7 Purchasing (§7.8 15-stage Imported-PO tracker) · §8 Engineering (placeholder) · §9 BDD · §10 Warehouse · §11 Public Website · §12 NFRs. It is 5,800+ lines — spot-read the relevant `§N.M` section by anchor; do not read it in full. Cross-reference the matching SRS section alongside the design prototype when planning or building any module.

## What this file adds on top of AGENTS.md

- Engineering Standards — the scalable/maintainable/production-ready quality bar + the canonical folder map (extends AGENTS, source-backed).
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

## Engineering Standards — scalable · maintainable · production-ready

Baseline = AGENTS.md's [9 Architectural rules](./AGENTS.md#architectural-rules-canonical) + [Style and conventions](./AGENTS.md#style-and-conventions); rationale in [`BASEPLATE.md`](./BASEPLATE.md) § 4. **Those are the floor and are NOT restated here** — this section adds the quality bar on top. Each external standard pairs a verified **source** with its **repo application**; repo-only conventions link the internal doc. Public pages also honor the SRS ([`docs/JCE_System_SRS_v1.0_Draft.md`](./docs/JCE_System_SRS_v1.0_Draft.md)) § 11 (Web) + § 12 (NFRs).

### Maintainability & code quality

- **Parse, don't validate, at boundaries.** Validate untrusted input (forms, route params, external JSON) with a Zod schema and `infer` its type — never hand-type then cast ([Zod](https://zod.dev/)). → inquiry/contact payloads and any fetched feed.
- **Discriminated unions over boolean soup; honor `noUncheckedIndexedAccess`.** Tag variants with a literal `kind`; treat array/index access as `T | undefined` ([TS narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) · [tsconfig](https://www.typescriptlang.org/tsconfig/)). → no `any`, no `!` to silence the checker.
- **No needless `useEffect`.** Derive during render; do work in event handlers; reserve effects for external-system sync ([You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) · [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)). → client leaves stay thin.
- **Typed errors, not silent catches** (`error-handling-patterns` skill). → server actions return a typed Result; surface failure in UI.
- **Repo conventions** ([AGENTS Style](./AGENTS.md#style-and-conventions)): single-responsibility files (one section per `web-<page>-*` file), comment density matching the surrounding file, and **no dead code** — quarantine unused under a `legacy/` folder, don't leave it loose (worked example: `components/sections/README.md`).

### Architecture & scalability

- **Server-first.** Pages/layouts are Server Components fetching close to the source; push `'use client'` to the smallest interactive leaf (AGENTS rule 1) ([RSC](https://react.dev/reference/rsc/server-components) · [Next: Server & Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)). → marketing sections are server; `kit/` motion atoms (`web-reveal`, `web-current-trace`) are the only `'use client'` leaves.
- **Fetch + cache on the server; stream slow parts** with `<Suspense>`/`loading.tsx`; identical `fetch`es are memoized ([Next: Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data)). → ISR via `fetch(..., { next: { revalidate } })`.
- **Separate content from logic** — static copy/data in `lib/content/`, components render it ([Next: Project structure](https://nextjs.org/docs/app/getting-started/project-structure)). → page bodies import `lib/content/*`, never inline marketing copy.
- **Split a flat dir into per-feature/per-page subfolders once it spans many concerns** ([Next: split by feature/route](https://nextjs.org/docs/app/getting-started/project-structure)). → `components/sections/` already crossed this line — `kit/` (shared) + per-page + `legacy/` (its README); apply the same as a dashboard module's component dir grows.

### Security (extends AGENTS rules 3–5 — do not re-declare)

- **RLS on every exposed table; policies key off `auth.uid()`** (wrap in `select` for per-statement caching) ([Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)).
- **Server-side auth via `@supabase/ssr`; never trust `getSession()` in server code** ([Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)). → use `lib/supabase/server.ts`, verify with `getUser()` (rule 3).
- **No secrets client-side** — only `NEXT_PUBLIC_*` reach the browser; gate server modules with `import 'server-only'`; all env through `@/env` (rule 2) ([Next: Server & Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) · [Twelve-Factor: config](https://12factor.net/config)).
- **Validate every input boundary** with Zod; harden auth/validation with the `secure-code-guardian` skill.

### Performance (Core Web Vitals budget)

- **Budget (p75):** LCP ≤ 2.5 s · INP ≤ 200 ms · CLS ≤ 0.1 ([web.dev: Vitals](https://web.dev/articles/vitals)).
- **`next/image` for all raster imagery** — automatic optimization, explicit `width`/`height` or `fill` + `sizes` to reserve space (no CLS), lazy by default ([next/image](https://nextjs.org/docs/app/api-reference/components/image)). → no layout-shifting placeholders; keep a `priority` hero from colliding with a lazy card (known LCP-src gotcha).
- **Code-split via the client boundary** — small `'use client'` leaves keep JS off static pages ([Next: Server & Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)).

### Accessibility — WCAG 2.2 AA

- **Conform to WCAG 2.2 Level AA** ([WCAG 2.2](https://www.w3.org/TR/WCAG22/)): semantic HTML + landmarks, one `<h1>` / sane heading order, visible focus, labelled controls.
- **Targets ≥ 24×24 CSS px (SC 2.5.8); this repo's bar is ≥ 44 px (`min-h-11`)** ([SC 2.5.8 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)).
- **Reduced-motion + AA contrast are mandatory** (SRS § 12.9 NFR-UI). → every animation needs a `prefers-reduced-motion` static fallback (kit primitives already do).

### SEO & metadata

- **Per-route metadata.** Export `metadata`/`generateMetadata` (Server Components only); short page `title` feeds the root title template; set `alternates.canonical` ([Next: Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)). → `app/(marketing)/<slug>/page.tsx` exports a short `title`; the root template appends ` — JC Electrofields`.
- **Structured data (schema.org)** per SRS FR-WEB-09: `Organization` + `LocalBusiness` (NAP, foundingDate, sameAs), `Service`, `Project`/`CreativeWork`, `FAQPage`, `BreadcrumbList`. → keep NAP consistent; two addresses coexist (see Memory hints).

### Production-readiness (gate before calling work "done")

- **Gate trio green:** `pnpm lint` + `pnpm exec tsc --noEmit` + `pnpm build` (marketing routes prerender ○). Husky `lint-staged` also runs on commit.
- **Boundaries present** at any segment that can fail/slow independently: `error.tsx` / `not-found.tsx` / `loading.tsx` ([Next: Project structure](https://nextjs.org/docs/app/getting-started/project-structure)).
- **Every state designed:** happy + empty + error + loading + forbidden — never a bare/broken grid (`error-handling-patterns` skill).
- **Env validated** in `env.ts` (Zod + `@t3-oss/env-nextjs`); config from the environment, never hard-coded (rule 2) ([Twelve-Factor: config](https://12factor.net/config)).
- **Observability is already wired** — Sentry + Pino + Vercel Analytics/Speed Insights ([`BASEPLATE.md`](./BASEPLATE.md) § Observability); use it, don't re-add.
- **Conventional Commits** for messages: `type(scope): description` — `feat`/`fix`/`docs`/`refactor`…, `!` or `BREAKING CHANGE` footer for breaks ([Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)).

### Styling & data layer

- **Tailwind v4 design tokens via `@theme`** in `app/globals.css` (no `tailwind.config.ts`); canonical `utility-(--var)` classes, never raw colors or bracketed `var()` ([AGENTS Style](./AGENTS.md#style-and-conventions); `suggestCanonicalClasses` lint) ([Tailwind v4 theme](https://tailwindcss.com/docs/theme)).
- **Drizzle schema is the source of truth** — edit `lib/db/schema.ts`, then `pnpm db:generate` (SQL) / `pnpm db:push` (local only) ([Drizzle migrations](https://orm.drizzle.team/docs/migrations)).

### Dashboard UI Standard (premium tier)

The ERP dashboard's "premium" bar is **disciplined reuse of the existing glass/solid token system** (`app/globals.css`) + `components/jce/*` primitives — NEVER the marketing electrified/dark kit, raw hex/oklch, bracketed `var()`, or new color tokens. Worked examples: **BDD Sales Orders (B1/B2)** (register + edit-with-audit record w/ `Meter`), **BDD Offers (B3/B4)** (register + immutable event-stream record — derived `MetricCard` strip, no `Meter`), **BDD Quotations (B5/B6)**, **BDD Website CMS (B7–B9)** — the first non-register surface, which maps the standard onto a **tabs + premium card-rows + Sheet drawer-editor** shape: a publish-state `KpiTile` strip derived live across all three content stores, the premium toolbar, elevated `.solid` rows, and a refined drawer header with a status `Chip` + live/draft indicator — and **BDD Audit log (B11)**, which brings the **shared append-only `AuditLog`** to register tier (KPI strip incl. a danger-toned _Sensitive changes_ headline, search + area filter, standard pager, sensitive-change `Chip` + lock glyph) **without** mutating its read-only/append-only data or the primitive's contract for the other four consumers (H14/P13/U13/W9 keep the original render via an opt-in `stickyFirstColumn` prop, default off).

- **Surfaces & elevation.** `.glass` (`--r-glass` · `--glass-shadow`) for headers / KPI tiles / elevated panels; `.solid` (`--r-solid` · `--solid-shadow`) for tables and inner data cards; `.glass-modal` for dialogs. Elevation order `--shadow-hairline → -soft → -elevated → --glass-shadow`. Canonical `utility-(--var)` only.
- **Register page** (list): `PageHeader` → **KPI summary strip** (`KpiTile`, `grid-cols-2 lg:grid-cols-4`, derived **live from the store** so it tracks created rows) → **toolbar** (search + filters + primary action, `min-h-11` controls) → `LedgerGrid` (sticky `--table-head`, zebra `--table-zebra`, hover/active) → **pagination footer** ("Page X of N · N items", Prev/Next `min-h-11`, disabled at bounds). States: `EmptyState` (empty / no-search-match + Clear) · `Skeleton` rows in `loading.tsx` (the standard register loading) · read-only role hides create/edit but keeps KPIs/search/pager usable.
- **Record page** (detail): back link → **premium header card** (`.glass`: `DocChip` + status `Chip`s + title + meta + a **hero metric** in `text-ui-28` `tabular-nums`, edit affordance for sensitive figures) → **derived visualization fit to the record's nature**: a part-of-a-whole ratio gets a `Meter` (billed-vs-contract, labelled with % + both figures, B1/B2); a record with no ratio (an immutable event stream) instead makes the **`Timeline` the centerpiece** — do NOT force a `Meter` (B3/B4) → a **`MetricCard` strip** (`.solid`; the `derived` flag keeps the FieldComputed read-only identity at card scale, for either commercial figures or state derived-from-the-stream) → refined **tabs** (linked records as solid cards w/ `DocChip`+`Chip`, per-group empties · paginated live history). Keep the client-side store resolution + not-found `EmptyState`.
- **Chips & numbers.** `Chip` status vocabulary — never color-only (dot/lock glyph carries meaning). Money: `peso()` + `tabular-nums`, right-aligned (`.num`). `kicker` mono eyebrows; `text-ui-*` scale; spacing rhythm `gap-5` between blocks, `p-4`–`p-5` inside surfaces.
- **Motion & a11y.** Subtle transitions only; a `prefers-reduced-motion` static fallback is mandatory (the global reduce block + `Meter`/`Skeleton` already comply). Targets `min-h-11` (≥44px), visible focus (`focus-ring-jce`), semantic headings/landmarks, WCAG 2.2 AA contrast, no layout shift (reserve `Meter`/ring height).
- **Responsive / mobile-first.** Every dashboard screen must read well from ~320px up — design mobile-first, layer `sm:`/`lg:` up ([Tailwind responsive](https://tailwindcss.com/docs/responsive-design)). KPI/metric grids stack then widen (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`; counts may stay 2-up); **long money** uses `pesoCompact()` on summary tiles and stacks to one column for precise figures (never clip a peso) — pair with responsive type (`text-ui-22 sm:text-ui-28` heroes). Dense registers (`LedgerGrid`) scroll horizontally inside their solid surface; **wide comparison matrices** (`ComparisonMatrix`) scroll horizontally with the criterion (row-header) column **sticky** (`sticky left-0`, opaque `--table-head` bg) so the row labels stay in view while panning supplier columns and the page never overflows (B6); **append-only audit logs** (`AuditLog`) scroll horizontally with the leading **Timestamp column sticky** (opt-in `jtable-sticky-first` — opaque per-zebra-parity token bg, hairline frozen-edge shadow) and swap a wide multi-option area `Segmented` to a **full-width `Select` below `lg`** so the 9-option filter stays tappable and never overflows (B11); primary actions go full-width on phones (`w-full sm:w-auto`); dialogs are scrollable + viewport-bounded (`max-h-[90dvh] overflow-y-auto`, fields `grid-cols-1 sm:grid-cols-2`). **Sheet/drawer editors** are full-width + scrollable (`w-full sm:max-w-xl`, sticky header/footer with a `flex-1 overflow-y-auto` body) and collapse their field pairs to one column on mobile (`grid-cols-1 sm:grid-cols-2`); **tab bars** go full-width / horizontally scrollable with ≥44px triggers (`min-h-11`); **card-row lists** stack identity above controls then go inline at `lg`, with no fixed-width control that clips at ~360px (e.g. a Status select is `w-full sm:w-40`). No horizontal page scroll, no clipped controls.
- **Primitives** (all in `components/jce`, barrel `components/jce/index.ts`): `KpiTile` (glass strip tile) · `MetricCard` (solid record stat, `derived`) · `Meter` (token progress bar) · `PageHeader` · `LedgerGrid` · `Chip`/`DocChip` · `EmptyState` · `Skeleton` · `Timeline` · `ComparisonMatrix`. The PMG portfolio `Ring` is the conic-progress precedent.
- **Checklist** (apply to every dashboard list/record): glass/solid + elevation order · KPI strip derived live · toolbar `min-h-11` · sticky/zebra grid · standard pager · empty + loading (`Skeleton`) + read-only + not-found states designed · hero header + `Meter`/`MetricCard` on records · `Chip` not color-only + `peso`/`tabular-nums` · reduced-motion fallback + ≥44px targets + `focus-ring-jce` · **responsive from ~320px (grids stack → widen, `pesoCompact` long totals, scrollable dialogs, no clipped money / no horizontal page scroll)** · canonical tokens only (no hex / bracketed `var()` / new tokens). Worked examples: BDD Sales Orders (B1/B2) · BDD Offers (B3/B4) · BDD Quotations (B5/B6) · BDD Website CMS (B7–B9, the tabs + card-rows + drawer mapping of the standard) · BDD Audit log (B11, the shared append-only `AuditLog` at register tier — sticky-Timestamp scroll + `Segmented`→`Select` area filter on mobile).

### Testing posture

Vitest (unit) + Playwright (e2e) are **installed but unwired** — no `vitest.config.ts` / `playwright.config.ts` ([AGENTS Quirks](./AGENTS.md#quirks-and-known-limits)). Bar: any **non-trivial pure logic** added or changed (parsers, `formatScope`-style helpers, `lib/rbac.ts`) gets a Vitest unit test — wire `vitest.config.ts` on the first one; add a Playwright flow (`playwright-expert` skill) for a critical path (inquiry submit, auth gate) before it ships. UI-only re-skins don't require tests.

### Folder structure (canonical)

Reconciles [README § Folder structure](./README.md#folder-structure) with the live tree + [Next.js Project structure](https://nextjs.org/docs/app/getting-started/project-structure). (README's intended `(app)` group shipped as `(dashboard)`.)

```text
app/
  (marketing)/   public site — page.tsx + about-us, services, products,
                 projects (+ solar-farm / distribution-utility / ngcp), news,
                 careers, contact-us, faq · layout.tsx (header+footer) · opengraph-image.tsx
  (dashboard)/   JCE System ERP — accounting, admin, bdd, dashboard, engineering,
                 foundations, hr, my-hr, pmg, purchasing, warehouse · layout.tsx
  (auth)/        login · layout.tsx
  og/route.tsx   dynamic OG route handler
  layout.tsx · providers.tsx · error.tsx · loading.tsx · not-found.tsx
components/
  ui/            shadcn primitives — owned source (edit; don't re-CLI blindly)
  sections/      marketing sections — kit/ (shared) + per-page + legacy/ (see README)
  site-header.tsx · site-footer.tsx        shared chrome
lib/
  content/   static copy/data (separate from logic)   db/        Drizzle schema/client/migrations
  supabase/  client | server | middleware (never mix) actions/   server actions (UI mutations)
  mock/      seed/mock data    rbac.ts    utils.ts (cn())
env.ts · proxy.ts · drizzle.config.ts · eslint.config.mjs · next.config.ts
instrumentation*.ts · sentry.{server,edge}.config.ts            docs/  (SRS, plans, notes)
```

| Convention    | Rule                                                                                                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Files/symbols | kebab-case files, PascalCase exports; default export = pages only ([AGENTS Style](./AGENTS.md#style-and-conventions))                                                                                                                      |
| Imports       | `@/…` alias across boundaries; external imports → blank line → `@/` group ([AGENTS Style](./AGENTS.md#style-and-conventions))                                                                                                              |
| Boundary      | server-by-default; `'use client'` at the leaf (rule 1)                                                                                                                                                                                     |
| Placement     | content → `lib/content` · shared section/atom → `components/sections/kit` · page section → `components/sections/<page>` · primitive → `components/ui`                                                                                      |
| Route groups  | parens `(group)` organize without changing the URL; colocate non-routable files freely ([Next: Project structure](https://nextjs.org/docs/app/getting-started/project-structure))                                                          |
| When to split | a flat dir spanning many concerns → per-feature/per-page subfolders + a `legacy/` for unused ([Next: split by feature/route](https://nextjs.org/docs/app/getting-started/project-structure)); `components/sections/` is the worked example |

> Documentation only — this section **defines** the convention; it does not move/rename code. A physical restructure beyond `components/sections/` (e.g. splitting large dashboard module component dirs) is a possible follow-up.

## Memory hints

Worth persisting across sessions in this project:

- **Site IA**: Home, About Us, Product & Services, Professional Services, Projects (sub-pages: Solar Farm, Distribution Utility, NGCP), Contact Us — all under `app/(marketing)/`.
- **Supabase posture**: `proxy.ts` short-circuits with `NextResponse.next()` when `env.NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are unset, so the marketing site boots without a Supabase instance. Auth gating and session refresh resume automatically once `.env.local` is populated. `.env.local` is gitignored.
- **Stack identity**: see [README.md § Stack](./README.md#stack) — do not assume the BASEPLATE.md stack is fully wired up. Stripe, Inngest, and the AI SDK are installed but unused for a corporate marketing site.
- **Live reference site**: <https://www.jcepower.com> — the IA above mirrors this.
- **Official Facebook**: <https://web.facebook.com/JCElectrofields> — canonical social link; lives in `SITE.social.facebook` (`lib/content/site.ts`), which drives the footer + contact page.
- **Legal & Accreditations (company-profile §9)**: the About page's "Licenses & Accreditations" block publishes ONLY the client-reviewed safe set — SEC since 24 Jul 2007 · Reg. CS200711697 · ₱1B authorized capital (increased 2021); PCAB Lic. 37783 (Gen-Eng A · Gen-Building · Specialty Electrical) valid to Apr 2027; PhilGEPS Platinum to Jan 2027; NGCP-accredited Substation Erection; BIR-registered; Valenzuela business permit; registered office 2129 La Mesa St., Ugong, Valenzuela. Digested in `docs/JCE-COMPANY-PROFILE-NOTES.md §9`; specced as **SRS FR-WEB-19** + design brief S2. **Hard rail — never render**: TINs (006-805-865), signed/sealed document scans, permit fee breakdowns/account numbers, the personal email jimwelcapillo@yahoo.com, or officers' names in a tax context. Two addresses coexist and are both correct: the **contact NAP** `3074 F. Bautista St.` (`SITE.address`, footer) vs. the **SEC registered office** `2129 La Mesa St., Ugong` (Licenses block) — do not "fix" one to the other. The About narrative also draws on the profile's verbatim **History** + **Mission & Commitment** (NOTES §2).

Do not memorize anything that can be re-derived from `README.md`, `BASEPLATE.md`, or `git log`.

## Claude Code-specific gotchas

- The repo has no project-local `.claude/` directory yet. If you add slash commands or project-scoped skills, place them under `.claude/commands/` and `.claude/skills/`. None exist as of the initial commit.
- `BASEPLATE.md` is 41KB — do not read it in full unless the question is architectural. Spot-read sections by anchor (`§ 4`, `§ 5`, etc.).
- Sentry instrumentation in `next.config.ts:8-14` and `instrumentation.ts:3-10` activates even without `SENTRY_AUTH_TOKEN`. Errors during dev will attempt to phone home; this is harmless but expected.
