import type { Metadata } from "next";

import { SiteDaySheet } from "./site-day-sheet";

export const metadata: Metadata = { title: "Timekeeping" };

// H5b · Site Day Sheet — the per-site, exception-first attendance board.
export default function SiteDayPage() {
  return <SiteDaySheet />;
}
