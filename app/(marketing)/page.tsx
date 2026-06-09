import type { Metadata } from "next";

import { HomeHero } from "@/components/sections/home/web-home-hero";
import { HomeCapabilities } from "@/components/sections/home/web-home-capabilities";
import { HomeProofScale } from "@/components/sections/home/web-home-proof-scale";
import { HomeCrewBand } from "@/components/sections/home/web-home-crew-band";
import { HomeProjects } from "@/components/sections/home/web-home-projects";
import { HomeClients } from "@/components/sections/home/web-home-clients";
import { HomeMotionBand } from "@/components/sections/home/web-home-motion-band";
import { HomeCta } from "@/components/sections/home/web-home-cta";

// S1 · Home (FLAGSHIP) — the premium photography-led, Lenis-smoothed rebuild.
// Real-photo showpiece hero (with a one-time Ω brand reveal) → photo capability
// band → the pinned "Proof at scale" scrollytelling centerpiece → the
// "From the ground" crew band → featured projects → NGCP trust bar →
// engineering-in-motion band → Ω closing CTA. Inherits the default brand title
// from the root layout; adds the home OG card.
export const metadata: Metadata = {
  description:
    "JC Electrofields Power System, Inc. — electrical power-systems EPC in the Philippines since 1997. Substations and transmission to 230 kV, NGCP direct connection, switchgear, and utility-scale solar.",
  alternates: { canonical: "/" },
  // og:image (and Twitter's large-image card) is provided by the dynamic
  // opengraph-image.tsx route convention in this segment; no static file.
  twitter: { card: "summary_large_image" },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeCapabilities />
      <HomeProofScale />
      <HomeCrewBand />
      <HomeProjects />
      <HomeClients />
      <HomeMotionBand />
      <HomeCta />
    </>
  );
}
