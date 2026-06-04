import type { Metadata } from "next";

import { Disbursement } from "./disbursement";

export const metadata: Metadata = { title: "Disbursement" };

// A15 · Disbursement.
export default function DisbursementPage() {
  return <Disbursement />;
}
