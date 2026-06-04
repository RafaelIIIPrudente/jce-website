import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QUOTATIONS, SUPPLIER_QUOTES } from "@/lib/mock/bdd";
import { QuotationDetail } from "./quotation-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ref: string }>;
}): Promise<Metadata> {
  const { ref } = await params;
  const q = QUOTATIONS.find((x) => x.ref === ref);
  return { title: q ? q.ref : "Quotation" };
}

// B6 · Quotation comparison.
export default async function QuotationPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const quotation = QUOTATIONS.find((x) => x.ref === ref);
  if (!quotation) notFound();
  const seedQuotes = SUPPLIER_QUOTES[ref] ?? [];
  return <QuotationDetail quotation={quotation} seedQuotes={seedQuotes} />;
}
