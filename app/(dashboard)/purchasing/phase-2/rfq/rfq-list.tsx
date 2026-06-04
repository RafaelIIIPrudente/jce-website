"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { RFQS, RFQ_TONE } from "@/lib/mock/purchasing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

// U15 · RFQ management (pur-phase2a.jsx:139). Procurement-side (distinct from
// BDD's bid-side Quotation). Status: Draft → Sent → Responses In → Awarded →
// Converted → Closed.
export function RfqList() {
  const router = useRouter();
  const { role } = useJce();
  const canCreate = canEdit(role, "pur");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        kicker="Purchasing · U15 · Phase 2"
        title="RFQ management"
        actions={
          canCreate ? (
            <Button
              size="sm"
              onClick={() => toast.info("New RFQ — invite suppliers to quote.")}
            >
              + New RFQ
            </Button>
          ) : null
        }
      />
      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>RFQ No.</th>
              <th>Date</th>
              <th>Item</th>
              <th>From MR</th>
              <th>Responses</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {RFQS.map((r) => (
              <tr
                key={r.no}
                onClick={() => router.push(`/purchasing/phase-2/rfq/${r.no}`)}
                className="cursor-pointer"
              >
                <td>
                  <DocChip code={r.no} />
                </td>
                <td className="mono text-ui-12">{r.date}</td>
                <td className="font-semibold">{r.item}</td>
                <td>
                  {r.mr === "—" ? (
                    <span className="text-jce-ink-2">standalone</span>
                  ) : (
                    <DocChip code={r.mr} />
                  )}
                </td>
                <td>
                  <Chip
                    tone={r.responses === r.invited ? "success" : "pending"}
                  >
                    {r.responses}/{r.invited}
                  </Chip>
                </td>
                <td>
                  <Chip tone={RFQ_TONE[r.status] ?? "neutral"}>{r.status}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-ui-12 text-jce-ink-2">
        Open an RFQ to compare responses side-by-side and award to a draft PO.
      </p>
    </div>
  );
}
