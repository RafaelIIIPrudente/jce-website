import type { Metadata } from "next";

import { QuotationsList } from "./quotations-list";

export const metadata: Metadata = { title: "Quotations" };

// B5 · Quotations list.
export default function QuotationsPage() {
  return <QuotationsList />;
}
