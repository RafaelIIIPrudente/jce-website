import type { Metadata } from "next";

import { JournalSubNav } from "../../acc-sub-nav";
import { CashAdvances } from "./cash-advances";

export const metadata: Metadata = { title: "Cash Advances" };

// A17 · Cash Advance ledger.
export default function CashAdvancesPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <JournalSubNav />
      <CashAdvances />
    </div>
  );
}
