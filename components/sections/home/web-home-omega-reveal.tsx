"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// HomeOmegaReveal — a NON-BLOCKING brand sting painted OVER the already-rendered
// photo hero. The muted Ω/JCE clip autoplays once, then fades to reveal the
// hero. It is NEVER the LCP element and never delays the photo paint: the hero
// <Image priority> is server-rendered; this overlay is client-only and mounts
// after hydration (show starts false), so the photo paints/records LCP first.
//
// Gated OFF (renders nothing) under any of: prefers-reduced-motion · Save-Data ·
// already played this session (sessionStorage) · autoplay rejected by the
// browser. Dismisses on: video end · Skip · first scroll · Escape · a hard
// timeout — so it can never get stuck. Decorative video is aria-hidden; the Skip
// button carries the label.

const SEEN_KEY = "jce-omega-reveal-seen";
const MAX_MS = 6500;

export function HomeOmegaReveal() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Decide after mount so the priority hero photo stays the LCP element.
  useEffect(() => {
    if (reduce) return;
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
    };
    if (nav.connection?.saveData) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      return; // storage blocked (e.g. private mode) → skip the reveal
    }
    // Defer one frame so the priority hero photo paints (and records LCP) before
    // the overlay ever mounts — and so this isn't a synchronous setState-in-effect.
    const raf = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  // While shown: mark seen, wire the dismiss paths, and attempt autoplay (revert
  // immediately if the browser blocks it).
  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }

    const dismiss = () => setShow(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    const timer = window.setTimeout(dismiss, MAX_MS);
    window.addEventListener("scroll", dismiss, { passive: true, once: true });
    window.addEventListener("keydown", onKey);

    const v = videoRef.current;
    const playing = v?.play?.();
    if (playing && typeof playing.catch === "function") {
      playing.catch(() => dismiss());
    }

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("keydown", onKey);
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="omega-reveal"
          onClick={() => setShow(false)}
          className="absolute inset-0 z-20 grid place-items-center overflow-hidden bg-jce-dark"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted
            playsInline
            autoPlay
            preload="auto"
            poster="/home/jce-omega-reveal-poster.jpg"
            aria-hidden
            onEnded={() => setShow(false)}
            onError={() => setShow(false)}
          >
            <source src="/home/jce-omega-reveal-muted.mp4" type="video/mp4" />
          </video>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="focus-ring-cyan absolute right-4 bottom-4 inline-flex min-h-11 items-center gap-1.5 rounded-(--r-pill) border border-jce-dark-line bg-jce-dark/60 px-4 text-ui-13 font-semibold text-jce-dark-ink backdrop-blur-sm transition-colors hover:bg-jce-dark/80 sm:right-6 sm:bottom-6"
          >
            Skip intro
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
