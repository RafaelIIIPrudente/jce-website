"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { ROLES, canEdit } from "@/lib/rbac";
import {
  EVENT_TONE,
  QRESP_TONE,
  lowestPrice,
  type OfferEvent,
  type Quotation,
  type SupplierQuote,
  type Tone,
} from "@/lib/mock/bdd";
import { peso } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import {
  ComparisonMatrix,
  type MatrixColumn,
  type MatrixRow,
} from "@/components/jce/comparison-matrix";
import { Timeline, type TimelineEvent } from "@/components/jce/timeline";
import { EmptyState } from "@/components/jce/empty-state";

// B6 · Quotation comparison (bdd-flagships.jsx:90-128, brief:1060-1066). Supplier
// quotes matrix with lowest-price highlight + response-status chips. Select
// Winner is an EVENT on an immutable request (fires a sensitive-change
// notification). Strictly divergent from edit-after-issue (OQ#16).

function tlTone(t: Tone): TimelineEvent["tone"] {
  if (t === "success" || t === "info") return "green";
  if (t === "pending" || t === "danger") return "orange";
  return "ink";
}
function timestamp(): string {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}

export function QuotationDetail({
  quotation,
  seedQuotes,
}: {
  quotation: Quotation;
  seedQuotes: readonly SupplierQuote[];
}) {
  const { role, addNotification } = useJce();
  const readOnly = !canEdit(role, "bdd");

  const initialWinner =
    seedQuotes.find((q) => q.winner)?.supplier ?? quotation.winner ?? null;
  const [winner, setWinner] = useState<string | null>(initialWinner);
  const [events, setEvents] = useState<OfferEvent[]>(() => {
    const priced: OfferEvent[] = seedQuotes
      .filter((q) => q.price != null)
      .map((q) => ({
        type: "Price Recorded",
        data: `${q.supplier} · ${peso(q.price as number)}`,
        ts: q.respDate,
        user: "B. Navarro",
      }));
    if (initialWinner) {
      priced.unshift({
        type: "Selected as Winner",
        data: initialWinner,
        ts: "2026-05-22 10:30",
        user: "B. Navarro",
      });
    }
    return priced;
  });

  const lowest = lowestPrice(seedQuotes);

  const selectWinner = (supplier: string) => {
    if (supplier === winner) return;
    setWinner(supplier);
    setEvents((ev) => [
      {
        type: "Selected as Winner",
        data: supplier,
        ts: timestamp(),
        user: ROLES[role].short,
      },
      ...ev,
    ]);
    addNotification({
      mod: "BDD",
      type: "Sensitive",
      tone: "danger",
      unread: true,
      msg: `Winner selected on ${quotation.ref} → ${supplier}`,
      time: "just now",
      doc: quotation.ref,
    });
    toast.success(`Winner recorded — ${supplier} (sensitive-change sent)`);
  };

  const columns: MatrixColumn[] = seedQuotes.map((q) => ({
    id: q.supplier,
    label: q.supplier,
    winner: winner === q.supplier,
  }));
  const rows: MatrixRow[] = [
    {
      label: "Unit price",
      cells: seedQuotes.map((q) => ({
        value: q.price != null ? peso(q.price) : "—",
        best: q.price != null && q.price === lowest,
        align: "right",
      })),
    },
    {
      label: "Response date",
      cells: seedQuotes.map((q) => ({ value: q.respDate })),
    },
    {
      label: "Status",
      cells: seedQuotes.map((q) => ({
        value: <Chip tone={QRESP_TONE[q.status] ?? "neutral"}>{q.status}</Chip>,
      })),
    },
    {
      label: "Notes",
      cells: seedQuotes.map((q) => ({ value: q.note })),
    },
  ];

  const tlEvents: TimelineEvent[] = events.map((e) => ({
    title: (
      <>
        <span className="font-semibold">{e.type}</span>
        {" — "}
        {e.data}
      </>
    ),
    meta: `${e.user} · ${e.ts}`,
    tone: tlTone(EVENT_TONE[e.type] ?? "neutral"),
  }));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <Link
        href="/bdd/quotations"
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Quotations
      </Link>

      {/* Immutable request header (glass) */}
      <div className="glass rounded-(--r-glass) p-5">
        <div className="flex flex-wrap items-center gap-2">
          <DocChip code={quotation.ref} />
          <Chip tone="neutral">{quotation.cat}</Chip>
          {quotation.offer ? <DocChip code={quotation.offer} /> : null}
          {quotation.so && quotation.so !== "WORKSHOP" ? (
            <DocChip code={quotation.so} />
          ) : null}
          <span className="ml-auto rounded bg-(--st-locked-bg) px-2 py-0.5 text-[10px] font-semibold text-(--st-locked-ink)">
            Immutable request
          </span>
        </div>
        <h1 className="mt-2 text-ui-22 font-bold tracking-tight text-jce-ink">
          {quotation.item}
        </h1>
        <p className="mt-1 text-ui-13 text-jce-ink-2">
          {quotation.client} · requested {quotation.date} ·{" "}
          {quotation.responded}/{quotation.invited} responded
        </p>
      </div>

      {seedQuotes.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            title="No supplier quotes recorded"
            description="Add supplier quotes (immutable children) to begin the comparison."
          />
        </div>
      ) : (
        <>
          <ComparisonMatrix
            rowHeader="Criterion"
            columns={columns}
            rows={rows}
          />

          {!readOnly ? (
            <div className="solid flex flex-wrap items-center gap-2 rounded-(--r-solid) p-4">
              <span className="mr-1 text-ui-12 font-semibold text-jce-ink-2">
                Select winner:
              </span>
              {seedQuotes.map((q) => (
                <Button
                  key={q.supplier}
                  size="sm"
                  variant={winner === q.supplier ? "approve" : "outline"}
                  disabled={q.price == null}
                  onClick={() => selectWinner(q.supplier)}
                >
                  {winner === q.supplier
                    ? `Winner · ${q.supplier}`
                    : q.supplier}
                </Button>
              ))}
            </div>
          ) : null}

          <div className="solid rounded-(--r-solid) p-5">
            <h2 className="mb-4 text-ui-16 font-semibold text-jce-ink">
              Event stream
            </h2>
            <Timeline events={tlEvents} />
          </div>
        </>
      )}
    </div>
  );
}
