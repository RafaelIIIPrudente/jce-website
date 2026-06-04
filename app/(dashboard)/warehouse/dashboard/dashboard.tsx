"use client";

import Link from "next/link";

import { qn } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import {
  WH_PROJECTS,
  SITEENG_SO,
  AWAITING_CHECK_MRR,
  type WhProject,
} from "@/lib/mock/warehouse";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

// W1 · Warehouse dashboard (ARSD landing · wh-core.jsx:9). Project + cost-centre
// cards + work queues. Site Engineers see ONLY assigned-site cards (SITEENG_SO)
// with an "assigned sites only" pill.
export function WarehouseDashboard() {
  const { role } = useJce();
  const scoped = role === "siteeng";
  const cards: WhProject[] = scoped
    ? WH_PROJECTS.filter((p) => p.so === SITEENG_SO)
    : [...WH_PROJECTS];

  // Work queues, scoped for the Site Engineer to assigned-site documents.
  const checking = [
    {
      doc: AWAITING_CHECK_MRR,
      title: "Cebu Steel — steel receipt",
      meta: "For Checking · DR photo missing",
      so: "26-05-378",
    },
    {
      doc: "REL-2026-0071",
      title: "Bulacan site release",
      meta: "For Checking",
      so: "26-05-378",
    },
  ].filter((q) => !scoped || q.so === SITEENG_SO);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="Warehouse · W1"
        title="Warehouse"
        description="Project ledgers and work queues."
        actions={
          scoped ? <Chip tone="info">assigned sites only</Chip> : undefined
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((p) => (
          <Link
            key={p.name}
            href="/warehouse/ledger"
            className="glass focus-ring-jce flex flex-col gap-2 rounded-(--r-glass) p-4 hover:border-jce-green-500"
          >
            <div className="flex items-center justify-between gap-2">
              {p.so ? (
                <DocChip code={p.so} />
              ) : (
                <Chip tone="neutral">{p.type}</Chip>
              )}
              <Chip tone="info">{p.open} open</Chip>
            </div>
            <div className="text-ui-16 font-semibold text-jce-ink">
              {p.name}
            </div>
            <div className="text-ui-12 text-jce-ink-2">{p.type}</div>
            <div className="mt-1 flex gap-6 border-t border-jce-line pt-2">
              <div>
                <div className="text-ui-12 text-jce-ink-2">Items</div>
                <div className="font-mono tabular-nums text-ui-16 font-bold text-jce-ink">
                  {p.items}
                </div>
              </div>
              <div>
                <div className="text-ui-12 text-jce-ink-2">On-hand</div>
                <div className="font-mono tabular-nums text-ui-16 font-bold text-jce-ink">
                  {qn(p.onhand)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-(--r-glass) p-4">
          <h2 className="mb-3 text-ui-14 font-semibold text-jce-ink">
            Documents awaiting checking / lock
          </h2>
          <div className="solid rounded-(--r-solid) p-0">
            {checking.length === 0 ? (
              <div className="px-3 py-8 text-center text-ui-12 text-jce-ink-2">
                All caught up — nothing awaiting checking.
              </div>
            ) : (
              checking.map((q) => (
                <Link
                  key={q.doc}
                  href={
                    q.doc.startsWith("MRR")
                      ? `/warehouse/mrr/${q.doc}`
                      : `/warehouse/releases/${q.doc}`
                  }
                  className="flex items-center gap-3 border-b border-jce-line px-3 py-2.5 last:border-0 hover:bg-(--table-focus)"
                >
                  <DocChip code={q.doc} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-ui-13 font-semibold text-jce-ink">
                      {q.title}
                    </div>
                    <div className="truncate text-ui-12 text-jce-ink-2">
                      {q.meta}
                    </div>
                  </div>
                  <Chip tone="pending">Lock</Chip>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="glass rounded-(--r-glass) p-4">
          <h2 className="mb-3 text-ui-14 font-semibold text-jce-ink">Queues</h2>
          <div className="solid flex flex-col gap-0 rounded-(--r-solid) p-0">
            <Queue
              tone="info"
              title="1 MR awaiting verification"
              meta="JCE-MR-2026-0142"
              href="/warehouse/verification"
            />
            <Queue
              tone="info"
              title="1 transfer in transit"
              meta="TRF-2026-0033 · 800 units"
              href="/warehouse/transfers/TRF-2026-0033"
            />
            <Queue
              tone="pending"
              title="Items with outstanding reservations"
              meta="2 items"
              href="/warehouse/items"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Queue({
  tone,
  title,
  meta,
  href,
}: {
  tone: "info" | "pending";
  title: string;
  meta: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 border-b border-jce-line px-3 py-2.5 last:border-0 hover:bg-(--table-focus)"
    >
      <span
        className={
          tone === "info"
            ? "size-2 shrink-0 rounded-full bg-(--st-info)"
            : "size-2 shrink-0 rounded-full bg-(--st-pending)"
        }
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="text-ui-13 font-semibold text-jce-ink">{title}</div>
        <div className="font-mono text-ui-12 text-jce-ink-2">{meta}</div>
      </div>
    </Link>
  );
}
