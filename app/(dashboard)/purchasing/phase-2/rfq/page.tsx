import type { Metadata } from "next";

import { RfqList } from "./rfq-list";

export const metadata: Metadata = { title: "RFQ" };

export default function RfqPage() {
  return <RfqList />;
}
