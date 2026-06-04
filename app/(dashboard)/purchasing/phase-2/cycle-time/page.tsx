import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import { CYCLE_STAGES } from "@/lib/mock/purchasing";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";

export const metadata: Metadata = { title: "Cycle-time" };

// U23 · Cycle-time analytics (pur-phase2b.jsx:462). Per-stage mean/median bars,
// slowest stage highlighted as the bottleneck.
export default function CycleTimePage() {
  const maxV = Math.max(...CYCLE_STAGES.map((s) => s.mean));
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <PageHeader
        kicker="Purchasing · U23 · Phase 2"
        title="Cycle-time analytics"
        description="Mean stage duration (days) — slowest stage highlighted."
        actions={
          <div className="flex gap-2">
            <select className="field h-9 w-auto" aria-label="Supplier filter">
              <option>All suppliers</option>
            </select>
            <select className="field h-9 w-auto" aria-label="Type filter">
              <option>Import POs</option>
              <option>Local POs</option>
            </select>
          </div>
        }
      />
      <div className="solid flex flex-col gap-3 rounded-(--r-solid) p-5">
        {CYCLE_STAGES.map((s) => (
          <div key={s.name} className="flex items-center gap-3">
            <div className="w-44 shrink-0 text-ui-12 text-jce-ink">
              {s.name}
              {s.slow ? (
                <span className="ml-1.5">
                  <Chip tone="danger">bottleneck</Chip>
                </span>
              ) : null}
            </div>
            <div className="h-5 flex-1 overflow-hidden rounded-(--r-pill) bg-(--table-zebra)">
              <div
                className={cn(
                  "flex h-full items-center justify-end rounded-(--r-pill) px-2 text-[10px] font-semibold text-primary-foreground",
                  s.slow ? "bg-(--st-danger)" : "bg-jce-green-600",
                )}
                style={{ width: `${(s.mean / maxV) * 100}%` }}
              >
                {s.mean}d
              </div>
            </div>
            <div className="w-20 shrink-0 text-right font-mono text-ui-12 text-jce-ink-2">
              med {s.median}d
            </div>
          </div>
        ))}
      </div>
      <p className="text-ui-12 text-jce-ink-2">
        Per-stage mean / median with slowest-stage highlight; filters by
        supplier, project, period, item type.
      </p>
    </div>
  );
}
