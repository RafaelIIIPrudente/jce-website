"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { LockIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import {
  DAY_TYPES,
  EMPLOYEES,
  PROJECTS,
  findEmployee,
  getTimeRows,
  isLockedForEmployee,
  projLabel,
  rowDistribution,
  weekTotals,
  type TimeRow,
} from "@/lib/mock/hr";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { FieldComputed } from "@/components/jce/field-computed";
import { LockGateBanner } from "@/components/jce/lock-gate-banner";

// H5 · Weekly entry grid (hr-time.jsx:13). Dense, keyboard-first, frozen Date
// column. Day-Type + Working-Project pickers. The Manhours Distribution columns
// (Regular / OT / Night Diff / Abs-UT) are DERIVED live from Time In/Out + Day
// Type (computeManhours) — never editable. Multi-project days split the day's
// distribution evenly across rows. Auto-leave rows (from approved RFL/LOA) are 🔒
// read-only. The grid locks once its batch is Verified in H6.
//   canEdit = (timekeeper || owner) && !locked

const PROJECT_OPTIONS = ["—", ...PROJECTS.map((p) => p.so)];

export function TimekeepingGrid() {
  const { role } = useJce();
  const [empId, setEmpId] = useState(9); // Noel Bautista
  const [rows, setRows] = useState<TimeRow[]>(() =>
    getTimeRows().map((r) => ({ ...r })),
  );
  const [previewLock, setPreviewLock] = useState(false);

  const emp = findEmployee(empId);
  const verified = emp ? isLockedForEmployee(emp.no) : false;
  const locked = verified || previewLock;
  const isEditor = role === "timekeeper" || role === "owner";
  const canEdit = isEditor && !locked;

  const totals = weekTotals(rows);

  // keyboard cell-nav across the two time columns (0 = In, 1 = Out)
  const timeRefs = useRef<Map<string, HTMLInputElement | null>>(new Map());
  const refKey = (r: number, c: number) => `${r}:${c}`;
  const focusCell = (r: number, c: number) => {
    const el = timeRefs.current.get(refKey(r, c));
    if (el) {
      el.focus();
      el.select();
    }
  };
  const onTimeKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    r: number,
    c: number,
  ) => {
    const el = e.currentTarget;
    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      focusCell(r + 1, c);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusCell(r - 1, c);
    } else if (e.key === "ArrowLeft" && el.selectionStart === 0) {
      e.preventDefault();
      focusCell(r, c - 1);
    } else if (
      e.key === "ArrowRight" &&
      el.selectionStart === el.value.length
    ) {
      e.preventDefault();
      focusCell(r, c + 1);
    }
  };

  const setCell = (i: number, patch: Partial<TimeRow>) =>
    setRows((rs) => rs.map((row, j) => (j === i ? { ...row, ...patch } : row)));

  const addRow = (sameDate?: TimeRow) => {
    const base: TimeRow = sameDate
      ? {
          id: Math.max(0, ...rows.map((r) => r.id)) + 1,
          date: sameDate.date,
          day: sameDate.day,
          dayType: sameDate.dayType,
          proj: "—",
          in: sameDate.in,
          out: sameDate.out,
          leave: null,
          remarks: "Multi-project (split)",
          multi: true,
        }
      : {
          id: Math.max(0, ...rows.map((r) => r.id)) + 1,
          date: "2026-06-01",
          day: "Mon",
          dayType: "Regular Day",
          proj: "—",
          in: "07:00",
          out: "16:00",
          leave: null,
          remarks: "",
        };
    setRows((rs) => [...rs, base]);
  };

  const headTh = "bg-card";

  if (!emp) return null;

  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-5">
      {/* context bar */}
      <div className="glass flex flex-wrap items-end justify-between gap-4 rounded-(--r-glass) px-5 py-4">
        <div>
          <div className="kicker">HR · H5 · Timekeeping</div>
          <h1 className="mt-1 text-ui-22 font-bold tracking-tight text-jce-ink">
            Weekly entry grid
          </h1>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-ui-12 font-semibold text-jce-ink-2">
            Employee
            <select
              className="field h-9 w-64"
              value={empId}
              onChange={(e) => setEmpId(Number(e.target.value))}
            >
              {EMPLOYEES.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.no} · {e.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-ui-12 font-semibold text-jce-ink-2">
            Week
            <select className="field h-9 w-56">
              <option>May 25 – 31, 2026 (Sun–Sat)</option>
              <option>Jun 1 – 7, 2026</option>
            </select>
          </label>
        </div>
      </div>

      {/* auto-fill context strip */}
      <div className="solid grid grid-cols-2 gap-4 rounded-(--r-solid) p-4 sm:grid-cols-4">
        {[
          ["Employee Name", emp.name],
          ["Position", emp.pos],
          ["Place of Assignment", emp.assign],
          ["Pay Period", `${emp.cat} 21–05`],
        ].map(([k, v]) => (
          <div key={k}>
            <div className="kicker text-jce-green-600">{k}</div>
            <div className="mt-1 text-ui-13 text-jce-ink">{v}</div>
          </div>
        ))}
      </div>

      {/* lock state */}
      <div className="flex flex-wrap items-center gap-3">
        <LockGateBanner
          className="flex-1"
          state={locked ? "locked" : "draft"}
          title={locked ? "Locked — batch verified" : "Open"}
          detail={
            locked
              ? "Rows are read-only. Re-open from Verification batches (Timekeeper, with reason) to edit."
              : "Editable by Timekeeper · distribution recomputes live."
          }
        />
        {verified ? (
          <Button asChild variant="ghost" size="sm">
            <Link href="/hr/timekeeping/batches">Verification batches</Link>
          </Button>
        ) : isEditor ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPreviewLock((v) => !v)}
          >
            {previewLock ? "Preview: unlock" : "Preview: locked state"}
          </Button>
        ) : null}
      </div>

      {/* the grid */}
      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th rowSpan={2} className={cn("sticky left-0 z-10", headTh)}>
                Date
              </th>
              <th rowSpan={2}>Day Type</th>
              <th rowSpan={2}>Working Project</th>
              <th rowSpan={2} className="text-right">
                Time In
              </th>
              <th rowSpan={2} className="text-right">
                Time Out
              </th>
              <th colSpan={4} className="text-center">
                Manhours Distribution{" "}
                <span className="rounded bg-jce-green-50 px-1 py-0.5 text-[9px] font-bold text-jce-green-700">
                  COMPUTED
                </span>
              </th>
              <th rowSpan={2}>Leave Status</th>
              <th rowSpan={2}>Remarks</th>
            </tr>
            <tr>
              <th className="text-right">Regular</th>
              <th className="text-right">OT</th>
              <th className="text-right">Night Diff</th>
              <th className="text-right">Abs/UT</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const d = rowDistribution(r, rows);
              const prevSameDate = i > 0 && rows[i - 1]?.date === r.date;
              const isAuto = Boolean(r.autoLeave);
              const rowEditable = canEdit && !isAuto;
              return (
                <tr key={r.id} className={cn(isAuto && "bg-(--table-zebra)")}>
                  <td
                    className={cn(
                      "sticky left-0 z-10",
                      isAuto ? "bg-(--table-zebra)" : "bg-card",
                    )}
                  >
                    {prevSameDate ? (
                      <span className="text-ui-12 text-jce-ink-2">
                        ↳ same day
                      </span>
                    ) : (
                      <span className="whitespace-nowrap">
                        <strong>{r.day}</strong>{" "}
                        <span className="font-mono text-jce-ink-2">
                          {r.date.slice(8)}
                        </span>
                      </span>
                    )}
                  </td>
                  <td>
                    {rowEditable ? (
                      <select
                        className="field h-8 w-40"
                        value={r.dayType}
                        onChange={(e) =>
                          setCell(i, { dayType: e.target.value })
                        }
                      >
                        {DAY_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={cn(isAuto && "text-jce-ink-2")}>
                        {r.dayType}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="flex items-center gap-1.5">
                      {rowEditable ? (
                        <select
                          className="field h-8 w-36"
                          value={r.proj}
                          onChange={(e) => setCell(i, { proj: e.target.value })}
                        >
                          {PROJECT_OPTIONS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      ) : r.proj === "—" ? (
                        <span className="text-jce-ink-2">—</span>
                      ) : (
                        <DocChip code={projLabel(r.proj)} />
                      )}
                      {r.multi ? (
                        <span className="rounded bg-jce-orange-100 px-1 py-0.5 text-[9px] font-semibold text-jce-orange-600">
                          ½ split
                        </span>
                      ) : null}
                    </span>
                  </td>
                  <td className="num">
                    {rowEditable ? (
                      <input
                        ref={(el) => {
                          timeRefs.current.set(refKey(i, 0), el);
                        }}
                        value={r.in === "—" ? "" : r.in}
                        placeholder="—"
                        onChange={(e) =>
                          setCell(i, { in: e.target.value || "—" })
                        }
                        onKeyDown={(e) => onTimeKey(e, i, 0)}
                        className="w-16 rounded-lg bg-transparent px-1 py-0.5 text-right font-mono text-ui-13 outline-none focus:bg-jce-green-50 focus-visible:shadow-(--focus-ring)"
                      />
                    ) : r.in === "—" ? (
                      <span className="text-jce-ink-2">—</span>
                    ) : (
                      <span className="font-mono">{r.in}</span>
                    )}
                  </td>
                  <td className="num">
                    {rowEditable ? (
                      <input
                        ref={(el) => {
                          timeRefs.current.set(refKey(i, 1), el);
                        }}
                        value={r.out === "—" ? "" : r.out}
                        placeholder="—"
                        onChange={(e) =>
                          setCell(i, { out: e.target.value || "—" })
                        }
                        onKeyDown={(e) => onTimeKey(e, i, 1)}
                        className="w-16 rounded-lg bg-transparent px-1 py-0.5 text-right font-mono text-ui-13 outline-none focus:bg-jce-green-50 focus-visible:shadow-(--focus-ring)"
                      />
                    ) : r.out === "—" ? (
                      <span className="text-jce-ink-2">—</span>
                    ) : (
                      <span className="font-mono">{r.out}</span>
                    )}
                  </td>
                  <td className="num">
                    <FieldComputed>{d.reg.toFixed(1)}</FieldComputed>
                  </td>
                  <td className="num">
                    <FieldComputed>{d.ot.toFixed(1)}</FieldComputed>
                  </td>
                  <td className="num">
                    <FieldComputed>{d.nd.toFixed(1)}</FieldComputed>
                  </td>
                  <td className="num">
                    {d.abs > 0 ? (
                      <FieldComputed className="text-(--st-danger)">
                        {d.abs.toFixed(1)}
                      </FieldComputed>
                    ) : (
                      <span className="text-jce-ink-2">—</span>
                    )}
                  </td>
                  <td>
                    {r.leave ? (
                      <span className="flex items-center gap-1.5">
                        <Chip tone="success">{r.leave}</Chip>
                        {r.leaveRef ? <DocChip code={r.leaveRef} /> : null}
                      </span>
                    ) : (
                      <span className="text-jce-ink-2">—</span>
                    )}
                  </td>
                  <td>
                    <span className="flex items-center gap-1.5 text-ui-12 text-jce-ink-2">
                      {isAuto ? (
                        <LockIcon className="size-3 shrink-0" aria-hidden />
                      ) : null}
                      {r.remarks}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td colSpan={5} className="sticky left-0 z-10 bg-card text-right">
                Week totals
              </td>
              <td className="num">{totals.reg.toFixed(1)}</td>
              <td className="num">{totals.ot.toFixed(1)}</td>
              <td className="num">{totals.nd.toFixed(1)}</td>
              <td className="num">{totals.abs.toFixed(1)}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      {canEdit ? (
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => addRow()}>
            + Add row
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const last = rows[rows.length - 1];
              if (last) addRow(last);
            }}
          >
            + Add project row (same date)
          </Button>
          <Button
            size="sm"
            className="ml-auto"
            onClick={() => toast.success("Recomputed & saved (mock).")}
          >
            Recompute &amp; save
          </Button>
        </div>
      ) : null}

      <div className="glass rounded-(--r-glass) p-5">
        <div className="text-ui-13 font-semibold text-jce-ink">
          Computation rules the grid honors
        </div>
        <ul className="mt-2 flex flex-col gap-1.5 text-ui-12 text-jce-ink-2">
          <li>
            Breaks deducted only when fully spanned — lunch 12–1 PM, OT meal
            10–11 PM, night meal 2–3 AM.
          </li>
          <li>
            <strong className="text-jce-ink">Regular</strong> = min(net, 8) ·{" "}
            <strong className="text-jce-ink">OT</strong> = excess over 8 ·{" "}
            <strong className="text-jce-ink">Night Diff</strong> = 11 PM–6 AM
            overlap (separate, may overlap OT).
          </li>
          <li>
            Multi-project days share one Time In/Out and split the distribution{" "}
            <strong className="text-jce-ink">evenly across project rows</strong>{" "}
            (fractional allowed, e.g. 1.5).
          </li>
          <li>
            Rows auto-created from approved leave (RFL/LOA) are{" "}
            <LockIcon className="inline size-3" aria-hidden /> marked and
            read-only here.
          </li>
        </ul>
      </div>
    </div>
  );
}
