# Home assets manifest

Web-ready media in `public/home/`, prepared for the upcoming home-redesign build. All files were vision-verified (each image opened and checked against its alt text) and renamed to semantic, lowercase kebab-case names. The oversized hero video was compressed; the 35 MB source was archived to `media-raw/` at the repo root (untracked, never deployed).

- **Prep date:** 2026-06-09
- **Source:** untracked Viber dumps, originally `viber_image_*.jpg` + a 35 MB `.mp4`, plus two files added mid-session (see _Provenance_).
- **Optimization note:** JPGs are **not** transcoded here — `next/image` handles format (WebP/AVIF) and responsive sizing at serve time. Filenames are descriptive of _content_, not role; the "Suggested role / page" column is guidance for wiring, not baked into the name.
- **Nothing is wired into any page yet** — this is asset prep only.

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
| `office-building-exterior.jpg` | JC Electrofields office building — modern glass-and-concrete exterior with a wood-slat facade accent and vehicles parked out front | About / Contact (HQ) · company band | 1440×1080 (4:3) | Landscape |

## Video

| Filename | Alt / description | Suggested role | Dimensions | Codec | Duration | Size | Audio |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `office-building-aerial-loop.mp4` | Aerial orbit of the JC Electrofields office building — glass-and-concrete HQ with a rooftop solar canopy and equipment yard | **Primary home hero loop** (pair with `.webm`) | 1920×1080 | H.264 (yuv420p, +faststart) | 5.9 s | 2.69 MB | none |
| `office-building-aerial-loop.webm` | _(same footage, VP9)_ | Home hero loop — list before the MP4 in `<video>` | 1920×1080 | VP9 | 5.9 s | 2.68 MB | none |
| `office-building-aerial-loop-poster.jpg` | Poster still for the loop above (mid-frame) | `poster=` for the hero `<video>` | 1920×1080 | JPEG | — | 0.36 MB | — |
| `jce-brand-intro.mp4` | Branded JCE Ω logo-reveal sting on a HUD/tech background | Brand splash / intro / About | 1280×720 | H.264 + AAC (+faststart) | 10 s | 2.66 MB | yes (kept) |
| `jce-brand-intro-poster.jpg` | Poster still of the JCE Ω logo lockup | `poster=` for the intro `<video>` | 1280×720 | JPEG | — | 0.06 MB | — |

## Notes & flags

- **`transformer-install-sagada.jpg`** has a **baked-in geotag caption** — bottom-left reads "Sagada, Cordillera Administrative Region · Oct 18, 2023, 09:09". **Crop the caption before any hero/marketing use.** It is also **4:3 (1800×1350)**, not 16:9 — account for the taller aspect in layout.
- **`solar-farm-nsec-hero.jpg`** — "NSEC" is **real, legible on-building branding** (Nuevo Solar Energy Corp.); co-developer **Vena Energy** signage is also visible. Not invented.
- **`solar-farm-rows-aerial.jpg`** is **1620×911**, smaller than the other ~1800-wide landscapes — keep it off the largest hero slots.
- **Uniform branding** is visible on the crew portraits ("JC ELECTROFIELDS POWER SYSTEM, INC. — Electrical Contractors & Consultant"). Fine for use; just be aware it's legible.
- **`office-building-exterior.jpg`** has no legible on-image signage; identified as the JCE office from the original "office photo" filename + context. The 35 MB aerial loop orbits the same building.
- **Hero shortlist (landscape):** `solar-farm-substation-coast-hero.jpg`, `solar-farm-nsec-hero.jpg`, `substation-solar-panorama-aerial.jpg`, `substation-transformer-mountains.jpg`, plus the `office-building-aerial-loop` video.

## Provenance / archive

- The 35 MB source video (`0-02-06-…_226be80294d.mp4`, 2688×1512, ~50 Mbps) was **archived to `media-raw/` at the repo root** (untracked — kept as the source master, never deployed). `public/home/` now holds only web-weight assets (largest file 2.8 MB).
- **Added mid-session, outside the original "22 images + one video" scope** (normalized here as web-ready prep, flagged for your review):
  - `office photo.jpg` (had a space in the name) → `office-building-exterior.jpg`.
  - `JCE_is_an_electrical_engineeri.mp4` (2.79 MB, already web-weight) → `jce-brand-intro.mp4`, losslessly remuxed with `+faststart`, audio kept, poster added. Not re-compressed (already fine) and not archived (it is not an oversized source).
- `public/home/` total: **44 MB → 18 MB** (the 22 JPGs ≈ 9 MB are intentionally kept full-res for `next/image`; the rest is the three ~2.7 MB web videos + two posters).
