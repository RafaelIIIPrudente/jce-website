import type { Metadata } from "next";

import { BillingView } from "./billing-view";

export const metadata: Metadata = { title: "Billing" };

// P9 · Progress billing & ledgers.
export default function BillingPage() {
  return <BillingView />;
}
