# JCE System — Master UI/UX Implementation Plan

> **Scope:** UI/UX only, full fidelity, against typed mock fixtures. No backend / DB / auth / API / persistence.
> **Sequencing:** Foundations → Website → Dashboard (flagship-first), executed one part per session.
> **Source of truth:** `docs/FINAL JCE PROJECT DESIGN/` handoff. **Target:** this Next.js 16 / React 19 / Tailwind v4 / shadcn repo.

File abbreviations: `tokens` = `docs/FINAL JCE PROJECT DESIGN/jce-tokens.css`; `globals` = `app/globals.css`; prototype files (`shell.jsx`, `hr-data.jsx`, …) live at `docs/FINAL JCE PROJECT DESIGN/`; brief = `…/design_handoff_jce_system/reference/JCE_Claude_Design_Brief.md`.

---

## 1. Orientation recap

- **Two faces, one design system.** An internal **desktop-first ERP** (~107 screen IDs across 8 modules + shell/admin) and a **mobile-first public website** (S1–S9) share `jce-tokens.css` (README:9-12; brief §4 sitemap, brief:182-253).
- **The 12 hard rules are the backbone** (README "12 Hard Rules"; brief §7:1109-1124): glass-for-chrome/solid-for-content, tokenized green/orange/white, **offline wet-signature approvals** (print-only signatory blocks, never in-app e-sign), byte-faithful print views, RBAC-driven visible states, **derived values never editable**, lifecycle-as-first-class, reduced-motion + ≤3 blur layers, PH money formats, doc-number chips, WCAG AA on glass.
- **Token system is complete and swappable.** Green primary `#007817` (`tokens:L14`), orange accent `#DE6F11` (`tokens:L21`, _not in logo — OPEN-Q #1_), JCE neutrals (`tokens:L26-30`), 6-tone status with `-bg`/`-ink` pairs (`tokens:L33-45`), glass recipe + `@supports` fallback (`tokens:L48-54,149-151`), solid recipe (`tokens:L57-61`), Inter UI + JetBrains Mono numerals (`tokens:L71-72`).
- **RBAC: one role per user, no unions** (brief:116). Prototype ships 12 of 19 roles (`shell.jsx:50-75`); nav is hidden (not disabled) for absent grants (`shell.jsx:82,103`); read-grants render as **static text not disabled inputs** (brief:175); compensation masked unless `payroll`/`owner` (`hr-data.jsx:6`); verbs Approve/Post/Lock are **absent**, not disabled, for roles lacking them (Foundations:553).
- **The four postures** that govern every screen: **glass/solid** (chrome vs reading surface), **desktop/mobile** (dashboard 1440-1280 keyboard-first / website 390→768→1280 ≥44px), **derived-never-editable** (the `.computed` hatch identity, `tokens:L251-255`), **lifecycle-as-first-class** (chip + `.lockbar`, locked things look immutable, `tokens:L38,45`).
- **Computational hearts to preserve verbatim:** H5 manhours distribution (`hr-time.jsx:108-116`), A5 payroll stepper Draft→…→Paid (`acc-payroll.jsx:53`), A8 VAT / A9 SOA net (`acc-sales.jsx:58-62,141`), P8 accomplishment NET AMOUNT with the NORECO2 PB1 = 11.34% → ₱4,529,416.20 anchor (`pmg-accomplishment.jsx:27-50`), W2 stock running-balance (`wh-core.jsx:77-79`), W4 MRR 3-state lock (`wh-docs.jsx:8,59`), B4 offer event-stream derivation (`bdd-flagships.jsx:18-23`).
- **Total coverage target:** X1–X6, H1–H14, A1–A19, P1–P19, U1–U24, W1–W13, B1–B11, E1, S1–S9 (§9 matrix proves zero omissions).

---

## 2. Token & theme reconciliation plan

**Goal:** make the JCE tokens the single source of truth in `app/globals.css`, preserving swap-in-one-place discipline (change the brand hex once and the whole system follows). The current repo runs a **neutral-shadcn + Fraunces editorial** theme in OKLCH (`globals:L120-189`) — that gets re-pointed, not forked.

### 2a. Re-point existing shadcn semantic tokens → JCE drivers (in `:root`, `globals:L120-155`)

| shadcn token                         | becomes                                         | JCE source                                  |
| ------------------------------------ | ----------------------------------------------- | ------------------------------------------- |
| `--primary` / `--primary-foreground` | green `#007817` / white                         | `tokens:L14,L26`                            |
| `--accent` / `--accent-foreground`   | orange `#DE6F11` / white                        | `tokens:L21,L26` (OPEN-Q #1)                |
| `--background` / `--foreground`      | `#F4F8F5` / `#0F1B14`                           | `tokens:L27,L28`                            |
| `--card` / `--card-foreground`       | `#FFFFFF` / `#0F1B14`                           | `tokens:L57,L28`                            |
| `--secondary` / `-foreground`        | `#EFFBEF` / `#013907`                           | `tokens:L18,L13`                            |
| `--muted` / `--muted-foreground`     | `#E2EAE4` (or `--table-head`) / `#4A5B51`       | `tokens:L30/L59,L29`                        |
| `--border` / `--input`               | `#E2EAE4`                                       | `tokens:L30`                                |
| `--ring`                             | green-600 `#23982F`                             | `tokens:L15` (matches `--focus-ring` outer) |
| `--destructive`                      | `--st-danger` `#C8341F`                         | `tokens:L35`                                |
| `--chart-1..5`                       | green-700 / orange-600 / info / green-500 / ink | `tokens:L14,L21,L36,L16,L28`                |
| `--sidebar*`                         | `--glass-nav` family + green                    | `tokens:L49,L14,L18,L51`                    |
| `--radius`                           | `--r-solid` 10px (already ≈ `0.625rem`)         | `tokens:L65`                                |

Prefer **hex source-of-truth** over re-deriving OKLCH so the green matches the logo exactly.

### 2b. NEW tokens to ADD to `@theme inline` / `:root` (absent today)

- **Glass recipe** — `--glass-surface 0.62`, `--glass-nav 0.55`, `--glass-modal 0.74`, `--glass-border 0.65`, `--glass-blur`, `--glass-shadow`, `--glass-fallback` + the `@supports not (backdrop-filter)` swap (`tokens:L48-54,149-151`).
- **Solid recipe** — `--solid-surface`, `--solid-shadow`, `--table-head #F1F5F2`, `--table-zebra #F8FBF9`, `--table-focus` (`tokens:L57-61`).
- **All 6 status families** with `-bg`/`-ink` pairs (`tokens:L33-45`) — today only `--destructive` exists.
- **Surface helpers** — `.docchip` (`#EEF3EF`/green-900, `tokens:L190-197`), `.computed` 135° hatch (`tokens:L251-255`), `.masked` (`#F1F3F2` + dashed `#C7D2CB`, `tokens:L242-248`).
- **Named radii** `--r-glass/-solid/-chip/-input/-pill` (`tokens:L64-68`); **4px spacing ramp** `--s-1..--s-12` (`tokens:L77-78`); **px UI type scale** `--t-12..--t-36` (`tokens:L73-74`) _alongside_ the existing editorial rem scale (keep both — editorial scale serves the website hero type, `--t-*` serves dense dashboard UI).
- **Motion** `--dur-fast/base/slow` + `--ease` (`tokens:L81-82`); explicit **`--focus-ring`** double-ring (`tokens:L85`); **`.jce-backdrop`** blobs + `jce-drift-a/b` keyframes + reduced-motion collapse (`tokens:L91-133,270-273`).

### 2c. REPLACE

- **Fonts:** drop Fraunces for UI/headings; re-point `--font-sans` → **Inter**, `--font-mono` → **JetBrains Mono** (`globals:L42-45` → `tokens:L71-72`). Add both via `next/font/google` in `app/layout.tsx` mirroring the existing Geist/Fraunces blocks, append `.variable` to `<html>` (`layout.tsx:59`). _(Fraunces may be retained only as an optional website display flourish; the dashboard is Inter-only.)_
- **Font features:** Geist-specific `"ss01","cv11"` (`globals:L197`) → Inter feature set; add `tabular-nums` where JCE money/numerals appear (`tokens:L167`).
- **Focus model:** single `outline-ring/50` (`globals:L193`) → JCE double-ring `--focus-ring` on `:focus-visible`.
- **Dark mode is a GAP, not a map:** `jce-tokens.css` is light-only (`tokens:L11`); the existing `.dark` block (`globals:L157-189`) has no JCE equivalent. **Recommendation:** keep the system light-surface (glass-on-green-tinted-white is the design intent); defer/disable dark mode (brief OPEN-Q #19) rather than invent a dark JCE ramp. **PROPOSED — needs confirmation.**

> **Discipline preserved:** every `jce/` component reads `var(--…)`; never inline a brand hex. Brand-hex swap later (OPEN-Q #1) stays a one-line edit.

> **Skill conflict resolved:** the `high-end-visual-design` skill bans Inter, but the handoff specifies Inter + JetBrains Mono (a placeholder system pending the official brand typeface). **Handoff wins** (user source of truth); Inter/JetBrains stay, tokenized as OPEN-Q #1. The skill's premium-polish principles apply to the **website** hero/motion/depth only — never the data-dense dashboard, where glass/solid legibility is law.

---

## 3. Shared component-library plan

Target: a new **`components/jce/`** library, token-driven, tagged Glass / Solid / Print. **Extend 8 existing `components/ui/` primitives; build ~26 NEW.** (Foundations catalog: `Foundations.html`; existing primitives confirmed in `components/ui/`.)

### Extend existing primitives (8)

| Existing `ui/`                                                                   | Extension                                                                                                                           | For                                                   |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `button.tsx` (CVA at :7-42)                                                      | add `accent` (orange) + verb variants `approve`/`post`/`lock`; **conditional render, never `disabled`, for RBAC** (Foundations:553) | all action buttons                                    |
| `card.tsx`                                                                       | `glass` surface variant → `glass-card`                                                                                              | KPI tiles, content cards                              |
| `dialog.tsx`                                                                     | glass-modal frame + solid body; lightbox scrim                                                                                      | modals, gallery                                       |
| `sheet.tsx`                                                                      | glass-frame + solid-body                                                                                                            | record/peek drawer                                    |
| `tabs.tsx`                                                                       | glass tab-bar + solid panels                                                                                                        | record sections                                       |
| `table.tsx`                                                                      | `.jtable` behaviors (sticky head, zebra `#F8FBF9`, frozen first col, hover-focus) → base for ledger/entry/comparison/audit grids    | every register                                        |
| `form.tsx`+`label.tsx`+`input.tsx`                                               | `.field/.lbl`, sections, validation, computed + masked states                                                                       | all forms                                             |
| `select.tsx`                                                                     | code+label fuzzy `picker`                                                                                                           | Employee/Supplier/Client/SO#/Project/Item/CoA pickers |
| `sonner.tsx`+`dropdown-menu.tsx`+`badge.tsx`+`breadcrumb.tsx`+`aspect-ratio.tsx` | glass toast, bell-feed, role chip, breadcrumbs, photo thumbs                                                                        | shell chrome + feedback                               |

### NEW under `components/jce/` (~26)

`app-shell` (glass sidebar collapsible to 72px + glass top bar: search/breadcrumbs/bell+badge/user-menu+role-chip), `page-header`, `kpi-tile`, `segmented` (.seg), `ledger-grid`, `entry-grid` (keyboard cell-edit), `field-computed` (hatch), `field-masked` (••••••), `chip` (6 tones + locked-with-glyph), `doc-chip` (click-to-copy, `Foundations:900-903`), `stepper` (3-state lock gate), `progress-tracker` (5-/15-stage), `sign-off-chain`, `wizard` (guarded commit), `lock-gate-banner` (.lockbar draft/check/locked), `timeline`, `approval-queue-item`, `file-uploader` (required-flag), `photo-manager` (×10, captions, sort, cover), `print-preview` (A4 paper-faithful), `print-signature-block` (**render-only, no handlers** — wet-signature rule), `comparison-matrix` (best-value highlight), `chart-surface` (bars/S-curve/aging), `audit-log`, `empty-state`, `skeleton` (no `ui/skeleton` exists), `bell-feed`.

> **Need `/add-shadcn` for:** `accordion` (S9 FAQ), `tooltip` (masked/computed affordances), `popover` (pickers), `progress` (rings), `avatar` (user menu). None exist in `components/ui/` today.

> **Website sections already exist** in `components/sections/` (22 files) and partly satisfy S1–S9 (`editorial-hero`, `capability-grid`, `stat-band`, `project-card`, `contact-form`, `cta-banner`, `map-embed`, …). Part 1 **re-skins these to JCE tokens** and shares chip/timeline vocabulary with `jce/`, rather than rebuilding from scratch.

---

## 4. App-architecture & routing plan

**Two route groups, two layouts, two postures.**

- **`app/(marketing)/`** — _unchanged group_, public site S1–S9 (existing pages, re-skinned + extended). Keeps `<SiteHeader>`/`<SiteFooter>` layout (`app/(marketing)/layout.tsx:6-13`); IA from `lib/content/site.ts:23-39`.
- **`app/(auth)/login`** — X2 login (reserved group per conventions). Mock auth: any non-empty creds pass; username `fail` forces error; lockout after 3 tries with 30s cooldown (`screens-core.jsx:16-40`).
- **`app/(dashboard)/`** — NEW group wrapped by the `jce/app-shell` layout + the mock auth/role provider. Routes (URL paths proposed; brief tree is ID-based only, brief:182-240):

| Path                                                                                                           | Screens    |
| -------------------------------------------------------------------------------------------------------------- | ---------- |
| `/dashboard` · `/dashboard/notifications`                                                                      | X3, X4     |
| `/admin/users` · `/admin/settings`                                                                             | X5, X6     |
| `/hr` · `/hr/employees[/[id]]` · `/hr/timekeeping` · `/hr/requests` · `/my-hr`                                 | H1–H14     |
| `/accounting/{payroll[/[batchId]],sales,collections,vouchers,disbursement,journal,reporting,clients}`          | A1–A19     |
| `/pmg` _(NOT `/projects` — avoids marketing collision)_ `/pmg/portfolio`, `/pmg/[code]/{boq,accomplishment,…}` | P1–P19     |
| `/purchasing/{ledger,rfp,trackers,suppliers,requisitions,approvals,…}`                                         | U1–U24     |
| `/warehouse/{ledger,items,mrr,release,transfer,movements,…}`                                                   | W1–W13     |
| `/bdd/{sales-orders,offers,quotations,website,inquiries}` · `/engineering`                                     | B1–B11, E1 |

**Collision callout:** marketing owns `/projects`; the PMG module therefore routes under **`/pmg`**, never `/projects`.

**State & RBAC scaffolding (`lib/`):**

- **`lib/mock/`** — typed `as const` fixtures + ported computation helpers + tone maps, _exactly mirroring the `lib/content/` pattern_ (types + `Record` lookups + pure formatters co-located; `lib/content/projects.ts:1-51` is the template). One file per module: `hr.ts`, `accounting.ts`, `pmg.ts`, `purchasing.ts`, `warehouse.ts`, `bdd.ts`, `shell.ts`. Shared formatters `peso`/`pmoney`/`ccyAmt`/`qn` → `lib/mock/format.ts`.
- **`lib/rbac.ts`** — `ROLES` config (`shell.jsx:50-75`), `hasGrant(role,module)`, `CAN_SEE_COMP` (`hr-data.jsx:6`), read-grant + verb-visibility helpers.
- **Mock auth/role context** — a client provider at the `(dashboard)` layout holding the active role + the prototype **role switcher** (`shell.jsx:142-158`); `useState`/`useReducer` for in-session mutations (event appends, status changes, lock toggles). No persistence.
- **`proxy.ts` untouched** — stays short-circuited (Supabase env unset, `AGENTS.md:58`); gating is mock client-side only. **Do not** add `/dashboard` to `PROTECTED_PREFIXES` yet (would 500 without Supabase).

---

## 5. Master build roadmap

**Each part is independently executable once its prerequisites exist.**

| Part  | Name                  | Screens                                                 | Flagship(s) first                                                                 | Depends on                                 | Primary sources                                        |
| ----- | --------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------ |
| **0** | **Foundations**       | tokens · shell · `jce/` library · `lib/mock`+`lib/rbac` | app-shell, chip, doc-chip, data-table, stepper, lock-gate, computed/masked fields | —                                          | `jce-tokens.css`, `Foundations.html`, `shell.jsx`      |
| **1** | **Public Website**    | S1–S9                                                   | **S1 Home**, **S8 Contact**                                                       | 0                                          | `web-pages-a/b.jsx`, `web-content.jsx`, `Website.html` |
| **2** | **Shell & Admin (X)** | X1–X6                                                   | X1 shell, X3 home                                                                 | 0                                          | `shell.jsx`, `screens-core.jsx`, `screens-admin.jsx`   |
| **3** | **BDD + Engineering** | B1–B11, E1                                              | **B4 offer events**, **B10 inquiries**, B6 comparison                             | 0, 2                                       | `bdd-core.jsx`, `bdd-flagships.jsx`, `bdd-data.jsx`    |
| **4** | **HR**                | H1–H14                                                  | **H1 grouped list**, **H5 timekeeping**                                           | 0, 2                                       | `hr-*.jsx`                                             |
| **5** | **Accounting**        | A1–A19                                                  | **A5 payroll**, **A8 SI**, **A9 SOA**                                             | 0, 2, 4 (verified batches), 3 (clients/SO) | `acc-*.jsx`                                            |
| **6** | **Project Mgmt**      | P1–P19                                                  | **P8 accomplishment**, **P3 BOQ wizard**                                          | 0, 2, 3 (SO#)                              | `pmg-*.jsx`                                            |
| **7** | **Purchasing**        | U1–U24                                                  | **U2 ledger**, **U7 import tracker**, **U12 approvals**                           | 0, 2, 3 (SO#), 6 (MR)                      | `pur-*.jsx`                                            |
| **8** | **Warehouse**         | W1–W13                                                  | **W2 stock ledger**, **W4 MRR**                                                   | 0, 2, 3 (SO#), 6 (MR)                      | `wh-*.jsx`                                             |

**Why this order:** Foundations unblocks all. Website is smallest, closest to current code, and only S8 cross-links forward (to B10). The dashboard shell (X) must exist before any module renders inside it. **BDD before HR/Acct/PMG/PUR/WH** because the **SO# registry (`SALES_ORDERS`, `bdd-core.jsx:14`) is referenced by every operational module.** HR before Accounting (verified H6 batches feed A4/A5, `hr-time.jsx:158,183`). PMG before Purchasing/Warehouse (P10 MR For-Purchase remainder feeds U; `pmg-screens.jsx:293`).

**Cross-part data couplings (resolve via shared `lib/mock`, not UI build-order):**

```
Part 0 ──► everything
Part 1 S8 ─writes─► mock INQUIRIES store ─read─► Part 3 B10
Part 3 SALES_ORDERS ─► Part 4 (working project) · 5 (SI/SOA client+SO) · 6 (project SO) · 7 (PO so) · 8 (MRR so)
Part 4 verified H6 batch ─► Part 5 A4/A5 payroll
Part 6 P10 MR (For-Purchase) ─► Part 7 U-flow ;  Part 6 PB anchors ⇄ Part 5 A9 ⇄ Part 3 B2
Part 8 W4 Locked MRR ─completes─► Part 7 U6 three-way match (RFP submittable)
```

The U6↔W4 and B10↔S8 couplings are **data-level** (both sides read the same mock fixture with some rows pre-seeded "Locked"/"Website Contact Form"), so the listed UI order holds without a hard circular block.

---

## 6. Per-part spec schema

Every part's detailed plan (produced by the §7 sub-prompt) MUST fill this template:

1. **Screens & IDs** — every ID in the part, flagships marked, sub-routes/paths.
2. **Source files + screenshots** — exact prototype files and `screenshots/*.png` to read.
3. **Mock fixtures + TypeScript interfaces** — port each `*-data.jsx` export to a typed `as const` module under `lib/mock/`; list the interfaces.
4. **Computations / state machines** — exact formulas + anchors (e.g. P8 `netAmount = PBn − recoup − retention`, anchor ₱4,529,416.20).
5. **RBAC view-states** — which roles see/edit; masking; read-as-static-text; verb visibility (absent-not-disabled).
6. **Lifecycle / lock states** — the document's state machine as chip + `.lockbar`; what "looks immutable."
7. **Byte-faithful print views** — which artifacts; signatory block layout (render-only).
8. **Responsive posture** — desktop-first dense grid (dashboard) — never mobile-first.
9. **Hard-rules subset in force** — which of the 12 apply on these screens.
10. **Acceptance criteria** — visible, testable outcomes (anchors reproduce, masked state correct, lock blocks correctly, computed fields non-editable).
11. **Open questions touched** — relevant brief §8 items.

---

## 7. The reusable "Detail a Part" sub-prompt

Copy this, fill `<PART>`, run in a fresh session:

```
You are a senior frontend engineer. Produce the screen-level implementation spec for <PART e.g. "Part 4 — HR (H1–H14)"> of the JCE System UI/UX build, to be implemented in this Next.js 16 / React 19 / Tailwind v4 / shadcn repo. This is a planning/spec session: output the spec, do not write feature code.

First read the master plan context: docs/FINAL JCE PROJECT DESIGN/design_handoff_jce_system/README.md, SCREENS.md, and the relevant §5 section of reference/JCE_Claude_Design_Brief.md for <PART>. Then read this part's prototype source files (the *-data.jsx for fixtures + each screen file) and its screenshots/*.png. Honor the already-built Part 0 foundations: components/jce/ library, lib/mock typed fixtures, lib/rbac helpers, app/(dashboard) shell + role context, and the JCE tokens in app/globals.css.

SCOPE: UI/UX only at full fidelity — real interactions + client-side computations against typed mock fixtures. No backend, DB, auth, API, or persistence (in-session state only). Dashboard parts are desktop-first (1440/1280, keyboard-first dense grids); the website part is mobile-first (390→768→1280, ≥44px).

Output, per the master plan's per-part schema, with file:line citations to both prototype and codebase:
1. Screens & IDs (flagships first), with proposed routes under app/(dashboard)/ or app/(marketing)/.
2. Source files + screenshots read.
3. Mock fixtures → TypeScript interfaces to add under lib/mock/<module>.ts (mirror the lib/content/ as-const pattern), plus ported computation helpers and tone maps.
4. Computations / state machines with EXACT formulas and the prototype's numeric anchors.
5. RBAC view-states (hidden nav, read-as-static-text not disabled inputs, CAN_SEE_COMP masking, verbs absent-not-disabled).
6. Lifecycle/lock states as chip + lock-gate banner; what must look immutable.
7. Byte-faithful print views + render-only signatory blocks (offline wet-signature; never in-app e-sign).
8. Which components/jce/ primitives are reused vs newly needed; flag any /add-shadcn primitive required.
9. The subset of the 12 hard rules in force, plus accessibility + PH-format checks.
10. Acceptance criteria (anchors reproduce, masking correct, lock gates block correctly, computed fields non-editable).
11. Open questions (brief §8) touched; label any invented detail "PROPOSED — needs confirmation".

Constraints: cite every claim file_path:line; prefer extending existing primitives over inventing; never hardcode a hex; do not unify intentionally-divergent behaviors (Accounting edit-after-Issue vs BDD strict no-edit, OPEN-Q #16); keep Engineering a stub; never silently drop a screen ID.
```

---

## 8. Cross-cutting Definition of Done

Applies to **every** part before it's "done":

- **The 12 hard rules** (README) — glass-chrome/solid-content; tokenized palette (no inline hex); print-only signatory blocks (never e-sign); byte-faithful print artifacts; RBAC visible states; derived-never-editable `.computed` identity; lifecycle chip + lock-gate (immutable look); reduced-motion + ≤3 blur layers; PH money (₱, 2-dp, comma thousands, **negatives in parens**, tabular-nums, amount-in-words on financial docs); copyable doc-chips; WCAG AA on glass.
- **Accessibility** — `prefers-reduced-motion` collapses transitions to ~1ms (`tokens:L270-273`); ≥44px targets on the **website** (`Website.html:166`); keyboard-first cell nav on dashboard **entry grids**; focus-visible double-ring; AA contrast — raise glass opacity rather than ship a failing pair.
- **PH formats** — `peso`/`pmoney` always absolute-value with parens for negatives (`acc-data.jsx:4-7`); JetBrains Mono + `tabular-nums` in every money/number/timestamp column; PH dates.
- **Print discipline** — on-screen may be richer; the printed artifact is sacred and matches the legacy template (payslip, payroll register, SI/SOA/CR/AR with BIR footer, P8 accomplishment, PO ×2, RFP, MR `JCE-F-WMS02`, disbursement register).
- **Lifecycle immutability** — locked/posted/issued documents render with the ink-dark locked chip and look uneditable; event-stream records (B4/B6) never edit, only append.
- **Derived-never-editable** — stock balances, BOQ weights, payment status, totals, variance, distributions all carry the hatch identity and have no input affordance.

---

## 9. Coverage matrix (zero omissions)

Flagships in **bold**. Every ID accounted for; primary source file noted.

**Part 2 — Shell/Admin (X)** · `shell.jsx` / `screens-core.jsx` / `screens-admin.jsx`
X1 shell · X2 login · X3 home · X4 notifications · X5 admin users · X6 admin settings

**Part 4 — HR (H1–H14)** · `hr-*.jsx`
**H1** list · H2 record · H3 add/edit · H4 archived · **H5** timekeeping · H6 batches · H7 requests register · H8–H11 request forms (OB/OT/RFL/LOA) · H12 My HR · H13 chooser · H14 audit

**Part 5 — Accounting (A1–A19)** · `acc-*.jsx`
A1 settings · A2 CoA · A3 loans · A4 payroll list · **A5** payroll workspace · A6 payslip · A7 billing reg · **A8** issue SI · **A9** issue SOA · A10 collections reg · A11/A12 issue CR/AR · A13/A14 PV reg+form · A15 disbursement · A16 JV · A17 cash advances · A18 reporting · A19 clients

**Part 6 — PMG (P1–P19)** · `pmg-*.jsx` (P14–P19 = `pmg-phase2.jsx`)
P1 dash · P2 portfolio · **P3** BOQ wizard · P4 clone/manual · P5 header · P6 BOQ · P7 VO · **P8** accomplishment · P9 billing · P10/P11 MR form+reg · P12 timeline · P13 audit · P14 photos · P15 templates · P16 S-curve · P17 traceability · P18 doc-pack · P19 budget

**Part 7 — Purchasing (U1–U24)** · `pur-*.jsx` (U14–U24 = `pur-phase2a/b.jsx`)
U1 dash · **U2** PO ledger · U3 create · U4 detail/PDF · U5/U6 RFP reg+form · **U7** import tracker · U8 local tracker · U9/U10 suppliers · U11 PRQ · **U12** approvals · U13 audit · U14 merge · U15/U16 RFQ+matrix · U17 catalog · U18 price · U19 BIR 2307 · U20 lead-time · U21 budget · U22 mobile approvals · U23 cycle-time · U24 blanket PO

**Part 8 — Warehouse (W1–W13)** · `wh-*.jsx` (W10–W13 = `wh-phase2.jsx`)
W1 dash · **W2** stock ledger · W3 items · **W4** MRR · W5 release · W6 transfer · W7 movements · W8 MR verify · W9 audit · W10 reorder · W11 stock-take · W12 custody · W13 bins

**Part 3 — BDD + Engineering (B1–B11, E1)** · `bdd-*.jsx`
B1/B2 SO list+record · B3 offers list · **B4** offer events · B5 quotations list · **B6** comparison · B7/B8/B9 website content · **B10** inquiries · B11 audit · **E1** Engineering stub (honest stub only — `bdd-core.jsx`)

**Part 1 — Website (S1–S9)** · `web-pages-a/b.jsx`
**S1** Home · S2 About · S3 Services · S4 Projects · S5 Products · S6 News · S7 Careers · **S8** Contact · S9 FAQ

---

## 10. Open questions & assumptions

**Carried from brief §8 (UI-affecting):** #1 brand hexes/logo/typeface (palette + Inter/JetBrains are proposals — keep swappable); #2/#3 PIS & timekeeping paper templates (H2/H3, H5 column order); #4/#5 print templates (P8, SOA/CR/payslip/register); #7 **landing dashboards for HR/Acct/BDD not specified — prototype routes to primary registers (H1, A4/A7, B1)**; #9 Engineering scope (E1 stays a stub); #10/#11/#12/#13 website FAQ placement, careers mechanism (S7, `web-pages-b.jsx:145`), news/careers ownership, photography/copy/redirects; #14 formal WCAG level beyond AA-on-glass; #15 MFA on login; **#16 keep Accounting edit-after-Issue vs BDD strict no-edit divergent — do not unify**; #17 approval thresholds as data; #19 dark mode out of scope.

**UI-only blockers / decisions surfaced (PROPOSED — needs confirmation):**

- **Website IA divergence:** handoff keeps **S3 Services and S5 Products distinct** (`web-pages-a.jsx:150`), but the current site merges them at `/product-services`. Plan splits them. `professional-services/` has **no handoff S-screen** (maps to the "Engineering Consultancy" service) — keep, drop, or fold into S3?
- **Missing website routes:** no `/news` (S6), `/careers` (S7), or standalone `/faq` (S9) exist today — add as new `(marketing)` routes (each needs `metadata.title` short string per `AGENTS.md:53`).
- **NAP mismatch:** brief/footer NAP (3074 F. Bautista St.; (02) 8562-8540; sales@jcepower.com) vs S8 JSX placeholders (`web-pages-b.jsx:48-50`). Reconcile from the brief (canonical).
- **Responsive model:** prototype uses **container queries** on `.site-root` at 900/560 (`Website.html:35,222,231`); confirm the Next.js site adopts the same `@container` model vs viewport media queries.
- **Dark mode:** recommend deferring (light-only JCE system); confirm.
- **7 of 19 roles absent from the prototype** `ROLES` (Accounting Staff, PMG Staff, Purchasing Staff, Finance/AP, Management/President, BDD Staff, Engineering) — build the 12 implemented now; stub the rest behind the role switcher.

**Assumptions baked in:** dashboard routes under a new `app/(dashboard)/` group with PMG at `/pmg` (avoids `/projects` collision); login at `app/(auth)/login`; mock auth/role context drives RBAC; `proxy.ts` stays short-circuited; mock fixtures follow the `lib/content/` typed-`as const` pattern.

---

## Execution log

| Part                  | Status      | Session / notes |
| --------------------- | ----------- | --------------- |
| 0 — Foundations       | Not started | —               |
| 1 — Website (S1–S9)   | Not started | —               |
| 2 — Shell & Admin (X) | Not started | —               |
| 3 — BDD + Engineering | Not started | —               |
| 4 — HR                | Not started | —               |
| 5 — Accounting        | Not started | —               |
| 6 — Project Mgmt      | Not started | —               |
| 7 — Purchasing        | Not started | —               |
| 8 — Warehouse         | Not started | —               |
