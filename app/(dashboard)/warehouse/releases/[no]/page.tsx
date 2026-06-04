import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findRelease } from "@/lib/mock/warehouse";
import { ReleaseForm } from "./release-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ no: string }>;
}): Promise<Metadata> {
  const { no } = await params;
  return { title: `Release ${decodeURIComponent(no)}` };
}

export default async function ReleaseDetailPage({
  params,
}: {
  params: Promise<{ no: string }>;
}) {
  const { no } = await params;
  const rel = findRelease(decodeURIComponent(no));
  if (!rel) notFound();
  return <ReleaseForm rel={rel} />;
}
