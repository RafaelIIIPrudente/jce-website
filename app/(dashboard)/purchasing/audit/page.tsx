import type { Metadata } from "next";

import { AuditView } from "./audit-view";

export const metadata: Metadata = { title: "Purchasing audit" };

export default function PurchasingAuditPage() {
  return <AuditView />;
}
