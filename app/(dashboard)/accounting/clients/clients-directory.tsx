"use client";

import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import { CLIENTS, type Client } from "@/lib/mock/accounting";
import { pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { EmptyState } from "@/components/jce/empty-state";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";
import { UsersIcon } from "lucide-react";

// A19 · Clients (acc-sales.jsx:893). Feeds SI/SOA/CR/AR auto-fill; shows AR
// balance per client (zero AR → Settled).
export function ClientsDirectory() {
  const { role } = useJce();
  const canManage = canVerb(role, "acc");
  const rows = CLIENTS;

  const columns: LedgerColumn<Client>[] = [
    {
      id: "name",
      header: "Client name",
      cell: (c) => <span className="font-semibold text-jce-ink">{c.name}</span>,
    },
    {
      id: "addr",
      header: "Address",
      cell: (c) => <span className="text-jce-ink-2">{c.addr}</span>,
    },
    {
      id: "tin",
      header: "TIN",
      cell: (c) => <span className="font-mono text-ui-12">{c.tin}</span>,
    },
    {
      id: "ar",
      header: "AR balance",
      align: "right",
      cell: (c) =>
        c.ar === 0 ? (
          <Chip tone="success">Settled</Chip>
        ) : (
          <span className="font-semibold">{pmoney(c.ar)}</span>
        ),
    },
    {
      id: "sub",
      header: "",
      align: "right",
      cell: () => (
        <span className="text-ui-12 text-jce-green-700">Sub-ledger →</span>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="Accounting · A19"
        title="Clients"
        description="Feeds SI/SOA/CR/AR auto-fill · merge-safe duplicate warning · used-by indicator."
        actions={canManage ? <Button size="sm">+ Add client</Button> : null}
      />
      {rows.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-2">
          <EmptyState
            icon={
              <UsersIcon className="size-7" strokeWidth={1.5} aria-hidden />
            }
            title="No clients yet"
            description="Add a client to start issuing invoices and statements of account."
          />
        </div>
      ) : (
        <LedgerGrid columns={columns} rows={rows} getRowKey={(c) => c.name} />
      )}
    </div>
  );
}
