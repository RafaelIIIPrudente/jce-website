import type { Metadata } from "next";

import { WebProjectCategoryHero } from "@/components/sections/web-project-category-hero";
import { WebProjectCategoryGrid } from "@/components/sections/web-project-category-grid";
import { WebProjectCategoryCta } from "@/components/sections/web-project-category-cta";

import { NGCP_PROJECTS } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Projects Under NGCP",
  description:
    "Transmission substation assembly, transformer testing, shunt capacitor banks, and submarine-cable substations performed for the National Grid Corporation of the Philippines.",
};

export default function NgcpPage() {
  return (
    <>
      <WebProjectCategoryHero
        category="ngcp"
        eyebrow="NGCP portfolio"
        title="On the backbone of the Philippine grid."
        subtitle="Transmission substation assembly, transformer testing, shunt capacitor banks, and submarine-cable substations for the National Grid Corporation of the Philippines."
      />

      <WebProjectCategoryGrid
        eyebrow="Projects"
        heading="Work performed under NGCP."
        description="A selected list of grid-expansion and voltage-improvement projects across Luzon and Visayas."
        projects={NGCP_PROJECTS}
      />

      <WebProjectCategoryCta
        eyebrow="Transmission EPC"
        heading="A project for the national grid?"
        sub="From systems impact studies through substation commissioning, we have done this before. Send a brief — we will respond inside one business day."
        ctaLabel="Start a project"
        ctaHref="/contact-us"
        secondaryLabel="Pre-development consulting"
        secondaryHref="/services"
      />
    </>
  );
}
