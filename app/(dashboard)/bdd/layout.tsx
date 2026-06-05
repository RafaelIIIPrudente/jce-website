import type { ReactNode } from "react";

import { BddSubNav } from "./bdd-sub-nav";

// BDD section shell — the Sales Orders / Offers / Quotations / Website /
// Inquiries / Audit sub-nav over the B1–B11 screens. Module visibility is gated
// in the sidebar (bdd grant: owner/bddlead full, admin/timekeeper read); the
// screens render read-only for read-grant roles.
export default function BddLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto mb-5 w-full max-w-app">
        <BddSubNav />
      </div>
      {children}
    </>
  );
}
