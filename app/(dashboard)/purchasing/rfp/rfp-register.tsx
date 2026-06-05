"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { pmoneyU } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { RFPS, RFP_TONE, POS, type Rfp } from "@/lib/mock/purchasing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

// U5 · RFP register (pur-core.jsx:678). RFP-PUR-YYMM#### numbering. + New RFP is
// raised only from an Approved PO (canEdit). Import POs whose DP + Balance don't
// yet reconcile to the PO grand total surface a warning.
function unreconciled(poNo: string): boolean {
  const po = POS.find((p) => p.no === poNo);
  if (!po || po.type !== "Import") return false;
  const linked = RFPS.filter((r) => r.po === poNo);
  const hasDp = linked.some((r) => r.type === "Downpayment");
  const hasBal = linked.some((r) => r.type === "Balance");
  return hasDp !== hasBal; // exactly one leg present → not reconciled
}

export function RfpRegister() {
  const router = useRouter();
  const { role } = useJce();
  const canCreate = canEdit(role, "pur");

  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-4">
      <PageHeader
        kicker="Purchasing · U5"
        title="RFP register"
        actions={
          canCreate ? (
            <Button size="sm" asChild>
              <Link href="/purchasing/rfp/new">+ New RFP</Link>
            </Button>
          ) : null
        }
      />

      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>RFP No.</th>
              <th>Date</th>
              <th>PO No.</th>
              <th>Supplier</th>
              <th>Type</th>
              <th>Due</th>
              <th className="num">Net payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {RFPS.map((r: Rfp) => (
              <tr
                key={r.no}
                onClick={() => router.push(`/purchasing/rfp/${r.no}`)}
                className="cursor-pointer"
              >
                <td>
                  <DocChip code={r.no} />
                </td>
                <td className="mono text-ui-12">{r.date}</td>
                <td>
                  <DocChip code={r.po} />
                </td>
                <td className="font-semibold">{r.supplier}</td>
                <td>
                  {r.type}
                  {unreconciled(r.po) ? (
                    <span className="ml-1.5">
                      <Chip tone="pending">reconcile</Chip>
                    </span>
                  ) : null}
                </td>
                <td className="mono text-ui-12">{r.due}</td>
                <td className="num">{pmoneyU(r.net)}</td>
                <td>
                  <Chip tone={RFP_TONE[r.status] ?? "neutral"}>{r.status}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-ui-12 text-jce-ink-2">
        Import POs show two linked RFPs (Downpayment + Balance) with a
        reconcile-to-grand-total warning when DP + Balance ≠ PO total. Status
        chain: Draft → Submitted → Verified / Authorized → Received (Accounting)
        → Paid.
      </p>
    </div>
  );
}
