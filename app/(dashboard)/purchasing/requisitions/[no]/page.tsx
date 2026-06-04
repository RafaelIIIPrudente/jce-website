import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findPrq } from "@/lib/mock/purchasing";
import { PrqDetail } from "./prq-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ no: string }>;
}): Promise<Metadata> {
  const { no } = await params;
  return { title: `PRQ ${decodeURIComponent(no)}` };
}

export default async function PrqDetailPage({
  params,
}: {
  params: Promise<{ no: string }>;
}) {
  const { no } = await params;
  const prq = findPrq(decodeURIComponent(no));
  if (!prq) notFound();
  return <PrqDetail prq={prq} />;
}
