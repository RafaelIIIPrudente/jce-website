import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findProject } from "@/lib/mock/pmg";
import { Accomplishment } from "./accomplishment";

export const metadata: Metadata = { title: "Accomplishment" };

// P8 · Accomplishment workspace (flagship).
export default async function AccomplishmentPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const project = findProject(code);
  if (!project) notFound();
  return <Accomplishment project={project} />;
}
