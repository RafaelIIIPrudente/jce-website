import type { ReactNode } from "react";

import { Phase2SubNav } from "../pmg-sub-nav";

// PMG Phase 2 shell — Photos / Templates / S-curve / Traceability / Doc Pack /
// Budget (P14–P19).
export default function Phase2Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <Phase2SubNav />
      {children}
    </div>
  );
}
