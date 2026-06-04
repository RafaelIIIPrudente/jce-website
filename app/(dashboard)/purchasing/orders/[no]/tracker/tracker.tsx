"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, LockIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import {
  IMPORT_STAGES,
  STAGE_TONE,
  LOCAL_STAGES,
  importProgress,
  type PurchaseOrder,
  type ImportStage,
  type StageStatus,
} from "@/lib/mock/purchasing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

const ORDER: readonly StageStatus[] = ["Pending", "In Progress", "Done"];

// U7 · 15-stage import tracker (FLAGSHIP · pur-tracker.jsx:5) + U8 local 5-stage
// (pur-tracker.jsx:148). Branches on po.type. Gates 4 & 7 are sticky stall
// banners; stage 15 consolidates with the Warehouse MRR. Advance / Resolve verbs
// are present only for canVerb roles (read-only otherwise).
export function Tracker({ po }: { po: PurchaseOrder }) {
  return po.type === "Import" ? (
    <ImportTracker po={po} />
  ) : (
    <LocalTracker po={po} />
  );
}

function ImportTracker({ po }: { po: PurchaseOrder }) {
  const { role } = useJce();
  const mayVerb = canVerb(role, "pur");
  const [stages, setStages] = useState<ImportStage[]>(() => [...IMPORT_STAGES]);
  const { done, total, firstBlocked, gate4, gate7 } = importProgress(stages);

  const advance = (n: number) =>
    setStages((prev) =>
      prev.map((s) => {
        if (s.n !== n) return s;
        const nx: StageStatus =
          s.status === "Blocked"
            ? "In Progress"
            : (ORDER[Math.min(ORDER.indexOf(s.status) + 1, 2)] ?? "Done");
        return {
          ...s,
          status: nx,
          actual: nx === "Done" ? "2026-06-03" : s.actual,
        };
      }),
    );

  const deg = (done / total) * 360;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <BackLink no={po.no} />
      <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-(--r-glass) p-4">
        <div>
          <div className="kicker">Purchasing · U7 · Import tracker</div>
          <div className="mt-1 flex items-center gap-2">
            <DocChip code={po.no} />
            <span className="text-ui-13 text-jce-ink-2">
              {po.supplier} · BOM → onsite delivery
            </span>
          </div>
        </div>
        <div
          className="grid size-20 place-items-center rounded-full"
          style={{
            background: `conic-gradient(var(--jce-green-600) ${deg}deg, var(--jce-line) 0)`,
          }}
        >
          <span className="grid size-15 place-items-center rounded-full bg-(--solid-surface) font-mono text-ui-14 font-bold text-jce-ink">
            {done}/{total}
          </span>
        </div>
      </div>

      {/* Sticky gate banners — gates 4 & 7 are the primary stall points. */}
      <div className="sticky top-0 z-10 flex flex-col gap-2">
        {[gate4, gate7].map((g) =>
          g ? (
            <div
              key={g.n}
              className={cn(
                "solid flex items-center gap-3 rounded-(--r-solid) border-l-4 px-3 py-2.5",
                g.status === "Blocked"
                  ? "border-l-(--st-danger)"
                  : g.status === "Done"
                    ? "border-l-(--st-success)"
                    : "border-l-(--st-pending)",
              )}
            >
              <LockIcon
                className={cn(
                  "size-4 shrink-0",
                  g.status === "Blocked"
                    ? "text-(--st-danger)"
                    : "text-jce-ink-2",
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="text-ui-13 font-semibold text-jce-ink">
                  Gate {g.n} — {g.name}
                </div>
                <div className="text-ui-12 text-jce-ink-2">
                  {g.status === "Blocked"
                    ? "Approval gate stalled. Needs President / Finance action; balance reconciles with the linked RFP."
                    : `Gate ${g.status === "Done" ? "cleared" : "in progress"}.`}
                </div>
              </div>
              <Chip tone={STAGE_TONE[g.status] ?? "neutral"}>{g.status}</Chip>
              {mayVerb && g.status === "Blocked" ? (
                <Button variant="lock" size="sm" onClick={() => advance(g.n)}>
                  Resolve gate
                </Button>
              ) : null}
            </div>
          ) : null,
        )}
      </div>

      {firstBlocked ? (
        <p className="rounded-(--r-solid) border border-(--st-danger) bg-(--st-danger-bg) px-3 py-2 text-ui-12 text-(--st-danger-ink)">
          Stage {firstBlocked.n} ({firstBlocked.name}) is blocked. Stages are
          not strictly sequential — 8/9 may overlap and stage 11 documents
          arrive incrementally.
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        {stages.map((s) => (
          <div
            key={s.n}
            className={cn(
              "solid flex flex-wrap items-center gap-3 rounded-(--r-solid) p-3",
              s.gate && "border-l-4 border-l-jce-orange-500",
            )}
          >
            <div className="grid size-7 shrink-0 place-items-center rounded-full bg-jce-green-100 font-mono text-ui-12 font-bold text-jce-green-700">
              {s.status === "Done" ? "✓" : s.n}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-ui-13 font-semibold text-jce-ink">
                {s.name}
                {s.gate ? <Chip tone="pending">approval gate</Chip> : null}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-ui-12 text-jce-ink-2">
                {s.owner}
                {s.docs.length > 0 ? (
                  s.docs.map((d) => (
                    <span
                      key={d}
                      className="rounded-(--r-chip) border border-jce-line bg-(--docchip-bg) px-1.5 py-0.5 font-mono text-[11px] text-jce-green-900"
                    >
                      {d}
                    </span>
                  ))
                ) : s.n === 11 ? null : (
                  <span className="text-jce-ink-2 italic">no docs yet</span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-4 text-ui-12">
              <div>
                <div className="text-jce-ink-2">Target</div>
                <div className="mono">{s.target}</div>
              </div>
              <div>
                <div className="text-jce-ink-2">Actual</div>
                <div className="mono">{s.actual}</div>
              </div>
            </div>
            <Chip tone={STAGE_TONE[s.status] ?? "neutral"}>{s.status}</Chip>
            {mayVerb && s.status !== "Done" ? (
              <Button variant="ghost" size="sm" onClick={() => advance(s.n)}>
                Advance
              </Button>
            ) : null}
          </div>
        ))}
      </div>

      <p className="text-ui-12 text-jce-ink-2">
        Alerts: ETA 7 / 3 / 1-day, balance payment due / overdue. Stage 15
        consolidates with the Warehouse MRR (same event, two surfaces —
        Warehouse owns it, Part 8).
      </p>
    </div>
  );
}

function LocalTracker({ po }: { po: PurchaseOrder }) {
  const { role } = useJce();
  const mayVerb = canVerb(role, "pur");
  const cur = po.localStage ?? 0;
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <BackLink no={po.no} />
      <PageHeader
        kicker="Purchasing · U8 · Local tracker"
        title={<DocChip code={po.no} />}
        actions={<Chip tone="pending">Stall alert: 14 days</Chip>}
      />
      <div className="solid rounded-(--r-solid) p-6">
        <ol className="flex flex-col gap-0 sm:flex-row sm:items-start">
          {LOCAL_STAGES.map(([name, desc], i) => {
            const state = i < cur ? "done" : i === cur ? "curr" : "todo";
            return (
              <li
                key={name}
                className="flex flex-1 items-start gap-3 sm:flex-col sm:items-center sm:text-center"
              >
                <div
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full font-mono text-ui-13 font-bold",
                    state === "done" &&
                      "bg-jce-green-700 text-primary-foreground",
                    state === "curr" && "bg-jce-green-100 text-jce-green-700",
                    state === "todo" && "bg-(--table-zebra) text-jce-ink-2",
                  )}
                >
                  {state === "done" ? "✓" : i + 1}
                </div>
                <div
                  className={cn(
                    "pb-4 sm:pb-0",
                    state === "todo" && "opacity-60",
                  )}
                >
                  <div className="text-ui-13 font-semibold text-jce-ink">
                    {name}
                  </div>
                  <div className="text-ui-12 text-jce-ink-2">{desc}</div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-ui-12 text-jce-ink-2">
          Default for POs ≥ ₱20K. Stage 5 Closed auto when Paid + Fully
          Received.
        </p>
        {mayVerb && cur >= 3 && cur < 5 ? (
          <Button
            variant="lock"
            size="sm"
            onClick={() =>
              toast.success(
                "Closed (Supervisor override) — Paid + Fully Received.",
              )
            }
          >
            Override → Closed
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function BackLink({ no }: { no: string }) {
  return (
    <Link
      href={`/purchasing/orders/${no}`}
      className="focus-ring-jce inline-flex w-fit items-center gap-1.5 rounded-(--r-chip) text-ui-12 font-semibold text-jce-ink-2 hover:text-jce-green-900"
    >
      <ArrowLeftIcon className="size-3.5" aria-hidden /> PO detail
    </Link>
  );
}
