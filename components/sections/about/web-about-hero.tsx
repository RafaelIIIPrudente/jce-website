import Image from "next/image";

import { CurrentTrace } from "@/components/sections/kit/web-current-trace";
import { OmegaMark } from "@/components/sections/kit/web-omega-mark";
import { HeroParallax } from "@/components/sections/kit/web-hero-parallax";

// S2 About hero — the electrified dark idiom at inner-page scale (mirrors
// HomeHero). Optionally backed by a darkened photo (company identity, e.g. the
// HQ). When set, the photo is the LCP image (next/image fill + priority over a
// height-reserved section → no CLS); a dark gradient + the circuit field keep the
// headline AA-legible on top. The decorative Ω watermark + rising CurrentTrace
// drift a few percent on scroll (HeroParallax) for subtle Lenis depth — NEVER the
// LCP photo or the heading. Carries the page's single <h1>. Reduced motion freezes
// every layer (parallax + trace) to a static render.

export function AboutHero({
  imageSrc,
  imageAlt = "",
  priority = false,
}: {
  /** Optional darkened hero photo (company identity). Omit → brand-led only. */
  imageSrc?: string;
  imageAlt?: string;
  /** Mark the photo as the LCP priority image (one per page). */
  priority?: boolean;
}) {
  return (
    <section
      data-nav-overlay
      className="dark-section circuit-field relative isolate overflow-hidden"
    >
      {imageSrc ? (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="100vw"
            className="-z-10 object-cover opacity-30"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-linear-to-t from-jce-dark via-jce-dark/85 to-jce-dark/80"
          />
        </>
      ) : null}

      {/* Decorative layers drift subtly as the hero scrolls away (parallax wraps
          ONLY these — never the LCP photo / heading). Static under reduced motion. */}
      <HeroParallax className="absolute inset-0 -z-10" distance="9%">
        <OmegaMark className="pointer-events-none absolute top-1/2 -right-12 size-[clamp(220px,42vw,440px)] -translate-y-1/2 text-jce-cyan/10" />
        <CurrentTrace
          d="M30 360 H240 a16 16 0 0 0 16 -16 V210 H520 a16 16 0 0 1 16 -16 V96 H1170"
          viewBox="0 0 1200 400"
          duration={2000}
          strokeWidth={2.5}
          className="h-full w-full opacity-60"
        />
      </HeroParallax>

      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:py-28 md:py-32">
        <p className="kicker text-jce-cyan-bright">Who we are</p>
        <h1 className="mt-4 max-w-[18ch] text-[clamp(30px,6vw,60px)] leading-[1.04] font-bold tracking-[-0.02em] text-balance text-jce-dark-ink">
          Built on power,{" "}
          <span className="text-jce-cyan-bright">driven by precision.</span>
        </h1>
        <p className="mt-5 max-w-[60ch] text-ui-16 text-pretty text-jce-dark-ink-2 sm:text-ui-18">
          JC Electrofields Power System, Inc. is a Filipino power-engineering
          firm delivering substations, transmission lines and renewable-energy
          projects nationwide.
        </p>
      </div>
    </section>
  );
}
