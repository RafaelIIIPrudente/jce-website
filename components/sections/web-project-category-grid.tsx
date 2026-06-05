import Image from "next/image";

import { Reveal } from "@/components/sections/web-reveal";
import { CircuitReveal } from "@/components/sections/web-circuit-reveal";
import { WebSection } from "@/components/sections/web-section";
import { OmegaMark } from "@/components/sections/web-omega-mark";
import { VoltageTag } from "@/components/sections/web-voltage-tag";
import {
  type Project,
  formatCapacity,
  formatScope,
} from "@/lib/content/projects";

// Projects category grid — the electrified case-study grid, matching the Products
// grid idiom (circuit-card over a solid surface, a near-black circuit-field media
// box, dark VoltageTags, a faint Ω seal). Keeps the rich Project fidelity
// (capacity / voltage / client / scope / summary — FR-WEB-14). A gallery image
// renders as next/image when present; otherwise the blueprint panel carries the Ω
// seal (galleries are empty today — never a broken image). The section head traces
// in via CircuitReveal (anime.js); cards energize up in a staggered Reveal
// (motion). Both freeze to a premium static render under reduced-motion.
// Page-scoped — data stays on the projects.ts arrays.

function ProjectCategoryCard({ project }: { project: Project }) {
  const capacity = formatCapacity(project.capacity);
  const scope = formatScope(project.scope);
  const hero = project.gallery[0];

  return (
    <article
      id={project.slug}
      className="circuit-card flex h-full scroll-mt-24 flex-col gap-3 bg-card p-5 shadow-(--solid-shadow)"
    >
      <div className="circuit-field relative isolate flex aspect-[16/10] items-center justify-center overflow-hidden rounded-(--r-input) border border-jce-dark-line bg-jce-dark">
        {hero ? (
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <OmegaMark
            className="pointer-events-none size-16 text-jce-cyan/25"
            strokeWidth={5}
          />
        )}
        {capacity ? (
          <VoltageTag tone="dark" className="absolute top-3 right-3">
            {capacity}
          </VoltageTag>
        ) : null}
        {project.voltage ? (
          <VoltageTag tone="dark" className="absolute top-3 left-3">
            {project.voltage}
          </VoltageTag>
        ) : null}
      </div>

      <p className="kicker text-jce-cyan-deep">{project.location}</p>
      <h3 className="text-ui-18 font-semibold text-balance text-jce-ink">
        {project.name}
      </h3>
      {project.client ? (
        <p className="text-ui-13 text-jce-ink-2">
          Client · {project.client}
          {project.year ? ` · ${project.year}` : ""}
        </p>
      ) : null}
      <p className="text-ui-13 text-pretty text-jce-ink-2">{project.summary}</p>
      {scope ? (
        <p className="mt-auto border-t border-jce-line pt-3 text-ui-13 text-jce-ink">
          <span className="text-jce-ink-2">Scope · </span>
          {scope}
        </p>
      ) : null}
    </article>
  );
}

export function WebProjectCategoryGrid({
  eyebrow,
  heading,
  description,
  projects,
}: {
  eyebrow?: string;
  heading?: string;
  description?: string;
  projects: readonly Project[];
}) {
  return (
    <WebSection>
      {heading ? (
        <CircuitReveal
          lineClassName="text-jce-cyan"
          className="mb-8 max-w-[56ch] md:mb-10"
        >
          {eyebrow ? (
            <p className="kicker text-jce-cyan-deep">{eyebrow}</p>
          ) : null}
          <h2 className="mt-2 text-[clamp(24px,3.6vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-jce-ink">
            {heading}
          </h2>
          {description ? (
            <p className="mt-3 text-ui-16 text-pretty text-jce-ink-2">
              {description}
            </p>
          ) : null}
        </CircuitReveal>
      ) : null}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={Math.min(i * 0.05, 0.25)}>
            <ProjectCategoryCard project={p} />
          </Reveal>
        ))}
      </div>
    </WebSection>
  );
}
