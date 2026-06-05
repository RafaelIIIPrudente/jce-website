import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/lib/content/projects";

const CATEGORY_GRADIENT: Record<ProjectCategory, string> = {
  solar:
    "bg-[radial-gradient(circle_at_30%_30%,oklch(0.62_0.12_65/0.55),transparent_60%),linear-gradient(135deg,oklch(0.34_0.06_155/0.90),oklch(0.18_0.015_160))]",
  distribution:
    "bg-[radial-gradient(circle_at_70%_20%,oklch(0.45_0.012_160/0.55),transparent_60%),linear-gradient(150deg,oklch(0.34_0.06_155/0.90),oklch(0.16_0.012_160))]",
  ngcp: "bg-[radial-gradient(circle_at_50%_80%,oklch(0.34_0.06_155/0.65),transparent_55%),linear-gradient(180deg,oklch(0.22_0.014_160),oklch(0.16_0.012_160))]",
};

export function ProjectIndexCard({
  category,
  eyebrow,
  title,
  description,
  count,
  capacityHint,
  href,
}: {
  category: ProjectCategory;
  eyebrow: string;
  title: string;
  description: string;
  count: number;
  capacityHint?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative isolate flex flex-col overflow-hidden rounded-lg border border-border transition-all duration-300 ease-[var(--ease-editorial)] hover:shadow-soft"
    >
      <div
        aria-hidden="true"
        className={cn(
          "relative aspect-[16/9] w-full overflow-hidden md:aspect-[16/10]",
          CATEGORY_GRADIENT[category],
        )}
      >
        <div className="absolute inset-0 flex items-end p-8">
          <p className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-none text-[oklch(0.99_0_0/0.12)]">
            {title}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 bg-card p-8">
        <p className="text-eyebrow uppercase text-muted-foreground">
          {eyebrow}
        </p>
        <h3 className="font-display text-h2 text-balance text-foreground">
          {title}
        </h3>
        <p className="text-body text-pretty text-muted-foreground">
          {description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <p className="text-caption text-muted-foreground">
            {count} project{count === 1 ? "" : "s"}
            {capacityHint ? ` · ${capacityHint}` : ""}
          </p>
          <span className="inline-flex items-center gap-1 text-caption uppercase tracking-[0.18em] text-primary">
            View portfolio
            <ArrowUpRightIcon
              className="size-3.5 transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
