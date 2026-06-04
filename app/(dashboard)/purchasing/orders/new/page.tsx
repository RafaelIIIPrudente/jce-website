import type { Metadata } from "next";

import { NewOrder } from "./new-order";

export const metadata: Metadata = { title: "Create PO" };

export default function NewOrderPage() {
  return <NewOrder />;
}
