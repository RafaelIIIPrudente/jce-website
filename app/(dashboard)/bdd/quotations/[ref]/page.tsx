import type { Metadata } from "next";

import { QUOTATIONS } from "@/lib/mock/bdd";
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

// B6 · Quotation comparison. The detail resolves the request + its logged supplier
// quotes from the shared in-session store on the client (so requests created this
// session are reachable without a 404); a genuinely-absent ref renders an empty
// state there.
export default async function QuotationPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  return <QuotationDetail quotationRef={ref} />;
}
