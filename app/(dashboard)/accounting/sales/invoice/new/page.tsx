import type { Metadata } from "next";

import { IssueInvoice } from "./issue-invoice";

export const metadata: Metadata = { title: "Issue Service Invoice" };

// A8 · Issue Service Invoice (flagship).
export default function IssueInvoicePage() {
  return <IssueInvoice />;
}
