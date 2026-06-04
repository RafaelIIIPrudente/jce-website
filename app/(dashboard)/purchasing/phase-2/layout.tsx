import type { ReactNode } from "react";

import { PurchasingPhase2SubNav } from "../purchasing-sub-nav";

// Phase-2 secondary rail (U14–U24).
export default function PurchasingPhase2Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="mx-auto mb-4 w-full max-w-6xl">
        <PurchasingPhase2SubNav />
      </div>
      {children}
    </>
  );
}
