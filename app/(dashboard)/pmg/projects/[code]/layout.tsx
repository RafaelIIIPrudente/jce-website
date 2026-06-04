import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

import { findProject } from "@/lib/mock/pmg";
import { ProjectSubNav } from "../../pmg-sub-nav";

// Project workspace shell — Header / BOQ / VO / Accomplishment / Billing /
// Timeline tabs (P5–P9, P12) for one project.
export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const project = findProject(code);
  if (!project) notFound();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4">
      <Link
        href="/pmg/portfolio"
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Portfolio
      </Link>
      <ProjectSubNav code={code} />
      {children}
    </div>
  );
}
