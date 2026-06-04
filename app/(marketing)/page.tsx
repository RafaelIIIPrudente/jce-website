import type { Metadata } from "next";

import { HomeHero } from "@/components/sections/web-home-hero";
import { HomeCapabilities } from "@/components/sections/web-home-capabilities";
import { HomeProjects } from "@/components/sections/web-home-projects";
import { HomeClients } from "@/components/sections/web-home-clients";
import { HomeMotionBand } from "@/components/sections/web-home-motion-band";
import { HomeCta } from "@/components/sections/web-home-cta";

// S1 · Home (FLAGSHIP) — the premium "electrified" rebuild. Dark showpiece hero,
// photo-backed capability band, featured projects with voltage tags, NGCP trust
// bar, an engineering-in-motion dark band, and the Ω closing CTA. Inherits the
// default brand title from the root layout; adds the home OG card.
export const metadata: Metadata = {
  description:
    "JC Electrofields Power System, Inc. — electrical power-systems EPC in the Philippines since 1997. Substations and transmission to 230 kV, NGCP direct connection, switchgear, and utility-scale solar.",
  alternates: { canonical: "/" },
  openGraph: {
    images: [
      {
        url: "/og/home.webp",
        width: 1200,
        height: 630,
        alt: "JC Electrofields Power System — power infrastructure engineered to energize",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeCapabilities />
      <HomeProjects />
      <HomeClients />
      <HomeMotionBand />
      <HomeCta />
    </>
  );
}
