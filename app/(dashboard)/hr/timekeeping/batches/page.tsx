import type { Metadata } from "next";

import { BatchesView } from "./batches-view";

export const metadata: Metadata = { title: "Verification batches" };

// H6 · Timekeeping verification batches.
export default function BatchesPage() {
  return <BatchesView />;
}
