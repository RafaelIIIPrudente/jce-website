"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import {
  BILLING_HISTORY,
  DP_AMOUNT,
  DP_PCT,
  type Billing,
} from "@/lib/mock/pmg";
import { pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

const PB1_RECOUP = 905883.24;
const PB1_RETENTION = 603922.16;
const RELEASE_AMOUNT = 300000;

// P9 · Progress billing & ledgers (pmg-screens.jsx:852). A retention RELEASE is
// its own POSITIVE billing line, never a negative deduction.
export function BillingView() {
  const { role } = useJce();
  const canEditPmg = canEdit(role, "pmg");
  const [released, setReleased] = useState(false);

  const rows: Billing[] = [...BILLING_HISTORY];
  if (released) {
    rows.push({
      pb: "RET-REL-01",
      asof: "2026-06-03",
      gain: 0,
      amount: RELEASE_AMOUNT,
      recoup: 0,
      retention: 0,
      net: RELEASE_AMOUNT,
      status: "Release",
    });
  }
  const outstandingRetention = PB1_RETENTION - (released ? RELEASE_AMOUNT : 0);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader kicker="PMG · P9" title="Progress billing & ledgers" />

      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>Period</th>
              <th>As of</th>
              <th className="text-right">% gain</th>
              <th className="text-right">PB amount</th>
              <th className="text-right">Recoupment</th>
              <th className="text-right">Retention</th>
              <th className="text-right">Net Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.pb}>
                <td>
                  <DocChip code={b.pb} />
                </td>
                <td className="font-mono text-ui-12">{b.asof}</td>
                <td className="num">{pmoney(b.gain)}%</td>
                <td className="num">{pmoney(b.amount)}</td>
                <td className="num">
                  {b.recoup ? `(${pmoney(b.recoup)})` : "—"}
                </td>
                <td className="num">
                  {b.retention ? `(${pmoney(b.retention)})` : "—"}
                </td>
                <td className="num font-semibold">{pmoney(b.net)}</td>
                <td>
                  <Chip tone={b.status === "Release" ? "success" : "info"}>
                    {b.status}
                  </Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="solid rounded-(--r-solid) p-5">
          <h2 className="text-ui-14 font-semibold text-jce-ink">
            Recoupment ledger
          </h2>
          <table className="jtable mt-3">
            <tbody>
              <tr>
                <td>Downpayment ({DP_PCT}% × contract)</td>
                <td className="num">{pmoney(DP_AMOUNT)}</td>
              </tr>
              <tr>
                <td>PB1 recoupment</td>
                <td className="num">({pmoney(PB1_RECOUP)})</td>
              </tr>
              <tr className="font-semibold">
                <td>Downpayment remaining</td>
                <td className="num">{pmoney(DP_AMOUNT - PB1_RECOUP)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="solid rounded-(--r-solid) p-5">
          <h2 className="text-ui-14 font-semibold text-jce-ink">
            Retention ledger
          </h2>
          <table className="jtable mt-3">
            <tbody>
              <tr>
                <td>PB1 retention added</td>
                <td className="num">{pmoney(PB1_RETENTION)}</td>
              </tr>
              <tr>
                <td>Release events</td>
                <td className="num">
                  {released ? (
                    <span className="text-jce-green-700">
                      +{pmoney(RELEASE_AMOUNT)} (RET-REL-01)
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
              <tr className="font-semibold">
                <td>Outstanding retention payable</td>
                <td className="num">{pmoney(outstandingRetention)}</td>
              </tr>
            </tbody>
          </table>
          {canEditPmg && !released ? (
            <Button
              variant="ghost"
              size="sm"
              className="mt-3"
              onClick={() => {
                setReleased(true);
                toast.success(
                  "Retention release issued as a POSITIVE billing line (never a negative deduction).",
                );
              }}
            >
              Trigger retention release
            </Button>
          ) : null}
        </div>
      </div>
      <p className="text-ui-12 text-jce-ink-2">
        A release is its own billing line, never a negative deduction (PM Head,
        audited).
      </p>
    </div>
  );
}
