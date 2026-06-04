import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/jce/module-placeholder";

export const metadata: Metadata = { title: "My HR" };

export default function MyHrPage() {
  return (
    <ModulePlaceholder
      kicker="Self-service · H12"
      title="My HR"
      part="Part 4"
      icon="self"
    />
  );
}
