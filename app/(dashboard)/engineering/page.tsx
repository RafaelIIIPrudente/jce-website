import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/jce/module-placeholder";

export const metadata: Metadata = { title: "Engineering" };

export default function EngineeringPage() {
  return (
    <ModulePlaceholder
      kicker="Module · Engineering"
      title="Engineering"
      part="Part 3 (E1 stub)"
      icon="eng"
    />
  );
}
