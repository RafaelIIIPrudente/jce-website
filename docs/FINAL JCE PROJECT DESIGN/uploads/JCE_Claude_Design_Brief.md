# JCE System — Claude Design Brief

**Project:** JC Electrofields System (JCE System) · **Client:** JC Electrofields Power System, Inc. (JCEPSI)
**Source of truth:** JCE_System_SRS_v1.0_Draft.md, version 1.72 (June 3, 2026)
**Brief version:** 1.0 · **Audience:** Claude Design (this file is the ONLY input the designer receives — it is fully self-contained)

---

## Master Index

| §   | Section                     | Contents                                                                                                                                               |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Product overview            | What the system is, the two components, who uses it                                                                                                    |
| 2   | Design language & tokens    | Palette (proposed hexes), glassmorphism rules, motion, accessibility, performance                                                                      |
| 3   | Roles & access              | All 19 roles, access matrix, per-screen visibility implications                                                                                        |
| 4   | Sitemap                     | Dashboard (all modules/sub-tabs/screens) + public website                                                                                              |
| 5   | Screen specifications       | 5.A Cross-cutting · 5.B HR · 5.C Accounting · 5.D Project Management · 5.E Purchasing · 5.F Warehouse · 5.G BDD · 5.H Engineering · 5.I Public Website |
| 6   | Shared component library    | Component / where used / glass or solid                                                                                                                |
| 7   | Hard rules for the designer | Non-negotiables                                                                                                                                        |
| 8   | Open design questions       | What the SRS leaves unspecified — listed, never invented                                                                                               |
| 9   | Coverage check              | SRS functional area → screen mapping                                                                                                                   |

Screen IDs: X = cross-cutting, H = HR, A = Accounting, P = Project Management (PMG), U = Purchasing, W = Warehouse, B = BDD, E = Engineering, S = public website. Screens marked **[Phase 2]** are scoped and must be designed, but ship in a second phase — design them consistent with Phase 1 patterns.

---

## 1. Product Overview

### 1.1 What the JCE System is

JC Electrofields Power System, Inc. (JCEPSI, founded 1997, ~124 staff, Valenzuela City, Philippines) designs and constructs power substations and transmission lines up to 230 KV, supplies power/distribution transformers and switchgear (exclusive Philippine distributor of Shenda Electric), builds utility-scale solar, and services plant electrical systems. The JCE System is its new custom-built software, with **two components**:

1. **The internal dashboard** — a secure, login-protected, role-based web application used by staff across seven departments: **HR, Accounting, Project Management (PMG), Purchasing, Engineering (placeholder), Business Development (BDD), and Warehouse**. Each department is a module under a single login and shared navigation, governed by one RBAC layer. The dashboard digitizes today's paper-and-spreadsheet operations: employee records and timekeeping, payroll and full double-entry accounting, project progress billing, purchase orders and a 15-stage import tracker, inventory with a lock-gated document flow, and the sales pipeline.
2. **The public website** — JCE's marketing site (Home, About, Projects, Products & Services, News/Blog, Careers, Contact/Inquiry), optimized for SEO and GEO (AI answer engines). It has **no separate CMS**: it renders Published content live from the BDD module and posts inquiry-form submissions straight into BDD's Inquiries inbox.

### 1.2 Concepts that shape every screen

- **Sales Order No. (SO#) is the system-wide primary key for projects** — format `YY-MM-XXX` (e.g., `26-05-378`), assigned by BDD, globally unique. Timekeeping, OB/Travel, billing, vouchers, POs, MRs, and ledgers all reference it. Pickers for it appear everywhere; display it as `SO# + short project label`.
- **The Project entity** (owned by PMG) is the unifying parent: `project_type = Customer` (backed by a Sales Order) or `Internal Cost Center` (`WORKSHOP`, `JCE STOCK`, `MOTORPOOL`). Cost-centre projects have no SO# and no BOQ plan.
- **Approvals are offline, always.** Documents print with wet-signature blocks; the system tracks status only (Pending → Approved/Recorded, or document-specific lifecycles) and stores scanned uploads of signed forms. There is **no in-app e-signing anywhere**.
- **Paper fidelity matters.** Many print outputs must match existing JCE paper forms (payslip, payroll register, Service Invoice, SOA, receipts, vouchers, JV, PO, RFP, MR form `JCE-F-WMS02`); the PMG accomplishment report print view must be **byte-faithful** to the PM head's spreadsheet.
- **Derived, never typed:** stock-on-hand (sum of movements), BOQ weights, payment status on POs, manhours distribution, payroll math, ledger columns. Show these read-only with clear computed styling.
- **Append-only audit everywhere:** department-scoped audit logs (HR, PMG, Purchasing, Warehouse, BDD), event-stream records (Offers, Quotations), and per-record History tabs.
- **Philippine context:** PHP currency (₱, comma thousands, 2 decimals), PH date formats, amount-in-words on financial documents, BIR/SSS/PhilHealth/Pag-IBIG statutory artifacts, Data Privacy Act (RA 10173) sensitivity.

### 1.3 Who uses it

Office staff on desktops (dashboard is **desktop-first**, usable on tablet); site engineers on site (Warehouse documents, scoped to assigned sites); the Owner and executives (oversight + approval queues); every employee (self-service: own requests, payslips, timekeeping); and the public (website, **mobile-first**). Browsers: current Chrome, Edge, Firefox, Safari.

---

## 2. Design Language & Tokens

One visual language governs **both** the dashboard and the public website (SRS §12.9, NFR-UI-01..07): a light, frosted-white glass interface over a soft luminous backdrop, with green/orange/white branding. The defining rule:

> **GLASS FOR CHROME, SOLID FOR CONTENT.** Framing and navigation — top bars, sidebars, nav, cards, modals, section headers — are frosted glass. Data-dense content — tables, ledgers, forms, reports, registers, payslips — always sits on high-contrast **solid** surfaces. Glass is never used where it would compromise reading figures or filling forms.

### 2.1 Palette (proposed — all hexes pending JCE brand guidelines)

The SRS fixes the colors as **green (primary), orange (accent), white** but defers exact values to JCE's brand guidelines (client-input, NFR-UI-01). Use this proposed ramp and mark it clearly as **"pending JCE brand guidelines"** in any handoff:

| Token              | Hex (proposed) | Use                                                                    |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `--jce-green-900`  | `#14532D`      | Darkest green — headings on light, sidebar active text                 |
| `--jce-green-700`  | `#15803D`      | **Primary brand green** — primary buttons, active nav, links           |
| `--jce-green-600`  | `#16A34A`      | Hover/active of primary, progress fills                                |
| `--jce-green-500`  | `#22C55E`      | Success states, positive deltas, glow accents                          |
| `--jce-green-100`  | `#DCFCE7`      | Tinted chips, row highlights                                           |
| `--jce-green-50`   | `#F0FDF4`      | Subtle tinted panels                                                   |
| `--jce-orange-600` | `#EA580C`      | **Accent orange** — secondary CTAs, warnings-as-attention, KPI accents |
| `--jce-orange-500` | `#F97316`      | Accent hover, highlights, glow accents                                 |
| `--jce-orange-100` | `#FFEDD5`      | Accent chips/tints                                                     |
| `--jce-white`      | `#FFFFFF`      | Solid content surfaces, text on green                                  |
| `--jce-bg`         | `#F6F9F7`      | Page backdrop base (soft greenish white)                               |
| `--jce-ink`        | `#0F172A`      | Primary text                                                           |
| `--jce-ink-2`      | `#475569`      | Secondary text, labels                                                 |
| `--jce-line`       | `#E2E8F0`      | Borders, table rules on solid surfaces                                 |

Semantic/status colors (proposed): success `#16A34A` · warning/pending `#D97706` · danger/void `#DC2626` · info/in-transit `#0284C7` · neutral/draft `#64748B` · locked `#0F172A` (with lock glyph). Status chips are used constantly (see §6) — every document lifecycle in the system renders as a chip.

### 2.2 Backdrop & glass recipe

- **Backdrop:** light frosted-white scene — `--jce-bg` base with two or three large, soft radial **glow blobs** in `--jce-green-500` and `--jce-orange-500` at 8–14% opacity, very slowly drifting (60–120 s loops). The glow gives the glass something to refract. Identical treatment on website and dashboard (website may be slightly bolder).
- **Glass chrome (`--glass-surface`):** `rgba(255,255,255,0.62)` fill · `backdrop-filter: blur(20px) saturate(140%)` · 1px border `rgba(255,255,255,0.65)` · radius 16px · shadow `0 8px 32px rgba(15,23,42,0.08)`. Variants: nav/sidebar `rgba(255,255,255,0.55)`; modal `rgba(255,255,255,0.72)`.
- **Solid content (`--solid-surface`):** `#FFFFFF`, 1px `--jce-line` border, radius 8–12px, tight shadow `0 1px 2px rgba(15,23,42,0.05)`. Table headers `#F1F5F9`; zebra rows `#F8FAFC`; focused row `--jce-green-50`.
- **Performance caps (NFR-UI-06):** at most **3 simultaneously blurred layers** per viewport (e.g., top bar + sidebar + one floating panel). Everything else uses the solid fallback. Where `backdrop-filter` is unsupported or the device is low-powered, glass surfaces degrade to solid `rgba(255,255,255,0.92)` — design must look correct in this fallback too.

### 2.3 Typography & numerals (proposed, pending brand)

- **UI family:** Inter (or an equivalent grotesque). Scale: 12 / 13 / 14 (body) / 16 / 18 / 22 / 28 / 36.
- **Numerals:** ledgers, registers, and money always use **tabular figures**, right-aligned, ₱ with comma thousands and 2 decimals; negative amounts in parentheses, e.g. `(1,700.68)`, as JCE's accountants expect.
- **Document numbers** (`SO# 26-05-378`, `CV-0902`, `MRR-2026-0144`, `RFP-PUR-26020188`) render in a monospaced or semibold tabular style chip so they are scannable.
- Print documents follow their legacy paper layouts (see Hard Rules §7), not the screen type scale.

### 2.4 Motion (NFR-UI-04)

Rich but tasteful and immersive: page transitions = 150–250 ms fade/slide; hover lift on glass cards (2–4px translate + shadow); backdrop glow drift; stepper/tracker progress animates; numbers may count up in KPI tiles. **Everything must honor `prefers-reduced-motion`** — when set, all drift/parallax/count-up animation stops and transitions become instant opacity swaps. No motion on data tables while editing.

### 2.5 Accessibility & contrast (NFR-UI-05, NFR-USE-05)

Text on glass must meet **WCAG AA** (≥4.5:1 body, ≥3:1 large); raise panel opacity wherever contrast would dip. Keyboard navigation throughout; visible focus rings (`2px --jce-green-600` outer ring); labeled inputs; error text never color-only (icon + text). Touch targets ≥44px on website and tablet views.

### 2.6 Layout grids

- **Dashboard (desktop-first):** design at 1440×900; sidebar 264px (glass, collapsible to 72px icon rail); content max-width fluid; 12-col grid, 24px gutters; dense-table pages may go full-bleed. Must remain usable at 1280 and on tablet (1024) — tables gain horizontal scroll with frozen first column.
- **Website (mobile-first):** design at 390 first, then 768 / 1280; 4-col mobile grid → 12-col desktop; generous hero spacing.

### 2.7 One shared component library (NFR-UI-07)

Buttons, cards, nav, tables, forms, modals, chips, steppers, uploaders, etc. are designed **once** and reused by every module and the website. See §6 for the full inventory. Do not invent per-module variants where a shared component exists.

---

## 3. Roles & Access

**One role per user** — effective permissions are exactly the assigned role's; no permission unions. The Owner has full business access everywhere; the Admin holds technical configuration and reads business records but never creates/approves/posts them.

### 3.1 The role roster (19 roles)

| Role                            | Home             | Summary                                                                                                                     |
| ------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Owner**                       | System           | Full access to every module and action; ultimate oversight.                                                                 |
| **Admin**                       | System           | Configuration — users, roles, lookups, signatories, reference data; read-only on business records.                          |
| **Employee (Self-Service)**     | Self             | Own records only: submit own HR requests; view own payslip, leave, timekeeping; edit limited personal info.                 |
| **HR Head**                     | HR               | Employee records + timekeeping oversight; approves/records HR requests. **Compensation fields masked.**                     |
| **Timekeeper**                  | HR               | Create/edit timekeeping; verifies pay-period batches; reads Sales Orders to pick Working Project.                           |
| **Accounting Staff**            | Accounting       | Data entry across Sales, Collections, Vouchers, JV; no posting/approval; no compensation.                                   |
| **Accounting Lead / CFO**       | Accounting       | Approve, post, run reports; **no compensation visibility**.                                                                 |
| **Payroll Officer**             | Accounting       | Full Payroll sub-tab **including compensation**; reads employee records for payroll.                                        |
| **PM Head**                     | PMG              | Sole create/edit/submit on projects, BOQ, variation orders, accomplishment periods; retention releases; approval authority. |
| **PMG Staff**                   | PMG              | Create/edit Material Requests; read projects/portfolio.                                                                     |
| **Purchasing Staff**            | Purchasing       | Create/edit POs, RFPs, suppliers; cannot approve or release payment.                                                        |
| **Purchasing Supervisor**       | Purchasing       | Internal PO verification/approval; supplier data quality.                                                                   |
| **Finance / AP**                | Purchasing/Acctg | RFP / payment processing; cross-reads Accounting payable workflow.                                                          |
| **Management / President**      | Oversight        | Final PO approval gates (import stages 4 & 7); read-only oversight.                                                         |
| **Warehouse** (Warehouse Admin) | Warehouse        | Inventory master, movements, MRR/release/transfer; **Lock/Unlock authority**; adjustments.                                  |
| **Site Engineer**               | Warehouse        | Create/submit warehouse documents for **assigned sites only**; cannot Lock/Unlock; reads assigned-project PMG data.         |
| **BDD Staff**                   | BDD              | Sales orders, offers, quotations, website content, inquiries.                                                               |
| **BDD Lead / Admin**            | BDD              | Approve, full BDD audit log, BDD configuration.                                                                             |
| **Engineering role(s)**         | Engineering      | Pending — module is a placeholder.                                                                                          |

### 3.2 Role × module matrix

Codes: **F** Full · **E** Create/Edit (no delete/approve) · **R** Read-only · **—** No access · suffix **+A** Approve · **+P** Post · **+L** Lock. Modules: HR · ACC · PMG · PUR · WH · BDD · ENG · WEB (public-site content) · CFG (system config).

| Role                    | HR  | ACC   | PMG | PUR | WH  | BDD | ENG | WEB | CFG |
| ----------------------- | --- | ----- | --- | --- | --- | --- | --- | --- | --- |
| Owner                   | F   | F     | F   | F   | F   | F   | F   | F   | F   |
| Admin                   | R   | R     | R   | R   | R   | R   | R   | R   | F   |
| Employee (Self-Service) | own | —     | —   | —   | —   | —   | —   | —   | —   |
| HR Head                 | F+A | —     | —   | —   | —   | —   | —   | —   | —   |
| Timekeeper              | E   | —     | R   | —   | —   | R   | —   | —   | —   |
| Accounting Staff        | —   | E     | —   | R   | —   | —   | —   | —   | —   |
| Accounting Lead / CFO   | —   | F+A+P | —   | R   | —   | —   | —   | —   | —   |
| Payroll Officer         | R   | E     | —   | —   | —   | —   | —   | —   | —   |
| PM Head                 | —   | —     | F+A | R   | R   | —   | —   | —   | —   |
| PMG Staff               | —   | —     | E   | —   | R   | —   | —   | —   | —   |
| Purchasing Staff        | —   | —     | R   | E   | R   | —   | —   | —   | —   |
| Purchasing Supervisor   | —   | —     | R   | F+A | R   | —   | —   | —   | —   |
| Finance / AP            | —   | R     | —   | E   | —   | —   | —   | —   | —   |
| Management / President  | —   | —     | —   | R+A | —   | —   | —   | —   | —   |
| Warehouse               | —   | —     | R   | R   | F+L | —   | —   | —   | —   |
| Site Engineer           | —   | —     | R   | —   | R   | —   | —   | —   | —   |
| BDD Staff               | —   | —     | —   | —   | —   | E   | —   | E   | —   |
| BDD Lead / Admin        | —   | —     | —   | —   | —   | F+A | —   | E   | —   |

### 3.3 What this means on screens (design rules)

1. **Module-level gating:** users only see nav entries for modules they can reach. The sidebar renders 1–3 modules for most staff; only Owner/Admin see all nine.
2. **Compensation is the most sensitive data class.** Salary rates, allowances, payslip amounts, payroll runs, ATM numbers are visible **only to Payroll Officer + Owner**. For everyone else (including the HR Head) these fields render in a **masked state** — design a consistent masked-field treatment (e.g., `••••••` with a lock icon and "Restricted" tooltip), not blank space. The Employee detail screen (H2) and Payroll screens are the main consumers.
3. **Employee self-service is own-records-only.** H12/H13 never show another person's data, pickers exclude other employees, and there is no path from self-service into module screens.
4. **Site engineers are scoped to assigned sites.** W1's cards, W2 ledgers, W4/W5 documents, and P-screens they read are filtered to assigned projects; there is no "all sites" toggle for them (Warehouse Admin/Owner get the rollup).
5. **Cross-module read grants** (design as read-only embeds, not editable): Timekeeper/PMG/Purchasing/Warehouse read Sales Orders & Projects to pick references; Accounting reads Purchasing PO & RFP in the payable workflow; PM Head & PMG Staff read Warehouse Available Stock (MR verification) and PM Head reads PO/shipment state (delivery cross-check); Purchasing reads PMG MRs (For-Purchase hand-offs) and Warehouse stock; Warehouse reads POs (MRR three-way match) and MRs.
6. **Approve / Post / Lock are distinct verbs** carried by lead roles only. Buttons for these verbs must be visually distinct (primary-green Approve, ink-dark Lock with lock glyph, Post with ledger glyph) and simply **absent** for roles without the verb — disabled-with-tooltip only when a state (not a role) blocks the action.
7. **Read-only rendering:** when a role has R on a module, every form control renders as static text on solid surface — no disabled inputs.
8. RBAC is enforced server-side; the UI's hiding is presentation, not the control.

---

## 4. Sitemap

### 4.1 Internal dashboard (desktop-first)

```
Login (X2)
└── App shell (X1): glass sidebar + top bar + notifications (X4)
    ├── Home (X3) — role-aware landing
    ├── HR (§5.B)
    │   ├── Employees: grouped list (H1) · record (H2) · add/edit (H3) · archived (H4)
    │   ├── Timekeeping: weekly grid (H5) · verification batches (H6)
    │   ├── HR Requests: register (H7) · OB/Travel (H8) · Overtime (H9)
    │   │   · Request for Leave (H10) · LOA Without Pay (H11)
    │   ├── Self-Service (every employee): My HR (H12) · submit request (H13)
    │   └── HR Audit Log (H14)
    ├── Accounting (§5.C)
    │   ├── Payroll: Settings (A1) · Chart of Accounts (A2) · Loans (A3)
    │   │   · Payroll Summary list (A4) · batch workspace (A5) · Payslips (A6)
    │   ├── Sales: register (A7) · Issue Service Invoice (A8) · Issue SOA (A9)
    │   ├── Collections: register (A10) · Issue CR (A11) · Issue AR (A12)
    │   ├── Payable Voucher: register + PR worksheet (A13) · PV form/detail (A14)
    │   ├── Disbursement: register + record + bank recon (A15)
    │   ├── Journal Voucher: list/form + CA liquidation wizard (A16) · Cash Advances (A17)
    │   ├── Reporting (A18)
    │   └── Clients (A19)
    ├── Project Management (§5.D)
    │   ├── Dashboard (P1) · Portfolio (P2)
    │   ├── New project: BOQ import wizard (P3) · clone/manual builder (P4)
    │   ├── Project: header (P5) · BOQ (P6) · Variation Orders (P7)
    │   │   · Accomplishment Report (P8) · Billing history & ledgers (P9) · Timeline (P12)
    │   ├── Material Requests: form (P10) · register (P11)
    │   ├── PMG Audit Log (P13)
    │   └── [Phase 2] Photos (P14) · BOQ templates (P15) · S-curve (P16)
    │       · Traceability board (P17) · Document packs (P18) · Budget vs actual (P19)
    ├── Purchasing (§5.E)
    │   ├── Dashboard (U1) · PO Ledger (U2) · PO create (U3) · PO detail/PDF (U4)
    │   ├── RFP: register (U5) · form/detail (U6)
    │   ├── Trackers: Import 15-stage (U7) · Local 5-stage (U8)
    │   ├── Suppliers: list (U9) · record (U10) · merge tool (U14, Phase 1.5)
    │   ├── Purchase Requisitions (U11) · Approval queue (U12)
    │   ├── Purchasing Audit Log (U13)
    │   └── [Phase 2] RFQ (U15) · RFQ comparison (U16) · Item catalog (U17)
    │       · Price history (U18) · BIR 2307/alphalist (U19) · Lead-time/reliability (U20)
    │       · Budget vs actual (U21) · Mobile approvals (U22) · Cycle-time analytics (U23)
    │       · Blanket POs (U24)
    ├── Warehouse (§5.F)
    │   ├── Dashboard (W1) · Stock Monitoring Ledger (W2) · Item master (W3)
    │   ├── Documents: MRR (W4) · Release Form (W5) · Stock Transfer (W6)
    │   ├── Stock movements (W7) · MR verification (W8) · Audit Log (W9)
    │   └── [Phase 2] Reorder rules (W10) · Stock-take (W11) · Custody ledger (W12)
    │       · Bins & barcodes (W13)
    ├── BDD (§5.G)
    │   ├── Sales Orders: list (B1) · record (B2)
    │   ├── Offers: list w/ JCEPSI·JICA toggle (B3) · record + events (B4)
    │   ├── Quotations: list w/ EC·Workshop·Solar toggle (B5) · request detail (B6)
    │   ├── Website Details: Projects showcase (B7) · Services (B8) · Products (B9)
    │   ├── Inquiries inbox (B10)
    │   └── BDD Audit Log (B11)
    ├── Engineering (E1 — placeholder stub)
    └── Admin: Users & roles (X5) · System settings (X6)
```

### 4.2 Public website (mobile-first)

```
Home (S1)
├── About (S2) — profile, history, Licenses & Accreditations, clients, leadership, entity facts
├── Projects (S3) → case-study detail (S4)
├── Products & Services (S5) — catalog + 7 capability service pages
├── News / Blog (S6) — list → article
├── Careers (S7)
├── Contact / Inquiry (S8)
└── FAQ (S9 — GEO content; placement may fold into About/footer)
```

---

## 5. Screen Specifications

Every screen uses this template — **Purpose · Primary roles · Layout & key components (each marked glass/solid) · Data & fields (actual SRS field names) · Actions & states · SRS ref**. Universal states all screens inherit: **loading** (skeleton rows on solid surfaces, shimmer on glass tiles), **empty** (illustration + one primary action), **error** (inline retry, never a dead end), **forbidden** (RBAC: hidden nav or read-only rendering per §3.3).

### 5.A Cross-Cutting Screens

#### X1 · App shell

- **Purpose:** the frame every dashboard screen lives in; carries brand, navigation, identity, notifications.
- **Primary roles:** all authenticated users.
- **Layout & components:** left sidebar (glass) — logo, module nav with icons, collapsible to icon rail; top bar (glass) — global search, notifications bell with badge, user menu (name, role chip, logout); content area on the luminous backdrop; breadcrumb strip (glass, inside top bar zone). The sidebar + top bar are 2 of the max-3 blur layers.
- **Data & fields:** module list per role; user name, role; unread notification count.
- **Actions & states:** collapse/expand sidebar; module switch; search; sign out. Idle-timeout warning modal (30 min default) before session expiry.
- **SRS:** §2.1, §12.9, NFR-SEC-03.

#### X2 · Login

- **Purpose:** authenticated entry to the dashboard.
- **Primary roles:** everyone (pre-auth).
- **Layout & components:** centered glass card on the full glow backdrop — logo, "JCE System" title; solid form inside the card: Username/Email, Password, Sign in (primary green); "Forgot password" link → reset flow (request → email/temporary path per build).
- **Data & fields:** username/email, password.
- **Actions & states:** error (invalid credentials — inline, non-enumerating); **lockout** after failed attempts (cooldown message); password-reset confirmation; loading on submit.
- **SRS:** NFR-SEC-01..03.

#### X3 · Dashboard home

- **Purpose:** role-aware landing after login; one glanceable surface routing each user to their work.
- **Primary roles:** all; content varies by role.
- **Layout & components:** greeting header (on backdrop); KPI tile row (glass) — role-relevant counts (e.g., HR Head: pending requests, contracts expiring; Accounting Lead: vouchers pending approval, collections this week; PM Head: projects needing a period update; Purchasing: POs awaiting approval, shipments arriving; Warehouse Admin: documents awaiting lock; Employee: my pending requests); "My approvals" list (glass card wrapping a solid list) deep-linking to U12 and module queues; recent notifications (glass card).
- **Data & fields:** counts and lists sourced from each module's dashboard feeds (FR-X-04, FR-XC-03, FR-WXC-03, §4.4#4).
- **Actions & states:** tile click-through; empty ("all caught up") state.
- **SRS:** §2, §3; module dashboard FRs.

#### X4 · Notifications center

- **Purpose:** one inbox for every system alert.
- **Primary roles:** all (each sees own notifications).
- **Layout & components:** bell → glass dropdown (latest 10) → full-page list (solid table on glass page header). Filters: module, type, unread.
- **Data & fields:** notification type, message, source record link, timestamp, read state. Feeds include: HR — request submitted/approved, contract < 6 months (§4.1, §4.4#4,#9); Accounting — vouchers awaiting approval, RFP due (5.5); PMG — MR awaiting approval, MR→Purchasing hand-off, period submitted, To-Date near 100% (FR-XC-02); Purchasing — PO pending > N days, payments due/overdue, ETA approaching (7/3/1-day leads), blocked stages, missing import docs (FR-X-03, FR-IMP-05); Warehouse — document awaiting checking/lock, MR awaiting verification, transfer unconfirmed/discrepancy, stale reservation (FR-WXC-02); BDD — Contract Amount edited, "Selected as Winner", awarded-Offer status change (9.9#2); approval-queue items (FR-APP-04).
- **Actions & states:** mark read/all read; click-through; empty state.
- **SRS:** as cited per feed.

#### X5 · Admin — users & roles

- **Purpose:** provision users, assign exactly one role each, manage account state.
- **Primary roles:** Admin (Owner full).
- **Layout & components:** users table (solid): name, email/username, role, status (Active/Locked/Deactivated), last login; row drawer (glass frame, solid form): assign role (one only — single-select), link to employee record, reset password, deactivate. Roles reference panel showing the §3 matrix read-only.
- **Data & fields:** user identity, role, status; audit of role changes.
- **Actions & states:** create user, change role (confirm dialog — changes effective permissions), lock/unlock, deactivate. Security events logged (NFR-SEC-06).
- **SRS:** §3, NFR-SEC.

#### X6 · Admin — system settings

- **Purpose:** every admin-editable lookup and configuration outside Accounting's own Settings (A1).
- **Primary roles:** Admin (Owner full).
- **Layout & components:** settings nav (glass sub-sidebar) → one solid table+form per lookup: **Signatories** (per print template: names + positions, e.g., PO local/import chains — FR-PO-06); **Approval thresholds** (per entity type PR/PO/RFP/Blanket: amount bands × ordered approver chain, per currency — 7.15.4, FR-APV-01..05); **Payment terms** (controlled TOP list — FR-SUP-08); **Supplier categories** (FR-SUP-09); **JCE Banks lookup** (bank name, SWIFT, country — 7.15.2); **Units** (lot, set, pcs, kg, assy… — shared §6.3.2/§10); **Locations/Warehouses** (Main Office central + sites — FR-LOC-01); **EWT rates** (Goods 1% · Services 2% · Rentals 5% · Professional 5/10% — FR-RFP-06); FX policy display (dual snapshot PO-date + payment-date — FR-X-06); notification thresholds (stall days, ETA leads).
- **Data & fields:** as listed; all effectivity-aware where applicable.
- **Actions & states:** CRUD per lookup with soft delete/active flags; in-flight approval chains are not retroactively changed (FR-APV-06).
- **SRS:** 7.15.2/7.15.4, FR-PO-06, FR-SUP-08/09, FR-X-06, §10.8.

### 5.B HR Module

#### H1 · Employees — grouped list

- **Purpose:** default Employee Management screen; find any employee fast.
- **Primary roles:** HR Head (full); Payroll Officer (read); Owner/Admin (read).
- **Layout & components:** page header (glass) with search + filters + "Add employee" (primary); **three labeled sections stacked on one page — Daily, Weekly, Monthly** (grouping = Salary Rate Category), each a section header band + solid table underneath. Columns: S/N, Name of Employee, BIO Nos, Position, Place of Assignment, Status, Date Hired, contract-expiry flag.
- **Data & fields:** as the columns; **contract-expiry flag** appears when a contractual employee has < 6 months remaining (orange chip + tooltip with end date).
- **Actions & states:** search ignores grouping (results show their section tag); filters (employment status, employment type) apply within each section — a section hides when it has no matches; row → H2; empty section state; archived excluded (→ H4).
- **SRS:** §4.1.

#### H2 · Employee record — detail

- **Purpose:** the full PIS-based record; source of truth for a person.
- **Primary roles:** HR Head (edit, compensation masked); Payroll Officer + Owner (see compensation); Admin (read).
- **Layout & components:** identity header card (glass): name, position, status chip, S/N, BIO Nos, years of service; tabbed solid panels grouped exactly as the PIS: **Identification & assignment** (S/N, Name, BIO Nos, Place of Assignment — picklist from Projects/Sales Orders with free-text fallback, Position, Date Hired, Years of Service _(computed)_, Status); **Compensation** _(sensitive, masked per §3.3#2)_ (Salary Rate Category, Daily Rate (Basic), Equivalent Monthly Rate, Monthly Allowance, Duty Meal Allowance, Project Allowance, Total Monthly Compensation _(computed)_, Daily (Basic + Allowances) _(computed)_); **Government IDs** _(sensitive)_ (SSS, Pag-IBIG, PhilHealth, TIN); **Personal** _(sensitive)_ (Birthday, Age _(computed)_, Gender, Address, Contact Number); **Emergency contact** (person, number); **Other** (Insurance, Vaccinated, ATM Account Number _(sensitive)_, Expiration Date, Remarks); **History** tab — audit trail of changes (what, when, who).
- **Data & fields:** above; employment type with contract start/end for contractuals.
- **Actions & states:** Edit → H3; Archive (confirm; archive-not-delete); contract-expiry banner when < 6 months; masked-field state; status lifecycle values: Probationary · Regular (Active) · On Leave · Suspended · Resigned · Terminated.
- **SRS:** §4.1, §4.4 #6–9, §3.7.

#### H3 · Employee — add/edit

- **Purpose:** create or update an employee record.
- **Primary roles:** HR Head.
- **Layout & components:** multi-section solid form mirroring H2's PIS groups; sticky section nav (glass rail); computed fields shown read-only with "computed" styling; sensitive groups visually badged.
- **Data & fields:** all H2 fields; Employee Number is the canonical system-assigned identifier (S/N is a display index; BIO Nos links the biometric device).
- **Actions & states:** save/cancel; validation (required identity fields); draft-safe navigation warning; success toast → H2.
- **SRS:** §4.1, §4.4 #6.

#### H4 · Archived employees

- **Purpose:** view and restore archived records (re-hires, audits, history).
- **Primary roles:** HR Head; Owner.
- **Layout & components:** solid table (same columns as H1 + archived date); read-only record view; Restore action.
- **Actions & states:** restore (confirm → returns to active lists); empty state.
- **SRS:** §4.1.

#### H5 · Timekeeping — weekly entry grid

- **Purpose:** digitize the company's spreadsheet: per-employee, per-week (Sunday–Saturday) time entry, per project, with the system auto-computing the manhours distribution. **Must mirror the existing spreadsheet's feel** — a dense, keyboard-first grid, not a card UI.
- **Primary roles:** Timekeeper (create/edit); HR Head (oversight); Owner/Admin (read).
- **Layout & components:** context bar (glass): employee picker (Employee Number → auto-fills Employee Name, Position), week picker; **entry grid (solid, full-bleed)** — one row = one date + one project. Columns: **Date · Working Project** (dropdown of Sales Orders with Project Status Ongoing/On Hold/Completed, not Archived; shows `SO# + label`) · **Day Type** (dropdown beside Date: Regular Day · Rest Day (= Sunday) · Special Holiday · Double Special Holiday · Regular Holiday · Double Regular Holiday) · **Time In · Time Out** · **Manhours Distribution** (computed, read-only: Regular Hours, Overtime, Night Differential in the selected bucket; Absences/Undertime) · **Leave Status** (auto rows only: "Leave With Pay"/"Leave Without Pay" + source RFL/LOA reference chip) · **Remarks**.
- **Data & fields:** as above. Computation rules the UI must visibly honor: breaks deducted only when fully spanned (lunch 12–1 PM, OT meal 10–11 PM, night meal 2–3 AM); Regular = min(net, 8); OT = excess; Night Diff = 11 PM–6 AM overlap (counted separately, may overlap OT); multi-project days share one Time In/Out and split the day's distribution **evenly across project rows** (fractional values allowed, e.g., 1.5).
- **Actions & states:** add row / add project row for same date (copies Date, Day Type, In/Out; recalculates the even split); recompute on save; row-level validation; rows auto-created from approved leave forms are **visually marked** and read-only here; week empty state; locked state once the row's batch is verified.
- **SRS:** §4.2 (incl. calculation rules, multi-project example), §4.4 #10–11.

#### H6 · Timekeeping — verification batches

- **Purpose:** end-of-period review: bundle an employee's rows for a pay period, correct, verify, lock, hand off to payroll.
- **Primary roles:** Timekeeper (verify, re-open with reason); HR Head (oversight); Payroll Officer (consumes downstream).
- **Layout & components:** batch list (solid table): employee, Pay Period Type (Monthly 8–22/23–7 · Daily 6–20/21–5 · Weekly Sun–Sat), period range, row count, status chip (Open · Verified/Locked), verifier + verified-at; batch detail = read-through of every row (H5 grid read-only) with edit-in-place before verification; auto-created leave rows flagged.
- **Data & fields:** batch = one employee × one pay period; every row tagged Day Type, Working Project, distribution counts.
- **Actions & states:** Mark as Verified (locks batch); **Re-open** (timekeeper, requires reason — audited); corrected rows recompute; states: Open → Verified (locked) → Re-opened (audited) → Verified.
- **SRS:** §4.2 "Pay periods, verification, hand-off", §4.4 #12.

#### H7 · HR Requests — register

- **Purpose:** searchable database of all HR request records across the four forms.
- **Primary roles:** HR Head (full); Employee (own only via H12); Owner/Admin (read).
- **Layout & components:** tabs per form type (glass tab bar): OB/Travel · Overtime · Request for Leave · LOA Without Pay (+ LOA With Pay placeholder, pending template); solid register per tab: form number, date filed, employee(s), per-form key fields, status chip (**Pending · Approved/Recorded**), scan-attached indicator.
- **Data & fields:** common shape: form number (manual entry, e.g., "OB-2026-001"), date filed, employee(s) from the employee database (details auto-populate), approvers recorded for audit, **scanned upload (required to reach Approved/Recorded)**, status, per-form fields.
- **Actions & states:** filter by type/status/employee/date; new record (→ H8–H11); export/print views; Pending state exists on all forms (digital intake before signatures complete).
- **SRS:** §4.3, §4.4 #2–3, #13.

#### H8 · OB / Travel form record

- **Purpose:** record an approved Official Business / Travel event (off-site work; still a working day).
- **Primary roles:** HR Head (record/approve status); Employee (submit via H13).
- **Layout & components:** solid form, two zones — **form-level fields:** Form number, Date filed, Reasons for leaving, Project Name (project list dropdown), Sales Order # (Sales Orders dropdown, same visibility rule as Timekeeping), Destination, Date & Time of Departure, Date & Time of Return; **employee list:** rows of employees (name/position auto-populate). **Signers (4 discrete fields, print-only blocks):** Requester (dropdown limited to employees on this form) → Approving Officer / Dept. Head → Admin and Finance → HR Acknowledger. Scanned upload zone (PDF/JPG/PNG, ~10 MB each, multiple files). Status chip.
- **Data & fields:** as above; shared form-level fields are NOT per-row (one team, one trip).
- **Actions & states:** save Pending → upload signed scan → Approved; print view with the four signature blocks; OB does **not** auto-create timekeeping rows (timekeeper enters OB days normally; auto-rows use normal shift hours, Sundays skipped — §4.4 #11 applies to OB-driven rows).
- **SRS:** §4.3.1, §4.4.

#### H9 · Overtime (OT) form record

- **Purpose:** record approved OT events (pre-approval default; after-the-fact for individual assignments).
- **Primary roles:** HR Head; Employee (submit via H13).
- **Layout & components:** solid form — form-level: Form number ("OT FORM NO. 2026-001"), **Section** (single-select: Servicing · Shop/Office · Project site), Project (dropdown), Date prepared, Date of overtime (single date), Overtime Request From/To, Actual Time From/To, Date received by timekeeper, Reason for rendering overtime, Remarks, **OT Type** (Pre-approved · After-the-fact); employee list (auto-populated details; each employee signs their row on paper). Signers: Requester (limited to listed employees) → Department Head → Timekeeper (Noted by) → HR Head (Approved by). Scan upload required; status chip.
- **Actions & states:** Pending → Approved on scan; print view; OT does **not** auto-create timekeeping rows.
- **SRS:** §4.3.2.

#### H10 · Request for Leave record

- **Purpose:** record leave requests (the With-Pay form; also supports Without Pay).
- **Primary roles:** HR Head; Employee (submit via H13).
- **Layout & components:** solid single-employee form: Form number (RFL-YY-XXX), Date filed, Employee (auto: Name, Position, Dept., Length of Service), **Type of Leave** (Vacation Leave · Sick Leave · Others + "Others Specify" — Paternity/Maternity go through Others), **Pay type** (With Pay · Without Pay), Applied Period From/To, **Leave Category (No. of Days)** — auto-calculated working days (excl. Sundays), editable default, **Request Type** (Pre-approved · After-the-fact — the latter requires Proof/Evidence attachment), signers: Employee's Signature (auto = employee) → Approved by (Dept Head/Supervisor) → Checked by (HR Head) → Noted by (President / Vice President — picked from employee DB, never hard-coded names); Proof/Evidence upload (after-the-fact only); scanned upload; status (Recorded).
- **Actions & states:** on save, **auto-creates Timekeeping rows** for each working day in range (Day Type per calendar; In/Out empty; distribution zeros; Leave Status = "Leave With Pay"/"Leave Without Pay"; source RFL reference) which flow into H6 batches; no leave balances exist (recording-only); print view.
- **SRS:** §4.3.3, §4.4 #10, #14.

#### H11 · LOA Without Pay record

- **Purpose:** record unpaid leave-of-absence events.
- **Primary roles:** HR Head; Employee (submit via H13).
- **Layout & components:** solid single-employee form: Internal ID (system, "LOA-WP-2026-001"), Date filed, Employee (Position auto), Date of Absence From/To, No. of Days (auto working days, override allowed), **Leave Type** (Vacation · Sick · Paternity · Maternity · Others), Reason, signers: Requester (= employee) → Approved by (Section Head) → Noted by (Plant Operation Head) → Acknowledged by (HR); scanned upload; status (Recorded · Pending rare).
- **Actions & states:** auto-creates Timekeeping rows marked **"Leave Without Pay"** (no pay downstream); print view.
- **SRS:** §4.3.5.

#### H12 · Self-service — My HR

- **Purpose:** every employee's own-records home: payslips, leave history, timekeeping, request tracking.
- **Primary roles:** Employee (Self-Service) — strictly own records.
- **Layout & components:** summary tiles (glass): pending requests, last payslip date; solid panels: **My requests** (list with status chips Pending/Approved), **My payslips** (Approved payslips list → read-only payslip view A6 layout, reprint/PDF), **My timekeeping** (read-only weekly view of own rows), **My leave records** (own RFL/LOA history); limited personal-info edit (contact details).
- **Actions & states:** open request detail (read-only); download payslip; submit new request → H13; empty states.
- **SRS:** §4.4 #1, §3.7, PSL-010.

#### H13 · Self-service — submit request

- **Purpose:** digital intake of the four request forms by the employee.
- **Primary roles:** Employee (Self-Service).
- **Layout & components:** form-type chooser (glass cards: OB/Travel, OT, Request for Leave, LOA Without Pay) → the matching solid form (H8–H11 field sets, scoped: employee = self; multi-employee forms allow listing teammates where the form supports it); submit → **Pending**.
- **Actions & states:** after submission the paper chain happens offline (wet signatures per each form's chain); HR uploads the signed scan and the record flips to Approved/Recorded; notifications fire (approver on submit, employee on approval, HR on record); status timeline shown on the record.
- **SRS:** §4.4 #2–4.

#### H14 · HR audit log

- **Purpose:** department-scoped, append-only log of HR state changes.
- **Primary roles:** HR Head (full HR log); Owner/Admin (full); employees: none.
- **Layout & components:** solid table: actor, timestamp, affected record, action, before/after values; filters (user, date range, record type, action).
- **Data & fields:** events: employee create/edit/archive, timekeeping edits, batch verify/re-open (with reason), request status changes.
- **Actions & states:** read-only; export; entries immutable.
- **SRS:** §4.6.

### 5.C Accounting Module

Roles shorthand for this module: **Staff** = Accounting Staff (entry, no posting/approval), **Lead** = Accounting Lead/CFO (approve/post/reports, no compensation), **PO** = Payroll Officer (payroll incl. compensation), plus Owner. Cross-cutting Accounting behaviors (5.12): document numbering auto-sequential on Issue with out-of-sequence warning; amount-in-words auto-generated (asterisk styling, e.g. `***Thirteen Million … & 67/100 Pesos Only***`); issued documents remain editable **with full audit trail**; VAT 12% and CWT auto-computed from Settings, editable per line; void-never-delete (number retained, marked Void).

#### A1 · Payroll — Settings

- **Purpose:** the central configuration store — every rate, statutory table, policy threshold, and schedule the payroll engine and accounting postings read; versioned by effectivity date so past periods reproduce historical figures.
- **Primary roles:** Lead + Owner (edit, logged); PO (read); Staff (no).
- **Layout & components:** settings sub-nav (glass rail) → one solid section each: **1 Pay Rate Multipliers** — editable matrix: rows Ordinary day · Rest day · Special (non-working) day · Special on rest day · Double special · Double special on rest day · Regular holiday · Regular holiday on rest day · Double regular holiday · Double regular holiday on rest day; columns Regular % / Night shift % / Overtime % (100/110/125 … 390/429/507); **2 Government Mandatory Contributions** — SSS (15%, EE 4.5%/ER 9.5%, MSC ₱5,000–₱35,000, 45-bracket table), PhilHealth (5% split 50/50, floor ₱10,000 ceiling ₱100,000), Pag-IBIG (1%/2% bands, ₱10,000 max fund salary, ₱200 cap) — each versioned with source circular; **3 Withholding Tax (TRAIN)** — graduated monthly table (₱20,832 exempt … 35% over ₱666,667), single fixed frequency company-wide; **4 Tardiness/Lates Policy** — clock-in windows → deductions (8:00–8:10 none … 10:01–12:00 half day); **5 Deduction Calendar** — semi-monthly: 15th = Pag-IBIG + PhilHealth + SSS loan, 30th = SSS + Pag-IBIG loan; weekly: W1 Pag-IBIG+loan, W2 PhilHealth, W3 SSS, W4 SSS loan; **6 Cut-Off Periods** — Daily 21–05/06–20, Monthly 23–07/08–22; **7 Statutory Leave Benefits** — SIL 5 days (employer), Maternity 105/120/60 days (SSS-paid), Paternity 7 days (employer); **9 Financial Statement Mapping** — Balance Sheet Roman-numeral lines and Income Statement Sched prefixes → contributing CoA codes, effectivity-versioned. (Section 8 = Chart of Accounts, given its own screen A2.)
- **Data & fields:** every value above; effectivity date (+ optional end) per table.
- **Actions & states:** edit with audit (editor + timestamp, SET-003); version history per table; "effective as of" picker preview.
- **SRS:** 5.2.1 (SET-001..083), 5.9 mapping, 5.12 #27.

#### A2 · Chart of Accounts admin

- **Purpose:** maintain JCE's GL account list — the reference every Dr/Cr posting validates against.
- **Primary roles:** Lead + Owner (edit); Staff/PO (read).
- **Layout & components:** solid table grouped by range band headers: Assets 10000s · Liabilities 20000s · Equity 30000s · Revenue 40000s · Cost/Expenses 50000s (129 accounts, codes 10001–50055; gaps are reserved headroom); columns: account_code, account_name, account_type (Asset/Liability/Equity/Revenue/Expense), account_subtype, normal_balance (Debit/Credit), is_contra_account flag, is_active, notes; add/edit drawer (glass frame, solid form).
- **Data & fields:** per schema above + parent_code (optional); typo cleanups at entry (withheld/withholding/taxes).
- **Actions & states:** create (code manually assigned by Accounting); **inactivate-never-delete** when posted against (SET-081); active filter; search by code/name fuzzy (typing `meal` finds `50032 Meals Expense`); account × project drill-down link into A18.
- **SRS:** 5.2.1 §8, 5.12 client-input note (accounts to add: BDO, 852-5, Land Bank 580 Workshop, ACCOMMODATION EXP., PROJECT OVERHEAD, Local Retention Receivable).

#### A3 · Payroll — Loans

- **Purpose:** manage employee loans (Government · Company · Cash Advance) feeding per-cutoff payroll deductions.
- **Primary roles:** PO + Owner; HR enters Government loans/CAs per ownership split (Government/CA = HR-owned, Company = Accounting-owned); Lead read.
- **Layout & components:** loans table (solid): Employee, Type (Government Loan · Company Loan · Cash Advance), Sub-type (SSS Salary/Calamity, Pag-IBIG Salary/Calamity…), Reference Number, Principal, Date Granted, per-period amortization, Deduction Schedule, **Running Balance**, Status chip (Active · Fully Paid · On Hold · Restructured · Cancelled); loan detail with **append-only Ledger** (timestamp, user, payroll run ID, amount, resulting balance, note).
- **Data & fields:** terms entry modes: by term count (principal ÷ N) or fixed amortization (system derives count); final-installment trueing (last deduction = remaining balance); auto-stop at zero → Fully Paid; zero-interest for Company/CA.
- **Actions & states:** create/edit; hold/restructure/extra payment → ledger entries with reason; skip indicator ("skipped: insufficient net pay") surfaces in A5; empty/active filters.
- **SRS:** 5.2.2.

#### A4 · Payroll Summary — batch list

- **Purpose:** find and manage payroll batches.
- **Primary roles:** PO + Owner; Lead (approve stage); Staff (no).
- **Layout & components:** solid register: batch_id, pay_frequency (Daily/Weekly/Monthly), period_start–period_end, cutoff_label (15th/30th/week n), register_scope (Consolidated · Per-Project), project_so_no (when Per-Project), section, status chip (**Draft → Prepared → Checked → Verified → Approved → Paid**), total_workers, total_gross, total_deductions, total_net; "New batch" (glass header action) with frequency/period/scope/project pickers.
- **Actions & states:** filters (frequency, status, period, project); open → A5.
- **SRS:** 5.2.3 (PS-001..003).

#### A5 · Payroll batch workspace

- **Purpose:** build, review, and sign off one payroll batch; the single source for payslips, alpha list, and project charging.
- **Primary roles:** PO (build); sign-off chain users per stage; Owner.
- **Layout & components:** batch header card (glass): period, frequency, cutoff, scope, status stepper (Draft→Paid); **summary lines table (solid, wide, frozen employee column)** — per employee: line_no, employee_name, rate_per_day; earnings: basic_pay, overtime_pay, holiday_pay, night_diff_pay, allowance (non-taxable), other_adjustments, total_earnings; attendance: absences_days/amount, lates_undertime_min/amount, gross_pay; deductions: sss_contribution, philhealth_contribution, pagibig_contribution, withholding_tax, sss_loan, pagibig_loan, company_loan, cash_advance, other_deductions, total_deductions; **net_pay**; row expander → **Daily Earnings Detail** (solid sub-table): work_date, charge_project_so, day_type, reg/ot/night_diff hours, applied_rate, multipliers, basic/overtime/night_diff amounts, day_total; footer: control totals + **Charging Allocation** (per-project allocated_hours/amount, e.g., Garcia 3, Greenbelt, Noreco II, Sikatuna, Workshop); workflow panel (glass): Prepared/Checked/Verified/Approved by + at, advance/revert with remarks (Workflow Log).
- **Data & fields:** computation order is authoritative (roll-up → total_earnings → attendance → contributions per calendar → taxable_income → TRAIN tax → loans per calendar with skip rule → total_deductions → net_pay); deductions appear **only when the Deduction Calendar schedules them this cutoff**; loan skips flagged with override flow (officer picks which loans to push through; every override ledger-logged).
- **Actions & states:** edit while ≤ Checked; **lines lock at Approved** (revert = logged status change with remarks); print/PDF: legacy register layout, **Landscape Legal/Long bond**, batch header + lines + totals + charging breakdown + four signature lines (Prepared/Checked/Verified/Approved auto-named) — both Consolidated and Per-Project variants.
- **SRS:** 5.2.3 (PS-010..064), 5.2.2 decisions 1–4.

#### A6 · Payslips

- **Purpose:** per-employee output of an Approved batch; matches the legacy payslip exactly.
- **Primary roles:** PO + Owner (all); Employee (own via H12); HR reprint for re-issues.
- **Layout & components:** payslip list (solid) per batch → payslip view (solid document panel): header (JC ELECTROFIELDS POWER SYSTEMS INC., Payroll Period Covered, Employee Name, Office/Department, Daily Rate, Rate/Hour = ÷8); **Basic Pay block** — all multiplier rows always shown even at zero (Total Work Hours 1.00 · Sunday 1.30 · Special Holiday 1.30 · Regular Holiday 2.00 · Rest Day–Spc Hol 1.50 · Rest Day–Reg Hol 2.60 · Double Holiday 3.00 · R.Day–Double Hol 3.90 · Travel Hours (legacy, zero) · Night Diff'l ×1.10 · TOTAL BASIC); **Overtime block** (Regular OT 1.25 · Sunday OT 1.69 · … · R.Day–Double Hol OT 5.07 · Night Diff'l OT · TOTAL OVERTIME); **Allowances** (Allowance, Project, Meal, Others); TOTAL EARNINGS; **Mandatory Contribution** (SSS, PhilHealth, Pag-IBIG, TOTAL CONTRIBUTION); **Loan Payment** display group (SSS Loan, Pag-IBIG Loan, W/Holding Tax, Others, Cash Advances, C.A 1st & 3rd Week, Unreturned Changed, TOTAL LOAN PAYMENTS); TOTAL DEDUCTIONS; **NET PAY**; **Balances** (post-deduction running balances: SSS Loan, Pag-IBIG Loan, Cash Advances); signature block (Received By + Date — print-only).
- **Actions & states:** read-only (corrections go through batch revert/regenerate); print one per page, Portrait Letter/A4, never split across pages (scale to fit); **bulk PDF export** of all Approved payslips in line_no order; unavailable for batches below Approved.
- **SRS:** 5.2.4 (PSL-001..010); 5.12 #25–26 (Travel hours excluded from pay; Settings matrix governs the 3.38 vs 2.99 discrepancy).

#### A7 · Sales — billing statement register

- **Purpose:** unified register of every billing statement (Service Invoices + SOAs) — the system version of the legacy "BILLING STATEMENT SUMMARY".
- **Primary roles:** Staff (entry), Lead (approve/reports), Owner.
- **Layout & components:** toolbar (glass): **`+ Issue Service Invoice`** and **`+ Issue Statement of Account`** side-by-side; register (solid): Date, document_type chip (SI · SOA), Document Number, OR/CR Reference, Company Name (Client), SO#, Client TIN, Particulars, DEBIT columns (trade_receivable, down_payment, retention), CREDIT columns (vat_sales, vat, zero_rated, vat_exempt), Status chip (**Issued · Partially Paid · Paid · Cancelled · Credited**), outstanding balance.
- **Data & fields:** per row as above; multiple SO#s per statement allowed; over-billing guard surfaces as row warning.
- **Actions & states:** filters (client, SO#, date range, type, status); duplicate-from-previous (same type); print register (SAL-002 legacy layout) + PDF; drill to statement detail.
- **SRS:** 5.3, 5.12 #6–12.

#### A8 · Issue Service Invoice

- **Purpose:** BIR-compliant VAT invoice entry matching the pre-printed booklet; "looks like the paper, works like a modern form."
- **Primary roles:** Staff/Lead.
- **Layout & components:** two-pane: solid form left, **live print preview** right (glass frame holding a solid page render). Header: Service Invoice No. (manual from booklet; hint shows last SI issued to catch out-of-sequence), Date, Customer (Clients list → auto Address, TIN), Terms, OSCA/PWD ID # (rare, B2B), SO# (multi allowed); **line items** (dynamic solid table): Qty, Unit, Description (multi-line), Unit Price, Amount _(computed)_, per-line **VAT classification picker** (VATable · VAT-Exempt · Zero-Rated); totals block _(auto)_: VATable Sales, VAT-Exempt Sales, Zero-Rated Sales, VAT Amount (12%), Total Sales (VAT Inclusive), Less VAT, Amount Net of VAT, Less SC/PWD Discount (out of scope v1), Amount Due, Add VAT, TOTAL AMOUNT DUE; signature: Authorized Representative (picked per document).
- **Actions & states:** Save Draft (forgiving) vs **Issue** (validates: Customer, Date, SI No., TIN, SO#, ≥1 line; posts to books); print right after Issue (deferrable); one-page rule (warn + offer split if lines overflow); edit-after-Issue allowed with audit trail; Void with reason.
- **SRS:** 5.3 entry point 1, UX list, SAL-001/003.

#### A9 · Issue Statement of Account

- **Purpose:** non-VAT billing document; structured progress billing when the SO carries billing percentages.
- **Primary roles:** Staff/Lead.
- **Layout & components:** same two-pane pattern as A8. Header: SOA No. (auto-sequential), Date, Billed To (Clients list → Address), SO#. **Body mode A — Billing Breakdown** (auto when the linked SO has Down Payment % / Retention % / DP Recoupment %): project header text (defaults to SO Project Name); context _(read-only, always printed)_: Contract Price, Down Payment (= Contract × DP%), prior billings list (label, %, gross); this-billing inputs: Billing label (auto "8th Billing", editable), Billing % of Contract ⇄ Gross amount (linked two-way), Retention % → Retention amount, DP Recoupment % → amount (suppressed once DP fully recouped), **Net Amount (Total)** = Gross − Retention − Recoupment; right-side Qty `1 Lot` / Unit Cost / Total auto from Net. **Body mode B — simple line items**: Item, Particulars, Qty, Unit Cost, Total Amount _(computed)_. Footer: Final Amount, Amount in Words _(auto, asterisk style)_; signatures: Authorized by (Billing & Collection Officer), Approved by (Accounting Head) — picked per document.
- **Actions & states:** Save Draft / Issue (requires Billed To, Date, SOA No., SO#, ≥1 line); print after Issue; mapping to register: trade_receivable = Net, retention = Retention amt, down_payment = Recoupment amt.
- **SRS:** 5.3 entry point 2, 9.3 progress-billing fields.

#### A10 · Collections register

- **Purpose:** every payment received against billings — system version of the 2026 Collections register.
- **Primary roles:** Staff (entry), Lead, Owner.
- **Layout & components:** toolbar (glass): **`+ Issue Collection Receipt`** / **`+ Issue Acknowledgement Receipt`**; register (solid): Date, document*type chip (CR · AR), Document Number, Client, TIN, SO#, Billing Statement reference (SI/SOA), Particulars, **trade_receivables**, **creditable_tax** (2% CWT default), **banks** *(net, the reconciliation figure — subtly highlighted)\_, Status (Issued · Voided).
- **Actions & states:** filters; print register (COL-003) + PDF; partial payments tracked — receipt below outstanding flags the billing Partially Paid and leaves balance open; void restores the source billing's balance (audited).
- **SRS:** 5.4, 5.12 #9.

#### A11 · Issue Collection Receipt

- **Purpose:** record a VAT collection against a Service Invoice (BIR pre-printed booklet).
- **Primary roles:** Staff/Lead.
- **Layout & components:** two-pane form + live preview. Fields: CR No. (manual from booklet, last-number hint), Date, Received from (Client → TIN, address), SO#, Source SI No. (→ shows **outstanding balance**; amount defaults to it), the sum of pesos in words _(auto)_, figures (trade*receivables), In partial/full payment for (Particulars), Creditable Tax *(auto 2%, editable)_, Banks (Net) _(auto = gross − CWT)\_, BY Cashier/Authorized Signature (picked per document).
- **Actions & states:** Draft/Issue (Client, Date, CR No., SI No., amount > 0, signatory); print includes BIR note "THIS DOCUMENT IS NOT VALID FOR CLAIMING INPUT TAXES" + ATP/permit footer (COL-001); partial-payment flag; void.
- **SRS:** 5.4 entry point 1.

#### A12 · Issue Acknowledgement Receipt

- **Purpose:** record a non-VAT collection against an SOA; internal two-copy receipt.
- **Primary roles:** Staff/Lead.
- **Layout & components:** two-pane form + preview. Fields: Date, AR No. (auto-sequential), SOA No., SO#, Received payment from (Client), amount in words + figures (trade*receivables), Payment for (Particulars), payment details: Cash Payment, Bank & Check No., Check Date; Creditable Tax *(auto, editable)_, Banks (Net) _(auto)\_; Received by (picked per document).
- **Actions & states:** Draft/Issue (Client, Date, AR No., SOA No., SO#, amount > 0, signatory); **print = two identical copies stacked on one page** (COL-002); partials; void.
- **SRS:** 5.4 entry point 2.

#### A13 · Payable Voucher register + Payment Request worksheet

- **Purpose:** queue and find every outgoing-payment authorization; mirror of the legacy PR worksheet.
- **Primary roles:** Staff (entry), Lead (approve flow visibility), Finance/AP (cross-read), Owner.
- **Layout & components:** register (solid): cv_number (CV-XXXX), cv_date, payee_type chip (Supplier · Employee · Other), payee_name, project_tag + sales_order_no, rfp_no, po_no, invoice_no, gross_amount, withholding_tax_amount, net_amount, Status chip (**Draft · Pending VP-Finance · Pending President · Approved · Paid · Voided**); secondary tab: **Payment Request worksheet view** (legacy columns: JCE-PR, Date, Payee, TIN, Address, Invoice no., Project, RFP NO., Sundry Account, Amount — negatives in parentheses, Description, ATC, SO NO.) printable (PV-002).
- **Actions & states:** filters (date, project, payee, status); batch PRs into vouchers; export multi-page PDF (PV-003); open → A14.
- **SRS:** 5.5.

#### A14 · Payable Voucher — form/detail

- **Purpose:** create and authorize one payment; carries the double-entry journal and the execution evidence.
- **Primary roles:** Staff (prepare); VP-Finance & President (approve — via queue); Finance/AP; Owner.
- **Layout & components:** solid form: cv*number (suggested, overridable, unique), cv_date; payee zone: payee_type radio → lookup (Suppliers / Employees / Other) → auto payee_name/address/TIN; project: sales_order_no (→ project_tag); references: pr_ref_no, rfp_no (RFP-PUR-YYMM####), po_no (hard FK for supplier payments), invoice_no; payment_particulars (multi-line); **line items** (multiple, each to its own CoA account — Description/Qty/Unit/Unit Price/Amount); amounts: gross_amount, atc_code dropdown (EWT inherited from RFP when linked — display, not recompute), withholding_tax_amount *(auto/override)_, net_amount _(read-only)_, amount_in_words _(auto)\_; journal block (solid, ledger-styled): debit_account(s) (Sundry — CoA picker), credit Cash-in-Bank / 20004 Voucher's Payable per two-step model; payment execution: payment_method (Bank Transfer · Check · Cash · Petty Cash Fund), payment_bank (JCE banks), recipient bank/account/name (from SupplierBankAccount, filtered by currency, primary first), check_no/check_date, bank_reference_no + payment_executed_at (manual paste after execution); attachments (invoice, RFP scan, PO copy, bank confirmation, signed voucher); joint payees supported ("NELDA MENDOZA/JOCEN CANITAN").
- **Actions & states:** Draft → Issue → routes Pending VP-Finance → Pending President → Approved → (record execution) → Paid; withholding preview inline (`Gross 39,000 − WHT(1%) 390 = Net 38,610`); print matches legacy "BANK PAYMENT VOUCHER" layout incl. journal block, 3 sign-off slots + "Payment received by" (paper-only); void posts reversal; PCF replenishment uses multi-line debit; status changes append-only (PV-004).
- **SRS:** 5.5, 5.12 #13–18.

#### A15 · Disbursement register + record + bank reconciliation

- **Purpose:** the bank-side execution layer: what actually left which bank, when; basic reconciliation.
- **Primary roles:** Staff/Lead; Finance/AP; Owner.
- **Layout & components:** register (solid, legacy-shaped): DATE, CV NO, PAYEE, DESCRIPTION, CHECK DATE, CHECK NO (shared check*no groups render visually grouped), BANK ACCOUNT (e.g., 067-4, 852-5), amount (Voucher's Payable Dr); **Record Disbursement** drawer from an Approved CV: cv_no *(read-only)_, payee/description/net_amount _(read-only)\_, disbursement_date, payment_method radio, check_no (+ multi-CV check warning), check_date, bank_reference_no, bank_account (CoA 10001–10012), attachments; journal auto: Dr 20004 Voucher's Payable / Cr bank; **Bank Reconciliation Worksheet** (read-only solid view): per-bank grouped disbursements, period totals, running cash position.
- **Actions & states:** record → CV flips Paid; void (reversing entry, CV back to Approved, reason logged — DISB-004); filters: project ("ALL PROJECT" default), bank, method, period; print/PDF in the bank-pivot layout, Landscape Legal (DISB-005/006).
- **SRS:** 5.6, 5.12 #16, #19–20.

#### A16 · Journal Voucher

- **Purpose:** hand-built double-entry workspace — adjustments, reclasses, VAT settlement, corrections — and the Cash Advance Liquidation wizard.
- **Primary roles:** Staff (prepare), Lead (check/post), Owner.
- **Layout & components:** JV list (solid): jv_series_no (JV-XXXX), jv_date, jv_category, project_so_no/project_label, payee, description, total, Status (**Draft · Pending Check · Posted · Reversed**); **New JV** (solid): header (number auto, date, category dropdown: Cash Advance Liquidation · Period-End Adjustment · Reclassification · Depreciation Run · VAT Settlement · Write-Off · Closing Entry · Error Correction · Inter-Bank Transfer · Other; project lookup; payee; description); **lines table** — reference (optional, e.g., `CV-1635`), account_code (CoA search by prefix or fuzzy name), description, debit, credit (one side per line); running footer `Σ Debits | Σ Credits | Difference` — must equal 0.00 to Post; attachments (receipts, schedules). **CA Liquidation wizard** (category-triggered guided layout): pick source CV → prefills outstanding balance, payee, project, cash_advance_ref (CA-YY-XXXX); enter expense breakdown + returned cash; validates `Σ expenses + returned cash = outstanding balance`.
- **Actions & states:** Save Draft (may be unbalanced, warned) → Submit for Check → Post (immutable); **Reverse** = auto-flipped draft JV citing original (`reverses_jv_id`, description prefixed `REVERSAL OF JV-XXXX:`); print legacy layout (header, line table, totals, narrative, two-signature block — Prepared by / Checked by), Portrait; audit per JV-007.
- **SRS:** 5.7, 5.12 #21–23.

#### A17 · Cash Advance ledger

- **Purpose:** first-class registry of cash advances: issued → outstanding → liquidated; aging for stale advances.
- **Primary roles:** Staff/Lead/PO per ownership; Owner.
- **Layout & components:** solid table: ca_no (CA-YY-XXXX), issued_to, project_so_no, issued_amount, source CV, status (Outstanding · Liquidated), liquidating JV, outstanding_balance, age bucket (0–30/31–60/61–90/90+); aging summary tiles (glass).
- **Actions & states:** drill to CV/JV; "stale advance" highlight; export.
- **SRS:** 5.7 option 3 (confirmed 5.12 #21), 5.9 C-6.

#### A18 · Reporting hub

- **Purpose:** financial statements, statutory outputs, and operational reports with drill-down and snapshots.
- **Primary roles:** Lead + Owner (full); PO (payroll-related); others per RBAC (RPT-011).
- **Layout & components:** catalog (glass cards grouped by family) → generate panel (solid): report_type; as_of_date or period_start/end (quick-picks: this/last month/quarter/year); comparative checkbox (default on for statements); project_filter; "display all CoA accounts" toggle (TB, default checked); render → **report viewer** (solid, hierarchical): **A. Core** — Trial Balance (every CoA account, beginning balance + per-period activity + cumulative, Landscape Long bond), Balance Sheet (Roman-numeral lines I–XXXV under tinted section bands: Current Assets → Stockholders Equity), Income Statement BIR-1702 (Sched I–XLI: Sales → Cost of Sales → Gross Profit → Operating Expense → Net Income), Cash Flow (indirect; Operating/Investing/Financing always shown); **B. Statutory** — BIR 1601-C, 1601-EQ, 2550M/Q, 1702, alphalists 1604-CF/E, SSS R-3/R-5, PhilHealth ER2, Pag-IBIG MCRF, loan-collection lists — each via a guided wizard (period + RDO/branch params) in agency layout; **C. Operational** — Bank Disbursement register, Billing register, Collections register, AR Aging (0–30/31–60/61–90/90+), AP Aging, Cash Advance Aging, Cash Position (per bank + 30-day trend), Project Costing summary, Payroll registers, Loan Ledger, PO Monitoring, Spend analytics, Supplier spend/performance, Open POs; **D. Custom** — GL drill-down (account → entries → source doc), profitability by client, cash-flow projection 30/60/90.
- **Data & fields:** mapping_version drives BS/IS lines (A1 §9); generated_at/by; snapshot_file metadata.
- **Actions & states:** **drill-down** everywhere (line → accounts → journal entries → CV/SI/CR/JV); export PDF/Excel; **Snapshot** (immutable file, auto at period close per 5.12 #28); live-vs-snapshot labeling; placeholder Notes headers (v1).
- **SRS:** 5.9 (RPT-001..011), 5.12 #28–31.

#### A19 · Clients admin

- **Purpose:** maintained Clients entity feeding SI/SOA/CR/AR auto-fill.
- **Primary roles:** Staff/Lead.
- **Layout & components:** solid table + drawer: client name, address, TIN; per-client sub-ledger link (AR balance from A7/A10).
- **Actions & states:** CRUD with audit; merge-safe duplicate warning; used-by indicator.
- **SRS:** 5.12 #6, #11.

### 5.D Project Management (PMG) Module

The computation heart of the system: the PM head keys exactly one judgment per line per period (_This Period %_) and the system derives everything else. **Only the PM Head can create/edit/submit** projects, BOQs, variation orders, and accomplishment periods; everyone else is read-only.

#### P1 · PMG dashboard

- **Purpose:** PMG landing — what needs attention.
- **Primary roles:** PM Head, PMG Staff; Owner/Admin read.
- **Layout & components:** KPI tiles (glass): portfolio status counts, projects needing a period update, open MRs by status; recent stock movements feed (glass card, solid list, read from Warehouse).
- **Actions & states:** tile click-through; empty states.
- **SRS:** FR-XC-03.

#### P2 · Project portfolio

- **Purpose:** every JCE project on one screen.
- **Primary roles:** PM Head (full), PMG Staff (read), Site Engineer (assigned only).
- **Layout & components:** project cards or rows (glass cards over backdrop; dense list toggle → solid table): project name, client, **% complete (Grand Total to date)** with progress ring, this-period gain, current period (PBn), billing status, last-updated timestamp + author, "next milestone" microcopy (from P12 feed).
- **Actions & states:** filter/sort by client, % complete, last-updated, billing status; click → P5/P8; empty state with "New project" CTA.
- **SRS:** 6.7 (FR-PORT-01..05), FR-TL-03.

#### P3 · New project — BOQ import wizard

- **Purpose:** primary intake path: upload the PM head's BOQ spreadsheet, confirm, commit. Never a silent auto-parse.
- **Primary roles:** PM Head.
- **Layout & components:** 6-step wizard (glass stepper, solid step bodies): **1 Upload** (.xlsx dropzone) → **2 Sheet select** (default first/largest) → **3 Confirm header** (project title, client/cooperative, location, SO/contract no., contract amount, start + target dates, DP-recoupment % default 15, retention % default 10) → **4 Column mapping** (detected source columns ITEM/DESCRIPTION/QTY./UNIT/UNIT PRICE/TOTAL → system fields via dropdowns; low-confidence mappings flagged and **block commit** until confirmed or ignored) → **5 Row preview** (parsed categories, lines, Procure/Deliver/Install sub-rows, auto-computed weights; summary: line count, staged count, grand total, opening period) → **6 Commit** (nothing persists earlier).
- **Actions & states:** back/forward preserving state; error per row; success → P5. Acceptance anchor: importing the NORECO2 sample reproduces grand total **₱53,277,688** and per-line weights within rounding.
- **SRS:** 6.4.1 (FR-INT-01..03, 06).

#### P4 · New project — clone & manual builder

- **Purpose:** fallback intake paths.
- **Primary roles:** PM Head.
- **Layout & components:** **Clone:** pick source project → copies BOQ structure → edit header/quantities/prices; clone is independent of source. **Manual builder:** header form, then add category → add line; per line pick `line_type` (**Staged** requires all three P/D/I amounts; **Single** takes one amount); weights recompute live and are never typed.
- **Actions & states:** validation (staged lines missing a P/D/I amount are rejected); commit → P5.
- **SRS:** 6.4.2–6.4.3 (FR-INT-04..05).

#### P5 · Project header

- **Purpose:** the master record of a job.
- **Primary roles:** PM Head (edit); others read.
- **Layout & components:** header card (glass): project_code, project_name, project_type (Customer · Internal Cost Center), status chip (Active · On Hold · Completed · Cancelled); solid detail panels: client/cooperative, location, sales_order_id (required for Customer; null for cost centres), contract_amount, start_date, target_date, dp_recoupment_pct, retention_pct; **contract values strip: original contract value · approved variations to date · revised contract value** (FR-VO-04); links: BOQ (P6), periods (P8), billing (P9), MRs (P11), timeline (P12), warehouse ledger (W2).
- **Actions & states:** edit (audited); attachments (polymorphic uploads).
- **SRS:** 6.3.2, FR-XC-01.

#### P6 · BOQ view/editor

- **Purpose:** the contract line-item set with derived weighting.
- **Primary roles:** PM Head (edit pre-lock; changes mid-project go through P7); others read.
- **Layout & components:** solid hierarchical grid: Category bands → lines: item no., description, qty, unit, unit price, line total, **line weight %** _(derived)_; Staged lines expand to 3 stage rows (Procure / Deliver / Install) each with amount + **stage weight %** _(derived; sums to line weight)_; grand total bar (sticky) with Σ weights = 100% indicator (out-of-tolerance variance surfaced).
- **Actions & states:** editing any amount recomputes line weight, stage weights, grand total **atomically**; weights stored high-precision, displayed at source precision; never typed.
- **SRS:** 6.5 (FR-BOQ-01..04), 6.3.4.

#### P7 · Variation orders

- **Purpose:** controlled mid-project BOQ changes.
- **Primary roles:** PM Head only (role-gated); others read.
- **Layout & components:** VO list (solid): number, date, description, status (Draft → Approved), deltas summary; VO editor: line deltas — add line / revise line (qty, unit price, P/D/I amounts) / remove line — with before/after preview and grand-total impact.
- **Actions & states:** approve → recomputes grand total + all weights, retains pre-change BOQ snapshot; **policy (A) prospective**: locked periods keep their billed pesos; variation applies from the next open period against the revised contract value; recoupment cap and retention basis recompute (FR-VO-05); fully audited.
- **SRS:** 6.5.5 (FR-VO-01..05).

#### P8 · Accomplishment report workspace

- **Purpose:** the core deliverable — per-period progress entry in the PM head's exact layout, with live NET AMOUNT math and a lock-on-submit period model.
- **Primary roles:** PM Head (sole editor); all others read-only.
- **Layout & components:** period bar (glass): PB selector (PB1, PB2…), "as of" date, status (Draft · Submitted/Locked); report header mirrors source (title, client/cooperative, project, location, grand-total row); **report grid (solid, byte-faithful column order)**: per line/stage — Previous %, **This Period %** _(the only editable cells — visually distinct input styling)_, To Date %, weight, this*period_weighted, to_date_weighted, peso amounts; **NET AMOUNT block** (solid card, ledger-styled): Progress Bill (PBn = Σ this-period line amounts) − DP recoupment *(min(dp% × PBn, downpayment*remaining))* − retention _(retention% × PBn)_ = **Net Amount (PBn)**; running indicators: recouped-to-date, remaining downpayment, retention held-to-date, outstanding retention payable; **flags:** stage-sequence guardrail (warn when Install advances while Procure/Deliver < 100% — soft block, override with recorded reason) and **delivery cross-check** (read-only "reported ahead of delivery" flag when reported % exceeds what Purchasing's import-tracker stage implies; Procure↔stages 1–7, Deliver↔8–13, Install↔14–15; informational only, never blocks).
- **Data & fields:** validation 0–100%, To-Date ≤ 100%; subsequent periods open from the locked To-Date baseline. Reference: NORECO2 PB1 = 11.34% accomplishment, PB ₱6,039,221.60 − ₱905,883.24 − ₱603,922.16 = **₱4,529,416.20**.
- **Actions & states:** live recompute on every keyed %; Submit → period **locks (immutable)**; corrections = next-period adjusting entry (default) or audited re-open (full snapshot); **print/PDF: byte-faithful to the PM head's spreadsheet — columns, headers, totals, styling** (on-screen view is free; print is sacred); attachments (signed report scans).
- **SRS:** 6.6 (FR-ACC-01..07, FR-PB-01..05, FR-XCK-01..03), 6.14 #1, #7, #9.

#### P9 · Progress billing history & ledgers

- **Purpose:** the financial trail across periods: every PBn, the capped recoupment ledger, the held/released retention ledger.
- **Primary roles:** PM Head (release actions); Lead/Owner read.
- **Layout & components:** billing history table (solid): per period — PBn label, as-of date, % gain, PB amount, recoupment, retention, Net Amount, status; **RecoupmentLedger** panel: downpayment_amount (= dp% × contract), per-period recoupment, downpayment_remaining (→ 0 then recoupment stops); **RetentionLedger** panel: per-period retention added, **release events** (manual, role-gated, audited; full or tranches per contract schedule), outstanding retention payable. A release is its own billing line, never a negative deduction.
- **Actions & states:** trigger retention release (PM Head; confirm + reason); export.
- **SRS:** 6.6.4–6.6.6, 6.14 #4, FR-XC-04.

#### P10 · Material Request form (JCE-F-WMS02)

- **Purpose:** author an MR with enforced inventory-first flow; only the unfulfillable remainder goes to Purchasing.
- **Primary roles:** PMG Staff + PM Head (create/edit); Warehouse verifies (W8); Department Head approves offline.
- **Layout & components:** solid form titled MATERIAL REQUEST: header — Date, **MR No.** (global running sequence, never reset; legacy `JCE-GARCIA 3-0258` style is display-only on migrated rows), Name of Project (FK), SO No. (FK), Date Required, General Purpose for Request; **lines grid:** Item no. · Description · Purpose · **Requested** (Qty, Unit) · **Available Stock** (Qty, Unit — auto = on_hand − reserved on item select) · **For Purchase** (Qty, Unit — computed = max(0, Requested − Available), updates live) · **Canvass Sheet** (Supplier A / B / C quotes); new items may be created inline (persist to W3 immediately); footer form code `JCE-F-WMS02`; **print-only signatory blocks:** Requested by · Noted by · Received by (Purchasing) · Approved by (Department Head) · Verified by Warehouse.
- **Actions & states:** Draft → submit → **on approval:** in-stock quantities reserved (StockReservation), For-Purchase lines flow to Purchasing with canvass quotes; fully-stocked lines produce zero For-Purchase and no hand-off; fulfillment converts reservation → issue (via W5); status surface: Pending approval · Approved · Fulfilled/Closed; print reproduces the form layout exactly.
- **SRS:** 6.10 (FR-MR-01..06), 6.14 #2, §10.11.

#### P11 · MR register

- **Purpose:** find every MR; the per-project MR register.
- **Primary roles:** PMG, Purchasing (read of For-Purchase hand-offs), Warehouse.
- **Layout & components:** solid table: MR No., date, project, SO No., line count, reserved vs for-purchase summary, status, Verified-by-Warehouse status chip.
- **Actions & states:** filters (project, status, date); open → P10 record view; export.
- **SRS:** 6.10, FR-XC-04.

#### P12 · Activity timeline

- **Purpose:** per-project chronological feed making "the latest update" presentable.
- **Primary roles:** all PMG readers.
- **Layout & components:** vertical feed (glass cards on the project page): event type icon, timestamp, actor, short summary, link to source — period posted, MR issued, PO raised (from §7), delivery/stock receipt; newest first; compact "updated X ago by [name] · next milestone" summary feeds P2 cards.
- **SRS:** 6.8 (FR-TL-01..04).

#### P13 · PMG audit log

- **Purpose:** department-scoped immutable log.
- **Primary roles:** PM Head; Owner/Admin.
- **Layout & components/fields:** solid table — actor, timestamp, entity, action, before/after (VOs and re-opens retain full snapshots): project create/edit, BOQ edit, VO approval, period submit/re-open, retention release, MR approval, stock adjustment.
- **SRS:** 6.11 (FR-LOG-01..03).

#### P14 · [Phase 2] Field photo evidence

- **Purpose:** site engineers attach progress photos per BOQ line/stage; PM head reviews before keying %.
- **Primary roles:** Site Engineer (capture), PM Head (review).
- **Layout & components:** mobile-friendly capture flow (large touch targets, camera-first); photo gallery per line/stage (solid grid, lightbox); review badge on P8 rows that have photos.
- **Actions & states:** upload, caption, link to period; review state.
- **SRS:** 6.15.1.

#### P15 · [Phase 2] BOQ template library

- **Purpose:** curated reusable BOQs for repeat job types (substation classes).
- **Layout & components:** template cards (glass) → template detail (solid BOQ grid); "Start project from template" enters P3 step 3.
- **SRS:** 6.15.2.

#### P16 · [Phase 2] S-curve & progress charting

- **Purpose:** planned-vs-actual S-curve per project; portfolio heatmap.
- **Layout & components:** chart panel (solid chart surface inside glass card) — S-curve from period history; heatmap grid across portfolio.
- **SRS:** 6.15.3.

#### P17 · [Phase 2] MR → PO → delivery traceability board

- **Purpose:** end-to-end view linking each For-Purchase MR line to its PO, shipment stage, and stock receipt.
- **Layout & components:** board/table (solid): MR line → PO No. → import stage (1–15 chip) → MRR receipt; status lights per hop.
- **SRS:** 6.15.4.

#### P18 · [Phase 2] Document pack export

- **Purpose:** one-click bundle per progress billing (report + NET AMOUNT + attachments) as a PDF set.
- **Layout & components:** per-period "Export pack" action + pack contents checklist (solid).
- **SRS:** 6.15.7.

#### P19 · [Phase 2] Project budget vs actual (PMG side)

- **Purpose:** BOQ contract value vs committed POs and issued materials per project.
- **Layout & components:** per-project budget panel: contract, committed, actual, remaining, % used bars.
- **SRS:** 6.15.8 (ties to U21).

### 5.E Purchasing Module

Document-heavy and transactional: every record prints to a wet-signed PDF; the system tracks status. PO `type` (Local · Import) is the central branch: Local = PHP, VAT-inclusive math, `YYMM####` numbering; Import = USD (or other), Incoterms, `YYMM####IC`, auto-spawns the 15-stage tracker.

#### U1 · Purchasing dashboard

- **Purpose:** landing — POs awaiting approval, balances due this week, shipments arriving soon, shipments missing documents, spend snapshots.
- **Primary roles:** Purchasing Staff/Supervisor, Finance/AP, Management/President (read), Owner.
- **Layout & components:** KPI tiles (glass) + lists (glass cards, solid lists) deep-linking into U2/U7/U12; spend snapshot mini-charts (solid chart surfaces).
- **SRS:** FR-X-04.

#### U2 · PO monitoring ledger

- **Purpose:** the searchable register of all POs.
- **Primary roles:** all Purchasing roles; PM Head/Accounting cross-read.
- **Layout & components:** toolbar (glass): **Local / Import / All** toggle, filters (project, supplier, status, payment status, date range, amount range, type), full-text search (PO No., supplier, project, MR No., SO No., item descriptions); register (solid), **default grouped/collapsed by Project**: PO No., Type chip, Date, Project, Supplier, Description summary, Amount (with currency code), Status chip (Draft · For Approval · Approved · Sent · Closed · Cancelled/Void), **Payment Status chip — derived, never typed** (Unpaid · Downpayment Paid · Fully Paid), SO No., MR No., link → Import tracker (import rows) / 5-stage tracker (local rows, "Current Stage" column).
- **Actions & states:** sort any column; paginate; CSV/Excel export respecting filters; row → U4.
- **SRS:** 7.6 (FR-LED-01..08), 7.15.5.

#### U3 · PO create/edit

- **Purpose:** one form that branches on type; supplier selection auto-fills everything supplier-derived.
- **Primary roles:** Purchasing Staff (create), Supervisor (verify/approve via queue).
- **Layout & components:** solid form: PO Number _(auto on leaving Draft; read-only; derived from PO date not system clock; monthly reset; separate Local/Import counters)_, PO Date, Type (Local · Import), Supplier (FK → auto Supplier Name, Address, TIN, Contact Person, Contact No., Email), Project (FK), SO No. (FK, `N/A` allowed), MR No. (FK), Payment Terms (from supplier TOP, editable), Purpose/Notes; **Local-only:** Currency = PHP, Vatable (default true), Delivery Date, Delivery Address (defaults `2129 La Mesa Street, Ugong, Valenzuela`); **Import-only:** Currency (default USD), Incoterm (`DDP JCE`, `CIF CEBU`…), Delivery Period (`10 days upon receipt of payment`), Product Warranty, Ref. No., Discount; **line items** (dynamic solid table): Line #/SN auto, Qty, Unit, Description (multi-line spec blocks for imports), Unit Price, Total Amount _(computed)_; totals: Local **VAT-inclusive** — TOTAL = Σ lines, Net = TOTAL ÷ 1.12, VAT = Net × 0.12 (sample: 60,880 → 54,357.14 + 6,522.86); when vatable = false, Net = TOTAL, VAT = 0; Import — Sub-Total, Discount, Grand Total `USD 927.00`.
- **Actions & states:** Draft (no number consumed) → submit For Approval (threshold-routed chain per X6) → Approved (import: spawns U7 tracker) → Sent → Closed; ≥1 line required to leave Draft; `"Nothing Follows"` terminator prints after last line.
- **SRS:** 7.4 (FR-NUM-01..06), 7.5 (FR-PO-01..05), 7.15.4.

#### U4 · PO detail + PDF

- **Purpose:** the PO record and its print-ready PDF.
- **Primary roles:** all Purchasing; approvers.
- **Layout & components:** document header card (glass): PO No., type chip, status stepper; solid detail mirroring U3; **PDF preview** (solid page render in glass frame) using the template matching type — header, PO No./date, supplier block, sales terms, line table, totals, notes, **signatory block** (admin-configured names/positions, blank signature + date lines): Local = Prepared by Purchasing Assistant · Verified by Purchasing Supervisor · Approved by Fin./Admin Manager · Supplier's Conforme (President); Import = Prepared by Asst. Purchasing Head · Verified by Senior Engineer · Approved by (role) · Supplier's Conforme (President); linked panel: RFPs, GoodsReceipts/MRRs (cumulative received per line, "Fully Received" flags), tracker link.
- **Actions & states:** regenerate PDF (reflects current saved data); download; store as attachment; void/cancel retains number.
- **SRS:** 7.5.6–7.5.8 (FR-PO-06..10), 7.15.1 (FR-GR-04).

#### U5 · RFP register

- **Purpose:** all Requests For Payment.
- **Primary roles:** Purchasing Staff (create), Supervisor (verify/authorize), Finance/AP, Accounting (receive).
- **Layout & components:** solid register: RFP No. (`RFP-PUR-YYMM####`, auto on submit), Date, PO No., Supplier, Project, type (Downpayment · Balance · Single), Due Date, net payment, Status chip (**Draft → Submitted → Verified/Authorized → Received (Accounting) → Paid**).
- **Actions & states:** filters; import POs show their two linked RFPs with reconcile-to-grand-total warning when DP + Balance ≠ PO total.
- **SRS:** 7.7 (FR-RFP-01, 07, 08), 7.12 #10.

#### U6 · RFP form/detail

- **Purpose:** create an RFP from an Approved PO; computes EWT; prints to the JCE form.
- **Primary roles:** as U5.
- **Layout & components:** solid form, two zones mirroring the paper: **Originator zone** — RFP No. _(auto)_, Date, Project, Purchase Order No. (Approved POs only; inherits Project, Supplier, TIN, Address, Payment Terms), Date Delivered, Due Date; **line items:** Reference no., QTY, UOM, Particulars, Unit Price, VAT Payment column, Non-VAT Payment column; `"NOTHING FOLLOWS"` terminator; **totals & EWT:** VAT and Non-VAT columns total separately; classification picker applies EWT (Goods 1% · Services 2% · Rentals 5% · Professional 5/10%, admin-configurable); **Net Payment = Total − withholding**; Amount in words _(auto)_; **Accounting zone** signatories (print-only): Prepared by · Verified & Authorized by · Received by (Accounting) · Checked by, each with a Date line.
- **Actions & states:** blocked from a Draft PO; three-way match gate — RFP cannot leave Draft until PO qty + supplier invoice + MRR received qty reconcile within tolerance (default 1% qty / ₱100; over-tolerance flagged with Supervisor override); marking Paid updates PO payment status and stamps import stage 7/10; PDF matches form layout; attachments.
- **SRS:** 7.7 (FR-RFP-02..11), 7.15.1 (FR-GR-05..07).

#### U7 · Import tracker — 15-stage engine

- **Purpose:** follow each import PO from BOM to onsite delivery.
- **Primary roles:** Purchasing (update), Management/President (stages 4 & 7 approvals), all read.
- **Layout & components:** shipment header (glass): PO No., supplier, progress indicator (n/15 done); **stage list (solid)** — each of the 15 stages a row/card: stage number + name + owner + status chip (Pending · In Progress · Done · Blocked) + target date + actual date + remarks + document slots. The 15: 1 BOM (BDD/PMG) · 2 MR (PMG) · 3 PO + Supplier Quotation · 4 **Approval of Sir Jimwel** · 5 Performa Invoice · 6 Technical Spec & Drawing · 7 **JCE Approval + Downpayment** (RFP/proof) · 8 Production · 9 Delivery Lead Time · 10 Balance Payment (RFP/proof) · 11 **Shipping Documents** — four first-class slots: Bill of Lading (captures **ETD + ETA**), Packing List, Commercial Invoice, Form E · 12 Departure · 13 Arrival · 14 Customs Clearance · 15 Delivery Onsite (Delivery Receipt → MRR).
- **Data & fields:** stages are **not strictly sequential** (8/9 may overlap; 11 docs arrive incrementally); payment dates reconcile with linked RFPs; stage 15 consolidates with the Warehouse MRR (same event, two surfaces).
- **Actions & states:** update status/dates/remarks; upload to slots; alerts: ETA approaching (7/3/1-day), balance payment due/overdue, Blocked beyond threshold — **approval gates 4 & 7 surfaced prominently** (sticky banner when stalled).
- **SRS:** 7.8 (FR-IMP-01..07).

#### U8 · Local PO 5-stage tracker

- **Purpose:** lightweight progress tracking for local POs so a stalled PO is visible.
- **Primary roles:** Purchasing.
- **Layout & components:** horizontal stepper (solid) on the PO detail + a register column: 1 PO Sent _(auto on status Sent)_ → 2 Goods Received _(auto on first MRR; sub-status Partial/Fully Received)_ → 3 Invoice Received _(invoice no., date, attachment)_ → 4 Paid _(auto when RFP Paid)_ → 5 Closed _(auto when Paid + Fully Received; Supervisor override)_; per-stage target/actual dates, owner, remarks.
- **Actions & states:** stall alert (default 14 days); default for POs ≥ ₱20K, opt-in below.
- **SRS:** 7.15.5 (FR-LPO-01..09).

#### U9 · Suppliers list

- **Purpose:** the authoritative supplier master (BDD quotations reference it too).
- **Primary roles:** Purchasing Staff (edit), Supervisor (data quality), all read.
- **Layout & components:** solid table: Supplier Code (`JCE 0000X`, auto, gaps allowed), Supplier Name, TOP (controlled PaymentTerm list), TIN, City/Country, Category, Item/Service Offered (tags), Active flag; search/filter by category, item/service, country/city, active, terms.
- **Actions & states:** create (duplicate guard on Name/TIN); soft delete only (suppliers referenced by POs are never hard-deleted); → U10.
- **SRS:** 7.9 (FR-SUP-01..09).

#### U10 · Supplier record

- **Purpose:** one supplier: identity, terms, bank accounts, performance.
- **Primary roles:** as U9; bank changes gated (Supervisor approval + confirmation evidence).
- **Layout & components:** identity card (glass): code, name, category, active; solid tabs: **Details** (TIN, addresses incl. Warehouse Address, contact first/last, email, mobile, landline, TOP, items/services); **Bank accounts** (SupplierBankAccount sub-entity): bank_name (JCE Banks lookup), account_number, account_name, currency, SWIFT, IBAN, is_primary (one per currency), effective dates, active — **fraud-control state:** new/edited accounts show "pending verification" until Supervisor approval + a logged supplier email/phone confirmation makes them payable-from; **Performance** (passive stats): total spend, PO count, on-time delivery %, last order date (+ Phase 2 reliability score); **POs** (linked register).
- **Actions & states:** audit on every bank change; deactivate.
- **SRS:** 7.9, 7.15.2 (FR-SBA-01..06).

#### U11 · Purchase Requisition (PRQ)

- **Purpose:** pre-PO budget authorization: someone with spend authority approves committing money before sourcing.
- **Primary roles:** requestors (PMG/Purchasing staff), threshold-routed approvers.
- **Layout & components:** list (solid): prq_no (`PRQ-YY-XXXX`), prq_date, requestor, project, mr_no, estimated_total + currency, urgency chip (Routine · Urgent · Critical), status (**Draft · Pending Approval · Approved · Rejected · Converted to PO · Cancelled**), current approval step; form (solid): created from an MR (prefills items) or standalone (admin); justification, items[] (description, qty, UOM, est. unit price/line total), urgency (Critical settable by Supervisor+ only); **approval chain panel** — resolved at submit from the threshold table and stored on the record (later table edits don't change it).
- **Actions & states:** approve/reject (reason; Rejected is terminal) per step; Approved → "Create PO" (inherits project, MR, requestor, items; one PR may split into several POs); print PDF; SLA badges (Critical 4h vs Routine 48h).
- **SRS:** 7.15.3 (FR-REQ-01..10).

#### U12 · Approval queue

- **Purpose:** per-user queue of everything awaiting their decision across entity types.
- **Primary roles:** every approver (Supervisor, Fin/Admin Manager, President/Sir Jimwel, Lead, HR Head…).
- **Layout & components:** queue list (glass cards or solid table toggle): entity chip (PR · PO · RFP · Blanket · import stage 4/7), reference no., payee/supplier, amount + currency, requestor, age, urgency; detail peek (drawer) with the document summary; actions **Approve / Hold / Reject** + note.
- **Actions & states:** decision updates the record + writes audit; sorted by urgency and age; **Vacation Mode** (delegate for a date range; both names logged); empty "all caught up" state. This same surface, responsive at phone widths, is the Phase 2 "Mobile approvals" (U22) — a workflow decision, never an e-signature.
- **SRS:** 7.15.4 (FR-APV-07..10), 7.14.7.

#### U13 · Purchasing audit log

- **Purpose/roles/layout:** department-scoped append-only log (solid table; filters user/date/entity/action; export): PO create/edit/status/void, RFP lifecycle, supplier create/edit/deactivate + bank changes, import stage updates, document uploads/deletes, approval decisions.
- **SRS:** 7.10 (FR-AUD-01..06).

#### U14 · [Phase 1.5] Supplier merge tool

- **Purpose:** consolidate duplicate suppliers from the migrated list (~145 records).
- **Primary roles:** Admin only.
- **Layout & components:** "Find Duplicate Suppliers" → suggested duplicate groups (TIN exact + name fuzzy + same email/phone), e.g. `ABB Inc. / ABB Hitachi / A.B.B.`; group review: pick primary, preview affected counts (POs, RFPs, Quotations), confirm.
- **Actions & states:** atomic FK repoint; duplicates deactivated (never deleted); merge logged; **reversible within 30 days** (un-merge restores); bulk mode for post-migration cleanup.
- **SRS:** 7.15.7 (FR-MRG-01..08).

#### U15 · [Phase 2] RFQ management

- **Purpose:** solicit quotes before raising a PO (procurement-side; distinct from BDD's bid-side Quotation).
- **Layout & components:** RFQ list + form: created from MR or standalone; lines (item, qty, UOM, spec/notes), target response date; invited suppliers; per-supplier quote capture (unit price/currency, lead time, terms, validity, notes — keyed or attached); status (**Draft → Sent → Responses In → Awarded → Converted → Closed**).
- **SRS:** 7.14.1 (FR-RFQ-01, 02, 05, 06).

#### U16 · [Phase 2] RFQ comparison matrix

- **Purpose:** side-by-side award decision.
- **Layout & components:** matrix (solid): rows = items, columns = suppliers; cells show unit/extended price, lead time, terms; **auto-highlight lowest price and shortest lead time** per line and overall; award action → converts to draft PO (prefilled); if awarded quote isn't lowest, **justification note required** and logged.
- **SRS:** 7.14.1 (FR-RFQ-03..05).

#### U17 · [Phase 2] Item / material catalog

- **Purpose:** reusable item master speeding PO/RFQ entry.
- **Layout & components:** catalog table (solid): item code, name, standard description, default UOM, category (two-level taxonomy tree, e.g. `MEP > Electrical > Cable & Wire`), preferred supplier(s), last price + currency, active; tree-filter sidebar (glass); promote-ad-hoc-line-to-catalog one-click.
- **SRS:** 7.14.2 (FR-ITM-01..04), 7.15.8 (FR-ITM-05..08).

#### U18 · [Phase 2] Price history & flags

- **Purpose:** price trend per item (and item × supplier); warn on increases.
- **Layout & components:** trend chart + history table per item (source ref, supplier, unit price, currency, date); entry-time warning chip when a new price exceeds last paid by the configured threshold (e.g., 5%); FX-normalized comparisons.
- **SRS:** 7.14.3 (FR-PRC-01..04).

#### U19 · [Phase 2] BIR withholding reporting

- **Purpose:** Form 2307 per supplier per payment + periodic alphalist.
- **Layout & components:** generation wizard (period, supplier scope) → 2307 render (agency layout) + summary by supplier/ATC; export Excel/DAT; issuance-status tracker per supplier per period.
- **SRS:** 7.14.4 (FR-BIR-01..05).

#### U20 · [Phase 2] Lead-time & supplier reliability

- **Purpose:** turn free-text lead times into computed dates and a reliability score.
- **Layout & components:** structured lead-time editor (trigger event + days); computed expected dates vs actuals with early/on-time/late flags; reliability panel on U10 (on-time %, avg delay, order count) surfaced during supplier selection.
- **SRS:** 7.14.5 (FR-LT-01..05).

#### U21 · [Phase 2] Budget vs actual per project

- **Purpose:** committed (approved + open POs) and actual (paid RFPs) vs budget, with over-budget warnings at PO/PR time.
- **Layout & components:** per-project utilization view: budget, committed, actual, remaining, % used bars; configurable warn vs hard-block behavior.
- **SRS:** 7.14.6 (FR-BUD-01..04).

#### U22 · [Phase 2] Mobile approvals

- **Purpose:** U12 at phone width for the two big stall points (import stages 4 & 7, POs in For Approval).
- **Layout & components:** single-column queue, large Approve/Hold/Reject targets, note input, push/email reminders after N days.
- **SRS:** 7.14.7 (FR-APP-01..05).

#### U23 · [Phase 2] Cycle-time analytics

- **Purpose:** stage duration and bottleneck identification.
- **Layout & components:** per-stage mean/median duration charts; slowest-stage highlight; filters (supplier, project, period, item type); local PO cycle (creation → approved → sent) included.
- **SRS:** 7.14.8 (FR-CYC-01..05).

#### U24 · [Phase 2] Blanket POs

- **Purpose:** ceiling + draw-down purchasing for routine supplies.
- **Layout & components:** blanket list/form: blanket_no (`BPO-YY-XXXX`), supplier, optional project, ceiling_amount + currency, start/end dates, terms, items (with unit-price ceilings), status (**Draft · Active · Suspended · Exhausted · Expired · Closed**); utilization bar (warn 80%, block 100% unless supervisor override); releases table → each release auto-generates a child PO (no fresh approval; carries blanket ref); reporting: utilization %, avg release size, projected exhaustion.
- **SRS:** 7.15.6 (FR-BLK-01..08).

### 5.F Warehouse Module

The inventory system of record. Stock-on-hand is **never typed** — it is the running sum of immutable movements, and movements post **only when a document Locks**. Every operational document (MRR, Release, Transfer) runs the 3-state gate: **Draft → For Checking → Locked**. Site engineers create/submit for assigned sites only; the Warehouse Admin/Owner Locks/Unlocks (every Lock/Unlock audited).

#### W1 · Warehouse dashboard

- **Purpose:** landing in the ARSD pattern: project/cost-centre cards + work queues.
- **Primary roles:** Warehouse Admin (all sites), Site Engineer (assigned sites only), Owner.
- **Layout & components:** **project / cost-centre cards** (glass): project name, type tag (Customer · `WORKSHOP`/`MOTORPOOL`/`JCE STOCK`), headline figures (items, on-hand, open documents) → W2; queues (glass cards, solid lists): documents awaiting checking/lock, open MRs awaiting verification, transfers in transit, items with outstanding reservations, (Phase 2) below-reorder items.
- **SRS:** FR-WXC-03.

#### W2 · Stock monitoring ledger

- **Purpose:** the module's primary screen — one ledger per project or cost centre, BOQ-driven.
- **Primary roles:** Warehouse Admin; Site Engineer (assigned); PM Head/PMG read; Owner.
- **Layout & components:** ledger header (glass): project picker, location filter, search (WBS/item/resource), export; **ledger grid (solid, full-bleed):** per item row — WBS/BOQ ref (customer projects), Item description, Resource/unit, Unit cost (optional), **Planned** (from BOQ), **Undelivered** (= planned − delivered), **Delivered** (Σ Locked MRR receipts), **Utilized** (Σ Locked Release issues), **Running Balance** (= delivered − utilized), **Variance** (= delivered − planned; **"—" for off-BOQ rows**, never a misleading negative); row expander → per-Location breakdown (Main Office + sites) and movement history; cost-centre ledgers hide Planned/Variance entirely (Balance = Delivered − Utilized).
- **Data & fields:** off-BOQ rows tagged **"no plan"**; admin can **promote** a row onto the plan (set planned qty — audited, flagged as a likely Variation Order).
- **Actions & states:** add off-BOQ row (engineer adds reviewed at lock step); promote-to-plan (admin); all-sites rollup (Admin/Owner only); derived columns visibly non-editable.
- **SRS:** 10.4 (FR-LED-01..07).

#### W3 · Inventory item master

- **Purpose:** CRUD over the stock-master records.
- **Primary roles:** Warehouse Admin (full); PMG may create items on the fly; read others.
- **Layout & components:** solid table: item code (system-generated only), description, unit (lookup), per-Location on-hand _(derived)_, reserved, available, category, notes, active; item detail: movement history (W7 filtered), linked BoqLine where applicable.
- **Actions & states:** create/edit/deactivate; duplicate-code prevention; new item with no movements shows 0 everywhere; items created inline from MR/MRR/ledger persist immediately.
- **SRS:** 10.5 (FR-WIM-01..04), 10.16 #5.

#### W4 · Material Receiving Report (MRR)

- **Purpose:** the receiving document and the **single Goods Receipt** in the system — a Locked MRR completes Purchasing's three-way match and releases the RFP.
- **Primary roles:** Site Engineer (create/submit, assigned projects); Warehouse Admin (Lock/Unlock); Purchasing reads match state.
- **Layout & components:** MRR list (solid register mirroring the legacy MRR Summary): MRR No (`MRR-YYYY-####`, continuous), Receive Date, Particulars, Supplier, Invoice No, Project, PO Number, MR Number, Requested By, Accountability Code (optional), Purpose, status chip (**Draft · For Checking · Locked**); MRR form (solid): header — MRR No. _(auto)_, Receive Date, Project (FK), **Receiving Location**, Supplier (FK), **PO Number (FK)**, **MR Number (FK)**, **Invoice Number**, Requested By, Accountability Code, Purpose, Warehouseman _(logged user)_; attachments: **DR Photo (required to Lock)** + Delivery Proof (optional); lines: item (existing or off-BOQ new), description/particulars, quantity received, unit.
- **Actions & states:** Draft/For Checking post **nothing**; **Lock** posts Receipt movements at the location, raises Delivered/Running Balance, and (with PO + Invoice present) completes the three-way match → RFP submittable; partial deliveries: one PO across many MRRs, cumulative tracking, no silent over-receive; PO/MR mismatch = warn-and-allow with discrepancy flag to admin; Unlock (Admin) reverses movements and reopens the match (audited); print for filing.
- **SRS:** 10.6 (FR-MRR-01..09), 10.16 #3, 7.15.1.

#### W5 · Release form

- **Purpose:** issue stock out; drives Utilized.
- **Primary roles:** Site Engineer (create/submit); Warehouse Admin (Lock).
- **Layout & components:** list + form (solid): Release No. (`REL-YYYY-####`), Date, Project + Releasing Location, **Received By (free-text name — field crews aren't system users)**, Warehouseman _(releaser, logged user)_, lines (item, description, quantity, unit), optional signed-slip attachment; status chip (Draft · For Checking · Locked).
- **Actions & states:** Lock posts Issue movements (consuming reservations where the release fulfills an MR), Utilized up, Running Balance down; **negative-stock guard:** a release that would drive on-hand below zero is hard-blocked unless an Admin override with reason; print with signature areas.
- **SRS:** 10.7 (FR-REL-01..04), 10.16 #1.

#### W6 · Stock transfer

- **Purpose:** two-sided inter-location movement with an explicit In-Transit state.
- **Primary roles:** Warehouse Admin (both sides); Site Engineer initiates per permissions.
- **Layout & components:** list + form (solid): TRF No. (`TRF-YYYY-####`), origin Location → destination Location, lines (item, qty, unit), dispatch info, receipt confirmation (received qty per line); status flow chips: **Dispatch → In Transit → Confirm Receipt** (each side runs Draft → For Checking → Locked); in-transit badge (info blue).
- **Actions & states:** dispatch posts Transfer-Out at origin; confirm posts Transfer-In at destination; in-transit qty counted at **neither** location; received ≠ dispatched raises a **discrepancy flag** for admin review (never silently adjusts).
- **SRS:** 10.8 (FR-LOC-01..02, FR-TRF-01..04).

#### W7 · Stock movements ledger

- **Purpose:** the immutable movement history behind every balance.
- **Primary roles:** Warehouse Admin (+ Adjustments); read others.
- **Layout & components:** solid ledger per item (and global view): type chip (Receipt · Issue · Transfer-Out · Transfer-In · Adjustment), quantity (signed), date, actor, Location, source document link (MRR/REL/TRF/manual), reason (Adjustments), **running balance** column; "Post Adjustment" drawer (Admin only): item, location, signed delta, **mandatory reason**, evidence attachment.
- **Actions & states:** movements immutable — corrections are compensating movements or document unlocks; adjustment without reason rejected.
- **SRS:** 10.9 (FR-STK-01..04).

#### W8 · MR stock-verification

- **Purpose:** the Warehouse side of the inventory-first MR flow.
- **Primary roles:** Warehouse Admin/Warehouse.
- **Layout & components:** verification queue (solid): MRs awaiting verification; MR view with live stock columns — per line: Requested, **Available** (= on_hand − reserved, live), resulting For Purchase; reservation preview.
- **Actions & states:** verify → records **"Verified by Warehouse"** status (offline signature on the printed form; status-only here); on MR approval the reservations create (available down); fulfillment happens via W5 issues consuming reservations; cancel/close MR releases outstanding reservations.
- **SRS:** 10.11 (FR-WMR-01..05), 10.10 (FR-RSV-01..05).

#### W9 · Warehouse audit log

- **Purpose/roles/layout:** department-scoped append-only log (solid table, filters, export): item create/edit/deactivate, every stock movement, reservation create/release, MR verification, **every Lock and Unlock**, off-BOQ row add / promote-to-plan; actor, timestamp, entity, before/after.
- **SRS:** 10.13 (FR-WLG-01..03).

#### W10 · [Phase 2] Reorder rules & low-stock alerts

- **Purpose:** per-item, per-Location minimum levels with alerts and draft replenishment.
- **Layout & components:** rules table (item × location, min level, reorder point); below-reorder badge on W2/W3; alert feed into X4.
- **SRS:** 10.17.1.

#### W11 · [Phase 2] Stock-take / cycle counting

- **Purpose:** scheduled physical counts reconciled to system on-hand.
- **Layout & components:** count session (StockCount): scope picker, count-entry grid (counted vs system, variance), review → posts variance Adjustments with audit.
- **SRS:** 10.17.2.

#### W12 · [Phase 2] Returnable-tool custody ledger

- **Purpose:** who holds which returnable tool.
- **Layout & components:** custody table (CustodyRecord): item, holder, OUT date, Return event; promotes the Accountability Code into a real ledger.
- **SRS:** 10.17.3.

#### W13 · [Phase 2] Bins & barcodes

- **Purpose:** structured bin locations within a Location; barcode/QR scanning for receipts, issues, counts.
- **Layout & components:** bin manager; scan-first capture flows (mobile-friendly, camera-first).
- **SRS:** 10.17.4.

### 5.G BDD Module

The customer-facing pipeline + the website's CMS. Two record-keeping patterns coexist: **strict no-edit + append-only event streams** (Offers, Quotations — the event stream _is_ the audit trail) and **standard edit with audit logging** (Sales Orders, website content, inquiries). Every BDD record shows a **History** tab filtering the audit log to that record.

#### B1 · Sales orders list

- **Purpose:** the internal list of projects — the canonical SO# registry.
- **Primary roles:** BDD Staff (edit), BDD Lead (approve/config), Owner; many modules read.
- **Layout & components:** register (solid): Date, **Sales Order No.** (`YY-MM-XXX`), Client/Customer, Project Name, Contract Amount, Remarks (offer stage chip: No Offer Yet · With Offer · Without Offer · With NOA · With NTP · With P.O. · With SOA · With Contract · Cancelled · Done), Project Status chip (**Ongoing Project · On Hold · Project Completed · Cancelled**), Turned Over (yes/no), Requested By; filters: Project Status, Remarks, Client, Requested By, Turned Over, date range.
- **Actions & states:** Add → B2; archive (manual only, soft delete, archived stay queryable); no hard delete.
- **SRS:** 9.3, 9.9 #1.

#### B2 · Sales order record

- **Purpose:** one project's commercial record; owner of the system-wide SO#.
- **Primary roles:** BDD Staff/Lead.
- **Layout & components:** header card (glass): SO# (suggested next per convention, BDD can override; **globally unique, required**), Project Name, status chips; solid panels: identification (Date), client & scope (Client free-text → A19 relation, Project Name, Description/Scope of Work, Contract Amount ₱ optional), workflow (Remarks stage, Project Status, Turned Over + note), people (Requested By — employee picker, department auto), timing (Start Date, Project Duration in calendar days → derived End Date), **progress-billing structure** (Down Payment %, Retention %, DP Recoupment % — all vary per contract; null/zero = simple-line-item SOAs), **derived values** _(read-only)_: Down Payment Amount, Cumulative Billed to Date, Cumulative Retention Held, Cumulative DP Recouped (suppresses recoupment when fully recouped), Remaining Contract Balance; Notes; **History tab**.
- **Actions & states:** free status transitions (any → any; audit preserves history); Contract Amount edits fire a sensitive-change notification; linked records strip (Offers, billings, collections, POs, MRs, ledger).
- **SRS:** 9.3, 9.9 #2–3.

#### B3 · Offers list

- **Purpose:** every formal offer; win/loss history.
- **Primary roles:** BDD Staff (create), Lead, Owner.
- **Layout & components:** **entity toggle (glass): JCEPSI · JICA** (separate streams, separate per-entity Ref. No. counters; default = last used); register (solid): Ref. No. (`CLIENT_CODE-YY-XXX[Rev.NN]`), Offer Date, Date Emailed, Sent By, Client, Subject, Total Amount (₱), current Status chip (**Waiting for Client Response · Acknowledged · For Revision · Revised · Awarded · Not Awarded · Offer Lapsed · Cancelled**), revision-chain indicator.
- **Actions & states:** create (system-assisted Ref. No.: pick client code → suggested next sequence, overridable, unique); archive; filter by status/client/entity/date.
- **SRS:** 9.4.

#### B4 · Offer record (event stream)

- **Purpose:** an immutable offer + its append-only lifecycle.
- **Primary roles:** BDD Staff (append events), Lead.
- **Layout & components:** offer card (glass): Ref. No., Entity, Client, Subject, Total Amount, Offer Date, Date Emailed, Sent By, Previous Revision link (chain navigation); **current state strip** _(derived from events)_: status, current P.O./NOA, COC date, receipt, linked SO; **event timeline** (solid feed): each event = type chip + data + timestamp + user — Status Change · P.O./NOA Received (number + date) · COC Date · Receipt · Remark (accumulating note thread) · Sales Order Linked.
- **Actions & states:** "Update status / record event" appends — the record itself never edits; **revision flow:** For Revision → create new Offer `Rev.NN` linked back, predecessor status → Revised; Awarded → BDD manually creates the Sales Order then links it (event); empty event state.
- **SRS:** 9.4.

#### B5 · Quotations list

- **Purpose:** supplier quote requests for sourcing, by category stream.
- **Primary roles:** BDD Staff, Lead.
- **Layout & components:** **category toggle (glass): EC · Workshop · Solar** (per-category Ref. No. counters: `Q-EC-`, `Q-WS-`, `Q-SP-`); register (solid): Reference Number (`Q-{CAT}-YYNNN`), Item, Client, Request Date, supplier-response summary (n of m responded), selected-winner indicator, linked Offer / linked SO.
- **Actions & states:** create request; archive (children archive with parent).
- **SRS:** 9.5.

#### B6 · Quotation request detail

- **Purpose:** the side-by-side supplier comparison for one quoted item.
- **Primary roles:** BDD Staff (append events), Lead.
- **Layout & components:** request card (glass): Ref. No., Item, Client, Offer link, Sales Order link, Request Date, Notes; **supplier quotes comparison (solid table)**: one column per Supplier Quote child — Supplier (from Purchasing master), Response Date, current Response Status chip (**Waiting · For Revision · Done (Quote Received) · No Quote · Other**), current quoted Price (₱, from latest Price Recorded event), notes thread, legacy Ref. No. where migrated; **Selected as Winner** marker (at most one); per-child event streams (Status Change · Price Recorded · Selected as Winner · Note Added).
- **Actions & states:** add supplier quote (immutable child); record price / change status / select winner (events; winner fires a sensitive-change notification); request + children immutable once created — everything moves by events.
- **SRS:** 9.5, 9.9 #2.

#### B7 · Website content — Projects showcase

- **Purpose:** curated public portfolio (separate dataset from Sales Orders), managed like marketing content.
- **Primary roles:** BDD Staff (edit), Lead (approve/config).
- **Layout & components:** content grid (solid cards w/ cover thumbnails): Project Name, Client Name + **Show Client Name on Public Site** toggle, Location, Date Completed, Tags/Category (Substation · Transformer · Switchgear · Solar · Transmission Line · Renewable Energy · Maintenance), Status chip (**Published · Draft · Hidden**), Sort Order; record editor: Description (public-facing), **photo manager — up to 10 images** (captions, drag sort, cover designation; auto-compressed ~200–400 KB, longest edge ~1600 px; thumbnails auto-generated; JPG/PNG ≤ 10 MB in).
- **Actions & states:** publish/draft/hide (website reflects live on next load); archive (soft); audit logged; empty state.
- **SRS:** 9.2.1, 9.2 photo constraints.

#### B8 · Website content — Services

- **Purpose:** the "what JCE does" catalog feeding the public site.
- **Primary roles:** BDD Staff/Lead.
- **Layout & components:** same pattern as B7: Service Name (e.g., "Substation Design and Construction (up to 230 KV)"), Description, up to 10 photos (cover, captions, sort), Status (Published · Draft · Hidden), Sort Order.
- **SRS:** 9.2.2.

#### B9 · Website content — Products

- **Purpose:** the "what JCE sells/supplies" catalog (kept distinct from Services).
- **Primary roles:** BDD Staff/Lead.
- **Layout & components:** same pattern: Product Name (e.g., "Power Transformer (15 KV – 230 KV)", "HVSG / MVSG / LVSG Switchgear"), Description, photos ×10, Status, Sort Order.
- **SRS:** 9.2.2.

#### B10 · Inquiries inbox

- **Purpose:** the lead inbox: website form submissions + manually logged leads; qualify, reply, convert.
- **Primary roles:** BDD Staff (work), Lead (oversight).
- **Layout & components:** inbox list (solid): Date Received, Name, Company/Organization, Inquiry Type, Subject, Source (Website Contact Form default; email/phone/LinkedIn/trade show for manual), Status chip (**New · In Review · Replied · Closed · Spam**), Assigned To; detail panel: all form fields (Name, Company, Position, Email, Phone, Industry, Inquiry Type, Project Location, Estimated Timeline, Subject, Message, Budget Range, How did you hear about us), Internal Notes, Linked Offer, Linked Sales Order.
- **Actions & states:** assign; status workflow; **"Create Offer from Inquiry"** — prefills a draft Offer (Subject → Subject, Company → Client, Type+Message → context, Sent By ← Assigned To) and back-links the Linked Offer automatically; archive (spam/cold); empty state.
- **SRS:** 9.2.3.

#### B11 · BDD audit log

- **Purpose:** unified, searchable timeline across the BDD module.
- **Primary roles:** BDD Lead/Admin (full); Owner; BDD Staff scoped to records they can access.
- **Layout & components:** solid table: Timestamp, User, Module Area (Sales Order · Offer · Quotation · Supplier Quote · Supplier · Website Project · Service · Product · Inquiry), Action Type (Created · Edited · Status Change · Archived · Restored · Event Appended · Linked/Unlinked), Record Type + ID, Field Changed, Old → New value, Context Note; filters: user, date range, area, action, specific record; free-text search.
- **Actions & states:** export CSV/PDF respecting filters; real-time entries; read-only.
- **SRS:** 9.6, 9.9 #4.

### 5.H Engineering Module

#### E1 · Engineering placeholder stub

- **Purpose:** hold the nav position honestly — the module is pending its stakeholder interview; nothing here is a committed requirement.
- **Primary roles:** Owner/Admin only (no Engineering roles provisioned yet).
- **Layout & components:** module page with a single glass empty-state card: "Engineering module — pending scoping," a short note that BOM ownership and Technical Drawing review will likely land here (they feed Purchasing's import stages 1 & 6), and no further chrome.
- **Actions & states:** none. Do not design speculative screens.
- **SRS:** §8.

### 5.I Public Website (mobile-first)

Same design language as the dashboard (glass chrome — nav, cards, footer frame — over the glow backdrop; solid surfaces for reading content and the form). English (PH context) v1. All portfolio/catalog content renders **live** from BDD (§9.2) — only Published records ever appear. Strong technical SEO is part of the design: semantic markup, unique title/meta per page, heading hierarchy, descriptive URLs, image alt text, internal links between Services and related Projects, fast Core Web Vitals, HTTPS. GEO requires clear, factual, self-contained text blocks AI engines can extract.

#### S1 · Home

- **Purpose:** who JCE is, what it does, proof, and a path to inquiry — in one scroll.
- **Primary roles:** public visitors.
- **Layout & components:** glass sticky nav (logo, page links, "Send an inquiry" CTA in accent orange); hero on the glow backdrop: company positioning line ("Power substations & transmission lines up to 230 KV…"), primary CTA → S8, secondary → S3; capabilities band (glass cards linking to S5 service pages); **featured projects** (solid cards from Published Projects: cover photo, name, location, tags); credibility strip (founded 1997, ~124 engineers/technicians, Shenda exclusive distributorship, key clients); latest news teasers (S6); footer (glass): consistent **NAP** — JC Electrofields Power System, Inc. · 3074 F. Bautista St., Brgy Ugong, Valenzuela City, Metro Manila · (02) 8562-8540 · sales@jcepower.com — + links and social. _(The footer carries this **contact NAP**; the SEC **registered office of record** — 2129 La Mesa St., Ugong, Valenzuela — appears only on S2's Licenses & Accreditations block, FR-WEB-19. Both are correct; do not swap one for the other.)_
- **Actions & states:** CTAs; loading skeletons for live content; graceful empty (if no published projects, hide band).
- **SRS:** 11.2, FR-WEB-01/02, FR-WEB-15.

#### S2 · About

- **Purpose:** company profile + the canonical entity facts AI engines extract.
- **Layout & components:** narrative profile (solid reading column): history since 1997 (from the profile's verbatim **History** narrative) + **Mission & Commitment** statements, scale, key clients, leadership (President Engr. Jimwel C. Capillo); **Licenses & Accreditations panel** (solid badge/list — issuer · verifiable number · validity — from the §9 _safe-to-publish_ set: SEC since 2007 · Reg. CS200711697, PCAB Lic. 37783 valid to Apr 2027, PhilGEPS Platinum to Jan 2027, NGCP Substation-Erection, ₱1B authorized capital, registered office 2129 La Mesa St., Ugong, Valenzuela; closing line "Complete documentation available upon request for bidding and accreditation purposes"); **canonical facts block** (visually distinct solid panel, plain extractable sentences per FR-WEB-16); capabilities fact-sheet + nationwide coverage statement. **Never render** the withheld items (TINs, signed/sealed document scans, permit fee breakdowns/account numbers, the personal yahoo email, officers' names in a tax context) — per FR-WEB-19 / NOTES §9.
- **SRS:** 11.2, FR-WEB-16/17/19.

#### S3 · Projects (portfolio)

- **Purpose:** the public track record.
- **Layout & components:** filter chips by Tag/Category (glass); responsive grid of solid project cards (cover thumbnail, Project Name, Location, Date Completed, tags; client name only when "Show Client Name" is on); sort: featured (Sort Order) then recency.
- **Actions & states:** card → S4; empty-category state.
- **SRS:** 11.2, 9.2.1, FR-WEB-02.

#### S4 · Project case study

- **Purpose:** one project as an SEO/GEO case-study page.
- **Layout & components:** hero photo + gallery (up to 10, captions, lightbox); facts row (solid): scope, capacity/rating, location, client (if shown), completion date; description (reading column); related service links; inquiry CTA.
- **SRS:** FR-WEB-14, 9.2.1.

#### S5 · Products & Major Services

- **Purpose:** the catalog plus **one dedicated page per major capability** (SEO requirement, 7 pages): transformers · substations ≤ 230 KV · transmission lines · switchgear HV/MV/LV · NGCP direct connection (69 KV) · solar/renewable EPC & consultancy · maintenance & servicing.
- **Layout & components:** catalog overview: two labeled sections — **Services** and **Products** (distinct lists, from B8/B9) as solid cards; capability service pages: hero, capability description, related products, related project case studies (internal links), FAQ snippets, inquiry CTA.
- **Actions & states:** live content; empty handling.
- **SRS:** 11.2, FR-WEB-14, 9.2.2.

#### S6 · News / Blog

- **Purpose:** fresh indexable content for SEO/GEO.
- **Layout & components:** article list (solid cards: title, date, excerpt, cover) → article page (reading column, share links); category/tag filter.
- **Actions & states:** pagination; empty state. (Content ownership/cadence is client-input — see §8.)
- **SRS:** 11.2, FR-WEB-14.

#### S7 · Careers

- **Purpose:** open positions + an application path.
- **Layout & components:** roles list (solid cards: title, location, type) → role detail with an application path (email link or simple form — mechanism unspecified in SRS, see §8).
- **SRS:** 11.2.

#### S8 · Contact / Inquiry

- **Purpose:** the lead-capture form; submissions create records in BDD's Inquiries inbox (B10).
- **Layout & components:** two-column desktop / stacked mobile: contact info panel (glass: NAP, map embed optional, phone, email) + **inquiry form (solid)** with the confirmed field set — _Contact:_ Name*, Company/Organization*, Position/Role, Email*, Phone*, Industry (dropdown: Electric Cooperative · Manufacturing · Solar/Renewable Energy · Commercial/Industrial · Government/Public Sector · Other); _Inquiry details:_ Inquiry Type* (dropdown: Power Transformer Supply (Distribution/Power/CT/PT) · Substation Design & Construction (up to 230 KV) · Transmission Line Design & Construction (up to 230 KV) · Switchgear (HVSG/MVSG/LVSG) · Solar/Renewable Energy Project · Maintenance & Servicing · Direct Connection Application (NGCP via 69 KV) · Engineering Consultancy · Other + free text), Project Location, Estimated Timeline (Immediate/Emergency · <3 mo · 3–6 mo · 6–12 mo · >12 mo), Subject*, Message*; *Qualifiers:\* Budget Range PHP (Under 1M · 1M–10M · 10M–50M · 50M–100M · Over 100M · Prefer not to say), How did you hear about us (Google/Web · Referral · Past Project · Trade Show/Event · Other).
- **Actions & states:** required-field validation; **anti-spam (CAPTCHA/honeypot)**; submit → acknowledgement state (on-page confirmation; BDD notified per its rules); error/retry; mobile keyboard-friendly inputs (≥44px targets).
- **SRS:** 11.4 (FR-WEB-05/06), 9.2.3.

#### S9 · FAQ

- **Purpose:** GEO extraction content answering buyer questions ("Who builds power substations up to 230 kV in the Philippines?", "Is there an NGCP direct-connection (69 kV) contractor?", "Where is JC Electrofields located?").
- **Layout & components:** accordion list (solid) of self-contained Q&A blocks; schema-friendly structure (FAQPage). Placement (standalone page vs section of About/Services) is an open question — see §8.
- **SRS:** FR-WEB-10/17, FR-WEB-09.

---

## 6. Shared Component Library

One library serves every dashboard module **and** the website (NFR-UI-07). Glass components are chrome; solid components carry content.

| Component                                                                                  | Where used                                                                 | Glass / Solid                                    |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------ |
| App shell: sidebar + top bar + breadcrumbs                                                 | every dashboard screen                                                     | Glass                                            |
| Page header band (title, actions, filters slot)                                            | all module screens                                                         | Glass                                            |
| KPI/stat tile                                                                              | X3, P1, U1, W1, A17 aging, dashboards                                      | Glass                                            |
| Card (content card, project card, choice card)                                             | portfolio P2, W1 cards, H13 chooser, website                               | Glass                                            |
| Modal / confirm dialog                                                                     | destructive + state-changing actions everywhere                            | Glass frame, solid body                          |
| Drawer / side panel (record peek, quick edit)                                              | X5, A15 record, U12 peek, B10 detail                                       | Glass frame, solid body                          |
| Tabs (record sections, register tabs)                                                      | H2, H7, U10, A13, B2                                                       | Glass tab bar over solid panels                  |
| **Data table / register** (sort, filter, paginate, export, frozen columns, zebra)          | every list/register (H1, A4/A7/A10/A13, U2, U5, W4, B1…)                   | **Solid**                                        |
| **Ledger grid** (running balances, tabular numerals, signed values)                        | W2, W7, A3 ledger, A5 lines, P6, P9                                        | **Solid**                                        |
| **Entry grid** (keyboard-first cell editing)                                               | H5 timekeeping, P8 This-Period %, A16 JV lines                             | **Solid**                                        |
| **Form** (sections, validation, computed read-only fields, masked-field state)             | all create/edit screens                                                    | **Solid**                                        |
| Status chip (full lifecycle vocabulary per §2.1)                                           | everywhere                                                                 | Solid chip on any surface                        |
| Document number chip (`SO#`, `CV-`, `MRR-`, `RFP-PUR-`…)                                   | registers, headers, references                                             | Solid chip                                       |
| Stepper / progress tracker (3-state lock gate; 5-stage; 15-stage; sign-off chains)         | W4–W6, U7, U8, A5, A14, P3 wizard                                          | Glass rail, solid stage rows                     |
| Wizard frame (multi-step with guarded commit)                                              | P3 import, A16 CA liquidation, A18 statutory, U14 merge                    | Glass stepper, solid bodies                      |
| Timeline / event feed                                                                      | P12, B4, B6 events, record History tabs                                    | Glass cards on backdrop or solid list in records |
| Approval queue item (entity chip, amount, age, Approve/Hold/Reject)                        | U12, X3 "my approvals", U22                                                | Glass card, solid actions                        |
| File uploader + attachment list (multi-file, type/size rules, required-flag)               | HR scans, A14, W4 DR photo, P8, U7 doc slots                               | Solid                                            |
| Photo manager (×10, captions, sort, cover)                                                 | B7–B9                                                                      | Solid                                            |
| Gallery / lightbox                                                                         | S4, B7 previews, P14                                                       | Solid over dimmed scrim                          |
| **Print preview pane** (paper-faithful page render)                                        | A8/A9/A11/A12 live previews, U4 PDF, A6 payslip, P8 print                  | Solid page in glass frame                        |
| **Signature block (print-only)** (names/positions + blank lines + date)                    | every printed document (PO, RFP, MR, payslip, vouchers, HR forms, reports) | Print artifact only — never interactive          |
| Masked sensitive field (`••••` + lock + "Restricted")                                      | H2 compensation, payroll surfaces, alphalists                              | Solid                                            |
| Search (global + column filters + fuzzy account/code pickers)                              | top bar, registers, A16 CoA picker                                         | Glass (global), solid (in-table)                 |
| Picker: Employee / Supplier / Client / SO# / Project / MR / Item / CoA account             | everywhere references are chosen                                           | Solid dropdown w/ search; shows code + label     |
| Entity/category toggle (JCEPSI·JICA, EC·WS·Solar, Local·Import·All)                        | B3, B5, U2                                                                 | Glass segmented control                          |
| Notification toast + bell feed                                                             | global                                                                     | Glass                                            |
| Empty state (illustration + one CTA)                                                       | all lists                                                                  | On backdrop                                      |
| Skeleton loaders (rows, tiles)                                                             | all                                                                        | Match target surface                             |
| Audit log table (actor/time/entity/before-after)                                           | H14, P13, U13, W9, B11                                                     | Solid                                            |
| Lock-gate banner (Draft/For Checking/Locked + who may act)                                 | W4–W6, locked periods P8, A5 approved batches                              | Solid banner, ink-dark Locked                    |
| Comparison matrix (rows × supplier columns, best-value highlight)                          | B6, U16                                                                    | Solid                                            |
| Chart surface (trend, S-curve, aging buckets, utilization bars)                            | A18, U18, U21, U23, P16, W1                                                | Solid chart in glass card                        |
| Website: glass nav, hero, capability card, project card, fact block, FAQ accordion, footer | S1–S9                                                                      | Glass chrome / solid reading surfaces            |

---

## 7. Hard Rules for the Designer

1. **GLASS FOR CHROME, SOLID FOR CONTENT.** Never place tables, ledgers, forms, registers, reports, payslips, or any data-dense reading surface on glass. No exceptions — legibility of figures wins every time (NFR-UI-03/05).
2. **Palette is green (primary) / orange (accent) / white** — §2.1 hexes are proposals **pending JCE brand guidelines**; structure every deliverable so hexes can swap without redesign (tokens, not hardcoded color).
3. **Approvals are offline wet-signature, system-wide.** Design **print-only signatory blocks** (names/positions, blank signature + date lines) on every printed document; on screen, design **status tracking** (Pending/Approved and document-specific lifecycles) and **required scanned-copy upload** affordances. **Never design in-app e-signing, signature pads, or digital-signature ceremonies.** The approval queue (U12) captures workflow _decisions_ only — paper still gets signed.
4. **The PMG accomplishment report PRINT view is byte-faithful** to the PM head's spreadsheet — columns, headers, totals, styling reproduced exactly (template is client-input). The **on-screen** view is free to be better, but the printed artifact is sacred. The same fidelity discipline applies to the other legacy print formats: payslip, payroll register (Landscape Legal/Long bond), Service Invoice, SOA, Collection Receipt (incl. BIR footer note), two-copy Acknowledgement Receipt, Bank Payment Voucher, JV, PO (both templates), RFP, MR form `JCE-F-WMS02`, and the bank-pivot Disbursement register.
5. **RBAC drives visible states.** One role per user; hidden nav for inaccessible modules; read-only rendering (static text, not disabled inputs) for R-grants; **masked compensation** for everyone but Payroll Officer + Owner; own-records-only self-service; site engineers locked to assigned sites; Approve/Post/Lock verbs visible only to roles that hold them.
6. **Dashboard is desktop-first** (1440 canvas, dense tables, keyboard-first grids, usable at 1280/tablet). **Website is mobile-first** (390 → 768 → 1280, ≥44px targets).
7. **Derived values are never editable** — stock balances, weights, payment status, distributions, totals, variance. Give computed fields one consistent visual identity.
8. **Lifecycle states are first-class:** every document renders its state machine (Draft / Pending / For Checking / Approved / Locked / Posted / Paid / Void / In Transit / Partially Paid…) as the standard chip + lock-gate banner; locked/posted/issued things look immutable.
9. **Motion honors `prefers-reduced-motion`**; blur layers capped at 3 with a solid fallback that must look intentional (NFR-UI-04/06).
10. **Philippine formats everywhere:** ₱ with two decimals and comma thousands, negatives in parentheses, amount-in-words on financial documents, PH dates, tabular numerals in every money column.
11. **Numbers and references are content:** document numbers (SO#, CV-, JV-, MRR-, REL-, TRF-, PRQ-, BPO-, RFP-PUR-, GR-, `JCE 0000X`) must be instantly scannable and copyable — use the document-number chip consistently.
12. **WCAG AA contrast on glass** — raise opacity rather than accept a failing pair (NFR-UI-05).

---

## 8. Open Design Questions

Unresolved by the SRS — flag in designs, never invent:

1. **Brand assets:** exact green/orange hex values, logo files, typography — pending JCE brand guidelines (NFR-UI-01, §11.9). §2.1 is a proposal.
2. **PIS form layout** — the paper layout that should inform H2/H3 grouping (client-input, §4.4; non-blocking).
3. **Timekeeping spreadsheet sample** — exact column order/grouping/totals for H5's on-screen grid fidelity (§4.2 source note).
4. **The PM head's spreadsheet template file** — required for the byte-faithful P8 print view (§6.14 #7).
5. **Print templates for fidelity:** SOA & Collection Receipt forms, payroll register and payslip templates (§5.12 client-input).
6. **LOA With Pay (4.3.4) paper template** — form pending; H-series gains a sibling of H10 when provided.
7. **Module landing pages for HR, Accounting, and BDD** are not specified (unlike PMG/Purchasing/Warehouse dashboards). This brief routes those modules' nav to their primary registers (H1, A4/A7, B1); confirm or commission landing dashboards.
8. **Operating environment specifics** — hosting, device range, dashboard mobile expectations beyond "desktop primary, usable on tablet" (§2.3 TBD).
9. **Engineering module** — entire scope pending interview (§8); only the E1 stub may be designed.
10. **FAQ page placement** (standalone vs folded into About/Service pages) and the final FAQ question set (FR-WEB-10).
11. **Careers application mechanism** — email link vs form vs ATS; SRS names only "an application path" (§11.2).
12. **News/Careers content ownership & cadence** — client-input (§11.9).
13. **Website photography/copy assets** and any redirect map from the current site (§11.9).
14. **Formal WCAG conformance level** beyond AA-on-glass commitment (NFR-USE-05 "confirm").
15. **MFA for Owner/Admin** — recommended, unconfirmed (NFR-SEC-07); affects login flow design.
16. **Accounting "edit-after-Issue with audit" vs BDD strict no-edit** — intentional divergence (5.12 #3); designers must not unify them; confirm the on-screen messaging for each.
17. **Approval threshold bands** (illustrative defaults in 7.15.4) and the PRQ mandatory threshold (₱20K recommendation) — pending confirmation; X6/U11 must treat bands as data.
18. **Default sort orders and Client-Code picker UX** for BDD lists — explicitly deferred to build (§9.9).
19. **Dark mode** — not specified anywhere in the SRS; out of scope unless JCE asks.
20. **Statutory report layouts** (BIR/SSS/PhilHealth/Pag-IBIG forms) follow agency formats — obtain current official templates at build (5.9 B-family).

---

## 9. Coverage Check — SRS → Screens

Every functional area of SRS v1.72 maps to at least one screen spec:

| SRS area                                                                              | Screens                                                     |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| §2 Overall description, user classes                                                  | §1, §3; X1–X3                                               |
| §3 RBAC (roles, matrix, scoping, cross-reads)                                         | §3; X5; masked/read-only states on all screens              |
| §4.1 Employee management (PIS record, statuses, archive, audit, contract alert)       | H1 H2 H3 H4 (+X4 alerts)                                    |
| §4.2 Timekeeping (weekly grid, Day Type, distribution engine, multi-project, batches) | H5 H6                                                       |
| §4.3 HR requests common shape + uploads                                               | H7                                                          |
| §4.3.1 OB/Travel · §4.3.2 OT · §4.3.3 RFL · §4.3.5 LOA w/o pay                        | H8 · H9 · H10 · H11                                         |
| §4.4 Self-service + request workflow + notifications                                  | H12 H13 X4                                                  |
| §4.6 HR audit log                                                                     | H14                                                         |
| §5.2.1 Settings (all 7 sections + FS mapping)                                         | A1                                                          |
| §5.2.1 §8 Chart of Accounts                                                           | A2                                                          |
| §5.2.2 Loans                                                                          | A3                                                          |
| §5.2.3 Payroll Summary (batches, lines, daily detail, charging, sign-off, print)      | A4 A5                                                       |
| §5.2.4 Payslip                                                                        | A6 (+H12 employee view)                                     |
| §5.3 Sales (register, SI, SOA modes A/B)                                              | A7 A8 A9                                                    |
| §5.4 Collections (register, CR, AR)                                                   | A10 A11 A12                                                 |
| §5.5 Payable Voucher (+PR worksheet)                                                  | A13 A14                                                     |
| §5.6 Disbursement (+recon, void)                                                      | A15                                                         |
| §5.7 Journal Voucher (+CA liquidation)                                                | A16                                                         |
| §5.7/5.12 Cash Advance first-class entity + aging                                     | A17                                                         |
| §5.8 Project Costing (deferred → report)                                              | A18 (C-family)                                              |
| §5.9 Reporting (A–D families, drill-down, snapshots)                                  | A18                                                         |
| §5.12 Clients entity                                                                  | A19                                                         |
| §6.4 Intake (import/clone/manual)                                                     | P3 P4                                                       |
| §6.3 Project entity / header                                                          | P5                                                          |
| §6.5 BOQ & weighting                                                                  | P6                                                          |
| §6.5.5 Variation orders                                                               | P7                                                          |
| §6.6 Accomplishment report + NET AMOUNT + guardrail + cross-check                     | P8                                                          |
| §6.6.5–6.6.6 Recoupment & retention ledgers                                           | P9                                                          |
| §6.7 Portfolio                                                                        | P2                                                          |
| §6.8 Timeline                                                                         | P12                                                         |
| §6.10 MR workflow (JCE-F-WMS02)                                                       | P10 P11 (+W8)                                               |
| §6.11 PMG audit log                                                                   | P13                                                         |
| §6.12 PMG dashboard/notifications/attachments                                         | P1 X4 (+attachments on P5/P8/P10)                           |
| §6.15 Phase 2 (photos, templates, S-curve, traceability, doc pack, budget)            | P14–P19                                                     |
| §7.4–7.5 PO numbering + creation + PDF                                                | U3 U4                                                       |
| §7.6 PO ledger                                                                        | U2                                                          |
| §7.7 RFP                                                                              | U5 U6                                                       |
| §7.8 Import 15-stage tracker                                                          | U7                                                          |
| §7.9 Suppliers                                                                        | U9 U10                                                      |
| §7.10 Purchasing audit log                                                            | U13                                                         |
| §7.11 Dashboard/notifications/attachments/FX                                          | U1 X4 X6                                                    |
| §7.14 Phase 2 (RFQ, catalog, price, BIR, lead-time, budget, mobile, cycle)            | U15–U23                                                     |
| §7.15.1 Goods Receipt / three-way match                                               | W4 (MRR = GR) + U6 gate + U4 received flags                 |
| §7.15.2 Supplier bank accounts                                                        | U10 X6                                                      |
| §7.15.3 Purchase Requisition                                                          | U11                                                         |
| §7.15.4 Approval thresholds + queue                                                   | X6 U12                                                      |
| §7.15.5 Local 5-stage tracker                                                         | U8                                                          |
| §7.15.6 Blanket POs                                                                   | U24                                                         |
| §7.15.7 Supplier merge                                                                | U14                                                         |
| §8 Engineering placeholder                                                            | E1                                                          |
| §9.2.1–9.2.2 Website content (projects/services/products)                             | B7 B8 B9                                                    |
| §9.2.3 Inquiries                                                                      | B10 S8                                                      |
| §9.3 Sales Orders                                                                     | B1 B2                                                       |
| §9.4 Offers (immutable + events, JCEPSI/JICA)                                         | B3 B4                                                       |
| §9.5 Quotations (streams, comparison, events)                                         | B5 B6                                                       |
| §9.6 BDD audit log (+History tabs)                                                    | B11                                                         |
| §9.9 Sensitive-change notifications                                                   | X4                                                          |
| §10.4 Stock ledger                                                                    | W2                                                          |
| §10.5 Item master                                                                     | W3                                                          |
| §10.6 MRR                                                                             | W4                                                          |
| §10.7 Release form                                                                    | W5                                                          |
| §10.8 Locations & transfers                                                           | W6 X6                                                       |
| §10.9 Movements & adjustments                                                         | W7                                                          |
| §10.10–10.11 Reservations + MR verification                                           | W8                                                          |
| §10.12 Lock gate                                                                      | W4–W6 banners + W9 audit                                    |
| §10.13 Warehouse audit log                                                            | W9                                                          |
| §10.14 Dashboard/notifications/reporting                                              | W1 X4 (registers/exports on W2–W7)                          |
| §10.17 Phase 2 (reorder, stock-take, custody, bins)                                   | W10–W13                                                     |
| §11.2 Site pages                                                                      | S1–S9                                                       |
| §11.3 Live BDD integration                                                            | S1 S3 S4 S5 (render rules)                                  |
| §11.4 Inquiry form                                                                    | S8                                                          |
| §11.5–11.6 SEO/GEO                                                                    | S2 S5 S9 + 5.I intro rules                                  |
| §11.7 Branding                                                                        | §2                                                          |
| §12.1–12.8 NFRs (performance, security, privacy, usability, audit)                    | X2 (security states), §2.5, universal states, audit screens |
| §12.9 Design language                                                                 | §2, §6, §7                                                  |

**Result: every scoped functional area of SRS v1.72 maps to at least one screen specification.** Engineering (§8) is intentionally a stub; items the SRS defers to client input are listed in §8 of this brief rather than invented.

---

_End of brief — JCE_Claude_Design_Brief.md v1.0, derived from JCE_System_SRS_v1.0_Draft.md v1.72._
