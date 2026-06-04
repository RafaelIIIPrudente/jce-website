"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import {
  SALES_ORDERS,
  SO_REMARK_TONE,
  SO_STATUS_TONE,
  type SalesOrder,
} from "@/lib/mock/bdd";
import { peso } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// B1 · Sales Orders list (bdd-core.jsx:14) — the canonical SO# registry every
// operational module (Parts 4–8) references. Row → B2 record.
export function SalesOrdersList() {
  const { role } = useJce();
  const readOnly = !canEdit(role, "bdd");
  const router = useRouter();
  const [q, setQ] = useState("");

  const rows = SALES_ORDERS.filter((o) =>
    (o.so + o.client + o.name).toLowerCase().includes(q.toLowerCase()),
  );

  const columns: LedgerColumn<SalesOrder>[] = [
    {
      id: "date",
      header: "Date",
      cell: (o) => (
        <span className="font-mono text-ui-12 whitespace-nowrap text-jce-ink-2">
          {o.date}
        </span>
      ),
    },
    { id: "so", header: "SO No.", cell: (o) => <DocChip code={o.so} /> },
    { id: "client", header: "Client", cell: (o) => o.client },
    {
      id: "name",
      header: "Project Name",
      cell: (o) => <span className="font-medium text-jce-ink">{o.name}</span>,
    },
    {
      id: "amt",
      header: "Contract Amount",
      align: "right",
      cell: (o) => peso(o.amount),
    },
    {
      id: "remarks",
      header: "Remarks",
      cell: (o) => (
        <Chip tone={SO_REMARK_TONE[o.remarks] ?? "neutral"}>{o.remarks}</Chip>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (o) => (
        <Chip tone={SO_STATUS_TONE[o.status] ?? "neutral"}>{o.status}</Chip>
      ),
    },
    {
      id: "turned",
      header: "Turned over",
      cell: (o) =>
        o.turned ? (
          <Chip tone="success">Yes</Chip>
        ) : (
          <span className="text-jce-ink-2">—</span>
        ),
    },
    {
      id: "by",
      header: "Requested by",
      cell: (o) => <span className="text-jce-ink-2">{o.by}</span>,
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="BDD · B1"
        title="Sales Orders"
        description="The canonical SO# registry — every operational module keys off these numbers."
        actions={
          <>
            <div className="flex h-9 w-56 items-center gap-2 rounded-[8px] border border-jce-line bg-white/70 px-2.5">
              <SearchIcon
                className="size-4 shrink-0 text-jce-ink-2"
                aria-hidden
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search SO#, client, project…"
                aria-label="Search sales orders"
                className="w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
              />
            </div>
            {!readOnly ? <Button size="sm">+ New SO</Button> : null}
          </>
        }
      />
      <LedgerGrid
        columns={columns}
        rows={rows}
        getRowKey={(o) => o.so}
        onRowClick={(o) => router.push(`/bdd/sales-orders/${o.so}`)}
        className="max-h-[calc(100dvh-16rem)]"
      />
    </div>
  );
}
