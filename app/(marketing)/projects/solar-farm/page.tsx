import type { Metadata } from "next";

import { CategoryHero } from "@/components/sections/category-hero";
import { ProjectTileGrid } from "@/components/sections/project-tile-grid";
import { CTABanner } from "@/components/sections/cta-banner";

import { SOLAR_PROJECTS } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Solar Farm",
  description:
    "Utility-scale photovoltaic projects across the Philippines — supply, delivery, installation, testing, and commissioning for solar developers in Luzon, Visayas, and Mindanao.",
};

export default function SolarFarmPage() {
  return (
    <>
      <CategoryHero
        category="solar"
        eyebrow="Solar farm portfolio"
        title="From 1 MWp pilots to the country's largest urban PV."
        subtitle="Supply, delivery, installation, testing, and commissioning for solar developers across Luzon, Visayas, and Mindanao."
      />

      <ProjectTileGrid
        eyebrow="Projects"
        heading="Solar farms commissioned."
        description="A selected list of utility-scale photovoltaic installations across the country."
        projects={SOLAR_PROJECTS}
      />

      <CTABanner
        eyebrow="Solar EPC"
        heading="Plan a solar-farm build."
        subhead="From 1 MWp pilots to multi-tens of MWp arrays — send your site brief and we will respond inside one business day."
        primary={{ label: "Start a project", href: "/contact-us" }}
        secondary={{
          label: "Pre-development consulting",
          href: "/services",
        }}
        tone="primary"
      />
    </>
  );
}
