import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getMr } from "@/lib/mock/pmg";
import { MrForm } from "./mr-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ no: string }>;
}): Promise<Metadata> {
  const { no } = await params;
  const mr = getMr(decodeURIComponent(no));
  return { title: mr ? mr.no : "Material Request" };
}

// P10 · Material Request form.
export default async function MaterialRequestPage({
  params,
}: {
  params: Promise<{ no: string }>;
}) {
  const { no } = await params;
  const mr = getMr(decodeURIComponent(no));
  if (!mr) notFound();
  return <MrForm mr={mr} />;
}
