import type { Metadata } from "next";
import Link from "next/link";

import { PMG_TIMELINE, PROJECTS_PMG, getMrs } from "@/lib/mock/pmg";
import { pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { KpiTile } from "@/components/jce/kpi-tile";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

export const metadata: Metadata = { title: "PMG Dashboard" };

// P1 · PMG dashboard (pmg-screens.jsx:10). KPIs + projects needing a period
// update + recent cross-module stock movements. Module landing (OQ#7).
export default function PmgDashboardPage() {
  const customers = PROJECTS_PMG.filter((p) => p.type === "Customer");
  const openMrs = getMrs().filter((m) => m.status !== "Fulfilled");
  const onHold = customers.filter((p) => p.status === "On Hold").length;
  const pendingMrs = getMrs().filter(
    (m) => m.status === "Pending approval",
  ).length;
  const moves = PMG_TIMELINE.filter(
    (t) => t.type === "stock" || t.type === "po",
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <div>
        <h1 className="text-ui-28 font-bold tracking-tight text-jce-ink">
          Project Management
        </h1>
        <p className="mt-1 text-ui-14 text-jce-ink-2">
          What needs attention across the portfolio.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          label="Active projects"
          value={customers.length}
          delta={`${onHold} on hold`}
          tone="info"
        />
        <KpiTile
          label="Needing a period update"
          value={customers.length}
          delta="accomplishment due"
          tone="pending"
        />
        <KpiTile
          label="Open MRs"
          value={openMrs.length}
          delta={`${pendingMrs} pending approval`}
        />
        <KpiTile
          label="To-Date near 100%"
          value={1}
          delta="guardrail"
          tone="danger"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-(--r-glass) p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-ui-16 font-semibold text-jce-ink">
              Projects needing a period update
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/pmg/portfolio">Portfolio</Link>
            </Button>
          </div>
          <div className="solid divide-y divide-jce-line overflow-hidden rounded-(--r-solid)">
            {customers.map((p) => (
              <Link
                key={p.code}
                href={`/pmg/projects/${p.code}/accomplishment`}
                className="focus-ring-jce flex flex-wrap items-center gap-3 p-3 transition-colors hover:bg-jce-green-50"
              >
                {p.so ? <DocChip code={p.so} /> : null}
                <div className="min-w-40 flex-1">
                  <div className="text-ui-13 font-medium text-jce-ink">
                    {p.name}
                  </div>
                  <div className="text-ui-12 text-jce-ink-2">
                    {p.period} · {pmoney(p.pct)}% to date
                  </div>
                </div>
                <Chip tone="pending">Update</Chip>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass rounded-(--r-glass) p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-ui-16 font-semibold text-jce-ink">
              Recent stock movements
            </h2>
            <Chip tone="neutral">read · Warehouse</Chip>
          </div>
          <div className="solid divide-y divide-jce-line overflow-hidden rounded-(--r-solid)">
            {moves.map((t) => (
              <div key={t.link} className="flex gap-2.5 p-3">
                <span
                  className="mt-1.5 size-2 shrink-0 rounded-full bg-(--st-info)"
                  aria-hidden
                />
                <div className="min-w-0">
                  <div className="text-ui-13 text-jce-ink">{t.txt}</div>
                  <div className="mt-0.5 text-ui-12 text-jce-ink-2">
                    {t.actor} · {t.ts}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-ui-12 text-jce-ink-2">
        PMG lands on this dashboard for now; per-role landing pages are
        OPEN-Q&nbsp;#7 — PROPOSED.
      </p>
    </div>
  );
}
