"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { CUSTODY_RECORDS, type CustodyRecord } from "@/lib/mock/warehouse";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

// W12 · Returnable-tool custody ledger (wh-phase2.jsx:265). Who holds which
// returnable tool, OUT date, and the Return event.
export function Custody() {
  const { role } = useJce();
  const mayEdit = canEdit(role, "wh");
  const [recs, setRecs] = useState<CustodyRecord[]>(() => [...CUSTODY_RECORDS]);

  const recordReturn = (id: number) => {
    setRecs((xs) =>
      xs.map((r) =>
        r.id === id ? { ...r, holder: "—", back: "2026-06-04" } : r,
      ),
    );
    toast.success("Return recorded — tool back in warehouse custody.");
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <PageHeader
        kicker="Warehouse · W12 · Phase 2"
        title="Returnable-tool custody"
        actions={
          mayEdit ? (
            <Button
              size="sm"
              onClick={() =>
                toast.info(
                  "Issue tool (OUT) — assign a holder + accountability code.",
                )
              }
            >
              + Issue tool (OUT)
            </Button>
          ) : null
        }
      />
      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>Tool</th>
              <th>Accountability code</th>
              <th>Current holder</th>
              <th>OUT date</th>
              <th>Returned</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {recs.map((r) => (
              <tr key={r.id}>
                <td className="font-semibold">{r.item}</td>
                <td>
                  <DocChip code={r.code} />
                </td>
                <td>
                  {r.holder === "—" ? (
                    <span className="text-jce-ink-2">in warehouse</span>
                  ) : (
                    r.holder
                  )}
                </td>
                <td className="mono text-ui-12">{r.out}</td>
                <td>
                  {r.back ? (
                    <span className="mono text-ui-12">{r.back}</span>
                  ) : (
                    <Chip tone="pending">Out</Chip>
                  )}
                </td>
                <td>
                  {!r.back && mayEdit ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => recordReturn(r.id)}
                    >
                      Record return
                    </Button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-ui-12 text-jce-ink-2">
        Promotes the Accountability Code into a real custody ledger: who holds
        which returnable tool, OUT date, and the Return event.
      </p>
    </div>
  );
}
