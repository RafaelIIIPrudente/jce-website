---
name: drizzle-patterns
description: Use when defining or editing tables in lib/db/schema.ts, writing Drizzle queries, or composing migrations. Covers pgTable composition, references with onDelete, composite primary keys, timestamp defaults, and the tenant_id pattern.
---

# Drizzle patterns

When this skill applies: any change to `lib/db/schema.ts`, any new Drizzle query in a server action or route handler, and any migration produced by `pnpm db:generate`.

Canonical examples live in `lib/db/schema.ts` (`profiles`, `tenants`, `tenant_members`). Match those before introducing new conventions.

## pgTable composition

Standard column ordering: id → FKs → payload → timestamps. Always `withTimezone: true` on timestamps.

```ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
```

## UUID primary keys

- `uuid("id").primaryKey().defaultRandom()` — table generates its own IDs (most app tables).
- `uuid("id").primaryKey()` — the ID comes from an external source. The `profiles` table uses this because `id` mirrors `auth.users.id` from Supabase Auth (`lib/db/schema.ts:11-21`).

## Foreign keys and onDelete

`onDelete` must be explicit. Use `"cascade"` when child rows should disappear with the parent (memberships, settings, content). Use `"set null"` only when the column is nullable and the relationship is informational.

```ts
tenantId: uuid("tenant_id")
  .notNull()
  .references(() => tenants.id, { onDelete: "cascade" }),
```

## Composite primary keys

Join tables — pass `primaryKey({ columns: [...] })` in the optional third pgTable argument:

```ts
export const tenantMembers = pgTable(
  "tenant_members",
  {
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["owner", "admin", "member"] })
      .notNull()
      .default("member"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.tenantId, table.userId] })],
);
```

The composite PK doubles as the uniqueness constraint — never add a separate `unique()` for the same column pair.

## tenant_id pattern

Every multi-tenant table joins to `tenants` via `tenant_id` (uuid, NOT NULL, FK with `onDelete: "cascade"`). RLS policies on the table check membership through `tenant_members` — see [`supabase-patterns`](../supabase-patterns/SKILL.md) and `/new-rls-policy` for the SQL.

## Querying

Import the shared `db` from `@/lib/db/client` (`lib/db/client.ts:14`). The file declares `import "server-only"` — do not import it into a Client Component (rule 5 applies to anything backed by the service-role driver).

```ts
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { tenants } from "@/lib/db/schema";

const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
```

## Common mistakes

- Omitting `withTimezone: true` — causes timezone drift between Postgres and Vercel.
- Using `bigint` for IDs that join to a Supabase auth user (auth IDs are UUIDs).
- Skipping `onDelete` — RLS depends on consistent cascade behavior (rule 4).
- Inserting before RLS is enabled (rule 4) — see `/new-rls-policy`.

## References

- `lib/db/schema.ts` — canonical examples.
- `lib/db/client.ts:14` — shared `db` export.
- `drizzle.config.ts:5-15` — Drizzle Kit config.
- BASEPLATE.md § 3 "ORM / type-safe DB queries", § 4 "Where business logic lives".
- AGENTS.md § Architectural rules — rules 3, 4, 5.
