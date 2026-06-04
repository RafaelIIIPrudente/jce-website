import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findRfp } from "@/lib/mock/purchasing";
import { RfpForm } from "../rfp-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ no: string }>;
}): Promise<Metadata> {
  const { no } = await params;
  return { title: `RFP ${decodeURIComponent(no)}` };
}

export default async function RfpDetailPage({
  params,
}: {
  params: Promise<{ no: string }>;
}) {
  const { no } = await params;
  const rfp = findRfp(decodeURIComponent(no));
  if (!rfp) notFound();
  return <RfpForm rfp={rfp} />;
}
