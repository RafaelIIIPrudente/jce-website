import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/jce/module-placeholder";

export const metadata: Metadata = { title: "Project Management" };

export default function PmgPage() {
  return (
    <ModulePlaceholder
      kicker="Module · PMG"
      title="Project Management"
      part="Part 6"
      icon="pmg"
    />
  );
}
