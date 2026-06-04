import type { Metadata } from "next";

import { StockLedger } from "./ledger";

export const metadata: Metadata = { title: "Stock ledger" };

export default function StockLedgerPage() {
  return <StockLedger />;
}
