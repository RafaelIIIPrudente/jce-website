import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/jce/module-placeholder";

export const metadata: Metadata = { title: "Warehouse" };

export default function WarehousePage() {
  return (
    <ModulePlaceholder
      kicker="Module · Warehouse"
      title="Warehouse"
      part="Part 8"
      icon="wh"
    />
  );
}
