import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Supabase is optional during local dev / early marketing-only operation.
    // proxy.ts skips auth gating when these are unset; lib/supabase/* and
    // lib/db/client.ts assert non-null at their call sites.
    DATABASE_URL: z.string().url().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

    RESEND_API_KEY: z.string().min(1).optional(),

    STRIPE_SECRET_KEY: z.string().min(1).optional(),
    STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),

    SENTRY_AUTH_TOKEN: z.string().min(1).optional(),
    SENTRY_ORG: z.string().min(1).optional(),
    SENTRY_PROJECT: z.string().min(1).optional(),

    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

    INNGEST_EVENT_KEY: z.string().min(1).optional(),
    INNGEST_SIGNING_KEY: z.string().min(1).optional(),

    ANTHROPIC_API_KEY: z.string().min(1).optional(),
    OPENAI_API_KEY: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),

    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),

    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

    RESEND_API_KEY: process.env.RESEND_API_KEY,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,

    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,

    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,

    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,

    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,

    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
