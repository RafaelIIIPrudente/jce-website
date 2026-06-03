import type { Project } from "@/lib/content/projects";
import { ProjectTile } from "@/components/sections/project-tile";

export function ProjectTileGrid({
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
    <section className="border-b border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-section md:px-10">
        {(heading || description || eyebrow) && (
          <header className="mb-12 max-w-3xl">
            {eyebrow && (
              <p className="mb-4 text-eyebrow uppercase text-muted-foreground">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="font-display text-h2 text-balance text-foreground">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-body-lg text-pretty text-muted-foreground">
                {description}
              </p>
            )}
          </header>
        )}

        <ul className="grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <li key={p.slug}>
              <ProjectTile project={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
