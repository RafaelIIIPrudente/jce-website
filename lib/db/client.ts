import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env";
import * as schema from "./schema";

// Single shared pool. postgres-js handles connection pooling internally.
// For RLS-scoped queries, use a Supabase auth-aware client or pass the JWT
// via `set local "request.jwt.claims" = ...` per Supabase docs.
// Non-null asserted: importing this module requires DATABASE_URL to be set.
const client = postgres(env.DATABASE_URL!, { prepare: false });

export const db = drizzle(client, { schema });

export type Database = typeof db;
