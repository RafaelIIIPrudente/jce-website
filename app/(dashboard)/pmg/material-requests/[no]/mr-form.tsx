"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import {
  MR_STATUS_TONE,
  VERIFIED_TONE,
  approveMr,
  forPurchaseQty,
  getMrLines,
  reservedQty,
  type Mr,
  type MrStatus,
} from "@/lib/mock/pmg";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { PrintSignatureBlock } from "@/components/jce/print-signature-block";

// P10 · Material Request (JCE-F-WMS02 — pmg-screens.jsx:950). INVENTORY-FIRST:
// each line shows Required vs Available; only the unfulfillable remainder
// ("For Purchase") flows to Purchasing. On approval the in-stock qty is RESERVED
// (a Warehouse-side effect, Part 8 — PROPOSED). A fully-in-stock MR yields For
// Purchase = 0 and nothing flows to Purchasing.
export function MrForm({ mr }: { mr: Mr }) {
  const { role } = useJce();
  const canApprove = canEdit(role, "pmg");
  const [status, setStatus] = useState<MrStatus>(mr.status);
  const [verified, setVerified] = useState(mr.verified);

  const lines = getMrLines(mr.no);
  const forPurchaseTotal = lines.reduce((a, l) => a + forPurchaseQty(l), 0);
  const fullyInStock = forPurchaseTotal === 0;
  const pending = status === "Pending approval";

  const approve = () => {
    approveMr(mr.no);
    setStatus("Approved");
    setVerified("Verified");
    toast.success(
      fullyInStock
        ? `${mr.no} approved — fully covered by stock; nothing flows to Purchasing.`
        : `${mr.no} approved — in-stock reserved; For-Purchase lines flow to Purchasing.`,
    );
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <Link
        href="/pmg/material-requests"
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> MR register
      </Link>

      <PageHeader
        kicker="PMG · P10 · JCE-F-WMS02"
        title={
          <span className="flex flex-wrap items-center gap-2">
            Material Request <DocChip code={mr.no} />
          </span>
        }
        actions={
          <>
            <Chip tone={MR_STATUS_TONE[status] ?? "neutral"}>{status}</Chip>
            <Chip tone={VERIFIED_TONE[verified] ?? "neutral"}>
              WH: {verified}
            </Chip>
            {canApprove && pending ? (
              <Button size="sm" onClick={approve}>
                Approve MR
              </Button>
            ) : null}
          </>
        }
      />

      <div className="solid grid grid-cols-2 gap-4 rounded-(--r-solid) p-4 sm:grid-cols-4">
        {[
          ["Date", mr.date],
          ["MR No. (global running)", mr.no],
          ["Name of Project", mr.project],
          ["SO No.", mr.so],
        ].map(([k, v]) => (
          <div key={k}>
            <div className="kicker text-jce-green-600">{k}</div>
            <div className="mt-1 text-ui-13 text-jce-ink">{v}</div>
          </div>
        ))}
      </div>

      <div className="solid rounded-(--r-solid) p-5">
        <h2 className="text-ui-14 font-semibold text-jce-ink">
          Lines{" "}
          <span className="font-normal text-jce-ink-2">
            inventory-first — only the unfulfillable remainder goes to
            Purchasing
          </span>
        </h2>
        <div className="mt-3 overflow-auto rounded-(--r-input) border border-jce-line">
          <table className="jtable">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Purpose</th>
                <th className="text-right">Requested</th>
                <th className="text-right">Available</th>
                <th className="text-right">Reserved</th>
                <th className="text-right">For Purchase</th>
                <th>Canvass</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => {
                const res = reservedQty(l);
                const buy = forPurchaseQty(l);
                return (
                  <tr key={l.no}>
                    <td>{l.no}</td>
                    <td>{l.desc}</td>
                    <td className="text-jce-ink-2">{l.purpose}</td>
                    <td className="num">
                      {l.reqQty} {l.unit}
                    </td>
                    <td className="num computed">
                      {l.availQty} {l.unit}
                    </td>
                    <td className="num computed">
                      {res} {l.unit}
                    </td>
                    <td
                      className={cn(
                        "num font-semibold",
                        buy > 0 ? "text-jce-orange-600" : "text-jce-ink-2",
                      )}
                    >
                      {buy} {l.unit}
                    </td>
                    <td>
                      {buy > 0 ? (
                        <Chip tone="pending">A·B·C</Chip>
                      ) : (
                        <span className="text-jce-ink-2">in stock</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="font-semibold">
                <td colSpan={6}>Total For Purchase → Purchasing</td>
                <td
                  className={cn(
                    "num",
                    forPurchaseTotal > 0
                      ? "text-jce-orange-600"
                      : "text-jce-ink-2",
                  )}
                >
                  {forPurchaseTotal}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        {fullyInStock ? (
          <div className="mt-4 flex items-start gap-2 rounded-(--r-input) border border-(--st-success) bg-(--st-success-bg) px-4 py-3 text-ui-12 text-(--st-success-ink)">
            <span aria-hidden>✓</span>
            <span>
              Every line is covered by stock — <strong>For Purchase = 0</strong>
              , so nothing hands off to Purchasing. On approval the quantities
              are reserved against warehouse stock.
            </span>
          </div>
        ) : (
          <div className="mt-4 flex items-start gap-2 rounded-(--r-input) border border-jce-line bg-(--table-zebra) px-4 py-3 text-ui-12 text-jce-ink-2">
            <span aria-hidden>✓</span>
            <span>
              On approval: in-stock quantities reserved (StockReservation —
              Warehouse, Part 8); For-Purchase lines flow to Purchasing (Part 7)
              with canvass quotes; fully-stocked lines produce zero For-Purchase
              and no hand-off.{" "}
              <strong>PROPOSED — downstream owners not yet built.</strong>
            </span>
          </div>
        )}

        <div className="mt-5">
          <h3 className="flex flex-wrap items-center gap-2 text-ui-13 font-semibold text-jce-ink">
            Signatories
            <span className="rounded bg-(--table-zebra) px-2 py-0.5 text-[10px] font-semibold text-jce-ink-2">
              JCE-F-WMS02 · print-only
            </span>
          </h3>
          <PrintSignatureBlock
            signatories={[
              { role: "Requested by" },
              { role: "Noted by" },
              { role: "Received by (Purchasing)" },
              { role: "Approved by (Dept Head)" },
              { role: "Verified by Warehouse" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
