"use client";

import Link from "next/link";

import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import { getCollections, type Collection } from "@/lib/mock/accounting";
import { pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";
import { ReceiptTextIcon } from "lucide-react";

// A10 · Collections register (acc-sales.jsx:647). CR + AR. Banks (Net) =
// gross − CWT (2%) — the reconciliation figure. Issue verbs = Accounting Lead /
// Owner (canVerb).
export function CollectionsRegister() {
  const { role } = useJce();
  const canIssue = canVerb(role, "acc");
  const rows = getCollections();

  const columns: LedgerColumn<Collection>[] = [
    {
      id: "date",
      header: "Date",
      cell: (c) => <span className="font-mono text-ui-12">{c.date}</span>,
    },
    {
      id: "type",
      header: "Type",
      cell: (c) => (
        <Chip tone={c.type === "CR" ? "info" : "neutral"}>{c.type}</Chip>
      ),
    },
    { id: "no", header: "Doc No.", cell: (c) => <DocChip code={c.no} /> },
    {
      id: "client",
      header: "Client",
      cell: (c) => <span className="font-medium text-jce-ink">{c.client}</span>,
    },
    { id: "so", header: "SO#", cell: (c) => <DocChip code={c.so} /> },
    { id: "ref", header: "Ref", cell: (c) => <DocChip code={c.ref} /> },
    {
      id: "tr",
      header: "Trade Recv.",
      align: "right",
      cell: (c) => pmoney(c.tr),
    },
    {
      id: "cwt",
      header: "CWT (2%)",
      align: "right",
      cell: (c) => pmoney(c.cwt),
    },
    {
      id: "banks",
      header: "Banks (Net)",
      align: "right",
      cell: (c) => <span className="font-semibold">{pmoney(c.banks)}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (c) => <Chip tone="success">{c.status}</Chip>,
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="Accounting · A10 · Collections"
        title="Collections register"
        description="Banks (Net) = gross − CWT, the reconciliation figure. Partial payment flags the billing Partially Paid; void restores balance (audited)."
        actions={
          canIssue ? (
            <>
              <Button asChild size="sm">
                <Link href="/accounting/collections/cr/new">
                  + Issue Collection Receipt
                </Link>
              </Button>
              <Button asChild size="sm" variant="accent">
                <Link href="/accounting/collections/ar/new">
                  + Issue Acknowledgement Receipt
                </Link>
              </Button>
            </>
          ) : null
        }
      />
      {rows.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-2">
          <EmptyState
            icon={
              <ReceiptTextIcon
                className="size-7"
                strokeWidth={1.5}
                aria-hidden
              />
            }
            title="No collections yet"
            description="Issue a Collection or Acknowledgement Receipt against an outstanding billing."
          />
        </div>
      ) : (
        <LedgerGrid columns={columns} rows={rows} getRowKey={(c) => c.no} />
      )}
    </div>
  );
}
