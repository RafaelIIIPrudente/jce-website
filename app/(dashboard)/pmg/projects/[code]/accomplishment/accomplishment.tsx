"use client";

import { useMemo, useState } from "react";
import {
  CameraIcon,
  LockIcon,
  PrinterIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { canEdit, ROLES } from "@/lib/rbac";
import {
  BOQ,
  DP_PCT,
  PB1_DEFAULTS,
  RET_PCT,
  boqRows,
  computeAccomplishment,
  type AccRow,
  type PmgProject,
} from "@/lib/mock/pmg";
import { peso, pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Chip } from "@/components/jce/chip";
import { LockGateBanner } from "@/components/jce/lock-gate-banner";

// P8 · Accomplishment workspace (FLAGSHIP — the computational heart). The PM Head
// keys ONE judgment per row — This Period % (the only editable cells, clamped
// 0–100). Everything else derives. Stage-sequence guardrail soft-blocks Submit
// (reason required); informational delivery cross-check. Submit → lock. The
// byte-faithful PRINT view is sacred (OQ#4 client template). Anchor: NORECO II
// PB1 = 11.34% → PBn ₱6,039,221.60 / NET ₱4,529,416.20.

const REVIEWED_PHOTO_KEYS = new Set(["A.1-Procure", "B.1-Deliver"]); // from P14

function fmtTp(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

export function Accomplishment({ project }: { project: PmgProject }) {
  const { role } = useJce();
  const canEditPmg = canEdit(role, "pmg");
  const contract = project.contract || 53277688;

  const rows = useMemo(() => boqRows(), []);
  const [vals, setVals] = useState<
    Record<string, { prev: number; tp: number }>
  >(() => {
    const o: Record<string, { prev: number; tp: number }> = {};
    rows.forEach((r) => {
      const d = PB1_DEFAULTS[r.key] ?? [0, 0];
      o[r.key] = { prev: d[0], tp: d[1] };
    });
    return o;
  });
  const [submitted, setSubmitted] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [view, setView] = useState<"screen" | "print">("screen");
  const [guardReasons, setGuardReasons] = useState<Record<string, string>>({});

  const period = computeAccomplishment(rows, vals, contract);
  const { comp, PBn, accomplishment, recoup, retention, net } = period;

  const setTP = (key: string, v: string) => {
    if (!canEditPmg || submitted) return;
    const n = Math.max(0, Math.min(100, Number(v) || 0));
    setVals((s) => ({
      ...s,
      [key]: { ...(s[key] ?? { prev: 0, tp: 0 }), tp: n },
    }));
  };

  // stage-sequence guardrail: Install advancing while Procure/Deliver < 100%
  const stageToDate: Record<string, Record<string, number>> = {};
  comp.forEach((r) => {
    if (r.stage) (stageToDate[r.no] ??= {})[r.stage] = r.toDate;
  });
  const isGuarded = (r: AccRow) =>
    r.stage === "Install" &&
    r.tp > 0 &&
    ((stageToDate[r.no]?.Procure ?? 0) < 100 ||
      (stageToDate[r.no]?.Deliver ?? 0) < 100);
  const isDelivery = (r: AccRow) => r.key === "B.1-Procure" && r.tp > 0;

  const guardedKeys = comp.filter(isGuarded).map((r) => r.key);
  const missingReason = guardedKeys.some((k) => !guardReasons[k]?.trim());
  const canSubmit = canEditPmg && !submitted && !missingReason;

  // ---------------- BYTE-FAITHFUL PRINT VIEW (sacred — OQ#4) ----------------
  if (view === "print") {
    return (
      <div className="flex flex-col gap-4">
        <div className="jce-print-hide glass flex flex-wrap items-center gap-3 rounded-(--r-glass) px-4 py-2.5">
          <Button variant="ghost" size="sm" onClick={() => setView("screen")}>
            ← Screen view
          </Button>
          <span className="kicker">
            Byte-faithful print — PM head&rsquo;s spreadsheet · sacred layout
          </span>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => window.print()}
          >
            <PrinterIcon data-icon="inline-start" /> Print / PDF
          </Button>
        </div>

        <div className="solid rounded-(--r-solid) p-6 font-mono text-[11px] text-jce-ink">
          <div className="text-center">
            <div className="text-[13px] font-bold">
              JC ELECTROFIELDS POWER SYSTEM, INC.
            </div>
            <div className="font-bold tracking-wide">ACCOMPLISHMENT REPORT</div>
            <div className="text-jce-ink-2">
              {project.name} · {project.client} · SO# {project.so} · Period: PB1
              · As of: 2026-05-15
            </div>
          </div>
          <table className="mt-4 w-full border-collapse [&_td]:border [&_td]:border-jce-ink/40 [&_td]:px-1.5 [&_td]:py-0.5 [&_th]:border [&_th]:border-jce-ink/40 [&_th]:px-1.5 [&_th]:py-0.5">
            <thead>
              <tr className="bg-(--table-zebra)">
                <th rowSpan={2}>ITEM</th>
                <th rowSpan={2} className="text-left">
                  DESCRIPTION
                </th>
                <th rowSpan={2}>STAGE</th>
                <th rowSpan={2}>AMOUNT</th>
                <th rowSpan={2}>WT %</th>
                <th colSpan={2}>PREVIOUS</th>
                <th colSpan={2}>THIS PERIOD</th>
                <th colSpan={2}>TO DATE</th>
              </tr>
              <tr className="bg-(--table-zebra)">
                <th>%</th>
                <th>WT</th>
                <th>%</th>
                <th>WT</th>
                <th>%</th>
                <th>WT</th>
              </tr>
            </thead>
            <tbody className="text-right">
              {BOQ.map((c) => (
                <PrintCategory key={c.cat} cat={c.cat} comp={comp} />
              ))}
              <tr className="bg-jce-green-50 font-bold">
                <td colSpan={3} className="text-left">
                  GRAND TOTAL
                </td>
                <td>{pmoney(contract)}</td>
                <td>100.00</td>
                <td>0.00</td>
                <td>0.00</td>
                <td />
                <td>{pmoney(accomplishment)}</td>
                <td />
                <td>{pmoney(accomplishment)}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 ml-auto w-72">
            {[
              ["PROGRESS BILL (PB1)", pmoney(PBn)],
              [`Less: DP Recoupment (${DP_PCT}%)`, `(${pmoney(recoup)})`],
              [`Less: Retention (${RET_PCT}%)`, `(${pmoney(retention)})`],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between border-b border-jce-line py-0.5"
              >
                <span>{k}</span>
                <span>{v}</span>
              </div>
            ))}
            <div className="flex justify-between border-y-2 border-jce-ink py-1 font-bold">
              <span>NET AMOUNT</span>
              <span>{pmoney(net)}</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6">
            {["Prepared by · Project Manager", "Checked by", "Approved by"].map(
              (r) => (
                <div key={r}>
                  <div className="h-6 border-b border-jce-ink" />
                  <div className="mt-1 text-center text-[9px] tracking-wide uppercase">
                    {r}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ON-SCREEN WORKSPACE ----------------
  return (
    <div className="flex flex-col gap-5">
      <div className="glass flex flex-wrap items-end justify-between gap-4 rounded-(--r-glass) p-5">
        <div className="min-w-0">
          <div className="kicker">PMG · P8 · Accomplishment</div>
          <h1 className="mt-1 text-ui-22 font-bold tracking-tight text-jce-ink">
            {project.name}
          </h1>
          <p className="mt-1 text-ui-13 text-jce-ink-2">
            {project.client} · SO# {project.so} · Contract {peso(contract)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select className="field h-9 w-auto" aria-label="Period">
            <option>PB1 · as of 2026-05-15</option>
            <option>PB2 (open)</option>
          </select>
          {submitted ? (
            <Chip tone="locked">Submitted · Locked</Chip>
          ) : (
            <Chip tone="neutral">Draft</Chip>
          )}
          <Button variant="ghost" size="sm" onClick={() => setView("print")}>
            Print view
          </Button>
          {canEditPmg && !submitted ? (
            <Button
              size="sm"
              onClick={() => setShowSubmit(true)}
              disabled={!canSubmit}
            >
              Submit period
            </Button>
          ) : null}
        </div>
      </div>

      {!canEditPmg ? (
        <div className="flex flex-wrap items-center gap-2 rounded-(--r-solid) border border-(--masked-border) bg-(--table-zebra) px-4 py-2.5 text-ui-12 text-jce-ink-2">
          <LockIcon className="size-3.5 shrink-0" aria-hidden />
          Only the <strong className="text-jce-ink">PM Head</strong> can key
          This Period %. You have read-only access ({ROLES[role].short}).
        </div>
      ) : null}

      {submitted ? (
        <LockGateBanner
          state="locked"
          title="Period PB1 submitted — immutable"
          detail="Corrections = next-period adjusting entry (default) or an audited re-open with full snapshot. To Date is now the PB2 baseline."
        />
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        {/* report grid */}
        <div className="solid overflow-auto rounded-(--r-solid) p-0">
          <table className="jtable text-ui-12">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-card">Item</th>
                <th>Description</th>
                <th>Stage</th>
                <th className="text-right">Prev %</th>
                <th className="text-right">This Period %</th>
                <th className="text-right">To Date %</th>
                <th className="text-right">Wt %</th>
                <th className="text-right">TP wt</th>
                <th className="text-right">TD wt</th>
                <th className="text-right">Amount (PB)</th>
              </tr>
            </thead>
            <tbody>
              {BOQ.map((c) => (
                <CategoryBlock
                  key={c.cat}
                  cat={c.cat}
                  comp={comp}
                  canEdit={canEditPmg}
                  submitted={submitted}
                  isGuarded={isGuarded}
                  isDelivery={isDelivery}
                  guardReasons={guardReasons}
                  setGuardReasons={setGuardReasons}
                  setTP={setTP}
                />
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold">
                <td colSpan={4} className="sticky left-0 z-10 bg-card">
                  Grand total · this-period accomplishment
                </td>
                <td className="num">{pmoney(accomplishment)}%</td>
                <td />
                <td className="num">100.00</td>
                <td className="num">{pmoney(accomplishment)}</td>
                <td />
                <td className="num">{pmoney(PBn)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* NET AMOUNT block + indicators */}
        <div className="flex flex-col gap-4">
          <div className="solid rounded-(--r-solid) p-5">
            <h2 className="kicker text-jce-green-600">NET AMOUNT · PB1</h2>
            <div className="mt-3 flex flex-col gap-1.5 text-ui-13">
              <div className="flex justify-between">
                <span className="text-jce-ink-2">Progress Bill (PB1)</span>
                <span className="font-mono font-semibold tabular-nums">
                  {peso(PBn)}
                </span>
              </div>
              <div className="flex justify-between text-jce-ink-2">
                <span>− DP Recoupment ({DP_PCT}%)</span>
                <span className="font-mono tabular-nums">
                  ({pmoney(recoup)})
                </span>
              </div>
              <div className="flex justify-between text-jce-ink-2">
                <span>− Retention ({RET_PCT}%)</span>
                <span className="font-mono tabular-nums">
                  ({pmoney(retention)})
                </span>
              </div>
              <div className="mt-1 flex justify-between border-t border-jce-line pt-2 text-ui-14 font-bold text-jce-green-900">
                <span>NET AMOUNT</span>
                <span className="font-mono tabular-nums">{peso(net)}</span>
              </div>
            </div>
            <p className="mt-3 rounded-(--r-input) bg-jce-green-50 px-3 py-2 text-ui-12 text-jce-green-900">
              Reference anchor — NORECO II PB1: 11.34% · ₱6,039,221.60 −
              905,883.24 − 603,922.16 = <strong>₱4,529,416.20</strong>
            </p>
          </div>

          <div className="solid rounded-(--r-solid) p-5 text-ui-12">
            <div className="flex items-start gap-2 text-jce-ink-2">
              <TriangleAlertIcon
                className="mt-0.5 size-3.5 shrink-0 text-(--st-pending-ink)"
                aria-hidden
              />
              Stage-sequence guardrail — soft block; override with a recorded
              reason before Submit.
            </div>
            <div className="mt-2 flex items-start gap-2 text-jce-ink-2">
              <span className="mt-0.5 text-(--st-info)" aria-hidden>
                ◇
              </span>
              Delivery cross-check — informational; never blocks. Procure↔stages
              1–7, Deliver↔8–13, Install↔14–15.
            </div>
            {missingReason ? (
              <div className="mt-2 flex items-start gap-2 text-(--st-danger-ink)">
                <TriangleAlertIcon
                  className="mt-0.5 size-3.5 shrink-0"
                  aria-hidden
                />
                A guarded row (Install ahead of Procure/Deliver) needs a reason
                before this period can be submitted.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Dialog open={showSubmit} onOpenChange={setShowSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit PB1 — lock period?</DialogTitle>
            <DialogDescription>
              This locks the period (immutable). To Date becomes the baseline
              for PB2. Net Amount {peso(net)} flows to billing (P9). Corrections
              then require a next-period adjusting entry or an audited re-open.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowSubmit(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setSubmitted(true);
                setShowSubmit(false);
                toast.success(
                  "PB1 submitted & locked — flows to billing (P9).",
                );
              }}
            >
              Submit &amp; lock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CategoryBlock({
  cat,
  comp,
  canEdit: canEditPmg,
  submitted,
  isGuarded,
  isDelivery,
  guardReasons,
  setGuardReasons,
  setTP,
}: {
  cat: string;
  comp: AccRow[];
  canEdit: boolean;
  submitted: boolean;
  isGuarded: (r: AccRow) => boolean;
  isDelivery: (r: AccRow) => boolean;
  guardReasons: Record<string, string>;
  setGuardReasons: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setTP: (key: string, v: string) => void;
}) {
  const category = BOQ.find((c) => c.cat === cat);
  if (!category) return null;
  const rows = comp.filter((r) => category.lines.some((l) => l.no === r.no));
  return (
    <>
      <tr className="bg-jce-green-50">
        <td colSpan={10} className="font-semibold text-jce-green-900">
          {cat}
        </td>
      </tr>
      {rows.map((r) => {
        const guarded = isGuarded(r);
        const delivery = isDelivery(r);
        const reviewed = REVIEWED_PHOTO_KEYS.has(r.key);
        return (
          <tr key={r.key} className={cn(guarded && "bg-(--st-pending-bg)")}>
            <td className="sticky left-0 z-10 bg-card font-mono font-semibold">
              {r.no}
            </td>
            <td>
              <span className="flex items-center gap-1.5">
                {r.desc}
                {reviewed ? (
                  <span
                    title="Field photo reviewed (P14)"
                    className="inline-flex items-center gap-0.5 rounded bg-jce-green-50 px-1 py-0.5 text-[9px] font-semibold text-jce-green-700"
                  >
                    <CameraIcon className="size-2.5" aria-hidden />
                  </span>
                ) : null}
              </span>
            </td>
            <td>
              {r.stage ? (
                <span className="rounded bg-(--table-zebra) px-1.5 py-0.5 text-[10px] font-semibold text-jce-ink-2">
                  {r.stage}
                </span>
              ) : (
                <span className="text-jce-ink-2">—</span>
              )}
            </td>
            <td className="num">{pmoney(r.prev)}</td>
            <td className="num">
              <div className="flex items-center justify-end gap-1">
                {canEditPmg && !submitted ? (
                  <input
                    value={fmtTp(r.tp)}
                    onChange={(e) => setTP(r.key, e.target.value)}
                    inputMode="decimal"
                    className="w-14 rounded-[4px] bg-transparent px-1 py-0.5 text-right font-mono outline-none focus:bg-jce-green-50 focus-visible:shadow-(--focus-ring)"
                  />
                ) : (
                  <span className="font-mono">{pmoney(r.tp)}</span>
                )}
                {guarded ? (
                  <TriangleAlertIcon
                    className="size-3.5 text-(--st-pending-ink)"
                    aria-hidden
                  />
                ) : null}
                {delivery ? (
                  <span
                    className="text-(--st-info)"
                    title="Delivery cross-check"
                  >
                    ◇
                  </span>
                ) : null}
              </div>
              {guarded && canEditPmg && !submitted ? (
                <input
                  value={guardReasons[r.key] ?? ""}
                  onChange={(e) =>
                    setGuardReasons((s) => ({ ...s, [r.key]: e.target.value }))
                  }
                  placeholder="Reason required (Install ahead of P/D)…"
                  className="field mt-1 h-7 w-full text-[11px]"
                />
              ) : null}
            </td>
            <td className="num computed">{pmoney(r.toDate)}</td>
            <td className="num">{pmoney(r.weight)}</td>
            <td className="num computed">{pmoney(r.tpW)}</td>
            <td className="num computed">{pmoney(r.tdW)}</td>
            <td className="num">{pmoney(r.peso)}</td>
          </tr>
        );
      })}
    </>
  );
}

function PrintCategory({ cat, comp }: { cat: string; comp: AccRow[] }) {
  const category = BOQ.find((c) => c.cat === cat);
  if (!category) return null;
  const rows = comp.filter((r) => category.lines.some((l) => l.no === r.no));
  return (
    <>
      <tr className="bg-(--table-zebra) font-bold">
        <td colSpan={11} className="text-left">
          {cat}
        </td>
      </tr>
      {rows.map((r) => (
        <tr key={r.key}>
          <td className="text-center">{r.no}</td>
          <td className="text-left">{r.desc}</td>
          <td className="text-center">{r.stage ?? "—"}</td>
          <td>{pmoney(r.value)}</td>
          <td>{pmoney(r.weight)}</td>
          <td>{pmoney(r.prev)}</td>
          <td>{pmoney((r.weight * r.prev) / 100)}</td>
          <td>{pmoney(r.tp)}</td>
          <td>{pmoney(r.tpW)}</td>
          <td>{pmoney(r.toDate)}</td>
          <td>{pmoney(r.tdW)}</td>
        </tr>
      ))}
    </>
  );
}
