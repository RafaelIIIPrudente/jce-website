import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/jce/module-placeholder";

export const metadata: Metadata = { title: "BDD" };

export default function BddPage() {
  return (
    <ModulePlaceholder
      kicker="Module · BDD"
      title="Business Development"
      part="Part 3"
      icon="bdd"
    />
  );
}
