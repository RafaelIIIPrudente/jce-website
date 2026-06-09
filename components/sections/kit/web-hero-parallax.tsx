"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

// HeroParallax — wraps a hero's DECORATIVE background layer (a current-trace, an
// Ω watermark, a glow) and drifts it a few percent on the Y axis as the hero
// scrolls out of view, for a subtle depth cue under the Lenis-smoothed scroll.
//
// Wrap ONLY decorative layers — never the LCP priority image or the heading
// text — so LCP and CLS stay untouched (at scroll start y is 0% → no shift).
// The wrapper fills its hero (it's the scroll target), so progress is measured
// hero-relative without threading a ref into the server hero component. Any
// inner CSS/anime.js animation on the child keeps running: the drift is on this
// wrapper, the child's own transform is on a separate element, so they compose.
//
// REDUCED MOTION: render the layer statically in an equivalent span — no
// transform, no scroll binding.
export function HeroParallax({
  children,
  className,
  /** Max Y drift as a % of the layer's own height. A few percent — keep subtle. */
  distance = "12%",
}: {
  children: ReactNode;
  className?: string;
  distance?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", distance]);

  if (reduce) {
    return (
      <div className={cn(className)} aria-hidden>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} aria-hidden style={{ y }} className={cn(className)}>
      {children}
    </motion.div>
  );
}
