# /new-supabase-table

Add a new table to the Drizzle schema. Use when persisting a new entity.

## Steps

1. **Define the table** in `lib/db/schema.ts` following the existing `profiles` / `tenants` / `tenant_members` shape (`lib/db/schema.ts:11-52`):

   ```ts
   import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

   export const projects = pgTable("projects", {
     id: uuid("id").primaryKey().defaultRandom(),
     tenantId: uuid("tenant_id")
       .notNull()
       .references(() => tenants.id, { onDelete: "cascade" }),
     name: text("name").notNull(),
     createdAt: timestamp("created_at", { withTimezone: true })
       .notNull()
       .defaultNow(),
     updatedAt: timestamp("updated_at", { withTimezone: true })
       .notNull()
       .defaultNow(),
   });
   ```

2. **Multi-tenant?** Add a `tenantId` FK to `tenants.id` with `onDelete: "cascade"`. RLS policies will key off `auth.uid()` joining through `tenant_members` (rule 4).

3. **Composite primary keys** — for join tables, use `primaryKey({ columns: [...] })` in the third pgTable argument. Live example: `tenant_members` in `lib/db/schema.ts:35-52`.

4. **Generate the migration**:

   ```bash
   pnpm db:generate
   ```

   SQL lands in `lib/db/migrations/` (directory created on first run).

5. **Apply locally**:

   ```bash
   pnpm db:push
   ```

6. **Enable RLS before the first insert** (rule 4). Run `/new-rls-policy` to add the policy SQL.

## Verification

- `pnpm db:studio` — inspect the new table; confirm columns, defaults, and FK constraints.
- `pnpm lint` passes.
- The generated migration SQL includes the expected `CREATE TABLE` and FK constraints.

See [`drizzle-patterns`](../skills/drizzle-patterns/SKILL.md) for column conventions and the tenant pattern.
