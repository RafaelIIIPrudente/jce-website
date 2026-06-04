"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { qn } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import { TRANSFERS, GATE_TONE } from "@/lib/mock/warehouse";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

// W6 · Stock transfers register (wh-docs.jsx:579). Transfer initiation is
// Admin-led by default (canVerb). Dispatch → In Transit → Confirm Receipt.
export function TransferRegister() {
  const router = useRouter();
  const { role } = useJce();
  const canInitiate = canVerb(role, "wh");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        kicker="Warehouse · W6"
        title="Stock transfers"
        actions={
          canInitiate ? (
            <Button
              size="sm"
              onClick={() =>
                toast.info(
                  "New Transfer — Dispatch posts Transfer-Out at origin.",
                )
              }
            >
              + New Transfer
            </Button>
          ) : null
        }
      />
      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>TRF No.</th>
              <th>Date</th>
              <th>From → To</th>
              <th className="num">Dispatched</th>
              <th className="num">Received</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {TRANSFERS.map((t) => (
              <tr
                key={t.no}
                onClick={() => router.push(`/warehouse/transfers/${t.no}`)}
                className="cursor-pointer"
              >
                <td>
                  <DocChip code={t.no} />
                </td>
                <td className="mono text-ui-12">{t.date}</td>
                <td>
                  {t.from} → {t.to}
                </td>
                <td className="num">{qn(t.dispatched)}</td>
                <td className="num">
                  {t.received != null ? (
                    qn(t.received)
                  ) : (
                    <span className="text-jce-ink-2">—</span>
                  )}
                </td>
                <td>
                  <Chip tone={GATE_TONE[t.status] ?? "neutral"}>
                    {t.status}
                  </Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-ui-12 text-jce-ink-2">
        In-transit units are counted at neither location. Received ≠ dispatched
        raises a discrepancy flag for admin review — never a silent adjustment.
      </p>
    </div>
  );
}
