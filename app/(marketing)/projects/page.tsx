import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { WebHero } from "@/components/sections/web-hero";
import { WebSection, SectionHead } from "@/components/sections/web-section";
import { WebProjectGallery } from "@/components/sections/web-project-gallery";
import { WebCta } from "@/components/sections/web-cta";
import { Reveal } from "@/components/sections/web-reveal";
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

// S4 · Projects (web-pages-a.jsx:229-285). Tag-filterable gallery + links to the
// detailed case-study subpages.
export default function ProjectsPage() {
  return (
    <>
      <WebHero
        eyebrow="Portfolio"
        title="Projects delivered across the Philippines."
        sub="A selection of substations, lines and renewable plants. Filter by type below, or open a detailed case study."
      />

      <WebSection>
        <SectionHead eyebrow="Selected work" heading="Browse the portfolio" />
        <WebProjectGallery filterable />
      </WebSection>

      <WebSection alt>
        <SectionHead
          eyebrow="By category"
          heading="Explore detailed case studies"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat} delay={i * 0.06}>
              <Link
                href={CATEGORY_HREF[cat]}
                className="focus-ring-jce glass group/cat flex h-full flex-col rounded-[var(--r-glass)] p-6 transition-transform duration-300 ease-[var(--ease-jce)] hover:-translate-y-0.5"
              >
                <span className="font-mono text-ui-12 font-semibold text-jce-green-600">
                  {PORTFOLIO_TOTALS[cat].count} projects
                </span>
                <span className="mt-2 text-ui-18 font-semibold text-jce-ink">
                  {CATEGORY_LABEL[cat]}
                </span>
                <span className="mt-3 inline-flex items-center gap-1 text-ui-13 text-jce-ink-2 transition-colors group-hover/cat:text-jce-green-700">
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
      </WebSection>

      <WebCta
        heading="A project for the national grid?"
        sub="From systems-impact studies through substation commissioning — send a brief and we'll respond inside one business day."
        ctaLabel="Start a project"
      />
    </>
  );
}
