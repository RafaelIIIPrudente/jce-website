import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getVoucher } from "@/lib/mock/accounting";
import { VoucherForm } from "./voucher-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cv: string }>;
}): Promise<Metadata> {
  const { cv } = await params;
  const voucher = getVoucher(cv);
  return { title: voucher ? voucher.cv : "Voucher" };
}

// A14 · Bank Payment Voucher form.
export default async function VoucherPage({
  params,
}: {
  params: Promise<{ cv: string }>;
}) {
  const { cv } = await params;
  const voucher = getVoucher(cv);
  if (!voucher) notFound();
  return <VoucherForm voucher={voucher} />;
}
