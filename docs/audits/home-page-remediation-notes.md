# Home Page Remediation — Notes

Companion to [`home-page-audit.md`](./home-page-audit.md). Records what was fixed, what was verified-and-left, what needs a client/business decision, and what was deliberately deferred. **Report + working-tree changes only — nothing was committed or pushed.**

- **Date:** 2026-06-11 · **Branch:** `improve-public-website`
- **Orchestration:** hierarchical claude-flow swarm (`swarm-1781159782182-qozs52`) for coordination + handoff memory (namespace `jce-home-remediation`); a background factual-verification subagent for Tier-2 source checks; interdependent edits to the three shared files (`lib/content/website.ts`, `web-home-capability-orbit.tsx`, `app/globals.css`) were single-owned and sequenced to avoid concurrent writes.
- **Gates (a dev server was live on :3000, so per the repo rule NO `pnpm build` / no `.next` clear):**
  - `pnpm exec tsc --noEmit` → **exit 0**
  - `pnpm lint` → **exit 0**
  - `curl http://localhost:3000/` → **200**; JSON-LD parsed valid (`@graph` of 13 nodes); new copy + `text-heading-*` utilities confirmed in the rendered HTML/CSS.

---

## 1. Fixed

| ID | What changed | Files touched |
|----|--------------|---------------|
| **SEO-01** (+CAP-05, partial PROJ-03) | Added an `Organization` + `LocalBusiness` + 12× `Service` JSON-LD `@graph` (schema.org / FR-WEB-09), sourced from `SITE` + `SERVICES`. NAP uses the **contact** address (3074 F. Bautista St., Ugong), `foundingDate:"1997"`, `sameAs` → Facebook + YouTube. | `app/(marketing)/page.tsx` |
| **PROOF-01** | Relabelled the 300 MVA stat from "Largest substation" → **"Largest transformer"** (it is a transformer rating). | `lib/content/website.ts` (`HOME_PROOF.stats`) |
| **PROOF-02** | NSEC aerial alt: dropped the unverifiable "by the sea" **and** the ambiguous corporate name → neutral, accurate: "Aerial of a vast utility-scale solar panel field stretching toward the horizon." | `lib/content/website.ts` |
| **XC-01** | Reframed the Proof stats so they no longer duplicate the hero strip. New set (all §9-safe, verifiable from existing content): **300 MVA** largest transformer · **120 MWp** largest solar EPC · **400 MVAr** largest capacitor bank (4×100 MVAr) · **3** regions energized. No more duplicate 230 kV / 45+ / 1997 count-ups. | `lib/content/website.ts` |
| **CLI-01** | **Verified CONFIRMED** against company-profile §4: the 300 MVA figure is Luzon Grid Expansion I (Cabanatuan/Biñan); the Cebu–Negros–Panay backbone is a separate 230 kV credential with no MVA. Split the conflated sentence into two distinct claims: "Flagship NGCP credentials — **300 MVA / 230 kV** Luzon Grid substations, and the Cebu–Negros–Panay 230 kV backbone." | `lib/content/website.ts` (`HOME_CLIENTS`), `web-home-clients.tsx` |
| **CLI-03** | **Measured:** `text-jce-green-600` (#23982f) on the glass surface ≈ **3.5:1** at 12px-bold → fails AA (4.5 needed). Switched the "Trusted by" kicker to `text-jce-green-700` (#007817) ≈ **5.4:1** → passes. | `web-home-clients.tsx` |
| **MOT-02** | **Verified CONFIRMED:** profile names it "Luzon Grid Expansion **I**". Caption → "Bauang Switchyard — Luzon Grid Expansion I". | `lib/content/website.ts` (`HOME_MOTION_BAND`), `web-home-motion-band.tsx` |
| **CLI-02 / MOT-01 / HERO-03** | Extracted all inline marketing copy into content constants: new `HOME_CLIENTS`, `HOME_MOTION_BAND`, and `HOME_HERO.{kicker,headlineLead,headlineAccent,sub}`. Components now render from the constants. | `lib/content/website.ts`, `web-home-hero.tsx`, `web-home-clients.tsx`, `web-home-motion-band.tsx` |
| **XC-02 / CTA-01** | Hero now shows a **distinct scope sub-line** ("Single-vendor EPC for substations, transmission, switchgear and solar — engineered, built and energized to 230 kV, nationwide."); the verbatim `TAGLINE` is now used **only** by the CTA. Confirmed at runtime the tagline renders once. | `lib/content/website.ts`, `web-home-hero.tsx` |
| **XC-05** | Inlined the orphaned `HOME_CAPABILITIES` export + its `CapabilityCard` type into their only consumer, the quarantined `legacy/web-home-capabilities.tsx`; removed both from the live content file (no orphaned export). | `lib/content/website.ts`, `legacy/web-home-capabilities.tsx` |
| **XC-06** | Registered `--text-heading-{hero,section,proof,band,cta,trust}` tokens (size + matching line-height) in the `@theme` block; replaced the copy-pasted `text-[clamp(...)] leading-[...]` heading values across the home sections + shared `SectionHead`. **Values copied exactly → zero visual change** (verified the clamps in compiled CSS). | `app/globals.css`, `web-home-hero.tsx`, `web-home-capabilities-orbital.tsx`, `web-home-proof-scale.tsx`, `web-home-clients.tsx`, `web-home-motion-band.tsx`, `web-home-cta.tsx`, `kit/web-section.tsx` |
| **XC-07** | Switched `aspect-[16/10]` / `aspect-[4/5]` → canonical `aspect-16/10` / `aspect-4/5` at the caller sites and in `PhotoCard`'s default. | `web-home-projects.tsx`, `web-home-motion-band.tsx`, `kit/web-photo-card.tsx` |
| **PROJ-02** | PhotoCard hover scale guarded against reduced motion. **Deviation (improvement):** used `motion-safe:group-hover/photo:scale-[1.04]` + `motion-reduce:transition-none` instead of the suggested `motion-reduce:scale-100` — the latter loses to the `:hover` selector's higher specificity and would *not* actually suppress the scale; `motion-safe:` removes it cleanly. | `kit/web-photo-card.tsx` |
| **CAP-01** | Added `focus-ring-cyan` to the orbit backdrop dismiss button (was invisible focus). | `web-home-capability-orbit.tsx` |
| **CAP-02** | Removed `focus:outline-none` from the programmatically-focused card `<h3>`; gave it `focus-ring-cyan` + an id. | `web-home-capability-orbit.tsx` |
| **CAP-03** | Upgraded the expanded orbit card `role="group"` → `role="dialog" aria-modal="true" aria-labelledby={h3 id}`. **Caveat:** focus is moved-on-open and Escape-closes, but Tab focus is not yet *trapped* within the dialog — full focus-trap is a follow-up (noted below). | `web-home-capability-orbit.tsx` |
| **CAP-04 / CTA-02** | OmegaMark pulse now pauses via `IntersectionObserver` when off-screen (and resumes on re-entry); reduced-motion gate intact. | `kit/web-omega-mark.tsx` |
| **PERF-01** | Ω-reveal video → `preload="metadata"`; transcoded `jce-omega-reveal-muted.mp4` 2.55 MB → **470 KB** (H.264, 960w, faststart, audio stripped). Original archived to `media-raw/home/jce-omega-reveal-muted-original.mp4`. | `web-home-omega-reveal.tsx`, `public/home/`, `media-raw/home/` |
| **PERF-02** | Re-encoded the 10 home raster sources (hero + 4 proof aerials + 6 capability photos) to `.webp` and updated all paths in `website.ts`. Originals archived to `media-raw/home/`. Hero LCP remains the single `priority` image; all consume via `next/image fill` over aspect-reserved containers (no CLS). | `public/home/*.webp`, `lib/content/website.ts` |

**Asset re-encode results (source weight, matching the `public/projects/*.webp` convention ≤~233 KB):**

| File | before (.jpg) | after (.webp) | dims |
|------|--------------|---------------|------|
| solar-farm-substation-coast-hero (LCP) | 419 KB | **172 KB** | 1600w |
| solar-farm-coast-aerial | 609 KB | **207 KB** | 1280w |
| solar-farm-nsec-hero | 260 KB | **95 KB** | 1600w |
| substation-solar-panorama-aerial | 371 KB | **149 KB** | 1600w |
| distribution-line-bucket-truck-aerial | 492 KB | **221 KB** | 1600w |
| substation-transformer-mountains | 508 KB | **227 KB** | 1600w |
| solar-farm-rows-aerial | 437 KB | **229 KB** | 1600w |
| substation-shenda-transformer-engineer | 412 KB | **175 KB** | 1600w |
| substation-topdown-aerial | 643 KB | **226 KB** | 1280w |
| substation-ricefield-aerial | 498 KB | **218 KB** | 1600w |

Total source weight: **~4.65 MB → ~1.92 MB** (−59%), plus video −82%. Intrinsic dims recorded above (consumed via `fill` — no width/height props needed; aspect containers prevent CLS).

---

## 2. Verified and left unchanged

| ID | Finding | Result | Action |
|----|---------|--------|--------|
| **HERO-04** | Hero stat sub-label `text-jce-dark-ink-2` contrast over the photo | Computed `#9fbcab` on the dark tile (`#0a140e` under the gradient) ≈ **9:1** — comfortably passes AA. | None. |
| **CLI-04** | "Missing full stop" on the Shenda distributor sentence | **False finding** — `web-home-clients.tsx` already ended the sentence with a period ("power transformers."). Preserved in `HOME_CLIENTS.distributorTail`. | None. |

---

## 3. Decisions needed (surfaced for the user — code intentionally NOT changed)

- **XC-03 — "since 1997" vs SEC registration 2007.** Left every "since 1997" exactly as-is across the page (hero stat, motion-band tag, metadata, and `foundingDate:"1997"` in the new JSON-LD). The page is internally consistent on 1997 (the founding year); the FAQ already reconciles it (founded 1997 / incorporated 2007). **Confirm the intended framing before any change.**
- **PROJ-01 — San Carlos Sun Power.** Left as "Confidential client" (`client:null`). The published company profile names this client openly, so naming it may be a stronger credential — **confirm with the client** whether it can be named. Not changed.
- **CLI-01 corrected copy — confirm wording.** The conflation was fixed (verified against profile §4), but the new trust-bar sentence ("…300 MVA / 230 kV Luzon Grid substations, and the Cebu–Negros–Panay 230 kV backbone.") should get a quick marketing read for tone/length.

---

## 4. Out of scope this pass (proposals only — not built)

- **XC-04 — top-of-page dark-band density.** Hero → Capabilities → Proof are three consecutive `dark-section` bands before the light Projects/Clients break. *Proposal:* give one of the first three a lighter/glass treatment, or interleave a light band, to vary the rhythm. Subjective design change — recommend a quick design review before implementing.
- **XC-08 — missing flagship section.** *Proposal:* add a short news/insight teaser (the `NEWS` data already exists) or a client-quote/testimonial strip between Clients and the Motion band, to add social proof. Net-new section — out of scope for a remediation pass.

---

## 5. Notes / follow-ups

- **Orbital dialog focus-trap (from CAP-03):** the card is now `role="dialog" aria-modal="true"` with focus-on-open + Escape-to-close, but Tab is not yet trapped inside (the orbit node buttons behind remain tabbable). A small focus-trap (cycle Tab within the dialog while open) is the clean follow-up; deferred to keep this pass scoped.
- **`text-[clamp(...)]` that intentionally remain:** the hero/proof **stat-number** sizes (`text-[clamp(22px,4vw,32px)]`, `text-[clamp(26px,5vw,44px)]`) are one-off counter sizes, not the repeated heading tiers XC-06 targeted, so they were left as arbitrary values (no token warranted).
- **ruflo local artifacts:** the coordination/memory step created `agentdb.rvf` / `agentdb.rvf.lock` at the repo root (untracked). These are local ruflo brain files, not part of the deliverable — safe to delete or add to `.gitignore`.
- **No commits/pushes were made.** All changes (16 modified files, 10 `.jpg`→`.webp` swaps, 1 video, 2 new docs, archived originals under `media-raw/home/`) are in the working tree for review.
