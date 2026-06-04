import type { Metadata } from "next";

import { HrAudit } from "./hr-audit";

export const metadata: Metadata = { title: "HR audit log" };

// H14 · HR audit log.
export default function HrAuditPage() {
  return <HrAudit />;
}
