"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";

import { qn } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canEdit, canVerb } from "@/lib/rbac";
import {
  GATE_TONE,
  RELEASE_LINES,
  gateLockState,
  releaseGuard,
  type Release,
  type GateStatus,
} from "@/lib/mock/warehouse";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { FieldComputed } from "@/components/jce/field-computed";
import { LockGateBanner } from "@/components/jce/lock-gate-banner";

// W5 · Release form (wh-docs.jsx:477). Negative-stock HARD-BLOCK unless Admin
// override + reason. Lock posts Issue movements (Utilized up, Balance down).
export function ReleaseForm({ rel }: { rel: Release }) {
  const { role } = useJce();
  const mayEdit = canEdit(role, "wh");
  const mayLock = canVerb(role, "wh");

  const [status, setStatus] = useState<GateStatus>(rel.status);
  const [oversize, setOversize] = useState(false);
  const [overridden, setOverridden] = useState(false);

  const locked = status === "Locked";
  const base = RELEASE_LINES[0];
  const onHand = base?.onHand ?? 0;
  const qty = oversize ? 2000 : (base?.qty ?? 0);
  const guard = releaseGuard(onHand, qty);
  const blocked = guard.negative && !overridden;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <Link
        href="/warehouse/releases"
        className="focus-ring-jce inline-flex w-fit items-center gap-1.5 rounded-(--r-chip) text-ui-12 font-semibold text-jce-ink-2 hover:text-jce-green-900"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden /> Release forms
      </Link>

      <PageHeader
        kicker="Warehouse · W5"
        title={
          <span className="flex items-center gap-2">
            Release <DocChip code={rel.no} />
            <Chip tone={GATE_TONE[status] ?? "neutral"}>{status}</Chip>
          </span>
        }
      />

      <LockGateBanner
        state={gateLockState(status)}
        title={status}
        detail={
          locked
            ? "Locked — Issue movements posted; immutable."
            : "Lock posts Issue movements (Utilized up, Running Balance down)."
        }
      />
      <div className="flex flex-wrap items-center gap-2">
        {status === "Draft" && mayEdit ? (
          <Button size="sm" onClick={() => setStatus("For Checking")}>
            Submit for checking
          </Button>
        ) : null}
        {status === "For Checking" && mayLock ? (
          <Button
            variant="lock"
            size="sm"
            disabled={blocked}
            onClick={() => {
              setStatus("Locked");
              toast.success(
                "Locked — Issue posted; Utilized up, Balance down.",
              );
            }}
          >
            Lock
          </Button>
        ) : null}
        {status === "For Checking" && !mayLock ? (
          <span className="text-ui-12 text-jce-ink-2">
            Awaiting Warehouse Admin to Lock
          </span>
        ) : null}
        {status === "Locked" && mayLock ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatus("For Checking");
              toast.success("Unlocked — Issue movements reversed (audited).");
            }}
          >
            Unlock (reverses movements · audited)
          </Button>
        ) : null}
      </div>

      {!locked ? (
        <div
          className={
            blocked
              ? "solid flex items-start gap-3 rounded-(--r-solid) border-l-4 border-l-(--st-danger) p-3 text-ui-12 text-(--st-danger-ink)"
              : "solid flex items-start gap-3 rounded-(--r-solid) border-l-4 border-l-(--st-pending) p-3 text-ui-12 text-jce-ink"
          }
        >
          <span>
            <strong>Negative-stock guard</strong> — releasing {qn(qty)}{" "}
            {base?.unit} against {qn(onHand)} on-hand would leave{" "}
            <strong>{qn(guard.resulting)}</strong>.{" "}
            {guard.negative
              ? "Hard-blocked unless an Admin override with reason."
              : "Within stock — Lock posts the Issue."}
          </span>
        </div>
      ) : null}

      {mayEdit && !locked ? (
        <label className="flex w-fit items-center gap-2 text-ui-12 text-jce-ink-2">
          <input
            type="checkbox"
            checked={oversize}
            onChange={(e) => {
              setOversize(e.target.checked);
              setOverridden(false);
            }}
            className="accent-jce-green-700"
          />
          Simulate over-release (exceeds on-hand)
        </label>
      ) : null}
      {blocked && mayLock ? (
        <Button
          variant="lock"
          size="sm"
          className="w-fit"
          onClick={() => {
            setOverridden(true);
            toast.success(
              "Admin override logged (reason recorded) — release may now Lock.",
            );
          }}
        >
          Admin override (negative stock · reason)
        </Button>
      ) : null}

      <div className="solid flex flex-col gap-4 rounded-(--r-solid) p-5">
        <div className="grid grid-cols-2 gap-3 text-ui-12">
          <Pair k="Release No." v={<FieldComputed>{rel.no}</FieldComputed>} />
          <Pair k="Date" v={<span className="mono">{rel.date}</span>} />
          <Pair k="Project + Location" v={`${rel.project} · ${rel.loc}`} />
          <Pair k="Received By (free-text)" v={rel.recvBy} />
          <Pair
            k="Warehouseman"
            v={<FieldComputed>G. Lim (releaser, logged)</FieldComputed>}
          />
        </div>
        <div className="text-ui-13 font-semibold text-jce-ink">Lines</div>
        <div className="overflow-auto rounded-(--r-solid) border border-jce-line">
          <table className="jtable">
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th className="num">Qty</th>
                <th>Unit</th>
                <th className="num">On-hand</th>
              </tr>
            </thead>
            <tbody>
              {RELEASE_LINES.map((l) => (
                <tr key={l.item}>
                  <td>{l.item}</td>
                  <td className="text-jce-ink-2">{l.desc}</td>
                  <td className="num">{qn(oversize ? 2000 : l.qty)}</td>
                  <td>{l.unit}</td>
                  <td className="num">
                    <span className="computed">{qn(l.onHand)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Pair({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <dt className="text-jce-ink-2">{k}</dt>
      <dd className="mt-1 text-jce-ink">{v}</dd>
    </div>
  );
}
