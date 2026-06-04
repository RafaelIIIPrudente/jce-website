import type { Metadata } from "next";

import { IssueReceipt } from "../../issue-receipt";

export const metadata: Metadata = { title: "Issue Collection Receipt" };

// A11 · Issue Collection Receipt.
export default function IssueCrPage() {
  return <IssueReceipt type="CR" />;
}
