"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

// OmegaMark — the Ω (ohms) ring as an inline stroked SVG. Brand motif: used as a
// faint watermark behind section heads, a CTA accent, and a loader. Colour comes
// from `currentColor` (set text-* where used). Optional subtle breathing pulse
// via anime.js (client-only, dynamically imported); frozen to a static mark under
// prefers-reduced-motion. Decorative — aria-hidden.

export function OmegaMark({
  className,
  pulse = false,
  strokeWidth = 6,
}: {
  className?: string;
  pulse?: boolean;
  strokeWidth?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pulse || reduce) return;
    let cancelled = false;
    let stop: (() => void) | undefined;
    void import("animejs").then(({ animate }) => {
      const el = ref.current;
      if (cancelled || !el) return;
      const a = animate(el, {
        opacity: [0.55, 1],
        scale: [1, 1.05],
        ease: "inOutSine",
        duration: 2400,
        loop: true,
        alternate: true,
      });
      stop = () => a.pause();
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [pulse, reduce]);

  return (
    <svg
      viewBox="0 0 100 96"
      className={cn(className)}
      fill="none"
      aria-hidden
      role="presentation"
    >
      <path
        ref={ref}
        d="M30 80 C6 68 6 26 50 14 C94 26 94 68 70 80 M30 80 H17 M70 80 H83"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
}
