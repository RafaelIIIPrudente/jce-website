import type { ReactNode } from "react";

import { WarehouseSubNav } from "./warehouse-sub-nav";

// Warehouse section shell — the Dashboard / Stock Ledger / Item Master / MRR /
// Release / Transfer / Movements / MR Verification / Phase 2 / Audit sub-nav
// over W1–W13. Module visibility is gated in the sidebar (wh grant: owner/
// warehouse full; siteeng edit; admin/pmhead/purchsup read; hidden otherwise)
// and the sub-nav re-checks the grant.
export default function WarehouseLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto mb-5 w-full max-w-6xl">
        <WarehouseSubNav />
      </div>
      {children}
    </>
  );
}
