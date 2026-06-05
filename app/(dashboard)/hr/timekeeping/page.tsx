import type { Metadata } from "next";

import { TimekeepingTabs } from "./timekeeping-tabs";

export const metadata: Metadata = { title: "Timekeeping" };

// H5 · Timekeeping — "By site" (H5b Site Day Sheet, default) | "By employee"
// (the original weekly grid). Both surfaces edit the same per-employee rows.
export default function TimekeepingPage() {
  return <TimekeepingTabs />;
}
