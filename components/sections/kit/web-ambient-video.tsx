"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

// Ambient loop video — a muted, autoplaying, looping clip (e.g. the slow aerial
// orbit of the HQ). DECORATIVE: it states nothing the page doesn't also carry in
// text + an alt-bearing still, so the <video> is aria-hidden. Motion self-gates
// on prefers-reduced-motion: reduced → render only the static poster frame (the
// mandatory reduced-motion fallback, no autoplay). The poster <Image> is ALWAYS
// rendered (so it is the meaningful still under reduced motion and the base layer
// never element-swaps on hydration); the <video> only layers on top when motion
// is allowed. The aspect box reserves height → no CLS; muted + playsInline keeps
// mobile autoplay working.

export function AmbientVideo({
  src,
  poster,
  posterAlt,
  aspect = "aspect-video",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
}: {
  src: string;
  poster: string;
  /** Alt for the poster — it is the meaningful still under reduced motion. */
  posterAlt: string;
  /** Tailwind aspect utility, e.g. "aspect-video" | "aspect-[4/3]". */
  aspect?: string;
  sizes?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "circuit-card circuit-card-dark relative overflow-hidden rounded-(--r-glass) bg-jce-dark-2",
        aspect,
        className,
      )}
    >
      <Image
        src={poster}
        alt={posterAlt}
        fill
        sizes={sizes}
        className="object-cover"
      />
      {!reduce ? (
        <video
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </div>
  );
}
