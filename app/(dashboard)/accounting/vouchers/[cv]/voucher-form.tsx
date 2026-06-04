"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { canEdit, canVerb } from "@/lib/rbac";
import {
  CV_STAGES,
  CV_TONE,
  setVoucherStatus,
  type Voucher,
  type VoucherStatus,
} from "@/lib/mock/accounting";
import { peso, pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { PrintPreview } from "@/components/jce/print-preview";

// A14 · Bank Payment Voucher form (acc-vouchers.jsx:159). Double-entry journal
// block + WHT preview (Gross − WHT = Net) + approval stepper. An unbalanced block
// (WHT > Gross → negative net) BLOCKS Approve — surfaced, not silent. A voided CV
// exposes no edit/advance verbs.

export function VoucherForm({ voucher }: { voucher: Voucher }) {
  const { role } = useJce();
  const canVerbAcc = canVerb(role, "acc");

  const [status, setStatus] = useState<VoucherStatus>(voucher.status);
  const [gross, setGross] = useState(voucher.gross);
  const [wtax, setWtax] = useState(voucher.wtax);

  const net = gross - wtax;
  const whtInvalid = wtax > gross || wtax < 0;
  const balanced = !whtInvalid;
  const voided = status === "Voided";
  const idx = CV_STAGES.indexOf(status as (typeof CV_STAGES)[number]);
  const canEditFields = canEdit(role, "acc") && !voided && status !== "Paid";

  const nextStage =
    idx >= 0 && idx < CV_STAGES.length - 1 ? CV_STAGES[idx + 1] : null;
  const advanceLabel =
    idx === 2 ? "Approve" : idx === 3 ? "Record payment" : "Advance →";

  const advance = () => {
    if (!nextStage || !canVerbAcc || !balanced) return;
    setStatus(nextStage);
    setVoucherStatus(voucher.cv, nextStage);
    toast.success(`${voucher.cv} → ${nextStage}.`);
  };

  const voidCv = () => {
    setStatus("Voided");
    setVoucherStatus(voucher.cv, "Voided");
    toast.success(`${voucher.cv} voided (reason logged).`);
  };

  return (
    <div className="mx-auto flex w-full max-w-310 flex-col gap-5">
      <Link
        href="/accounting/vouchers"
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Voucher register
      </Link>

      <div className="glass rounded-(--r-glass) p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="kicker">
              Accounting · A14 · Bank Payment Voucher
            </div>
            <h1 className="mt-1 flex flex-wrap items-center gap-2 text-ui-22 font-bold tracking-tight text-jce-ink">
              <DocChip code={voucher.cv} /> {voucher.payee}
            </h1>
            <p className="mt-1 text-ui-13 text-jce-ink-2">
              {voucher.ptype} · {voucher.so}
              {voucher.rfp !== "—" ? ` · ${voucher.rfp}` : ""}
              {voucher.po !== "—" ? ` · ${voucher.po}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone={CV_TONE[status] ?? "neutral"}>{status}</Chip>
            {canVerbAcc && nextStage && !voided ? (
              <Button size="sm" onClick={advance} disabled={!balanced}>
                {advanceLabel}
              </Button>
            ) : null}
            {canVerbAcc && !voided && status !== "Paid" ? (
              <Button variant="ghost" size="sm" onClick={voidCv}>
                Void
              </Button>
            ) : null}
          </div>
        </div>

        {/* approval stepper */}
        <ol className="mt-4 flex flex-wrap items-center gap-1">
          {CV_STAGES.map((s, i) => {
            const done = idx >= 0 && i < idx;
            const current = i === idx;
            return (
              <li key={s} className="flex items-center gap-1">
                <span
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-ui-12 font-semibold",
                    voided && "opacity-50",
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
                {i < CV_STAGES.length - 1 ? (
                  <ChevronRightIcon
                    className="size-3.5 text-jce-ink-2"
                    aria-hidden
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
        {voided ? (
          <p className="mt-3 text-ui-12 text-(--st-danger-ink)">
            Voided — reversing entry posted; no further edit or approval verbs.
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* FORM */}
        <div className="solid flex flex-col gap-4 rounded-(--r-solid) p-5">
          <h2 className="text-ui-14 font-semibold text-jce-ink">
            Payee &amp; references
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Static label="CV Number" v={voucher.cv} />
            <Static label="CV Date" v={voucher.date} />
            <Static label="Payee" v={voucher.payee} />
            <Static label="PO No." v={voucher.po} />
            <Static label="RFP No." v={voucher.rfp} />
            <Static label="Invoice No." v={voucher.inv} />
          </div>

          <h2 className="text-ui-14 font-semibold text-jce-ink">Amounts</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Gross amount
              {canEditFields ? (
                <input
                  type="number"
                  className="field font-mono tabular-nums"
                  value={gross}
                  onChange={(e) => setGross(Number(e.target.value) || 0)}
                />
              ) : (
                <div className="field flex items-center bg-(--table-zebra) font-mono tabular-nums">
                  {pmoney(gross)}
                </div>
              )}
            </label>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Withholding Tax
              {canEditFields ? (
                <input
                  type="number"
                  className="field font-mono tabular-nums"
                  value={wtax}
                  onChange={(e) => setWtax(Number(e.target.value) || 0)}
                />
              ) : (
                <div className="field flex items-center bg-(--table-zebra) font-mono tabular-nums">
                  {pmoney(wtax)}
                </div>
              )}
            </label>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              ATC code (EWT from RFP)
              <select className="field" disabled={!canEditFields}>
                <option>WI010 — Goods 1%</option>
                <option>WI020 — Services 2%</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Net amount
              <div className="computed field flex items-center font-mono font-bold tabular-nums">
                {peso(net)}
              </div>
            </label>
          </div>

          {whtInvalid ? (
            <div className="flex items-center gap-2 rounded-(--r-input) border border-(--st-danger) bg-(--st-danger-bg) px-3 py-2 text-ui-12 text-(--st-danger-ink)">
              <TriangleAlertIcon className="size-3.5 shrink-0" aria-hidden />
              Withholding Tax cannot exceed Gross — the journal is unbalanced,
              so this voucher cannot be approved.
            </div>
          ) : (
            <div className="rounded-(--r-input) bg-(--table-zebra) px-3 py-2 text-ui-12 text-jce-ink-2">
              Gross {pmoney(gross)} − WHT {pmoney(wtax)} ={" "}
              <strong className="text-jce-ink">Net {pmoney(net)}</strong> ·
              journal balanced ✓
            </div>
          )}

          <h2 className="text-ui-14 font-semibold text-jce-ink">
            Journal (double-entry)
          </h2>
          <div className="overflow-auto rounded-(--r-input) border border-jce-line">
            <table className="jtable">
              <thead>
                <tr>
                  <th>Account</th>
                  <th className="text-right">Debit</th>
                  <th className="text-right">Credit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    50001 Cost of Services{" "}
                    <span className="text-jce-ink-2">(Sundry)</span>
                  </td>
                  <td className="num font-mono tabular-nums">
                    {pmoney(gross)}
                  </td>
                  <td className="num text-jce-ink-2">—</td>
                </tr>
                <tr>
                  <td>20021 Withholding Tax Payable</td>
                  <td className="num text-jce-ink-2">—</td>
                  <td className="num font-mono tabular-nums">{pmoney(wtax)}</td>
                </tr>
                <tr>
                  <td>20004 Voucher&rsquo;s Payable</td>
                  <td className="num text-jce-ink-2">—</td>
                  <td className="num font-mono tabular-nums">{pmoney(net)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PREVIEW */}
        <PrintPreview title="Live preview" paperSize="BANK PAYMENT VOUCHER">
          <div className="flex items-start justify-between gap-4">
            <div className="text-ui-12 font-extrabold">
              JC ELECTROFIELDS POWER SYSTEM, INC.
            </div>
            <div className="text-right">
              <div className="font-extrabold">BANK PAYMENT VOUCHER</div>
              <div className="font-mono text-jce-green-900">{voucher.cv}</div>
            </div>
          </div>
          <div className="mt-1.5">
            Payee: <strong>{voucher.payee}</strong> · {voucher.date}
          </div>
          <table className="mt-2 w-full">
            <thead>
              <tr className="border-b border-jce-line text-left text-jce-ink-2">
                <th className="py-1">Account</th>
                <th className="text-right">Debit</th>
                <th className="text-right">Credit</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-jce-line/60">
                <td className="py-1">Cost of Services</td>
                <td className="text-right font-mono tabular-nums">
                  {pmoney(gross)}
                </td>
                <td className="text-right text-jce-ink-2">—</td>
              </tr>
              <tr className="border-b border-jce-line/60">
                <td className="py-1">WHT Payable</td>
                <td className="text-right text-jce-ink-2">—</td>
                <td className="text-right font-mono tabular-nums">
                  {pmoney(wtax)}
                </td>
              </tr>
              <tr>
                <td className="py-1">Voucher&rsquo;s Payable</td>
                <td className="text-right text-jce-ink-2">—</td>
                <td className="text-right font-mono tabular-nums">
                  {pmoney(net)}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {[
              "Prepared by",
              "Approved · VP-Finance",
              "Approved · President",
            ].map((r) => (
              <div key={r}>
                <div className="h-6 border-b border-jce-ink" />
                <div className="mt-1 text-[9px] tracking-wide text-jce-ink-2 uppercase">
                  {r}
                </div>
              </div>
            ))}
          </div>
        </PrintPreview>
      </div>
    </div>
  );
}

function Static({ label, v }: { label: string; v: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
      {label}
      <div className="field flex items-center bg-(--table-zebra)">{v}</div>
    </label>
  );
}
