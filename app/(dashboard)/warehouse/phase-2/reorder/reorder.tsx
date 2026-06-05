"use client";

import { cn } from "@/lib/utils";
import { qn } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { REORDER_RULES, belowReorder } from "@/lib/mock/warehouse";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { KpiTile } from "@/components/jce/kpi-tile";
import { Chip } from "@/components/jce/chip";

// W10 · Reorder rules & low-stock alerts (wh-phase2.jsx:8). Per item × location
// min / reorder vs live on-hand; below-reorder danger + "Draft MR/PR".
export function Reorder() {
  const { role } = useJce();
  const mayEdit = canEdit(role, "wh");
  const belowCount = REORDER_RULES.filter(belowReorder).length;

  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-4">
      <PageHeader
        kicker="Warehouse · W10 · Phase 2"
        title="Reorder rules & low-stock alerts"
        actions={
          mayEdit ? (
            <Button
              size="sm"
              onClick={() =>
                toast.info(
                  "Add rule — set min + reorder point per item × location.",
                )
              }
            >
              + Add rule
            </Button>
          ) : null
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <KpiTile
          label="Items below reorder point"
          value={belowCount}
          delta={belowCount > 0 ? "draft replenishment ready" : "all stocked"}
          tone={belowCount > 0 ? "danger" : "success"}
        />
        <KpiTile
          label="Rules configured"
          value={REORDER_RULES.length}
          delta="item × location"
          tone="neutral"
        />
      </div>
      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>Item</th>
              <th>Location</th>
              <th className="num">Min level</th>
              <th className="num">Reorder point</th>
              <th className="num">On-hand (live)</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {REORDER_RULES.map((r, i) => {
              const below = belowReorder(r);
              return (
                <tr key={i}>
                  <td className="font-semibold">{r.item}</td>
                  <td>{r.loc}</td>
                  <td className="num">{qn(r.min)}</td>
                  <td className="num">{qn(r.reorder)}</td>
                  <td
                    className={cn(
                      "num font-bold",
                      below && "text-(--st-danger)",
                    )}
                  >
                    <span className="computed">{qn(r.onhand)}</span>
                  </td>
                  <td>
                    {below ? (
                      <Chip tone="danger">Below reorder</Chip>
                    ) : (
                      <Chip tone="success">OK</Chip>
                    )}
                  </td>
                  <td>
                    {below && mayEdit ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toast.success(
                            `Draft replenishment prepared for ${r.item}.`,
                          )
                        }
                      >
                        Draft MR/PR
                      </Button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-ui-12 text-jce-ink-2">
        Per-item, per-location minimum levels; below-reorder badges surface on
        W2/W3 and feed the notifications center (X4).
      </p>
    </div>
  );
}
