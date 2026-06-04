"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  PlusIcon,
  TrashIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import {
  ACC_PROJECTS,
  CLIENTS,
  addBilling,
  findClient,
} from "@/lib/mock/accounting";
import { peso, pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { PrintPreview } from "@/components/jce/print-preview";

// A8 · Issue Service Invoice (FLAGSHIP — acc-sales.jsx:111). Two-pane: editable
// solid form ←→ live A4 print preview. Editing line prices updates the VAT totals
// live (VATable / VAT-Exempt / Zero-Rated). Out-of-sequence SI# warns (soft, not a
// hard block). A zero-line invoice stays ₱0.00 — no NaN.

type VatClass = "VATable" | "VAT-Exempt" | "Zero-Rated";
type Line = {
  qty: number;
  unit: string;
  desc: string;
  price: number;
  vat: VatClass;
};

const EXPECTED_SI = "SI-004513";
const VAT_CLASSES: readonly VatClass[] = [
  "VATable",
  "VAT-Exempt",
  "Zero-Rated",
];

function num(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function IssueInvoice() {
  const { role } = useJce();
  const canIssue = canVerb(role, "acc");

  const [siNo, setSiNo] = useState(EXPECTED_SI);
  const [client, setClient] = useState("NORECO II");
  const [so, setSo] = useState(ACC_PROJECTS[0]?.so ?? "26-05-378");
  const [issued, setIssued] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    {
      qty: 1,
      unit: "Lot",
      desc: "8th progress billing — 13.2KV Distribution Line",
      price: 2410000,
      vat: "VATable",
    },
  ]);

  const cl = findClient(client) ?? CLIENTS[0];
  const sum = (cls: VatClass) =>
    lines.filter((l) => l.vat === cls).reduce((a, l) => a + l.qty * l.price, 0);
  const vatable = sum("VATable");
  const exempt = sum("VAT-Exempt");
  const zero = sum("Zero-Rated");
  const vat = vatable * 0.12;
  const totalDue = vatable + exempt + zero + vat;
  const outOfSeq = siNo.trim() !== EXPECTED_SI;

  const upd = (i: number, patch: Partial<Line>) =>
    setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  const issue = () => {
    addBilling({
      date: "2026-06-03",
      type: "SI",
      no: siNo,
      or: "—",
      client,
      so,
      tin: cl?.tin ?? "—",
      particulars: lines[0]?.desc ?? "Service invoice",
      debit: totalDue,
      credit: 0,
      vat,
      status: "Issued",
      bal: totalDue,
    });
    setIssued(true);
    toast.success(`${siNo} issued — posted to the billing register.`);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5">
      <Link
        href="/accounting/sales"
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Sales register
      </Link>

      <PageHeader
        kicker="Accounting · A8"
        title={
          <span className="flex items-center gap-2">
            Issue Service Invoice
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
                <Chip tone="success">Posted to books</Chip>
              ) : (
                <Button size="sm" onClick={issue}>
                  Issue → post to books
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
          <h2 className="text-ui-14 font-semibold text-jce-ink">Header</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Service Invoice No. <span className="text-(--st-danger)">*</span>
              <input
                className="field"
                value={siNo}
                onChange={(e) => setSiNo(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Date <span className="text-(--st-danger)">*</span>
              <input className="field" type="date" defaultValue="2026-06-03" />
            </label>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Customer <span className="text-(--st-danger)">*</span>
              <select
                className="field"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              >
                {CLIENTS.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              TIN
              <div className="computed field flex items-center">{cl?.tin}</div>
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
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Terms
              <input className="field" defaultValue="30 days" />
            </label>
          </div>

          {outOfSeq ? (
            <div className="flex items-center gap-2 rounded-(--r-input) border border-(--st-pending) bg-(--st-pending-bg) px-3 py-2 text-ui-12 text-(--st-pending-ink)">
              <TriangleAlertIcon className="size-3.5 shrink-0" aria-hidden />
              Out of sequence — last issued SI-004512, next expected{" "}
              <strong>{EXPECTED_SI}</strong>. You can still issue (logged).
            </div>
          ) : (
            <p className="text-ui-12 text-jce-ink-2">
              Last SI issued: <strong>SI-004512</strong> — next expected{" "}
              {EXPECTED_SI}.
            </p>
          )}

          <h2 className="text-ui-14 font-semibold text-jce-ink">Line items</h2>
          <div className="overflow-auto rounded-(--r-input) border border-jce-line">
            <table className="jtable">
              <thead>
                <tr>
                  <th className="text-right">Qty</th>
                  <th>Unit</th>
                  <th>Description</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Amount</th>
                  <th>VAT class</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {lines.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-jce-ink-2">
                      No lines — add one to bill.
                    </td>
                  </tr>
                ) : (
                  lines.map((l, i) => (
                    <tr key={i}>
                      <td className="num">
                        <input
                          className="field h-8 w-16 text-right"
                          value={l.qty}
                          onChange={(e) => upd(i, { qty: num(e.target.value) })}
                        />
                      </td>
                      <td>
                        <input
                          className="field h-8 w-16"
                          value={l.unit}
                          onChange={(e) => upd(i, { unit: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="field h-8 w-full min-w-44"
                          value={l.desc}
                          onChange={(e) => upd(i, { desc: e.target.value })}
                        />
                      </td>
                      <td className="num">
                        <input
                          className="field h-8 w-28 text-right"
                          value={l.price}
                          onChange={(e) =>
                            upd(i, { price: num(e.target.value) })
                          }
                        />
                      </td>
                      <td className="num font-mono tabular-nums">
                        {pmoney(l.qty * l.price)}
                      </td>
                      <td>
                        <select
                          className="field h-8 w-32"
                          value={l.vat}
                          onChange={(e) =>
                            upd(i, { vat: e.target.value as VatClass })
                          }
                        >
                          {VAT_CLASSES.map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          aria-label="Remove line"
                          onClick={() =>
                            setLines((ls) => ls.filter((_, j) => j !== i))
                          }
                          className="focus-ring-jce rounded text-jce-ink-2 hover:text-(--st-danger)"
                        >
                          <TrashIcon className="size-3.5" aria-hidden />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-fit"
            onClick={() =>
              setLines((ls) => [
                ...ls,
                { qty: 1, unit: "Lot", desc: "", price: 0, vat: "VATable" },
              ])
            }
          >
            <PlusIcon data-icon="inline-start" /> Add line
          </Button>

          <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
            Authorized Representative
            <select className="field">
              <option>A. Reyes · CFO</option>
              <option>J. Cruz · President</option>
            </select>
          </label>
        </div>

        {/* LIVE PREVIEW */}
        <PrintPreview title="Live print preview" paperSize="A4 · BIR booklet">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[12px] font-extrabold">
                JC ELECTROFIELDS POWER SYSTEM, INC.
              </div>
              <div className="text-jce-ink-2">
                Valenzuela City · VAT Reg TIN 000-000-000-000
              </div>
            </div>
            <div className="text-right">
              <div className="font-extrabold">SERVICE INVOICE</div>
              <div className="font-mono text-jce-green-900">{siNo}</div>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-0.5 border-y border-jce-line py-1.5">
            <div>
              <span className="text-jce-ink-2">Customer:</span> {cl?.name}
            </div>
            <div>
              <span className="text-jce-ink-2">TIN:</span> {cl?.tin}
            </div>
            <div>
              <span className="text-jce-ink-2">Address:</span> {cl?.addr}
            </div>
            <div>
              <span className="text-jce-ink-2">Date:</span> 2026-06-03
            </div>
          </div>
          <table className="mt-2 w-full">
            <thead>
              <tr className="border-b border-jce-line text-left text-jce-ink-2">
                <th className="py-1">Qty</th>
                <th>Unit</th>
                <th>Description</th>
                <th className="text-right">Unit Price</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i} className="border-b border-jce-line/60">
                  <td className="py-1">{l.qty}</td>
                  <td>{l.unit}</td>
                  <td>
                    {l.desc || "—"}
                    {l.vat !== "VATable" ? (
                      <em className="text-jce-ink-2"> ({l.vat})</em>
                    ) : null}
                  </td>
                  <td className="text-right font-mono tabular-nums">
                    {pmoney(l.price)}
                  </td>
                  <td className="text-right font-mono tabular-nums">
                    {pmoney(l.qty * l.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 ml-auto flex w-60 flex-col gap-0.5">
            <div className="flex justify-between">
              <span>VATable Sales</span>
              <span className="font-mono tabular-nums">{pmoney(vatable)}</span>
            </div>
            {exempt > 0 ? (
              <div className="flex justify-between">
                <span>VAT-Exempt Sales</span>
                <span className="font-mono tabular-nums">{pmoney(exempt)}</span>
              </div>
            ) : null}
            {zero > 0 ? (
              <div className="flex justify-between">
                <span>Zero-Rated Sales</span>
                <span className="font-mono tabular-nums">{pmoney(zero)}</span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span>VAT (12%)</span>
              <span className="font-mono tabular-nums">{pmoney(vat)}</span>
            </div>
            <div className="mt-0.5 flex justify-between border-t border-jce-ink pt-0.5 font-bold">
              <span>TOTAL AMOUNT DUE</span>
              <span className="font-mono tabular-nums">{peso(totalDue)}</span>
            </div>
          </div>
          <div className="mt-5">
            <div className="h-7 border-b border-jce-ink" />
            <div className="mt-1 text-[9px] tracking-wide text-jce-ink-2 uppercase">
              Authorized Representative
            </div>
          </div>
        </PrintPreview>
      </div>
    </div>
  );
}
