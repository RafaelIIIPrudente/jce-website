"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/sections/web-reveal";
import {
  PROJECT_TAGS,
  WEB_PROJECTS,
  type WebProject,
} from "@/lib/content/website";

// S4 Projects gallery (filterable, "All" default) + the S1 featured rail
// (web-pages-a.jsx:80-104, 229-282). "Confidential client" when the client is
// withheld. Gradient placeholders (photography pending, OPEN-Q #13). Tag: Solid.

function ProjectCard({ p }: { p: WebProject }) {
  return (
    <div className="solid flex h-full flex-col overflow-hidden rounded-[var(--r-solid)]">
      <div className="relative aspect-[16/10] bg-[linear-gradient(135deg,var(--jce-green-100),var(--jce-green-50))]">
        <span className="absolute top-3 right-3 rounded-full bg-white/85 px-2.5 py-0.5 font-mono text-ui-12 font-semibold text-jce-ink">
          {p.year}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="text-ui-16 font-semibold text-jce-ink">{p.name}</div>
        <div className="mt-1 text-ui-13 text-jce-ink-2">
          {p.client ?? "Confidential client"} · {p.loc}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-jce-green-50 px-2 py-0.5 text-ui-12 font-medium text-jce-green-700"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
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
                    : "border border-jce-line bg-white/60 text-jce-ink-2 hover:bg-jce-green-50 hover:text-jce-green-900",
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
