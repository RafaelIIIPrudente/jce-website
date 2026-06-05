"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/sections/kit/web-reveal";
import { CurrentTrace } from "@/components/sections/kit/web-current-trace";

// CircuitReveal — a heading/section reveal that traces a short circuit line in
// (anime.js, via CurrentTrace) as the content energizes up (motion@12, via the
// existing Reveal). The trace and the content are SEPARATE elements, so no node
// is ever animated by both libraries. Both fall back to a static, premium render
// under prefers-reduced-motion. The leading line is decorative (aria-hidden).

export function CircuitReveal({
  children,
  delay = 0.12,
  className,
  lineClassName,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  lineClassName?: string;
}) {
  return (
    <div className={cn(className)}>
      <CurrentTrace
        d="M2 12 H78 a10 10 0 0 0 10 -10 V12 a10 10 0 0 1 10 10 H150"
        viewBox="0 0 160 24"
        dot={false}
        strokeWidth={2.5}
        duration={1100}
        className={cn("mb-4 h-2.5 w-40", lineClassName)}
      />
      <Reveal delay={delay}>{children}</Reveal>
    </div>
  );
}
