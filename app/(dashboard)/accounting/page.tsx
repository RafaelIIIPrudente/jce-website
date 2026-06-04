import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/jce/module-placeholder";

export const metadata: Metadata = { title: "Accounting" };

export default function AccountingPage() {
  return (
    <ModulePlaceholder
      kicker="Module · Accounting"
      title="Accounting"
      part="Part 5"
      icon="acc"
    />
  );
}
