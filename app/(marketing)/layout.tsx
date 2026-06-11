import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/sections/kit/web-smooth-scroll";
import { ScrollProgress } from "@/components/sections/kit/web-scroll-progress";

// Server Component. SmoothScroll is a client leaf that mounts a global Lenis
// instance; the header / main / footer tree (server components) passes through
// as children, so no RSC boundary regresses. ScrollProgress is a sibling
// decorative leaf. Both self-disable under prefers-reduced-motion.
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <ScrollProgress />
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </SmoothScroll>
  );
}
