import type { Metadata } from "next";

import { WebProjectCategoryHero } from "@/components/sections/web-project-category-hero";
import { WebProjectCategoryGrid } from "@/components/sections/web-project-category-grid";
import { WebProjectCategoryCta } from "@/components/sections/web-project-category-cta";

import { DISTRIBUTION_PROJECTS } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Distribution Utility",
  description:
    "Distribution substation EPC for electric cooperatives, government, and private utilities — LUELCO, INEC, MOPRECO, DMCI Power, CAAP.",
};

export default function DistributionUtilityPage() {
  return (
    <>
      <WebProjectCategoryHero
        category="distribution"
        eyebrow="Distribution portfolio"
        title="Substations for the cooperatives that keep the lights on."
        subtitle="EPC for LUELCO, INEC, MOPRECO, DMCI Power, CAAP — and private industrial clients."
      />

      <WebProjectCategoryGrid
        eyebrow="Projects"
        heading="Distribution substations commissioned."
        description="A selected list of substation EPC delivered to electric cooperatives, government utilities, and private industrial clients."
        projects={DISTRIBUTION_PROJECTS}
      />

      <WebProjectCategoryCta
        eyebrow="Distribution EPC"
        heading="Specify a substation."
        sub="Send your single-line and protection scheme — we will respond with a quotation and engineering scope inside one business day."
        ctaLabel="Start a project"
        ctaHref="/contact-us"
        secondaryLabel="Equipment & scope"
        secondaryHref="/products"
      />
    </>
  );
}
