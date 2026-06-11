# Home Page Audit — JC Electrofields Power System

**Scope:** the flagship public home page — `app/(marketing)/page.tsx` and the 7 sections it renders, their kit primitives, and the content/data they consume (`lib/content/website.ts`, `lib/content/accreditations.ts`, `lib/content/site.ts`).
**Type:** read-only audit. No production code, copy, or config was modified. This file is the only artifact.
**Date:** 2026-06-11 · **Branch:** `improve-public-website`
**Method:** full static read of every section + shared primitive; `pnpm lint` and `pnpm exec tsc --noEmit` (both **exit 0, no output**); parallel specialist review across 6 dimensions, with every cited line independently re-verified against the source before inclusion.

> Severity rubric — **P0** compliance / factual-wrong / broken-or-inaccessible · **P1** clear standards violation or unprofessional content · **P2** polish / consistency · **P3** nice-to-have.
> Where a claim could not be checked against a source in this audit, it is labelled **(verify)** rather than asserted.

---

## 1. Executive summary

**Verdict: the home page is professionally made and largely standards-aligned — a genuinely premium, well-engineered flagship.** The engineering discipline is the standout: a clean server-first boundary with `'use client'` pushed to the smallest leaves, a `prefers-reduced-motion` fallback verified on *every* animation primitive, disciplined single-priority LCP handling, fully-typed `as const`/`satisfies` content, and zero `framer-motion`, raw hex/oklch, or bracketed `var()`. `lint` and `tsc` are green. Nothing on the page is *failing*.

The gaps are concentrated and fixable, in five clusters: (1) **no schema.org structured data** on the flagship index (FR-WEB-09); (2) **a few factual-precision items** in Proof-at-scale and the trust bar that overstate or conflate the underlying source claims; (3) **image-asset weight** — home imagery ships as unoptimized `.jpg` against the repo's own `.webp` convention, plus a 2.5 MB intro video on `preload="auto"`; (4) **a handful of control-level accessibility polish items** on the orbital widget; (5) **content fatigue** — the hero and Proof bands count up largely the same numbers, and the tagline is repeated verbatim.

### Top 5 issues

| # | Sev | Issue | Evidence |
|---|-----|-------|----------|
| 1 | P1 | **No `Organization`/`LocalBusiness`/structured data on the flagship home.** Only `faq/page.tsx` carries any JSON-LD repo-wide; FR-WEB-09 + the CLAUDE.md SEO standard require Organization + LocalBusiness (NAP, foundingDate, sameAs) on the corporate index. All source data already exists in `lib/content/site.ts`. | `app/(marketing)/page.tsx` (absent) · `SEO-01` |
| 2 | P1 | **Two factual-precision slips.** Proof labels a 300 MVA **transformer** rating as "Largest substation"; the trust bar fuses "300 MVA / 230 kV … **on** the Cebu–Negros–Panay backbone," joining a Luzon transformer figure to the CNP credential. | `lib/content/website.ts:682` · `web-home-clients.tsx:22` · `PROOF-01`, `CLI-01` |
| 3 | P1 | **Image/video weight risks the LCP budget on mobile.** Home photos are 260–600 KB `.jpg` sources (repo canon is pre-optimized `.webp`); the 2.5 MB Ω-reveal MP4 uses `preload="auto"`. | `lib/content/website.ts:632,655-671` · `web-home-omega-reveal.tsx:93` · `PERF-01`, `PERF-02` |
| 4 | P1 | **Orbital control-level a11y gaps.** The full-area backdrop dismiss `<button>` has no visible focus indicator (WCAG 2.4.7), and the programmatically-focused card `<h3>` suppresses its outline with `focus:outline-none`. | `web-home-capability-orbit.tsx:272-277,333-335` · `CAP-01`, `CAP-02` |
| 5 | P2 | **Stat/tagline duplication reads as fatigue.** 3 of the 4 Proof stats (230 kV, 45+, 1997) re-count figures the hero already animated; the verbatim tagline appears in both hero and CTA. | hero `web-home-hero.tsx:85-104` vs proof `web-home-proof-scale.tsx:80-98` · `XC-01`, `XC-02` |

### Scorecard

Rated **Strong** / **Adequate** / **Needs-work** / **Failing**.

| Section | Content & copy | Factual accuracy | Standards & arch. | Accessibility | Performance / CWV | SEO / metadata |
|---|---|---|---|---|---|---|
| 1. Hero | Strong | Adequate | Strong | Strong | Adequate | Strong |
| 2. Capabilities (orbital) | Strong | Strong | Strong | Adequate | Adequate | Adequate |
| 3. Proof at scale | Strong | **Needs-work** | Strong | Strong | Adequate | Adequate |
| 4. Projects | Strong | Adequate | Strong | Strong | Adequate | Adequate |
| 5. Clients / trust | Adequate | **Needs-work** | Adequate | Adequate | Strong | Adequate |
| 6. Motion band | Strong | Adequate | **Needs-work** | Strong | Adequate | Adequate |
| 7. CTA | Strong | Strong | Adequate | Strong | Adequate | Strong |
| Cross-cutting | Adequate | Adequate | Strong | Strong | Adequate | **Needs-work** |

---

## 2. Per-section findings

### Section 1 — Hero (`web-home-hero.tsx` + `web-home-omega-reveal.tsx`)

**Strong:** Crisp, fluff-free headline ("Power infrastructure, engineered to energize.") with the verbatim corporate `TAGLINE` as the sub. Exemplary LCP handling — a single `<Image fill priority sizes="100vw">` over a `min-h-[calc(100svh-4rem)]` height-reserved container (`web-home-hero.tsx:32-39,28`), parallax wrapping *only* the decorative trace layer (`:48-56`), and a one-time Ω brand reveal that mounts after hydration so it can never become the LCP or block paint (`web-home-omega-reveal.tsx:40-41`, gated off under reduced-motion/Save-Data/seen at `:28-37`). Exactly one `<h1>` on the page lives here (`:62`). Both CTAs are `h-12` (≥44px) with focus rings.

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| HERO-01 | P1 | Performance | `web-home-omega-reveal.tsx:93` (`preload="auto"` on the 2.5 MB `/home/jce-omega-reveal-muted.mp4`) | CWV / LCP budget | Change to `preload="metadata"` and compress the clip to ≤~800 KB. On a cold mobile connection `preload="auto"` can start a 2.5 MB download that contends for bandwidth in the LCP window. |
| HERO-02 | P2 | Performance | `lib/content/website.ts:632` (`/home/solar-farm-substation-coast-hero.jpg`, ~419 KB source) | CWV; `next/image` discipline | `next/image` optimizes at serve, but pre-encode the hero source to `.webp` (matching `public/projects/*.webp`) and verify the `<link rel="preload" as="image">` is emitted in the SSR `<head>`. |
| HERO-03 | P3 | Content / standards | `web-home-hero.tsx:62-66` (headline + kicker inline) | CLAUDE.md content-from-logic | The site's highest-visibility copy is inline rather than in `lib/content`. Consider a `HOME_HERO.headline`/`kicker` so SEO-weighted copy lives with the data. Intentional-but-undocumented today. |
| HERO-04 | P3 | Accessibility | `web-home-hero.tsx:91-100` (stat sub-labels `text-jce-dark-ink-2` over the 35%-opacity photo) | WCAG 1.4.3 | Likely passes (≈6.5:1 on the dark tile), but **verify** contrast over the brightest region of the hero photo behind the stat grid. |

### Section 2 — Capabilities "What we do" (`web-home-capabilities-orbital.tsx` shell + `web-home-capability-orbit.tsx` leaf)

**Strong:** A textbook RSC split — a pure Server Component shell renders the heading and delegates to one `'use client'` leaf; lucide icons never cross the boundary as props (the client imports `HOME_CAPABILITY_NODES` directly and reads `node.icon` in place). Dual-mode from one source of truth: SSR/no-JS/mobile/reduced-motion get a fully readable static grid; capable screens progressively enhance to a slow rAF orbit that mutates transforms directly (no per-frame setState → INP-safe) and pauses on open/hover/focus/off-screen/`document.hidden` (`web-home-capability-orbit.tsx:108-149`). Blurbs are derived from `SERVICES` — capabilities only, no invented metrics. Keyboard contract is thorough: `aria-expanded`/`aria-controls`, focus-to-heading on open, Escape returns focus to the node (`:151-169`).

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| CAP-01 | P1 | Accessibility | `web-home-capability-orbit.tsx:272-277` (backdrop `<button className="absolute inset-0 cursor-default">` — no focus class) | WCAG 2.4.7 Focus Visible (AA) | Add `focus-ring-cyan`. The control is keyboard-reachable and announced, but has no visible focus indicator. (Reviewer rated P0; moderated to P1 — a labelled close button *with* a ring plus Escape provide redundant accessible dismissal.) |
| CAP-02 | P1 | Accessibility | `web-home-capability-orbit.tsx:333-335` (`<h3 tabIndex={-1} … focus:outline-none>`, programmatic focus target) | WCAG 2.4.7 | `focus:outline-none` suppresses the indicator even on programmatic focus (it targets `:focus`, not `:focus-visible`). Drop the suppression or pair with a visible `focus-visible` ring. |
| CAP-03 | P2 | Accessibility | `web-home-capability-orbit.tsx:278-282` (expanded card `role="group"`) | WCAG 4.1.2 | The card manages focus + Escape like a dialog; consider `role="dialog" aria-modal="true" aria-labelledby={h3 id}` so AT announces the modal-like context. |
| CAP-04 | P2 | Performance | `web-home-capability-orbit.tsx:196` (`<OmegaMark pulse>` core) + `web-omega-mark.tsx` (no off-screen pause) | CWV / INP | The core's pulse loop runs perpetually once mounted. It is compositor-only (transform/opacity) so INP impact is minimal, but an `IntersectionObserver` pause would stop needless work when scrolled away. |
| CAP-05 | P2 | SEO | section renders no `Service` JSON-LD | FR-WEB-09 | The site's primary service showcase is a natural injection point for top-level `Service` structured data (`SERVICES` already exists). Site-wide gap; see SEO-01. |

### Section 3 — Proof at scale (`web-home-proof-scale.tsx` + `HOME_PROOF`)

**Strong:** A specific, earned heading ("Built across the archipelago — energized on schedule.") with every stat carrying a `sub` label so the numbers never read as bare claims. Server Component composing reduced-motion-safe leaves; `aspect-4/3` containers reserve space (no CLS); the divider SVG is `aria-hidden`; `HOME_PROOF.images`/`stats` are validated with `satisfies readonly …[]` (`lib/content/website.ts:672,698`).

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| PROOF-01 | P1 | Factual accuracy | `lib/content/website.ts:682-686` (`value:300, suffix:" MVA", label:"Largest substation"`) | Accuracy / no-overstatement | 300 MVA is a **transformer** rating, not a substation-size superlative. Relabel "Largest transformer" / "Peak transformer rating." The `sub` only partly mitigates the overstated label. |
| PROOF-02 | P2 | Content / a11y | `lib/content/website.ts:661` (NSEC alt: "a vast solar panel field **by the sea**") | WCAG 1.1.1; accuracy | The alt for `/home/solar-farm-nsec-hero.jpg` says "by the sea," but the NuevaSol/NSEC facility (Gamu, Nueva Ecija) is inland. Either the photo isn't NSEC (drop the NSEC reference) or "by the sea" is wrong (drop it). |
| PROOF-03 | P2 | Composition | proof stats `lib/content/website.ts:673-698` vs hero `HERO_STATS:64-70` | Narrative (redundancy) | 3 of 4 Proof stats (230 kV, 45+, 1997) repeat the hero's count-up. See XC-01 — differentiate (lean on 300 MVA + island coverage). |
| PROOF-04 | P3 | Factual accuracy | `lib/content/website.ts:694` (`value:1997, label:"Energizing since"`) | Consistency | Third on-page surfacing of the founding year; folds into the 1997/2007 consistency question (XC-03). |

### Section 4 — Projects (`web-home-projects.tsx` + `FEATURED_PROJECTS`)

**Strong:** Clean `ul`/`li` semantics; `client: null → "Confidential client"` handled cleanly (`web-home-projects.tsx:36`); rich constructed alt text per card (name + client + location, `:24-26`); project images are the optimized `/projects/*.webp` set; `Reveal` delays capped at 0.25s. Facts map to the company-profile project tables for the verifiable entries.

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| PROJ-01 | P2 | Factual accuracy | `lib/content/website.ts:466-472` (San Carlos Sun Power, `client:null`) | Editorial / accuracy | The published company profile names this client openly; rendering "Confidential client" is conservative but may understate a credential. **Confirm** with the client whether it can be named. (Business decision, not an error.) |
| PROJ-02 | P3 | Performance | `web-photo-card.tsx:58` (`group-hover/photo:scale-[1.04]` via `transition-transform`) | WCAG 2.3.3 (**AAA**, not AA) | Hover scale isn't fully removed under reduced-motion — it's collapsed to ~1ms by the global override, which is perceptually equivalent to off. Optional polish: `motion-reduce:transition-none motion-reduce:scale-100` for an explicit guard. (Reviewer cited as 2.3.3 AA; 2.3.3 is AAA, so this is below the AA bar.) |
| PROJ-03 | P3 | SEO | no `Project`/`CreativeWork` JSON-LD | FR-WEB-09 | Optional `CreativeWork`/`Project` items for the featured rail; folds into SEO-01. |

### Section 5 — Clients / trust bar (`web-home-clients.tsx` + `MARQUEE_CLIENTS` + `CREDENTIAL_STRIP`)

**Strong:** Leads with the genuinely differentiating NGCP credential; the credential strip derives strictly from the §9-safe `CREDENTIAL_STRIP` (`lib/content/accreditations.ts:80-85`); the Shenda exclusive-distributor note is accurate; client chips wrap cleanly and are non-interactive (no target-size concern). Light/glass surface gives the dark-heavy page a welcome tonal break.

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| CLI-01 | P1 | Factual accuracy | `web-home-clients.tsx:22-24` ("300 MVA / 230 kV substation work **on** the Cebu–Negros–Panay backbone") | Accuracy / no-conflation | **(verify against company-profile §4)** The 300 MVA figure appears to belong to Luzon grid projects (Cabanatuan/Biñan), while the CNP backbone is a separate 230 kV credential with no stated MVA. Joining them with "on" implies a 300 MVA install *on* CNP. Split into two claims (the content's own `MARQUEE_CLIENTS` comment at `website.ts:72-74` already treats them as distinct). |
| CLI-02 | P2 | Standards | `web-home-clients.tsx:19,21-24,45-51` (eyebrow, flagship sentence, distributor note inline) | CLAUDE.md content-from-logic | Move the prose into a `HOME_CLIENTS` content constant; only the lists currently come from `lib/content`. |
| CLI-03 | P2 | Accessibility | `web-home-clients.tsx:19` (`kicker text-jce-green-600`, 12px bold) | WCAG 1.4.3 | `text-jce-green-600` on the glass surface at 12px bold is borderline for AA (bold <14px uses the 4.5:1 threshold). **Verify**; if short, use `text-jce-green-700`. |
| CLI-04 | P3 | Content | `web-home-clients.tsx:45-51` (distributor sentence) | Copy polish | The Shenda distributor line ends without a full stop. Add one for parity with the surrounding copy. |

### Section 6 — Motion band "Engineering in motion" (`web-home-motion-band.tsx`)

**Strong:** Vivid, credibly specific copy ("Night transformer lifts. Live switchyard work."); the "124+ engineers … single-vendor accountability" claims are supported; the full-bleed background is correctly decorative (`alt=""`, `web-home-motion-band.tsx:17-22`); headings trace in and paragraphs stagger via reduced-motion-safe primitives; the foreground PhotoCard alt is descriptive; near-white ink on near-black is comfortably AA.

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| MOT-01 | P2 | Standards | `web-home-motion-band.tsx:31-54,70` (eyebrow, heading, two paragraphs, 3 VoltageTags, photo caption — all inline) | CLAUDE.md content-from-logic | This section has the most inline marketing copy on the page. Extract a `HOME_MOTION_BAND` content constant. |
| MOT-02 | P3 | Factual accuracy | `web-home-motion-band.tsx:70` ("Bauang Switchyard — Luzon Grid Expansion") | Precision | The profile names the phase ("Luzon Grid Expansion **I**"); add the phase number for procurement cross-reference. |
| MOT-03 | P3 | Factual accuracy | `web-home-motion-band.tsx:53` (`VoltageTag "Since 1997"`) | Consistency | Fourth on-page surfacing of the founding year (XC-03). |

### Section 7 — CTA (`web-home-cta.tsx`)

**Strong:** Punchy, on-brand close ("Let's energize what's next.") with the Ω watermark `aria-hidden` and its pulse gated on `!reduce`; `MagneticButton` falls back to a static `<div>`; the primary button carries a `focus-visible` ring. No claims, no compliance exposure.

| ID | Sev | Dimension | Evidence | Standard | Recommendation |
|---|---|---|---|---|---|
| CTA-01 | P2 | Content / composition | `web-home-cta.tsx:31` + `web-home-hero.tsx:67-69` (verbatim `TAGLINE` in both) | Copy / narrative | Decide if the tagline echo is an intentional bookend; if not, give the hero a distinct scope-descriptor sub-line. See XC-02. |
| CTA-02 | P3 | Performance | `web-home-cta.tsx:19` (`<OmegaMark pulse>` watermark, no off-screen pause) | CWV / INP | Same perpetual-pulse note as CAP-04; compositor-only, low impact. |

---

## 3. Cross-cutting findings

**Narrative arc — coherent.** Identity + promise (Hero) → capability (Capabilities) → proof (Proof) → portfolio (Projects) → trust (Clients) → texture/scope (Motion band) → conversion (CTA). The order tells a complete story.

| ID | Sev | Dimension | Evidence | Finding & recommendation |
|---|---|---|---|---|
| XC-01 | P2 | Composition / content | hero `web-home-hero.tsx:85-104` vs proof `web-home-proof-scale.tsx:80-98` | **Stat duplication = fatigue.** The hero animates 1997/124+/230 kV/45+/₱1B; Proof re-animates 230 kV/300 MVA/45+/1997 — 3 of 4 overlap. Reframe Proof to non-overlapping proof points (e.g. 300 MVA, island coverage, project count by type) so the second count-up adds information rather than repeating it. |
| XC-02 | P2 | Content | `web-home-hero.tsx:67-69`, `web-home-cta.tsx:31` | **Verbatim tagline twice.** Reinforcement vs repetition is a judgment call; recommend a distinct hero sub-line and reserve the verbatim tagline for the CTA. |
| XC-03 | P2 | Factual accuracy | `page.tsx:18`, `website.ts:65,694`, `web-home-motion-band.tsx:53` vs `accreditations.ts:39` (SEC since 2007) | **Founding-year consistency question (not an error).** The page consistently says "since 1997" (the founding year, also in `site.ts:5`); the credential set records SEC registration since 24 Jul 2007. The two are reconciled in the FAQ (founded 1997, incorporated 2007) but the home surfaces only 1997. **Confirm the intended framing with the client; do not "fix" one to the other** without that confirmation. |
| XC-04 | P2 | Composition | section order in `page.tsx:28-34` | **Dark-section density.** Hero → Capabilities → Proof are three consecutive `dark-section` bands before the light Projects/Clients break. Consider letting one of the first three breathe lighter, or vary texture, to avoid top-of-page monotony. (VoltageTag repetition across sections, by contrast, reads as deliberate brand reinforcement — keep.) |
| XC-05 | P2 | Standards | `lib/content/website.ts:486-523` (`HOME_CAPABILITIES`) | **Dead export.** `HOME_CAPABILITIES` is now consumed only by quarantined `legacy/web-home-capabilities.tsx`. Inline it into that legacy file (as was done for `HOME_CREW`) so the live content file has no orphaned export. |
| XC-06 | P2 | Standards | `web-home-hero.tsx:62`, `web-home-proof-scale.tsx:23`, `web-home-motion-band.tsx:32`, +3 | **Repeated `text-[clamp(...)]` heading values** copy-pasted across 6+ files. Not a token violation (no `@theme` marketing-heading scale exists), but register `--text-heading-hero/-section` in `@theme` for single-point tuning. |
| XC-07 | P3 | Standards | `web-home-projects.tsx:26`, `web-home-motion-band.tsx:62` (`aspect-[16/10]`, `aspect-[4/5]`) | Tailwind v4 supports the canonical slash form `aspect-16/10` / `aspect-4/5` (already used at `web-home-capability-orbit.tsx:310`). Prefer it at the caller sites (and in `PhotoCard`'s default). |
| XC-08 | P3 | Content | `NEWS` exists (`website.ts:710`) but isn't surfaced on home | A flagship home often teases latest news/insight and/or a short "why us"/process strip or a client quote. Optional enhancements, not gaps against spec. |

**Responsive (~320–390px): Strong.** Grids stack then widen (`grid-cols-1 sm:2 lg:3/4/5`), the orbit collapses to a static readable grid below `md` (so the expanded-card tap-target concern never applies on phones), client chips `flex-wrap`, and no horizontal overflow patterns were found. The condensing header and `min-h-11`/`h-12` targets hold. No issues raised.

**Build gates: green.** `pnpm lint` → exit 0, no output. `pnpm exec tsc --noEmit` → exit 0. No home-page-relevant violations to fold in.

---

## 4. Compliance check (hard rails)

Verified the home page renders **none** of the §9 withhold set. Sensitive values are deliberately not reproduced here.

| Rail | Result | Evidence |
|---|---|---|
| TINs | **PASS** | No TIN in any home section or in `HERO_STATS`/`HOME_PROOF`/`FEATURED_PROJECTS`/`CREDENTIAL_STRIP`/`MARQUEE_CLIENTS`/`HOME_CAPABILITY_NODES`. |
| Signed/sealed/scanned documents or certificate images | **PASS** | All `<Image>`/`<video>` sources are project photography or the brand reveal; no certificate scans. |
| Permit fee breakdowns / account numbers | **PASS** | Not present in any home file or consumed content. |
| Personal email `jimwelcapillo@yahoo.com` | **PASS** | Absent from all home files and from `website.ts`/`accreditations.ts`/`site.ts` (the home uses `sales@jcepower.com` only, and only via the footer/contact — not on the home body). |
| Officers' names in a tax context | **PASS** | The president's name exists only in `website.ts` `ABOUT.*` (About page), is not imported by any home section, and is never in a tax context. |

**Overall compliance verdict: PASS.**

---

## 5. Prioritized remediation backlog

| Rank | ID | Sev | Dimension | One-line action |
|---|---|---|---|---|
| 1 | SEO-01 | P1 | SEO | Add `Organization` + `LocalBusiness` JSON-LD to `app/(marketing)/page.tsx` from `SITE` constants (NAP, `foundingDate:"1997"`, `sameAs` Facebook+YouTube); pattern proven in `faq/page.tsx`. |
| 2 | PROOF-01 | P1 | Factual | Relabel the 300 MVA stat "Largest transformer" (not "Largest substation"). `website.ts:682`. |
| 3 | CLI-01 | P1 | Factual | Split "300 MVA / 230 kV … on the CNP backbone" into two distinct credentials (verify attribution vs profile §4). `web-home-clients.tsx:22`. |
| 4 | PERF-01 | P1 | Performance | `preload="metadata"` + compress the 2.5 MB Ω-reveal MP4 to ≤~800 KB. `web-home-omega-reveal.tsx:93`. |
| 5 | PERF-02 | P1 | Performance | Re-encode `public/home/*.jpg` (hero + 4 aerials + capability photos) to `.webp` (≤~120–150 KB @1800px) and update paths; verify hero `<link rel=preload>`. `website.ts:632,655-671`. |
| 6 | CAP-01 | P1 | Accessibility | Add `focus-ring-cyan` to the orbit backdrop dismiss button. `web-home-capability-orbit.tsx:272`. |
| 7 | CAP-02 | P1 | Accessibility | Remove `focus:outline-none` from the focus-target `<h3>` (or pair with a visible ring). `web-home-capability-orbit.tsx:333`. |
| 8 | XC-01 | P2 | Composition | Reframe Proof stats so they don't re-count the hero's figures. |
| 9 | XC-02 / CTA-01 | P2 | Content | Give the hero a distinct sub-line; reserve the verbatim tagline for the CTA. |
| 10 | XC-03 | P2 | Factual | Confirm the 1997 vs 2007 founding-year framing with the client (do not unilaterally change). |
| 11 | CLI-02 / MOT-01 / HERO-03 | P2 | Standards | Move inline marketing copy (clients headline, motion-band block, hero headline) into `lib/content`. |
| 12 | CAP-03 | P2 | Accessibility | Upgrade the orbit card to `role="dialog" aria-modal`. |
| 13 | CLI-03 / HERO-04 | P2 | Accessibility | Verify `text-jce-green-600` 12px-bold kicker contrast and hero stat-label contrast over the photo. |
| 14 | PROOF-02 | P2 | Content | Fix the NSEC "by the sea" alt-text mismatch. `website.ts:661`. |
| 15 | XC-05 | P2 | Standards | Inline `HOME_CAPABILITIES` into its legacy consumer (kill the orphaned export). |
| 16 | XC-04 | P2 | Composition | Vary the three consecutive top-of-page dark bands. |
| 17 | XC-06 | P2 | Standards | Register `--text-heading-*` tokens for the repeated heading `clamp()` values. |
| 18 | CAP-04 / CAP-05 / CTA-02 | P2–P3 | Perf / SEO | Off-screen pause for perpetual `OmegaMark` pulses; add `Service` JSON-LD. |
| 19 | PROJ-01 / MOT-02 / CLI-04 | P2–P3 | Factual / content | Confirm San Carlos client naming; add "I" to Luzon Grid Expansion; add the missing full stop. |
| 20 | PROJ-02 / XC-07 / XC-08 | P3 | Polish | Explicit `motion-reduce` on PhotoCard hover; canonical `aspect-16/10`; optional news/quote teaser. |

---

*Prepared read-only. No `.tsx`/`.ts`/content/config files were modified; the working tree is unchanged except for this report. Findings marked **(verify)** require a runtime measurement or a source the audit did not fully read; they are not asserted as defects.*
