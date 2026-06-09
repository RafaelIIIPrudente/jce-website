"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

// ScrollProgress — a fixed top hairline that fills left→right as the page
// scrolls, themed as a travelling "current trace" in the electrified orange
// accent (--jce-cyan is the orange accent token) with a soft current glow.
// Reads motion's useScroll().scrollYProgress (which tracks the Lenis-smoothed
// real scroll position) through a spring so the bar eases rather than snaps.
//
// Decorative → aria-hidden. position:fixed keeps it out of flow, so it never
// shifts layout (CLS-safe) whether present or absent. Sits at z-30: above page
// content, below the z-40 sticky header and its portalled dropdowns.
//
// REDUCED MOTION: render nothing — no bar, and (being fixed) no reserved gap.
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-30 h-0.5 origin-left bg-jce-cyan shadow-(--current-glow)"
    />
  );
}
