"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { qn } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import {
  MOVEMENTS,
  MOVE_TONE,
  adjustmentValid,
  type Movement,
} from "@/lib/mock/warehouse";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

// W7 · Stock movements ledger (immutable · wh-core.jsx:385). Signed qty, running
// balance, source doc, reason. Post Adjustment (canVerb) requires a mandatory
// reason. Movements never editable — corrections are compensating movements.
export function Movements() {
  const { role } = useJce();
  const canAdjust = canVerb(role, "wh");
  const [rows, setRows] = useState<Movement[]>(() => [...MOVEMENTS]);
  const [open, setOpen] = useState(false);
  const [loc, setLoc] = useState("Main Office");
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("");

  const deltaNum = Number(delta);
  const valid = adjustmentValid(deltaNum, reason);

  const post = () => {
    if (!valid) {
      toast.error(
        "Adjustment rejected — a signed delta and a mandatory reason are required.",
      );
      return;
    }
    const lastBal = rows[0]?.bal ?? 0;
    const next: Movement = {
      item: "ITM-00142",
      type: "Adjustment",
      qty: deltaNum,
      date: "2026-06-04",
      actor: "G. Lim",
      loc,
      src: "manual",
      reason: reason.trim(),
      bal: lastBal + deltaNum,
    };
    setRows((xs) => [next, ...xs]);
    setOpen(false);
    setDelta("");
    setReason("");
    toast.success("Adjustment posted (audited) — immutable movement appended.");
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        kicker="Warehouse · W7"
        title="Stock movements — ACSR conductor 1/0"
        actions={
          canAdjust ? (
            <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
              Post Adjustment
            </Button>
          ) : null
        }
      />

      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>Type</th>
              <th className="num">Qty (signed)</th>
              <th>Date</th>
              <th>Actor</th>
              <th>Location</th>
              <th>Source</th>
              <th>Reason</th>
              <th className="num">Running balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m, i) => (
              <tr key={`${m.src}-${m.type}-${i}`}>
                <td>
                  <Chip tone={MOVE_TONE[m.type] ?? "neutral"}>{m.type}</Chip>
                </td>
                <td
                  className={cn(
                    "num font-semibold",
                    m.qty < 0 ? "text-(--st-danger)" : "text-(--st-success)",
                  )}
                >
                  {m.qty > 0 ? "+" : ""}
                  {qn(m.qty)}
                </td>
                <td className="mono text-ui-12">{m.date}</td>
                <td>{m.actor}</td>
                <td>{m.loc}</td>
                <td>
                  {m.src === "manual" ? (
                    <span className="text-jce-ink-2">manual</span>
                  ) : (
                    <DocChip code={m.src} />
                  )}
                </td>
                <td className="text-jce-ink-2">{m.reason ?? "—"}</td>
                <td className="num font-semibold">{qn(m.bal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-ui-12 text-jce-ink-2">
        Movements are immutable — corrections are compensating movements or
        document unlocks. Adjustment without a reason is rejected.
      </p>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-jce-ink/30 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass-modal flex w-full max-w-md flex-col gap-4 rounded-(--r-glass) p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-ui-16 font-semibold text-jce-ink">
                Post adjustment
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="focus-ring-jce rounded-(--r-chip) p-1 text-jce-ink-2 hover:text-jce-ink"
                aria-label="Close"
              >
                <XIcon className="size-4" aria-hidden />
              </button>
            </div>
            <div className="grid gap-3 text-ui-12">
              <label className="flex flex-col gap-1">
                <span className="text-jce-ink-2">Item</span>
                <span className="computed">ACSR conductor 1/0 (ITM-00142)</span>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-jce-ink-2">Location</span>
                <select
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                  className="field h-9"
                >
                  <option>Main Office</option>
                  <option>Bulacan site</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-jce-ink-2">
                  Signed delta <span className="text-(--st-danger)">*</span>
                </span>
                <input
                  value={delta}
                  onChange={(e) => setDelta(e.target.value)}
                  placeholder="e.g. -12"
                  className="field h-9"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-jce-ink-2">
                  Reason <span className="text-(--st-danger)">*</span>{" "}
                  (mandatory)
                </span>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="mandatory"
                  className="field h-9"
                />
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" disabled={!valid} onClick={post}>
                Post (audited)
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
