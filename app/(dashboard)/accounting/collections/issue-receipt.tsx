"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import {
  ACC_PROJECTS,
  CLIENTS,
  addCollection,
  applyCollection,
  cwtOf,
  getBillings,
} from "@/lib/mock/accounting";
import { peso, pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { PrintPreview } from "@/components/jce/print-preview";

// A11 / A12 · Issue Collection / Acknowledgement Receipt (acc-sales.jsx:727).
// Two-pane. CR prints the BIR "not valid for input tax" footer; AR prints 2
// copies/page. Both: Banks (Net) = gross − CWT (2%). Issuing against a fully-paid
// billing is BLOCKED with a reason (sad path).

export function IssueReceipt({ type }: { type: "CR" | "AR" }) {
  const { role } = useJce();
  const canIssue = canVerb(role, "acc");
  const isCR = type === "CR";

  const sources = getBillings().filter((b) =>
    isCR ? b.type === "SI" : b.type === "SOA",
  );
  const first = sources[0];

  const [source, setSource] = useState(first?.no ?? "");
  const [client, setClient] = useState(first?.client ?? CLIENTS[0]?.name ?? "");
  const [so, setSo] = useState(first?.so ?? ACC_PROJECTS[0]?.so ?? "");
  const [amount, setAmount] = useState(first?.bal ?? 0);
  const [docNo, setDocNo] = useState(isCR ? "CR-0903" : "AR-2026-045");
  const [issued, setIssued] = useState(false);

  const selected = sources.find((b) => b.no === source);
  const blocked = !selected || selected.bal === 0;
  const cwt = cwtOf(amount);
  const banks = amount - cwt;

  const onSource = (no: string) => {
    setSource(no);
    const b = sources.find((x) => x.no === no);
    if (b) {
      setClient(b.client);
      setSo(b.so);
      setAmount(b.bal);
    }
  };

  const issue = () => {
    if (blocked || !selected) return;
    addCollection({
      date: "2026-06-03",
      type,
      no: docNo,
      client,
      tin: selected.tin,
      so,
      ref: selected.no,
      particulars: amount >= selected.bal ? "Full payment" : "Partial",
      tr: amount,
      cwt,
      banks,
      status: "Issued",
    });
    applyCollection(selected.no, amount);
    setIssued(true);
    toast.success(`${docNo} issued · ${selected.no} balance updated.`);
  };

  return (
    <div className="mx-auto flex w-full max-w-310 flex-col gap-5">
      <Link
        href="/accounting/collections"
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Collections register
      </Link>

      <PageHeader
        kicker={`Accounting · ${isCR ? "A11" : "A12"}`}
        title={
          <span className="flex items-center gap-2">
            Issue {isCR ? "Collection Receipt" : "Acknowledgement Receipt"}
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
                <Chip tone="success">Issued</Chip>
              ) : (
                <Button size="sm" onClick={issue} disabled={blocked}>
                  Issue{isCR ? "" : " — 2 copies"}
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
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              {isCR ? "CR No. (booklet)" : "AR No. (auto)"}{" "}
              <span className="text-(--st-danger)">*</span>
              <input
                className="field"
                value={docNo}
                onChange={(e) => setDocNo(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Date <span className="text-(--st-danger)">*</span>
              <input className="field" type="date" defaultValue="2026-06-03" />
            </label>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Received from <span className="text-(--st-danger)">*</span>
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
              SO# <span className="text-(--st-danger)">*</span>
              <select
                className="field"
                value={so}
                onChange={(e) => setSo(e.target.value)}
              >
                {ACC_PROJECTS.map((p) => (
                  <option key={p.so} value={p.so}>
                    {p.so}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              {isCR ? "Source SI No." : "Source SOA No."}{" "}
              <span className="text-(--st-danger)">*</span>
              <select
                className="field"
                value={source}
                onChange={(e) => onSource(e.target.value)}
              >
                {sources.map((b) => (
                  <option key={b.no} value={b.no}>
                    {b.no} · {b.status} · bal {pmoney(b.bal)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Amount (figures) <span className="text-(--st-danger)">*</span>
              <input
                className="field font-mono tabular-nums"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Creditable Tax (2%)
              <div className="computed field flex items-center font-mono tabular-nums">
                {pmoney(cwt)}
              </div>
            </label>
            <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Banks (Net)
              <div className="computed field flex items-center font-mono tabular-nums">
                {pmoney(banks)}
              </div>
            </label>
          </div>

          {blocked ? (
            <div className="flex items-center gap-2 rounded-(--r-input) border border-(--st-danger) bg-(--st-danger-bg) px-3 py-2 text-ui-12 text-(--st-danger-ink)">
              <TriangleAlertIcon className="size-3.5 shrink-0" aria-hidden />
              {selected
                ? `${selected.no} is fully paid — nothing left to collect. Pick an outstanding billing.`
                : "No outstanding billing selected."}
            </div>
          ) : (
            <p className="text-ui-12 text-jce-ink-2">
              Source {selected?.no} outstanding balance:{" "}
              <strong>{peso(selected?.bal ?? 0)}</strong> — amount defaults to
              it. A partial leaves the balance open.
            </p>
          )}

          <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
            {isCR ? "By Cashier / Authorized Signature" : "Received by"}
            <select className="field">
              <option>L. Tan · Cashier</option>
            </select>
          </label>
        </div>

        {/* PREVIEW */}
        <PrintPreview
          title="Live preview"
          paperSize={isCR ? "BIR booklet" : "2 copies / page"}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="text-ui-12 font-extrabold">
              JC ELECTROFIELDS POWER SYSTEM, INC.
            </div>
            <div className="text-right">
              <div className="font-extrabold">
                {isCR ? "COLLECTION RECEIPT" : "ACKNOWLEDGEMENT RECEIPT"}
              </div>
              <div className="font-mono text-jce-green-900">{docNo}</div>
            </div>
          </div>
          <div className="mt-2">
            Received from <strong>{client}</strong> the sum of{" "}
            <em>{peso(amount)}</em> in settlement of {selected?.no ?? "—"}.
          </div>
          <table className="mt-2 w-full">
            <tbody>
              <tr className="border-b border-jce-line/60">
                <td className="py-1">Trade Receivables</td>
                <td className="text-right font-mono tabular-nums">
                  {pmoney(amount)}
                </td>
              </tr>
              <tr className="border-b border-jce-line/60">
                <td className="py-1">Less: Creditable Tax (2%)</td>
                <td className="text-right font-mono tabular-nums">
                  ({pmoney(cwt)})
                </td>
              </tr>
              <tr className="font-extrabold">
                <td className="py-1">Banks (Net)</td>
                <td className="text-right font-mono tabular-nums">
                  {pmoney(banks)}
                </td>
              </tr>
            </tbody>
          </table>
          {isCR ? (
            <div className="mt-3 border border-jce-line p-1.5 text-[9px] text-jce-ink-2 italic">
              THIS DOCUMENT IS NOT VALID FOR CLAIMING INPUT TAXES · ATP/permit
              footer
            </div>
          ) : (
            <div className="mt-3 text-[9px] text-jce-ink-2 italic">
              Printed in 2 copies per page (original + file copy).
            </div>
          )}
          <div className="mt-5">
            <div className="h-7 border-b border-jce-ink" />
            <div className="mt-1 text-[9px] tracking-wide text-jce-ink-2 uppercase">
              {isCR ? "By · Cashier / Authorized" : "Received by"}
            </div>
          </div>
        </PrintPreview>
      </div>
    </div>
  );
}
