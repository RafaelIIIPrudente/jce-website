"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { MRRS, GATE_TONE, SITEENG_SO } from "@/lib/mock/warehouse";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

// W4 · Material Receiving Reports register (wh-docs.jsx:81). A Locked MRR is the
// single Goods Receipt — it completes Purchasing's three-way match and makes the
// RFP submittable. Site Engineers see only assigned-site receipts.
export function MrrRegister() {
  const router = useRouter();
  const { role } = useJce();
  const canCreate = canEdit(role, "wh");
  const scoped = role === "siteeng";

  const rows = scoped
    ? MRRS.filter((m) => m.project === "NORECO II — 13.2KV")
    : MRRS;

  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-4">
      <PageHeader
        kicker="Warehouse · W4 · Goods Receipt"
        title="Material Receiving Reports"
        actions={
          <>
            {scoped ? <Chip tone="info">assigned sites only</Chip> : null}
            {canCreate ? (
              <Button
                size="sm"
                onClick={() =>
                  toast.info(
                    "New MRR — pick PO/MR, receive lines, attach DR photo to Lock.",
                  )
                }
              >
                + New MRR
              </Button>
            ) : null}
          </>
        }
      />

      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>MRR No.</th>
              <th>Receive Date</th>
              <th>Supplier</th>
              <th>Invoice</th>
              <th>Project</th>
              <th>PO Number</th>
              <th>MR Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr
                key={m.no}
                onClick={() => router.push(`/warehouse/mrr/${m.no}`)}
                className="cursor-pointer"
              >
                <td>
                  <DocChip code={m.no} />
                </td>
                <td className="mono text-ui-12">{m.date}</td>
                <td className="font-semibold">{m.supplier}</td>
                <td className="mono text-ui-12">{m.inv}</td>
                <td>{m.project}</td>
                <td>
                  <DocChip code={m.po} />
                </td>
                <td>
                  <DocChip code={m.mr} />
                </td>
                <td>
                  <Chip tone={GATE_TONE[m.status] ?? "neutral"}>
                    {m.status}
                  </Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-ui-12 text-jce-ink-2">
        A Locked MRR is the single Goods Receipt — it completes
        Purchasing&apos;s three-way match and makes the RFP submittable. Site{" "}
        {SITEENG_SO}.
      </p>
    </div>
  );
}
