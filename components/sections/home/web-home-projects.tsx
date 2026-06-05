import { WebSection, SectionHead } from "@/components/sections/kit/web-section";
import { Reveal } from "@/components/sections/kit/web-reveal";
import { PhotoCard } from "@/components/sections/kit/web-photo-card";
import { VoltageTag } from "@/components/sections/kit/web-voltage-tag";
import { FEATURED_PROJECTS } from "@/lib/content/website";

// S1 selected-projects rail — real photographed projects with a VoltageTag
// capacity/voltage badge over each. PhotoCard handles the image + circuit border;
// client withheld renders "Confidential client". Alt text names the project.

export function HomeProjects({ limit = 6 }: { limit?: number }) {
  const rows = FEATURED_PROJECTS.slice(0, limit);
  return (
    <WebSection alt>
      <SectionHead
        eyebrow="Selected work"
        heading="Projects energized"
        viewAll={{ href: "/projects", label: "All projects" }}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((p, i) => (
          <Reveal key={p.name} delay={Math.min(i * 0.05, 0.25)}>
            <PhotoCard
              src={p.img}
              alt={`${p.name}${p.client ? ` for ${p.client}` : ""}, ${p.loc} — JC Electrofields`}
              aspect="aspect-[16/10]"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            >
              <VoltageTag tone="dark" className="mb-2 self-start">
                {p.cap}
              </VoltageTag>
              <div className="text-ui-16 leading-snug font-semibold text-jce-dark-ink">
                {p.name}
              </div>
              <div className="mt-1 text-ui-12 text-jce-dark-ink-2">
                {p.client ?? "Confidential client"} · {p.loc}
              </div>
            </PhotoCard>
          </Reveal>
        ))}
      </div>
    </WebSection>
  );
}
