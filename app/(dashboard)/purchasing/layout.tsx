import type { ReactNode } from "react";

import { PurchasingSubNav } from "./purchasing-sub-nav";

// Purchasing section shell — the Dashboard / PO Ledger / RFP / Suppliers /
// Requisitions / Approvals / Phase 2 / Audit sub-nav over U1–U24. Module
// visibility is gated in the sidebar (pur grant: owner/purchsup full;
// admin/acctglead/pmhead/warehouse read; hidden otherwise) and the sub-nav
// re-checks the grant. Read-grant roles render screens as static text with
// workflow verbs absent.
export default function PurchasingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="mx-auto mb-5 w-full max-w-app">
        <PurchasingSubNav />
      </div>
      {children}
    </>
  );
}
