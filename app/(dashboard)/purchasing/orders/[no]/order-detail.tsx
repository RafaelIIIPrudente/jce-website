"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, PrinterIcon } from "lucide-react";
import { toast } from "sonner";

import { ccyAmt, pmoneyU } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import {
  PAY_TONE,
  rfpsForPo,
  grForPo,
  derivePaymentStatus,
  type PurchaseOrder,
  type PoStatus,
} from "@/lib/mock/purchasing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { Stepper, type Step } from "@/components/jce/stepper";
import { PrintPreview } from "@/components/jce/print-preview";
import {
  PrintSignatureBlock,
  type Signatory,
} from "@/components/jce/print-signature-block";

const FLOW: PoStatus[] = [
  "Draft",
  "For Approval",
  "Approved",
  "Sent",
  "Closed",
];

const LOCAL_SIGS: readonly Signatory[] = [
  { role: "Prepared by", name: "Purchasing Asst." },
  { role: "Verified by", name: "Supervisor" },
  { role: "Approved by", name: "Fin. / Admin Mgr" },
  { role: "Supplier's Conforme", name: "President" },
];
const IMPORT_SIGS: readonly Signatory[] = [
  { role: "Prepared by", name: "Asst. Purchasing Head" },
  { role: "Verified by", name: "Senior Engineer" },
  { role: "Approved by", name: "(role)" },
  { role: "Supplier's Conforme", name: "President" },
];

// U4 · PO detail + byte-faithful PDF (pur-core.jsx:506). Status stepper, linked
// records (RFPs / GoodsReceipt-MRR / SO / MR), derived Payment Status, and a
// render-only signatory chain (offline wet-signature — no e-sign). Void retains
// the PO number (gaps allowed, §7.4).
export function OrderDetail({ po }: { po: PurchaseOrder }) {
  const { role } = useJce();
  const mayVerb = canVerb(role, "pur");
  const [voided, setVoided] = useState(false);

  const status: PoStatus = voided ? "Void" : po.status;
  const idx = FLOW.indexOf(status);
  const steps: Step[] = FLOW.map((s, i) => ({
    label: s,
    state: voided
      ? "locked"
      : i < idx
        ? "done"
        : i === idx
          ? "current"
          : "todo",
  }));

  const rfps = rfpsForPo(po.no);
  const gr = grForPo(po.no);
  const pay = derivePaymentStatus(po);
  const sigs = po.type === "Local" ? LOCAL_SIGS : IMPORT_SIGS;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <Link
        href="/purchasing/orders"
        className="focus-ring-jce inline-flex w-fit items-center gap-1.5 rounded-(--r-chip) text-ui-12 font-semibold text-jce-ink-2 hover:text-jce-green-900"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden /> PO ledger
      </Link>

      <PageHeader
        kicker="Purchasing · U4"
        title={
          <span className="flex items-center gap-2.5">
            <span
              className={voided ? "text-jce-ink-2 line-through" : undefined}
            >
              <DocChip code={po.no} />
            </span>
            <Chip tone={po.type === "Import" ? "info" : "neutral"}>
              {po.type}
            </Chip>
            {voided ? <Chip tone="danger">Void</Chip> : null}
          </span>
        }
        description={`${po.supplier} · ${po.project} · ${ccyAmt(po.amount, po.ccy)}`}
        actions={
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/purchasing/orders/${po.no}/tracker`}>
                {po.type === "Import" ? "Import tracker" : "5-stage tracker"} →
              </Link>
            </Button>
            <Button
              variant="post"
              size="sm"
              onClick={() =>
                toast.success("PDF regenerated (client-only mock).")
              }
            >
              <PrinterIcon data-icon="inline-start" /> Regenerate PDF
            </Button>
            {mayVerb && !voided && po.status !== "Closed" ? (
              <Button
                variant="lock"
                size="sm"
                onClick={() => {
                  setVoided(true);
                  toast.success(
                    `PO ${po.no} voided — number retained (gaps allowed).`,
                  );
                }}
              >
                Void
              </Button>
            ) : null}
          </>
        }
      />

      <div className="glass rounded-(--r-glass) p-4">
        <div className="mb-3 kicker">Status</div>
        <Stepper steps={steps} className="sm:[&>div]:flex-row" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="solid flex flex-col gap-4 rounded-(--r-solid) p-5">
          <div>
            <div className="mb-2 text-ui-13 font-semibold text-jce-ink">
              Linked records
            </div>
            <dl className="grid grid-cols-2 gap-3 text-ui-12">
              <div>
                <dt className="text-jce-ink-2">RFPs</dt>
                <dd className="mt-1 flex flex-wrap items-center gap-1.5">
                  {rfps.length === 0 ? (
                    <span className="text-jce-ink-2">—</span>
                  ) : (
                    rfps.map((r) => (
                      <span
                        key={r.no}
                        className="inline-flex items-center gap-1"
                      >
                        <DocChip code={r.no} />
                        {r.status === "Received (Accounting)" ||
                        r.status === "Paid" ? (
                          <Link
                            href="/accounting"
                            className="focus-ring-jce rounded-(--r-chip) text-ui-12 font-semibold text-jce-green-700 hover:text-jce-green-900"
                            title="Handed to Accounting PV / Disbursement"
                          >
                            → Accounting
                          </Link>
                        ) : null}
                      </span>
                    ))
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-jce-ink-2">Goods Receipt / MRR</dt>
                <dd className="mt-1 flex flex-wrap items-center gap-1.5">
                  {gr ? (
                    <>
                      <DocChip code={gr.mrr} />
                      <Chip
                        tone={
                          gr.status === "Fully Received" ? "success" : "pending"
                        }
                      >
                        {gr.status}
                      </Chip>
                      <span className="text-jce-ink-2">
                        {gr.receivedQty}/{gr.orderedQty}
                      </span>
                    </>
                  ) : (
                    <span className="text-jce-ink-2">—</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-jce-ink-2">SO No.</dt>
                <dd className="mt-1">
                  <DocChip code={po.so} />
                </dd>
              </div>
              <div>
                <dt className="text-jce-ink-2">MR No.</dt>
                <dd className="mt-1">
                  {po.mr === "—" ? (
                    <span className="text-jce-ink-2">—</span>
                  ) : (
                    <DocChip code={po.mr} />
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <div className="mb-2 text-ui-13 font-semibold text-jce-ink">
              Payment status{" "}
              <span className="text-ui-12 font-normal text-jce-ink-2">
                (derived)
              </span>
            </div>
            <span title="Derived, never typed">
              <Chip tone={PAY_TONE[pay] ?? "neutral"}>{pay}</Chip>
            </span>
          </div>

          {gr ? (
            <p className="rounded-(--r-solid) border border-jce-line bg-(--table-zebra) px-3 py-2 text-ui-12 text-jce-ink-2">
              Warehouse owns the MRR; this is the Purchasing surface (same
              event, two surfaces). Stage 15 of the import tracker consolidates
              with <span className="font-mono">{gr.gr}</span>.
            </p>
          ) : null}
        </div>

        <PrintPreview
          title="PDF preview"
          paperSize={`${po.type} template`}
          note="Signatory names render-only — paper is wet-signed offline. No e-sign."
        >
          <div className="flex items-start justify-between gap-3 border-b border-jce-ink/30 pb-2">
            <div className="text-[11px] font-extrabold tracking-tight text-jce-ink">
              JC ELECTROFIELDS POWER SYSTEM, INC.
            </div>
            <div className="text-right">
              <div className="text-[11px] font-extrabold">PURCHASE ORDER</div>
              <div className="font-mono text-[10px] text-jce-ink-2">
                {po.no}
              </div>
            </div>
          </div>
          <div className="my-2 text-[10px]">
            Supplier: <strong>{po.supplier}</strong> · {po.date} ·{" "}
            {ccyAmt(po.amount, po.ccy)}
          </div>
          <table className="w-full border-collapse text-[10px] [&_td]:border [&_td]:border-jce-ink/40 [&_td]:px-1.5 [&_td]:py-1 [&_th]:border [&_th]:border-jce-ink/40 [&_th]:px-1.5 [&_th]:py-1">
            <thead>
              <tr className="text-left">
                <th>Qty</th>
                <th>Description</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2 set</td>
                <td>{po.desc}</td>
                <td className="text-right">{pmoneyU(po.amount)}</td>
              </tr>
              <tr>
                <td colSpan={2} className="italic">
                  “Nothing Follows”
                </td>
                <td />
              </tr>
            </tbody>
          </table>
          <PrintSignatureBlock signatories={sigs} />
        </PrintPreview>
      </div>
    </div>
  );
}
