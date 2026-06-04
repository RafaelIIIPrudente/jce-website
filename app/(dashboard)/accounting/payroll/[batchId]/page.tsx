import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBatch } from "@/lib/mock/accounting";
import { PayrollWorkspace } from "./payroll-workspace";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ batchId: string }>;
}): Promise<Metadata> {
  const { batchId } = await params;
  const batch = getBatch(batchId);
  return { title: batch ? `Payroll ${batch.id}` : "Payroll batch" };
}

// A5 · Payroll batch workspace (flagship).
export default async function PayrollBatchPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  const batch = getBatch(batchId);
  if (!batch) notFound();
  return <PayrollWorkspace batch={batch} />;
}
