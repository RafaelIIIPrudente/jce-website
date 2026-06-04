import type { Metadata } from "next";

import { BddAudit } from "./bdd-audit";

export const metadata: Metadata = { title: "Audit log" };

// B11 · BDD audit log.
export default function BddAuditPage() {
  return <BddAudit />;
}
