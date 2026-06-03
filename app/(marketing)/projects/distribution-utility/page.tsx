import type { Metadata } from "next";

import { CategoryHero } from "@/components/sections/category-hero";
import { ProjectTileGrid } from "@/components/sections/project-tile-grid";
import { CTABanner } from "@/components/sections/cta-banner";

import { DISTRIBUTION_PROJECTS } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Distribution Utility",
  description:
    "Distribution substation EPC for electric cooperatives, government, and private utilities — LUELCO, INEC, MOPRECO, DMCI Power, CAAP.",
};

export default function DistributionUtilityPage() {
  return (
    <>
      <CategoryHero
        category="distribution"
        eyebrow="Distribution portfolio"
        title="Substations for the cooperatives that keep the lights on."
        subtitle="EPC for LUELCO, INEC, MOPRECO, DMCI Power, CAAP — and private industrial clients."
      />

      <ProjectTileGrid
        eyebrow="Projects"
        heading="Distribution substations commissioned."
        description="A selected list of substation EPC delivered to electric cooperatives, government utilities, and private industrial clients."
        projects={DISTRIBUTION_PROJECTS}
      />

      <CTABanner
        eyebrow="Distribution EPC"
        heading="Specify a substation."
        subhead="Send your single-line and protection scheme — we will respond with a quotation and engineering scope inside one business day."
        primary={{ label: "Start a project", href: "/contact-us" }}
        secondary={{ label: "Equipment & scope", href: "/products" }}
        tone="primary"
      />
    </>
  );
}
