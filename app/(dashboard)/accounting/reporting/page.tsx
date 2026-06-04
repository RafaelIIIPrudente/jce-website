import type { Metadata } from "next";

import { Reporting } from "./reporting";

export const metadata: Metadata = { title: "Reporting hub" };

// A18 · Reporting hub (flagship).
export default function ReportingPage() {
  return <Reporting />;
}
