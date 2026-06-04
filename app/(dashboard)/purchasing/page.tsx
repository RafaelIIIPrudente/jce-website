import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/jce/module-placeholder";

export const metadata: Metadata = { title: "Purchasing" };

export default function PurchasingPage() {
  return (
    <ModulePlaceholder
      kicker="Module · Purchasing"
      title="Purchasing"
      part="Part 7"
      icon="pur"
    />
  );
}
