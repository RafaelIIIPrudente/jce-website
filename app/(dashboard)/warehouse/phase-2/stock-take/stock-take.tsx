"use client";

import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { qn } from "@/lib/mock/format";
import { STOCKTAKE_ITEMS } from "@/lib/mock/warehouse";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";

// W11 · Stock-take / cycle counting (wh-phase2.jsx:128). System on-hand
// (.computed) vs Counted (editable) → Variance. Review posts variance
// Adjustments (signed movements + mandatory reason). On-hand is never typed —
// the count posts a movement.
export function StockTake() {
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(STOCKTAKE_ITEMS.map((it) => [it.k, it.system])),
  );
  const variances = STOCKTAKE_ITEMS.filter(
    (it) => (counts[it.k] ?? it.system) - it.system !== 0,
  ).length;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        kicker="Warehouse · W11 · Phase 2"
        title="Stock-take — count session"
        actions={
          <>
            <Chip tone="pending">
              In progress · {STOCKTAKE_ITEMS.length} lines
            </Chip>
            <Button
              size="sm"
              onClick={() =>
                toast.success(
                  variances > 0
                    ? `Posted ${variances} variance Adjustment(s) — signed movements with mandatory reason (audited).`
                    : "No variances — nothing to post.",
                )
              }
            >
              Review & post variances
            </Button>
          </>
        }
      />

      <div className="solid grid gap-4 rounded-(--r-solid) p-4 sm:grid-cols-3">
        <Ctx k="Scope" v="Main Office + Workshop" />
        <Ctx k="Started" v="2026-06-03 09:00" />
        <Ctx k="Counter" v="G. Lim" />
      </div>

      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>Item</th>
              <th>Location</th>
              <th className="num">System on-hand</th>
              <th className="num">Counted</th>
              <th className="num">Variance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {STOCKTAKE_ITEMS.map((it) => {
              const counted = counts[it.k] ?? it.system;
              const v = counted - it.system;
              return (
                <tr key={it.k}>
                  <td className="font-semibold">{it.item}</td>
                  <td>{it.loc}</td>
                  <td className="num">
                    <span className="computed">
                      {qn(it.system)} {it.unit}
                    </span>
                  </td>
                  <td className="num">
                    <input
                      type="number"
                      value={counted}
                      onChange={(e) =>
                        setCounts((c) => ({
                          ...c,
                          [it.k]: Number(e.target.value) || 0,
                        }))
                      }
                      className="field h-8 w-24 text-right"
                      aria-label={`Counted ${it.item}`}
                    />
                  </td>
                  <td
                    className={cn(
                      "num font-bold",
                      v < 0
                        ? "text-(--st-danger)"
                        : v > 0
                          ? "text-(--st-success)"
                          : "text-jce-ink-2",
                    )}
                  >
                    {v > 0 ? "+" : ""}
                    {qn(v)}
                  </td>
                  <td>
                    {v !== 0 ? (
                      <Chip tone="pending">
                        Adj. {v > 0 ? "+" : ""}
                        {v}
                      </Chip>
                    ) : (
                      <Chip tone="success">Match</Chip>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-ui-12 text-jce-ink-2">
        Review → posts variance <strong>Adjustments</strong> (signed movements,
        mandatory reason) with full audit. On-hand is never typed directly — the
        count posts a movement.
      </p>
    </div>
  );
}

function Ctx({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-ui-12 text-jce-ink-2">{k}</div>
      <div className="text-ui-13 font-semibold text-jce-ink">{v}</div>
    </div>
  );
}
