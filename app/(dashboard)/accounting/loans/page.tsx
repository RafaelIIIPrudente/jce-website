import type { Metadata } from "next";

import { PayrollSubNav } from "../acc-sub-nav";
import { LoansLedger } from "./loans-ledger";

export const metadata: Metadata = { title: "Loans" };

// A3 · Loans.
export default function LoansPage() {
  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PayrollSubNav />
      <LoansLedger />
    </div>
  );
}
