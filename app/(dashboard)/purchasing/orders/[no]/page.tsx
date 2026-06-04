import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findPo } from "@/lib/mock/purchasing";
import { OrderDetail } from "./order-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ no: string }>;
}): Promise<Metadata> {
  const { no } = await params;
  return { title: `PO ${decodeURIComponent(no)}` };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ no: string }>;
}) {
  const { no } = await params;
  const po = findPo(decodeURIComponent(no));
  if (!po) notFound();
  return <OrderDetail po={po} />;
}
