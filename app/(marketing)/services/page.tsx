import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { WebSection } from "@/components/sections/kit/web-section";
import { Reveal } from "@/components/sections/kit/web-reveal";
import { OmegaMark } from "@/components/sections/kit/web-omega-mark";
import { MagneticButton } from "@/components/sections/kit/web-magnetic-button";
import { ServicesHero } from "@/components/sections/services/web-services-hero";
import { WebServiceList } from "@/components/sections/services/web-service-list";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Turnkey EPC and specialized power services from distribution voltages up to 230 KV — substations, transmission lines, solar, switchgear, NGCP direct connection, maintenance and engineering consultancy.",
};

// S3 · Services (web-pages-a.jsx:191-223) — re-skinned into the "electrified"
// idiom: electrified dark hero, circuit-card service rows (amber icon tile +
// VoltageTag spec), and an Ω closing CTA. The former /professional-services scope
// is folded in as the Engineering Consultancy row (PROPOSED). Mobile-first; one
// <h1> (the hero). Content/IA/metadata unchanged.
export default function ServicesPage() {
  return (
    <>
      <ServicesHero />

      <WebSection>
        <WebServiceList />
      </WebSection>

      {/* Closing CTA — electrified Ω accent on the luminous backdrop */}
      <section className="jce-backdrop relative isolate overflow-hidden">
        <span className="jce-glow-3" aria-hidden />
        <OmegaMark
          pulse
          strokeWidth={4}
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[clamp(260px,40vw,440px)] -translate-x-1/2 -translate-y-1/2 text-jce-cyan/10"
        />
        <div className="relative mx-auto w-full max-w-3xl px-5 py-20 text-center sm:py-24 md:py-28">
          <Reveal>
            <p className="kicker text-jce-cyan-deep">Get in touch</p>
            <h2 className="mt-3 text-[clamp(26px,4vw,42px)] leading-[1.05] font-bold tracking-[-0.02em] text-balance text-jce-ink">
              Need a capability profile?
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-ui-16 text-pretty text-jce-ink-2 sm:text-ui-18">
              Tell us about your power requirement — we&rsquo;ll respond with an
              indicative scope inside one business day.
            </p>
            <div className="mt-7 flex justify-center">
              <MagneticButton className="w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  className="h-12 w-full px-7 sm:w-auto"
                >
                  <Link href="/contact-us">Enquire now</Link>
                </Button>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
