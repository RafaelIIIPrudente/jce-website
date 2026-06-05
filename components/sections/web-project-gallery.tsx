"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/sections/web-reveal";
import { OmegaMark } from "@/components/sections/web-omega-mark";
import { VoltageTag } from "@/components/sections/web-voltage-tag";
import {
  PROJECT_TAGS,
  WEB_PROJECTS,
  type WebProject,
} from "@/lib/content/website";

// S4 Projects gallery (filterable, "All" default). Electrified re-skin to match the
// case-study sub-pages: each tile is a circuit-card over a solid surface with a
// near-black circuit-field media box carrying a faint Ω brand seal and a dark
// VoltageTag for the year (photography pending — never a broken image).
// "Confidential client" when the client is withheld. Cards energize up in a
// staggered Reveal (motion); the whole thing settles to a premium static render
// under prefers-reduced-motion. Index-only (not shared).

function ProjectCard({ p }: { p: WebProject }) {
  return (
    <article className="circuit-card flex h-full flex-col gap-3 bg-card p-5 shadow-(--solid-shadow)">
      <div className="circuit-field relative isolate flex aspect-[16/10] items-center justify-center overflow-hidden rounded-(--r-input) border border-jce-dark-line bg-jce-dark">
        <OmegaMark
          className="pointer-events-none size-16 text-jce-cyan/25"
          strokeWidth={5}
        />
        <VoltageTag tone="dark" className="absolute top-3 right-3">
          {p.year}
        </VoltageTag>
      </div>
      <div className="text-ui-16 font-semibold text-jce-ink">{p.name}</div>
      <div className="text-ui-13 text-jce-ink-2">
        {p.client ?? "Confidential client"} · {p.loc}
      </div>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
        {p.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-jce-line bg-jce-green-50 px-2 py-0.5 text-ui-12 font-medium text-jce-green-700"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}

export function WebProjectGallery({
  projects = WEB_PROJECTS,
  filterable = false,
  limit,
}: {
  projects?: readonly WebProject[];
  filterable?: boolean;
  limit?: number;
}) {
  const [tag, setTag] = useState("All");
  const rows = filterable
    ? tag === "All"
      ? projects
      : projects.filter((p) => p.tags.includes(tag))
    : limit
      ? projects.slice(0, limit)
      : projects;

  return (
    <>
      {filterable ? (
        <div
          className="mb-7 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter projects by type"
        >
          {PROJECT_TAGS.map((t) => {
            const active = t === tag;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTag(t)}
                className={cn(
                  "focus-ring-jce inline-flex min-h-11 items-center rounded-full px-4 text-ui-13 font-medium transition-colors",
                  active
                    ? "bg-jce-green-700 text-white"
                    : "border border-jce-line bg-card text-jce-ink-2 hover:border-jce-cyan/40 hover:text-jce-cyan-deep",
                )}
              >
                {t}
              </button>
            );
          })}
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((p, i) => (
          <Reveal key={p.name} delay={Math.min(i * 0.05, 0.25)}>
            <ProjectCard p={p} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
