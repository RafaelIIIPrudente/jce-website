"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  DownloadIcon,
  SearchIcon,
  UploadIcon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import {
  DAY_TYPES,
  EMPLOYEES,
  EMP_ASSIGN_FILTERS,
  HR_TODAY,
  IMPORT_COLUMNS,
  commitImportRows,
  generateTemplateRows,
  importHeaderKey,
  normalizeImportDate,
  siteToken,
  timeRowToRaw,
  validateImportRows,
  type ImportSummary,
  type RawImportRow,
  type StagedAction,
  type StagedRow,
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
import { PageHeader } from "@/components/jce/page-header";
import { KpiTile } from "@/components/jce/kpi-tile";
import { Segmented } from "@/components/jce/segmented";
import { Chip, type ChipTone } from "@/components/jce/chip";
import { EmptyState } from "@/components/jce/empty-state";

// H5b · Excel bulk-import wizard. SheetJS is loaded ONLY here, behind a dynamic
// import, so it stays out of every other route bundle. Parse runs in the browser
// (no upload leaves the device); the pure layer in lib/mock/hr.ts validates and
// commits into the same store the Site Day Sheet / By-employee grid / H6 read.

const PAGE_SIZE = 50;
const SITE_OPTIONS = EMP_ASSIGN_FILTERS.filter((s) => s !== "All");
const REVIEW_FILTERS = [
  "All",
  "Errors",
  "Warnings",
  "To add",
  "To update",
  "Skipped",
] as const;

const SEV_TONE: Record<StagedRow["severity"], ChipTone> = {
  ok: "success",
  warning: "pending",
  error: "danger",
};
const SEV_LABEL: Record<StagedRow["severity"], string> = {
  ok: "OK",
  warning: "Warning",
  error: "Error",
};
const ACTION_LABEL: Record<StagedAction, string> = {
  add: "Add",
  update: "Update",
  "skip-locked": "Locked",
  "skip-duplicate": "Duplicate",
  error: "—",
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
function ymd(s: string): [number, number, number] {
  const p = s.split("-");
  return [Number(p[0] ?? "0"), Number(p[1] ?? "1"), Number(p[2] ?? "1")];
}
function expandDates(start: string, end: string): string[] {
  if (!start) return [];
  if (!end || end < start) return [start];
  const [ys, ms, ds] = ymd(start);
  const [ye, me, de] = ymd(end);
  const cur = new Date(ys, ms - 1, ds);
  const last = new Date(ye, me - 1, de);
  const out: string[] = [];
  let guard = 0;
  while (cur.getTime() <= last.getTime() && guard < 31) {
    out.push(
      `${cur.getFullYear()}-${pad2(cur.getMonth() + 1)}-${pad2(cur.getDate())}`,
    );
    cur.setDate(cur.getDate() + 1);
    guard += 1;
  }
  return out;
}
function cellToString(v: unknown): string {
  if (v == null) return "";
  if (v instanceof Date) return normalizeImportDate(v) ?? "";
  if (typeof v === "number") return String(v);
  return String(v).trim();
}
function referenceAoa(): unknown[][] {
  return [
    ["JCE System · Timekeeping import — Reference (ignored on import)"],
    [],
    ["Fill the “Timekeeping” sheet — one row per employee per day."],
    [
      "Time In / Out",
      "HH:MM 24h as TEXT (e.g. 07:00). Blank = site standard hours. ABSENT = no time.",
    ],
    [
      "Day Type",
      "Blank = Regular Day (Rest Day on Sundays). Or one of the six below.",
    ],
    ["Leave", "Any text marks a leave row (Time In/Out forced to —)."],
    ["Site", "Blank = the employee’s assignment."],
    [
      "Project Code",
      "Blank = the site’s project. A 2nd row, same employee+date, different code = multi-project split.",
    ],
    [],
    ["Valid Day Types"],
    ...DAY_TYPES.map((d) => ["", d]),
    [],
    ["Valid Employees", "No · Name · Site"],
    ...EMPLOYEES.map((e) => [e.no, e.name, e.assign]),
  ];
}

export function ImportView() {
  const { role } = useJce();
  const isEditor = role === "timekeeper" || role === "owner";

  const [step, setStep] = useState<"upload" | "review" | "done">("upload");
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [staged, setStaged] = useState<StagedRow[]>([]);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState<{
    added: number;
    updated: number;
    skippedLocked: number;
    errors: number;
  } | null>(null);

  // template controls
  const [tplSite, setTplSite] = useState("All");
  const [tplStart, setTplStart] = useState(HR_TODAY);
  const [tplEnd, setTplEnd] = useState(HR_TODAY);

  if (!isEditor) {
    return (
      <div className="mx-auto flex max-w-app flex-col gap-5">
        <PageHeader kicker="HR · H5b" title="Import timekeeping" />
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            icon={
              <UploadIcon className="size-7" strokeWidth={1.5} aria-hidden />
            }
            title="You can’t import timekeeping"
            description="Importing is a recording action — only a Timekeeper or Owner can upload attendance."
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/hr/timekeeping">Back to Timekeeping</Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setParseError(null);
    setBusy(true);
    setFileName(file.name);
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.read(await file.arrayBuffer(), { cellDates: true });
      const sheetName = wb.SheetNames[0];
      const sheet = sheetName ? wb.Sheets[sheetName] : undefined;
      if (!sheet) {
        setParseError("No worksheet found in the file.");
        return;
      }
      const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
        header: 1,
        raw: true,
        defval: "",
        blankrows: false,
      });
      if (aoa.length === 0) {
        setParseError("The sheet is empty.");
        return;
      }
      const headerRow = (aoa[0] ?? []).map((h) => String(h ?? ""));
      const keyByCol = headerRow.map((h) => importHeaderKey(h));
      const missing = IMPORT_COLUMNS.filter(
        (c) => c.required && !keyByCol.includes(c.key),
      );
      if (missing.length > 0) {
        setParseError(
          `Missing required column(s): ${missing.map((c) => c.label).join(", ")}.`,
        );
        return;
      }
      const dataRows = aoa.slice(1);
      if (dataRows.length === 0) {
        setParseError("No data rows found — only a header was present.");
        return;
      }
      const raws: RawImportRow[] = dataRows.map((arr) => {
        const obj: RawImportRow = {};
        keyByCol.forEach((k, i) => {
          if (k) obj[k] = cellToString(arr[i]);
        });
        return obj;
      });
      const res = validateImportRows(raws);
      setStaged(res.staged);
      setSummary(res.summary);
      setSearch("");
      setFilter("All");
      setPage(1);
      setResult(null);
      setStep("review");
    } catch {
      setParseError(
        "Could not read this file. Use a valid .xlsx or .csv (not password-protected).",
      );
    } finally {
      setBusy(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const XLSX = await import("xlsx");
      const sites = tplSite === "All" ? SITE_OPTIONS : [tplSite];
      const dates = expandDates(tplStart, tplEnd);
      const rows = generateTemplateRows({ sites, dates });
      const header = IMPORT_COLUMNS.map((c) => c.label);
      const body = rows.map((r) => {
        const rawRow = timeRowToRaw(r);
        return IMPORT_COLUMNS.map((c) => rawRow[c.key] ?? "");
      });
      const ws = XLSX.utils.aoa_to_sheet([header, ...body]);
      const ref = XLSX.utils.aoa_to_sheet(referenceAoa());
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Timekeeping");
      XLSX.utils.book_append_sheet(wb, ref, "Reference");
      const suffix = tplEnd && tplEnd !== tplStart ? `_to_${tplEnd}` : "";
      XLSX.writeFile(wb, `JCE-timekeeping-${tplStart}${suffix}.xlsx`);
      toast.success(
        `Template ready — ${rows.length} rows · ${sites.length} site(s) · ${dates.length} day(s).`,
      );
    } catch {
      toast.error("Could not generate the template.");
    }
  };

  // ---- Review derived (KPIs/commit over the FULL staged set) ----------------
  const toCommit = staged.filter(
    (s) => s.action === "add" || s.action === "update",
  ).length;
  const q = search.trim().toLowerCase();
  const filtered = staged.filter((s) => {
    if (filter === "Errors" && s.severity !== "error") return false;
    if (filter === "Warnings" && s.severity !== "warning") return false;
    if (filter === "To add" && s.action !== "add") return false;
    if (filter === "To update" && s.action !== "update") return false;
    if (
      filter === "Skipped" &&
      s.action !== "skip-locked" &&
      s.action !== "skip-duplicate"
    )
      return false;
    if (q) {
      const hay =
        `${s.input.empNo}${s.input.name}${s.input.date}`.toLowerCase();
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

  const doCommit = () => {
    const res = commitImportRows(staged);
    setResult(res);
    setConfirmOpen(false);
    setStep("done");
    toast.success(
      `Imported — ${res.added} added, ${res.updated} updated${res.skippedLocked > 0 ? `, ${res.skippedLocked} locked` : ""}.`,
    );
  };

  // distinct (site,date) from committed rows → deep links
  const affected: { site: string; date: string }[] = [];
  const seenAff = new Set<string>();
  for (const s of staged) {
    if ((s.action === "add" || s.action === "update") && s.row) {
      const k = `${s.row.site ?? ""}|${s.row.date}`;
      if (!seenAff.has(k) && s.row.site) {
        seenAff.add(k);
        affected.push({ site: s.row.site, date: s.row.date });
      }
    }
  }

  const STEP_LABEL = ["1 · Upload", "2 · Review", "3 · Done"];
  const stepIndex = step === "upload" ? 0 : step === "review" ? 1 : 2;

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="HR · H5b · Bulk import"
        title="Import timekeeping"
        description="Upload one workbook covering many sites and dates — review, then commit into the same store the day sheets use."
        actions={
          <Button asChild variant="ghost" size="sm" className="min-h-11">
            <Link href="/hr/timekeeping">
              <ChevronLeftIcon className="size-4" aria-hidden /> Timekeeping
            </Link>
          </Button>
        }
      />

      {/* Stepper */}
      <div className="flex flex-wrap gap-2">
        {STEP_LABEL.map((label, i) => (
          <span
            key={label}
            className={cn(
              "inline-flex min-h-11 items-center rounded-(--r-input) px-3 text-ui-12 font-semibold",
              i === stepIndex
                ? "bg-jce-green-50 text-jce-green-900"
                : "text-jce-ink-2",
            )}
          >
            {label}
          </span>
        ))}
      </div>

      {step === "upload" ? (
        <>
          {/* Drop zone */}
          <label
            className={cn(
              "focus-within:shadow-(--focus-ring) flex cursor-pointer flex-col items-center gap-2 rounded-(--r-glass) border-2 border-dashed border-jce-line bg-card/60 px-6 py-10 text-center transition-colors hover:border-jce-green-500",
              busy && "opacity-60",
            )}
          >
            <UploadIcon
              className="size-8 text-jce-green-700"
              strokeWidth={1.5}
              aria-hidden
            />
            <span className="text-ui-14 font-semibold text-jce-ink">
              {busy ? "Reading…" : "Drop a workbook or browse"}
            </span>
            <span className="text-ui-12 text-jce-ink-2">
              .xlsx or .csv · parsed in your browser, nothing is uploaded
            </span>
            <input
              type="file"
              accept=".xlsx,.csv"
              className="sr-only"
              disabled={busy}
              onChange={(e) => void onFile(e.target.files?.[0])}
            />
          </label>

          {parseError ? (
            <div className="flex items-center gap-2 rounded-(--r-solid) border border-(--st-danger) bg-(--st-danger-bg) px-4 py-2.5 text-ui-13 text-(--st-danger-ink)">
              {parseError}
            </div>
          ) : null}

          {/* Template builder */}
          <div className="glass flex flex-col gap-3 rounded-(--r-glass) p-4">
            <div>
              <h2 className="text-ui-14 font-semibold text-jce-ink">
                Download a pre-filled template
              </h2>
              <p className="mt-0.5 text-ui-12 text-jce-ink-2">
                Every assigned employee at standard hours — fill only the
                exceptions, then upload. The “Reference” tab documents the
                format.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Field label="Site" className="sm:max-w-xs sm:flex-1">
                <Select value={tplSite} onValueChange={setTplSite}>
                  <SelectTrigger
                    aria-label="Template site"
                    className="min-h-11 w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All sites</SelectItem>
                    {SITE_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="From" className="sm:w-40">
                <input
                  type="date"
                  value={tplStart}
                  onChange={(e) => setTplStart(e.target.value)}
                  aria-label="Template start date"
                  className="field min-h-11"
                />
              </Field>
              <Field label="To" className="sm:w-40">
                <input
                  type="date"
                  value={tplEnd}
                  onChange={(e) => setTplEnd(e.target.value)}
                  aria-label="Template end date"
                  className="field min-h-11"
                />
              </Field>
              <Button
                className="min-h-11 w-full sm:w-auto"
                onClick={() => void downloadTemplate()}
              >
                <DownloadIcon className="size-4" aria-hidden /> Download
                template
              </Button>
            </div>
          </div>
        </>
      ) : null}

      {step === "review" && summary ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-ui-13 text-jce-ink-2">
              <span className="font-semibold text-jce-ink">{fileName}</span> ·{" "}
              {staged.length} rows
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11"
              onClick={() => setStep("upload")}
            >
              Choose another file
            </Button>
          </div>

          {/* KPI strip — full staged set */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiTile
              label="To add"
              value={summary.toAdd}
              delta="new rows"
              tone="info"
            />
            <KpiTile
              label="To update"
              value={summary.toUpdate}
              delta="existing rows"
              tone="info"
            />
            <KpiTile
              label="Skipped"
              value={summary.skippedLocked}
              delta="locked / verified"
              tone="neutral"
            />
            <KpiTile
              label="Errors"
              value={summary.errors}
              delta="excluded from import"
              tone="danger"
            />
          </div>

          {summary.warnings > 0 ? (
            <div className="rounded-(--r-solid) border border-jce-line bg-(--table-zebra) px-4 py-2.5 text-ui-12 text-jce-ink-2">
              {summary.warnings} row(s) import with warnings (name/site
              mismatch, leave override, or duplicate). Error rows are excluded;
              valid rows still import.
            </div>
          ) : null}

          {/* Toolbar */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                  placeholder="Search no., name, date…"
                  aria-label="Search staged rows"
                  className="h-full w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
                />
              </div>
              <Button
                className="min-h-11 w-full sm:w-auto"
                disabled={toCommit === 0}
                onClick={() => setConfirmOpen(true)}
              >
                Import {toCommit} valid row{toCommit === 1 ? "" : "s"}
              </Button>
            </div>
            <div className="-mx-1 overflow-x-auto px-1">
              <Segmented
                aria-label="Filter staged rows"
                options={REVIEW_FILTERS.map((f) => ({ value: f, label: f }))}
                value={filter}
                onValueChange={(v) => {
                  setFilter(v);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {toCommit === 0 ? (
            <div className="flex items-center gap-2 rounded-(--r-solid) border border-(--st-danger) bg-(--st-danger-bg) px-4 py-2.5 text-ui-13 text-(--st-danger-ink)">
              No valid rows to import — every row errored or is locked. Fix the
              file and re-upload.
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
                title="No rows match"
                description="Adjust the search or filter."
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setFilter("All");
                      setPage(1);
                    }}
                  >
                    Clear
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              {/* DESKTOP staging table */}
              <div className="solid hidden overflow-x-auto rounded-(--r-solid) p-0 lg:block">
                <table className="jtable jtable-sticky-first">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Severity</th>
                      <th>Action</th>
                      <th>Date</th>
                      <th>In</th>
                      <th>Out</th>
                      <th>Day Type</th>
                      <th>Leave</th>
                      <th>Messages</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((s, i) => (
                      <tr key={`${s.input.empNo}-${s.input.date}-${i}`}>
                        <td>
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-jce-ink">
                              {s.input.name ||
                                s.row?.empNo ||
                                s.input.empNo ||
                                "—"}
                            </div>
                            <div className="truncate text-ui-12 text-jce-ink-2">
                              {s.input.empNo || "—"}
                            </div>
                          </div>
                        </td>
                        <td>
                          <Chip tone={SEV_TONE[s.severity]}>
                            {SEV_LABEL[s.severity]}
                          </Chip>
                        </td>
                        <td className="text-jce-ink-2">
                          {ACTION_LABEL[s.action]}
                        </td>
                        <td className="font-mono text-ui-12">
                          {s.row?.date ?? s.input.date}
                        </td>
                        <td className="font-mono text-ui-12">
                          {s.row?.in ?? "—"}
                        </td>
                        <td className="font-mono text-ui-12">
                          {s.row?.out ?? "—"}
                        </td>
                        <td className="text-ui-12">{s.row?.dayType ?? "—"}</td>
                        <td className="text-ui-12">{s.row?.leave ?? "—"}</td>
                        <td className="text-ui-12 text-jce-ink-2">
                          {s.messages.length > 0 ? s.messages.join(" ") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE staging cards */}
              <div className="flex flex-col gap-3 lg:hidden">
                {pageRows.map((s, i) => (
                  <div
                    key={`${s.input.empNo}-${s.input.date}-${i}`}
                    className="solid rounded-(--r-solid) p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-jce-ink">
                          {s.input.name || s.input.empNo || "—"}
                        </div>
                        <div className="truncate text-ui-12 text-jce-ink-2">
                          {s.input.empNo || "—"} · {s.row?.date ?? s.input.date}
                        </div>
                      </div>
                      <Chip tone={SEV_TONE[s.severity]}>
                        {SEV_LABEL[s.severity]}
                      </Chip>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-ui-12 text-jce-ink-2">
                      <span>{ACTION_LABEL[s.action]}</span>
                      <span>In {s.row?.in ?? "—"}</span>
                      <span>Out {s.row?.out ?? "—"}</span>
                      {s.row?.leave ? <span>Leave: {s.row.leave}</span> : null}
                    </div>
                    {s.messages.length > 0 ? (
                      <p className="mt-2 text-ui-12 text-jce-ink-2">
                        {s.messages.join(" ")}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-ui-12 text-jce-ink-2">
                  Page {safePage} of {totalPages} · {filtered.length} rows
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
      ) : null}

      {step === "done" && result ? (
        <>
          <div className="glass flex flex-col gap-4 rounded-(--r-glass) p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2Icon
                className="size-8 text-(--st-success)"
                strokeWidth={1.75}
                aria-hidden
              />
              <div>
                <h2 className="text-ui-16 font-bold text-jce-ink">
                  Import complete
                </h2>
                <p className="text-ui-13 text-jce-ink-2">
                  {fileName} — committed to the shared timekeeping store.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <KpiTile label="Added" value={result.added} tone="success" />
              <KpiTile label="Updated" value={result.updated} tone="info" />
              <KpiTile
                label="Skipped (locked)"
                value={result.skippedLocked}
                tone="neutral"
              />
              <KpiTile label="Errors" value={result.errors} tone="danger" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="min-h-11"
                onClick={() => {
                  setStep("upload");
                  setStaged([]);
                  setSummary(null);
                  setResult(null);
                  setFileName("");
                }}
              >
                Import another file
              </Button>
              <Button asChild variant="ghost" className="min-h-11">
                <Link href="/hr/timekeeping">Back to Timekeeping</Link>
              </Button>
            </div>
          </div>

          {affected.length > 0 ? (
            <div className="glass rounded-(--r-glass) p-4">
              <h2 className="text-ui-14 font-semibold text-jce-ink">
                Open an affected day sheet
              </h2>
              <div className="mt-3 flex flex-col gap-2">
                {affected.slice(0, 12).map((a) => (
                  <Link
                    key={`${a.site}|${a.date}`}
                    href={`/hr/timekeeping/site-day?site=${encodeURIComponent(a.site)}&date=${a.date}`}
                    className="focus-ring-jce flex min-h-11 items-center justify-between gap-3 rounded-(--r-solid) border border-jce-line px-3 transition-colors hover:bg-jce-green-50"
                  >
                    <span className="truncate text-ui-13 text-jce-ink">
                      {siteToken(a.site)} · {a.date}
                    </span>
                    <span className="text-ui-12 font-semibold text-jce-green-700">
                      Open →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      {/* Commit confirm */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import {toCommit} rows?</DialogTitle>
            <DialogDescription>
              {summary?.toAdd ?? 0} added, {summary?.toUpdate ?? 0} updated.{" "}
              {summary?.skippedLocked ?? 0} locked and {summary?.errors ?? 0}{" "}
              errored rows are skipped. Existing rows are matched on
              employee+date+project; locked (verified) rows are never
              overwritten.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              className="min-h-11"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button className="min-h-11" onClick={doCommit}>
              Confirm &amp; import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
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
