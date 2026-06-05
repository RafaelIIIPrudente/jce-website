"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { CV_TONE, getVouchers, type Voucher } from "@/lib/mock/accounting";
import { pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { Segmented } from "@/components/jce/segmented";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// A13 · Payable Voucher register + PR worksheet (acc-vouchers.jsx:9).
export function VoucherRegister() {
  const { role } = useJce();
  const router = useRouter();
  const canCreate = canEdit(role, "acc");
  const [tab, setTab] = useState("register");

  const vouchers = getVouchers();

  const columns: LedgerColumn<Voucher>[] = [
    { id: "cv", header: "CV No.", cell: (v) => <DocChip code={v.cv} /> },
    {
      id: "date",
      header: "Date",
      cell: (v) => <span className="font-mono text-ui-12">{v.date}</span>,
    },
    {
      id: "payee",
      header: "Payee",
      cell: (v) => (
        <div>
          <div className="font-semibold text-jce-ink">{v.payee}</div>
          <div className="font-mono text-ui-12 text-jce-ink-2">{v.ptype}</div>
        </div>
      ),
    },
    { id: "so", header: "SO#", cell: (v) => <DocChip code={v.so} /> },
    {
      id: "rfp",
      header: "RFP",
      cell: (v) =>
        v.rfp === "—" ? (
          <span className="text-jce-ink-2">—</span>
        ) : (
          <DocChip code={v.rfp} />
        ),
    },
    {
      id: "po",
      header: "PO",
      cell: (v) =>
        v.po === "—" ? (
          <span className="text-jce-ink-2">—</span>
        ) : (
          <DocChip code={v.po} />
        ),
    },
    {
      id: "gross",
      header: "Gross",
      align: "right",
      cell: (v) => pmoney(v.gross),
    },
    { id: "wtax", header: "WHT", align: "right", cell: (v) => pmoney(v.wtax) },
    {
      id: "net",
      header: "Net",
      align: "right",
      cell: (v) => <span className="font-semibold">{pmoney(v.net)}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (v) => (
        <Chip tone={CV_TONE[v.status] ?? "neutral"}>{v.status}</Chip>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="Accounting · A13 · Payable Voucher"
        title="Voucher register"
        description="Bank Payment Vouchers with double-entry journal + WHT. Edit-after-Issue is allowed with audit (OQ#16)."
        actions={
          canCreate ? (
            <Button
              size="sm"
              onClick={() => router.push("/accounting/vouchers/CV-1632")}
            >
              + New voucher
            </Button>
          ) : null
        }
      />
      <Segmented
        aria-label="Voucher view"
        value={tab}
        onValueChange={setTab}
        options={[
          { value: "register", label: "Voucher register" },
          { value: "pr", label: "Payment Request worksheet" },
        ]}
      />
      {tab === "register" ? (
        <LedgerGrid
          columns={columns}
          rows={vouchers}
          getRowKey={(v) => v.cv}
          onRowClick={(v) => router.push(`/accounting/vouchers/${v.cv}`)}
        />
      ) : (
        <div className="solid overflow-auto rounded-(--r-solid) p-0">
          <table className="jtable">
            <thead>
              <tr>
                <th>JCE-PR</th>
                <th>Date</th>
                <th>Payee</th>
                <th>TIN</th>
                <th>Invoice</th>
                <th>Project</th>
                <th>RFP No.</th>
                <th>Sundry Account</th>
                <th className="text-right">Amount</th>
                <th>ATC</th>
                <th>SO No.</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v, i) => (
                <tr key={v.cv}>
                  <td className="font-mono">PR-{1000 + i}</td>
                  <td className="font-mono text-ui-12">{v.date}</td>
                  <td>{v.payee}</td>
                  <td className="font-mono text-[11px]">000-000-000</td>
                  <td>{v.inv}</td>
                  <td>{v.so}</td>
                  <td>{v.rfp}</td>
                  <td>50001 Cost of Services</td>
                  <td className="num">{pmoney(v.gross)}</td>
                  <td className="font-mono">WI010</td>
                  <td>{v.so}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
