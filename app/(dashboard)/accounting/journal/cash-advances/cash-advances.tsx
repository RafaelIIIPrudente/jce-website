import { TriangleAlertIcon, WalletIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  AGE_BUCKETS,
  CASH_ADV,
  CA_STATUS_TONE,
  caAgingBuckets,
} from "@/lib/mock/accounting";
import { peso, pmoney } from "@/lib/mock/format";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";

// A17 · Cash Advance ledger (acc-vouchers.jsx:655). First-class entity with aging
// buckets (0–30 / 31–60 / 61–90 / 90+); stale (90+) rows flagged.
export function CashAdvances() {
  const buckets = caAgingBuckets();
  const outstanding = CASH_ADV.some((c) => c.bal > 0);

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="Accounting · A17"
        title="Cash Advance ledger"
        description="Aging buckets surface stale advances (90+ days) for follow-up."
      />

      {outstanding ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {AGE_BUCKETS.map((b) => {
              const v = buckets[b];
              const stale = b === "90+" && v > 0;
              return (
                <div
                  key={b}
                  className={cn(
                    "glass rounded-(--r-glass) p-4",
                    stale && "ring-1 ring-(--st-danger)",
                  )}
                >
                  <div className="kicker">Aging · {b} days</div>
                  <div className="mt-1.5 font-mono text-ui-22 font-bold tabular-nums text-jce-ink">
                    {peso(v)}
                  </div>
                  <div
                    className={cn(
                      "mt-1 flex items-center gap-1 text-ui-12 font-semibold",
                      stale ? "text-(--st-danger)" : "text-jce-ink-2",
                    )}
                  >
                    {stale ? (
                      <>
                        <TriangleAlertIcon className="size-3.5" aria-hidden />{" "}
                        stale — follow up
                      </>
                    ) : (
                      "outstanding"
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="solid overflow-auto rounded-(--r-solid) p-0">
            <table className="jtable">
              <thead>
                <tr>
                  <th>CA No.</th>
                  <th>Issued to</th>
                  <th>SO#</th>
                  <th className="text-right">Issued</th>
                  <th>Source CV</th>
                  <th>Liquidating JV</th>
                  <th className="text-right">Outstanding</th>
                  <th>Age</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {CASH_ADV.map((c) => {
                  const stale = c.age === "90+" && c.bal > 0;
                  return (
                    <tr
                      key={c.ca}
                      className={cn(stale && "bg-(--st-danger-bg)")}
                    >
                      <td>
                        <DocChip code={c.ca} />
                      </td>
                      <td className="font-semibold text-jce-ink">{c.to}</td>
                      <td>
                        <DocChip code={c.so} />
                      </td>
                      <td className="num">{pmoney(c.amount)}</td>
                      <td>
                        <DocChip code={c.cv} />
                      </td>
                      <td>
                        {c.jv === "—" ? (
                          <span className="text-jce-ink-2">—</span>
                        ) : (
                          <DocChip code={c.jv} />
                        )}
                      </td>
                      <td className="num font-semibold">{pmoney(c.bal)}</td>
                      <td>{c.age}</td>
                      <td>
                        <Chip tone={CA_STATUS_TONE[c.status] ?? "neutral"}>
                          {c.status}
                        </Chip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="glass rounded-(--r-glass) p-2">
          <EmptyState
            icon={
              <WalletIcon className="size-7" strokeWidth={1.5} aria-hidden />
            }
            title="No outstanding cash advances"
            description="Every advance has been liquidated. New advances appear here with their aging bucket."
          />
        </div>
      )}
    </div>
  );
}
