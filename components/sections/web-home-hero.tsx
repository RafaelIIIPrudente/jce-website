import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/sections/web-magnetic-button";
import { CurrentTrace } from "@/components/sections/web-current-trace";
import { EnergizedCounter } from "@/components/sections/web-energized-counter";
import { HERO_STATS, TAGLINE } from "@/lib/content/website";

// S1 home hero — the dark, full-bleed showpiece. A darkened Alaminos solar-farm
// poster (LCP: next/image priority + fill over a height-reserved container → no
// CLS) sits under an ambient circuit field and a CurrentTrace that rises
// solar → transformer → grid toward the headline. The verbatim tagline is the
// sub; an EnergizedCounter stat strip settles once on view. Heavy motion is the
// client leaves (trace + counters); under reduced-motion they render static.

export function HomeHero() {
  return (
    <section className="dark-section circuit-field relative isolate flex min-h-[calc(100svh_-_4rem)] items-center overflow-hidden">
      {/* Darkened poster — priority LCP image; container reserves height (no CLS) */}
      <Image
        src="/projects/solar-alaminos.webp"
        alt="Aerial view of the 120 MWp GigaSol Alaminos solar farm built by JC Electrofields"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-35"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-jce-dark via-jce-dark/65 to-jce-dark/85"
      />

      {/* Rising current-trace — decorative, draws on view */}
      <CurrentTrace
        d="M30 540 H300 a18 18 0 0 0 18 -18 V370 H560 a18 18 0 0 1 18 -18 V215 H900 a18 18 0 0 0 18 -18 V95 H1170"
        viewBox="0 0 1200 600"
        duration={2200}
        strokeWidth={2.5}
        className="absolute inset-0 -z-10 h-full w-full opacity-70"
      />

      <div className="mx-auto w-full max-w-6xl px-5 py-20 text-center sm:py-24">
        <p className="kicker text-jce-cyan-bright">
          JC Electrofields Power System, Inc.
        </p>
        <h1 className="mx-auto mt-4 max-w-[20ch] text-[clamp(32px,6vw,68px)] leading-[1.03] font-bold tracking-[-0.02em] text-balance text-jce-dark-ink">
          Power infrastructure,
          <br />
          <span className="text-jce-cyan-bright">engineered to energize.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[60ch] text-ui-16 text-balance text-jce-dark-ink-2 sm:text-ui-18">
          {TAGLINE}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <MagneticButton>
            <Button asChild size="lg" className="h-12 px-6 text-ui-14">
              <Link href="/contact-us">Request a consultation</Link>
            </Button>
          </MagneticButton>
          <Link
            href="/projects"
            className="focus-ring-jce inline-flex h-12 items-center rounded-(--r-input) border border-jce-dark-line bg-white/5 px-6 text-ui-14 font-semibold text-jce-dark-ink backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            View projects
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-16 lg:grid-cols-5">
          {HERO_STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-(--r-glass) border border-jce-dark-line bg-white/5 p-4 text-left backdrop-blur-sm"
            >
              <div className="text-[clamp(22px,4vw,32px)] leading-none font-bold tracking-tight text-jce-dark-ink">
                <EnergizedCounter
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  grouping={s.grouping ?? true}
                />
              </div>
              <div className="mt-2 text-ui-12 text-jce-dark-ink-2">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
