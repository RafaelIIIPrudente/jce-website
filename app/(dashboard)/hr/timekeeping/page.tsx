import type { Metadata } from "next";

import { TimekeepingGrid } from "./timekeeping-grid";

export const metadata: Metadata = { title: "Timekeeping" };

// H5 · Weekly timekeeping entry grid (flagship).
export default function TimekeepingPage() {
  return <TimekeepingGrid />;
}
