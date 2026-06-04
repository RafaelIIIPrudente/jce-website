import type { Metadata } from "next";

import { InquiriesInbox } from "./inquiries-inbox";

export const metadata: Metadata = { title: "Inquiries" };

// B10 · Inquiries inbox.
export default function InquiriesPage() {
  return <InquiriesInbox />;
}
