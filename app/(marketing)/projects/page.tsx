import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { WebSection } from "@/components/sections/web-section";
import { Reveal } from "@/components/sections/web-reveal";
import { CircuitReveal } from "@/components/sections/web-circuit-reveal";
import { OmegaMark } from "@/components/sections/web-omega-mark";
import { VoltageTag } from "@/components/sections/web-voltage-tag";
import { ProjectsHero } from "@/components/sections/web-projects-hero";
import { WebProjectGallery } from "@/components/sections/web-project-gallery";
import { WebProjectCategoryCta } from "@/components/sections/web-project-category-cta";
import {
  CATEGORY_HREF,
  CATEGORY_LABEL,
  PORTFOLIO_TOTALS,
} from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A selection of substations, transmission and distribution lines, and renewable plants delivered across the Philippines — filter by type, or browse detailed case studies by category.",
};

const CATEGORIES = ["solar", "distribution", "ngcp"] as const;

// S4 · Projects (web-pages-a.jsx:229-285) — electrified rebuild matching About /
// Services / Products: a dark circuit-field hero, a CircuitReveal-headed filterable
// gallery, a dark "by category" band linking the case-study sub-pages, and the
// Ω-backed closing CTA. Content / metadata / IA unchanged.
export default function ProjectsPage() {
  return (
    <>
      <ProjectsHero />

      <WebSection>
        <CircuitReveal
          lineClassName="text-jce-cyan"
          className="mb-8 max-w-[56ch] md:mb-10"
        >
          <p className="kicker text-jce-cyan-deep">Selected work</p>
          <h2 className="mt-2 text-[clamp(24px,3.6vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-jce-ink">
            Browse the portfolio
          </h2>
        </CircuitReveal>
        <WebProjectGallery filterable />
      </WebSection>

      {/* By category — dark electrified band linking the detailed case studies */}
      <section className="dark-section circuit-field relative isolate overflow-hidden px-5 py-16 sm:py-20 md:py-24">
        <OmegaMark className="pointer-events-none absolute -right-10 bottom-0 -z-10 size-[clamp(180px,32vw,360px)] text-jce-cyan/10" />
        <div className="mx-auto w-full max-w-6xl">
          <CircuitReveal
            lineClassName="text-jce-cyan"
            className="mb-8 max-w-[56ch] md:mb-10"
          >
            <p className="kicker text-jce-cyan-bright">By category</p>
            <h2 className="mt-2 text-[clamp(24px,3.6vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-jce-dark-ink">
              Explore detailed case studies
            </h2>
          </CircuitReveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {CATEGORIES.map((cat, i) => (
              <Reveal key={cat} delay={i * 0.06}>
                <Link
                  href={CATEGORY_HREF[cat]}
                  className="focus-ring-cyan circuit-card circuit-card-dark group/cat flex h-full flex-col rounded-(--r-glass) bg-white/5 p-6 transition-transform duration-300 ease-jce hover:-translate-y-0.5"
                >
                  <VoltageTag tone="dark" className="self-start">
                    {PORTFOLIO_TOTALS[cat].count} projects
                  </VoltageTag>
                  <span className="mt-3 text-ui-18 font-semibold text-jce-dark-ink">
                    {CATEGORY_LABEL[cat]}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-ui-13 text-jce-dark-ink-2 transition-colors group-hover/cat:text-jce-cyan-bright">
                    View case studies
                    <ArrowRightIcon
                      className="size-3.5 transition-transform duration-200 group-hover/cat:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WebProjectCategoryCta
        eyebrow="Get in touch"
        heading="A project for the national grid?"
        sub="From systems-impact studies through substation commissioning — send a brief and we'll respond inside one business day."
        ctaLabel="Start a project"
        ctaHref="/contact-us"
      />
    </>
  );
}
