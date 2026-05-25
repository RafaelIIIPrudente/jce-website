import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/env";
import { updateSession } from "@/lib/supabase/middleware";

// URL prefixes that live under app/(app)/ and require an authenticated user.
// Add new entries here when you create a new protected route segment.
const PROTECTED_PREFIXES = ["/dashboard", "/settings"];

export async function proxy(request: NextRequest) {
  // Skip auth gating when Supabase isn't configured (fresh clone, marketing-only).
  // Once env is populated, the full session-refresh + protected-route logic runs.
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  const { supabaseResponse, user } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (build assets)
     * - _next/image (image optimization)
     * - favicon.ico
     * - common image extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
