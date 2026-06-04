import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WebSection } from "@/components/sections/web-section";
import { Reveal } from "@/components/sections/web-reveal";
import { CircuitReveal } from "@/components/sections/web-circuit-reveal";
import { PhotoCard } from "@/components/sections/web-photo-card";
import { VoltageTag } from "@/components/sections/web-voltage-tag";
import { ElectrifiedDivider } from "@/components/sections/web-electrified-divider";
import { OmegaMark } from "@/components/sections/web-omega-mark";
import { MagneticButton } from "@/components/sections/web-magnetic-button";
import { AboutHero } from "@/components/sections/web-about-hero";
import { AboutStatBand } from "@/components/sections/web-about-stat-band";
import { AboutVideos } from "@/components/sections/web-about-videos";
import { ABOUT } from "@/lib/content/website";
import { LICENSES } from "@/lib/content/accreditations";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "JC Electrofields Power System, Inc. — a Filipino power-engineering firm founded in 1997, building substations and transmission lines up to 230 KV nationwide. Exclusive Philippine distributor of Shenda Electric.",
};

// S2 · About (web-pages-a.jsx:145-185, extended per brief:1131) — re-skinned into
// the "electrified" idiom: electrified dark hero, circuit-card mission/vision/
// values, dark EnergizedCounter stat band, photo-backed history, voltage-tag
// accreditations, plain canonical facts, and an Ω closing CTA. Mobile-first
// throughout; one <h1> (the hero) and a sensible h2 order beneath it.
export default function AboutPage() {
  return (
    <>
      <AboutHero />

      {/* Mission / Vision / Values — circuit-card surfaces, cyan (orange) accent */}
      <WebSection>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Reveal>
            <div className="circuit-card solid h-full rounded-(--r-glass) p-6 sm:p-7">
              <p className="kicker text-jce-cyan-deep">Mission</p>
              <p className="mt-2.5 text-ui-18 text-pretty text-jce-ink">
                {ABOUT.mission}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="circuit-card solid h-full rounded-(--r-glass) p-6 sm:p-7">
              <p className="kicker text-jce-cyan-deep">Vision</p>
              <p className="mt-2.5 text-ui-18 text-pretty text-jce-ink">
                {ABOUT.vision}
              </p>
            </div>
          </Reveal>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ABOUT.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}>
              <div className="circuit-card solid h-full rounded-(--r-glass) p-5 sm:p-6">
                <div className="text-ui-16 font-semibold text-jce-green-900">
                  {v.title}
                </div>
                <p className="mt-1.5 text-ui-13 text-pretty text-jce-ink-2">
                  {v.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </WebSection>

      {/* Stat band — EnergizedCounters on a dark section (contrast, matches Home) */}
      <AboutStatBand />

      {/* History + leadership — editorial two-column with a photographed project */}
      <WebSection>
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <CircuitReveal lineClassName="text-jce-cyan">
              <p className="kicker text-jce-cyan-deep">Since 1997</p>
              <h2 className="mt-2 text-[clamp(24px,3.6vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-jce-ink">
                From northern Luzon to the national grid.
              </h2>
            </CircuitReveal>
            <Reveal delay={0.12}>
              <p className="mt-4 text-ui-16 text-pretty text-jce-ink-2">
                {ABOUT.history}
              </p>
              <p className="mt-4 text-ui-16 text-pretty text-jce-ink-2">
                {ABOUT.coverage}
              </p>
              <ElectrifiedDivider className="my-6" />
              <div className="circuit-card solid inline-flex items-center gap-3 rounded-(--r-glass) px-5 py-4">
                <OmegaMark className="size-7 shrink-0 text-jce-cyan-deep" />
                <div>
                  <div className="text-ui-12 text-jce-ink-2">
                    {ABOUT.leadership.role}
                  </div>
                  <div className="text-ui-16 font-semibold text-jce-ink">
                    {ABOUT.leadership.name}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <PhotoCard
              src="/projects/controlroom-cnp.webp"
              alt="JC Electrofields-built SCADA control room for the Cebu–Negros–Panay 230 kV grid backbone"
              aspect="aspect-[4/3]"
              sizes="(min-width: 768px) 48vw, 100vw"
            >
              <VoltageTag tone="dark" className="mb-2 self-start">
                230 kV
              </VoltageTag>
              <div className="text-ui-14 font-semibold text-jce-dark-ink">
                Cebu–Negros–Panay Grid Backbone
              </div>
              <div className="mt-1 text-ui-12 text-jce-dark-ink-2">
                Barotac Viejo, Iloilo
              </div>
            </PhotoCard>
          </Reveal>
        </div>
      </WebSection>

      {/* Watch — curated videos + a live, de-duped "latest from our channel" strip */}
      <AboutVideos />

      {/* Licenses & Accreditations — the full §9-SAFE list: issuer · acronym ·
          license number where verifiable · validity dates. Optional fields
          (DOE/ERC carry no number or dates; PhilGEPS/NGCP no number) render with
          no dangling separators. Stacked on mobile → 2-col from md; each row is a
          circuit-card with a VoltageTag for the acronym/number and the amber
          (cyan-deep) accent on the light surface. */}
      <WebSection alt>
        <CircuitReveal className="mb-8 max-w-[44ch] md:mb-10">
          <p className="kicker text-jce-cyan-deep">Credentials</p>
          <h2 className="mt-2 text-[clamp(24px,3.6vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-jce-ink">
            Licenses &amp; accreditations
          </h2>
        </CircuitReveal>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
          {LICENSES.map((lic, i) => {
            const validity = [
              lic.since && `Since ${lic.since}`,
              lic.validUntil && `Valid through ${lic.validUntil}`,
            ].filter(Boolean);
            return (
              <Reveal key={lic.acronym} delay={Math.min(i * 0.05, 0.2)}>
                <div className="circuit-card solid flex h-full flex-col gap-3 rounded-(--r-glass) p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <VoltageTag>{lic.acronym}</VoltageTag>
                    {lic.licenseNo ? (
                      <VoltageTag>No. {lic.licenseNo}</VoltageTag>
                    ) : null}
                  </div>
                  <div className="text-ui-16 font-semibold text-pretty text-jce-ink">
                    {lic.issuer}
                  </div>
                  {lic.detail ? (
                    <div className="text-ui-13 text-pretty text-jce-ink-2">
                      {lic.detail}
                    </div>
                  ) : null}
                  {validity.length ? (
                    <div className="mt-auto pt-1 text-ui-12 font-medium text-jce-cyan-deep">
                      {validity.join(" · ")}
                    </div>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <p className="mt-6 max-w-[60ch] text-ui-13 text-pretty text-jce-ink-2">
            Complete documentation available upon request for bidding and
            accreditation purposes.
          </p>
        </Reveal>
      </WebSection>

      {/* Canonical facts (FR-WEB-16 — plain, extractable sentences for GEO) */}
      <WebSection>
        <CircuitReveal className="mb-8 max-w-[44ch] md:mb-10">
          <p className="kicker text-jce-cyan-deep">The facts</p>
          <h2 className="mt-2 text-[clamp(24px,3.6vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-jce-ink">
            JCE at a glance
          </h2>
        </CircuitReveal>
        <Reveal>
          <ul className="circuit-card solid flex flex-col gap-3 rounded-(--r-glass) p-6 sm:p-7">
            {ABOUT.canonicalFacts.map((fact) => (
              <li key={fact} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-jce-cyan/15 text-jce-cyan-deep">
                  <CheckIcon
                    className="size-3.5"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </span>
                <span className="text-ui-14 text-pretty text-jce-ink">
                  {fact}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
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
              Talk to the engineers behind the work.
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-ui-16 text-pretty text-jce-ink-2 sm:text-ui-18">
              Send a project brief — utility, developer, or industrial — and
              we&rsquo;ll respond inside one business day.
            </p>
            <div className="mt-7 flex justify-center">
              <MagneticButton className="w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  className="h-12 w-full px-7 sm:w-auto"
                >
                  <Link href="/contact-us">Start a project</Link>
                </Button>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
