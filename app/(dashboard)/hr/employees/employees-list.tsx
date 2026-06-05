"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  TriangleAlertIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import {
  EMPLOYEES,
  EMP_STATUS_FILTERS,
  EMP_TYPE_FILTERS,
  SALARY_CATEGORIES,
  STATUS_TONE,
  expiringFlag,
  monthsLeft,
  type Employee,
  type SalaryCategory,
} from "@/lib/mock/hr";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/jce/page-header";
import { KpiTile } from "@/components/jce/kpi-tile";
import { Chip } from "@/components/jce/chip";
import { EmptyState } from "@/components/jce/empty-state";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// H1 · Grouped employee list (hr-employees.jsx:46). Three stacked sections by
// Salary Rate Category (Daily / Weekly / Monthly) — the SRS §4.1 spine. Built for
// 100+: each section is a collapsible glass band over a paginated LedgerGrid;
// searching flattens to one paged, category-tagged list. Search ignores grouping.
// Contractual employees < 6 months from contract end carry a ⚠ flag (the
// aggregated bell summary lives on the HR dashboard, not here). Edit authority
// (+Add) is hrhead || owner — ABSENT, not disabled, for everyone else.

const PAGE_SIZE = 12;
const CAT_ORDER: Record<SalaryCategory, number> = {
  Daily: 0,
  Weekly: 1,
  Monthly: 2,
};

function ExpiryFlag({ emp }: { emp: Employee }) {
  if (!expiringFlag(emp)) return null;
  return (
    <Chip tone="pending" title={`Contract ends ${emp.contractEnd}`}>
      <TriangleAlertIcon className="size-3" aria-hidden />{" "}
      {monthsLeft(emp.contractEnd)}mo left
    </Chip>
  );
}

function Pager({
  page,
  totalPages,
  total,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-ui-12 text-jce-ink-2">
        Page {page} of {totalPages} · {total}{" "}
        {total === 1 ? "employee" : "employees"}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="focus-ring-jce min-h-11"
          disabled={page <= 1}
          onClick={onPrev}
        >
          <ChevronLeftIcon aria-hidden /> Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="focus-ring-jce min-h-11"
          disabled={page >= totalPages}
          onClick={onNext}
        >
          Next <ChevronRightIcon aria-hidden />
        </Button>
      </div>
    </div>
  );
}

export function EmployeesList() {
  const { role } = useJce();
  const router = useRouter();
  const canEditEmployees = role === "hrhead" || role === "owner";

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  // Per-section collapse + page state, and the flattened search page.
  const [collapsed, setCollapsed] = useState<Record<SalaryCategory, boolean>>({
    Daily: false,
    Weekly: false,
    Monthly: false,
  });
  const [pages, setPages] = useState<Record<SalaryCategory, number>>({
    Daily: 1,
    Weekly: 1,
    Monthly: 1,
  });
  const [searchPage, setSearchPage] = useState(1);

  const resetPaging = () => {
    setPages({ Daily: 1, Weekly: 1, Monthly: 1 });
    setSearchPage(1);
  };
  const onSearch = (v: string) => {
    setQ(v);
    resetPaging();
  };
  const onStatus = (v: string) => {
    setStatus(v);
    resetPaging();
  };
  const onType = (v: string) => {
    setType(v);
    resetPaging();
  };
  const clearAll = () => {
    setQ("");
    setStatus("All");
    setType("All");
    resetPaging();
  };
  const toggle = (cat: SalaryCategory) =>
    setCollapsed((c) => ({ ...c, [cat]: !c[cat] }));
  const setCatPage = (cat: SalaryCategory, p: number) =>
    setPages((ps) => ({ ...ps, [cat]: p }));

  const match = (e: Employee) =>
    (q === "" ||
      `${e.name}${e.no}${e.bio}${e.pos}${e.assign}`
        .toLowerCase()
        .includes(q.toLowerCase())) &&
    (status === "All" || e.status === status) &&
    (type === "All" || e.type === type);

  const filtered = EMPLOYEES.filter(match);
  const searching = q.trim() !== "";

  // Count KPI strip — derived live from the whole roster (not the filtered view).
  const total = EMPLOYEES.length;
  const dailyN = EMPLOYEES.filter((e) => e.cat === "Daily").length;
  const weeklyN = EMPLOYEES.filter((e) => e.cat === "Weekly").length;
  const monthlyN = EMPLOYEES.filter((e) => e.cat === "Monthly").length;

  // Flattened, category-tagged search results (category order then S/N).
  const results = searching
    ? [...filtered].sort(
        (a, b) => CAT_ORDER[a.cat] - CAT_ORDER[b.cat] || a.sn - b.sn,
      )
    : [];
  const searchTotalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const searchSafePage = Math.min(searchPage, searchTotalPages);
  const searchRows = results.slice(
    (searchSafePage - 1) * PAGE_SIZE,
    searchSafePage * PAGE_SIZE,
  );

  const columns = (tagged: boolean): LedgerColumn<Employee>[] => [
    {
      id: "sn",
      header: "S/N",
      cell: (e) => <span className="tabular-nums text-jce-ink-2">{e.sn}</span>,
    },
    {
      id: "name",
      header: "Name of Employee",
      cell: (e) => (
        <span className="flex items-center gap-2">
          <span className="font-semibold text-jce-ink">{e.name}</span>
          {tagged ? (
            <span className="rounded-(--r-chip) bg-jce-green-50 px-1.5 py-0.5 text-ui-12 font-semibold text-jce-green-700">
              {e.cat}
            </span>
          ) : null}
        </span>
      ),
    },
    {
      id: "bio",
      header: "BIO Nos",
      cell: (e) => <span className="font-mono text-ui-12">{e.bio}</span>,
    },
    { id: "pos", header: "Position", cell: (e) => e.pos },
    {
      id: "assign",
      header: "Place of Assignment",
      cell: (e) => <span className="text-jce-ink-2">{e.assign}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (e) => (
        <Chip tone={STATUS_TONE[e.status] ?? "neutral"}>{e.status}</Chip>
      ),
    },
    {
      id: "hired",
      header: "Date Hired",
      cell: (e) => <span className="font-mono text-ui-12">{e.hired}</span>,
    },
    {
      id: "flag",
      header: "",
      cell: (e) => <ExpiryFlag emp={e} />,
    },
  ];

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="HR · H1 · Employee Management"
        title="Employees"
        description="Grouped by Salary Rate Category. Contract-expiry flags surface contractuals with under six months remaining."
      />

      {/* Count KPI strip — live roster composition */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          label="Total"
          value={total}
          delta="on the roster"
          tone="neutral"
        />
        <KpiTile
          label="Daily"
          value={dailyN}
          delta="rate category"
          tone="info"
        />
        <KpiTile
          label="Weekly"
          value={weeklyN}
          delta="rate category"
          tone="info"
        />
        <KpiTile
          label="Monthly"
          value={monthlyN}
          delta="rate category"
          tone="info"
        />
      </div>

      {/* Toolbar — search + filters + Archived + Add (stacks full-width on phones) */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex h-11 w-full items-center gap-2 rounded-(--r-input) border border-jce-line bg-card/70 px-3 transition-colors focus-within:border-jce-green-600 focus-within:shadow-(--focus-ring) sm:max-w-sm">
            <SearchIcon
              className="size-4 shrink-0 text-jce-ink-2"
              aria-hidden
            />
            <input
              value={q}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search name, BIO, position…"
              aria-label="Search employees"
              className="h-full w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={status} onValueChange={onStatus}>
              <SelectTrigger
                aria-label="Filter by status"
                className="min-h-11 w-full sm:w-40"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EMP_STATUS_FILTERS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={onType}>
              <SelectTrigger
                aria-label="Filter by employment type"
                className="min-h-11 w-full sm:w-40"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EMP_TYPE_FILTERS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild variant="ghost" className="min-h-11">
              <Link href="/hr/employees/archived">Archived</Link>
            </Button>
            {canEditEmployees ? (
              <Button asChild className="min-h-11 w-full sm:w-auto">
                <Link href="/hr/employees/new">+ Add employee</Link>
              </Button>
            ) : null}
          </div>
        </div>
        {searching ? (
          <p className="text-ui-12 text-jce-ink-2">
            Search ignores grouping — results show their Salary Rate Category
            tag.
          </p>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            icon={
              <SearchIcon className="size-7" strokeWidth={1.5} aria-hidden />
            }
            title="No employees match"
            description="Adjust your search or filters to see employees."
            action={
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear
              </Button>
            }
          />
        </div>
      ) : searching ? (
        <div className="flex flex-col gap-3">
          <LedgerGrid
            columns={columns(true)}
            rows={searchRows}
            getRowKey={(e) => e.id}
            onRowClick={(e) => router.push(`/hr/employees/${e.id}`)}
          />
          {searchTotalPages > 1 ? (
            <Pager
              page={searchSafePage}
              totalPages={searchTotalPages}
              total={results.length}
              onPrev={() => setSearchPage((p) => Math.max(1, p - 1))}
              onNext={() =>
                setSearchPage((p) => Math.min(searchTotalPages, p + 1))
              }
            />
          ) : null}
        </div>
      ) : (
        SALARY_CATEGORIES.map((cat) => {
          const rows = filtered.filter((e) => e.cat === cat);
          if (rows.length === 0) return null;
          const isCollapsed = collapsed[cat];
          const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
          const safePage = Math.min(pages[cat], totalPages);
          const pageRows = rows.slice(
            (safePage - 1) * PAGE_SIZE,
            safePage * PAGE_SIZE,
          );
          return (
            <section key={cat} className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => toggle(cat)}
                aria-expanded={!isCollapsed}
                className="glass focus-ring-jce flex min-h-11 items-center justify-between gap-2 rounded-(--r-glass) px-4 py-2.5 text-left transition-colors hover:border-jce-green-500"
              >
                <span className="flex items-center gap-2">
                  <ChevronDownIcon
                    className={cn(
                      "size-4 text-jce-ink-2 transition-transform",
                      isCollapsed && "-rotate-90",
                    )}
                    aria-hidden
                  />
                  <span className="text-ui-14 font-bold text-jce-ink">
                    {cat}
                  </span>
                </span>
                <span className="text-ui-12 text-jce-ink-2">
                  Salary Rate Category · {rows.length}{" "}
                  {rows.length === 1 ? "employee" : "employees"}
                </span>
              </button>
              {!isCollapsed ? (
                <>
                  <LedgerGrid
                    columns={columns(false)}
                    rows={pageRows}
                    getRowKey={(e) => e.id}
                    onRowClick={(e) => router.push(`/hr/employees/${e.id}`)}
                  />
                  {totalPages > 1 ? (
                    <Pager
                      page={safePage}
                      totalPages={totalPages}
                      total={rows.length}
                      onPrev={() => setCatPage(cat, Math.max(1, safePage - 1))}
                      onNext={() =>
                        setCatPage(cat, Math.min(totalPages, safePage + 1))
                      }
                    />
                  ) : null}
                </>
              ) : null}
            </section>
          );
        })
      )}
    </div>
  );
}
