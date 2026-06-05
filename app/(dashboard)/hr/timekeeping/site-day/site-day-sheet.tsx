"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LockIcon, PencilIcon, SearchIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import {
  DAY_TYPES,
  DEFAULT_SITE_HOURS,
  EMPLOYEES,
  EMP_ASSIGN_FILTERS,
  HR_TODAY,
  LEGACY_EMP_NO,
  PROJECTS,
  ROW_STATUS_TONE,
  addHoursToTime,
  addSiteDayRows,
  addTimeRow,
  findEmployeeByNo,
  getSiteDayType,
  getTimeRowsForSite,
  isLockedForEmployee,
  isTimeValue,
  projCodeForAssign,
  rowDistribution,
  rowStatus,
  setSiteDayType,
  siteToken,
  standardHoursForSite,
  updateTimeRow,
  weekdayOf,
  type Distribution,
  type Employee,
  type RowStatus,
  type TimeRow,
} from "@/lib/mock/hr";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PageHeader } from "@/components/jce/page-header";
import { KpiTile } from "@/components/jce/kpi-tile";
import { Segmented } from "@/components/jce/segmented";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";
import { FieldComputed } from "@/components/jce/field-computed";
import { LockGateBanner } from "@/components/jce/lock-gate-banner";

// H5b · Site Day Sheet — exception-first attendance for one SITE + one DATE.
// Pick a site → Pre-fill (everyone Present at the site's standard hours under one
// site Day Type) → touch only the exceptions → Post. Logging stays PER EMPLOYEE
// (one TimeRow each, own derived Reg/OT/ND/Abs). All edits write THROUGH to the
// shared timeRowStore so the By-employee grid + H6 batches see them.
//   canEdit = (timekeeper || owner) && !locked(row)

const ZERO: Distribution = { reg: 0, ot: 0, nd: 0, abs: 0 };
const PAGE_SIZE = 25;
const STATUS_FILTERS = ["All", "Exceptions", "Absent", "Leave", "OT"] as const;
const SITE_OPTIONS = EMP_ASSIGN_FILTERS.filter((s) => s !== "All");
const PROJECT_OPTIONS = ["—", ...PROJECTS.map((p) => p.so)];
const LEAVE_OPTIONS = [
  "None",
  "Leave With Pay",
  "Leave Without Pay",
  "On Leave",
];

type BoardRow = {
  empNo: string;
  emp: Employee | undefined;
  committed: TimeRow | null;
  view: TimeRow;
  ghost: boolean;
  status: RowStatus;
  dist: Distribution;
  locked: boolean;
  invalid: boolean;
};

type EditDraft = {
  in: string;
  out: string;
  dayType: string;
  leave: string;
  remarks: string;
  second: string;
};

function ghostRow(
  empNo: string,
  emp: Employee | undefined,
  site: string,
  date: string,
  dayType: string,
  std: { in: string; out: string },
): TimeRow {
  const onLeave = emp?.status === "On Leave";
  const suspended = emp?.status === "Suspended";
  return {
    id: -1,
    empNo,
    site,
    date,
    day: weekdayOf(date),
    dayType,
    proj: onLeave ? "—" : projCodeForAssign(site),
    in: onLeave || suspended ? "—" : std.in,
    out: onLeave || suspended ? "—" : std.out,
    leave: onLeave ? "On Leave" : null,
    remarks: suspended ? "Suspended" : "",
  };
}

export function SiteDaySheet() {
  const { role } = useJce();
  const isEditor = role === "timekeeper" || role === "owner";

  const [site, setSite] = useState("");
  const [date, setDate] = useState(HR_TODAY);
  const [dayType, setDayType] = useState("Regular Day");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  // bumped after each store write so the render body re-reads getTimeRowsForSite
  const [, setVersion] = useState(0);
  const [posted, setPosted] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState(0);
  const [restampTo, setRestampTo] = useState<string | null>(null);
  const [postOpen, setPostOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [draft, setDraft] = useState<EditDraft | null>(null);

  const hasContext = site !== "" && date !== "";
  const std = hasContext ? standardHoursForSite(site) : DEFAULT_SITE_HOURS;
  const postKey = `${site}|${date}`;
  const isPosted = posted.has(postKey);

  // Warn on hard refresh/close with unsaved (un-posted) edits.
  useEffect(() => {
    if (dirty === 0) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const bump = () => setVersion((v) => v + 1);

  const onSite = (v: string) => {
    setSite(v);
    setDayType(v && date ? getSiteDayType(v, date) : "Regular Day");
    setPage(1);
    setSelected(new Set());
    setDirty(0);
    setSearch("");
    setStatusFilter("All");
  };
  const onDate = (v: string) => {
    setDate(v);
    setDayType(site && v ? getSiteDayType(site, v) : "Regular Day");
    setPage(1);
    setSelected(new Set());
    setDirty(0);
  };

  // ---- Roster (committed store rows ∪ assigned employees as ghost previews) --
  const committed = hasContext ? getTimeRowsForSite(site, date) : [];
  const assigned = hasContext ? EMPLOYEES.filter((e) => e.assign === site) : [];
  const byNo = new Map<string, TimeRow>();
  for (const r of committed) byNo.set(r.empNo ?? LEGACY_EMP_NO, r);
  const empNos: string[] = [];
  const seen = new Set<string>();
  for (const e of assigned)
    if (!seen.has(e.no)) {
      seen.add(e.no);
      empNos.push(e.no);
    }
  for (const r of committed) {
    const n = r.empNo ?? LEGACY_EMP_NO;
    if (!seen.has(n)) {
      seen.add(n);
      empNos.push(n);
    }
  }

  const boardRows: BoardRow[] = empNos.map((no) => {
    const emp = findEmployeeByNo(no);
    const committedRow = byNo.get(no) ?? null;
    const view = committedRow ?? ghostRow(no, emp, site, date, dayType, std);
    const invalid =
      !view.leave && (!isTimeValue(view.in) || !isTimeValue(view.out));
    const status = rowStatus(view, std);
    const dist = invalid
      ? ZERO
      : committedRow
        ? rowDistribution(committedRow, committed)
        : rowDistribution(view, [view]);
    return {
      empNo: no,
      emp,
      committed: committedRow,
      view,
      ghost: !committedRow,
      status,
      dist,
      locked: isLockedForEmployee(no),
      invalid,
    };
  });

  const ghostCount = boardRows.filter((b) => b.ghost).length;
  const committedCount = boardRows.length - ghostCount;
  const invalidCount = boardRows.filter((b) => b.invalid).length;
  const lockedCount = boardRows.filter((b) => b.locked).length;

  // KPIs + totals over the FULL site set (never the paginated page).
  const present = boardRows.filter((b) => b.status === "Present").length;
  const absent = boardRows.filter((b) => b.status === "Absent").length;
  const leave = boardRows.filter((b) => b.status === "Leave").length;
  const exceptions = boardRows.filter(
    (b) => b.status !== "Present" && b.status !== "Rest",
  ).length;
  const totals = boardRows.reduce<Distribution>(
    (acc, b) => ({
      reg: r1(acc.reg + b.dist.reg),
      ot: r1(acc.ot + b.dist.ot),
      nd: r1(acc.nd + b.dist.nd),
      abs: r1(acc.abs + b.dist.abs),
    }),
    ZERO,
  );
  const siteManhours = r1(totals.reg + totals.ot);

  // ---- Display filter + pagination -----------------------------------------
  const q = search.trim().toLowerCase();
  const filtered = boardRows.filter((b) => {
    if (
      statusFilter === "Exceptions" &&
      (b.status === "Present" || b.status === "Rest")
    )
      return false;
    if (statusFilter === "Absent" && b.status !== "Absent") return false;
    if (statusFilter === "Leave" && b.status !== "Leave") return false;
    if (statusFilter === "OT" && b.status !== "OT") return false;
    if (q) {
      const hay =
        `${b.empNo}${b.emp?.name ?? ""}${b.emp?.pos ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // ---- Mutations (write-through) -------------------------------------------
  const markDirty = () => setDirty((d) => d + 1);

  const preFill = () => {
    const { added, kept } = addSiteDayRows({ site, date, dayType });
    bump();
    if (added > 0) markDirty();
    toast.success(
      added > 0
        ? `Pre-filled — ${added} new row${added === 1 ? "" : "s"}${kept > 0 ? `, ${kept} kept` : ""}.`
        : `Already pre-filled — ${kept} row${kept === 1 ? "" : "s"} kept.`,
    );
  };

  const setRowIn = (row: TimeRow, val: string) => {
    updateTimeRow(row.id, { in: val, dayTypeOverridden: true });
    bump();
    markDirty();
  };
  const setRowOut = (row: TimeRow, val: string) => {
    updateTimeRow(row.id, { out: val, dayTypeOverridden: true });
    bump();
    markDirty();
  };
  const setRowRemarks = (row: TimeRow, val: string) => {
    updateTimeRow(row.id, { remarks: val, dayTypeOverridden: true });
    bump();
    markDirty();
  };

  const applyDayType = (next: string) => {
    setSiteDayType(site, date, next);
    setDayType(next);
    // re-stamp only untouched, unlocked committed rows
    const untouched = committed.filter(
      (r) =>
        !r.dayTypeOverridden && !isLockedForEmployee(r.empNo ?? LEGACY_EMP_NO),
    );
    for (const r of untouched) updateTimeRow(r.id, { dayType: next });
    bump();
    if (untouched.length > 0) markDirty();
    setRestampTo(null);
  };
  const onDayTypeChange = (next: string) => {
    if (next === dayType) return;
    const untouched = committed.filter(
      (r) =>
        !r.dayTypeOverridden && !isLockedForEmployee(r.empNo ?? LEGACY_EMP_NO),
    );
    if (untouched.length === 0) {
      applyDayType(next);
      return;
    }
    setRestampTo(next);
  };

  // ---- Bulk ----------------------------------------------------------------
  const toggleSelect = (no: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(no)) next.delete(no);
      else next.add(no);
      return next;
    });
  const selectableOnPage = pageRows.filter((b) => !b.ghost && !b.locked);
  const allPageSelected =
    selectableOnPage.length > 0 &&
    selectableOnPage.every((b) => selected.has(b.empNo));
  const toggleSelectAll = () =>
    setSelected((s) => {
      const next = new Set(s);
      if (allPageSelected)
        selectableOnPage.forEach((b) => next.delete(b.empNo));
      else selectableOnPage.forEach((b) => next.add(b.empNo));
      return next;
    });

  const selectedRows = () =>
    boardRows.filter((b) => selected.has(b.empNo) && b.committed && !b.locked);

  const bulkAbsent = () => {
    const rows = selectedRows();
    for (const b of rows)
      if (b.committed)
        updateTimeRow(b.committed.id, {
          in: "—",
          out: "—",
          leave: null,
          dayTypeOverridden: true,
        });
    bump();
    markDirty();
    setSelected(new Set());
    toast.success(`Marked ${rows.length} absent.`);
  };
  const bulkPresent = () => {
    const rows = selectedRows();
    for (const b of rows)
      if (b.committed)
        updateTimeRow(b.committed.id, {
          in: std.in,
          out: std.out,
          leave: null,
          dayTypeOverridden: true,
        });
    bump();
    markDirty();
    setSelected(new Set());
    toast.success(`Marked ${rows.length} present.`);
  };
  const bulkOt = (n: number) => {
    const rows = selectedRows();
    let applied = 0;
    for (const b of rows) {
      if (!b.committed) continue;
      const out = addHoursToTime(b.committed.out, n);
      if (b.committed.in === "—" || b.committed.leave || out == null) continue;
      updateTimeRow(b.committed.id, { out, dayTypeOverridden: true });
      applied += 1;
    }
    bump();
    if (applied > 0) markDirty();
    setSelected(new Set());
    const skipped = rows.length - applied;
    toast.success(
      `Applied +${n}h OT to ${applied} of ${rows.length}${skipped > 0 ? `, ${skipped} skipped` : ""}.`,
    );
  };

  // ---- Row editor (Sheet) --------------------------------------------------
  const openEdit = (b: BoardRow) => {
    if (!b.committed) return;
    setEditId(b.committed.id);
    const sib = committed.find(
      (r) => (r.empNo ?? LEGACY_EMP_NO) === b.empNo && r.id !== b.committed?.id,
    );
    setDraft({
      in: b.committed.in,
      out: b.committed.out,
      dayType: b.committed.dayType,
      leave: b.committed.leave ?? "None",
      remarks: b.committed.remarks,
      second: sib?.proj ?? "—",
    });
  };
  const closeEdit = () => {
    setEditId(null);
    setDraft(null);
  };
  const saveEdit = () => {
    if (editId == null || !draft) return;
    const cur = committed.find((r) => r.id === editId);
    updateTimeRow(editId, {
      in: draft.in,
      out: draft.out,
      dayType: draft.dayType,
      leave: draft.leave === "None" ? null : draft.leave,
      remarks: draft.remarks,
      dayTypeOverridden: true,
      multi: draft.second !== "—" ? true : undefined,
    });
    // create a second-project sibling once (multi-project even split)
    if (draft.second !== "—" && cur) {
      const empNo = cur.empNo ?? LEGACY_EMP_NO;
      const hasSibling = committed.some(
        (r) => (r.empNo ?? LEGACY_EMP_NO) === empNo && r.id !== editId,
      );
      if (!hasSibling) {
        addTimeRow({
          empNo,
          site,
          date,
          day: weekdayOf(date),
          dayType: draft.dayType,
          proj: draft.second,
          in: draft.in,
          out: draft.out,
          leave: null,
          remarks: "Multi-project (split)",
          multi: true,
          dayTypeOverridden: true,
        });
      }
    }
    bump();
    markDirty();
    closeEdit();
    toast.success("Row updated.");
  };

  // ---- Post ----------------------------------------------------------------
  const canPost =
    isEditor && committedCount > 0 && invalidCount === 0 && !isPosted;
  const doPost = () => {
    setPosted((p) => new Set(p).add(postKey));
    setDirty(0);
    setPostOpen(false);
    toast.success(
      `Posted — ${present} Present, ${absent} Absent, ${leave} Leave for ${siteToken(site)} · ${date}.`,
    );
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPage(1);
  };

  // ---- Render --------------------------------------------------------------
  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="HR · H5b · Site Day Sheet"
        title="Post attendance"
        description="Record a whole site for one day — everyone Present at standard hours; touch only the exceptions, then Post."
        actions={
          hasContext ? (
            <DocChip code={`DTR · ${siteToken(site)} · ${date}`} />
          ) : null
        }
      />

      {/* Recording-context card */}
      <div className="glass flex flex-col gap-3 rounded-(--r-glass) p-4 lg:flex-row lg:items-end">
        <Field label="Site" className="lg:max-w-xs lg:flex-1">
          <Select value={site} onValueChange={onSite}>
            <SelectTrigger aria-label="Site" className="min-h-11 w-full">
              <SelectValue placeholder="Select a site" />
            </SelectTrigger>
            <SelectContent>
              {SITE_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Date" className="lg:w-48">
          <input
            type="date"
            value={date}
            onChange={(e) => onDate(e.target.value)}
            aria-label="Date"
            className="field min-h-11"
          />
        </Field>
        <Field label="Site Day Type" className="lg:w-56">
          <Select
            value={dayType}
            onValueChange={onDayTypeChange}
            disabled={!hasContext || !isEditor}
          >
            <SelectTrigger
              aria-label="Site Day Type"
              className="min-h-11 w-full"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAY_TYPES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {!hasContext ? (
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            icon={
              <SearchIcon className="size-7" strokeWidth={1.5} aria-hidden />
            }
            title="Pick a site and a date to start recording"
            description="Choose the site and day above — then pre-fill the roster at standard hours."
          />
        </div>
      ) : boardRows.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            icon={
              <SearchIcon className="size-7" strokeWidth={1.5} aria-hidden />
            }
            title={`No active employees assigned to ${site}`}
            description="Assign employees to this site in the Employees list, then pre-fill the day."
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/hr/employees">Open Employees</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <>
          {/* KPI strip — derived off STATUS over the FULL site set */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiTile
              label="Present"
              value={present}
              delta="at standard hours"
              tone="success"
            />
            <KpiTile
              label="Exceptions"
              value={exceptions}
              delta="need a touch"
              tone="pending"
            />
            <KpiTile
              label="Absent"
              value={absent}
              delta="no time in"
              tone="danger"
            />
            <KpiTile
              label="Site manhours"
              value={
                <span className="tabular-nums">{siteManhours.toFixed(1)}</span>
              }
              delta="reg + OT, full site"
              tone="neutral"
            />
          </div>

          <LockGateBanner
            state={isPosted ? "check" : "draft"}
            title={isPosted ? "Posted" : "Draft — not yet posted"}
            detail={
              isPosted
                ? `Attendance posted — awaiting per-employee batch verification in H6.${lockedCount > 0 ? ` ${lockedCount} row(s) already locked.` : ""}`
                : `${committedCount} recorded · ${ghostCount} to pre-fill${lockedCount > 0 ? ` · ${lockedCount} locked` : ""}${dirty > 0 ? ` · ${dirty} unsaved change${dirty === 1 ? "" : "s"}` : ""}`
            }
          />

          {invalidCount > 0 ? (
            <div className="flex items-center gap-2 rounded-(--r-solid) border border-(--st-danger) bg-(--st-danger-bg) px-4 py-2.5 text-ui-13 text-(--st-danger-ink)">
              {invalidCount} row{invalidCount === 1 ? " has an" : "s have"}{" "}
              invalid time — use HH:MM. Posting is blocked until fixed.
            </div>
          ) : null}

          {ghostCount > 0 ? (
            <div className="flex flex-wrap items-center gap-3 rounded-(--r-solid) border border-jce-line bg-(--table-zebra) px-4 py-2.5 text-ui-13 text-jce-ink-2">
              <span>
                {committedCount === 0
                  ? `${ghostCount} employees staged at ${std.in}–${std.out} (${dayType}). Pre-fill to start recording.`
                  : `${ghostCount} newly-assigned employee${ghostCount === 1 ? "" : "s"} not yet pre-filled.`}
              </span>
              {isEditor ? (
                <Button
                  size="sm"
                  className="ml-auto min-h-11"
                  onClick={preFill}
                >
                  Pre-fill site
                </Button>
              ) : null}
            </div>
          ) : null}

          {/* Toolbar */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex h-11 w-full items-center gap-2 rounded-(--r-input) border border-jce-line bg-card/70 px-3 transition-colors focus-within:border-jce-green-600 focus-within:shadow-(--focus-ring) sm:max-w-sm">
                <SearchIcon
                  className="size-4 shrink-0 text-jce-ink-2"
                  aria-hidden
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name, no., position…"
                  aria-label="Search employees"
                  className="h-full w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
                />
              </div>
              {isEditor ? (
                <Button
                  className="min-h-11 w-full sm:w-auto"
                  disabled={!canPost}
                  onClick={() => setPostOpen(true)}
                >
                  Post attendance
                </Button>
              ) : null}
            </div>
            <div className="-mx-1 overflow-x-auto px-1">
              <Segmented
                aria-label="Filter by status"
                options={STATUS_FILTERS.map((f) => ({ value: f, label: f }))}
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Bulk bar */}
          {isEditor && selected.size > 0 ? (
            <div className="solid flex flex-wrap items-center gap-2 rounded-(--r-solid) p-3">
              <span className="text-ui-12 font-semibold text-jce-ink-2">
                {selected.size} selected
              </span>
              <Button
                size="sm"
                variant="outline"
                className="min-h-11"
                onClick={bulkPresent}
              >
                Mark Present
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="min-h-11"
                onClick={bulkAbsent}
              >
                Mark Absent
              </Button>
              <span className="ml-1 text-ui-12 text-jce-ink-2">Apply OT</span>
              {[1, 2, 4].map((n) => (
                <Button
                  key={n}
                  size="sm"
                  variant="outline"
                  className="min-h-11"
                  onClick={() => bulkOt(n)}
                >
                  +{n}h
                </Button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                className="ml-auto min-h-11"
                onClick={() => setSelected(new Set())}
              >
                Clear
              </Button>
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <div className="glass rounded-(--r-glass) p-6">
              <EmptyState
                icon={
                  <SearchIcon
                    className="size-7"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                }
                title="No employees match"
                description="Adjust your search or status filter."
                action={
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              {/* DESKTOP roster — frozen Employee column */}
              <div className="solid hidden overflow-x-auto rounded-(--r-solid) p-0 lg:block">
                <table className="jtable jtable-sticky-first">
                  <thead>
                    <tr>
                      <th>
                        {isEditor ? (
                          <input
                            type="checkbox"
                            checked={allPageSelected}
                            onChange={toggleSelectAll}
                            aria-label="Select all on page"
                            className="size-4 align-middle accent-jce-green-700"
                          />
                        ) : null}{" "}
                        Employee
                      </th>
                      <th>Status</th>
                      <th>In</th>
                      <th>Out</th>
                      <th className="text-right">Reg</th>
                      <th className="text-right">OT</th>
                      <th className="text-right">ND</th>
                      <th className="text-right">Abs</th>
                      <th>Leave</th>
                      <th>Remarks</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((b) => {
                      const editable = isEditor && !b.ghost && !b.locked;
                      return (
                        <tr key={b.empNo}>
                          <td>
                            <div className="flex items-center gap-2">
                              {isEditor ? (
                                <input
                                  type="checkbox"
                                  checked={selected.has(b.empNo)}
                                  onChange={() => toggleSelect(b.empNo)}
                                  disabled={b.ghost || b.locked}
                                  aria-label={`Select ${b.emp?.name ?? b.empNo}`}
                                  className="size-4 shrink-0 accent-jce-green-700"
                                />
                              ) : null}
                              <div className="min-w-0">
                                <div className="truncate font-semibold text-jce-ink">
                                  {b.emp?.name ?? b.empNo}
                                </div>
                                <div className="truncate text-ui-12 text-jce-ink-2">
                                  {b.empNo} · {b.emp?.pos ?? "—"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <StatusChip b={b} />
                          </td>
                          <td>
                            <TimeCell
                              row={b.committed}
                              value={b.view.in}
                              editable={editable}
                              onChange={(v) =>
                                b.committed && setRowIn(b.committed, v)
                              }
                            />
                          </td>
                          <td>
                            <TimeCell
                              row={b.committed}
                              value={b.view.out}
                              editable={editable}
                              onChange={(v) =>
                                b.committed && setRowOut(b.committed, v)
                              }
                            />
                          </td>
                          <DerivedCell v={b.dist.reg} invalid={b.invalid} />
                          <DerivedCell v={b.dist.ot} invalid={b.invalid} />
                          <DerivedCell v={b.dist.nd} invalid={b.invalid} />
                          <DerivedCell v={b.dist.abs} invalid={b.invalid} />
                          <td className="text-jce-ink-2">
                            {b.view.leave ?? "—"}
                          </td>
                          <td>
                            {editable ? (
                              <input
                                value={b.view.remarks}
                                onChange={(e) =>
                                  b.committed &&
                                  setRowRemarks(b.committed, e.target.value)
                                }
                                className="field h-9 w-40"
                                placeholder="—"
                              />
                            ) : (
                              <span className="text-jce-ink-2">
                                {b.view.remarks || "—"}
                              </span>
                            )}
                          </td>
                          <td>
                            {editable ? (
                              <button
                                type="button"
                                onClick={() => openEdit(b)}
                                aria-label={`Edit ${b.emp?.name ?? b.empNo}`}
                                className="focus-ring-jce grid size-9 place-items-center rounded-(--r-input) text-jce-ink-2 transition-colors hover:bg-jce-green-50 hover:text-jce-green-700"
                              >
                                <PencilIcon className="size-4" aria-hidden />
                              </button>
                            ) : b.locked ? (
                              <LockIcon
                                className="size-3.5 text-(--st-locked-ink)"
                                aria-hidden
                              />
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold">
                      <td>Site totals</td>
                      <td />
                      <td />
                      <td />
                      <td className="num">{totals.reg.toFixed(1)}</td>
                      <td className="num">{totals.ot.toFixed(1)}</td>
                      <td className="num">{totals.nd.toFixed(1)}</td>
                      <td className="num">{totals.abs.toFixed(1)}</td>
                      <td />
                      <td />
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* MOBILE roster — stacked card-rows */}
              <div className="flex flex-col gap-3 lg:hidden">
                {pageRows.map((b) => {
                  const editable = isEditor && !b.ghost && !b.locked;
                  return (
                    <div
                      key={b.empNo}
                      className="solid rounded-(--r-solid) p-4"
                    >
                      <div className="flex items-start gap-2.5">
                        {isEditor ? (
                          <input
                            type="checkbox"
                            checked={selected.has(b.empNo)}
                            onChange={() => toggleSelect(b.empNo)}
                            disabled={b.ghost || b.locked}
                            aria-label={`Select ${b.emp?.name ?? b.empNo}`}
                            className="mt-1 size-5 shrink-0 accent-jce-green-700"
                          />
                        ) : null}
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold text-jce-ink">
                            {b.emp?.name ?? b.empNo}
                          </div>
                          <div className="truncate text-ui-12 text-jce-ink-2">
                            {b.empNo} · {b.emp?.pos ?? "—"}
                          </div>
                        </div>
                        <StatusChip b={b} />
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Field label="In">
                          <TimeCell
                            row={b.committed}
                            value={b.view.in}
                            editable={editable}
                            onChange={(v) =>
                              b.committed && setRowIn(b.committed, v)
                            }
                          />
                        </Field>
                        <Field label="Out">
                          <TimeCell
                            row={b.committed}
                            value={b.view.out}
                            editable={editable}
                            onChange={(v) =>
                              b.committed && setRowOut(b.committed, v)
                            }
                          />
                        </Field>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <MiniStat
                          label="Reg"
                          v={b.dist.reg}
                          invalid={b.invalid}
                        />
                        <MiniStat
                          label="OT"
                          v={b.dist.ot}
                          invalid={b.invalid}
                        />
                        <MiniStat
                          label="ND"
                          v={b.dist.nd}
                          invalid={b.invalid}
                        />
                        <MiniStat
                          label="Abs"
                          v={b.dist.abs}
                          invalid={b.invalid}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2 text-ui-12 text-jce-ink-2">
                        <span>Leave: {b.view.leave ?? "—"}</span>
                        {editable ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-h-11"
                            onClick={() => openEdit(b)}
                          >
                            <PencilIcon className="size-3.5" aria-hidden /> Edit
                          </Button>
                        ) : b.locked ? (
                          <Chip tone="locked">Locked</Chip>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pager (display only) */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-ui-12 text-jce-ink-2">
                  Page {safePage} of {totalPages} · {filtered.length} employees
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="focus-ring-jce min-h-11"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="focus-ring-jce min-h-11"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Re-stamp confirm */}
      <Dialog
        open={restampTo != null}
        onOpenChange={(o) => !o && setRestampTo(null)}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change site day type?</DialogTitle>
            <DialogDescription>
              Re-apply <strong>{restampTo}</strong> to the untouched rows.
              Edited and locked rows keep their current day type.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              className="min-h-11"
              onClick={() => setRestampTo(null)}
            >
              Cancel
            </Button>
            <Button
              className="min-h-11"
              onClick={() => restampTo && applyDayType(restampTo)}
            >
              Re-apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Post attestation */}
      <Dialog open={postOpen} onOpenChange={setPostOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post attendance</DialogTitle>
            <DialogDescription>
              {siteToken(site)} · {date} — posting{" "}
              <strong>{present} Present</strong>,{" "}
              <strong>{absent} Absent</strong>, <strong>{leave} Leave</strong>
              {exceptions - absent - leave > 0
                ? `, ${exceptions - absent - leave} OT/Custom`
                : ""}
              . Per-employee rows stay editable until their batch is verified in
              H6.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              className="min-h-11"
              onClick={() => setPostOpen(false)}
            >
              Cancel
            </Button>
            <Button className="min-h-11" onClick={doPost}>
              Confirm &amp; Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Row editor (drawer) */}
      <Sheet open={editId != null} onOpenChange={(o) => !o && closeEdit()}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 bg-card p-0 sm:max-w-xl"
        >
          <SheetHeader className="border-b border-jce-line p-5">
            <SheetTitle>Edit attendance row</SheetTitle>
            <SheetDescription>
              Fine-tune hours, day type, leave, or split across a second
              project.
            </SheetDescription>
          </SheetHeader>
          {draft ? (
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Time In">
                  <input
                    value={draft.in}
                    onChange={(e) => setDraft({ ...draft, in: e.target.value })}
                    className="field"
                    placeholder="HH:MM or —"
                  />
                </Field>
                <Field label="Time Out">
                  <input
                    value={draft.out}
                    onChange={(e) =>
                      setDraft({ ...draft, out: e.target.value })
                    }
                    className="field"
                    placeholder="HH:MM or —"
                  />
                </Field>
                <Field label="Day Type">
                  <Select
                    value={draft.dayType}
                    onValueChange={(v) => setDraft({ ...draft, dayType: v })}
                  >
                    <SelectTrigger className="min-h-11 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAY_TYPES.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Leave">
                  <Select
                    value={draft.leave}
                    onValueChange={(v) => setDraft({ ...draft, leave: v })}
                  >
                    <SelectTrigger className="min-h-11 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAVE_OPTIONS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Second project (split)" className="sm:col-span-2">
                  <Select
                    value={draft.second}
                    onValueChange={(v) => setDraft({ ...draft, second: v })}
                  >
                    <SelectTrigger className="min-h-11 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_OPTIONS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p === "—" ? "None" : p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Remarks" className="sm:col-span-2">
                  <input
                    value={draft.remarks}
                    onChange={(e) =>
                      setDraft({ ...draft, remarks: e.target.value })
                    }
                    className="field"
                    placeholder="—"
                  />
                </Field>
              </div>
            </div>
          ) : null}
          <div className="flex items-center justify-end gap-2 border-t border-jce-line p-5">
            <Button variant="ghost" className="min-h-11" onClick={closeEdit}>
              Cancel
            </Button>
            <Button className="min-h-11" onClick={saveEdit}>
              Save row
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ---- small helpers / leaf components ---------------------------------------
function r1(n: number): number {
  return Math.round(n * 10) / 10;
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-ui-12 font-semibold text-jce-ink-2">{label}</span>
      {children}
    </div>
  );
}

function StatusChip({ b }: { b: BoardRow }) {
  if (b.invalid)
    return (
      <Chip tone="danger" className="whitespace-nowrap">
        Invalid
      </Chip>
    );
  if (b.ghost)
    return (
      <Chip tone="neutral" className="whitespace-nowrap">
        Pending
      </Chip>
    );
  return <Chip tone={ROW_STATUS_TONE[b.status]}>{b.status}</Chip>;
}

function TimeCell({
  row,
  value,
  editable,
  onChange,
}: {
  row: TimeRow | null;
  value: string;
  editable: boolean;
  onChange: (v: string) => void;
}) {
  if (!editable || !row)
    return <span className="font-mono text-ui-12 text-jce-ink-2">{value}</span>;
  const invalid = value !== "—" && !isTimeValue(value);
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Time"
      className={cn(
        "field h-9 w-20 font-mono",
        invalid && "border-(--st-danger) text-(--st-danger-ink)",
      )}
    />
  );
}

function DerivedCell({ v, invalid }: { v: number; invalid: boolean }) {
  return (
    <td className="num">
      {invalid ? (
        <span className="text-(--st-danger-ink)">—</span>
      ) : (
        <FieldComputed>{v.toFixed(1)}</FieldComputed>
      )}
    </td>
  );
}

function MiniStat({
  label,
  v,
  invalid,
}: {
  label: string;
  v: number;
  invalid: boolean;
}) {
  return (
    <div className="rounded-(--r-input) bg-(--table-zebra) px-2 py-1.5">
      <div className="text-ui-12 text-jce-ink-2">{label}</div>
      <div className="font-mono text-ui-13 tabular-nums text-jce-ink">
        {invalid ? "—" : v.toFixed(1)}
      </div>
    </div>
  );
}
