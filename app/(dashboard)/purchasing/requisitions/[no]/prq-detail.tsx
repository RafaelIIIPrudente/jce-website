"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";

import { pmoneyU } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canEdit, canVerb } from "@/lib/rbac";
import {
  PRQ_TONE,
  URGENCY_TONE,
  resolveApprovalChain,
  forPurchaseFromMr,
  mrHeader,
  type Prq,
  type PrqStatus,
} from "@/lib/mock/purchasing";
import { forPurchaseQty } from "@/lib/mock/pmg";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

// U11 · PRQ detail. The approval chain is resolved at submit + STORED on the
// record. Approved → "Create PO" prefills from the linked MR's For-Purchase
// lines. Approve / Reject verbs are canVerb-only.
export function PrqDetail({ prq }: { prq: Prq }) {
  const { role } = useJce();
  const mayVerb = canVerb(role, "pur");
  const mayEdit = canEdit(role, "pur");
  const [status, setStatus] = useState<PrqStatus>(prq.status);

  const chain = resolveApprovalChain("PR", prq.est, prq.ccy);
  const mr = prq.mr !== "—" ? mrHeader(prq.mr) : undefined;
  const fp = prq.mr !== "—" ? forPurchaseFromMr(prq.mr) : [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <Link
        href="/purchasing/requisitions"
        className="focus-ring-jce inline-flex w-fit items-center gap-1.5 rounded-(--r-chip) text-ui-12 font-semibold text-jce-ink-2 hover:text-jce-green-900"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden /> Requisitions
      </Link>

      <PageHeader
        kicker="Purchasing · U11"
        title={
          <span className="flex items-center gap-2">
            <DocChip code={prq.no} />
            <Chip tone={URGENCY_TONE[prq.urgency] ?? "neutral"}>
              {prq.urgency}
            </Chip>
            <Chip tone={PRQ_TONE[status] ?? "neutral"}>{status}</Chip>
          </span>
        }
        description={`${prq.requestor} · ${prq.project} · ${prq.date}`}
        actions={
          <>
            {mayVerb && status === "Pending Approval" ? (
              <>
                <Button
                  variant="approve"
                  size="sm"
                  onClick={() => {
                    setStatus("Approved");
                    toast.success(
                      "PRQ approved — chain stored; ready to Create PO.",
                    );
                  }}
                >
                  <CheckIcon data-icon="inline-start" /> Approve
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-(--st-danger)"
                  onClick={() => {
                    setStatus("Rejected");
                    toast.success("PRQ rejected.");
                  }}
                >
                  Reject
                </Button>
              </>
            ) : null}
            {mayEdit && status === "Approved" ? (
              <Button size="sm" asChild>
                <Link href="/purchasing/orders/new">Create PO →</Link>
              </Button>
            ) : null}
          </>
        }
      />

      <div className="solid grid gap-4 rounded-(--r-solid) p-5 sm:grid-cols-2">
        <Pair k="Estimated total" v={`₱${pmoneyU(prq.est)}`} />
        <Pair k="Linked MR" v={prq.mr} />
        <div className="sm:col-span-2">
          <dt className="text-ui-12 text-jce-ink-2">
            Approval chain (resolved at submit · stored · band {chain.band})
          </dt>
          <dd className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {chain.chain.map((step, i) => (
              <span key={step} className="flex items-center gap-1.5">
                {i > 0 ? <span className="text-jce-ink-2">→</span> : null}
                <Chip tone="info">{step}</Chip>
              </span>
            ))}
            {chain.boardNote ? <Chip tone="pending">+ Board note</Chip> : null}
          </dd>
        </div>
      </div>

      {mr && fp.length > 0 ? (
        <div className="solid rounded-(--r-solid) p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="kicker">Create-from-MR prefill</span>
            <DocChip code={mr.no} />
            <Chip tone="info">{fp.length} For-Purchase line(s)</Chip>
          </div>
          <table className="jtable">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th className="num">Required</th>
                <th className="num">For Purchase</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {fp.map((l) => (
                <tr key={l.no}>
                  <td className="mono text-ui-12">{l.no}</td>
                  <td>{l.desc}</td>
                  <td className="num">{l.reqQty}</td>
                  <td className="num font-semibold">{forPurchaseQty(l)}</td>
                  <td>{l.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

function Pair({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-ui-12 text-jce-ink-2">{k}</dt>
      <dd className="mt-1 font-semibold text-jce-ink">{v}</dd>
    </div>
  );
}
