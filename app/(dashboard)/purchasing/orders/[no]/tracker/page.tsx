import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findPo } from "@/lib/mock/purchasing";
import { Tracker } from "./tracker";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ no: string }>;
}): Promise<Metadata> {
  const { no } = await params;
  return { title: `Tracker ${decodeURIComponent(no)}` };
}

export default async function TrackerPage({
  params,
}: {
  params: Promise<{ no: string }>;
}) {
  const { no } = await params;
  const po = findPo(decodeURIComponent(no));
  if (!po) notFound();
  return <Tracker po={po} />;
}
