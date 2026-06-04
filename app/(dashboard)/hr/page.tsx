import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/jce/module-placeholder";

export const metadata: Metadata = { title: "HR" };

export default function HrPage() {
  return (
    <ModulePlaceholder
      kicker="Module · HR"
      title="HR"
      part="Part 4"
      icon="hr"
    />
  );
}
