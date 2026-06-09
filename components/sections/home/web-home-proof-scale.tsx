"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { EnergizedCounter } from "@/components/sections/kit/web-energized-counter";
import {
  HOME_PROOF,
  type ProofImage as ProofImageData,
  type ProofStat,
} from "@/lib/content/website";

// Home "Proof at scale" — the pinned scrollytelling centerpiece. Photography-led
// and editorially composed at EVERY scroll position (not just mid-scroll): the
// heading is pinned to the top (clear of the sticky header), the stat row is
// pinned to the bottom, and the four corporate aerials fill the frame and
// crossfade as you scroll. The visible "animations" are the photo scrub, the
// EnergizedCounter count-up, and a current-trace that draws above the stats.
//
// LEGIBILITY: a light overall tint + a top-and-bottom gradient keeps the heading
// and stats AA-legible while leaving the middle of each photo clearly visible.
//
// REDUCED MOTION: no pin, no sticky, no scroll binding — a normal stacked
// section with all four aerials in a grid, the trace fully drawn, and every stat
// at its final value. Nothing is hidden or gated behind scrolling.

const TRACE_VIEWBOX = "0 0 1200 120";
const TRACE_D =
  "M16 100 H300 a14 14 0 0 0 14 -14 V52 H620 a14 14 0 0 1 14 -14 V22 H1184";

const CARD_CLASS =
  "rounded-(--r-glass) border border-jce-dark-line bg-jce-dark-2/70 p-4 text-left backdrop-blur-sm sm:p-5";

export function HomeProofScale() {
  const reduce = useReducedMotion();
  if (reduce) return <ProofStatic />;
  return <ProofPinned />;
}

// ── Motion / pinned variant ──────────────────────────────────────────────────
function ProofPinned() {
  const gradId = useId().replace(/:/g, "");
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  // Smooth the raw progress so the scrub + trace ease rather than tracking every
  // wheel tick 1:1.
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  // Trace draws in just after the section pins and completes by ~80%.
  const pathLength = useTransform(progress, [0.05, 0.8], [0, 1]);

  const images = HOME_PROOF.images;

  return (
    <section className="dark-section relative isolate">
      {/* Tall track gives the sticky panel its scroll distance. */}
      <div ref={trackRef} className="relative h-[240vh]">
        <div className="sticky top-0 isolate flex min-h-svh flex-col justify-between overflow-hidden">
          {/* Full-bleed crossfading aerials + legibility gradient. */}
          <div className="absolute inset-0" aria-hidden>
            {images.map((image, i) => (
              <ProofImage
                key={image.img}
                image={image}
                index={i}
                total={images.length}
                progress={progress}
              />
            ))}
            <div className="absolute inset-0 bg-jce-dark/25" />
            <div className="absolute inset-0 bg-linear-to-b from-jce-dark/75 via-transparent to-jce-dark/85" />
          </div>

          {/* Heading — pinned to the top, clear of the floating header. */}
          <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-24 sm:pt-28">
            <ProofHeading />
          </div>

          {/* Trace + stats — pinned to the bottom. */}
          <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-12 sm:pb-16">
            <div className="relative mb-5 h-12 sm:h-14">
              <svg
                viewBox={TRACE_VIEWBOX}
                fill="none"
                aria-hidden
                role="presentation"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full opacity-90"
              >
                <defs>
                  <linearGradient
                    id={`proof-trace-${gradId}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
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
                <motion.path
                  d={TRACE_D}
                  stroke={`url(#proof-trace-${gradId})`}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pathLength }}
                />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {HOME_PROOF.stats.map((s) => (
                <div key={s.label} className={CARD_CLASS}>
                  <StatBody stat={s} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// One crossfading aerial. A child so the useTransform hook is never called in a
// loop. Image 0 holds full opacity at the start, then each image fades in over
// its own window (later images paint on top, so the scrub never shows a blank
// frame).
function ProofImage({
  image,
  index,
  total,
  progress,
}: {
  image: ProofImageData;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const span = total > 1 ? 1 / (total - 1) : 1;
  const center = index * span;
  const start = index === 0 ? 0 : Math.max(0, center - span);
  const end = index === total - 1 ? 1 : center;
  const opacity = useTransform(
    progress,
    index === 0 ? [0, span] : [start, end],
    index === 0 ? [1, 0] : [0, 1],
  );

  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <Image
        src={image.img}
        alt={image.alt}
        fill
        sizes="100vw"
        priority={false}
        className="object-cover"
      />
    </motion.div>
  );
}

// ── Reduced-motion / static variant ──────────────────────────────────────────
function ProofStatic() {
  const gradId = useId().replace(/:/g, "");
  return (
    <section className="dark-section circuit-field relative isolate overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:py-24">
        <ProofHeading />

        <div className="relative mt-8 h-12 sm:h-14">
          <svg
            viewBox={TRACE_VIEWBOX}
            fill="none"
            aria-hidden
            role="presentation"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full opacity-90"
          >
            <defs>
              <linearGradient
                id={`proof-trace-${gradId}`}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
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
            {/* Fully drawn — no pathLength gating. */}
            <path
              d={TRACE_D}
              stroke={`url(#proof-trace-${gradId})`}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* All four aerials as a real grid — nothing hidden behind scroll. */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {HOME_PROOF.images.map((image) => (
            <div
              key={image.img}
              className="relative aspect-16/10 overflow-hidden rounded-(--r-glass) border border-jce-dark-line"
            >
              <Image
                src={image.img}
                alt={image.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                priority={false}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {HOME_PROOF.stats.map((s) => (
            <div key={s.label} className={CARD_CLASS}>
              <StatBody stat={s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Shared leaves ─────────────────────────────────────────────────────────────
function ProofHeading() {
  return (
    <div className="max-w-[56ch]">
      <p className="kicker text-jce-cyan-bright">{HOME_PROOF.eyebrow}</p>
      <h2 className="mt-3 text-[clamp(24px,4vw,40px)] leading-[1.08] font-bold tracking-[-0.02em] text-balance text-jce-dark-ink">
        {HOME_PROOF.heading}
      </h2>
      <p className="mt-4 text-ui-16 text-pretty text-jce-dark-ink-2">
        {HOME_PROOF.intro}
      </p>
    </div>
  );
}

function StatBody({ stat }: { stat: ProofStat }) {
  return (
    <>
      <div className="text-[clamp(26px,5vw,44px)] leading-none font-bold tracking-tight tabular-nums text-jce-dark-ink">
        <EnergizedCounter
          value={stat.value}
          suffix={stat.suffix ?? ""}
          grouping={stat.grouping ?? true}
        />
      </div>
      <div className="mt-2 text-ui-14 font-semibold text-jce-cyan-bright">
        {stat.label}
      </div>
      <div className="mt-1 text-ui-12 text-pretty text-jce-dark-ink-2">
        {stat.sub}
      </div>
    </>
  );
}
