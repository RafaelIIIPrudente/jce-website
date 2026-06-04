import type { Metadata } from "next";

import { VariationsView } from "./variations-view";

export const metadata: Metadata = { title: "Variation Orders" };

// P7 · Variation Orders.
export default function VariationsPage() {
  return <VariationsView />;
}
