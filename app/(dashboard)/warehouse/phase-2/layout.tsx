import type { ReactNode } from "react";

import { WarehousePhase2SubNav } from "../warehouse-sub-nav";

// Phase-2 secondary rail (W10–W13).
export default function WarehousePhase2Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="mx-auto mb-4 w-full max-w-app">
        <WarehousePhase2SubNav />
      </div>
      {children}
    </>
  );
}
