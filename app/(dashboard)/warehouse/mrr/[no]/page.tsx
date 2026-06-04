import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findMrr } from "@/lib/mock/warehouse";
import { MrrForm } from "./mrr-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ no: string }>;
}): Promise<Metadata> {
  const { no } = await params;
  return { title: `MRR ${decodeURIComponent(no)}` };
}

export default async function MrrDetailPage({
  params,
}: {
  params: Promise<{ no: string }>;
}) {
  const { no } = await params;
  const mrr = findMrr(decodeURIComponent(no));
  if (!mrr) notFound();
  return <MrrForm mrr={mrr} />;
}
