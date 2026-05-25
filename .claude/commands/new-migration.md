# /new-migration

Generate and apply a Drizzle migration from a schema diff. Use after editing `lib/db/schema.ts`.

## Steps

1. **Edit `lib/db/schema.ts`** with the new or changed table definitions.

2. **Generate migration SQL**:

   ```bash
   pnpm db:generate
   ```

   Drizzle Kit diffs the schema against the database (per `drizzle.config.ts:5-15`) and writes a numbered SQL file to `lib/db/migrations/`. The directory is created on first run if it does not exist.

3. **Inspect the generated SQL** before applying. Watch for:
   - Unexpected `DROP COLUMN` / `DROP TABLE` (you likely renamed — Drizzle does not detect renames; write a manual migration).
   - Missing `ENABLE ROW LEVEL SECURITY` for new multi-tenant tables — Drizzle does not add this; you must (see `/new-rls-policy`).
   - FK `onDelete` mismatches.

4. **Apply to local Supabase**:

   ```bash
   pnpm db:push
   ```

   `db:push` is local-only — it applies the diff without writing a migration history. For production, use the Supabase CLI: `supabase db push` against the linked project (project id `JCE`, see `supabase/config.toml:5`).

5. **Verify against the database**:

   ```bash
   pnpm db:studio
   ```

## Verification

- The new file in `lib/db/migrations/` matches your expected changes.
- `pnpm db:studio` shows the new schema.
- `pnpm lint` passes.
