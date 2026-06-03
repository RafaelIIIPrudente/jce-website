import type { Metadata } from "next";
import { CheckIcon } from "lucide-react";

import { WebHero } from "@/components/sections/web-hero";
import { WebSection, SectionHead } from "@/components/sections/web-section";
import { WebCta } from "@/components/sections/web-cta";
import { Reveal } from "@/components/sections/web-reveal";
import { ABOUT, STATS } from "@/lib/content/website";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "JC Electrofields Power System, Inc. — a Filipino power-engineering firm founded in 1997, building substations and transmission lines up to 230 KV nationwide. Exclusive Philippine distributor of Shenda Electric.",
};

// S2 · About (web-pages-a.jsx:145-185, extended per brief:1131): mission/vision/
// values, stats, history-since-1997, leadership, accreditations, canonical facts.
export default function AboutPage() {
  return (
    <>
      <WebHero
        eyebrow="Who we are"
        title="Built on power, driven by precision."
        sub="JC Electrofields Power System, Inc. is a Filipino power-engineering firm delivering substations, transmission lines and renewable-energy projects nationwide."
      />

      {/* Mission / Vision / Values */}
      <WebSection>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Reveal>
            <div className="solid h-full rounded-[var(--r-solid)] p-6">
              <div className="kicker text-jce-green-600">Mission</div>
              <p className="mt-2.5 text-ui-18 text-pretty text-jce-ink">
                {ABOUT.mission}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="solid h-full rounded-[var(--r-solid)] p-6">
              <div className="kicker text-jce-green-600">Vision</div>
              <p className="mt-2.5 text-ui-18 text-pretty text-jce-ink">
                {ABOUT.vision}
              </p>
            </div>
          </Reveal>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ABOUT.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}>
              <div className="glass h-full rounded-[var(--r-glass)] p-5">
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

      {/* Stat band */}
      <WebSection alt>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.k} delay={i * 0.05}>
              <div className="glass rounded-[var(--r-glass)] p-5">
                <div className="text-[clamp(24px,4vw,34px)] leading-none font-bold tracking-tight tabular-nums text-jce-ink">
                  {s.v}
                </div>
                <div className="mt-1.5 text-ui-12 text-jce-ink-2">{s.k}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </WebSection>

      {/* History + leadership */}
      <WebSection>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHead
              eyebrow="Since 1997"
              heading="From northern Luzon to the national grid."
            />
          </div>
          <div className="md:col-span-7">
            <Reveal>
              <p className="text-ui-16 text-pretty text-jce-ink-2">
                {ABOUT.history}
              </p>
              <p className="mt-4 text-ui-16 text-pretty text-jce-ink-2">
                {ABOUT.coverage}
              </p>
              <div className="mt-6 inline-flex items-center gap-3 rounded-[var(--r-solid)] border border-jce-line bg-card px-5 py-4">
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
        </div>
      </WebSection>

      {/* Accreditations */}
      <WebSection alt>
        <SectionHead
          eyebrow="Credentials"
          heading="Accreditations & memberships"
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {ABOUT.accreditations.map((a, i) => (
            <Reveal key={a.code} delay={i * 0.05}>
              <div className="solid h-full rounded-[var(--r-solid)] p-5">
                <div className="text-ui-22 font-bold tracking-tight text-jce-green-700">
                  {a.code}
                </div>
                <div className="mt-1.5 text-ui-12 text-jce-ink-2">{a.note}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </WebSection>

      {/* Canonical facts block (FR-WEB-16 — plain, extractable sentences for GEO) */}
      <WebSection>
        <SectionHead eyebrow="The facts" heading="JCE at a glance" />
        <Reveal>
          <ul className="solid flex flex-col gap-3 rounded-[var(--r-solid)] p-6">
            {ABOUT.canonicalFacts.map((fact) => (
              <li key={fact} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-jce-green-50 text-jce-green-700">
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

      <WebCta
        heading="Talk to the engineers behind the work."
        sub="Send a project brief — utility, developer, or industrial — and we'll respond inside one business day."
        ctaLabel="Start a project"
      />
    </>
  );
}
