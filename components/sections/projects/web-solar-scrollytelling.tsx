"use client";

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

// Solar-farm scroll-storytelling — a pinned (sticky) dark section whose scroll
// progress drives two scroll-linked effects, matching the electrified idiom of
// the category hero:
//   (a) a CurrentTrace-style SVG that DRAWS as you scroll (motion `pathLength`
//       bound to the section's scrollYProgress — the scroll-driven counterpart
//       of web-current-trace's one-shot anime.js draw), and
//   (b) the portfolio stat counters (web-energized-counter) energizing in,
//       staggered across the scroll.
//
// REDUCED MOTION: no pin, no sticky, no scroll binding — a normal stacked
// section with the trace rendered fully drawn and every stat visible. Nothing
// is hidden or gated behind scrolling.

export type SolarStat = {
  value: number;
  suffix?: string;
  /** false for years/ids that shouldn't get thousands separators. */
  grouping?: boolean;
  label: string;
  sub: string;
};

const TRACE_VIEWBOX = "0 0 1200 140";
const TRACE_D =
  "M20 116 H300 a14 14 0 0 0 14 -14 V64 H620 a14 14 0 0 1 14 -14 V28 H1180";

type StoryProps = {
  eyebrow: string;
  heading: string;
  intro: string;
  stats: readonly SolarStat[];
};

export function WebSolarScrollytelling(props: StoryProps) {
  const reduce = useReducedMotion();
  if (reduce) return <SolarStoryStatic {...props} />;
  return <SolarStoryPinned {...props} />;
}

// ── Motion / pinned variant ────────────────────────────────────────────────
function SolarStoryPinned({ eyebrow, heading, intro, stats }: StoryProps) {
  const gradId = useId().replace(/:/g, "");
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  // Smooth the raw progress so the trace + reveals ease rather than track every
  // wheel tick 1:1.
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  // Trace finishes drawing by ~85% of the scroll, leaving a settle at the end.
  const pathLength = useTransform(progress, [0, 0.85], [0, 1]);

  return (
    <section className="dark-section circuit-field relative isolate">
      {/* Tall track gives the sticky panel its scroll distance. */}
      <div ref={trackRef} className="relative h-[240vh]">
        <div className="sticky top-0 flex min-h-svh items-center overflow-hidden">
          <div className="mx-auto w-full max-w-6xl px-5 py-20">
            <StoryHeading eyebrow={eyebrow} heading={heading} intro={intro} />

            {/* Trace band — draws left→right with scroll. */}
            <div className="relative mt-8 h-24 sm:mt-10 sm:h-32">
              <svg
                viewBox={TRACE_VIEWBOX}
                fill="none"
                aria-hidden
                role="presentation"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full opacity-80"
              >
                <defs>
                  <linearGradient
                    id={`solar-trace-${gradId}`}
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
                  stroke={`url(#solar-trace-${gradId})`}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pathLength }}
                />
              </svg>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((s, i) => (
                <ScrollStat
                  key={s.label}
                  stat={s}
                  index={i}
                  total={stats.length}
                  progress={progress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScrollStat({
  stat,
  index,
  total,
  progress,
}: {
  stat: SolarStat;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Stagger each card's reveal across the middle of the scroll.
  const slot = total > 0 ? 0.6 / total : 0.6;
  const start = 0.12 + index * slot;
  const end = start + Math.min(slot, 0.18);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [28, 0]);

  return (
    <motion.div style={{ opacity, y }} className={CARD_CLASS}>
      <StatBody stat={stat} />
    </motion.div>
  );
}

// ── Reduced-motion / static variant ─────────────────────────────────────────
function SolarStoryStatic({ eyebrow, heading, intro, stats }: StoryProps) {
  const gradId = useId().replace(/:/g, "");
  return (
    <section className="dark-section circuit-field relative isolate overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:py-24">
        <StoryHeading eyebrow={eyebrow} heading={heading} intro={intro} />

        <div className="relative mt-8 h-24 sm:mt-10 sm:h-32">
          <svg
            viewBox={TRACE_VIEWBOX}
            fill="none"
            aria-hidden
            role="presentation"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full opacity-80"
          >
            <defs>
              <linearGradient
                id={`solar-trace-${gradId}`}
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
              stroke={`url(#solar-trace-${gradId})`}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className={CARD_CLASS}>
              <StatBody stat={s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Shared leaves ────────────────────────────────────────────────────────────
const CARD_CLASS =
  "rounded-(--r-glass) border border-jce-dark-line bg-jce-dark-2/70 p-5 text-left backdrop-blur-sm";

function StoryHeading({
  eyebrow,
  heading,
  intro,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
}) {
  return (
    <div className="max-w-[56ch]">
      <p className="kicker text-jce-cyan-bright">{eyebrow}</p>
      <h2 className="mt-3 text-[clamp(24px,4vw,40px)] leading-[1.08] font-bold tracking-[-0.02em] text-balance text-jce-dark-ink">
        {heading}
      </h2>
      <p className="mt-4 text-ui-16 text-pretty text-jce-dark-ink-2">{intro}</p>
    </div>
  );
}

function StatBody({ stat }: { stat: SolarStat }) {
  return (
    <>
      <div className="text-[clamp(30px,7vw,52px)] leading-none font-bold tracking-tight tabular-nums text-jce-dark-ink">
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
