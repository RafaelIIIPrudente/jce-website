"use client";

import { useEffect, useId, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

// CurrentTrace — an SVG path that "draws" itself (stroke dash via anime.js
// svg.createDrawable) when scrolled into view, with a cyan glow dot travelling
// the path (svg.createMotionPath). anime.js is dynamically imported (client-only,
// code-split) and triggered once by an IntersectionObserver. Under
// prefers-reduced-motion it renders fully-drawn and still, no dot. Decorative —
// aria-hidden. Stroke uses the cyan→green current-trace gradient (token-driven).

export function CurrentTrace({
  d,
  viewBox = "0 0 1200 300",
  dot = true,
  duration = 1800,
  strokeWidth = 2,
  className,
}: {
  /** Path data drawn by the trace. */
  d: string;
  viewBox?: string;
  /** Render a travelling glow dot along the path (skipped when reduced-motion). */
  dot?: boolean;
  duration?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const gradId = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const showDot = dot && !reduce;

  useEffect(() => {
    if (reduce) return; // static, fully-drawn render
    const svgEl = svgRef.current;
    if (!svgEl) return;
    let cancelled = false;
    const stops: Array<() => void> = [];

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;
        io.disconnect();
        void import("animejs").then(({ animate, svg }) => {
          if (cancelled || !pathRef.current) return;
          const draw = animate(svg.createDrawable(pathRef.current), {
            draw: ["0 0", "0 1"],
            ease: "inOutQuad",
            duration,
          });
          stops.push(() => draw.pause());
          if (dot && dotRef.current) {
            const mp = svg.createMotionPath(pathRef.current);
            const travel = animate(dotRef.current, {
              translateX: mp.translateX,
              translateY: mp.translateY,
              opacity: { to: 1, duration: 320 },
              ease: "inOutQuad",
              duration,
              loop: true,
              loopDelay: 1400,
            });
            stops.push(() => travel.pause());
          }
        });
      },
      { threshold: 0.25 },
    );
    io.observe(svgEl);

    return () => {
      cancelled = true;
      io.disconnect();
      stops.forEach((s) => s());
    };
  }, [reduce, d, dot, duration]);

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      fill="none"
      aria-hidden
      role="presentation"
      preserveAspectRatio="xMidYMid meet"
      className={cn(className)}
    >
      <defs>
        <linearGradient id={`trace-${gradId}`} x1="0" y1="0" x2="1" y2="0">
          <stop
            offset="0%"
            style={{ stopColor: "var(--current-trace-from)" }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "var(--current-trace-to)" }}
          />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d={d}
        stroke={`url(#trace-${gradId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showDot ? (
        <circle
          ref={dotRef}
          cx="0"
          cy="0"
          r="4.5"
          className="fill-jce-cyan"
          style={{ opacity: 0, filter: "drop-shadow(0 0 6px var(--jce-cyan))" }}
        />
      ) : null}
    </svg>
  );
}
