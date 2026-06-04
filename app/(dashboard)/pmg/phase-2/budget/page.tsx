import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import { peso } from "@/lib/mock/format";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";

export const metadata: Metadata = { title: "Budget vs actual" };

// P19 · Project budget vs actual (pmg-phase2.jsx:542). Contract / committed /
// actual bars (ties to Purchasing U21 — PROPOSED, Part 7).
const ROWS = [
  {
    proj: "NORECO II — 13.2KV",
    contract: 53277688,
    committed: 18400000,
    actual: 9820000,
  },
  {
    proj: "Cavite 69KV",
    contract: 38400000,
    committed: 24200000,
    actual: 19600000,
  },
  {
    proj: "Solar Tarlac",
    contract: 62000000,
    committed: 54800000,
    actual: 51200000,
  },
];

export default function BudgetPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        kicker="PMG · P19 · Phase 2"
        title="Project budget vs actual"
        description="BOQ contract vs committed POs & issued materials · ties to Purchasing U21."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {ROWS.map((r) => {
          const usedPct = Math.round((r.actual / r.contract) * 100);
          const commPct = Math.round((r.committed / r.contract) * 100);
          const remaining = r.contract - r.committed;
          const over = commPct > 90;
          return (
            <div
              key={r.proj}
              className="solid flex flex-col gap-3 rounded-(--r-solid) p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-ui-13 font-semibold text-jce-ink">
                  {r.proj}
                </div>
                <Chip tone={over ? "pending" : "success"}>
                  {commPct}% committed
                </Chip>
              </div>
              <div className="flex h-2.5 w-full overflow-hidden rounded-(--r-pill) bg-(--table-zebra)">
                <div
                  className="bg-jce-green-700"
                  style={{ width: `${usedPct}%` }}
                />
                <div
                  className="bg-jce-green-500"
                  style={{ width: `${Math.max(0, commPct - usedPct)}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-4 text-ui-12 text-jce-ink-2">
                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full bg-jce-green-700"
                    aria-hidden
                  />
                  Actual {peso(r.actual)}
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full bg-jce-green-500"
                    aria-hidden
                  />
                  Committed {peso(r.committed)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-jce-line pt-2 text-ui-12">
                <div>
                  <div className="text-jce-ink-2">Contract</div>
                  <div className="font-mono tabular-nums text-jce-ink">
                    {peso(r.contract)}
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
                    {peso(remaining)}
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
    </div>
  );
}
