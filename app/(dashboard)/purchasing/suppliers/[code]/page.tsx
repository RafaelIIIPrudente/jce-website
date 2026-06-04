import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findSupplier } from "@/lib/mock/purchasing";
import { SupplierRecord } from "./supplier-record";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const s = findSupplier(decodeURIComponent(code));
  return { title: s ? s.name : "Supplier" };
}

export default async function SupplierPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supplier = findSupplier(decodeURIComponent(code));
  if (!supplier) notFound();
  return <SupplierRecord supplier={supplier} />;
}
