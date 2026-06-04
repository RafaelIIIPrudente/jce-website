"use client";

import { useJce } from "@/lib/mock/role-context";
import { CAN_SEE_COMP } from "@/lib/rbac";
import { LOANS, LOAN_STATUS_TONE, type Loan } from "@/lib/mock/accounting";
import { pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// A3 · Loans (acc-payroll.jsx:775). Append-only ledger per loan; auto-stop at zero
// → Fully Paid; the skip surfaces in A5. + New loan is Payroll/Owner only.
export function LoansLedger() {
  const { role } = useJce();
  const seeComp = CAN_SEE_COMP(role);

  const columns: LedgerColumn<Loan>[] = [
    {
      id: "emp",
      header: "Employee",
      cell: (l) => <span className="font-semibold text-jce-ink">{l.emp}</span>,
    },
    { id: "type", header: "Type", cell: (l) => l.type },
    {
      id: "subtype",
      header: "Sub-type",
      cell: (l) => <span className="text-jce-ink-2">{l.subtype}</span>,
    },
    { id: "ref", header: "Reference", cell: (l) => <DocChip code={l.ref} /> },
    {
      id: "principal",
      header: "Principal",
      align: "right",
      cell: (l) => pmoney(l.principal),
    },
    {
      id: "amort",
      header: "Amortization",
      align: "right",
      cell: (l) =>
        l.amort == null ? (
          <span className="text-jce-ink-2">—</span>
        ) : (
          pmoney(l.amort)
        ),
    },
    {
      id: "balance",
      header: "Running Balance",
      align: "right",
      cell: (l) => <span className="font-semibold">{pmoney(l.balance)}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (l) => (
        <Chip tone={LOAN_STATUS_TONE[l.status] ?? "neutral"}>{l.status}</Chip>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="Accounting · A3"
        title="Loans"
        description="Append-only ledger per loan · final-installment trueing · auto-stop at zero → Fully Paid · skip surfaces in A5."
        actions={seeComp ? <Button size="sm">+ New loan</Button> : null}
      />
      <LedgerGrid columns={columns} rows={LOANS} getRowKey={(l) => l.ref} />
    </div>
  );
}
