# Home assets manifest

Web-ready media in `public/home/`, prepared for the upcoming home-redesign build. All files were vision-verified (each image opened and checked against its alt text) and renamed to semantic, lowercase kebab-case names. The oversized hero video was compressed; the 35 MB source was archived to `media-raw/` at the repo root (untracked, never deployed).

- **Prep date:** 2026-06-09
- **Source:** untracked Viber dumps, originally `viber_image_*.jpg` + a 35 MB `.mp4`, plus two files added mid-session (see _Provenance_).
- **Optimization note:** JPGs are **not** transcoded here — `next/image` handles format (WebP/AVIF) and responsive sizing at serve time. Filenames are descriptive of _content_, not role; the "Suggested role / page" column is guidance for wiring, not baked into the name.
- **Wired into the HOME redesign (2026-06-09):** see _Wired into the home redesign_ below for which assets now land where on `/`.

## Images

| Filename | Alt text | Suggested role / page | Dimensions | Orientation |
| --- | --- | --- | --- | --- |
| `crew-rebar-column-portrait.jpg` | JC Electrofields crew member at a rebar column in an excavated foundation trench | Home human/craft band · About culture | 1200×1600 | Portrait |
| `crew-rebar-cage-trench-portrait.jpg` | Worker tying a steel rebar cage inside a deep foundation trench | Home human/craft band | 1200×1600 | Portrait |
| `crew-carrying-materials-portrait.jpg` | JC Electrofields worker carrying materials on-site past substation equipment | Home human/craft band | 1200×1600 | Portrait |
| `crew-hauling-bucket-portrait.jpg` | Worker hauling a bucket of material across a sunlit construction site | Home human/craft band | 1200×1600 | Portrait |
| `crew-team-hauling-buckets-portrait.jpg` | JC Electrofields crew hauling buckets in line, company logo on their uniforms | Home human/craft band | 1200×1600 | Portrait |
| `substation-shenda-transformer-engineer.jpg` | Engineer standing beside a SHENDA power transformer at a substation, rice fields behind | Substation hero candidate · Services | 1909×1072 | Landscape |
| `distribution-line-bucket-truck-aerial.jpg` | Aerial of a bucket truck servicing a distribution-line pole over green fields | Distribution Utility page | 1800×1012 | Landscape |
| `solar-farm-substation-aerial.jpg` | Aerial of a solar farm with its adjacent substation and control building | Solar Farm page | 1800×1012 | Landscape |
| `team-group-substation.jpg` | JC Electrofields team group photo in front of an energized substation | Team / About band | 1800×1012 | Landscape |
| `substation-topdown-construction-aerial.jpg` | Top-down aerial of a substation switchyard under construction | Substation / process / graphic band | 1920×1080 | Landscape |
| `substation-solar-field-aerial.jpg` | Aerial of a substation in front of a large solar panel field | Solar / Substation | 1920×1080 | Landscape |
| `team-group-substation-aerial.jpg` | JC Electrofields team posing together inside a completed substation switchyard | Team / About band | 1800×1012 | Landscape |
| `substation-topdown-aerial.jpg` | Top-down aerial of a substation under construction showing the equipment layout, gravel yard, and green-roofed control house | Substation / graphic band | 1800×1012 | Landscape |
| `substation-transformer-mountains.jpg` | Substation with a power transformer and red-roofed control house against a green mountain backdrop | Substation hero candidate | 1800×1012 | Landscape |
| `transformer-install-sagada.jpg` | Crew installing a large power transformer at a substation in Sagada | Process band ⚠️ crop caption first | 1800×1350 (4:3) | Landscape |
| `solar-farm-riverbed-aerial.jpg` | Aerial of a solar panel array installed on reclaimed riverbed terrain bounded by a dike | Solar Farm page | 1800×1012 | Landscape |
| `solar-farm-rows-aerial.jpg` | Aerial of dense rows of solar panels beside white control buildings | Solar Farm page | 1620×911 | Landscape |
| `substation-ricefield-aerial.jpg` | Aerial of a substation beside bright green rice paddies and rural houses | Substation | 1800×1012 | Landscape |
| `substation-solar-panorama-aerial.jpg` | Panoramic aerial of a substation switchyard with a solar farm behind it under a clear blue sky | Hero candidate (home / solar) | 1800×1012 | Landscape |
| `solar-farm-coast-aerial.jpg` | Aerial of a coastal solar farm with panels stretching toward the shoreline | Solar Farm page | 1800×1012 | Landscape |
| `solar-farm-substation-coast-hero.jpg` | Solar farm and substation switchyard on the coast, with the sea on the horizon | **Primary hero candidate** | 1800×1012 | Landscape |
| `solar-farm-nsec-hero.jpg` | Nuevo Solar Energy Corp. (NSEC) facility: a vast solar panel field with control buildings, blue sky, and the sea horizon | **Primary hero candidate** | 1800×1012 | Landscape |
| `office-hq-exterior.jpg` | JC Electrofields office building — modern glass-and-concrete exterior with a wood-slat facade accent and vehicles parked out front | About / Contact (HQ) · company band | 1440×1080 (4:3) | Landscape |

## Video

| Filename | Alt / description | Suggested role | Dimensions | Codec | Duration | Size | Audio |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `jce-omega-reveal-muted.mp4` | JCE Ω logo-reveal sting on a HUD/tech background (audio stripped) | **Home hero one-time brand reveal** — autoplay, muted, plays once/session | 1280×720 | H.264 (+faststart) | 10 s | 2.6 MB | none |
| `jce-omega-reveal.mp4` | _(same sting, with original audio)_ | Click-to-play brand clip — About / elsewhere | 1280×720 | H.264 + AAC (+faststart) | 10 s | 2.66 MB | yes |
| `jce-omega-reveal-poster.jpg` | Poster still of the JCE Ω logo lockup | `poster=` for the reveal `<video>` | 1280×720 | JPEG | — | 0.06 MB | — |
| `office-aerial.mp4` | Aerial orbit of the JC Electrofields office HQ — glass-and-concrete building, rooftop solar canopy, equipment yard | Reserved (NOT used on home) — About/HQ b-roll | 1920×1080 | H.264 (yuv420p, +faststart) | 5.9 s | 2.69 MB | none |

## Notes & flags

- **`transformer-install-sagada.jpg`** has a **baked-in geotag caption** — bottom-left reads "Sagada, Cordillera Administrative Region · Oct 18, 2023, 09:09". **Crop the caption before any hero/marketing use.** It is also **4:3 (1800×1350)**, not 16:9 — account for the taller aspect in layout.
- **`solar-farm-nsec-hero.jpg`** — "NSEC" is **real, legible on-building branding** (Nuevo Solar Energy Corp.); co-developer **Vena Energy** signage is also visible. Not invented.
- **`solar-farm-rows-aerial.jpg`** is **1620×911**, smaller than the other ~1800-wide landscapes — keep it off the largest hero slots.
- **Uniform branding** is visible on the crew portraits ("JC ELECTROFIELDS POWER SYSTEM, INC. — Electrical Contractors & Consultant"). Fine for use; just be aware it's legible.
- **`office-hq-exterior.jpg`** has no legible on-image signage; identified as the JCE office from the original "office photo" filename + context. `office-aerial.mp4` orbits the same building.
- **Hero shortlist (landscape):** the home hero now uses `solar-farm-substation-coast-hero.jpg`; alternates are `solar-farm-nsec-hero.jpg`, `substation-solar-panorama-aerial.jpg`, `substation-transformer-mountains.jpg`.

## Wired into the home redesign (`/`)

The 2026-06-09 photography-led, Lenis-smoothed rebuild. Section order: Hero → Capabilities → **Proof at scale** (pinned) → **From the ground** (crew) → Projects → Clients → Motion band → CTA.

| Asset | Lands in |
| --- | --- |
| `solar-farm-substation-coast-hero.jpg` | **Hero** priority LCP photo (`HOME_HERO`) |
| `jce-omega-reveal-muted.mp4` + `…-poster.jpg` | **Hero** one-time Ω brand reveal overlay (gated; never LCP) |
| `solar-farm-coast-aerial.jpg`, `solar-farm-nsec-hero.jpg`, `substation-solar-panorama-aerial.jpg`, `distribution-line-bucket-truck-aerial.jpg` | **Proof at scale** — scrubbing background aerials (`HOME_PROOF.images`) |
| `crew-rebar-cage-trench-portrait.jpg`, `crew-rebar-column-portrait.jpg`, `crew-team-hauling-buckets-portrait.jpg`, `team-group-substation.jpg` | **From the ground** crew band (`HOME_CREW`) |
| `substation-transformer-mountains.jpg`, `distribution-line-bucket-truck-aerial.jpg`, `solar-farm-rows-aerial.jpg`, `substation-shenda-transformer-engineer.jpg`, `substation-topdown-aerial.jpg`, `substation-ricefield-aerial.jpg` | **Capabilities** photo grid (`HOME_CAPABILITIES`) |

Remaining photos (riverbed, coast, topdown-construction, solar-field, team-group-aerial, transformer-install-sagada, carrying/hauling crew portraits, etc.) stay available for the Solar Farm / Distribution / About / News pages.

## Provenance / archive

- The 35 MB source video (`0-02-06-…_226be80294d.mp4`, 2688×1512, ~50 Mbps) was **archived to `media-raw/` at the repo root** (untracked — kept as the source master, never deployed). `public/home/` now holds only web-weight assets (largest file ≈ 2.8 MB; nothing > 5 MB).
- **Asset names reconciled (2026-06-09 home build):** `office-building-exterior.jpg` → `office-hq-exterior.jpg`; the Ω brand video `jce-brand-intro.mp4` → `jce-omega-reveal.mp4` (+ a muted `jce-omega-reveal-muted.mp4` autoplay variant, lossless `-an` copy, for the hero reveal) → poster `jce-omega-reveal-poster.jpg`; the office aerial `office-building-aerial-loop.mp4` → `office-aerial.mp4` (its superseded `.webm` + loop poster were removed, since the home hero uses a photo, not this loop).
- `public/home/` total: **44 MB → 17 MB** (the 23 JPGs ≈ 9 MB kept full-res for `next/image`; the rest is three ~2.7 MB web videos + the omega poster).
