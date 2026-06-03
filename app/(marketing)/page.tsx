import { WebHero } from "@/components/sections/web-hero";
import { WebSection, SectionHead } from "@/components/sections/web-section";
import { WebCapabilityGrid } from "@/components/sections/web-capability-grid";
import { WebProjectGallery } from "@/components/sections/web-project-gallery";
import { WebTrustBand } from "@/components/sections/web-trust-band";
import { WebCta } from "@/components/sections/web-cta";
import { STATS } from "@/lib/content/website";

// S1 · Home (FLAGSHIP, web-pages-a.jsx:10-139). Inherits the default brand title
// from the root layout template.
export default function HomePage() {
  return (
    <>
      <WebHero
        size="home"
        eyebrow="JC Electrofields Power System, Inc."
        title={
          <>
            Power infrastructure,
            <br />
            <span className="text-jce-green-700">engineered to energize.</span>
          </>
        }
        sub="Substations, transmission lines and renewable energy — design-build EPC up to 230 KV, delivered across the Philippines."
        primary={{ label: "Request a consultation", href: "/contact-us" }}
        secondary={{ label: "View projects", href: "/projects" }}
        stats={STATS}
      />

      <WebSection>
        <SectionHead
          eyebrow="What we do"
          heading="Full-scope power engineering"
          viewAll={{ href: "/services", label: "All services" }}
        />
        <WebCapabilityGrid />
      </WebSection>

      <WebSection alt>
        <SectionHead
          eyebrow="Selected work"
          heading="Projects energized"
          viewAll={{ href: "/projects", label: "All projects" }}
        />
        <WebProjectGallery limit={3} />
      </WebSection>

      <WebSection>
        <WebTrustBand />
      </WebSection>

      <WebCta />
    </>
  );
}
