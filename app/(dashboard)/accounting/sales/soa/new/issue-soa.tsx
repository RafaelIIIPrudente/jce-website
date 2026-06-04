"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import { ACC_PROJECTS, addBilling, soName } from "@/lib/mock/accounting";
import { peso, pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { PrintPreview } from "@/components/jce/print-preview";

// A9 · Issue Statement of Account (FLAGSHIP — acc-sales.jsx:410). Two-pane.
// Net Amount = Gross − Retention − DP Recoupment, recomputing live from the
// billing-% and recoupment sliders in BOTH panes. If deductions exceed gross the
// net is clamped to ₱0.00 with a warning (sad path).

const CONTRACT = 13540000;
const DP_PCT = 15;
const RET_PCT = 10;

export function IssueSoa() {
  const { role } = useJce();
  const canIssue = canVerb(role, "acc");

  const [soaNo, setSoaNo] = useState("SOA-2026-089");
  const [billedTo, setBilledTo] = useState("NORECO II");
  const [so, setSo] = useState(ACC_PROJECTS[0]?.so ?? "26-05-378");
  const [billPct, setBillPct] = useState(8);
  const [recoupPct, setRecoupPct] = useState(15);
  const [issued, setIssued] = useState(false);

  const gross = (CONTRACT * billPct) / 100;
  const retention = (gross * RET_PCT) / 100;
  const recoup = (gross * recoupPct) / 100;
  const rawNet = gross - retention - recoup;
  const over = rawNet < 0;
  const net = Math.max(0, rawNet);

  const issue = () => {
    addBilling({
      date: "2026-06-03",
      type: "SOA",
      no: soaNo,
      or: "—",
      client: billedTo,
      so,
      tin: "—",
      particulars: `Progress billing — ${billPct}% (net of retention)`,
      debit: net,
      credit: 0,
      vat: 0,
      status: "Issued",
      bal: net,
    });
    setIssued(true);
    toast.success(`${soaNo} issued — posted to the billing register.`);
  };

  return (
    <div className="mx-auto flex w-full max-w-310 flex-col gap-5">
      <Link
        href="/accounting/sales"
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Sales register
      </Link>

      <PageHeader
        kicker="Accounting · A9"
        title={
          <span className="flex items-center gap-2">
            Issue Statement of Account
            {issued ? <Chip tone="info">Issued</Chip> : null}
          </span>
        }
        actions={
          <>
            <Button variant="ghost" size="sm" disabled={issued}>
              Save Draft
            </Button>
            {canIssue ? (
              issued ? (
                <Chip tone="success">Posted</Chip>
              ) : (
                <Button size="sm" onClick={issue} disabled={over}>
                  Issue
                </Button>
              )
            ) : (
              <Chip tone="neutral">Read-only</Chip>
            )}
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* FORM */}
        <div className="solid flex flex-col gap-4 rounded-(--r-solid) p-5">
          <h2 className="text-ui-14 font-semibold text-jce-ink">
            Header ·{" "}
            <span className="font-normal text-jce-ink-2">
              Body mode A — Billing Breakdown
            </span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              SOA No. <span className="text-(--st-danger)">*</span>
              <input
                className="field"
                value={soaNo}
                onChange={(e) => setSoaNo(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Date <span className="text-(--st-danger)">*</span>
              <input className="field" type="date" defaultValue="2026-06-03" />
            </label>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Billed To <span className="text-(--st-danger)">*</span>
              <select
                className="field"
                value={billedTo}
                onChange={(e) => setBilledTo(e.target.value)}
              >
                <option>NORECO II</option>
                <option>NGCP</option>
                <option>Meralco</option>
                <option>SMC Global Power</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              SO# <span className="text-(--st-danger)">*</span>
              <select
                className="field"
                value={so}
                onChange={(e) => setSo(e.target.value)}
              >
                {ACC_PROJECTS.map((p) => (
                  <option key={p.so} value={p.so}>
                    {p.so} · {p.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <h2 className="text-ui-14 font-semibold text-jce-ink">
            Contract context{" "}
            <span className="font-normal text-jce-ink-2">
              (read-only, always printed)
            </span>
          </h2>
          <div className="grid grid-cols-3 gap-3 rounded-(--r-input) bg-(--table-zebra) p-3 text-ui-12">
            <div>
              <div className="kicker text-jce-green-600">Contract Price</div>
              <div className="mt-0.5 font-mono tabular-nums text-jce-ink">
                {peso(CONTRACT)}
              </div>
            </div>
            <div>
              <div className="kicker text-jce-green-600">
                Down Payment ({DP_PCT}%)
              </div>
              <div className="mt-0.5 font-mono tabular-nums text-jce-ink">
                {peso((CONTRACT * DP_PCT) / 100)}
              </div>
            </div>
            <div>
              <div className="kicker text-jce-green-600">Prior billings</div>
              <div className="mt-0.5 text-jce-ink">7th · 52% · ₱7.04M</div>
            </div>
          </div>

          <h2 className="text-ui-14 font-semibold text-jce-ink">
            This billing
          </h2>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Billing % of Contract — {billPct}%
              <input
                type="range"
                min={1}
                max={20}
                value={billPct}
                onChange={(e) => setBillPct(Number(e.target.value))}
                className="accent-jce-green-700"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="kicker text-jce-green-600">Gross amount</div>
                <div className="computed field mt-1 flex items-center font-mono tabular-nums">
                  {peso(gross)}
                </div>
              </div>
              <div>
                <div className="kicker text-jce-green-600">
                  Retention ({RET_PCT}%)
                </div>
                <div className="computed field mt-1 flex items-center font-mono tabular-nums">
                  {peso(retention)}
                </div>
              </div>
            </div>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              DP Recoupment % — {recoupPct}%
              <input
                type="range"
                min={0}
                max={100}
                value={recoupPct}
                onChange={(e) => setRecoupPct(Number(e.target.value))}
                className="accent-jce-green-700"
              />
            </label>
            <div>
              <div className="kicker text-jce-green-600">
                Net Amount (Total)
              </div>
              <div className="computed field mt-1 flex items-center font-mono text-ui-14 font-bold tabular-nums text-jce-green-900">
                {peso(net)}
              </div>
            </div>
            {over ? (
              <div className="flex items-center gap-2 rounded-(--r-input) border border-(--st-danger) bg-(--st-danger-bg) px-3 py-2 text-ui-12 text-(--st-danger-ink)">
                <TriangleAlertIcon className="size-3.5 shrink-0" aria-hidden />
                Retention + DP Recoupment ({peso(retention + recoup)}) exceed
                the gross ({peso(gross)}) — Net clamped to ₱0.00. Lower the
                recoupment % to issue.
              </div>
            ) : null}
          </div>
          <p className="text-ui-12 text-jce-ink-2">
            Net Amount = Gross − Retention − Recoupment. Register mapping:
            trade_receivable = Net · retention = Retention · down_payment =
            Recoupment.
          </p>
        </div>

        {/* PREVIEW */}
        <PrintPreview
          title="Live print preview"
          paperSize="Non-VAT · progress billing"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-ui-12 font-extrabold">
                JC ELECTROFIELDS POWER SYSTEM, INC.
              </div>
              <div className="text-jce-ink-2">Valenzuela City</div>
            </div>
            <div className="text-right">
              <div className="font-extrabold">STATEMENT OF ACCOUNT</div>
              <div className="font-mono text-jce-green-900">{soaNo}</div>
            </div>
          </div>
          <div className="mt-1.5 font-bold">
            {soName(so)} · SO# {so} · {billedTo}
          </div>
          <table className="mt-2 w-full">
            <tbody>
              <tr className="border-b border-jce-line/60">
                <td className="py-1">Contract Price</td>
                <td className="text-right font-mono tabular-nums">
                  {pmoney(CONTRACT)}
                </td>
              </tr>
              <tr className="border-b border-jce-line/60">
                <td className="py-1">Billing — {billPct}% of Contract</td>
                <td className="text-right font-mono tabular-nums">
                  {pmoney(gross)}
                </td>
              </tr>
              <tr className="border-b border-jce-line/60">
                <td className="py-1">Less: Retention ({RET_PCT}%)</td>
                <td className="text-right font-mono tabular-nums">
                  ({pmoney(retention)})
                </td>
              </tr>
              <tr className="border-b border-jce-line/60">
                <td className="py-1">Less: DP Recoupment ({recoupPct}%)</td>
                <td className="text-right font-mono tabular-nums">
                  ({pmoney(recoup)})
                </td>
              </tr>
              <tr className="font-extrabold">
                <td className="py-1">NET AMOUNT</td>
                <td className="text-right font-mono tabular-nums">
                  {pmoney(net)}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-2 text-[9px] text-jce-ink-2 italic">
            ***Net amount {peso(net)} &amp; 00/100 Pesos Only***
          </div>
          <div className="mt-5 grid grid-cols-2 gap-5">
            <div>
              <div className="h-7 border-b border-jce-ink" />
              <div className="mt-1 text-[9px] tracking-wide text-jce-ink-2 uppercase">
                Authorized by · Billing &amp; Collection Officer
              </div>
            </div>
            <div>
              <div className="h-7 border-b border-jce-ink" />
              <div className="mt-1 text-[9px] tracking-wide text-jce-ink-2 uppercase">
                Approved by · Accounting Head
              </div>
            </div>
          </div>
        </PrintPreview>
      </div>
    </div>
  );
}
