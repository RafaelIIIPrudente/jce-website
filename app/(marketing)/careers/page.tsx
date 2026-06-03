import type { Metadata } from "next";

import { WebHero } from "@/components/sections/web-hero";
import { WebSection } from "@/components/sections/web-section";
import { WebCareersList } from "@/components/sections/web-careers-list";
import { WebCta } from "@/components/sections/web-cta";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Build the infrastructure that powers the Philippines. Open engineering, project-management, construction and purchasing roles at JC Electrofields.",
};

// S7 · Careers (web-pages-b.jsx:373-409). Application mechanism unconfirmed (OPEN-Q #11).
export default function CareersPage() {
  return (
    <>
      <WebHero
        eyebrow="Join us"
        title="Build what powers the Philippines."
        sub="From substations to the national grid — open roles across engineering, project management, construction and purchasing."
      />
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
