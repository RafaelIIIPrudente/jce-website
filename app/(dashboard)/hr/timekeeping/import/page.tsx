import type { Metadata } from "next";

import { ImportView } from "./import-view";

export const metadata: Metadata = { title: "Import timekeeping" };

// H5b · Excel bulk-import wizard (multi-site, one row = one TimeRow). Thin server
// shell — SheetJS + parsing live in the client view, dynamic-imported.
export default function ImportTimekeepingPage() {
  return <ImportView />;
}
