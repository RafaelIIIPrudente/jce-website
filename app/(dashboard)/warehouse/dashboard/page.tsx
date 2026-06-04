import type { Metadata } from "next";

import { WarehouseDashboard } from "./dashboard";

export const metadata: Metadata = { title: "Warehouse" };

export default function WarehouseDashboardPage() {
  return <WarehouseDashboard />;
}
