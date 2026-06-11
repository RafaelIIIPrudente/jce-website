import { CircuitReveal } from "@/components/sections/kit/web-circuit-reveal";
import { CapabilityOrbit } from "@/components/sections/home/web-home-capability-orbit";
import { HOME_CAPABILITY_CORE } from "@/lib/content/website";

// S1 "What we do" — the home page's single interactive showpiece. A Server
// Component shell (dark electrified section + heading) wrapping the one
// 'use client' leaf, CapabilityOrbit (the Ω energy core + orbiting capabilities,
// with a static readable grid fallback). Copy/data live in lib/content/website.ts.
// Replaces the former PhotoCard capability grid (quarantined under legacy/).

export function HomeCapabilities() {
  const { eyebrow, heading, intro } = HOME_CAPABILITY_CORE;
  return (
    <section className="dark-section circuit-field relative isolate overflow-hidden px-5 py-20 sm:py-24 md:py-28">
      <div className="mx-auto w-full max-w-site">
        <CircuitReveal
          lineClassName="text-jce-cyan"
          className="mb-10 max-w-[46ch] md:mb-12"
        >
          <p className="kicker text-jce-cyan-bright">{eyebrow}</p>
          <h2 className="mt-2 text-heading-section font-bold tracking-[-0.02em] text-balance text-jce-dark-ink">
            {heading}
          </h2>
          <p className="mt-3 text-ui-16 text-pretty text-jce-dark-ink-2">
            {intro}
          </p>
        </CircuitReveal>

        <CapabilityOrbit />
      </div>
    </section>
  );
}
