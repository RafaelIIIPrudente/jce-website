import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

import type { Project } from "@/lib/content/projects";
import { ProjectCard } from "@/components/sections/legacy/project-card";

export function ProjectShowcase({
  eyebrow,
  heading,
  description,
  projects,
  viewAllHref,
}: {
  eyebrow?: string;
  heading: string;
  description?: string;
  projects: readonly Project[];
  viewAllHref?: string;
}) {
  if (projects.length === 0) return null;

  const [feature, ...rest] = projects;

  return (
    <section className="border-b border-border bg-muted/40">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-10">
        <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            {eyebrow && (
              <p className="mb-4 text-eyebrow uppercase text-muted-foreground">
                {eyebrow}
              </p>
            )}
            <h2 className="font-display text-h2 text-balance text-foreground">
              {heading}
            </h2>
            {description && (
              <p className="mt-4 text-body-lg text-pretty text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1 text-caption uppercase tracking-[0.18em] text-primary transition-colors hover:text-foreground"
            >
              View all projects
              <ArrowUpRightIcon className="size-3.5" strokeWidth={1.5} />
            </Link>
          )}
        </header>

        <div className="grid gap-6 md:grid-cols-12">
          {feature && (
            <div className="md:col-span-7">
              <ProjectCard project={feature} size="feature" />
            </div>
          )}
          {rest.length > 0 && (
            <div className="grid grid-rows-2 gap-6 md:col-span-5">
              {rest.slice(0, 2).map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
