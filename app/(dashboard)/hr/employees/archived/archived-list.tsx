"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { ARCHIVED, STATUS_TONE, type ArchivedEmployee } from "@/lib/mock/hr";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// H4 · Archived employees (hr-employees.jsx:759). Solid register + Restore.
// Restore is an HR-edit action — present only for hrhead || owner.
export function ArchivedList() {
  const { role } = useJce();
  const canEditEmployees = role === "hrhead" || role === "owner";
  const [restored, setRestored] = useState<readonly number[]>([]);

  const rows = ARCHIVED.filter((e) => !restored.includes(e.id));

  const columns: LedgerColumn<ArchivedEmployee>[] = [
    {
      id: "sn",
      header: "S/N",
      cell: (e) => <span className="tabular-nums text-jce-ink-2">{e.sn}</span>,
    },
    {
      id: "name",
      header: "Name",
      cell: (e) => <span className="font-semibold text-jce-ink">{e.name}</span>,
    },
    {
      id: "bio",
      header: "BIO",
      cell: (e) => <span className="font-mono text-ui-12">{e.bio}</span>,
    },
    { id: "pos", header: "Position", cell: (e) => e.pos },
    {
      id: "assign",
      header: "Assignment",
      cell: (e) => <span className="text-jce-ink-2">{e.assign}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (e) => (
        <Chip tone={STATUS_TONE[e.status] ?? "neutral"}>{e.status}</Chip>
      ),
    },
    {
      id: "hired",
      header: "Date Hired",
      cell: (e) => <span className="font-mono text-ui-12">{e.hired}</span>,
    },
    {
      id: "archived",
      header: "Archived",
      cell: (e) => (
        <span className="font-mono text-ui-12 text-jce-ink-2">
          {e.archived}
        </span>
      ),
    },
    {
      id: "act",
      header: "",
      align: "right",
      cell: (e) =>
        canEditEmployees ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setRestored((r) => [...r, e.id]);
              toast.success(`${e.name} restored to active employees.`);
            }}
          >
            Restore
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <Link
        href="/hr/employees"
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Employees
      </Link>
      <PageHeader
        kicker="HR · H4"
        title="Archived employees"
        description="Resigned and terminated records. Restore returns an employee to the active roster."
      />
      {rows.length === 0 ? (
        <div className="glass rounded-(--r-glass) px-6 py-10 text-center">
          <div className="text-ui-14 font-semibold text-jce-ink">
            No archived employees
          </div>
          <div className="mt-1 text-ui-12 text-jce-ink-2">
            Everyone has been restored to the active roster.
          </div>
        </div>
      ) : (
        <LedgerGrid columns={columns} rows={rows} getRowKey={(e) => e.id} />
      )}
    </div>
  );
}
