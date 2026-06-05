import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import { pmoney } from "@/lib/mock/format";
import { BUDGET_ROWS } from "@/lib/mock/purchasing";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";

export const metadata: Metadata = { title: "Budget vs actual" };

// U21 · Budget vs actual per project (pur-phase2b.jsx:230). Committed = approved
// + open POs; Actual = paid RFPs. Over-budget (committed > 100%) → danger.
export default function PurchasingBudgetPage() {
  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-4">
      <PageHeader
        kicker="Purchasing · U21 · Phase 2"
        title="Budget vs actual per project"
        description="Committed = approved + open POs · Actual = paid RFPs."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {BUDGET_ROWS.map((r) => {
          const usedPct = Math.round((r.actual / r.budget) * 100);
          const commPct = Math.round((r.committed / r.budget) * 100);
          const over = commPct > 100;
          const remaining = r.budget - r.committed;
          return (
            <div
              key={r.proj}
              className="solid flex flex-col gap-3 rounded-(--r-solid) p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-ui-13 font-semibold text-jce-ink">
                  {r.proj}
                </div>
                <Chip tone={over ? "danger" : "success"}>
                  {over ? `⚠ over budget ${commPct}%` : `${commPct}% committed`}
                </Chip>
              </div>
              <div className="flex h-2.5 w-full overflow-hidden rounded-(--r-pill) bg-(--table-zebra)">
                <div
                  className="bg-jce-green-700"
                  style={{ width: `${Math.min(usedPct, 100)}%` }}
                />
                <div
                  className="bg-jce-green-500"
                  style={{
                    width: `${Math.max(0, Math.min(commPct, 100) - Math.min(usedPct, 100))}%`,
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-4 text-ui-12 text-jce-ink-2">
                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full bg-jce-green-700"
                    aria-hidden
                  />
                  Actual {pmoney(r.actual)}
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full bg-jce-green-500"
                    aria-hidden
                  />
                  Committed {pmoney(r.committed)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-jce-line pt-2 text-ui-12">
                <div>
                  <div className="text-jce-ink-2">Budget</div>
                  <div className="font-mono tabular-nums text-jce-ink">
                    {pmoney(r.budget)}
                  </div>
                </div>
                <div>
                  <div className="text-jce-ink-2">Remaining</div>
                  <div
                    className={cn(
                      "font-mono tabular-nums",
                      remaining < 0 ? "text-(--st-danger)" : "text-jce-ink",
                    )}
                  >
                    {pmoney(remaining)}
                  </div>
                </div>
                <div>
                  <div className="text-jce-ink-2">% used</div>
                  <div className="font-mono tabular-nums text-jce-ink">
                    {usedPct}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-ui-12 text-jce-ink-2">
        Over-budget warnings fire at PO / PR time — configurable
        warn-vs-hard-block behavior (ties to PMG P19).
      </p>
    </div>
  );
}
