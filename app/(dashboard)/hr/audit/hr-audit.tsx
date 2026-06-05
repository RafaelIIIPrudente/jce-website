"use client";

import { useState } from "react";
import { toast } from "sonner";

import { HR_AUDIT } from "@/lib/mock/hr";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { AuditLog, type AuditEntry } from "@/components/jce/audit-log";

// H14 · HR audit log (hr-requests.jsx:750). Append-only, read-only — actor / time
// / entity / before → after. Filtered by action.
const ARROW = "→";

function toEntry(a: (typeof HR_AUDIT)[number]): AuditEntry {
  const i = a.delta.indexOf(ARROW);
  const before = i >= 0 ? a.delta.slice(0, i).trim() : undefined;
  const after = i >= 0 ? a.delta.slice(i + ARROW.length).trim() : a.delta;
  return {
    ts: a.ts,
    actor: a.actor,
    record: a.rec,
    action: a.action,
    before,
    after,
  };
}

export function HrAudit() {
  const [action, setAction] = useState<string>("All");
  const actions = [
    "All",
    ...Array.from(new Set(HR_AUDIT.map((a) => a.action))),
  ];
  const entries = HR_AUDIT.filter(
    (a) => action === "All" || a.action === action,
  ).map(toEntry);

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="HR · H14"
        title="HR audit log"
        description="Append-only · entries immutable · read-only."
        actions={
          <>
            <select
              className="field h-9 w-auto"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              aria-label="Filter by action"
            >
              {actions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.success("Audit log exported (mock).")}
            >
              Export
            </Button>
          </>
        }
      />
      <AuditLog entries={entries} />
    </div>
  );
}
