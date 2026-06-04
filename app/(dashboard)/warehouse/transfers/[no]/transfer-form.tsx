"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { qn } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import { type Transfer } from "@/lib/mock/warehouse";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

type Phase = "Dispatch" | "In Transit" | "Confirm Receipt";
const STEPS: Phase[] = ["Dispatch", "In Transit", "Confirm Receipt"];

// W6 · Transfer flow (wh-docs.jsx:648). In-Transit counts at NEITHER location.
// Confirm Receipt (canVerb) posts Transfer-In; received ≠ dispatched → discrepancy.
export function TransferForm({ trf }: { trf: Transfer }) {
  const { role } = useJce();
  const mayConfirm = canVerb(role, "wh");

  const [phase, setPhase] = useState<Phase>(
    trf.status === "Locked" ? "Confirm Receipt" : "In Transit",
  );
  const [received, setReceived] = useState(trf.received ?? trf.dispatched);
  const discrepancy = received !== trf.dispatched;

  const phaseIdx = STEPS.indexOf(phase);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <Link
        href="/warehouse/transfers"
        className="focus-ring-jce inline-flex w-fit items-center gap-1.5 rounded-(--r-chip) text-ui-12 font-semibold text-jce-ink-2 hover:text-jce-green-900"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden /> Stock transfers
      </Link>

      <PageHeader
        kicker="Warehouse · W6"
        title={
          <span className="flex items-center gap-2">
            Transfer <DocChip code={trf.no} />
          </span>
        }
        actions={
          <Chip tone="info">
            {trf.from} → {trf.to}
          </Chip>
        }
      />

      <div className="solid flex items-center gap-1 rounded-(--r-solid) p-4">
        {STEPS.map((p, i) => {
          const done = i <= phaseIdx;
          return (
            <div key={p} className="flex flex-1 items-center gap-1">
              <div className="flex flex-1 flex-col items-center gap-1.5 text-center">
                <div
                  className={cn(
                    "grid size-8 place-items-center rounded-full font-mono text-ui-13 font-bold",
                    done
                      ? "bg-jce-green-700 text-primary-foreground"
                      : "bg-(--table-zebra) text-jce-ink-2",
                  )}
                >
                  {p === "In Transit" ? "⇄" : "✓"}
                </div>
                <div
                  className={cn(
                    "text-ui-12 font-semibold",
                    done ? "text-jce-ink" : "text-jce-ink-2",
                  )}
                >
                  {p}
                </div>
              </div>
              {i < STEPS.length - 1 ? (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    i < phaseIdx ? "bg-jce-green-700" : "bg-jce-line",
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {phase === "In Transit" ? (
        <div className="solid flex items-start gap-3 rounded-(--r-solid) border-l-4 border-l-(--st-info) p-3 text-ui-12 text-jce-ink">
          <span aria-hidden className="text-ui-16">
            ⇄
          </span>
          <span>
            In transit: <strong>{qn(trf.dispatched)} units</strong> counted at{" "}
            <strong>neither</strong> location. Dispatch posted Transfer-Out at{" "}
            {trf.from}.{" "}
            {mayConfirm
              ? `Confirm receipt to post Transfer-In at ${trf.to}.`
              : ""}
          </span>
        </div>
      ) : null}

      {phase === "In Transit" && mayConfirm ? (
        <div className="solid flex flex-col gap-3 rounded-(--r-solid) p-5">
          <label className="flex max-w-xs flex-col gap-1">
            <span className="text-ui-12 font-semibold text-jce-ink-2">
              Received qty at destination
            </span>
            <input
              type="number"
              value={received}
              onChange={(e) => setReceived(Number(e.target.value) || 0)}
              className="field h-9"
            />
          </label>
          {discrepancy ? (
            <p className="rounded-(--r-solid) border border-(--st-pending) bg-(--st-pending-bg) px-3 py-2 text-ui-12 text-(--st-pending-ink)">
              Discrepancy — received {qn(received)} ≠ dispatched{" "}
              {qn(trf.dispatched)}. Confirming raises a discrepancy flag for
              admin review (never silently adjusted).
            </p>
          ) : null}
          <Button
            size="sm"
            className="w-fit"
            onClick={() => {
              setPhase("Confirm Receipt");
              toast.success(
                discrepancy
                  ? "Transfer-In posted with a discrepancy flag for admin review."
                  : "Transfer-In posted at destination — no discrepancy.",
              );
            }}
          >
            Confirm receipt (posts Transfer-In)
          </Button>
        </div>
      ) : null}

      {phase === "In Transit" && !mayConfirm ? (
        <p className="rounded-(--r-solid) border border-jce-line bg-(--table-zebra) px-3 py-2 text-ui-12 text-jce-ink-2">
          In-transit (read-only) — only a Warehouse Admin can Confirm Receipt.
        </p>
      ) : null}

      {phase === "Confirm Receipt" ? (
        <div className="solid flex items-start gap-3 rounded-(--r-solid) border-l-4 border-l-(--st-success) p-3 text-ui-12 text-jce-ink">
          <CheckIcon
            className="mt-0.5 size-4 shrink-0 text-(--st-success)"
            aria-hidden
          />
          <div>
            <div className="text-ui-13 font-semibold">Transfer complete</div>
            Transfer-In posted at {trf.to}. Received {qn(received)}{" "}
            {discrepancy ? (
              <span className="font-semibold text-(--st-pending-ink)">
                ≠ dispatched {qn(trf.dispatched)} — discrepancy flagged.
              </span>
            ) : (
              <>= dispatched {qn(trf.dispatched)} — no discrepancy.</>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
