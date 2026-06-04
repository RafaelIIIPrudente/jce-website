"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import {
  addDisbursement,
  getDisbursements,
  getVouchers,
  setVoucherStatus,
  type Disbursement as Disb,
} from "@/lib/mock/accounting";
import { peso, pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { Segmented } from "@/components/jce/segmented";

// A15 · Disbursement register + bank reconciliation pivot (acc-vouchers.jsx:394).
// Record from an Approved CV → CV flips Paid; void = reversing entry (CV back to
// Approved). Recording against a non-Approved CV is blocked (only Approved CVs are
// selectable; empty state when none).
export function Disbursement() {
  const { role } = useJce();
  const canRecord = canVerb(role, "acc");

  const [recon, setRecon] = useState("register");
  const [rows, setRows] = useState<Disb[]>(() => [...getDisbursements()]);
  const [tick, setTick] = useState(0);
  const [selCv, setSelCv] = useState("");

  // Recomputed each render — reflects the store after record/void mutations.
  void tick;
  const approved = getVouchers().filter((v) => v.status === "Approved");
  const sel = approved.find((v) => v.cv === selCv) ?? approved[0];

  const byBank: Record<string, number> = {};
  rows
    .filter((r) => !r.reversed)
    .forEach((r) => {
      byBank[r.bank] = (byBank[r.bank] ?? 0) + r.amount;
    });

  const record = () => {
    if (!sel) return;
    const d: Disb = {
      date: "2026-06-03",
      cv: sel.cv,
      payee: sel.payee,
      desc: `${sel.ptype} payment`,
      checkDate: "2026-06-03",
      checkNo: "0098222",
      bank: "067-4",
      amount: sel.net,
    };
    addDisbursement(d);
    setVoucherStatus(sel.cv, "Paid");
    setRows((rs) => [d, ...rs]);
    setSelCv("");
    setTick((t) => t + 1);
    toast.success(`${sel.cv} recorded — voucher flipped to Paid.`);
  };

  const voidRow = (i: number) => {
    const r = rows[i];
    if (!r) return;
    setRows((rs) => rs.map((x, j) => (j === i ? { ...x, reversed: true } : x)));
    setVoucherStatus(r.cv, "Approved");
    setTick((t) => t + 1);
    toast.success(`${r.cv} disbursement reversed — voucher back to Approved.`);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="Accounting · A15 · Disbursement"
        title={
          recon === "recon" ? "Bank reconciliation" : "Disbursement register"
        }
        description="Record from an Approved CV → CV flips Paid. Void = reversing entry, CV back to Approved (reason logged)."
        actions={
          <Segmented
            aria-label="Disbursement view"
            value={recon}
            onValueChange={setRecon}
            options={[
              { value: "register", label: "Register" },
              { value: "recon", label: "Reconciliation" },
            ]}
          />
        }
      />

      {/* Record panel */}
      {canRecord ? (
        <div className="solid flex flex-wrap items-end gap-3 rounded-(--r-solid) p-4">
          <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
            Record disbursement from an Approved CV
            <select
              className="field h-9 w-72"
              value={sel?.cv ?? ""}
              onChange={(e) => setSelCv(e.target.value)}
              disabled={approved.length === 0}
            >
              {approved.length === 0 ? (
                <option value="">No Approved vouchers</option>
              ) : (
                approved.map((v) => (
                  <option key={v.cv} value={v.cv}>
                    {v.cv} · {v.payee} · {pmoney(v.net)}
                  </option>
                ))
              )}
            </select>
          </label>
          <Button size="sm" onClick={record} disabled={approved.length === 0}>
            Record payment
          </Button>
          <p className="text-ui-12 text-jce-ink-2">
            Only Approved vouchers can be recorded. Draft / Pending / Paid /
            Voided are not eligible.
          </p>
        </div>
      ) : null}

      {recon === "register" ? (
        <div className="solid overflow-auto rounded-(--r-solid) p-0">
          <table className="jtable">
            <thead>
              <tr>
                <th>Date</th>
                <th>CV No.</th>
                <th>Payee</th>
                <th>Description</th>
                <th>Check Date</th>
                <th>Check No.</th>
                <th>Bank Account</th>
                <th className="text-right">Amount</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((d, i) => (
                <tr
                  key={`${d.cv}-${i}`}
                  className={d.reversed ? "opacity-50" : ""}
                >
                  <td className="font-mono text-ui-12">{d.date}</td>
                  <td>
                    <DocChip code={d.cv} />
                  </td>
                  <td className="font-semibold text-jce-ink">{d.payee}</td>
                  <td className="text-jce-ink-2">{d.desc}</td>
                  <td className="font-mono text-ui-12">{d.checkDate}</td>
                  <td className="font-mono">{d.checkNo}</td>
                  <td>
                    <DocChip code={d.bank} />
                  </td>
                  <td className="num">{pmoney(d.amount)}</td>
                  <td className="num">
                    {d.reversed ? (
                      <Chip tone="danger">Reversed</Chip>
                    ) : canRecord ? (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => voidRow(i)}
                      >
                        Void
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(byBank).map(([b, t]) => (
            <div key={b} className="solid rounded-(--r-solid) p-4">
              <div className="flex items-center justify-between">
                <DocChip code={`Bank ${b}`} />
                <span className="font-mono text-ui-16 font-bold tabular-nums text-jce-ink">
                  {peso(t)}
                </span>
              </div>
              <div className="mt-1 text-ui-12 text-jce-ink-2">
                Period disbursements · running cash position
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
