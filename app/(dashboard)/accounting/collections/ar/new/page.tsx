import type { Metadata } from "next";

import { IssueReceipt } from "../../issue-receipt";

export const metadata: Metadata = { title: "Issue Acknowledgement Receipt" };

// A12 · Issue Acknowledgement Receipt.
export default function IssueArPage() {
  return <IssueReceipt type="AR" />;
}
