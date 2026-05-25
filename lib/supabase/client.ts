import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/env";

export function createClient() {
  // Non-null asserted: callers must verify Supabase is configured before invoking.
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
