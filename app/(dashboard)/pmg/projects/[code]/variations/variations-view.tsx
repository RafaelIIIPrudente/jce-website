"use client";

import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

// P7 · Variation Orders (pmg-screens.jsx:783). PROSPECTIVE policy: locked periods
// keep their billed pesos; the variation applies from the next OPEN period vs the
// revised contract; the pre-change BOQ snapshot is retained.
const VOS = [
  {
    no: "VO-26-04-355-02",
    date: "2026-05-30",
    desc: "Added transformer protection scheme",
    impact: 2400000,
    status: "Approved",
  },
  {
    no: "VO-26-04-355-01",
    date: "2026-04-12",
    desc: "Revised pole quantity",
    impact: 0,
    status: "Approved",
  },
];

export function VariationsView() {
  const { role } = useJce();
  const canEditPmg = canEdit(role, "pmg");

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        kicker="PMG · P7"
        title="Variation orders"
        actions={
          canEditPmg ? (
            <Button
              size="sm"
              onClick={() =>
                toast.success(
                  "New VO applies PROSPECTIVELY — from the next open period vs the revised contract. Locked periods keep their billed pesos.",
                )
              }
            >
              + New VO
            </Button>
          ) : null
        }
      />
      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>VO No.</th>
              <th>Date</th>
              <th>Description</th>
              <th className="text-right">Grand-total impact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {VOS.map((v) => (
              <tr key={v.no}>
                <td>
                  <DocChip code={v.no} />
                </td>
                <td className="font-mono text-ui-12">{v.date}</td>
                <td>{v.desc}</td>
                <td className="num text-jce-green-700">
                  +
                  {v.impact.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td>
                  <Chip tone="success">{v.status}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rounded-(--r-input) bg-(--table-zebra) px-4 py-2.5 text-ui-12 text-jce-ink-2">
        <strong className="text-jce-ink">Policy (A) prospective:</strong> locked
        periods keep their billed pesos; the variation applies from the next
        open period against the revised contract value. The pre-change BOQ
        snapshot is retained — a VO can never retro-change a locked period.
      </p>
    </div>
  );
}
