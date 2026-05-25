# /new-server-action

Create a server action for a UI-initiated mutation (form submit, button-triggered write). Use when the caller is your own React component (rule 6).

## Steps

1. **Choose a location.** Co-locate with the route that calls it:
   - Per-route: `app/(marketing)/<route>/_actions/<action-name>.ts`
   - Cross-cutting: `app/_actions/<action-name>.ts`

   The leading underscore (`_actions/`) marks the folder as private and non-routable.

2. **Create the file**:

   ```ts
   "use server";

   import { z } from "zod";

   const inputSchema = z.object({
     // ... input shape
   });

   type Result<T> =
     | { ok: true; data: T }
     | { ok: false; error: string; code: string };

   export async function actionName(
     input: unknown,
   ): Promise<Result<{ id: string }>> {
     const parsed = inputSchema.safeParse(input);
     if (!parsed.success) {
       return { ok: false, error: "Invalid input", code: "VALIDATION" };
     }

     // Auth check — rule 3.
     // const supabase = await createClient();
     // const { data: { user } } = await supabase.auth.getUser();
     // if (!user) return { ok: false, error: "Unauthorized", code: "AUTH" };

     // Mutation via Drizzle.
     // const [row] = await db.insert(table).values({ ... }).returning();

     return { ok: true, data: { id: "..." } };
   }
   ```

3. **Never throw from a server action the UI consumes.** Return `{ ok: false, ... }` for expected failures. Throw only when the failure is catastrophic enough that the nearest `error.tsx` should handle it.

4. **Database access** — call Drizzle directly (`import { db } from "@/lib/db/client"`). If the mutation must respect RLS, route through the Supabase server client instead so the user's JWT is applied.

5. **Revalidation** — call `revalidatePath('/<route>')` after a write that should refresh server-rendered data.

## Verification

- `pnpm lint` passes.
- Invoke from a form or button in `pnpm dev`; confirm both `ok: true` and `ok: false` paths render correctly without thrown errors reaching the UI.

See [`error-handling-patterns`](../skills/error-handling-patterns/SKILL.md) for the `Result` contract.
