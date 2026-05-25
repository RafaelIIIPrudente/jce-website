# /new-route-handler

Create a route handler under `app/api/`. Use ONLY for webhooks, OAuth callbacks, external APIs consumed by non-Next clients, and AI streaming responses (rule 6). For mutations from your own UI, use `/new-server-action`.

## Steps

1. **Confirm a route handler is the right shape.** If the caller is your own form, button, or page, use a server action. Route handlers exist only for:
   - Webhooks (Stripe, Resend) — need raw body for signature verification.
   - OAuth callbacks (Supabase auth code exchange, third-party identity).
   - APIs consumed by mobile, CLI, or external services.
   - Streaming AI responses where raw `Response` control matters.

2. **Create the file** at `app/api/<segment>/route.ts`:

   ```ts
   import { NextResponse, type NextRequest } from "next/server";
   import { z } from "zod";

   const requestSchema = z.object({
     // ... expected shape
   });

   export async function POST(request: NextRequest) {
     const body = await request.json();
     const parsed = requestSchema.safeParse(body);
     if (!parsed.success) {
       return NextResponse.json({ error: "invalid_input" }, { status: 400 });
     }
     // ... handle
     return NextResponse.json({ ok: true });
   }
   ```

3. **Webhooks** — read the raw body with `await request.text()` (not `.json()`) so signatures can be verified against the exact signed bytes:

   ```ts
   const raw = await request.text();
   const signature = request.headers.get("stripe-signature");
   const event = stripe.webhooks.constructEvent(
     raw,
     signature,
     env.STRIPE_WEBHOOK_SECRET,
   );
   ```

4. **AI streaming** — return `result.toAIStreamResponse()` from the Vercel AI SDK; do not buffer.

5. **Service-role usage** — if the handler must bypass RLS (e.g., a webhook updating a user record), use a server-only helper backed by `env.SUPABASE_SERVICE_ROLE_KEY` (rule 5). Never import service-role code outside `server-only` modules.

## Verification

- `pnpm dev` — `curl` the endpoint with valid and invalid payloads.
- `pnpm lint` passes.
- For webhooks: alter the payload after signing and confirm signature verification rejects it.

See [`supabase-patterns`](../skills/supabase-patterns/SKILL.md) for service-role gating.
