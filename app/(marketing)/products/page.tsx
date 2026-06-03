import type { Metadata } from "next";

import { WebHero } from "@/components/sections/web-hero";
import { WebSection } from "@/components/sections/web-section";
import { WebProductsGrid } from "@/components/sections/web-products-grid";
import { WebCta } from "@/components/sections/web-cta";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Power equipment specified, supplied and integrated by JCE — power and distribution transformers (15 KV–230 KV), HVSG/MVSG/LVSG switchgear, and protection & control. Exclusive Philippine distributor of Shenda Electric.",
};

// S5 · Products (web-pages-a.jsx:290-323). Kept distinct from Services.
export default function ProductsPage() {
  return (
    <>
      <WebHero
        eyebrow="What we supply"
        title="Power equipment we supply."
        sub="Specified, supplied and integrated by JCE — kept distinct from our EPC services. Exclusive Philippine distributor of Shenda Electric."
      />
      <WebSection>
        <WebProductsGrid />
      </WebSection>
      <WebCta
        heading="Need a quotation?"
        sub="Send your specification — transformer rating, switchgear class or protection scheme — and we'll respond with a quote."
        ctaLabel="Request a quote"
      />
    </>
  );
}
