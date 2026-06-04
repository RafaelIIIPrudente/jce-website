"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { LockGateBanner } from "@/components/jce/lock-gate-banner";
import { EmptyState } from "@/components/jce/empty-state";

type DupRow = {
  name: string;
  tin: string;
  pos: number;
  rfps: number;
  quotes: number;
};
const GROUP: readonly DupRow[] = [
  { name: "ABB Inc.", tin: "002-118-552-000", pos: 14, rfps: 9, quotes: 5 },
  { name: "ABB Hitachi", tin: "002-118-552-000", pos: 3, rfps: 1, quotes: 0 },
  { name: "A.B.B.", tin: "—", pos: 2, rfps: 0, quotes: 1 },
];

// U14 · Supplier merge (pur-phase2a.jsx:7). Admin / Owner only. TIN exact + name
// fuzzy + email/phone dedup; atomic FK repoint; deactivate-not-delete; reversible
// within 30 days.
export function SupplierMerge() {
  const { role } = useJce();
  const isAdmin = role === "admin" || role === "owner";
  const [primary, setPrimary] = useState("ABB Inc.");
  const [scanned, setScanned] = useState(true);

  if (!isAdmin) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <PageHeader
          kicker="Purchasing · U14 · Phase 1.5"
          title="Supplier merge"
        />
        <LockGateBanner
          state="locked"
          title="Admin only"
          detail="Supplier merge is restricted to Admin / Owner (post-migration cleanup of ~145 records). Your role cannot merge suppliers."
        />
      </div>
    );
  }

  const totals = GROUP.reduce(
    (a, g) => ({
      pos: a.pos + g.pos,
      rfps: a.rfps + g.rfps,
      quotes: a.quotes + g.quotes,
    }),
    { pos: 0, rfps: 0, quotes: 0 },
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <PageHeader
        kicker="Purchasing · U14 · Phase 1.5"
        title="Supplier merge"
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setScanned(true);
              toast.info(
                "Scan complete — 1 duplicate group found (TIN + name fuzzy).",
              );
            }}
          >
            Find duplicate suppliers
          </Button>
        }
      />

      {!scanned ? (
        <EmptyState
          title="No duplicate suppliers found"
          description="Run a scan to surface TIN-exact / name-fuzzy / shared email-phone duplicate groups."
        />
      ) : (
        <>
          <div className="solid rounded-(--r-solid) p-4">
            <div className="mb-2 text-ui-13 font-semibold text-jce-ink">
              Suggested duplicate group{" "}
              <span className="text-ui-12 font-normal text-jce-ink-2">
                (TIN exact + name fuzzy + same email / phone)
              </span>
            </div>
            <table className="jtable">
              <thead>
                <tr>
                  <th>Primary</th>
                  <th>Supplier</th>
                  <th>TIN</th>
                  <th className="num">POs</th>
                  <th className="num">RFPs</th>
                  <th className="num">Quotes</th>
                </tr>
              </thead>
              <tbody>
                {GROUP.map((g) => (
                  <tr key={g.name}>
                    <td>
                      <input
                        type="radio"
                        name="primary"
                        checked={primary === g.name}
                        onChange={() => setPrimary(g.name)}
                        className="accent-jce-green-700"
                        aria-label={`Set ${g.name} as primary`}
                      />
                    </td>
                    <td className="font-semibold">{g.name}</td>
                    <td className="mono text-ui-12">{g.tin}</td>
                    <td className="num">{g.pos}</td>
                    <td className="num">{g.rfps}</td>
                    <td className="num">{g.quotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="solid flex items-start gap-3 rounded-(--r-solid) border-l-4 border-l-(--st-pending) p-3 text-ui-12 text-jce-ink">
            <span>
              <strong>Atomic FK repoint</strong> to <strong>{primary}</strong>:{" "}
              {totals.pos} POs · {totals.rfps} RFPs · {totals.quotes} Quotations
              move over. Duplicates are{" "}
              <strong>deactivated, never deleted</strong>; the merge is logged
              and <strong>reversible within 30 days</strong>.
            </span>
          </div>

          <Button
            className="w-fit"
            onClick={() =>
              toast.success(
                `Merged into “${primary}” — reversible within 30 days.`,
              )
            }
          >
            Merge into “{primary}”
          </Button>
        </>
      )}
    </div>
  );
}
