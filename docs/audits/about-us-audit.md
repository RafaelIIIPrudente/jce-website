# About Us Page Audit — JC Electrofields Power System

**Scope:** the company-story page — `app/(marketing)/about-us/page.tsx` and the 9 sections it renders (4 sub-components in `components/sections/about/` + 5 inline blocks), their kit primitives, and the content they consume (`lib/content/website.ts` → `ABOUT`, `ABOUT_VIDEOS`, `YOUTUBE_CHANNEL`; `lib/content/accreditations.ts` → `LICENSES`).
**Type:** read-only audit. No production code, copy, or config was modified. This file is the only artifact.
**Date:** 2026-06-11 · **Branch:** `improve-public-website`
**Method:** full static read of all 9 sections + sub-components + the video/HQ kit primitives + content; `pnpm lint` and `pnpm exec tsc --noEmit` (both **exit 0, no output**); parallel specialist review (compliance/fidelity · a11y · perf · standards · SEO · narrative), with every cited line re-verified against source and token contrast computed before inclusion. Sensitive/withheld values are deliberately **not** reproduced anywhere in this report.

> Severity rubric — **P0** compliance / factual-wrong / broken-or-inaccessible · **P1** clear standards violation or unprofessional content · **P2** polish / consistency · **P3** nice-to-have.
> Items that could not be checked against a source are labelled **(verify)** rather than asserted.

---

## 1. Executive summary

**Verdict: the About page is professionally made, standards-aligned, and — on the §9 hard rails — compliance-clean.** The engineering is excellent: a clean server-first tree (the page and three of four sections are Server Components; the video RSS fetch runs server-side with a graceful fallback; only `AmbientVideo` and the `VideoEmbed` facade are `'use client'`), a `prefers-reduced-motion` fallback on every animation, an exemplary muted/poster-gated HQ aerial loop, a click-to-load privacy-enhanced YouTube facade, content correctly externalised into `ABOUT`/`LICENSES`, and a computed-AA cyan-deep accent (≈5.7:1). `lint` and `tsc` are green. **No withheld value is rendered** — the §9 compliance check passes.

The gaps fall into four clusters: (1) **one factual-fidelity overstatement** — the GEO canonical fact still claims solar **PV-plant EPC**, contradicting the client's authoritative services (renewables = consultancy + interconnection); (2) **the structured-data gap** — About has no `Organization`/`LocalBusiness`/`AboutPage` JSON-LD (FR-WEB-09), now conspicuous since the home page has it; (3) **two licenses-block completeness items** — the SEC registered office that FR-WEB-19 says to publish here is absent, and the DOE/ERC entries sit outside the client-reviewed §9 cert set; (4) **standards consistency** — inline section headings/eyebrows/CTA copy and `text-[clamp(...)]` headings that don't use the `--text-heading-*` tokens registered in the recent home work, plus a few bracketed `aspect-[...]` and `.jpg`/heavy-video assets against the repo's `.webp`/compression conventions.

### Top 5 issues

| # | Sev | Issue | Evidence |
|---|-----|-------|----------|
| 1 | P1 | **GEO canonical fact overstates solar as turnkey EPC.** `canonicalFacts[3]` asserts JCE "builds utility-scale and commercial/industrial solar PV plants **on an EPC basis**" — the exact claim corrected in `SERVICES`/home this session (the client's authoritative services frame renewables as pre-development + engineering **consultancy** + the substation/interconnection). This sentence is AI-answer-engine-extractable. | `lib/content/website.ts:943` · `AB-FACT-01` |
| 2 | P1 | **No structured data on About** (`Organization`/`LocalBusiness`/`AboutPage`, FR-WEB-09). About is the natural home for it; the home page now carries `Organization` JSON-LD while About has none. | `app/(marketing)/about-us/page.tsx` (absent) · `AB-SEO-01` |
| 3 | P2 | **SEC registered office omitted from the Licenses block.** FR-WEB-19 specifies the registered office (`2129 La Mesa St., Ugong`) in this block; `LICENSES` has no address field, so it isn't rendered. (Keep it distinct from the contact NAP `3074 F. Bautista St.`.) | `lib/content/accreditations.ts:33-73` · `AB-LIC-01` |
| 4 | P2 | **DOE / ERC entries sit outside the client-reviewed §9 cert set** and carry no license number or validity. Confirm with the client or move to a "regulatory engagements" sub-note. | `lib/content/accreditations.ts:64-72` · `AB-LIC-02` |
| 5 | P2 | **Founding-year framing (1997 vs SEC 2007) appears on the same page without reconciling language.** A consistency *question* for the client — do not assert which is correct. | `page.tsx:54` ("Since 1997") vs `accreditations.ts:39` (SEC 2007) · `XC-FY` |

### Scorecard

Rated **Strong** / **Adequate** / **Needs-work** / **Failing**.

| Section | Content & copy | Compliance & factual fidelity | Standards & arch | Accessibility | Performance / CWV | SEO / metadata |
|---|---|---|---|---|---|---|
| 1. Hero | Strong | Adequate | Strong | Strong | Adequate | Adequate |
| 2. Who-we-are / HQ | Strong | Strong | Strong | Strong | Adequate | Adequate |
| 3. History | Strong | Strong | Adequate | Strong | Adequate | Adequate |
| 4. Mission & commitment | Strong | Strong | Adequate | Strong | Strong | Adequate |
| 5. Our people | Strong | Strong | Strong | Strong | Adequate | Adequate |
| 6. Watch | Adequate | Strong | Strong | Strong | Strong | Adequate |
| 7. Licenses & accreditations | Strong | **Needs-work** | Adequate | Strong | Strong | Adequate |
| 8. Canonical facts | Adequate | **Needs-work** | Adequate | Strong | Strong | Adequate |
| 9. Closing CTA | Strong | Strong | Adequate | Strong | Strong | Strong |
| Cross-cutting | Adequate | Adequate | Adequate | Strong | Adequate | **Needs-work** |

---

## 2. Per-section findings

### Section 1 — Hero (`web-about-hero.tsx`)

**Strong:** A single priority LCP `<Image fill priority sizes="100vw">` over a height-reserved `dark-section` (no CLS), with the meaningful `imageAlt` passed from the page (`page.tsx:42`); `HeroParallax` wraps **only** the decorative Ω + `CurrentTrace`, never the photo or heading (`:51-60`); the page's single `<h1>` lives here (`:64`); reduced motion freezes both decorative layers.

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| AB-HERO-01 | P2 | Performance | `web-about-hero.tsx:34-41` + `page.tsx:41` (`/home/office-hq-exterior.jpg`, ~214 KB `.jpg`) | CWV; `next/image` convention (home `PERF-02`) | Pre-encode the hero source to `.webp` (~120–150 KB) to match `public/projects/*.webp`; verify the SSR `<link rel="preload" as="image">` is emitted. |
| AB-HERO-02 | P2 | Factual fidelity | `web-about-hero.tsx:68-72` ("delivering substations, transmission lines and **renewable-energy projects** nationwide") | Accuracy vs the client's authoritative services | "delivering … renewable-energy projects" reads as EPC delivery; per the reconciled services, renewables are consultancy + interconnection. Soften (e.g. "…and renewable-energy interconnection") for consistency with `SERVICES`. **(verify)** |
| AB-HERO-03 | P3 | Standards | `web-about-hero.tsx:64` (`text-[clamp(30px,6vw,60px)]` inline `<h1>`) | CLAUDE.md tokens (home `XC-06`) | The hero clamp isn't tokenised; this exact size has no `--text-heading-*` token yet — register one or accept the inline value. |

### Section 2 — Who-we-are / HQ (`web-about-hq.tsx` + `web-ambient-video.tsx`)

**Strong:** The HQ aerial loop is exemplary and meets every video-loop rule: the poster `<Image fill>` is **always** rendered as the meaningful still (`posterAlt`), the `<video>` layers on top **only** when `!reduce` with `muted loop playsInline preload="metadata" aria-hidden` (`web-ambient-video.tsx:45-64`), the aspect box reserves height (no CLS), and it is below the fold so it never competes for LCP. Server Component with `AmbientVideo` as the sole client leaf; fact chips come from the §9-safe `hq.facts`.

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| AB-HQ-01 | P2 | Performance | `lib/content/website.ts:962` (`/home/office-aerial.mp4` ≈ **2.75 MB**) + `web-ambient-video.tsx:52-63` | CWV / mobile data | `preload="metadata"` correctly defers it, but a 2.75 MB autoplaying decorative loop is heavy on mobile data. Compress it (the home Ω video was cut to 470 KB); also consider a `.webp` poster (current `office-aerial-poster.jpg` ≈ 382 KB). |
| AB-HQ-02 | P3 | Standards | `web-about-hq.tsx:22` (`text-[clamp(24px,3.6vw,38px)]` h2) | tokens | Matches the registered `--text-heading-section`; apply the token. |
| AB-HQ-03 | P3 | Standards | `web-ambient-video.tsx:30` (JSDoc example `"aspect-[4/3]"`) | canonical `aspect-4/3` | Doc nit — prefer the canonical slash form in the example. |

### Section 3 — History (inline in `page.tsx` + `ABOUT.history`/`coverage`/`leadership`/`historyImages`)

**Strong:** Narrative body renders from `ABOUT.history`/`ABOUT.coverage` (content-from-logic); every load-bearing §2 fact is preserved (1997 founding by a top-graduate EE, steel-manufacturing origin via NGCP direct-connection substations, repair-and-fabrication → major contractor/supplier, "over 124", Shenda exclusivity, nationwide reach) — cross-checked against profile §2. The leadership card (President) is rendered in a non-tax context. The single history image (Sagada) uses the canonical `aspect-4/3` with descriptive alt.

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| AB-HIST-01 | P2 | Standards (content-from-logic) | `page.tsx:54,56` (kicker "Since 1997" + h2 "From repair & fabrication to the national grid." inline) | CLAUDE.md content-from-logic (home `MOT-01`) | The section eyebrow + heading are inline strings; the *body* is externalised but the headers aren't. Consider an `ABOUT` section-header field. |
| AB-HIST-02 | P3 | Standards | `page.tsx:55` (`text-[clamp(24px,3.6vw,38px)]` h2) | tokens | Apply `--text-heading-section`. |
| AB-HIST-03 | P3 | Content | composition: the right column now holds a single 4/3 image beside a tall text column (after the CNP photo removal) | Composition | Reads slightly sparse on wide screens; optional — add a second field photo or let the image grow. Not a defect. |

### Section 4 — Mission & commitment (inline + `ABOUT.mission`/`vision`/`values`/`missionImage`)

**Strong:** Mission, vision and the three commitments render from `ABOUT` and map faithfully to profile §5 (the three values = the first three §5 mission bullets; the vision is correctly framed as an aspirational goal — "to grow … into a player across the Asian region" — not a present-day claim). The mission image is the `.webp` Shenda shot with a descriptive alt; commitment cards stack `grid-cols-1 sm:grid-cols-3`.

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| AB-MISS-01 | P2 | Standards | `page.tsx:126` (`aspect="aspect-[4/3]"` bracketed) | canonical `aspect-4/3` (home `XC-07`) | Use `aspect-4/3` — the history image beside it (`:88`) already does, so the page is internally inconsistent. |
| AB-MISS-02 | P2 | Standards (content-from-logic) | `page.tsx:109-111` (kicker inline) + `:129-134` (overlay "Shenda Electric" / "Exclusive Philippine distributor" inline) | content-from-logic | Move the eyebrow + overlay labels into `ABOUT`. |
| AB-MISS-03 | P3 | Standards | `page.tsx:112` (`text-[clamp(22px,3.2vw,34px)]` h2) | tokens | This size has no registered token — register `--text-heading-*` or accept. |

### Section 5 — Our people (`web-about-people.tsx`)

**Strong:** Editorial 3:4 portrait cluster (first portrait spans two rows) + a wide team shot, each with descriptive alt; `HeroParallax` + `Reveal` are reduced-motion-safe; Server Component composing client leaves; content from `ABOUT.people`. The crew photography genuinely earns its place (the "directly-employed, no subcontracting" narrative).

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| AB-PPL-01 | P3 | Standards | `web-about-people.tsx:40,51,61,75` (`aspect-[3/4]`, `aspect-[2/1]`) | canonical `aspect-3/4` / `aspect-2/1` | Prefer the canonical slash form. |
| AB-PPL-02 | P3 | Performance | `website.ts:976-991` (crew/team `/home/*-portrait.jpg`, `team-group-*.jpg` ≈ 195–437 KB `.jpg`) | `next/image`/`.webp` convention | Re-encode the crew + team photos to `.webp` (same class as `AB-HERO-01`); they were not in the prior home `.webp` pass. |
| AB-PPL-03 | P3 | Content | `website.ts:973` ("about 124 strong") vs `:935` ("over 124") | Wording consistency | "about 124" vs "over 124" across two sections — pick one phrasing. |

### Section 6 — Watch (`web-about-videos.tsx` + `web-video-embed.tsx`)

**Strong:** A resilient **async Server Component** does the YouTube RSS fetch server-side, de-dupes against the curated set, and is wrapped so a feed outage simply renders the curated block (`:27-48,50-54`) — never an error or empty shell. `VideoEmbed` is a model **click-to-load facade**: it renders a lazy poster `<img>` + an accessible play `<button>` (`aria-label`, `focus-ring-cyan`, full-card target) and only mounts the **`youtube-nocookie.com`** iframe *with a `title`* on click (`web-video-embed.tsx:31-44`), keeping the YouTube SDK off initial load; the fixed `aspect-video` box reserves height (no CLS). "Visit our channel" is `min-h-11` + `rel="noopener noreferrer"` + focus ring.

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| AB-VID-01 | P3 | A11y / standards | `web-video-embed.tsx:29-37` (no `data-lenis-prevent` on the player container; the attribute is unused repo-wide) | Lenis + iframe convention (brief) | Add `data-lenis-prevent` to the embed container so Lenis never intercepts pointer/wheel over the player. **Low real impact** — the player isn't a scroll container and is click-to-mount — but it's the stated convention. **(verify)** |
| AB-VID-02 | P3 | Content / composition | `website.ts:1024-1028` (`ABOUT_VIDEOS` curated set includes "JCE Christmas Party 2025") | Editorial fit | A holiday-party clip is off-message for a "See the work in motion" capabilities showcase; consider reserving the curated trio for project/technical videos and letting the party clip surface only via the live channel strip. |

*(Note: the iframe carries no explicit `loading="lazy"`, but that is moot — it is not in the DOM until the user clicks. The facade is the stronger pattern.)*

### Section 7 — Licenses & accreditations (inline + `LICENSES`)

**Strong:** Renders strictly from `LICENSES` (the §9-safe set); the six core credentials (SEC · PCAB · PhilGEPS · NGCP · …) map **exactly** to the client-reviewed §9 publish list with correct numbers/validity; **no** document/certificate scan, permit-fee breakdown, account number, or TIN is rendered; the closing "Complete documentation available upon request…" line matches FR-WEB-19; cards are non-interactive; the `text-jce-cyan-deep` validity text (`#9a4d06`) computes to **≈5.7:1** on the light surface — **AA pass** even at 12px.

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| AB-LIC-01 | P2 | Compliance / completeness | `lib/content/accreditations.ts:33-73` (no `address` field → SEC registered office not rendered) | FR-WEB-19 | FR-WEB-19 specifies the registered office (`2129 La Mesa St., Ugong, Valenzuela City`) in this block; it is absent. Add it to the SEC entry's `detail` (or a dedicated "Registered office" entry). **Do NOT** use the contact NAP (`3074 F. Bautista St.`) here — keep the two addresses distinct. (Compliance reviewer rated P1.) |
| AB-LIC-02 | P2 | Compliance | `accreditations.ts:64-72` (DOE "FIT service contracts" + ERC "point-to-point approval") | §9 cert set / FR-WEB-19 | DOE and ERC are not in the client-reviewed §9 safe-to-publish *cert* set and carry no license number/validity. Confirm with the client, or move them to a separate "Regulatory engagements" sub-note distinct from the formal credentials. |
| AB-LIC-03 | P2 | Standards (content-from-logic) | `page.tsx:166-168,215-217` (kicker, h2, closing line inline) | content-from-logic + tokens | Section header + closing line are inline; h2 clamp → `--text-heading-section`. |
| AB-LIC-04 | P3 | Compliance / placement | BIR-registered, Valenzuela business permit, ₱1B authorized capital are §9-safe but live only in `canonicalFacts`, not the Licenses block | FR-WEB-19 | Decide whether these belong in the Licenses block or remain financial-capacity facts in §8. No breach. |

### Section 8 — Canonical facts ("JCE at a glance"; inline + `ABOUT.canonicalFacts`)

**Strong:** Plain, extractable GEO sentences (FR-WEB-16) in a semantic `<ul>`/`<li>` with decorative (`aria-hidden`) check glyphs. The authorized-capital (₱1B) and BIR/tax-compliant lines are §9-safe **financial-capacity** facts (verified against §9); the leadership sentence is a leadership fact, not a tax-context rendering.

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| AB-FACT-01 | P1 | Factual fidelity | `lib/content/website.ts:943` (`canonicalFacts[3]`: "builds utility-scale and commercial/industrial solar PV plants **on an EPC basis**") | Accuracy vs the client's authoritative services (pp.8–9 = NOTES §3) | Overstates: the source frames renewables as pre-development + engineering **consultancy** (items 11–12) + the substation/interconnection JCE delivers — **not** turnkey PV-plant EPC. This is the same overstatement corrected in `SERVICES` and on the home page this session, and it is the most AI-extractable surface. Reframe to consultancy + interconnection. |
| AB-FACT-02 | P3 | Factual consistency | `website.ts:944` (`canonicalFacts[4]`: "…application through to **energization**") | Consistency | The home NGCP node was softened to "through to **connection**"; align the wording. |
| AB-FACT-03 | P2 | Standards | `page.tsx:225-227` ("The facts" kicker + "JCE at a glance" h2 inline; h2 clamp) | content-from-logic + tokens | Inline header; h2 clamp → `--text-heading-section`. |

### Section 9 — Closing CTA (inline)

**Strong:** Ω watermark is `aria-hidden` and its pulse is gated on `!reduce` (and now off-screen-paused after the home remediation); `MagneticButton` falls back to a static `<div>`; the primary button is `h-12` with a `focus-visible` ring; copy is clean and on-brand.

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| AB-CTA-01 | P2 | Standards (content-from-logic) | `page.tsx:260-266` (kicker "Get in touch", h2 "Talk to the engineers behind the work.", body inline) | content-from-logic | Move the CTA copy into `ABOUT` (or a shared CTA content constant — the home/services/About CTAs are near-identical). |
| AB-CTA-02 | P3 | Standards | `page.tsx:261` (`text-[clamp(26px,4vw,42px)]` h2) | tokens | This matches the registered `--text-heading-cta`; apply it. |

---

## 3. Cross-cutting findings

**Narrative arc — coherent and well-paced.** Hero (identity) → HQ (substance) → History (heritage) → Mission (values) → People (the human layer) → Watch (work in motion) → Licenses (credentials) → Canonical facts (extractable proof) → CTA (contact). The light/dark rhythm is **better balanced than the home page**: a single dark hero, a dark "Watch" band midway, and a luminous close, with light editorial bands between — no top-heavy dark stack.

| ID | Sev | Dimension | Evidence | Finding & recommendation |
|---|---|---|---|---|
| XC-FY | P2 | Compliance / consistency | `page.tsx:24,54`, `website.ts:940` ("1997") vs `accreditations.ts:39` (SEC "July 24, 2007") | **Founding-year question (not an error).** Both "Since 1997" and the SEC-2007 registration appear on the same page with no reconciling line. FR-WEB-19 says they "are not in conflict," and profile §1 flags "lead with 1997 but confirm." Add a brief reconciling clause ("active since 1997; incorporated with the SEC in 2007") **pending client confirmation** — do not assert which is correct. (Compliance reviewer rated P1.) |
| XC-SOLAR | P1 | Factual fidelity | `website.ts:943` (`canonicalFacts[3]`) + `web-about-hero.tsx:68-72` | **Solar-as-EPC overstatement spans two surfaces** (the GEO canonical fact + the hero sub). Reconcile both with the corrected services framing (consultancy + interconnection). See `AB-FACT-01`, `AB-HERO-02`. |
| XC-SEO | P1 | SEO / metadata | `app/(marketing)/about-us/page.tsx` (no JSON-LD; `grep` confirms none under `about-us/`) | **No structured data.** About is the canonical home for `Organization` + `LocalBusiness` + `AboutPage` JSON-LD (FR-WEB-09). The home now has `Organization`; About should add `AboutPage` (+ reuse the Organization graph). Per-route `metadata` (title/description/`alternates.canonical`) is otherwise correct (`:21-26`). `AB-SEO-01`. |
| XC-COPY | P2 | Standards (content-from-logic) | `page.tsx:54,56,109,166,168,215,225,227,260-266` | **Inline section eyebrows/headings + CTA/closing copy** across the five inline blocks aren't in `lib/content` (the section *bodies* are). Aggregate of `AB-HIST-01`/`AB-MISS-02`/`AB-LIC-03`/`AB-FACT-03`/`AB-CTA-01`. |
| XC-TOKENS | P2 | Standards | `page.tsx:55,112,167,226,261`, `web-about-hero.tsx:64`, `web-about-hq.tsx:22`, etc. | **Heading `text-[clamp(...)]` values don't use the `--text-heading-section`/`-cta` tokens** registered in the recent home work (where the sizes match). Apply them; the mission (22/3.2vw/34) and hero (30/6vw/60) sizes have no token yet. |
| XC-ASPECT | P3 | Standards | `page.tsx:126`, `web-about-people.tsx:40,51,61,75`, `web-ambient-video.tsx:30` | Bracketed `aspect-[4/3]` / `aspect-[3/4]` / `aspect-[2/1]` → canonical slash form (`aspect-4/3`, etc.). |
| XC-SHENDA | P3 | Composition | `website.ts:935` (coverage), `page.tsx:129-134` (mission overlay), `website.ts:942` (`canonicalFacts[2]`) | **Shenda exclusivity surfaces three times.** Reinforcement vs fatigue is a judgment call on a company-story page; three is borderline. Consider trimming one. |
| XC-ASSETS | P2 | Performance | `page.tsx:41` (hero `.jpg`), `website.ts:962` (HQ `.mp4` 2.75 MB), `:976-991` (crew/team `.jpg`) | The About page's own imagery/video weren't in the prior home `.webp`/compression pass — hero + crew/team `.jpg` and the 2.75 MB HQ loop. Same class as home `PERF-01`/`PERF-02`. |

**Responsive (~320–390px): Strong (structurally).** The two-column History/Mission collapse to one column below `md` (`grid-cols-1 md:grid-cols-2`); HQ/People use `lg:grid-cols-2`; the license grid is `1 → md:2`; the video grid is `1 → sm:2 → lg:3`; the fact list and commitment cards stack; the CTA centres; interactive targets are `min-h-11`/`h-12`. No horizontal-overflow patterns found. (Spot-verify on-device, but the structure is sound.)

**Build gates: green.** `pnpm lint` → exit 0, no output. `pnpm exec tsc --noEmit` → exit 0. No About-relevant violations to fold in.

---

## 4. Compliance check (§9 hard rails)

Sensitive/withheld values are deliberately **not** reproduced below — only the location and rule are cited.

| Rail | Result | Evidence |
|---|---|---|
| **Withheld set absent** (TINs · signed/sealed/scanned docs or certificate images · permit-fee breakdowns / account numbers · the personal email · officers' names in a tax context) | **PASS** | No TIN, scan, fee/account number, or personal email appears in `page.tsx`, the four About sub-components, `web-video-embed`/`web-ambient-video`, `website.ts`, or `accreditations.ts`. The president's name appears only as leadership (History card + `canonicalFacts[8]`), never beside a tax field. |
| **Two addresses kept distinct** (contact NAP vs SEC registered office not mixed) | **PASS (with a completeness gap)** | No conflation detected; the contact NAP is not used in the licenses context. However the SEC registered office is **not rendered at all** in the Licenses block, which FR-WEB-19 requires — see `AB-LIC-01`. |
| **Leadership not in tax context** | **PASS** | `website.ts:932,948` render the name in an About/leadership context; no tax-context field presents it. |
| **§9-safe licenses only** | **CONDITIONAL PASS** | The six core credentials match the §9 set exactly. DOE + ERC entries (`accreditations.ts:64-72`) are outside the client-reviewed §9 cert set — no scan risk, but require client confirmation (`AB-LIC-02`). |
| **History / Mission fidelity** (no fabricated claims, no dropped load-bearing facts, no overstated numbers) | **PASS for §2/§5** | All load-bearing §2 history facts and §5 mission/values are preserved and faithfully paraphrased; 124+, Shenda exclusivity, ₱1B, BIR lines are §9-safe and accurate. **Exception (services fidelity, not §2/§5):** `canonicalFacts[3]` overstates solar as turnkey PV EPC — see `AB-FACT-01` (P1). |
| **Founding-year consistency surfaced** | **OPEN** | Flagged for client resolution (`XC-FY`); not asserted either way. |

**Overall §9 hard-rail verdict: PASS.** No withheld value is rendered. The open items are a missing §9-safe fact (registered office), two entries needing client confirmation (DOE/ERC), one services-fidelity overstatement (solar EPC), and the founding-year framing question.

---

## 5. Prioritized remediation backlog

| Rank | ID | Sev | Dimension | One-line action |
|---|---|---|---|---|
| 1 | AB-FACT-01 / XC-SOLAR | P1 | Factual fidelity | Reframe `canonicalFacts[3]` (and the hero sub `AB-HERO-02`) from solar "PV plants on an EPC basis" → consultancy + interconnection, matching the reconciled `SERVICES`. `website.ts:943`. |
| 2 | AB-SEO-01 / XC-SEO | P1 | SEO | Add `AboutPage` + `Organization`/`LocalBusiness` JSON-LD to `about-us/page.tsx` (reuse the home graph; pattern proven in `faq/page.tsx`). |
| 3 | AB-LIC-01 | P2 | Compliance | Add the SEC registered office (`2129 La Mesa St., Ugong`) to the Licenses block (SEC entry `detail`) — distinct from the contact NAP. `accreditations.ts:35-40`. |
| 4 | AB-LIC-02 | P2 | Compliance | Confirm DOE/ERC entries with the client or move them to a "Regulatory engagements" sub-note. `accreditations.ts:64-72`. |
| 5 | XC-FY | P2 | Compliance | Add reconciling copy ("active since 1997; incorporated 2007") pending client confirmation; do not assert either date. |
| 6 | AB-HQ-01 / XC-ASSETS | P2 | Performance | Compress the 2.75 MB HQ loop (`office-aerial.mp4`) and re-encode the hero + crew/team `.jpg` to `.webp`. |
| 7 | AB-HERO-01 | P2 | Performance | Re-encode the hero `office-hq-exterior.jpg` → `.webp`; verify the preload hint. |
| 8 | XC-COPY (AB-HIST-01 / AB-MISS-02 / AB-LIC-03 / AB-FACT-03 / AB-CTA-01) | P2 | Standards | Move inline section eyebrows/headings + CTA/closing copy into `lib/content`. |
| 9 | XC-TOKENS (AB-HQ-02 / AB-HIST-02 / AB-CTA-02 / …) | P2 | Standards | Apply `--text-heading-section`/`-cta` tokens where the clamp sizes match; register tokens for the mission/hero sizes. |
| 10 | AB-MISS-01 | P2 | Standards | `aspect-[4/3]` → `aspect-4/3` (page is internally inconsistent with `:88`). |
| 11 | AB-VID-02 | P3 | Content | Reconsider the holiday-party clip in the curated `ABOUT_VIDEOS` showcase. |
| 12 | AB-LIC-04 | P3 | Compliance | Decide placement of BIR / business-permit / ₱1B (Licenses block vs canonicalFacts). |
| 13 | AB-FACT-02 | P3 | Factual | Align "through to energization" → "connection" with the home NGCP wording. |
| 14 | AB-PPL-02 / AB-PPL-01 / XC-ASPECT | P3 | Perf / Standards | Re-encode crew/team `.jpg` → `.webp`; canonicalise `aspect-[3/4]`/`aspect-[2/1]`. |
| 15 | AB-PPL-03 | P3 | Content | "about 124" vs "over 124" — unify the phrasing. |
| 16 | AB-VID-01 | P3 | A11y | Add `data-lenis-prevent` to the YouTube embed container (low real impact; stated convention). |
| 17 | AB-HERO-03 / AB-MISS-03 / AB-HQ-03 | P3 | Standards | Tokenise/canonicalise the remaining inline clamps + aspect doc nit. |
| 18 | AB-HIST-03 | P3 | Content | Optional: a second field photo in the History column (currently single after the CNP removal). |
| 19 | LD (Jimwel/Jimwell) | P3 | Compliance | Confirm the canonical spelling of the president's first name (code/SRS use "Jimwel"; profile notes use "Jimwell") and propagate. `website.ts:932,948`. |

---

*Prepared read-only. No `.tsx`/`.ts`/content/config files were modified; the working tree is unchanged except for this report. No withheld/sensitive value is reproduced anywhere above. Findings marked **(verify)** require a runtime measurement or a source the audit did not fully read; they are not asserted as defects.*
