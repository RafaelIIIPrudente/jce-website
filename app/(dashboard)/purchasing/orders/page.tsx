import type { Metadata } from "next";

import { PoLedger } from "./ledger";

export const metadata: Metadata = { title: "PO ledger" };

export default function PoLedgerPage() {
  return <PoLedger />;
}
