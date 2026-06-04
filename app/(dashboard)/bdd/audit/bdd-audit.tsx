"use client";

import { useState } from "react";

import { BDD_AUDIT, BDD_AUDIT_AREAS, type BddAuditEntry } from "@/lib/mock/bdd";
import { PageHeader } from "@/components/jce/page-header";
import { Segmented } from "@/components/jce/segmented";
import { AuditLog, type AuditEntry } from "@/components/jce/audit-log";

// B11 · BDD audit log (bdd-core.jsx, brief:1098-1104). Append-only, read-only,
// area-filtered actor / time / entity / old → new (jce/audit-log).

function toAuditEntry(a: BddAuditEntry): AuditEntry {
  let before: string | undefined;
  let after: string;
  if (a.delta.includes("→")) {
    const [b, ...rest] = a.delta.split("→");
    before = (b ?? "").trim() || undefined;
    after = rest.join("→").trim();
  } else {
    before = a.field;
    after = a.delta;
  }
  return {
    ts: a.ts,
    actor: a.user,
    record: a.rec,
    action: `${a.area} · ${a.action}`,
    before,
    after,
  };
}

export function BddAudit() {
  const [area, setArea] = useState<string>("All");
  const entries: AuditEntry[] = BDD_AUDIT.filter(
    (a) => area === "All" || a.area === area,
  ).map(toAuditEntry);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="BDD · B11"
        title="Audit log"
        description="Append-only, read-only — every action across the BDD module, oldest changes preserved."
      />
      <Segmented
        aria-label="Filter by area"
        options={BDD_AUDIT_AREAS.map((a) => ({ value: a, label: a }))}
        value={area}
        onValueChange={setArea}
      />
      <AuditLog entries={entries} className="max-h-[calc(100dvh-18rem)]" />
    </div>
  );
}
