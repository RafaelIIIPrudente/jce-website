import type { Metadata } from "next";

import { WebSection } from "@/components/sections/kit/web-section";
import { CareersHero } from "@/components/sections/careers/web-careers-hero";
import { WebCareersList } from "@/components/sections/careers/web-careers-list";
import { WebCta } from "@/components/sections/kit/web-cta";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Build the infrastructure that powers the Philippines. Open engineering, project-management, construction and purchasing roles at JC Electrofields.",
};

// S7 · Careers (web-pages-b.jsx:373-409). Application mechanism unconfirmed (OPEN-Q #11).
export default function CareersPage() {
  return (
    <>
      <CareersHero />
      <WebSection>
        <WebCareersList />
      </WebSection>
      <WebCta
        heading="Don't see your role?"
        sub="We're always glad to hear from power-engineering talent. Send your profile and we'll be in touch."
        ctaLabel="Introduce yourself"
      />
    </>
  );
}
