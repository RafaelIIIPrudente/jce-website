import type { Metadata } from "next";

import { CategoryHero } from "@/components/sections/category-hero";
import { ProjectTileGrid } from "@/components/sections/project-tile-grid";
import { CTABanner } from "@/components/sections/cta-banner";

import { NGCP_PROJECTS } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Projects Under NGCP",
  description:
    "Transmission substation assembly, transformer testing, shunt capacitor banks, and submarine-cable substations performed for the National Grid Corporation of the Philippines.",
};

export default function NgcpPage() {
  return (
    <>
      <CategoryHero
        category="ngcp"
        eyebrow="NGCP portfolio"
        title="On the backbone of the Philippine grid."
        subtitle="Transmission substation assembly, transformer testing, shunt capacitor banks, and submarine-cable substations for the National Grid Corporation of the Philippines."
      />

      <ProjectTileGrid
        eyebrow="Projects"
        heading="Work performed under NGCP."
        description="A selected list of grid-expansion and voltage-improvement projects across Luzon and Visayas."
        projects={NGCP_PROJECTS}
      />

      <CTABanner
        eyebrow="Transmission EPC"
        heading="A project for the national grid?"
        subhead="From systems impact studies through substation commissioning, we have done this before. Send a brief — we will respond inside one business day."
        primary={{ label: "Start a project", href: "/contact-us" }}
        secondary={{
          label: "Pre-development consulting",
          href: "/professional-services",
        }}
        tone="primary"
      />
    </>
  );
}
