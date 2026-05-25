import type { Metadata } from "next";

import { EditorialHero } from "@/components/sections/editorial-hero";
import { ProjectIndexCard } from "@/components/sections/project-index-card";
import { PortfolioFigures } from "@/components/sections/portfolio-figures";
import { CTABanner } from "@/components/sections/cta-banner";

import {
  PORTFOLIO_TOTALS,
  CATEGORY_HREF,
  ALL_PROJECTS,
} from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Solar farms, distribution substations, and NGCP transmission projects across the Philippines — capacities, voltages, and clients listed for every project.",
};

const TOTAL_PROJECTS = ALL_PROJECTS.length;

const FIGURES = [
  { value: String(TOTAL_PROJECTS), label: "Total projects" },
  { value: String(PORTFOLIO_TOTALS.solar.count), label: "Solar" },
  { value: String(PORTFOLIO_TOTALS.distribution.count), label: "Distribution" },
  { value: String(PORTFOLIO_TOTALS.ngcp.count), label: "NGCP" },
];

const SOLAR_HINT = PORTFOLIO_TOTALS.solar.mwp
  ? `${PORTFOLIO_TOTALS.solar.mwp}+ MWp commissioned`
  : undefined;

export default function ProjectsPage() {
  return (
    <>
      <EditorialHero
        variant="projects"
        eyebrow="Selected work"
        title="Three decades on the Philippine grid."
        subtitle="Browse by category. Every project on the portfolio lists its capacity, voltage, client, and scope."
        primary={{ label: "Solar Farm", href: "/projects/solar-farm" }}
        secondary={{
          label: "Distribution & NGCP",
          href: "/projects/distribution-utility",
        }}
      />

      <section className="border-b border-border bg-background">
        <div className="mx-auto w-full max-w-6xl px-6 py-section md:px-10">
          <div className="grid gap-6 md:grid-cols-3">
            <ProjectIndexCard
              category="solar"
              eyebrow="Solar farm portfolio"
              title="Solar Farm"
              description="Utility-scale photovoltaic projects across Luzon, Visayas, and Mindanao — from 1 MWp pilots to the largest urban PV array in the country."
              count={PORTFOLIO_TOTALS.solar.count}
              capacityHint={SOLAR_HINT}
              href={CATEGORY_HREF.solar}
            />
            <ProjectIndexCard
              category="distribution"
              eyebrow="Distribution portfolio"
              title="Distribution Utility"
              description="Substation EPC for electric cooperatives, government, and private utilities — LUELCO, INEC, MOPRECO, DMCI Power, CAAP."
              count={PORTFOLIO_TOTALS.distribution.count}
              href={CATEGORY_HREF.distribution}
            />
            <ProjectIndexCard
              category="ngcp"
              eyebrow="NGCP portfolio"
              title="National Grid"
              description="Transmission substation assembly, transformer testing, shunt capacitor banks, and submarine-cable substations for the National Grid Corporation."
              count={PORTFOLIO_TOTALS.ngcp.count}
              href={CATEGORY_HREF.ngcp}
            />
          </div>
        </div>
      </section>

      <PortfolioFigures eyebrow="By the numbers" figures={FIGURES} />

      <CTABanner
        eyebrow="Talk to us"
        heading="Plan a project."
        subhead="Send a project brief — utility, developer, or industrial — and we will respond inside one business day."
        primary={{ label: "Start a project", href: "/contact-us" }}
        tone="primary"
      />
    </>
  );
}
