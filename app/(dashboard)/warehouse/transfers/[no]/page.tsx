import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findTransfer } from "@/lib/mock/warehouse";
import { TransferForm } from "./transfer-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ no: string }>;
}): Promise<Metadata> {
  const { no } = await params;
  return { title: `Transfer ${decodeURIComponent(no)}` };
}

export default async function TransferDetailPage({
  params,
}: {
  params: Promise<{ no: string }>;
}) {
  const { no } = await params;
  const trf = findTransfer(decodeURIComponent(no));
  if (!trf) notFound();
  return <TransferForm trf={trf} />;
}
