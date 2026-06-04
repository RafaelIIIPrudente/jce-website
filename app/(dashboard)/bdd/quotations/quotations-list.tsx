"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { QUOTATIONS, type Quotation, type QuotationCat } from "@/lib/mock/bdd";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Segmented } from "@/components/jce/segmented";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// B5 · Quotations list (bdd-core.jsx). EC / Workshop / Solar category streams
// with per-category Ref. No. counters.
export function QuotationsList() {
  const { role } = useJce();
  const readOnly = !canEdit(role, "bdd");
  const router = useRouter();
  const [cat, setCat] = useState<QuotationCat>("EC");

  const rows = QUOTATIONS.filter((q) => q.cat === cat);

  const columns: LedgerColumn<Quotation>[] = [
    { id: "ref", header: "Ref. No.", cell: (q) => <DocChip code={q.ref} /> },
    {
      id: "item",
      header: "Item",
      cell: (q) => <span className="font-medium text-jce-ink">{q.item}</span>,
    },
    { id: "client", header: "Client", cell: (q) => q.client },
    {
      id: "date",
      header: "Request Date",
      cell: (q) => (
        <span className="font-mono text-ui-12 whitespace-nowrap text-jce-ink-2">
          {q.date}
        </span>
      ),
    },
    {
      id: "resp",
      header: "Responded",
      align: "center",
      cell: (q) => (
        <span className="tabular-nums">
          {q.responded}/{q.invited}
        </span>
      ),
    },
    {
      id: "winner",
      header: "Winner",
      cell: (q) =>
        q.winner ? (
          <Chip tone="success">{q.winner}</Chip>
        ) : (
          <span className="text-jce-ink-2">—</span>
        ),
    },
    {
      id: "links",
      header: "Linked",
      cell: (q) => (
        <span className="flex flex-wrap gap-1.5">
          {q.offer ? <DocChip code={q.offer} /> : null}
          {q.so && q.so !== "WORKSHOP" ? <DocChip code={q.so} /> : null}
          {!q.offer && (!q.so || q.so === "WORKSHOP") ? (
            <span className="text-jce-ink-2">—</span>
          ) : null}
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="BDD · B5"
        title="Quotations"
        description="Supplier quote requests by category. Request + children are immutable — they move by events only (OQ#16)."
        actions={
          !readOnly ? <Button size="sm">+ New request</Button> : undefined
        }
      />
      <Segmented
        aria-label="Category"
        options={[
          { value: "EC", label: "EC" },
          { value: "Workshop", label: "Workshop" },
          { value: "Solar", label: "Solar" },
        ]}
        value={cat}
        onValueChange={(v) => setCat(v as QuotationCat)}
      />
      <LedgerGrid
        columns={columns}
        rows={rows}
        getRowKey={(q) => q.ref}
        onRowClick={(q) =>
          router.push(`/bdd/quotations/${encodeURIComponent(q.ref)}`)
        }
        className="max-h-[calc(100dvh-18rem)]"
      />
    </div>
  );
}
