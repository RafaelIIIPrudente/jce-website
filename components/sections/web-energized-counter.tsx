"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

// EnergizedCounter — counts a numeric stat up ONCE when scrolled into view
// (anime.js, dynamically imported), with an "outExpo" voltmeter-settle ease.
// SSR renders the final value (SEO + reserves the widest box → zero CLS); a
// pre-paint layout effect resets to the start so there's no final→0 flash, then
// the IntersectionObserver fires the count exactly once. Under reduced-motion the
// final value simply stays. tabular-nums keeps digits from reflowing siblings.

// useLayoutEffect on the server warns; fall back to useEffect there.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function EnergizedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  grouping = true,
  duration = 1700,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Thousands separators — set false for years (1997, not 1,997). */
  grouping?: boolean;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  const format = (n: number) => {
    const v = decimals > 0 ? Number(n.toFixed(decimals)) : Math.round(n);
    const body = grouping
      ? v.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : v.toFixed(decimals);
    return `${prefix}${body}${suffix}`;
  };

  // Reset to the start value before the browser paints (only when we'll animate).
  useIsomorphicLayoutEffect(() => {
    if (reduce || !ref.current) return;
    ref.current.textContent = format(0);
  }, [reduce]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = format(value);
      return;
    }
    let cancelled = false;
    let stop: (() => void) | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        void import("animejs").then(({ animate }) => {
          if (cancelled || !ref.current) return;
          const proxy = { n: 0 };
          const a = animate(proxy, {
            n: value,
            duration,
            ease: "outExpo",
            onUpdate: () => {
              if (ref.current) ref.current.textContent = format(proxy.n);
            },
          });
          stop = () => a.pause();
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      stop?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduce, prefix, suffix, decimals, grouping, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(value)}
    </span>
  );
}
