"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, CheckIcon, PrinterIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canEdit, canVerb } from "@/lib/rbac";
import { findPo } from "@/lib/mock/purchasing";
import {
  GATE_TONE,
  MRR_LINES,
  gateLockState,
  mrrBlockReason,
  type Mrr,
  type GateStatus,
} from "@/lib/mock/warehouse";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { FieldComputed } from "@/components/jce/field-computed";
import { FileUploader } from "@/components/jce/file-uploader";
import { LockGateBanner } from "@/components/jce/lock-gate-banner";
import { PrintPreview } from "@/components/jce/print-preview";
import {
  PrintSignatureBlock,
  type Signatory,
} from "@/components/jce/print-signature-block";

const MRR_SIGS: readonly Signatory[] = [
  { role: "Received by" },
  { role: "Checked by", name: "Warehouse" },
];

// W4 · MRR form (FLAGSHIP · wh-docs.jsx:171). 3-state lock gate (Draft → For
// Checking → Locked); DR Photo REQUIRED to Lock; on Lock the three-way match
// completes and the RFP becomes submittable. Movements post only on Lock.
export function MrrForm({ mrr }: { mrr: Mrr }) {
  const { role } = useJce();
  const mayEdit = canEdit(role, "wh");
  const mayLock = canVerb(role, "wh");

  const [status, setStatus] = useState<GateStatus>(mrr.status);
  const [drPhoto, setDrPhoto] = useState(mrr.drPhoto);

  const locked = status === "Locked";
  const editable = mayEdit && !locked;
  const blockReason = mrrBlockReason(status, drPhoto);

  const po = findPo(mrr.po);
  const mismatch =
    po != null &&
    (po.project !== mrr.project || (po.mr !== mrr.mr && mrr.mr !== "—"));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <Link
        href="/warehouse/mrr"
        className="focus-ring-jce inline-flex w-fit items-center gap-1.5 rounded-(--r-chip) text-ui-12 font-semibold text-jce-ink-2 hover:text-jce-green-900"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden /> MRR list
      </Link>

      <PageHeader
        kicker="Warehouse · W4"
        title={
          <span className="flex items-center gap-2">
            MRR <DocChip code={mrr.no} />
            <Chip tone={GATE_TONE[status] ?? "neutral"}>{status}</Chip>
          </span>
        }
        actions={
          <Button
            variant="post"
            size="sm"
            onClick={() => toast.success("MRR sent to print (JCE-F-WMS02).")}
          >
            <PrinterIcon data-icon="inline-start" /> Print for filing
          </Button>
        }
      />

      {/* 3-state lock gate */}
      <LockGateBanner
        state={gateLockState(status)}
        title={status}
        detail={
          status === "Draft"
            ? "Draft — submit for checking when lines are encoded."
            : status === "For Checking"
              ? "For Checking — Warehouse Admin Locks once the DR Photo is attached."
              : "Locked — movements posted; immutable. Unlock reverses movements (Admin only)."
        }
      />
      <div className="flex flex-wrap items-center gap-2">
        {status === "Draft" && mayEdit ? (
          <Button size="sm" onClick={() => setStatus("For Checking")}>
            Submit for checking
          </Button>
        ) : null}
        {status === "For Checking" && mayLock ? (
          <>
            <Button
              variant="lock"
              size="sm"
              disabled={!!blockReason}
              onClick={() => {
                setStatus("Locked");
                toast.success(
                  "Locked — Receipt movements posted; three-way match complete.",
                );
              }}
            >
              Lock
            </Button>
            {blockReason ? (
              <span className="text-ui-12 font-semibold text-(--st-danger)">
                {blockReason}
              </span>
            ) : null}
          </>
        ) : null}
        {status === "For Checking" && !mayLock ? (
          <span className="text-ui-12 text-jce-ink-2">
            Awaiting Warehouse Admin to Lock
          </span>
        ) : null}
        {status === "Locked" && mayLock ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatus("For Checking");
              toast.success("Unlocked — movements reversed (audited).");
            }}
          >
            Unlock (reverses movements · audited)
          </Button>
        ) : null}
      </div>

      {locked ? (
        <div className="solid flex items-start gap-3 rounded-(--r-solid) border-l-4 border-l-(--st-success) p-3">
          <CheckIcon
            className="mt-0.5 size-4 shrink-0 text-(--st-success)"
            aria-hidden
          />
          <div className="text-ui-12 text-jce-ink">
            <div className="text-ui-13 font-semibold">
              Three-way match complete
            </div>
            PO{" "}
            <Link
              href={`/purchasing/orders/${mrr.po}`}
              className="focus-ring-jce rounded-(--r-chip) font-semibold text-jce-green-700 hover:text-jce-green-900"
            >
              {mrr.po}
            </Link>{" "}
            + Invoice {mrr.inv} + this receipt reconcile → RFP submittable.
            Receipt movements posted; Delivered / Running Balance raised.
          </div>
        </div>
      ) : null}

      {mismatch ? (
        <p className="rounded-(--r-solid) border border-(--st-pending) bg-(--st-pending-bg) px-3 py-2 text-ui-12 text-(--st-pending-ink)">
          Discrepancy flag — PO {mrr.po} ({po?.project}) does not match this
          MRR&apos;s project / MR. Warn-and-allow: the receipt proceeds with a
          flag raised to admin (never silently adjusted).
        </p>
      ) : null}

      {mrr.recvStatus === "Partial" ? (
        <p className="rounded-(--r-solid) border border-jce-line bg-(--table-zebra) px-3 py-2 text-ui-12 text-jce-ink-2">
          Partial delivery — {mrr.receivedQty}/{mrr.orderedQty} received. One PO
          across many MRRs, cumulative tracking, no silent over-receive.
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="solid flex flex-col gap-4 rounded-(--r-solid) p-5">
          <div className="text-ui-13 font-semibold text-jce-ink">Header</div>
          <div className="grid grid-cols-2 gap-3 text-ui-12">
            <Field label="MRR No." computed value={mrr.no} editable={false} />
            <Field
              label="Receive Date"
              value={mrr.date}
              editable={editable}
              type="date"
            />
            <Field
              label="Project (FK)"
              value={mrr.project}
              editable={editable}
            />
            <Field
              label="Receiving Location"
              value="Main Office"
              editable={editable}
            />
            <Field
              label="Supplier (FK)"
              value={mrr.supplier}
              editable={editable}
            />
            <Field label="PO Number (FK)" value={mrr.po} editable={editable} />
            <Field label="MR Number (FK)" value={mrr.mr} editable={editable} />
            <Field label="Invoice Number" value={mrr.inv} editable={editable} />
            <Field label="Requested By" value={mrr.by} editable={editable} />
            <Field
              label="Warehouseman"
              computed
              editable={false}
              value={
                role === "siteeng" ? "P. Garcia (you)" : "G. Lim (logged user)"
              }
            />
          </div>

          <div className="text-ui-13 font-semibold text-jce-ink">Lines</div>
          <div className="overflow-auto rounded-(--r-solid) border border-jce-line">
            <table className="jtable">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th className="num">Qty received</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {MRR_LINES.map((l) => (
                  <tr key={l.item}>
                    <td>{l.item}</td>
                    <td className="text-jce-ink-2">{l.desc}</td>
                    <td className="num">{l.qty}</td>
                    <td>{l.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="solid flex flex-col gap-4 rounded-(--r-solid) p-5">
            <div className="kicker">Attachments</div>
            {drPhoto ? (
              <div className="flex items-center gap-2 rounded-(--r-solid) border border-jce-line bg-(--table-zebra) px-3 py-2 text-ui-12">
                <span aria-hidden>📷</span> DR_{mrr.inv}.jpg
                <Chip tone="success">attached</Chip>
              </div>
            ) : (
              <FileUploader
                label="DR Photo"
                required
                requiredLabel="REQUIRED to Lock"
                accept="image/*"
                hint="Tap to simulate upload"
                onFilesChange={(c) => {
                  if (c > 0 && !locked) {
                    setDrPhoto(true);
                    toast.success("DR Photo attached — MRR can now be Locked.");
                  }
                }}
              />
            )}
            <FileUploader
              label="Delivery Proof (optional)"
              hint="Optional supporting file"
            />
          </div>

          <PrintPreview
            title="MRR form preview"
            paperSize="JCE-F-WMS02"
            note="Signatory names render-only — wet-signed offline."
          >
            <div className="flex items-start justify-between gap-3 border-b border-jce-ink/30 pb-2">
              <div className="text-[11px] font-extrabold tracking-tight text-jce-ink">
                JC ELECTROFIELDS
              </div>
              <div className="text-right">
                <div className="text-[11px] font-extrabold">
                  MRR · JCE-F-WMS02
                </div>
                <div className="font-mono text-[10px] text-jce-ink-2">
                  {mrr.no}
                </div>
              </div>
            </div>
            <div className="my-2 text-[10px]">
              {mrr.supplier} · {mrr.date} · PO {mrr.po}
            </div>
            <PrintSignatureBlock signatories={MRR_SIGS} />
          </PrintPreview>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  editable,
  computed,
  type,
}: {
  label: string;
  value: string;
  editable: boolean;
  computed?: boolean;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-jce-ink-2">{label}</span>
      {editable && !computed ? (
        <input
          type={type ?? "text"}
          defaultValue={value}
          className="field h-9"
        />
      ) : computed ? (
        <FieldComputed>{value}</FieldComputed>
      ) : (
        <span className="font-medium text-jce-ink">{value}</span>
      )}
    </label>
  );
}
