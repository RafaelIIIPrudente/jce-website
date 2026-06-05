"use client";

import { useState } from "react";
import { ChevronLeftIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import {
  BATCH_TONE,
  getBatches,
  getTimeRows,
  projLabel,
  reopenBatch,
  rowDistribution,
  verifyBatch,
  type Batch,
} from "@/lib/mock/hr";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";
import { LockGateBanner } from "@/components/jce/lock-gate-banner";

// H6 · Verification batches (hr-time.jsx:300). End-of-period review → correct →
// verify → LOCK → hand off to payroll (Part 5). Mark Verified locks the batch
// (lock-gate-banner). Re-open requires a reason (audited to H14). The verified
// state is written to the lib/mock/hr BATCHES store so Accounting can read it and
// the H5 grid locks. canVerify = timekeeper || owner (verbs ABSENT otherwise).

const VERIFIED_AT = "2026-06-03 10:15";

function statusLabel(b: Batch): string {
  return b.status === "Verified" ? "Verified · Locked" : b.status;
}

export function BatchesView() {
  const { role } = useJce();
  const canVerify = role === "timekeeper" || role === "owner";

  const [batches, setBatches] = useState<Batch[]>(() => [...getBatches()]);
  const [selId, setSelId] = useState<number | null>(null);
  const [reopenOpen, setReopenOpen] = useState(false);
  const [reason, setReason] = useState("");

  const sel = batches.find((b) => b.id === selId) ?? null;

  const sync = () => setBatches([...getBatches()]);

  const markVerified = (b: Batch) => {
    verifyBatch(b.id, "R. Timekeeper", VERIFIED_AT);
    sync();
    toast.success(`${b.no} verified & locked — handed off to payroll.`);
  };

  const doReopen = (b: Batch) => {
    if (!reason.trim()) return;
    reopenBatch(b.id, reason.trim());
    sync();
    setReopenOpen(false);
    setReason("");
    toast.success(`${b.no} re-opened — reason recorded to the HR audit log.`);
  };

  // ---- Detail ----
  if (sel) {
    const verified = sel.status === "Verified";
    const tr = getTimeRows();
    return (
      <div className="mx-auto flex w-full max-w-app flex-col gap-5">
        <button
          type="button"
          onClick={() => setSelId(null)}
          className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
        >
          <ChevronLeftIcon className="size-4" aria-hidden /> Verification
          batches
        </button>

        <PageHeader
          kicker="HR · H6 · Batch detail"
          title={
            <span className="flex flex-wrap items-center gap-2">
              {sel.emp} <DocChip code={sel.no} />
            </span>
          }
          actions={
            <>
              <Chip tone={BATCH_TONE[sel.status] ?? "neutral"}>
                {statusLabel(sel)}
              </Chip>
              {canVerify && !verified ? (
                <Button size="sm" onClick={() => markVerified(sel)}>
                  Mark as Verified
                </Button>
              ) : null}
              {canVerify && verified ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReopenOpen(true)}
                >
                  Re-open…
                </Button>
              ) : null}
            </>
          }
        />

        <div className="solid grid grid-cols-2 gap-4 rounded-(--r-solid) p-4 sm:grid-cols-4">
          {[
            ["Pay Period Type", sel.period],
            ["Range", sel.range],
            ["Rows", String(sel.rows)],
            [
              "Verifier",
              sel.verifier === "—"
                ? "—"
                : `${sel.verifier}${sel.at !== "—" ? ` · ${sel.at}` : ""}`,
            ],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="kicker text-jce-green-600">{k}</div>
              <div className="mt-1 text-ui-13 text-jce-ink">{v}</div>
            </div>
          ))}
        </div>

        <LockGateBanner
          state={verified ? "locked" : "check"}
          title={
            verified
              ? "Verified & locked"
              : "Open — edit-in-place before verification"
          }
          detail={
            verified
              ? "Read-through only. Re-open (with reason) to correct — audited."
              : "Correct rows, then Mark as Verified to lock and hand off to payroll."
          }
        />

        <div className="solid overflow-auto rounded-(--r-solid) p-0">
          <table className="jtable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day Type</th>
                <th>Project</th>
                <th className="text-right">In</th>
                <th className="text-right">Out</th>
                <th className="text-right">Reg</th>
                <th className="text-right">OT</th>
                <th className="text-right">ND</th>
                <th className="text-right">Abs/UT</th>
                <th>Leave</th>
              </tr>
            </thead>
            <tbody>
              {tr.map((r) => {
                const d = rowDistribution(r, tr);
                return (
                  <tr key={r.id}>
                    <td className="whitespace-nowrap">
                      <strong>{r.day}</strong>{" "}
                      <span className="font-mono text-jce-ink-2">
                        {r.date.slice(8)}
                      </span>
                    </td>
                    <td>{r.dayType}</td>
                    <td>
                      {r.proj === "—" ? (
                        <span className="text-jce-ink-2">—</span>
                      ) : (
                        <DocChip code={projLabel(r.proj)} />
                      )}
                    </td>
                    <td className="num font-mono">{r.in}</td>
                    <td className="num font-mono">{r.out}</td>
                    <td className="num">{d.reg.toFixed(1)}</td>
                    <td className="num">{d.ot.toFixed(1)}</td>
                    <td className="num">{d.nd.toFixed(1)}</td>
                    <td className="num">
                      {d.abs > 0 ? d.abs.toFixed(1) : "—"}
                    </td>
                    <td>
                      {r.leave ? (
                        <Chip tone="success">{r.leave}</Chip>
                      ) : (
                        <span className="text-jce-ink-2">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Dialog open={reopenOpen} onOpenChange={setReopenOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Re-open verified batch?</DialogTitle>
              <DialogDescription>
                Re-opening requires a reason and is recorded in the HR audit log
                (H14). Downstream payroll must re-consume the corrected batch.
              </DialogDescription>
            </DialogHeader>
            <label className="text-ui-12 font-semibold text-jce-ink-2">
              Reason (required)
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. corrected OT on May 27"
                className="field mt-1.5"
                autoFocus
              />
            </label>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setReopenOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => doReopen(sel)} disabled={!reason.trim()}>
                Re-open &amp; audit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ---- List ----
  const columns: LedgerColumn<Batch>[] = [
    {
      id: "emp",
      header: "Employee",
      cell: (b) => (
        <div>
          <div className="font-semibold text-jce-ink">{b.emp}</div>
          <div className="font-mono text-ui-12 text-jce-ink-2">{b.no}</div>
        </div>
      ),
    },
    { id: "period", header: "Pay Period Type", cell: (b) => b.period },
    {
      id: "range",
      header: "Period range",
      cell: (b) => <span className="font-mono text-ui-12">{b.range}</span>,
    },
    {
      id: "rows",
      header: "Rows",
      align: "right",
      cell: (b) => <span className="tabular-nums">{b.rows}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (b) => (
        <Chip tone={BATCH_TONE[b.status] ?? "neutral"}>{statusLabel(b)}</Chip>
      ),
    },
    {
      id: "verifier",
      header: "Verifier",
      cell: (b) => <span className="text-jce-ink-2">{b.verifier}</span>,
    },
    {
      id: "at",
      header: "Verified at",
      cell: (b) => (
        <span className="font-mono text-ui-12 text-jce-ink-2">{b.at}</span>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="HR · H6 · Timekeeping"
        title="Verification batches"
        description="End-of-period review → correct → verify → lock → hand off to payroll."
      />
      <LedgerGrid
        columns={columns}
        rows={batches}
        getRowKey={(b) => b.id}
        onRowClick={(b) => setSelId(b.id)}
      />
    </div>
  );
}
