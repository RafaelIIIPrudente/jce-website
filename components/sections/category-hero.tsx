import Link from "next/link";

import { EditorialHero } from "@/components/sections/editorial-hero";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type CategoryHeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  category: "solar" | "distribution" | "ngcp";
};

const CATEGORY_LABEL = {
  solar: "Solar Farm",
  distribution: "Distribution Utility",
  ngcp: "NGCP",
} as const;

export function CategoryHero({
  eyebrow,
  title,
  subtitle,
  category,
}: CategoryHeroProps) {
  return (
    <EditorialHero
      variant="category"
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{CATEGORY_LABEL[category]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </EditorialHero>
  );
}
