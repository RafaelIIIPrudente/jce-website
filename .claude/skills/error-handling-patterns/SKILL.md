---
name: error-handling-patterns
description: Use when writing server actions, error boundaries, or any code path that must surface failures to the UI. Covers the discriminated Result type, error.tsx, notFound(), and Sentry capture.
---

# Error handling patterns

When this skill applies: any new server action, any new route handler that can fail, any new error boundary or 404, any decision about whether to throw or return.

## The Result type for server actions

Server actions consumed by the UI must NEVER throw. They return a discriminated union:

```ts
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code: string };
```

The `code` field categorizes the failure (`"VALIDATION"`, `"AUTH"`, `"NOT_FOUND"`, `"RATE_LIMIT"`, `"INTERNAL"`) so the UI can render an appropriate message without parsing strings.

```ts
"use server";

export async function deleteProject(
  input: unknown,
): Promise<Result<{ id: string }>> {
  const parsed = idSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: "Invalid input", code: "VALIDATION" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized", code: "AUTH" };

  // ... mutation
  return { ok: true, data: { id: parsed.data.id } };
}
```

## error.tsx boundaries

`app/error.tsx:1-56` is the live example. It:

1. Is a Client Component (`'use client'` at the top — required for `error.tsx`).
2. Captures the error to Sentry via `useEffect` (`app/error.tsx:24-26`).
3. Renders a recoverable UI with a `reset()` button.
4. Surfaces `error.digest` as a support reference if present.

Add `error.tsx` at any route segment whose render can fail differently from its siblings. Each `error.tsx` only catches errors thrown _below_ it — wrap critical render paths individually rather than relying on the root boundary.

## not-found.tsx and notFound()

`app/not-found.tsx:13-37` is the live example. Throw `notFound()` from a server component or route handler when a requested resource does not exist:

```ts
import { notFound } from "next/navigation";

export default async function ProjectPage({ params }) {
  const project = await getProject(params.slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
```

`notFound()` triggers the nearest `not-found.tsx`. It only works in server components, route handlers, and server actions — not Client Components.

## Sentry capture

Sentry is wired at three layers:

- `instrumentation.ts:3-10` — Next auto-instrumentation for the server and edge runtimes.
- `instrumentation-client.ts:3-17` — browser SDK with replay (`maskAllText: true`, `blockAllMedia: true`).
- `app/error.tsx:24-26` — manual capture inside the error boundary's `useEffect`.

For caught-but-non-fatal errors in server actions, call `Sentry.captureException(error)` before returning `{ ok: false, ... }` so the failure is observable in production.

## When to throw

Throw only when:

- You are inside a route handler and the failure should produce a non-2xx HTTP response (usually prefer `return NextResponse.json(..., { status: 4xx })` instead).
- The failure is catastrophic and the nearest `error.tsx` should handle recovery.
- You are inside a server component and `notFound()` is the correct response.

Never throw from a server action that a `<form action={...}>` or button-triggered call expects to await.

## Common mistakes

- Throwing from a server action — the user sees an unstyled error, the form does not reset, and Sentry may not capture it.
- A single root `app/error.tsx` covering the whole app — granular boundaries recover faster.
- Forgetting `Sentry.captureException` before returning `{ ok: false }` from a caught error.
- Calling `notFound()` from a Client Component — it has no effect there.

## References

- `app/error.tsx`, `app/not-found.tsx` — live examples.
- `instrumentation.ts`, `instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` — Sentry wiring.
- `next.config.ts:8-14` — `withSentryConfig` wrap.
- BASEPLATE.md § 4 "Error handling".
- AGENTS.md § Architectural rules — rules 1, 6.
