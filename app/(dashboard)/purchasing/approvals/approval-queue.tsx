"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

import { ccyAmt } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import {
  APPROVALS,
  ENTITY_TONE,
  URGENCY_TONE,
  type ApprovalItem,
} from "@/lib/mock/purchasing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { Segmented } from "@/components/jce/segmented";
import { EmptyState } from "@/components/jce/empty-state";

const VIEWS = [
  { value: "cards", label: "Cards" },
  { value: "table", label: "Table" },
];

// U12 · Approval queue (FLAGSHIP · pur-approvals.jsx:5). Per-user cross-entity
// queue, Cards/Table toggle, Peek drawer, Vacation Mode delegate. A decision is
// a workflow decision, never an e-signature (paper still gets wet-signed). Verbs
// are present only for canVerb roles; read-only roles get oversight, no actions.
export function ApprovalQueue() {
  const { role } = useJce();
  const mayDecide = canVerb(role, "pur");
  const [items, setItems] = useState<ApprovalItem[]>(() => [...APPROVALS]);
  const [view, setView] = useState("cards");
  const [vacation, setVacation] = useState(false);
  const [peek, setPeek] = useState<ApprovalItem | null>(null);

  const decide = (ref: string, action: string) => {
    setItems((xs) => xs.filter((i) => i.ref !== ref));
    setPeek(null);
    toast.success(
      `${action} recorded — audit entry written. Workflow decision, not an e-signature.`,
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <PageHeader
        kicker="Purchasing · U12"
        title="Approval queue"
        actions={
          mayDecide ? (
            <>
              <label className="flex items-center gap-2 text-ui-12 text-jce-ink-2">
                <input
                  type="checkbox"
                  checked={vacation}
                  onChange={(e) => setVacation(e.target.checked)}
                  className="accent-jce-green-700"
                />
                Vacation mode
              </label>
              <Segmented options={VIEWS} value={view} onValueChange={setView} />
            </>
          ) : (
            <Segmented options={VIEWS} value={view} onValueChange={setView} />
          )
        }
      />

      {!mayDecide ? (
        <p className="rounded-(--r-solid) border border-jce-line bg-(--table-zebra) px-3 py-2 text-ui-12 text-jce-ink-2">
          Read-only oversight — you can view the cross-entity queue, but Approve
          / Hold / Reject are not available to your role.
        </p>
      ) : null}

      {mayDecide && vacation ? (
        <div className="solid flex items-center gap-2 rounded-(--r-solid) border-l-4 border-l-(--st-info) px-3 py-2.5 text-ui-12 text-jce-ink">
          Vacation mode on — decisions delegate to <strong>N. Aquino</strong>{" "}
          for 2026-06-05 → 2026-06-12. Both names are logged.
        </div>
      ) : null}

      {items.length === 0 ? (
        <EmptyState
          title="All caught up"
          description="Nothing awaiting your decision."
        />
      ) : view === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((a) => (
            <div
              key={a.ref}
              className="glass flex flex-col gap-2 rounded-(--r-glass) p-4"
            >
              <div className="flex items-center gap-1.5">
                <Chip tone={ENTITY_TONE[a.entity] ?? "neutral"}>
                  {a.entity}
                </Chip>
                <Chip tone={URGENCY_TONE[a.urgency] ?? "neutral"}>
                  {a.urgency}
                </Chip>
              </div>
              <DocChip code={a.ref} className="w-fit" />
              <div className="text-ui-13 font-semibold text-jce-ink">
                {a.payee === "—" ? a.note : a.payee}
              </div>
              <div className="text-ui-12 text-jce-ink-2">{a.note}</div>
              <div className="money text-ui-14 font-semibold text-jce-ink">
                {ccyAmt(a.amount, a.ccy)}
                <span className="ml-1 text-ui-12 font-normal text-jce-ink-2">
                  · {a.requestor} · {a.age}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                {mayDecide ? (
                  <Button
                    variant="approve"
                    size="sm"
                    onClick={() => decide(a.ref, "Approve")}
                  >
                    Approve
                  </Button>
                ) : null}
                <Button variant="ghost" size="sm" onClick={() => setPeek(a)}>
                  Peek
                </Button>
                {mayDecide ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-(--st-danger)"
                    onClick={() => decide(a.ref, "Reject")}
                  >
                    Reject
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="solid overflow-auto rounded-(--r-solid) p-0">
          <table className="jtable">
            <thead>
              <tr>
                <th>Entity</th>
                <th>Reference</th>
                <th>Payee</th>
                <th className="num">Amount</th>
                <th>Requestor</th>
                <th>Age</th>
                <th>Urgency</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.ref}>
                  <td>
                    <Chip tone={ENTITY_TONE[a.entity] ?? "neutral"}>
                      {a.entity}
                    </Chip>
                  </td>
                  <td>
                    <DocChip code={a.ref} />
                  </td>
                  <td className="font-semibold">{a.payee}</td>
                  <td className="num">{ccyAmt(a.amount, a.ccy)}</td>
                  <td>{a.requestor}</td>
                  <td>{a.age}</td>
                  <td>
                    <Chip tone={URGENCY_TONE[a.urgency] ?? "neutral"}>
                      {a.urgency}
                    </Chip>
                  </td>
                  <td>
                    <div className="flex gap-1.5">
                      {mayDecide ? (
                        <Button
                          variant="approve"
                          size="sm"
                          onClick={() => decide(a.ref, "Approve")}
                        >
                          Approve
                        </Button>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPeek(a)}
                      >
                        Peek
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {peek ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-jce-ink/30"
          onClick={() => setPeek(null)}
        >
          <div
            className="glass-modal flex h-full w-full max-w-md flex-col gap-4 overflow-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <Chip tone={ENTITY_TONE[peek.entity] ?? "neutral"}>
                    {peek.entity}
                  </Chip>
                  <DocChip code={peek.ref} />
                </div>
                <div className="mt-1.5 text-ui-13 text-jce-ink-2">
                  {peek.payee} · {ccyAmt(peek.amount, peek.ccy)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPeek(null)}
                className="focus-ring-jce rounded-(--r-chip) p-1 text-jce-ink-2 hover:text-jce-ink"
                aria-label="Close"
              >
                <XIcon className="size-4" aria-hidden />
              </button>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-ui-12">
              <Pair k="Requestor" v={peek.requestor} />
              <Pair k="Age" v={peek.age} />
              <Pair k="Urgency" v={peek.urgency} />
              <Pair k="Amount" v={ccyAmt(peek.amount, peek.ccy)} />
            </dl>
            <p className="text-ui-12 text-jce-ink-2">
              {peek.note}. Decision updates the record + writes an audit entry —
              a workflow decision, never an e-signature (paper still gets
              wet-signed).
            </p>
            {mayDecide ? (
              <>
                <label className="text-ui-12 font-semibold text-jce-ink-2">
                  Note
                </label>
                <input
                  className="field h-9"
                  placeholder="Optional decision note…"
                />
                <div className="mt-1 flex flex-wrap gap-2">
                  <Button
                    variant="approve"
                    size="sm"
                    onClick={() => decide(peek.ref, "Approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-(--st-pending-ink)"
                    onClick={() => decide(peek.ref, "Hold")}
                  >
                    Hold
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-(--st-danger)"
                    onClick={() => decide(peek.ref, "Reject")}
                  >
                    Reject
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-ui-12 text-jce-ink-2">
                Oversight view — decision controls are not available to your
                role.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Pair({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-jce-ink-2">{k}</dt>
      <dd className="mt-0.5 font-semibold text-jce-ink">{v}</dd>
    </div>
  );
}
