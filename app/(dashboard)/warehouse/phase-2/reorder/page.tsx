import type { Metadata } from "next";

import { Reorder } from "./reorder";

export const metadata: Metadata = { title: "Reorder rules" };

export default function ReorderPage() {
  return <Reorder />;
}
