import type { Metadata } from "next";

import { WarehouseAudit } from "./audit-view";

export const metadata: Metadata = { title: "Warehouse audit" };

export default function WarehouseAuditPage() {
  return <WarehouseAudit />;
}
