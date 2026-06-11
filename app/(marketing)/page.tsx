import type { Metadata } from "next";

import { HomeHero } from "@/components/sections/home/web-home-hero";
import { HomeCapabilities } from "@/components/sections/home/web-home-capabilities-orbital";
import { HomeProofScale } from "@/components/sections/home/web-home-proof-scale";
import { HomeProjects } from "@/components/sections/home/web-home-projects";
import { HomeClients } from "@/components/sections/home/web-home-clients";
import { HomeMotionBand } from "@/components/sections/home/web-home-motion-band";
import { HomeCta } from "@/components/sections/home/web-home-cta";
import { SITE } from "@/lib/content/site";
import { SERVICES } from "@/lib/content/website";

// S1 · Home (FLAGSHIP) — the premium photography-led, Lenis-smoothed rebuild.
// Real-photo showpiece hero (with a one-time Ω brand reveal) → orbital capability
// band → the "Proof at scale" photo + stats band → featured projects → NGCP
// trust bar → engineering-in-motion band → Ω closing CTA. Inherits the default
// brand title from the root layout; adds the home OG card.
export const metadata: Metadata = {
  description:
    "JC Electrofields Power System, Inc. — electrical power-systems EPC in the Philippines since 1997. Substations and transmission to 230 kV, NGCP direct connection, switchgear, and renewable-energy consultancy.",
  alternates: { canonical: "/" },
  // og:image (and Twitter's large-image card) is provided by the dynamic
  // opengraph-image.tsx route convention in this segment; no static file.
  twitter: { card: "summary_large_image" },
};

// Organization + LocalBusiness + per-capability Service structured data
// (schema.org, SRS FR-WEB-09). Sourced from the SITE + SERVICES constants — the
// contact NAP (3074 F. Bautista St., Ugong) is used here, NOT the SEC registered
// office. Static content (no user input) → safe to inline as JSON-LD.
const ORG_ID = "https://jcepower.com/#organization";
const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": ORG_ID,
      name: SITE.brand,
      alternateName: SITE.shortBrand,
      url: "https://jcepower.com/",
      logo: "https://jcepower.com/jce-logo.jpg",
      image: "https://jcepower.com/jce-logo.jpg",
      description:
        "Electrical power-systems EPC in the Philippines since 1997 — substations and transmission to 230 kV, NGCP direct connection, switchgear, and renewable-energy consultancy.",
      foundingDate: "1997",
      telephone: SITE.phone,
      email: SITE.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: "3074 F. Bautista St., Ugong",
        addressLocality: "Valenzuela City",
        addressRegion: "Metro Manila",
        addressCountry: "PH",
      },
      areaServed: { "@type": "Country", name: "Philippines" },
      sameAs: [SITE.social.facebook, SITE.social.youtube],
    },
    ...SERVICES.map((s) => ({
      "@type": "Service",
      name: s.name,
      serviceType: s.name,
      description: s.desc,
      provider: { "@id": ORG_ID },
      areaServed: { "@type": "Country", name: "Philippines" },
    })),
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static structured data (no user input) — see HOME_JSON_LD above.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
      />
      <HomeHero />
      <HomeCapabilities />
      <HomeProofScale />
      <HomeProjects />
      <HomeClients />
      <HomeMotionBand />
      <HomeCta />
    </>
  );
}
