import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findPo } from "@/lib/mock/purchasing";
import { NewOrder } from "../../new/new-order";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ no: string }>;
}): Promise<Metadata> {
  const { no } = await params;
  return { title: `Edit PO ${decodeURIComponent(no)}` };
}

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ no: string }>;
}) {
  const { no } = await params;
  const po = findPo(decodeURIComponent(no));
  if (!po) notFound();
  return <NewOrder po={po} editing />;
}
