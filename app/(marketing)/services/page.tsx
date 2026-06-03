import type { Metadata } from "next";

import { WebHero } from "@/components/sections/web-hero";
import { WebSection } from "@/components/sections/web-section";
import { WebServiceList } from "@/components/sections/web-service-list";
import { WebCta } from "@/components/sections/web-cta";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Turnkey EPC and specialized power services from distribution voltages up to 230 KV — substations, transmission lines, solar, switchgear, NGCP direct connection, maintenance and engineering consultancy.",
};

// S3 · Services (web-pages-a.jsx:191-223). The former /professional-services
// scope is folded in as the Engineering Consultancy row (PROPOSED).
export default function ServicesPage() {
  return (
    <>
      <WebHero
        eyebrow="Capabilities"
        title="Full-scope power engineering services."
        sub="Turnkey EPC and specialized power services from distribution voltages up to 230 KV — one accountable team from study to handover."
      />
      <WebSection>
        <WebServiceList />
      </WebSection>
      <WebCta
        heading="Need a capability profile?"
        sub="Tell us about your power requirement — we'll respond with an indicative scope inside one business day."
        ctaLabel="Enquire now"
      />
    </>
  );
}
