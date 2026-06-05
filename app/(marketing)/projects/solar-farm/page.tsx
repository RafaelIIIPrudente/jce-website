import type { Metadata } from "next";

import { WebProjectCategoryHero } from "@/components/sections/projects/web-project-category-hero";
import { WebProjectCategoryGrid } from "@/components/sections/projects/web-project-category-grid";
import { WebProjectCategoryCta } from "@/components/sections/projects/web-project-category-cta";

import { SOLAR_PROJECTS } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Solar Farm",
  description:
    "Utility-scale photovoltaic projects across the Philippines — supply, delivery, installation, testing, and commissioning for solar developers in Luzon, Visayas, and Mindanao.",
};

export default function SolarFarmPage() {
  return (
    <>
      <WebProjectCategoryHero
        category="solar"
        eyebrow="Solar farm portfolio"
        title="From 1 MWp pilots to the country's largest urban PV."
        subtitle="Supply, delivery, installation, testing, and commissioning for solar developers across Luzon, Visayas, and Mindanao."
      />

      <WebProjectCategoryGrid
        eyebrow="Projects"
        heading="Solar farms commissioned."
        description="A selected list of utility-scale photovoltaic installations across the country."
        projects={SOLAR_PROJECTS}
      />

      <WebProjectCategoryCta
        eyebrow="Solar EPC"
        heading="Plan a solar-farm build."
        sub="From 1 MWp pilots to multi-tens of MWp arrays — send your site brief and we will respond inside one business day."
        ctaLabel="Start a project"
        ctaHref="/contact-us"
        secondaryLabel="Pre-development consulting"
        secondaryHref="/services"
      />
    </>
  );
}
