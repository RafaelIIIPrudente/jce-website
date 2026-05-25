---
name: marketing-site-patterns
description: Use when working on SEO, metadata, sitemap, robots, OG images, or the site information architecture. Covers title templates, generateMetadata, and the canonical site IA for jce-website.
---

# Marketing site patterns

When this skill applies: any change to a marketing page's metadata, any SEO file (`sitemap.ts`, `robots.ts`), OG image generation, anything affecting how the site appears in search results and social previews.

## Site information architecture

All public routes live under `app/(marketing)/`. The canonical IA mirrors <https://www.jcepower.com>:

```
/                                  → Home
/about-us                          → About Us
/product-services                  → Product & Services
/professional-services             → Professional Services
/projects                          → Projects index
/projects/solar-farm               → Solar Farm
/projects/distribution-utility     → Distribution Utility
/projects/ngcp                     → NGCP
/contact-us                        → Contact Us
```

Top-nav links are declared in `components/site-header.tsx:5-10` (`NAV_LINKS` constant). Add new entries there if the page should appear in the top nav.

## Metadata title template

The root layout (`app/layout.tsx:19-26`) provides the template:

```ts
title: {
  default: "JC Electrofields Power System",
  template: "%s — JC Electrofields",
},
```

Each page exports only its short title — the template appends the brand:

```ts
// app/(marketing)/about-us/page.tsx
export const metadata: Metadata = {
  title: "About Us",
};
// Rendered <title>: "About Us — JC Electrofields"
```

Do not include the brand name in page titles. Do not override the template at the page level unless intentionally suppressing the brand suffix (very rare).

## Dynamic metadata with generateMetadata

For routes with a dynamic segment, use `generateMetadata` instead of the static `metadata` export:

```ts
import type { Metadata } from "next";

export async function generateMetadata({ params }): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.name,
    description: project.summary,
    openGraph: { images: [`/og/projects/${project.slug}.png`] },
  };
}
```

## SEO files — not yet present

The following files are part of the Next.js App Router metadata API and should be added as the site approaches launch. None exist in the repo as of the initial commit.

- `app/sitemap.ts` — exports a `sitemap()` function returning the list of URLs. Hand-roll the marketing routes; for dynamic routes, query the source.
- `app/robots.ts` — exports a `robots()` function. Production: allow all. Preview/dev: disallow.
- `app/og/route.tsx` — OpenGraph image generation via `next/og` (`ImageResponse`). Lets each page have a custom OG image without committing PNGs.
- `app/icon.tsx`, `app/apple-icon.tsx` — favicon and Apple touch icon, generated dynamically if you want them themed.

## metadataBase

When deploying, set `metadataBase` in the root layout to the canonical production URL so relative OG image paths resolve correctly:

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://jcepower.com"),
  // ...
};
```

Not yet set in `app/layout.tsx`. Add when production URL is confirmed.

## Common mistakes

- Including the brand in every page's `metadata.title` — the template at `app/layout.tsx:21` already appends it.
- Hand-writing `<meta>` tags in a layout — use the App Router metadata API (`openGraph` key in `Metadata`).
- Setting `metadata.title` to a long sentence — keep titles short; description carries the long form.
- Adding a static `sitemap.xml` under `public/` — use `app/sitemap.ts` so it stays in sync with actual routes.

## References

- `app/layout.tsx:19-26` — title template.
- `app/(marketing)/page.tsx` — home (inherits default title).
- `app/(marketing)/about-us/page.tsx` and siblings — per-page `metadata.title` examples.
- `components/site-header.tsx:5-10` — `NAV_LINKS`.
- BASEPLATE.md § 7 "Marketing site" (per-project-type add-ons).
