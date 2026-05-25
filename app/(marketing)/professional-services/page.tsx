import type { Metadata } from "next";

import { EditorialHero } from "@/components/sections/editorial-hero";
import { ConsultingScope } from "@/components/sections/consulting-scope";
import { CapabilityGrid } from "@/components/sections/capability-grid";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { CTABanner } from "@/components/sections/cta-banner";

import { CONSULTING_SCOPE, PROCESS_STEPS } from "@/lib/content/products";
import { CAPABILITIES } from "@/lib/content/capabilities";

export const metadata: Metadata = {
  title: "Professional Services",
  description:
    "Pre-development consultancy for renewable-energy projects: DOE FIT applications, NGCP impact and facility studies, ERC point-to-point approval.",
};

export default function ProfessionalServicesPage() {
  return (
    <>
      <EditorialHero
        variant="services"
        eyebrow="Pre-development consulting"
        title="Before the steel goes up, the paperwork goes through."
        subtitle="FIT applications, NGCP Systems Impact and Facility Studies, ERC point-to-point approvals — handled end-to-end by the same team that builds the substation."
        primary={{ label: "Talk to an engineer", href: "/contact-us" }}
        secondary={{ label: "Equipment & scope", href: "/product-services" }}
      />

      <ConsultingScope
        eyebrow="Consulting scope"
        heading="What we handle, end-to-end."
        description="Pre-development paperwork is the hardest part of an interconnection project. We have done it for utilities, developers, and industrial clients."
        items={CONSULTING_SCOPE}
      />

      <CapabilityGrid
        eyebrow="Engineering disciplines"
        heading="Coverage across the project lifecycle."
        items={CAPABILITIES}
      />

      <ProcessTimeline
        eyebrow="Process"
        heading="From study to handover, in five steps."
        steps={PROCESS_STEPS}
      />

      <CTABanner
        eyebrow="Talk to us"
        heading="Send your project brief."
        subhead="Utility, IPP, or industrial — we will respond inside one business day with an engagement scope and timeline."
        primary={{ label: "Send a brief", href: "/contact-us" }}
        tone="primary"
      />
    </>
  );
}
