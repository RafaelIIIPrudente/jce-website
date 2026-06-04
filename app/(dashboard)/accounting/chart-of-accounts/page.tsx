import type { Metadata } from "next";

import { PayrollSubNav } from "../acc-sub-nav";
import { ChartOfAccounts } from "./chart-of-accounts";

export const metadata: Metadata = { title: "Chart of Accounts" };

// A2 · Chart of Accounts.
export default function ChartOfAccountsPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PayrollSubNav />
      <ChartOfAccounts />
    </div>
  );
}
