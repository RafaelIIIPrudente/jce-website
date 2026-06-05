"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClockIcon } from "lucide-react";

import { useJce } from "@/lib/mock/role-context";
import { CAN_SEE_COMP } from "@/lib/rbac";
import {
  PAY_STATUS_TONE,
  getBatches,
  getVerifiedTimekeeping,
  type PayBatch,
} from "@/lib/mock/accounting";
import { pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { FieldMasked } from "@/components/jce/field-masked";
import { EmptyState } from "@/components/jce/empty-state";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// A4 · Payroll Summary list (acc-payroll.jsx:10). Batches by frequency; per-batch
// money is masked for non-Payroll/Owner (batch context still readable). A4 also
// CONSUMES the Verified H6 timekeeping batches from HR as available payroll
// sources — the HR verification state is the upstream trigger.

const FREQ_FILTERS = ["All", "Daily", "Weekly", "Monthly"] as const;

export function PayrollSummary() {
  const { role } = useJce();
  const router = useRouter();
  const seeComp = CAN_SEE_COMP(role);
  const [freq, setFreq] = useState<string>("All");

  const batches = getBatches();
  const rows = batches.filter((b) => freq === "All" || b.freq === freq);
  const sources = getVerifiedTimekeeping();

  const money = (v: number) =>
    seeComp ? pmoney(v) : <FieldMasked length={4} />;

  const columns: LedgerColumn<PayBatch>[] = [
    { id: "id", header: "Batch ID", cell: (b) => <DocChip code={b.id} /> },
    { id: "freq", header: "Frequency", cell: (b) => b.freq },
    {
      id: "period",
      header: "Period",
      cell: (b) => <span className="font-mono text-ui-12">{b.period}</span>,
    },
    { id: "cutoff", header: "Cut-off", cell: (b) => b.cutoff },
    {
      id: "scope",
      header: "Scope",
      cell: (b) => (
        <span className="flex items-center gap-1.5">
          {b.scope}
          {b.so ? <DocChip code={b.so} /> : null}
        </span>
      ),
    },
    {
      id: "workers",
      header: "Workers",
      align: "right",
      cell: (b) => <span className="tabular-nums">{b.workers}</span>,
    },
    {
      id: "gross",
      header: "Gross",
      align: "right",
      cell: (b) => money(b.gross),
    },
    {
      id: "net",
      header: "Net",
      align: "right",
      cell: (b) => <span className="font-semibold">{money(b.net)}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (b) => (
        <Chip tone={PAY_STATUS_TONE[b.status] ?? "neutral"}>{b.status}</Chip>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="Accounting · A4 · Payroll"
        title="Payroll Summary"
        description="Batches by pay frequency. Per-employee money is restricted to Payroll Officer & Owner."
        actions={
          <>
            <select
              className="field h-9 w-auto"
              value={freq}
              onChange={(e) => setFreq(e.target.value)}
              aria-label="Filter by frequency"
            >
              {FREQ_FILTERS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            {seeComp ? <Button size="sm">+ New batch</Button> : null}
          </>
        }
      />

      {/* HR handoff — Verified timekeeping ready to prepare into payroll */}
      <div className="solid rounded-(--r-solid) p-4">
        <div className="mb-2 flex items-center gap-2">
          <ClockIcon className="size-4 text-jce-green-700" aria-hidden />
          <h2 className="text-ui-14 font-semibold text-jce-ink">
            Verified timekeeping — ready to prepare
          </h2>
          <span className="text-ui-12 text-jce-ink-2">
            from HR · H6 verification
          </span>
        </div>
        {sources.length === 0 ? (
          <EmptyState
            icon={
              <ClockIcon className="size-6" strokeWidth={1.75} aria-hidden />
            }
            title="No timekeeping verified yet"
            description="Once a timekeeper verifies a batch in HR (H6), it appears here as an available payroll source."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {sources.map((s) => (
              <li
                key={s.no}
                className="flex flex-wrap items-center gap-3 rounded-(--r-input) border border-jce-line bg-card px-3 py-2"
              >
                <DocChip code={s.no} />
                <span className="font-medium text-jce-ink">{s.emp}</span>
                <span className="text-ui-12 text-jce-ink-2">
                  {s.period} · {s.rows} rows
                </span>
                <Chip tone="success" className="ml-auto">
                  Verified · Locked
                </Chip>
                {seeComp ? (
                  <Button size="xs" variant="outline">
                    Prepare batch
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="glass rounded-(--r-glass) px-6 py-10 text-center">
          <div className="text-ui-14 font-semibold text-jce-ink">
            No {freq.toLowerCase()} batches
          </div>
          <div className="mt-1 text-ui-12 text-jce-ink-2">
            Adjust the frequency filter.
          </div>
        </div>
      ) : (
        <LedgerGrid
          columns={columns}
          rows={rows}
          getRowKey={(b) => b.id}
          onRowClick={(b) => router.push(`/accounting/payroll/${b.id}`)}
        />
      )}
    </div>
  );
}
