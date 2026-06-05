import type { ReactNode } from "react";

import { HrSubNav } from "./hr-sub-nav";

// HR section shell — the Employees / Timekeeping / HR Requests / Self-Service /
// Audit sub-nav over the H1–H14 screens. Module visibility is gated in the
// sidebar (hr grant: owner/hrhead/timekeeper, read-only for admin/payroll;
// hidden otherwise). Read-grant roles render the screens as static text.
export default function HrLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto mb-5 w-full max-w-app">
        <HrSubNav />
      </div>
      {children}
    </>
  );
}
