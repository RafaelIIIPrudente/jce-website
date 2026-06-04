import type { Metadata } from "next";

import { SupplierMerge } from "./merge";

export const metadata: Metadata = { title: "Supplier merge" };

export default function MergePage() {
  return <SupplierMerge />;
}
