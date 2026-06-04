"use client";

import { useState } from "react";
import Link from "next/link";

import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import { BILL_TONE, getBillings, type Billing } from "@/lib/mock/accounting";
import { pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { Segmented } from "@/components/jce/segmented";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// A7 · Billing register (acc-sales.jsx:9). SI + SOA. Issue verbs are present only
// for Accounting Lead / Owner (canVerb) — absent for lesser grants.
export function SalesRegister() {
  const { role } = useJce();
  const canIssue = canVerb(role, "acc");
  const [type, setType] = useState("All");

  const rows = getBillings().filter((b) => type === "All" || b.type === type);

  const columns: LedgerColumn<Billing>[] = [
    {
      id: "date",
      header: "Date",
      cell: (b) => <span className="font-mono text-ui-12">{b.date}</span>,
    },
    {
      id: "type",
      header: "Type",
      cell: (b) => (
        <Chip tone={b.type === "SI" ? "info" : "neutral"}>{b.type}</Chip>
      ),
    },
    { id: "no", header: "Doc No.", cell: (b) => <DocChip code={b.no} /> },
    {
      id: "or",
      header: "OR/CR Ref",
      cell: (b) =>
        b.or === "—" ? (
          <span className="text-jce-ink-2">—</span>
        ) : (
          <DocChip code={b.or} />
        ),
    },
    {
      id: "client",
      header: "Client",
      cell: (b) => <span className="font-medium text-jce-ink">{b.client}</span>,
    },
    { id: "so", header: "SO#", cell: (b) => <DocChip code={b.so} /> },
    {
      id: "particulars",
      header: "Particulars",
      cell: (b) => <span className="text-jce-ink-2">{b.particulars}</span>,
    },
    {
      id: "amt",
      header: "Amount",
      align: "right",
      cell: (b) => pmoney(b.debit || b.credit),
    },
    {
      id: "vat",
      header: "VAT",
      align: "right",
      cell: (b) =>
        b.vat ? pmoney(b.vat) : <span className="text-jce-ink-2">—</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (b) => (
        <Chip tone={BILL_TONE[b.status] ?? "neutral"}>{b.status}</Chip>
      ),
    },
    {
      id: "bal",
      header: "Balance",
      align: "right",
      cell: (b) => <span className="font-semibold">{pmoney(b.bal)}</span>,
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="Accounting · A7 · Sales"
        title="Billing statement register"
        description="Service Invoices and Statements of Account. Edit-after-Issue is allowed with audit (OQ#16 — distinct from BDD's strict no-edit)."
        actions={
          canIssue ? (
            <>
              <Button asChild size="sm">
                <Link href="/accounting/sales/invoice/new">
                  + Issue Service Invoice
                </Link>
              </Button>
              <Button asChild size="sm" variant="accent">
                <Link href="/accounting/sales/soa/new">
                  + Issue Statement of Account
                </Link>
              </Button>
            </>
          ) : null
        }
      />
      <Segmented
        aria-label="Billing type"
        value={type}
        onValueChange={setType}
        options={[
          { value: "All", label: "All" },
          { value: "SI", label: "SI" },
          { value: "SOA", label: "SOA" },
        ]}
      />
      {rows.length === 0 ? (
        <div className="glass rounded-(--r-glass) px-6 py-10 text-center">
          <div className="text-ui-14 font-semibold text-jce-ink">
            No {type} documents
          </div>
          <div className="mt-1 text-ui-12 text-jce-ink-2">
            Issue a Service Invoice or Statement of Account to populate the
            register.
          </div>
        </div>
      ) : (
        <LedgerGrid columns={columns} rows={rows} getRowKey={(b) => b.no} />
      )}
    </div>
  );
}
