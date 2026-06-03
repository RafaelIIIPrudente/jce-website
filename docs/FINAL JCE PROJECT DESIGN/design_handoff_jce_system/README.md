# Handoff: JCE System — JC Electrofields Power System, Inc.

> Internal ERP dashboard (7 departments + cross-cutting/admin) **and** the public marketing website, sharing one design system.

---

## Overview

The **JCE System** is the digital backbone for JC Electrofields Power System, Inc. (JCE), a Philippine power-engineering firm (substations, transmission lines, renewable energy up to 230 KV). It has two faces, both built here:

1. **Internal dashboard** — a single-login, role-aware ERP covering **HR, Accounting, Project Management, Purchasing, Warehouse, BDD (business development), Engineering (stub)**, plus cross-cutting shell/login/notifications and an admin area. **Desktop-first** (1440 design canvas; usable to 1280/tablet). ~95 screens.
2. **Public website** — a **mobile-first** marketing site (390 → 768 → 1280) that reuses the same tokens and visual language; its contact form feeds the dashboard's BDD inquiries inbox.

This package is the design reference for implementing both in a production codebase.

---

## About the Design Files

**The files in `src/` are design references created in HTML/CSS + inline-Babel React.** They are prototypes that demonstrate the intended **look, layout, interaction, and state behavior** — they are **not** production code to copy verbatim. They run in the browser via CDN React + Babel standalone (no build step) specifically so they're easy to open and inspect, which is **not** how you should ship them.

**Your task:** recreate these designs in the target codebase's environment using its established patterns and libraries. If no codebase exists yet, the recommended stack is **React + TypeScript + Vite**, with a real component library and a proper router; the prototype is already organized to map cleanly onto that (see _Architecture_ below). Use the prototype as the source of truth for **visuals, copy, computations, lifecycle/state rules, and RBAC behavior** — re-implement the plumbing idiomatically (real routing, data fetching, forms, state management, accessibility).

The HTML prototypes use a few deliberate simplifications you should replace:

- Components are shared across `<script type="text/babel">` files via `Object.assign(window, {...})`. In production these become normal ES module imports.
- All data is hard-coded sample data in `*-data.jsx` files. Replace with API/data-layer calls; the shapes are realistic and usable as TypeScript interfaces.
- The website's `Website.html` wraps the site in a **viewport-toggle device frame** (the top toolbar with Mobile·390 / Tablet·768 / Desktop·1280). That frame is **preview chrome only** — it is NOT part of the website. Ship only the `.site-root` contents; the site is genuinely responsive via CSS container queries.

---

## Fidelity

**High-fidelity (hifi).** These are pixel-level mockups with final colors, typography, spacing, interactions, and real computed logic. Recreate the UI faithfully using the codebase's libraries. The one caveat: **the color palette is a logo-derived proposal pending official JCE brand guidelines** (see _Design Tokens_). Everything is tokenized so the brand hexes swap in one place without a redesign — preserve that discipline.

---

## Screenshots (`screenshots/`)

Reference renders of the key screens (captured from the prototypes):

| File                              | Screen                                                    |
| --------------------------------- | --------------------------------------------------------- |
| `dashboard-X2-login.png`          | Login with lockout path                                   |
| `dashboard-H1-employees.png`      | HR — grouped employee list (Daily/Weekly/Monthly)         |
| `dashboard-H5-timekeeping.png`    | HR — weekly timekeeping entry grid                        |
| `dashboard-A5-payroll.png`        | Accounting — payroll batch workspace                      |
| `dashboard-P8-accomplishment.png` | PMG — accomplishment workspace (editable "This Period %") |
| `dashboard-U7-import-tracker.png` | Purchasing — 15-stage import tracker                      |
| `dashboard-W4-mrr.png`            | Warehouse — MRR list (3-state lock gate)                  |
| `dashboard-B4-offer-events.png`   | BDD — offers (immutable event stream)                     |
| `website-S1-home.png`             | Website — home (desktop 1280)                             |
| `website-S8-contact.png`          | Website — contact / inquiry form                          |

> The dashboard shots include the orange "view as" role switcher in the top bar — that's prototype-only scaffolding, not a production element. The website shots include the device-frame toolbar — also preview-only chrome. The website is mobile-first (390→768→1280); open `Website.html` and toggle the viewport to verify the responsive reflow (burger nav, single-column cards) at 390.

---

## The 12 Hard Rules (apply across every screen)

These come from the design brief (`reference/JCE_Claude_Design_Brief.md` §7) and are the non-negotiable backbone of the whole system. Implement them as cross-cutting concerns, not per-screen afterthoughts:

1. **GLASS FOR CHROME, SOLID FOR CONTENT.** Frosted-glass surfaces (`.glass`, `.glass-nav`, `.glass-modal`) are used **only** for chrome: nav, top bars, headers, cards, modals, section rails. Every data-dense reading surface — tables, ledgers, forms, registers, reports, payslips — sits on **solid white** (`.solid`). Never put a table/form on glass. Legibility wins.
2. **Palette = green (primary) / orange (accent) / white**, all tokenized. Hexes are proposals pending brand guidelines — never hardcode a color; always use a CSS variable.
3. **Approvals are offline wet-signature, system-wide.** Design **print-only signatory blocks** (name + position + blank signature/date lines) on every printable document. On screen, design **status tracking** + **required scanned-copy upload**. **Never** build in-app e-signing / signature pads. The approval queue captures workflow _decisions_ only — paper still gets signed.
4. **Byte-faithful print views** for legacy documents. The PMG accomplishment report's PRINT view must reproduce the PM head's spreadsheet exactly (columns, headers, totals, styling). Same fidelity discipline for payslip, payroll register, Service Invoice, SOA, Collection Receipt (incl. BIR footer), 2-copy Acknowledgement Receipt, Bank Payment Voucher, JV, PO (×2 templates), RFP, MR form `JCE-F-WMS02`, bank-pivot Disbursement register. The on-screen view may be better; the printed artifact is sacred.
5. **RBAC drives visible states.** One role per user; **hidden nav** for inaccessible modules; **read-only rendering** (static text, _not_ disabled inputs) for read-grants; **masked compensation** for everyone but Payroll Officer + Owner; own-records-only self-service; site engineers locked to assigned sites; Approve/Post/Lock verbs visible only to roles that hold them.
6. **Dashboard is desktop-first** (1440 canvas, dense tables, keyboard-first grids, usable at 1280/tablet). **Website is mobile-first** (390 → 768 → 1280, ≥44px touch targets).
7. **Derived values are never editable** — stock balances, BOQ weights, payment status, distributions, totals, variance. Give computed fields one consistent visual identity (the `.computed` / `.is-computed` hatched style).
8. **Lifecycle states are first-class.** Every document renders its state machine as the standard chip + lock-gate banner; locked/posted/issued things must _look_ immutable.
9. **Motion honors `prefers-reduced-motion`.** Blur layers capped at **3 per viewport** with an intentional solid fallback (`@supports not (backdrop-filter)`).
10. **Philippine formats everywhere:** ₱ with 2 decimals + comma thousands, **negatives in parentheses**, amount-in-words on financial documents, PH dates, **tabular numerals** in every money column.
11. **Numbers & references are content.** Document numbers (`SO#`, `CV-`, `JV-`, `MRR-`, `REL-`, `TRF-`, `RFP-PUR-`, `JCE 0000X`, …) render as scannable, copyable **document-number chips** (`.docchip`).
12. **WCAG AA contrast on glass** — raise surface opacity rather than accept a failing text/background pair.

---

## Architecture (how the prototype is organized)

The dashboard is **one HTML file** (`App Shell.html`) that loads the token CSS, per-module CSS, and per-module JSX, then mounts a single `<App>` that does shell + routing. Each module follows the same shape:

```
<module>-data.jsx     → sample data + tone maps + formatters  (→ becomes types + API layer)
<module>-*.jsx        → screen components (one or more files)
<module>-module.jsx   → the module's sub-nav + internal routing wrapper
<module>.css          → module-specific styles (imports the shared tokens)
```

Mapping to a production React app:

- `jce-tokens.css` → global stylesheet / CSS-variable theme (or a Tailwind/Panda theme).
- Each `*-module.jsx` → a routed feature module (e.g. `/hr`, `/accounting/payroll/:batchId`).
- Shared primitives currently exported to `window` (`Icon`, `ROLES`, `Field`, `L`, status chips, `pmoney`/`peso` formatters) → a shared `ui/` + `lib/` package.
- The RBAC config object (`ROLES` in `shell.jsx`) → your authz layer. It already encodes per-module grants `F` (full) / `E` (edit) / `R` (read) and per-role notes (e.g. "compensation masked", "Lock/Unlock authority").

### Entry points / how to preview

- **`src/App Shell.html`** — the entire internal dashboard. Open it, "log in" (any non-empty username/password; type `fail` as the username to see the error/lockout path). Use the **orange "Prototype · view as" role switcher** in the top bar to switch among 12 roles and watch RBAC change the nav, the home, masked fields, and which action verbs appear.
- **`src/Website.html`** — the public site. Use the top toolbar to toggle 390 / 768 / 1280 (preview-only chrome).
- **`src/Foundations.html`** — the living style guide: palette, type scale, glass/solid recipes, the full status-chip vocabulary, and the ~24-component library. **Start here.**
- **`reference/JCE_Claude_Design_Brief.md`** — the complete source brief (SRS-derived): every screen spec (H1–H14, A1–A19, P1–P19, U1–U24, W1–W13, B1–B11, X1–X6, S1–S9, E1), the component library table, the hard rules, and 20 open design questions. **This is the authoritative functional spec** — read it alongside this README.

---

## Roles & RBAC (from `shell.jsx`)

One role per user; effective permissions are exactly that role's grants (no unions). The prototype ships 12 of the 19 roles for demonstration:

| Role key     | Name                    | Home         | Notable grants                                  |
| ------------ | ----------------------- | ------------ | ----------------------------------------------- |
| `owner`      | Owner                   | Home         | Full everything; **sees compensation**          |
| `admin`      | System Admin            | Admin        | Read-all + full Admin (provisioning)            |
| `employee`   | Employee · Self-Service | My HR        | Own records only                                |
| `hrhead`     | HR Head                 | HR           | Full HR; **compensation masked**                |
| `timekeeper` | Timekeeper              | HR           | Edit timekeeping; read PMG/BDD                  |
| `acctglead`  | Accounting Lead / CFO   | Accounting   | Full Accounting; **no compensation visibility** |
| `payroll`    | Payroll Officer         | Accounting   | Edit payroll; **sees compensation**             |
| `pmhead`     | PM Head                 | Project Mgmt | Full PMG; only role that keys "This Period %"   |
| `purchsup`   | Purchasing Supervisor   | Purchasing   | Full Purchasing                                 |
| `warehouse`  | Warehouse Admin         | Warehouse    | Full WH; **Lock/Unlock authority**              |
| `siteeng`    | Site Engineer           | Warehouse    | Edit WH; **scoped to assigned sites**           |
| `bddlead`    | BDD Lead / Admin        | BDD          | Full BDD                                        |

**Read-grant rule:** when a role has `R` on a module, render values as **static text, never disabled form inputs**, and **omit** action verbs (Approve/Post/Lock) entirely rather than disabling them.

**Compensation masking:** the helper is `CAN_SEE_COMP(role) = role === 'payroll' || role === 'owner'`. When false, salary/ATM/rate fields render as `••••••` in a `.masked` pill with a lock glyph and "Restricted" affordance — applied in HR (H2/H3), Accounting payroll (A5/A6), and anywhere compensation appears.

---

## Status / lifecycle vocabulary

Every document renders its state as a `.chip` (see `jce-tokens.css`). Tone classes: `chip-success` (approved/recorded/paid/verified), `chip-pending` (pending/for-checking/partially-paid), `chip-info` (posted/in-transit/issued), `chip-neutral` (draft/inactive), `chip-danger` (void/rejected/overdue), `chip-locked` (ink-dark + lock glyph, immutable). Each module's `*-data.jsx` defines a `*_TONE` map from status string → tone — reuse these verbatim.

Lock gates (Warehouse W4–W6, locked payroll batches, submitted PMG periods) use the **3-state pattern**: `Draft → For Checking → Locked`, rendered as the `.lockgate` / `.lockbar` component, with the ink-dark "Locked" terminal state looking immutable.

---

## Design Tokens

All tokens live in **`src/jce-tokens.css`** as CSS custom properties. **Treat this file as the single source of truth** and the swap-point for official brand colors.

### Color — green (derived from the logo)

The official JCE logo is green/black/white; the green was sampled directly (`#007817`) and used as `--jce-green-700`, with the ramp rebuilt around it in OKLCH.

| Token             | Hex       | Use                                  |
| ----------------- | --------- | ------------------------------------ |
| `--jce-green-900` | `#013907` | Darkest — headings, active nav text  |
| `--jce-green-700` | `#007817` | **PRIMARY brand green — logo-exact** |
| `--jce-green-600` | `#23982F` | Primary hover/active, progress fills |
| `--jce-green-500` | `#5AB75C` | Success, positive deltas, glow       |
| `--jce-green-100` | `#D4F1D3` | Tinted chips, row highlights         |
| `--jce-green-50`  | `#EFFBEF` | Subtle tinted panels, focused row    |

### Color — orange (accent; **NOT in the logo — proposed, harmonized**)

| Token              | Hex       | Use                                  |
| ------------------ | --------- | ------------------------------------ |
| `--jce-orange-600` | `#DE6F11` | Accent — secondary CTAs, KPI accents |
| `--jce-orange-500` | `#FA8838` | Accent hover, highlights, glow       |
| `--jce-orange-100` | `#FFDEC7` | Accent chips / tints                 |

> ⚠️ The logo contains **no orange**. The accent is a confirmed design proposal but should be validated against official brand guidelines.

### Neutrals

`--jce-white #FFFFFF` · `--jce-bg #F4F8F5` (page backdrop) · `--jce-ink #0F1B14` (primary text) · `--jce-ink-2 #4A5B51` (secondary) · `--jce-line #E2EAE4` (borders/rules).

### Semantic / status

`--st-success #16833B` · `--st-pending #C9760A` · `--st-danger #C8341F` · `--st-info #0E6FB8` · `--st-neutral #5B6B61` · `--st-locked #0F1B14`. Each has a `-bg` and `-ink` paired token for chips (e.g. `--st-success-bg #E2F3E7` / `--st-success-ink #0C5C29`).

### Glass recipe (chrome only)

```css
background: rgba(255, 255, 255, 0.62);
backdrop-filter: blur(20px) saturate(140%);
border: 1px solid rgba(255, 255, 255, 0.65);
border-radius: 16px;
box-shadow: 0 8px 32px rgba(15, 27, 20, 0.1);
/* fallback when backdrop-filter unsupported: background rgba(255,255,255,0.92) */
```

Variants: `--glass-nav` (0.55 alpha), `--glass-modal` (0.74 alpha + heavier shadow). **Max 3 blurred layers per viewport.**

### Solid recipe (content)

```css
background: #ffffff;
border: 1px solid #e2eae4;
border-radius: 10px;
box-shadow: 0 1px 2px rgba(15, 27, 20, 0.05);
/* tables: header #F1F5F2 · zebra #F8FBF9 · focused row var(--jce-green-50) */
```

### Radii

`--r-glass 16px` (chrome) · `--r-solid 10px` (content) · `--r-chip 6px` · `--r-input 8px` · `--r-pill 999px`.

### Typography

- **UI:** `Inter` (`--font-ui`) — placeholder grotesque pending brand typeface. Weights 400/500/600/700 (800 on the website).
- **Mono/numerals:** `JetBrains Mono` (`--font-mono`) — document numbers, money, timestamps.
- **Scale:** 12 / 13 / 14 / 16 / 18 / 22 / 28 / 36 px (`--t-12 … --t-36`). Dashboard body default 14px; dense tables 13px. Website hero up to 38px/800.
- **Money/numerals:** always `font-variant-numeric: tabular-nums` + `font-feature-settings: "tnum" 1`, right-aligned (`.money`, `.tnum`, `.num` helpers).

### Spacing (4px base)

`--s-1 4` · `--s-2 8` · `--s-3 12` · `--s-4 16` · `--s-5 20` · `--s-6 24` · `--s-8 32` · `--s-10 40` · `--s-12 48` (px).

### Motion

`--dur-fast 150ms` · `--dur-base 220ms` · `--dur-slow 320ms` · `--ease cubic-bezier(0.2,0.6,0.2,1)`. All transitions collapse to ~1ms under `prefers-reduced-motion: reduce`.

### Focus

`--focus-ring: 0 0 0 2px #FFFFFF, 0 0 0 4px var(--jce-green-600)` — applied via `:focus-visible` on buttons/inputs.

### Decorative backdrop

`.jce-backdrop` paints 2–3 slow-drifting blurred radial blobs (green + orange) behind glass chrome. Capped at 3 layers; animations disabled under reduced-motion.

---

## Shared Component Library

Catalogued and rendered live in **`src/Foundations.html`** (open it). Each is tagged Glass (chrome) / Solid (content) / Print (paper artifact). Highlights:

- **App shell** — glass sidebar (collapsible icon rail) + glass top bar (search, breadcrumbs, bell+badge, user menu).
- **KPI/stat tile**, **content/project card**, **modal/confirm**, **drawer/side-panel** (glass frame, solid body).
- **Tabs**, **segmented control** (`.seg` — entity/category toggles like JCEPSI/JICA, Local/Import).
- **Data table / register** (`.jtable` — sticky header, zebra, frozen first column, hover focus row) — _solid_.
- **Ledger grid** (running balances, signed values), **entry grid** (keyboard-first cell editing) — _solid_.
- **Form** (`.field`, `.lbl`) with sections, validation, **computed read-only fields** (`.computed`/`.is-computed` hatched), **masked sensitive field** (`.masked`).
- **Status chip** + **document-number chip** (`.docchip`, copyable).
- **Stepper / progress tracker** — 3-state lock gate, 5-stage, 15-stage, sign-off chains.
- **Wizard frame** (multi-step with guarded commit).
- **Timeline / event feed**, **approval-queue item**, **file uploader + attachment list**, **photo manager**.
- **Print preview pane** (paper-faithful) + **print-only signature block** (never interactive).
- **Comparison matrix** (rows × supplier columns, best-value highlight), **chart surface** (bars in glass card).
- **Notification toast + bell feed**, **empty state**, **skeleton loaders**, **audit-log table**, **lock-gate banner**.

Buttons: `.btn` with `.btn-primary` (green), `.btn-accent` (orange), `.btn-ghost`, plus distinct workflow verbs `.btn-approve` / `.btn-post` / `.btn-lock`. Verb buttons are **absent** (not disabled) for roles lacking the verb.

---

_(Screen-by-screen specifications continue in `SCREENS.md`.)_
