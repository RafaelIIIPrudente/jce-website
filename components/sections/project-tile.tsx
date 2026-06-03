import Image from "next/image";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  type Project,
  CATEGORY_LABEL,
  formatCapacity,
  formatScope,
} from "@/lib/content/projects";

const CATEGORY_GRADIENT: Record<Project["category"], string> = {
  solar:
    "bg-[radial-gradient(circle_at_30%_30%,oklch(0.62_0.12_65/0.45),transparent_60%),linear-gradient(135deg,oklch(0.34_0.06_155/0.85),oklch(0.22_0.014_160))]",
  distribution:
    "bg-[radial-gradient(circle_at_70%_20%,oklch(0.45_0.012_160/0.55),transparent_60%),linear-gradient(150deg,oklch(0.34_0.06_155/0.90),oklch(0.18_0.015_160))]",
  ngcp: "bg-[radial-gradient(circle_at_50%_80%,oklch(0.34_0.06_155/0.65),transparent_55%),linear-gradient(180deg,oklch(0.22_0.014_160),oklch(0.16_0.012_160))]",
};

export function ProjectTile({ project }: { project: Project }) {
  const capacity = formatCapacity(project.capacity);
  const scope = formatScope(project.scope);
  const hero = project.gallery[0];

  return (
    <article
      id={project.slug}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 ease-[var(--ease-editorial)] hover:shadow-soft scroll-mt-24"
    >
      <div
        aria-hidden={!hero}
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden",
          !hero && CATEGORY_GRADIENT[project.category],
        )}
      >
        {hero ? (
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex items-end justify-between p-6">
            <p className="font-display text-h2 leading-none text-[oklch(0.99_0_0/0.10)]">
              {CATEGORY_LABEL[project.category]}
            </p>
          </div>
        )}
        {capacity && (
          <div className="absolute right-4 top-4 z-10">
            <Badge variant="outline" className="bg-card/95 backdrop-blur-sm">
              {capacity}
            </Badge>
          </div>
        )}
        {project.voltage && (
          <div className="absolute left-4 top-4 z-10">
            <Badge variant="muted" className="bg-card/90 backdrop-blur-sm">
              {project.voltage}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6">
        <p className="text-eyebrow uppercase text-muted-foreground">
          {project.location}
        </p>
        <h3 className="font-display text-h4 text-balance text-foreground">
          {project.name}
        </h3>
        {project.client && (
          <p className="text-caption text-muted-foreground">
            Client · {project.client}
            {project.year ? ` · ${project.year}` : ""}
          </p>
        )}
        <p className="mt-2 text-body-sm text-pretty text-muted-foreground">
          {project.summary}
        </p>
        {scope && (
          <p className="mt-3 border-t border-border pt-3 text-caption text-foreground">
            <span className="text-muted-foreground">Scope · </span>
            {scope}
          </p>
        )}
      </div>
    </article>
  );
}
