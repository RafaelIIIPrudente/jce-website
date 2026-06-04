"use client";

import { Fragment } from "react";
import { LockIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { BOQ, CONTRACT, lineTotal } from "@/lib/mock/pmg";
import { pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/jce/chip";

// P6 · Bill of Quantities (pmg-screens.jsx:616). Categories → lines; staged lines
// carry Procure/Deliver/Install amounts; weights recompute live (Σ = 100%), never
// typed (.computed). READ-ONLY — changes go through a Variation Order (P7).
export function BoqView() {
  const { role } = useJce();
  const canEditPmg = canEdit(role, "pmg");

  return (
    <div className="flex flex-col gap-4">
      <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-(--r-glass) px-5 py-3">
        <div>
          <div className="kicker">PMG · P6</div>
          <h1 className="mt-0.5 text-ui-18 font-bold tracking-tight text-jce-ink">
            Bill of Quantities
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="success">Σ weights = 100.00%</Chip>
          {canEditPmg ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                toast.error(
                  "BOQ is read-only — changes go through a Variation Order (P7).",
                )
              }
            >
              Edit line
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-(--r-input) bg-(--table-zebra) px-2.5 py-1 text-ui-12 text-jce-ink-2">
              <LockIcon className="size-3.5" aria-hidden /> read · changes go
              through VO (P7)
            </span>
          )}
        </div>
      </div>

      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th className="text-right">Qty</th>
              <th>Unit</th>
              <th className="text-right">Unit Price</th>
              <th className="text-right">Line Total</th>
              <th className="text-right">Weight %</th>
            </tr>
          </thead>
          <tbody>
            {BOQ.map((c) => (
              <CategoryRows key={c.cat} cat={c.cat} />
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td colSpan={5}>Grand total · Σ weights</td>
              <td className="num">{pmoney(CONTRACT)}</td>
              <td className="num">100.00</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-ui-12 text-jce-ink-2">
        Editing any amount recomputes line weight, stage weights and grand total
        atomically. Weights are stored high-precision and never typed.
      </p>
    </div>
  );
}

function CategoryRows({ cat }: { cat: string }) {
  const category = BOQ.find((c) => c.cat === cat);
  if (!category) return null;
  return (
    <>
      <tr className="bg-jce-green-50">
        <td colSpan={7} className="font-semibold text-jce-green-900">
          {cat}
        </td>
      </tr>
      {category.lines.map((l) => {
        const total = lineTotal(l);
        return (
          <Fragment key={l.no}>
            <tr>
              <td className="font-mono font-semibold">{l.no}</td>
              <td>{l.desc}</td>
              <td className="num">{l.qty}</td>
              <td>{l.unit}</td>
              <td className="num">{pmoney(total / l.qty)}</td>
              <td className="num font-semibold">{pmoney(total)}</td>
              <td className="num computed">
                {pmoney((total / CONTRACT) * 100)}
              </td>
            </tr>
            {l.staged && l.stages
              ? l.stages.map((s) => (
                  <tr key={s.stage} className="text-jce-ink-2">
                    <td />
                    <td className="pl-6">
                      <span className="rounded bg-(--table-zebra) px-1.5 py-0.5 text-[10px] font-semibold text-jce-ink-2">
                        {s.stage}
                      </span>
                    </td>
                    <td colSpan={3} />
                    <td className="num">{pmoney(s.value)}</td>
                    <td className="num computed">
                      {pmoney((s.value / CONTRACT) * 100)}
                    </td>
                  </tr>
                ))
              : null}
          </Fragment>
        );
      })}
    </>
  );
}
