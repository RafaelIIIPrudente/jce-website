import type { Metadata } from "next";

import { EditorialHero } from "@/components/sections/editorial-hero";
import { HistoryNarrative } from "@/components/sections/history-narrative";
import { TimelineSegment } from "@/components/sections/timeline-segment";
import { MissionVisionPair } from "@/components/sections/mission-vision-pair";
import { AccreditationStrip } from "@/components/sections/accreditation-strip";
import { CTABanner } from "@/components/sections/cta-banner";

import { ACCREDITATIONS } from "@/lib/content/accreditations";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Twenty-eight years of substation, transmission, and renewable-energy EPC across the Philippines.",
};

const HISTORY_PARAGRAPHS = [
  "In 1997, JC Electrofields Power System was founded by an electrical engineer with a single conviction: the Philippines needed a contractor who could engineer, build, and commission power infrastructure to the same standard, in-house, end-to-end. The company began with substation work for cooperatives in northern Luzon.",
  "Twenty-eight years later, JCE has commissioned distribution substations for LUELCO, MOPRECO, INEC, and DMCI Power Corp.; transmission and grid-expansion work for the National Grid Corporation of the Philippines; and utility-scale solar installations across Luzon, Visayas, and Mindanao — including the Brgy. Isla 27 MWp array, the country’s largest urban solar farm at the time of commissioning.",
  "Today, 124 engineers operate from Valenzuela City, supporting clients in every grid region. The work is the same as it was in 1997: design it once, build it right, commission it to standard.",
];

const MILESTONES = [
  {
    year: 1997,
    title: "Founded",
    body: "Established as an electrical-engineering contractor for utilities in northern Luzon.",
  },
  {
    year: 2005,
    title: "First NGCP project",
    body: "Began transmission and substation work for the national grid.",
  },
  {
    year: 2015,
    title: "Renewable EPC",
    body: "Commissioned first utility-scale photovoltaic generation site.",
  },
  {
    year: 2025,
    title: "124 engineers",
    body: "Nationwide team across Luzon, Visayas, and Mindanao.",
  },
];

export default function AboutPage() {
  return (
    <>
      <EditorialHero
        variant="about"
        eyebrow="About us"
        title="Twenty-eight years engineering the grid."
        subtitle="Founded in 1997 by an electrical engineer with a singular focus on power systems. Today, 124 engineers serving utilities, NGCP, and industrial clients nationwide."
        primary={{ label: "See projects", href: "/projects" }}
        secondary={{ label: "Capabilities", href: "/product-services" }}
      />

      <HistoryNarrative
        eyebrow="History"
        heading="From northern Luzon to the national grid."
        paragraphs={HISTORY_PARAGRAPHS}
      />

      <TimelineSegment
        eyebrow="Milestones"
        heading="A timeline of work."
        milestones={MILESTONES}
      />

      <MissionVisionPair
        eyebrow="Operating principles"
        mission="To design, build, and commission electrical power systems — substations, transmission, renewable generation, and industrial electrical — for utilities, cooperatives, NGCP, and industrial clients across the Philippines, end-to-end, with a single accountable team."
        vision="To be the Philippines’ most credible privately held electrical-power-systems EPC, judged by the projects we have commissioned and the clients who name us by name."
      />

      <AccreditationStrip items={ACCREDITATIONS} />

      <CTABanner
        heading="Talk to the engineers behind the work."
        subhead="Send a project brief — utility, developer, or industrial — and we'll respond inside one business day."
        primary={{ label: "Start a project", href: "/contact-us" }}
      />
    </>
  );
}
