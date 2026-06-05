"use client";

import { useRouter } from "next/navigation";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { MR_STATUS_TONE, VERIFIED_TONE, getMrs, type Mr } from "@/lib/mock/pmg";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// P11 · Material Request register (pmg-screens.jsx:1101). The canonical MR
// registry — its "For Purchase" remainder is the upstream trigger to Purchasing.
export function MrRegister() {
  const { role } = useJce();
  const router = useRouter();
  const canCreate = canEdit(role, "pmg");
  const rows = getMrs();

  const open = (no: string) =>
    router.push(`/pmg/material-requests/${encodeURIComponent(no)}`);

  const columns: LedgerColumn<Mr>[] = [
    { id: "no", header: "MR No.", cell: (m) => <DocChip code={m.no} /> },
    {
      id: "date",
      header: "Date",
      cell: (m) => <span className="font-mono text-ui-12">{m.date}</span>,
    },
    { id: "project", header: "Project", cell: (m) => m.project },
    { id: "so", header: "SO No.", cell: (m) => <DocChip code={m.so} /> },
    {
      id: "lines",
      header: "Lines",
      align: "right",
      cell: (m) => <span className="tabular-nums">{m.lines}</span>,
    },
    {
      id: "split",
      header: "Reserved / For-Purchase",
      cell: (m) => (
        <span className="flex flex-wrap items-center gap-1.5">
          <Chip tone="success">{m.reserved} res</Chip>
          {m.forPurchase > 0 ? (
            <Chip tone="pending">{m.forPurchase} buy</Chip>
          ) : null}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (m) => (
        <Chip tone={MR_STATUS_TONE[m.status] ?? "neutral"}>{m.status}</Chip>
      ),
    },
    {
      id: "verified",
      header: "WH verified",
      cell: (m) => (
        <Chip tone={VERIFIED_TONE[m.verified] ?? "neutral"}>{m.verified}</Chip>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="PMG · P11"
        title="Material Request register"
        description="Inventory-first — each MR splits into Reserved (in stock) and For-Purchase (the remainder that flows to Purchasing)."
        actions={
          canCreate ? (
            <Button size="sm" onClick={() => open("JCE-MR-2026-0142")}>
              + New MR
            </Button>
          ) : null
        }
      />
      <LedgerGrid
        columns={columns}
        rows={rows}
        getRowKey={(m) => m.no}
        onRowClick={(m) => open(m.no)}
      />
    </div>
  );
}
