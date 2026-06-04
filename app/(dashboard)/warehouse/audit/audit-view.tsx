"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";

import { WH_AUDIT } from "@/lib/mock/warehouse";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";

// W9 · Warehouse audit log (wh-core.jsx:602) — append-only. Every Lock/Unlock,
// item edit, movement, reservation, MR verification, off-BOQ add/promote. The
// Lock action chip uses the locked tone.
export function WarehouseAudit() {
  const [q, setQ] = useState("");
  const rows = useMemo(
    () =>
      WH_AUDIT.filter(
        (a) =>
          q === "" ||
          (a.actor + a.entity + a.action + a.delta)
            .toLowerCase()
            .includes(q.toLowerCase()),
      ),
    [q],
  );

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
    link.download = "warehouse-audit.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        kicker="Warehouse · W9"
        title="Warehouse audit log"
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

      {rows.length === 0 ? (
        <EmptyState
          icon={<SearchIcon className="size-6" aria-hidden />}
          title="No audit entries match"
          description="Clear the filter to see the full append-only log."
        />
      ) : (
        <div className="solid overflow-auto rounded-(--r-solid) p-0">
          <table className="jtable">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Entity</th>
                <th>Action</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a, i) => (
                <tr key={i}>
                  <td className="mono text-ui-12">{a.ts}</td>
                  <td>{a.actor}</td>
                  <td>
                    <DocChip code={a.entity} />
                  </td>
                  <td>
                    <Chip tone={a.action === "Lock" ? "locked" : "neutral"}>
                      {a.action}
                    </Chip>
                  </td>
                  <td>{a.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-ui-12 text-jce-ink-2">
        Every Lock and Unlock is audited, plus item edits, movements,
        reservations, MR verification, and off-BOQ add / promote-to-plan.
      </p>
    </div>
  );
}
