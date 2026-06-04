"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { qn } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import {
  WH_VERIFY_QUEUE,
  verifyMrHeader,
  verifyMrLines,
} from "@/lib/mock/warehouse";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { FieldComputed } from "@/components/jce/field-computed";
import { EmptyState } from "@/components/jce/empty-state";

// W8 · MR stock-verification (wh-core.jsx:501). Driven LIVE from pmg.ts —
// Available / For Purchase / reservation preview equal pmg reservedQty /
// forPurchaseQty. Verify records "Verified by Warehouse" status only (offline
// signature). Read-only for non-warehouse-admin roles.
export function MrVerification() {
  const { role } = useJce();
  const mayVerify = canVerb(role, "wh");
  const [verified, setVerified] = useState(false);

  const mrNo = WH_VERIFY_QUEUE[0];
  const header = mrNo ? verifyMrHeader(mrNo) : undefined;
  const lines = mrNo ? verifyMrLines(mrNo) : [];

  if (!header) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <PageHeader kicker="Warehouse · W8" title="MR stock-verification" />
        <EmptyState
          title="No MRs awaiting verification"
          description="The verification queue is clear."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <PageHeader
        kicker="Warehouse · W8"
        title="MR stock-verification"
        actions={
          verified ? (
            <Chip tone="success">Verified by Warehouse</Chip>
          ) : mayVerify ? (
            <Button size="sm" onClick={() => setVerified(true)}>
              Verify (records status)
            </Button>
          ) : (
            <Chip tone="neutral">read-only</Chip>
          )
        }
      />

      <div className="solid flex flex-col gap-4 rounded-(--r-solid) p-5">
        <div className="grid grid-cols-2 gap-3 text-ui-12">
          <label className="flex flex-col gap-1">
            <span className="text-jce-ink-2">MR No.</span>
            <span className="w-fit">
              <DocChip code={header.no} />
            </span>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-jce-ink-2">Project</span>
            <FieldComputed>{header.project}</FieldComputed>
          </label>
        </div>

        <div className="overflow-auto rounded-(--r-solid) border border-jce-line">
          <table className="jtable">
            <thead>
              <tr>
                <th>Item</th>
                <th className="num">Requested</th>
                <th className="num">Available (live)</th>
                <th className="num">For Purchase</th>
                <th>Reservation preview</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.line.no}>
                  <td>{l.line.desc}</td>
                  <td className="num">
                    {qn(l.requested)} {l.line.unit}
                  </td>
                  <td className="num">
                    <span className="computed">
                      {qn(l.available)} {l.line.unit}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "num font-semibold",
                      l.forPurchase > 0
                        ? "text-jce-orange-600"
                        : "text-jce-ink-2",
                    )}
                  >
                    {qn(l.forPurchase)} {l.line.unit}
                  </td>
                  <td>
                    {l.reserve > 0 ? (
                      <Chip tone="success">reserve {qn(l.reserve)}</Chip>
                    ) : (
                      <span className="text-jce-ink-2">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-ui-12 text-jce-ink-2">
          Available = on_hand − reserved (live). On MR approval the reservations
          create (available down); fulfilment via a W5 Release Issue consumes
          them. Fully-stocked lines hand nothing to Purchasing; under-stocked
          lines flow their For-Purchase remainder. Verify records status only —
          the offline signature is on the printed form.
        </p>
      </div>
    </div>
  );
}
