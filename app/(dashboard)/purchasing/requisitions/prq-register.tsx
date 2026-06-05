"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { pmoneyU } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import {
  PRQS,
  PRQ_TONE,
  URGENCY_TONE,
  SLA_HOURS,
  type Prq,
} from "@/lib/mock/purchasing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

const TODAY = "2026-06-04";

/** Hours elapsed since the PRQ date — drives the SLA-breach chip. */
function elapsedHours(date: string): number {
  return (Date.parse(TODAY) - Date.parse(date)) / 3_600_000;
}
function breached(p: Prq): boolean {
  if (p.status !== "Pending Approval" && p.status !== "Draft") return false;
  return elapsedHours(p.date) >= SLA_HOURS[p.urgency];
}

// U11 · Purchase Requisitions (pur-core.jsx:1106). PRQ-YY-XXXX, urgency chip,
// approval chain resolved at submit + stored. SLA: Critical 4h / Routine 48h.
export function PrqRegister() {
  const router = useRouter();
  const { role } = useJce();
  const canCreate = canEdit(role, "pur");

  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-4">
      <PageHeader
        kicker="Purchasing · U11"
        title={
          <span className="flex items-center gap-2">
            Purchase Requisitions <Chip tone="pending">OPEN-Q #17</Chip>
          </span>
        }
        actions={
          canCreate ? (
            <Button
              size="sm"
              onClick={() =>
                toast.info(
                  "New PRQ — create blank or prefill from an approved MR.",
                )
              }
            >
              + New PRQ
            </Button>
          ) : null
        }
      />

      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>PRQ No.</th>
              <th>Date</th>
              <th>Requestor</th>
              <th>Project</th>
              <th>MR No.</th>
              <th className="num">Est. total</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Current step</th>
            </tr>
          </thead>
          <tbody>
            {PRQS.map((p) => (
              <tr
                key={p.no}
                onClick={() => router.push(`/purchasing/requisitions/${p.no}`)}
                className="cursor-pointer"
              >
                <td>
                  <DocChip code={p.no} />
                </td>
                <td className="mono text-ui-12">{p.date}</td>
                <td>{p.requestor}</td>
                <td>{p.project}</td>
                <td>
                  {p.mr === "—" ? (
                    <span className="text-jce-ink-2">—</span>
                  ) : (
                    <DocChip code={p.mr} />
                  )}
                </td>
                <td className="num">{pmoneyU(p.est)}</td>
                <td>
                  <span className="flex items-center gap-1.5">
                    <Chip tone={URGENCY_TONE[p.urgency] ?? "neutral"}>
                      {p.urgency}
                    </Chip>
                    {breached(p) ? <Chip tone="danger">SLA breach</Chip> : null}
                  </span>
                </td>
                <td>
                  <Chip tone={PRQ_TONE[p.status] ?? "neutral"}>{p.status}</Chip>
                </td>
                <td className="text-jce-ink-2">{p.step}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-ui-12 text-jce-ink-2">
        Approval chain is resolved at submit from the threshold table and stored
        on the record (later edits don&apos;t change it). Mandatory threshold
        ₱20K recommendation — <span className="font-semibold">OPEN-Q #17</span>.
      </p>
    </div>
  );
}
