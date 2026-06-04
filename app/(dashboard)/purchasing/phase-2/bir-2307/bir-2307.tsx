"use client";

import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { pmoney } from "@/lib/mock/format";
import { BIR_2307_ROWS, type Bir2307Row } from "@/lib/mock/purchasing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { EmptyState } from "@/components/jce/empty-state";

const STEPS = ["Period & scope", "2307 render", "Export"];
const PERIODS = ["May 2026", "Q2 2026", "April 2026"];

function rowsFor(period: string): readonly Bir2307Row[] {
  return period === "April 2026" ? [] : BIR_2307_ROWS;
}

// U19 · BIR withholding — Form 2307 (pur-phase2b.jsx:7). Period & scope → render
// → export; one 2307 per supplier per payment + alphalist summary.
export function Bir2307() {
  const [step, setStep] = useState(0);
  const [period, setPeriod] = useState("May 2026");
  const rows = rowsFor(period);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <PageHeader
        kicker="Purchasing · U19 · Phase 2"
        title="BIR withholding — Form 2307"
        actions={
          <Button
            variant="post"
            size="sm"
            onClick={() =>
              toast.success("Exported — Excel / DAT alphalist generated.")
            }
          >
            Export Excel / DAT
          </Button>
        }
      />

      <div className="glass flex flex-wrap items-center gap-1 rounded-(--r-glass) p-2">
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(i)}
            className={cn(
              "focus-ring-jce flex items-center gap-2 rounded-(--r-chip) px-3 py-1.5 text-ui-12 font-semibold",
              i === step
                ? "bg-jce-green-700 text-primary-foreground"
                : i < step
                  ? "text-jce-green-700"
                  : "text-jce-ink-2",
            )}
          >
            <span className="grid size-5 place-items-center rounded-full bg-(--table-zebra) font-mono text-[11px] text-jce-ink">
              {i < step ? "✓" : i + 1}
            </span>
            {s}
          </button>
        ))}
      </div>

      {step === 0 ? (
        <div className="solid flex flex-col gap-4 rounded-(--r-solid) p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-ui-12 font-semibold text-jce-ink-2">
                Period
              </span>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="field h-9"
              >
                {PERIODS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-ui-12 font-semibold text-jce-ink-2">
                Supplier scope
              </span>
              <select className="field h-9">
                <option>All suppliers</option>
                <option>Single supplier</option>
              </select>
            </label>
          </div>
          <Button size="sm" className="w-fit" onClick={() => setStep(1)}>
            Generate 2307s →
          </Button>
        </div>
      ) : null}

      {step >= 1 ? (
        rows.length === 0 ? (
          <EmptyState
            title="No withholding rows for this period"
            description={`No EWT was withheld in ${period}. Pick another period to generate 2307s.`}
          />
        ) : (
          <div className="solid overflow-auto rounded-(--r-solid) p-0">
            <table className="jtable">
              <thead>
                <tr>
                  <th>Supplier (payee)</th>
                  <th>TIN</th>
                  <th>ATC</th>
                  <th className="num">Tax base</th>
                  <th>Rate</th>
                  <th className="num">Tax withheld</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td className="font-semibold">{r.supplier}</td>
                    <td className="mono text-ui-12">{r.tin}</td>
                    <td className="mono">{r.atc}</td>
                    <td className="num">{pmoney(r.base)}</td>
                    <td>{r.rate}</td>
                    <td className="num">{pmoney(r.tax)}</td>
                    <td>
                      <Chip tone="pending">To issue</Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} className="font-semibold text-jce-ink">
                    Total withheld — {period}
                  </td>
                  <td className="num font-semibold">
                    {pmoney(rows.reduce((a, r) => a + r.tax, 0))}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )
      ) : null}

      <p className="text-ui-12 text-jce-ink-2">
        One 2307 per supplier per payment + periodic alphalist summary by
        supplier / ATC. Issuance-status tracker per supplier per period.
      </p>
    </div>
  );
}
