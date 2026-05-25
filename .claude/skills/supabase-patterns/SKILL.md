---
name: supabase-patterns
description: Use when working with Supabase Auth or SSR clients — choosing between client.ts / server.ts / middleware.ts, reading the current user, refreshing session cookies, gating service-role usage, or editing proxy.ts.
---

# Supabase patterns

When this skill applies: any code path that touches authentication, reads `supabase.auth`, or imports from `@/lib/supabase/*`.

## The three clients — never mix them

| File                           | When to import                                                                                                                                                                                                              |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/supabase/client.ts:5`     | Client Components only. `createClient()` returns a `createBrowserClient` instance.                                                                                                                                          |
| `lib/supabase/server.ts:8`     | Server Components, server actions, and route handlers. Reads the cookie store via `next/headers`. The file declares `import "server-only"` (`lib/supabase/server.ts:1`) — importing into a client component fails at build. |
| `lib/supabase/middleware.ts:6` | Middleware (`proxy.ts`) only. Refreshes the session cookie on every request.                                                                                                                                                |

Mixing them produces silent auth failures (e.g., a browser client called from a server action reads stale or no cookies). Always pick the one matching your execution context.

## Reading the current user — rule 3

Always `getUser()`, never `getSession()`. `getSession` trusts the cookie; `getUser` verifies the JWT against Supabase Auth.

```ts
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) {
  // unauthorized — return { ok: false, ... } from server actions; redirect from route handlers
}
```

## Cookie refresh in middleware

`lib/supabase/middleware.ts:30-34` calls `supabase.auth.getUser()` for its side effect: triggering the SSR helper's cookie-writeback path. Without this call, sessions silently expire.

Do not remove the `getUser()` call in `updateSession()` even when the returned user is not used downstream.

## Service-role keys — rule 5

The service-role key bypasses RLS and must never reach the browser. When you need a service-role client:

1. Create the helper in a `server-only` file (top of file: `import "server-only"`).
2. Read `env.SUPABASE_SERVICE_ROLE_KEY` (declared in `env.ts:7` under the `server` schema).
3. Use only for admin paths — webhooks, cron jobs, migrations.

`lib/supabase/server.ts:1` already declares `server-only` — model new service-role helpers on it.

## The proxy.ts middleware

`proxy.ts` is the Next.js middleware. It:

1. Calls `updateSession()` to refresh the auth cookie.
2. Reads the resulting `user`.
3. Redirects to `/login?next=...` when the request targets a `PROTECTED_PREFIXES` route and the user is unauthenticated.

When adding a new protected segment (e.g., `/admin`), append the prefix to `PROTECTED_PREFIXES` in `proxy.ts:7`.

## Known issue — empty env crashes the middleware

If `.env.local` does not have `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` populated, `createServerClient` throws at `lib/supabase/middleware.ts:9` and every request returns 500. See AGENTS.md § Quirks and known limits.

## Common mistakes

- `supabase.auth.getSession()` anywhere (rule 3 — the `quality-gate.sh` hook fails on this).
- Importing `lib/supabase/client.ts` into a server component (returns no auth context).
- Forgetting `import "server-only"` on a service-role helper (rule 5).
- Skipping the `getUser()` call in `updateSession` because "we don't use the user" — it has the necessary side effect.

## References

- `lib/supabase/{client,server,middleware}.ts` — the three clients.
- `proxy.ts:1-38` — middleware shape and protected-route gating.
- BASEPLATE.md § 4 "Supabase auth patterns".
- AGENTS.md § Architectural rules — rules 3, 5.
