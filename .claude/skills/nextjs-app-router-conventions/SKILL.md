---
name: nextjs-app-router-conventions
description: Use when adding pages, layouts, route handlers, or special files (loading, error, not-found, metadata) under the app/ directory. Covers route groups, the server-by-default rule, and where to draw the 'use client' boundary.
---

# Next.js App Router conventions

When this skill applies: any new file under `app/`, any change to layout inheritance, any metadata work, any decision between server and client components.

## Route groups

The repo uses `(marketing)` to group public site routes without affecting the URL (`app/(marketing)/layout.tsx`). Reserved groups per BASEPLATE.md § 4 — not yet present:

- `(marketing)` — public site (in use).
- `(auth)` — login, signup, password reset.
- `(app)` — authenticated product surface, gated by `proxy.ts`. `PROTECTED_PREFIXES` in `proxy.ts:7` already reserves `/dashboard` and `/settings`.

Add a new group with `app/(group-name)/layout.tsx` plus its own pages.

## Special files

Each route segment may declare:

| File            | Purpose                                                                             |
| --------------- | ----------------------------------------------------------------------------------- |
| `layout.tsx`    | Wraps the segment. Inherits parent layouts. Server component unless it needs state. |
| `page.tsx`      | The route. Default export.                                                          |
| `loading.tsx`   | Suspense fallback. Live example: `app/loading.tsx:3-17`.                            |
| `error.tsx`     | Error boundary. Must be a Client Component. Live example: `app/error.tsx:1-56`.     |
| `not-found.tsx` | 404 UI, paired with `notFound()` calls. Live example: `app/not-found.tsx:13-37`.    |

Add granular `loading.tsx` / `error.tsx` at any segment whose data fetch or render can fail or slow independently of its siblings.

## Metadata

Root layout (`app/layout.tsx:19-26`) declares the title template:

```ts
export const metadata: Metadata = {
  title: {
    default: "JC Electrofields Power System",
    template: "%s — JC Electrofields",
  },
  description: "...",
};
```

Page-level metadata exports only the short title — the template appends ` — JC Electrofields`:

```ts
export const metadata: Metadata = {
  title: "About Us",
};
```

For dynamic routes (`app/projects/[slug]/page.tsx` etc.), use `generateMetadata`:

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const project = await getProject(params.slug);
  return { title: project.name, description: project.summary };
}
```

## Server-by-default — rule 1

Default every component to a Server Component. Add `'use client'` only at the leaf that needs:

- Browser APIs (`window`, `localStorage`, `IntersectionObserver`).
- React state or effects (`useState`, `useEffect`).
- Event handlers (`onClick`, `onSubmit`).
- Client-only libraries (`motion/react`, `react-hook-form`, TanStack Query).

A client `<Button>` inside a server `<Page>` is correct. A client `<Page>` containing static content is wrong.

Client Components render Server Components only via the `children` prop, never via direct import.

## Server actions vs. route handlers — rule 6

| Use case                                  | Pick          |
| ----------------------------------------- | ------------- |
| Mutation from your own UI                 | Server action |
| Webhook (Stripe, Resend, etc.)            | Route handler |
| OAuth callback                            | Route handler |
| External API consumed by non-Next clients | Route handler |
| AI streaming response                     | Route handler |

See [`error-handling-patterns`](../error-handling-patterns/SKILL.md) for the `Result` type server actions must return.

## Common mistakes

- Marking a page `'use client'` to add an event handler — extract the handler into a leaf instead.
- Directly importing a Server Component into a Client Component — silently re-renders on the client and breaks data fetching.
- A single root `error.tsx` covering the whole app — add granular boundaries closer to where failure can occur.
- Inlining the brand in every page's `metadata.title` — the template at `app/layout.tsx:21` already does it.

## References

- `app/layout.tsx:19-26` — title template.
- `app/(marketing)/layout.tsx` — route group layout.
- `app/error.tsx`, `app/not-found.tsx`, `app/loading.tsx` — canonical special files.
- BASEPLATE.md § 4 "Server Components vs. Client Components", § 4 "Folder and route organization (App Router)".
- AGENTS.md § Architectural rules — rules 1, 6.
