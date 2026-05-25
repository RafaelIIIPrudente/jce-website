# /new-rls-policy

Enable RLS and add policies for a Postgres table via raw SQL. Use immediately after `/new-supabase-table` and BEFORE the first insert (rule 4).

## Steps

1. **Enable RLS on the table.** Add this to the migration file in `lib/db/migrations/`:

   ```sql
   ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
   ```

2. **Write policies** keyed off `auth.uid()`.

   **Single-user tables** (e.g., `profiles`):

   ```sql
   CREATE POLICY "Users can read own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
   ```

3. **Multi-tenant tables** — policies check membership via `tenant_members`:

   ```sql
   CREATE POLICY "Members can read tenant data" ON projects
     FOR SELECT USING (
       EXISTS (
         SELECT 1 FROM tenant_members
         WHERE tenant_members.tenant_id = projects.tenant_id
           AND tenant_members.user_id = auth.uid()
       )
     );
   ```

   Repeat for `INSERT`, `UPDATE`, `DELETE` as needed. Restrict mutations to specific roles by also checking `tenant_members.role`.

4. **Apply the migration**:

   ```bash
   pnpm db:push
   ```

5. **Service-role usage** — the service-role key bypasses RLS (rule 5). For admin code that must insert without policy checks, use a `server-only` helper backed by `env.SUPABASE_SERVICE_ROLE_KEY`.

## Verification

- In `pnpm db:studio`, run a `SELECT` from the table as the `anon` role — should return no rows when no policy authorizes it.
- Sign in as a test user in `pnpm dev`; confirm the user sees only authorized rows.
- `pnpm lint` passes.

See [`supabase-patterns`](../skills/supabase-patterns/SKILL.md) for the auth model and service-role gating.
