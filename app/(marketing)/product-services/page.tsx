import type { Metadata } from "next";

import { EditorialHero } from "@/components/sections/editorial-hero";
import { ProductLineGrid } from "@/components/sections/product-line-grid";
import { ScopeOfWorkList } from "@/components/sections/scope-of-work-list";
import { CapabilityGrid } from "@/components/sections/capability-grid";
import { CTABanner } from "@/components/sections/cta-banner";

import { PRODUCT_LINES, SCOPE_OF_WORK } from "@/lib/content/products";
import { EXTENDED_CAPABILITIES } from "@/lib/content/capabilities";

export const metadata: Metadata = {
  title: "Product & Services",
  description:
    "Transformers, switchgear, breakers, and the EPC scope to design and commission them — for utilities, NGCP, and industrial clients across the Philippines.",
};

export default function ProductServicesPage() {
  return (
    <>
      <EditorialHero
        variant="products"
        eyebrow="Equipment & scope"
        title="From 15 kV distribution to 230 kV transmission."
        subtitle="A vetted equipment line and an EPC scope built to commission both — supply through testing, single accountable team."
        primary={{ label: "Discuss specifications", href: "/contact-us" }}
        secondary={{ label: "View projects", href: "/projects" }}
      />

      <ProductLineGrid
        eyebrow="Equipment"
        heading="Major product lines."
        description="Specified, supplied, and integrated into substation and industrial projects across the country."
        items={PRODUCT_LINES}
      />

      <ScopeOfWorkList
        eyebrow="Scope of work"
        heading="What we deliver."
        description="A complete EPC scope — design and consulting at the front, fabrication and maintenance through to handover."
        items={SCOPE_OF_WORK}
      />

      <CapabilityGrid
        eyebrow="Capabilities"
        heading="Voltage and discipline coverage."
        description="From front-end design and consulting through fabrication and maintenance, the work is delivered by one team."
        items={EXTENDED_CAPABILITIES}
      />

      <CTABanner
        eyebrow="Specify a project"
        heading="Send your equipment list."
        subhead="We respond inside one business day with a quotation and engineering scope."
        primary={{ label: "Send specifications", href: "/contact-us" }}
        secondary={{
          label: "Pre-development consulting",
          href: "/professional-services",
        }}
        tone="primary"
      />
    </>
  );
}
