import type { ReactNode } from "react";

import { PmgSubNav } from "./pmg-sub-nav";

// PMG section shell — the Dashboard / Portfolio / Material Requests / Phase 2 /
// Audit sub-nav over P1–P19. Module visibility is gated in the sidebar
// (pmg grant: owner/pmhead full; admin/timekeeper/purchsup/warehouse/siteeng
// read; hidden otherwise). Read-grant roles render screens as static text; the
// portfolio is site-scoped for Site Engineers.
export default function PmgLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto mb-5 w-full max-w-app">
        <PmgSubNav />
      </div>
      {children}
    </>
  );
}
