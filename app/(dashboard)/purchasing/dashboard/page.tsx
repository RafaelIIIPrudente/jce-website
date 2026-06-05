import type { Metadata } from "next";
import Link from "next/link";

import { ccyAmt } from "@/lib/mock/format";
import {
  POS,
  IMPORT_STAGES,
  importProgress,
  type PurchaseOrder,
} from "@/lib/mock/purchasing";
import { PageHeader } from "@/components/jce/page-header";
import { KpiTile } from "@/components/jce/kpi-tile";
import { DocChip } from "@/components/jce/doc-chip";
import { Chip } from "@/components/jce/chip";

export const metadata: Metadata = { title: "Purchasing" };

// U1 · Purchasing dashboard (pur-core.jsx:10). KPI tiles deep-link to the
// ledger / tracker / approvals. Sad path: zero-awaiting collapses the awaiting
// tile to a calm "all clear"; a blocked import stage surfaces a danger chip.
const SPEND = [50, 72, 40, 88, 60, 75];

export default function PurchasingDashboardPage() {
  const awaiting: PurchaseOrder[] = POS.filter(
    (p) => p.status === "For Approval" || p.status === "Sent",
  );
  const { firstBlocked } = importProgress(IMPORT_STAGES);
  const blockedHref = firstBlocked
    ? `/purchasing/orders/${POS.find((p) => p.stage != null)?.no ?? "2605-0188IC"}/tracker`
    : "/purchasing/orders";

  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-5">
      <PageHeader
        kicker="Purchasing · U1"
        title="Purchasing"
        description="POs awaiting approval, balances due, shipments arriving."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/purchasing/approvals"
          className="focus-ring-jce rounded-(--r-glass)"
        >
          {awaiting.length > 0 ? (
            <KpiTile
              label="POs awaiting approval"
              value={awaiting.length}
              delta="▲ 1 today"
              tone="pending"
            />
          ) : (
            <KpiTile
              label="POs awaiting approval"
              value="All clear"
              delta="Nothing pending"
              tone="success"
            />
          )}
        </Link>
        <Link
          href="/purchasing/rfp"
          className="focus-ring-jce rounded-(--r-glass)"
        >
          <KpiTile
            label="Balances due this week"
            value="₱2.08M"
            delta="1 overdue"
            tone="danger"
          />
        </Link>
        <Link
          href="/purchasing/orders/2604-0177IC/tracker"
          className="focus-ring-jce rounded-(--r-glass)"
        >
          <KpiTile
            label="Shipments arriving"
            value={2}
            delta="ETA ≤ 7 days"
            tone="info"
          />
        </Link>
        <Link href={blockedHref} className="focus-ring-jce rounded-(--r-glass)">
          <KpiTile
            label="Missing import docs"
            value={firstBlocked ? 1 : 0}
            delta={
              firstBlocked ? `stage ${firstBlocked.n} blocked` : "all docs in"
            }
            tone={firstBlocked ? "danger" : "success"}
          />
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-(--r-glass) p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-ui-14 font-semibold text-jce-ink">
              POs awaiting approval
            </h2>
            <Link
              href="/purchasing/orders"
              className="focus-ring-jce rounded-(--r-chip) text-ui-12 font-semibold text-jce-green-700 hover:text-jce-green-900"
            >
              PO ledger →
            </Link>
          </div>
          <div className="solid rounded-(--r-solid) p-0">
            {awaiting.length === 0 ? (
              <div className="px-3 py-8 text-center text-ui-12 text-jce-ink-2">
                All caught up — nothing awaiting approval.
              </div>
            ) : (
              awaiting.slice(0, 3).map((p) => (
                <Link
                  key={p.no}
                  href={`/purchasing/orders/${p.no}`}
                  className="flex items-center gap-3 border-b border-jce-line px-3 py-2.5 last:border-0 hover:bg-(--table-focus)"
                >
                  <DocChip code={p.no} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-ui-13 font-semibold text-jce-ink">
                      {p.supplier}
                    </div>
                    <div className="truncate text-ui-12 text-jce-ink-2">
                      {p.project} · {p.desc}
                    </div>
                  </div>
                  <div className="money shrink-0 text-ui-13 font-semibold text-jce-ink">
                    {ccyAmt(p.amount, p.ccy)}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="glass rounded-(--r-glass) p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-ui-14 font-semibold text-jce-ink">
              Spend snapshot
            </h2>
            <Chip tone="neutral">last 6 mo</Chip>
          </div>
          <div className="solid flex h-40 items-end gap-3 rounded-(--r-solid) p-4">
            {SPEND.map((h, i) => (
              <div
                key={i}
                className={
                  i === 2
                    ? "flex-1 rounded-t bg-jce-orange-500"
                    : "flex-1 rounded-t bg-jce-green-600"
                }
                style={{ height: `${h}%` }}
                aria-hidden
              />
            ))}
          </div>
          <p className="mt-2 text-ui-12 text-jce-ink-2">
            Monthly committed spend across Local + Import POs.
          </p>
        </div>
      </div>
    </div>
  );
}
