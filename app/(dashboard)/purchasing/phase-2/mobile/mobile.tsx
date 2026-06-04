"use client";

import { useState } from "react";

import { MOBILE_APPROVALS, type MobileApproval } from "@/lib/mock/purchasing";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

// U22 · Mobile approvals (pur-phase2b.jsx:341). U12 at phone width; ≥44px
// targets; scoped to import gates 4 & 7 + POs in For Approval.
export function MobileApprovals() {
  const [items, setItems] = useState<MobileApproval[]>(() => [
    ...MOBILE_APPROVALS,
  ]);
  const drop = (ref: string) =>
    setItems((xs) => xs.filter((x) => x.ref !== ref));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <PageHeader
        kicker="Purchasing · U22 · Phase 2"
        title="Mobile approvals"
        description="U12 at phone width · the two biggest stall points."
      />
      <div className="grid items-start gap-6 lg:grid-cols-[300px_1fr]">
        <div className="mx-auto w-[300px] overflow-hidden rounded-[36px] border-8 border-jce-ink bg-(--solid-surface) shadow-(--glass-shadow)">
          <div className="flex items-center justify-between gap-2 bg-(--glass-nav) px-4 py-3">
            <span className="text-ui-13 font-bold text-jce-ink">Approvals</span>
            <span className="grid size-6 place-items-center rounded-full bg-jce-green-700 text-[11px] font-bold text-primary-foreground">
              {items.length}
            </span>
          </div>
          <div className="flex flex-col gap-3 p-3">
            {items.length === 0 ? (
              <div className="py-10 text-center">
                <div className="text-ui-14 font-semibold text-jce-ink">
                  All caught up
                </div>
                <div className="text-ui-12 text-jce-ink-2">
                  Nothing to approve.
                </div>
              </div>
            ) : (
              items.map((a) => (
                <div
                  key={a.ref}
                  className="solid flex flex-col gap-2 rounded-(--r-solid) p-3"
                >
                  <div className="flex items-center gap-1.5">
                    <Chip tone="danger">{a.entity}</Chip>
                    <Chip
                      tone={a.urgency === "Critical" ? "danger" : "neutral"}
                    >
                      {a.urgency}
                    </Chip>
                  </div>
                  <DocChip code={a.ref} className="w-fit" />
                  <div className="text-ui-13 font-semibold text-jce-ink">
                    {a.payee}
                  </div>
                  <div className="money text-ui-13 font-semibold text-jce-ink">
                    {a.amt}{" "}
                    <span className="text-ui-12 font-normal text-jce-ink-2">
                      · {a.age}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => drop(a.ref)}
                      className="focus-ring-jce min-h-11 flex-1 rounded-(--r-input) bg-jce-green-700 text-ui-13 font-semibold text-primary-foreground"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => drop(a.ref)}
                      className="focus-ring-jce min-h-11 rounded-(--r-input) border border-jce-line px-4 text-ui-13 font-semibold text-jce-ink"
                    >
                      Hold
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="glass rounded-(--r-glass) p-4">
          <div className="text-ui-13 font-semibold text-jce-ink">
            Mobile approval queue
          </div>
          <p className="mt-2 text-ui-12 leading-relaxed text-jce-ink-2">
            Single-column queue, large ≥44px Approve / Hold / Reject targets,
            note input. Push / email reminders fire after N days. Scoped to the
            two biggest stall points: <strong>import stages 4 &amp; 7</strong>{" "}
            and <strong>POs in For Approval</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
