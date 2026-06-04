"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";

import { pmoney } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import {
  RFQ_MATRIX_SUPPLIERS,
  RFQ_MATRIX_ROWS,
  lowestIdx,
  type Rfq,
} from "@/lib/mock/purchasing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import {
  ComparisonMatrix,
  type MatrixColumn,
  type MatrixRow,
} from "@/components/jce/comparison-matrix";

// U16 · RFQ comparison matrix (pur-phase2a.jsx:213). Auto-highlights the lowest
// price + shortest lead per line and the overall winner. An off-lowest award
// requires a justification note (required + logged).
export function RfqComparison({ rfq }: { rfq: Rfq }) {
  const { role } = useJce();
  const canAward = canEdit(role, "pur");

  const totals = RFQ_MATRIX_SUPPLIERS.map((_, i) =>
    RFQ_MATRIX_ROWS.reduce((a, r) => a + (r.prices[i] ?? 0), 0),
  );
  const winnerIdx = lowestIdx(totals);
  const [selected, setSelected] = useState<number>(winnerIdx);
  const [reason, setReason] = useState("");
  const partial = rfq.responses < rfq.invited;

  const columns: MatrixColumn[] = RFQ_MATRIX_SUPPLIERS.map((s, i) => ({
    id: s,
    label: s,
    winner: i === winnerIdx,
  }));

  const rows: MatrixRow[] = [];
  RFQ_MATRIX_ROWS.forEach((r) => {
    const lp = lowestIdx(r.prices);
    const ll = lowestIdx(r.leads);
    rows.push({
      label: `${r.item} · unit price`,
      cells: r.prices.map((p, i) => ({
        value: `₱${pmoney(p)}`,
        best: i === lp,
        align: "right",
      })),
    });
    rows.push({
      label: `${r.item} · lead time`,
      cells: r.leads.map((l, i) => ({
        value: `${l}d`,
        best: i === ll,
        align: "right",
      })),
    });
  });
  rows.push({
    label: "Extended total",
    cells: totals.map((t, i) => ({
      value: `₱${pmoney(t)}`,
      best: i === winnerIdx,
      align: "right",
    })),
  });

  const offLowest = selected !== winnerIdx;
  const canSubmitAward = !offLowest || reason.trim() !== "";

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <Link
        href="/purchasing/phase-2/rfq"
        className="focus-ring-jce inline-flex w-fit items-center gap-1.5 rounded-(--r-chip) text-ui-12 font-semibold text-jce-ink-2 hover:text-jce-green-900"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden /> RFQ list
      </Link>
      <PageHeader
        kicker="Purchasing · U16 · Phase 2"
        title={`RFQ comparison — ${rfq.no}`}
        description={rfq.item}
        actions={
          canAward ? (
            <Button
              size="sm"
              disabled={!canSubmitAward}
              onClick={() =>
                toast.success(
                  `Awarded ${RFQ_MATRIX_SUPPLIERS[selected]} → draft PO${offLowest ? " (off-lowest justification logged)" : ""}.`,
                )
              }
            >
              Award → draft PO
            </Button>
          ) : null
        }
      />

      {partial ? (
        <p className="rounded-(--r-solid) border border-(--st-pending) bg-(--st-pending-bg) px-3 py-2 text-ui-12 text-(--st-pending-ink)">
          Partial responses ({rfq.responses}/{rfq.invited}) — comparison is
          incomplete until all invited suppliers respond.
        </p>
      ) : null}

      <ComparisonMatrix rowHeader="Item" columns={columns} rows={rows} />

      {canAward ? (
        <div className="solid flex flex-col gap-3 rounded-(--r-solid) p-4">
          <div className="text-ui-13 font-semibold text-jce-ink">Award</div>
          <div className="flex flex-wrap gap-2">
            {RFQ_MATRIX_SUPPLIERS.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelected(i)}
                className={
                  selected === i
                    ? "rounded-(--r-chip) border border-jce-green-600 bg-jce-green-50 px-3 py-1.5 text-ui-12 font-semibold text-jce-green-900"
                    : "rounded-(--r-chip) border border-jce-line px-3 py-1.5 text-ui-12 text-jce-ink-2 hover:border-jce-green-500"
                }
              >
                {s}
                {i === winnerIdx ? " ★ lowest" : ""}
              </button>
            ))}
          </div>
          {offLowest ? (
            <label className="flex flex-col gap-1">
              <span className="text-ui-12 font-semibold text-(--st-pending-ink)">
                Off-lowest award — justification required *
              </span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="field min-h-16"
                placeholder="Why is a higher-priced / longer-lead quote being awarded? (logged)"
              />
            </label>
          ) : (
            <Chip tone="success">Awarding the lowest extended total</Chip>
          )}
        </div>
      ) : null}

      <p className="text-ui-12 text-jce-ink-2">
        Auto-highlights lowest price &amp; shortest lead per line and overall.
        Award converts to a prefilled draft PO.
      </p>
    </div>
  );
}
