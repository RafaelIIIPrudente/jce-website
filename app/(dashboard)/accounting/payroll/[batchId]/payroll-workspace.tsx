"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LockIcon,
  PrinterIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { CAN_SEE_COMP, ROLES, canEdit, canVerb } from "@/lib/rbac";
import {
  PAY_LINES,
  PAY_STAGES,
  PAY_STATUS_TONE,
  lineDeductions,
  setBatchStage,
  type PayBatch,
  type PayLine,
  type PayStage,
} from "@/lib/mock/accounting";
import { pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { LockGateBanner } from "@/components/jce/lock-gate-banner";

// A5 · Payroll batch workspace (FLAGSHIP — acc-payroll.jsx:118). Status stepper
// Draft→Prepared→Checked→Verified→Approved→Paid (LOCKS at Approved). Wide solid
// lines grid: color-banded earnings / deductions / net, frozen Employee column,
// row-expand Daily Earnings Detail (charge project + multipliers, tracing to HR
// timekeeping), loan-skip flag, Charging Allocation per project, sign-off panel +
// control totals. Per-employee money masked for non-Payroll/Owner.
//
// SEGREGATION OF DUTIES (PROPOSED — needs confirmation): the prototype gates
// stage-advance on a single seeComp check (acc-payroll.jsx:184). Here we split it:
//   • Prepare (Draft→Prepared) = canEdit(role,'acc')   — owner/acctglead/payroll
//   • Sign-offs (Checked…Paid)  = canVerb(role,'acc')   — owner/acctglead
//   • Per-employee money         = CAN_SEE_COMP(role)    — owner/payroll
// This is finer than the prototype; flagged for confirmation.

const EARN = "bg-jce-green-50";
const DED = "bg-(--st-pending-bg)";
const NET = "bg-jce-green-100";

export function PayrollWorkspace({ batch }: { batch: PayBatch }) {
  const { role } = useJce();
  const seeComp = CAN_SEE_COMP(role);
  const canEditLines = canEdit(role, "acc");
  const canSignOff = canVerb(role, "acc");

  const [stage, setStage] = useState<PayStage>(batch.status);
  const [expand, setExpand] = useState<number | null>(null);

  const idx = PAY_STAGES.indexOf(stage);
  const locked = idx >= PAY_STAGES.indexOf("Approved");
  const nextStage = PAY_STAGES[idx + 1];
  const canAdvance =
    nextStage != null && (nextStage === "Prepared" ? canEditLines : canSignOff);

  const tot = PAY_LINES.reduce(
    (a, l) => ({
      gross: a.gross + l.gross,
      ded: a.ded + lineDeductions(l),
      net: a.net + l.net,
    }),
    { gross: 0, ded: 0, net: 0 },
  );

  const charge: Record<string, { hrs: number; amt: number }> = {};
  PAY_LINES.forEach((l) =>
    l.charge.forEach((c) => {
      const e = charge[c.proj] ?? { hrs: 0, amt: 0 };
      charge[c.proj] = { hrs: e.hrs + c.hrs, amt: e.amt + c.amt };
    }),
  );

  const M = (v: number) =>
    seeComp ? (
      pmoney(v)
    ) : (
      <span className="masked text-ui-12">
        ••••
        <LockIcon className="size-3" aria-hidden />
      </span>
    );

  const advance = () => {
    if (!nextStage || !canAdvance) return;
    setStage(nextStage);
    setBatchStage(batch.id, nextStage);
    toast.success(`Batch ${batch.id} advanced to ${nextStage}.`);
  };

  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-5">
      <Link
        href="/accounting/payroll"
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Payroll Summary
      </Link>

      {/* Header card */}
      <div className="glass rounded-(--r-glass) p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="kicker">Accounting · A5 · Batch workspace</div>
            <h1 className="mt-1 flex items-center gap-2 text-ui-22 font-bold tracking-tight text-jce-ink">
              <DocChip code={batch.id} />
              <Chip tone={PAY_STATUS_TONE[stage] ?? "neutral"}>{stage}</Chip>
            </h1>
            <p className="mt-1 text-ui-13 text-jce-ink-2">
              {batch.freq} · {batch.period} · cut-off {batch.cutoff} ·{" "}
              {batch.scope}
              {batch.so ? ` · ${batch.so}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {canEditLines && !locked ? (
              <Button variant="ghost" size="sm">
                Edit lines
              </Button>
            ) : null}
            {seeComp ? (
              <Button variant="outline" size="sm">
                <PrinterIcon data-icon="inline-start" /> Print register
              </Button>
            ) : null}
          </div>
        </div>

        {/* status stepper */}
        <ol className="mt-4 flex flex-wrap items-center gap-1">
          {PAY_STAGES.map((s, i) => {
            const done = i < idx;
            const current = i === idx;
            return (
              <li key={s} className="flex items-center gap-1">
                <span
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-ui-12 font-semibold",
                    done && "bg-jce-green-100 text-jce-green-900",
                    current && "bg-jce-green-700 text-primary-foreground",
                    !done && !current && "bg-(--table-zebra) text-jce-ink-2",
                  )}
                >
                  <span className="grid size-4 place-items-center rounded-full bg-card/40 text-[10px]">
                    {done ? (
                      <CheckIcon
                        className="size-3"
                        strokeWidth={3}
                        aria-hidden
                      />
                    ) : (
                      i + 1
                    )}
                  </span>
                  {s}
                </span>
                {i < PAY_STAGES.length - 1 ? (
                  <ChevronRightIcon
                    className="size-3.5 text-jce-ink-2"
                    aria-hidden
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      {!seeComp ? (
        <div className="flex flex-wrap items-center gap-2 rounded-(--r-solid) border border-(--masked-border) bg-(--table-zebra) px-4 py-2.5 text-ui-12 text-jce-ink-2">
          <LockIcon className="size-3.5 shrink-0" aria-hidden />
          Per-employee compensation is restricted to{" "}
          <strong className="text-jce-ink">Payroll Officer &amp; Owner</strong>.
          You see batch totals only (viewing as {ROLES[role].short}).
        </div>
      ) : null}

      {locked ? (
        <LockGateBanner
          state="locked"
          title="Approved — lines locked"
          detail="Revert is a logged status change with remarks. Line edits are allowed below Approved only."
        />
      ) : null}

      {/* lines grid */}
      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable text-ui-12">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-card" />
              <th className="sticky left-8 z-10 bg-card">Employee</th>
              <th className="text-right">Rate/day</th>
              <th className={cn("text-right", EARN)}>Basic</th>
              <th className={cn("text-right", EARN)}>OT</th>
              <th className={cn("text-right", EARN)}>Holiday</th>
              <th className={cn("text-right", EARN)}>Night Diff</th>
              <th className={cn("text-right", EARN)}>Allowance</th>
              <th className={cn("text-right", EARN)}>Gross</th>
              <th className={cn("text-right", DED)}>SSS</th>
              <th className={cn("text-right", DED)}>PhilH</th>
              <th className={cn("text-right", DED)}>Pag-IBIG</th>
              <th className={cn("text-right", DED)}>W/Tax</th>
              <th className={cn("text-right", DED)}>Loans</th>
              <th className={cn("text-right", DED)}>CA</th>
              <th className={cn("text-right", DED)}>Total Ded</th>
              <th className={cn("text-right", NET)}>NET PAY</th>
            </tr>
          </thead>
          <tbody>
            {PAY_LINES.map((l) => {
              const open = expand === l.ln;
              const loans = l.sssLoan + l.piLoan + l.coLoan;
              return (
                <PayRowGroup
                  key={l.ln}
                  l={l}
                  open={open}
                  loans={loans}
                  seeComp={seeComp}
                  M={M}
                  onToggle={() => setExpand(open ? null : l.ln)}
                />
              );
            })}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td className="sticky left-0 z-10 bg-card" />
              <td className="sticky left-8 z-10 bg-card">Control totals</td>
              <td />
              <td colSpan={5} />
              <td className={cn("num", EARN)}>{M(tot.gross)}</td>
              <td colSpan={6} />
              <td className={cn("num", DED)}>{M(tot.ded)}</td>
              <td className={cn("num", NET)}>{M(tot.net)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* charging allocation */}
        <div className="solid rounded-(--r-solid) p-5">
          <h2 className="text-ui-14 font-semibold text-jce-ink">
            Charging Allocation{" "}
            <span className="text-ui-12 font-normal text-jce-ink-2">
              per project
            </span>
          </h2>
          <table className="jtable mt-3">
            <thead>
              <tr>
                <th>Project</th>
                <th className="text-right">Allocated hrs</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(charge).map(([p, v]) => (
                <tr key={p}>
                  <td>
                    <DocChip code={p} />
                  </td>
                  <td className="num">{v.hrs.toFixed(1)}</td>
                  <td className="num">{M(v.amt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* sign-off workflow */}
        <div className="glass rounded-(--r-glass) p-5">
          <h2 className="text-ui-14 font-semibold text-jce-ink">
            Sign-off workflow
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {(["Prepared", "Checked", "Verified", "Approved"] as const).map(
              (s) => {
                const done = PAY_STAGES.indexOf(stage) >= PAY_STAGES.indexOf(s);
                return (
                  <div key={s} className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-full text-[10px]",
                        done
                          ? "bg-jce-green-700 text-primary-foreground"
                          : "border border-jce-line bg-card text-jce-ink-2",
                      )}
                    >
                      {done ? (
                        <CheckIcon
                          className="size-3"
                          strokeWidth={3}
                          aria-hidden
                        />
                      ) : null}
                    </span>
                    <div>
                      <div className="text-ui-12 font-semibold text-jce-ink">
                        {s} by
                      </div>
                      <div className="text-ui-12 text-jce-ink-2">
                        {done ? "L. Tan · 2026-06-02" : "—"}
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
          {canAdvance ? (
            <Button className="mt-4 w-full" size="sm" onClick={advance}>
              Advance to {nextStage} →
            </Button>
          ) : nextStage ? (
            <p className="mt-4 rounded-(--r-input) bg-(--table-zebra) px-3 py-2 text-ui-12 text-jce-ink-2">
              {nextStage === "Prepared"
                ? "Preparing this batch requires Payroll / Accounting authority."
                : "Sign-off requires Accounting Lead / Owner authority — your role cannot advance this stage."}
            </p>
          ) : (
            <p className="mt-4 rounded-(--r-input) bg-jce-green-50 px-3 py-2 text-ui-12 text-jce-green-900">
              Batch fully processed — Paid.
            </p>
          )}
          <p className="mt-3 text-ui-12 text-jce-ink-2">
            Deductions appear only when the Deduction Calendar schedules them
            this cut-off. Segregation of duties (Prepare vs sign-off) refines
            the prototype&rsquo;s single-gate model —{" "}
            <strong>PROPOSED, needs confirmation</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

function PayRowGroup({
  l,
  open,
  loans,
  seeComp,
  M,
  onToggle,
}: {
  l: PayLine;
  open: boolean;
  loans: number;
  seeComp: boolean;
  M: (v: number) => React.ReactNode;
  onToggle: () => void;
}) {
  const totDed = lineDeductions(l);
  return (
    <>
      <tr
        className="focus-ring-jce cursor-pointer outline-none"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <td className="sticky left-0 z-10 bg-card">
          <ChevronDownIcon
            className={cn(
              "size-4 text-jce-ink-2 transition-transform",
              !open && "-rotate-90",
            )}
            aria-hidden
          />
        </td>
        <td className="sticky left-8 z-10 bg-card font-semibold text-jce-ink">
          <span className="flex items-center gap-1.5">
            {l.name}
            {l.skip ? (
              <span
                title={l.skip}
                className="inline-flex items-center gap-0.5 rounded bg-(--st-pending-bg) px-1 py-0.5 text-[9px] font-bold text-(--st-pending-ink)"
              >
                <TriangleAlertIcon className="size-2.5" aria-hidden /> skip
              </span>
            ) : null}
          </span>
        </td>
        <td className="num">{M(l.rate)}</td>
        <td className={cn("num", EARN)}>{M(l.basic)}</td>
        <td className={cn("num", EARN)}>{M(l.ot)}</td>
        <td className={cn("num", EARN)}>{M(l.hol)}</td>
        <td className={cn("num", EARN)}>{M(l.nd)}</td>
        <td className={cn("num", EARN)}>{M(l.allow)}</td>
        <td className={cn("num font-semibold", EARN)}>{M(l.gross)}</td>
        <td className={cn("num", DED)}>{M(l.sss)}</td>
        <td className={cn("num", DED)}>{M(l.ph)}</td>
        <td className={cn("num", DED)}>{M(l.pi)}</td>
        <td className={cn("num", DED)}>{M(l.wtax)}</td>
        <td className={cn("num", DED)}>{M(loans)}</td>
        <td className={cn("num", DED)}>{M(l.ca)}</td>
        <td className={cn("num font-semibold", DED)}>{M(totDed)}</td>
        <td className={cn("num font-bold", NET)}>{M(l.net)}</td>
      </tr>
      {open && seeComp ? (
        <tr>
          <td />
          <td colSpan={16} className="bg-(--table-zebra)">
            <div className="p-2">
              <div className="mb-2 text-ui-12 font-semibold text-jce-ink">
                Daily Earnings Detail — {l.name}{" "}
                <span className="font-normal text-jce-ink-2">
                  (traces to HR timekeeping)
                </span>
              </div>
              <table className="jtable bg-card">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Charge Project</th>
                    <th>Day Type</th>
                    <th className="text-right">Reg</th>
                    <th className="text-right">OT</th>
                    <th className="text-right">ND</th>
                    <th className="text-right">Rate</th>
                    <th>Multipliers</th>
                    <th className="text-right">Basic Amt</th>
                    <th className="text-right">OT Amt</th>
                    <th className="text-right">ND Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {l.daily.map((d, i) => (
                    <tr key={i}>
                      <td className="font-mono text-ui-12">{d.date}</td>
                      <td>
                        <DocChip code={d.proj} />
                      </td>
                      <td>{d.dayType}</td>
                      <td className="num">{d.reg}</td>
                      <td className="num">{d.ot}</td>
                      <td className="num">{d.nd}</td>
                      <td className="num">{pmoney(d.rate)}</td>
                      <td className="font-mono text-[11px]">{d.mult}</td>
                      <td className="num">{pmoney(d.basicAmt)}</td>
                      <td className="num">{pmoney(d.otAmt)}</td>
                      <td className="num">{pmoney(d.ndAmt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {l.skip ? (
                <div className="mt-2 flex items-center gap-1.5 text-ui-12 text-(--st-pending-ink)">
                  <TriangleAlertIcon className="size-3.5" aria-hidden />{" "}
                  {l.skip} — officer may override (every override
                  ledger-logged).
                </div>
              ) : null}
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
