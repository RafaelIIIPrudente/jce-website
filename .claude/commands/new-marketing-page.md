# /new-marketing-page

Create a new page under the `(marketing)` route group. Use when adding a public section to the site (a new project case study, service detail page, etc.).

## Steps

1. **Create the file** at `app/(marketing)/<slug>/page.tsx`:

   ```tsx
   import type { Metadata } from "next";

   export const metadata: Metadata = {
     title: "Page Name",
   };

   export default function PageNamePage() {
     return (
       <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16">
         <h1 className="text-4xl font-semibold tracking-tight">Page Name</h1>
         <p className="text-lg text-muted-foreground">Content goes here.</p>
       </section>
     );
   }
   ```

2. **Metadata title** — keep it short. The root layout's title template at `app/layout.tsx:19-22` automatically appends ` — JC Electrofields`. Do not include the brand in the page-level title.

3. **Layout** — the page inherits header + footer from `app/(marketing)/layout.tsx`. Do not re-import `SiteHeader` or `SiteFooter`.

4. **Server component by default** (rule 1). Add `'use client'` only at a leaf component that needs browser APIs or state — never at the page itself unless the entire page is interactive.

5. **Top-nav link** (optional) — if the page should appear in the top nav, add it to `NAV_LINKS` in `components/site-header.tsx:5-10`.

## Verification

- `pnpm dev` — page renders at `http://localhost:3000/<slug>`. Requires populated `.env.local` (see CLAUDE.md).
- `pnpm lint` passes.
- Browser tab title reads `<Page Name> — JC Electrofields`.

See [`marketing-site-patterns`](../skills/marketing-site-patterns/SKILL.md) for the site IA and metadata conventions.
