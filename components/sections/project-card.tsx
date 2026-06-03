import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  type Project,
  CATEGORY_HREF,
  CATEGORY_LABEL,
  formatCapacity,
} from "@/lib/content/projects";

const CATEGORY_GRADIENT: Record<Project["category"], string> = {
  solar:
    "bg-[radial-gradient(circle_at_30%_30%,oklch(0.62_0.12_65/0.45),transparent_60%),linear-gradient(135deg,oklch(0.34_0.06_155/0.85),oklch(0.22_0.014_160))]",
  distribution:
    "bg-[radial-gradient(circle_at_70%_20%,oklch(0.45_0.012_160/0.55),transparent_60%),linear-gradient(150deg,oklch(0.34_0.06_155/0.90),oklch(0.18_0.015_160))]",
  ngcp: "bg-[radial-gradient(circle_at_50%_80%,oklch(0.34_0.06_155/0.65),transparent_55%),linear-gradient(180deg,oklch(0.22_0.014_160),oklch(0.16_0.012_160))]",
};

export function ProjectCard({
  project,
  size = "default",
}: {
  project: Project;
  size?: "default" | "feature";
}) {
  const href = `${CATEGORY_HREF[project.category]}#${project.slug}`;
  const capacity = formatCapacity(project.capacity);
  const isFeature = size === "feature";

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 ease-[var(--ease-editorial)] hover:shadow-soft",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "relative w-full overflow-hidden",
          isFeature ? "aspect-[16/10]" : "aspect-[4/3]",
          CATEGORY_GRADIENT[project.category],
        )}
      >
        {/* Category etching */}
        <div className="absolute inset-0 flex items-end p-6">
          <p className="font-display text-h2 leading-none text-[oklch(0.99_0_0/0.10)]">
            {CATEGORY_LABEL[project.category]}
          </p>
        </div>
        {capacity && (
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="bg-card/95 backdrop-blur-sm">
              {capacity}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6">
        <p className="text-eyebrow uppercase text-muted-foreground">
          {project.location}
        </p>
        <h3
          className={cn(
            "font-display text-balance text-foreground",
            isFeature ? "text-h3" : "text-h4",
          )}
        >
          {project.name}
        </h3>
        {project.client && (
          <p className="text-caption text-muted-foreground">
            Client · {project.client}
          </p>
        )}
        <p className="mt-2 text-body-sm text-pretty text-muted-foreground">
          {project.summary}
        </p>

        <div className="mt-auto flex items-center gap-1 pt-4 text-caption uppercase tracking-[0.18em] text-primary">
          <span>View project</span>
          <ArrowUpRightIcon
            className="size-3.5 transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </Link>
  );
}
