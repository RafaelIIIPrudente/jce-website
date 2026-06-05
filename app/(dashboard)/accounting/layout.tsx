import type { ReactNode } from "react";

import { AccSubNav } from "./acc-sub-nav";

// Accounting section shell — the Payroll / Sales / Collections / Payable Voucher
// / Disbursement / Journal / Reporting / Clients sub-nav over A1–A19. Module
// visibility is gated in the sidebar (acc grant: owner/acctglead full, payroll
// edit, admin read; hidden otherwise). Read-grant roles render screens as static
// text; per-employee compensation is masked unless Payroll/Owner.
export default function AccountingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="mx-auto mb-5 w-full max-w-app">
        <AccSubNav />
      </div>
      {children}
    </>
  );
}
