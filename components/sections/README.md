# `components/sections/`

Marketing-site section components, segregated for maintainability. Imports use the
`@/components/sections/<folder>/<file>` alias (direct file paths — no barrels).

## Layout

| Folder      | What lives here                                                                                                                                                                                                                                                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kit/`      | The reusable **electrified design kit** — shared across pages. Primitives (`web-omega-mark`, `web-current-trace`, `web-voltage-tag`, `web-circuit-reveal`, `web-energized-counter`, `web-photo-card`, `web-electrified-divider`, `web-magnetic-button`, `web-video-embed`, `web-reveal`) and generic page shells (`web-hero`, `web-section`, `web-cta`). |
| `home/`     | Page-scoped sections for the home page (`app/(marketing)/page.tsx`).                                                                                                                                                                                                                                                                                     |
| `about/`    | About Us (`app/(marketing)/about-us`).                                                                                                                                                                                                                                                                                                                   |
| `services/` | Services (`app/(marketing)/services`).                                                                                                                                                                                                                                                                                                                   |
| `products/` | Products (`app/(marketing)/products`).                                                                                                                                                                                                                                                                                                                   |
| `projects/` | Projects index + the solar-farm / distribution-utility / ngcp case-study sub-pages.                                                                                                                                                                                                                                                                      |
| `news/`     | News (`app/(marketing)/news`).                                                                                                                                                                                                                                                                                                                           |
| `careers/`  | Careers (`app/(marketing)/careers`).                                                                                                                                                                                                                                                                                                                     |
| `contact/`  | Contact (`app/(marketing)/contact-us`) — incl. `contact-form`, `map-embed`.                                                                                                                                                                                                                                                                              |
| `faq/`      | FAQ (`app/(marketing)/faq`).                                                                                                                                                                                                                                                                                                                             |
| `legacy/`   | **Unused / not mounted.** Older sections kept for reference or future pages (some deliberately retained for a future consultancy/process page). Nothing in `app/` imports these. Do not wire new pages to `legacy/` — promote a file out of it first.                                                                                                    |

## Conventions

- **Shared vs page-scoped.** If a component is reused by 2+ pages, it belongs in
  `kit/`. If it serves exactly one page, it lives in that page's folder.
- **`web-` prefix** marks the current electrified kit/sections; un-prefixed files
  are older components (all currently in `legacy/`).
- **Server-first.** Sections are Server Components unless they need browser APIs,
  state, or client-only libs (anime.js / motion) — those are leaves marked
  `"use client"` (e.g. `kit/web-current-trace`, `kit/web-reveal`).
- **Adding a section:** drop it in the matching page folder (or `kit/` if shared)
  and import via the full path. No barrel `index.ts` files — keep imports explicit.
