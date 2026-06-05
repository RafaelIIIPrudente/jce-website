"use client";

import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  SearchIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import {
  BATCH_TONE,
  getBatches,
  getTimeRowsForEmployee,
  projLabel,
  reopenBatch,
  rowDistribution,
  verifyBatch,
  weekTotals,
  type Batch,
  type BatchStatus,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/jce/page-header";
import { KpiTile } from "@/components/jce/kpi-tile";
import { MetricCard } from "@/components/jce/metric-card";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";
import { LockGateBanner } from "@/components/jce/lock-gate-banner";

// H6 · Verification batches (hr-time.jsx:300). End-of-period review → correct →
// verify → LOCK → hand off to payroll (Part 5). Mark Verified locks the batch
// (lock-gate-banner). Re-open requires a reason (audited to H14). The verified
// state is written to the lib/mock/hr BATCHES store so Accounting can read it and
// the H5 grid locks. canVerify = timekeeper || owner (verbs ABSENT otherwise).
// Premium register chrome: KPI strip + search/status toolbar + pager (list);
// derived totals + sticky-first rows table (detail). Reads the local batches
// state so the KPI strip tracks verify/re-open live.

const VERIFIED_AT = "2026-06-03 10:15";
const PAGE_SIZE = 8;

type StatusFilter = BatchStatus | "All";
const STATUS_FILTERS: readonly StatusFilter[] = [
  "All",
  "Open",
  "Re-opened",
  "Verified",
];

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

  // List controls.
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [page, setPage] = useState(1);

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
    // FIX: the SELECTED batch's employee's rows (was the global getTimeRows()).
    const tr = getTimeRowsForEmployee(sel.no);
    const totals = weekTotals(tr);
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
                <Button
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => markVerified(sel)}
                >
                  Mark as Verified
                </Button>
              ) : null}
              {canVerify && verified ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full sm:w-auto"
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

        {/* Derived period totals — the record centerpiece (summed over the
            employee's rows; read-only `derived` identity). */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard
            derived
            label="Total Reg"
            value={`${totals.reg.toFixed(1)}`}
            hint="regular hours"
            tone="success"
          />
          <MetricCard
            derived
            label="Total OT"
            value={`${totals.ot.toFixed(1)}`}
            hint="overtime hours"
            tone="info"
          />
          <MetricCard
            derived
            label="Total ND"
            value={`${totals.nd.toFixed(1)}`}
            hint="night differential"
            tone="neutral"
          />
          <MetricCard
            derived
            label="Abs / UT"
            value={`${totals.abs.toFixed(1)}`}
            hint="absent / undertime"
            tone={totals.abs > 0 ? "danger" : "neutral"}
          />
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
          <table className="jtable jtable-sticky-first">
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
              {tr.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center text-jce-ink-2">
                    No rows in this batch.
                  </td>
                </tr>
              ) : (
                tr.map((r) => {
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
                })
              )}
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
  // KPI strip — derived live from the local batches state (tracks verify/re-open).
  const openCount = batches.filter((b) => b.status === "Open").length;
  const reopenedCount = batches.filter((b) => b.status === "Re-opened").length;
  const verifiedCount = batches.filter((b) => b.status === "Verified").length;

  const onSearch = (v: string) => {
    setQ(v);
    setPage(1);
  };
  const onStatus = (v: StatusFilter) => {
    setStatus(v);
    setPage(1);
  };
  const clearFilters = () => {
    setQ("");
    setStatus("All");
    setPage(1);
  };

  const needle = q.trim().toLowerCase();
  const filtered = batches.filter(
    (b) =>
      (status === "All" || b.status === status) &&
      (needle === "" ||
        (b.emp + b.no + b.period + b.range).toLowerCase().includes(needle)),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages); // clamp when a filter shrinks the list
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

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

      {/* KPI strip — live across the batch store */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          label="Open"
          value={openCount}
          delta="awaiting review"
          tone="neutral"
        />
        <KpiTile
          label="Re-opened"
          value={reopenedCount}
          delta="needs re-verify"
          tone="pending"
        />
        <KpiTile
          label="Verified & locked"
          value={verifiedCount}
          delta="handed to payroll"
          tone="success"
        />
        <KpiTile
          label="Total batches"
          value={batches.length}
          delta="this period"
          tone="info"
        />
      </div>

      {/* Toolbar — search + status filter (44px controls, stack on mobile) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex h-11 w-full items-center gap-2 rounded-(--r-input) border border-jce-line bg-white/70 px-3 transition-colors focus-within:border-jce-green-600 focus-within:shadow-(--focus-ring) sm:max-w-sm">
          <SearchIcon className="size-4 shrink-0 text-jce-ink-2" aria-hidden />
          <input
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search employee, no., period, range…"
            aria-label="Search verification batches"
            className="h-full w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => onStatus(v as StatusFilter)}
        >
          <SelectTrigger
            className="min-h-11 w-full sm:w-44"
            aria-label="Filter by status"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "All" ? "All statuses" : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {batches.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            icon={
              <ClipboardCheckIcon
                className="size-7"
                strokeWidth={1.5}
                aria-hidden
              />
            }
            title="No verification batches"
            description="Batches are bundled per employee at period end — none are pending review yet."
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            icon={
              <SearchIcon className="size-7" strokeWidth={1.5} aria-hidden />
            }
            title="No batches match your filters"
            description="Try a different name, number, or status."
            action={
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <LedgerGrid
            columns={columns}
            rows={pageRows}
            getRowKey={(b) => b.id}
            onRowClick={(b) => setSelId(b.id)}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-ui-12 text-jce-ink-2">
              Page {safePage} of {totalPages} · {filtered.length} batch
              {filtered.length === 1 ? "" : "es"}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="focus-ring-jce min-h-11"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeftIcon aria-hidden /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="focus-ring-jce min-h-11"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRightIcon aria-hidden />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
