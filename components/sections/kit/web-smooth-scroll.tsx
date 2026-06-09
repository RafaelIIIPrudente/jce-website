"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame, useReducedMotion } from "motion/react";
import "lenis/dist/lenis.css";

// SmoothScroll — wraps the marketing page tree in a global Lenis instance so
// desktop wheel/trackpad scrolling glides instead of stepping. Lenis writes the
// REAL window scroll position, so every existing scroll reader keeps working
// unchanged: IntersectionObserver reveals (web-reveal whileInView), anime.js
// view triggers, and motion's useScroll all just read the smoothed value.
//
// RAF is driven off motion's single frameloop (autoRaf:false) so Lenis and
// every motion animation share one tick — never two competing rAF loops.
//
// REDUCED MOTION (#1 correctness requirement): Lenis has no built-in
// prefers-reduced-motion handling, so we DON'T instantiate it at all — the page
// falls back to native scrolling. useLenis() then returns undefined for
// consumers, which they treat as "Lenis inactive" (see contact-form.tsx).
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}

function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  // Pump Lenis from motion's frameloop (keepAlive=true → runs every frame).
  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }
    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.1, // conservative — premium glide, not a slingshot
        smoothWheel: true,
        syncTouch: false, // leave mobile on native touch (iOS smooth-touch bugs)
        autoRaf: false, // we drive rAF via motion's frame() above
      }}
    >
      {children}
    </ReactLenis>
  );
}
