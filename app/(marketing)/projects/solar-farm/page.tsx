import type { Metadata } from "next";

import { WebProjectCategoryHero } from "@/components/sections/projects/web-project-category-hero";
import { WebSolarScrollytelling } from "@/components/sections/projects/web-solar-scrollytelling";
import { WebProjectCategoryGrid } from "@/components/sections/projects/web-project-category-grid";
import { WebProjectCategoryCta } from "@/components/sections/projects/web-project-category-cta";

import { PORTFOLIO_TOTALS, SOLAR_PROJECTS } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Solar Farm",
  description:
    "Utility-scale photovoltaic projects across the Philippines — supply, delivery, installation, testing, and commissioning for solar developers in Luzon, Visayas, and Mindanao.",
};

// Largest disclosed single-array capacity (avoids `!` under noUncheckedIndexedAccess).
const SOLAR_MWP_VALUES = SOLAR_PROJECTS.flatMap((p) =>
  p.capacity?.unit === "MWp" ? [p.capacity.value] : [],
);
const LARGEST_MWP = SOLAR_MWP_VALUES.length ? Math.max(...SOLAR_MWP_VALUES) : 0;

const SOLAR_STORY_STATS = [
  {
    value: SOLAR_PROJECTS.length,
    label: "Solar farms",
    sub: "Commissioned across Luzon, Visayas & Mindanao",
  },
  {
    value: PORTFOLIO_TOTALS.solar.mwp ?? 0,
    suffix: " MWp",
    label: "Combined capacity",
    sub: "Across disclosed utility-scale arrays",
  },
  {
    value: LARGEST_MWP,
    suffix: " MWp",
    label: "Largest single array",
    sub: "Gigasol Solar Farm — Alaminos, Laguna",
  },
] as const;

export default function SolarFarmPage() {
  return (
    <>
      <WebProjectCategoryHero
        category="solar"
        eyebrow="Solar farm portfolio"
        title="From 1 MWp pilots to the country's largest urban PV."
        subtitle="Supply, delivery, installation, testing, and commissioning for solar developers across Luzon, Visayas, and Mindanao."
      />

      <WebSolarScrollytelling
        eyebrow="Solar EPC · by the numbers"
        heading="Tracing the current across the archipelago."
        intro="Follow the line as it energizes the portfolio — from a single urban array to utility-scale generation nationwide."
        stats={SOLAR_STORY_STATS}
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
