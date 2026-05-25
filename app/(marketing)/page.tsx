import { EditorialHero } from "@/components/sections/editorial-hero";
import { StatBand } from "@/components/sections/stat-band";
import { CapabilityGrid } from "@/components/sections/capability-grid";
import { ProjectShowcase } from "@/components/sections/project-showcase";
import { AccreditationStrip } from "@/components/sections/accreditation-strip";
import { MissionVisionPair } from "@/components/sections/mission-vision-pair";
import { CTABanner } from "@/components/sections/cta-banner";

import { CAPABILITIES } from "@/lib/content/capabilities";
import { ACCREDITATIONS } from "@/lib/content/accreditations";
import {
  SOLAR_PROJECTS,
  DISTRIBUTION_PROJECTS,
  NGCP_PROJECTS,
} from "@/lib/content/projects";

const HOMEPAGE_STATS = [
  { value: "1997", label: "Founded", hint: "28 years operating" },
  { value: "124", label: "Engineers", hint: "Across grid regions" },
  { value: "230 kV", label: "Up to", hint: "Transmission voltage" },
  { value: "24+", label: "Projects", hint: "Commissioned to date" },
];

const FEATURED_PROJECTS = [
  SOLAR_PROJECTS.find((p) => p.slug === "isla-valenzuela"),
  NGCP_PROJECTS.find((p) => p.slug === "cabanatuan-300mva"),
  DISTRIBUTION_PROJECTS.find((p) => p.slug === "san-carlos-25mva"),
].filter((p): p is NonNullable<typeof p> => Boolean(p));

export default function HomePage() {
  return (
    <>
      <EditorialHero
        variant="home"
        eyebrow="Power Systems EPC — Philippines"
        title={<>Building the Philippines{"’"} power grid since 1997.</>}
        subtitle="Substation, transmission, and renewable-energy EPC for utilities, NGCP, and industrial clients — 124 engineers across Luzon, Visayas, and Mindanao."
        primary={{ label: "See our projects", href: "/projects" }}
        secondary={{ label: "Start a project", href: "/contact-us" }}
      />

      <StatBand stats={HOMEPAGE_STATS} eyebrow="At a glance" />

      <CapabilityGrid
        eyebrow="What we do"
        heading="Engineering, procurement, and construction — one accountable team."
        description="From front-end design through commissioning, JCE delivers substations, transmission, renewable generation, and industrial electrical systems with a single point of accountability."
        items={CAPABILITIES}
      />

      <ProjectShowcase
        eyebrow="Selected work"
        heading="Projects across solar, distribution, and the national grid."
        description="A sample from twenty-eight years on the Philippine grid. Every project on the portfolio page lists capacity, voltage, and client."
        projects={FEATURED_PROJECTS}
        viewAllHref="/projects"
      />

      <AccreditationStrip items={ACCREDITATIONS} />

      <MissionVisionPair
        eyebrow="Operating principles"
        mission="To design, build, and commission electrical power systems — substations, transmission, renewable generation, and industrial electrical — for utilities, cooperatives, NGCP, and industrial clients across the Philippines, end-to-end, with a single accountable team."
        vision="To be the Philippines’ most credible privately held electrical-power-systems EPC, judged by the projects we have commissioned and the clients who name us by name."
      />

      <CTABanner
        eyebrow="Talk to us"
        heading="Discuss your project."
        subhead="We respond inside one business day to inquiries from utilities, developers, and industrial clients."
        primary={{ label: "Send a brief", href: "/contact-us" }}
        secondary={{ label: "View projects", href: "/projects" }}
        tone="primary"
      />
    </>
  );
}
