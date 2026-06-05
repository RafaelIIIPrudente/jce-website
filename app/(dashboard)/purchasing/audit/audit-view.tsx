"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";

import { PUR_AUDIT } from "@/lib/mock/purchasing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { AuditLog, type AuditEntry } from "@/components/jce/audit-log";
import { EmptyState } from "@/components/jce/empty-state";

// U13 · Purchasing audit log (pur-core.jsx:1180) — append-only, filterable,
// exportable.
export function AuditView() {
  const [q, setQ] = useState("");

  const rows = useMemo(
    () =>
      PUR_AUDIT.filter(
        (a) =>
          q === "" ||
          (a.actor + a.entity + a.action + a.delta)
            .toLowerCase()
            .includes(q.toLowerCase()),
      ),
    [q],
  );

  const entries: AuditEntry[] = rows.map((a) => ({
    ts: a.ts,
    actor: a.actor,
    record: a.entity,
    action: a.action,
    after: a.delta,
  }));

  const exportCsv = () => {
    const head = ["Timestamp", "Actor", "Entity", "Action", "Detail"];
    const csv = [
      head,
      ...rows.map((a) => [a.ts, a.actor, a.entity, a.action, a.delta]),
    ]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "purchasing-audit.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-4">
      <PageHeader
        kicker="Purchasing · U13"
        title="Purchasing audit log"
        actions={
          <>
            <label className="flex items-center gap-2 rounded-(--r-input) border border-jce-line bg-(--solid-surface) px-2.5 py-1.5">
              <SearchIcon
                className="size-4 shrink-0 text-jce-ink-2"
                aria-hidden
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter actor, entity, action…"
                className="w-48 bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
                aria-label="Filter audit log"
              />
            </label>
            <Button variant="ghost" size="sm" onClick={exportCsv}>
              Export
            </Button>
          </>
        }
      />

      {entries.length === 0 ? (
        <EmptyState
          icon={<SearchIcon className="size-6" aria-hidden />}
          title="No audit entries match"
          description="Clear the filter to see the full append-only log."
        />
      ) : (
        <AuditLog entries={entries} />
      )}
    </div>
  );
}
