"use client";

import { useState } from "react";

import { useJce } from "@/lib/mock/role-context";
import {
  REQUESTS,
  REQUEST_TYPES,
  REQ_STATUS_FILTERS,
  REQ_TONE,
  type RequestRecord,
  type RequestTypeLabel,
} from "@/lib/mock/hr";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";
import { Segmented } from "@/components/jce/segmented";
import { RequestForm } from "./request-form";

// H7 · HR requests register (hr-requests.jsx:48). 4 form-type tabs; rows open the
// per-type form (H8–H11) inline. "+ New record" is present only for hrhead/owner.
export function RequestsRegister() {
  const { role } = useJce();
  const canManage = role === "hrhead" || role === "owner";

  const [type, setType] = useState<RequestTypeLabel>("OB/Travel");
  const [status, setStatus] = useState<string>("All");
  const [detail, setDetail] = useState<RequestRecord | null>(null);
  const [creating, setCreating] = useState(false);

  if (creating)
    return <RequestForm type={type} onBack={() => setCreating(false)} />;
  if (detail)
    return (
      <RequestForm type={type} record={detail} onBack={() => setDetail(null)} />
    );

  const rows = REQUESTS[type].filter(
    (r) => status === "All" || r.status === status,
  );

  const columns: LedgerColumn<RequestRecord>[] = [
    { id: "no", header: "Form number", cell: (r) => <DocChip code={r.no} /> },
    {
      id: "filed",
      header: "Date filed",
      cell: (r) => <span className="font-mono text-ui-12">{r.filed}</span>,
    },
    {
      id: "emp",
      header: "Employee(s)",
      cell: (r) => <span className="font-medium text-jce-ink">{r.emp}</span>,
    },
    {
      id: "key",
      header: "Key fields",
      cell: (r) => <span className="text-jce-ink-2">{r.key}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (r) => (
        <Chip tone={REQ_TONE[r.status] ?? "neutral"}>{r.status}</Chip>
      ),
    },
    {
      id: "scan",
      header: "Scan",
      cell: (r) =>
        r.scan ? (
          <Chip tone="success">✓ attached</Chip>
        ) : (
          <Chip tone="pending">required</Chip>
        ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="HR · H7 · HR Requests"
        title="HR Requests register"
        description="Digital intake precedes offline wet signatures. A scanned signed copy is required to reach Approved / Recorded."
        actions={
          <>
            <select
              className="field h-9 w-auto"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter by status"
            >
              {REQ_STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {canManage ? (
              <Button size="sm" onClick={() => setCreating(true)}>
                + New record
              </Button>
            ) : null}
          </>
        }
      />

      <Segmented
        aria-label="Request type"
        value={type}
        onValueChange={(v) => setType(v as RequestTypeLabel)}
        options={REQUEST_TYPES.map((t) => ({ value: t.label, label: t.label }))}
      />

      {rows.length === 0 ? (
        <div className="glass rounded-(--r-glass) px-6 py-10 text-center">
          <div className="text-ui-14 font-semibold text-jce-ink">
            No {type} records
          </div>
          <div className="mt-1 text-ui-12 text-jce-ink-2">
            Pending intake appears here before signatures complete.
          </div>
        </div>
      ) : (
        <LedgerGrid
          columns={columns}
          rows={rows}
          getRowKey={(r) => r.no}
          onRowClick={(r) => setDetail(r)}
        />
      )}
    </div>
  );
}
