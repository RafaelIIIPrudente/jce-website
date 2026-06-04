import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findRfq } from "@/lib/mock/purchasing";
import { RfqComparison } from "./rfq-comparison";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ no: string }>;
}): Promise<Metadata> {
  const { no } = await params;
  return { title: `RFQ ${decodeURIComponent(no)}` };
}

export default async function RfqComparisonPage({
  params,
}: {
  params: Promise<{ no: string }>;
}) {
  const { no } = await params;
  const rfq = findRfq(decodeURIComponent(no));
  if (!rfq) notFound();
  return <RfqComparison rfq={rfq} />;
}
