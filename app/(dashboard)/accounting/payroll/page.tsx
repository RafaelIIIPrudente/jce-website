import type { Metadata } from "next";

import { PayrollSubNav } from "../acc-sub-nav";
import { PayrollSummary } from "./payroll-summary";

export const metadata: Metadata = { title: "Payroll Summary" };

// A4 · Payroll Summary list (Payroll sub-module landing).
export default function PayrollPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PayrollSubNav />
      <PayrollSummary />
    </div>
  );
}
