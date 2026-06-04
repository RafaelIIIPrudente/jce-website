import type { Metadata } from "next";

import { PayrollSubNav } from "../acc-sub-nav";
import { Payslips } from "./payslips";

export const metadata: Metadata = { title: "Payslips" };

// A6 · Payslips.
export default function PayslipsPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PayrollSubNav />
      <Payslips />
    </div>
  );
}
