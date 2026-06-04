import type { Metadata } from "next";

import { Bins } from "./bins";

export const metadata: Metadata = { title: "Bins & barcodes" };

export default function BinsPage() {
  return <Bins />;
}
