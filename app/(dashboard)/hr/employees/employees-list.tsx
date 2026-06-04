"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchIcon, TriangleAlertIcon } from "lucide-react";

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
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// H1 · Grouped employee list (hr-employees.jsx:46). Three stacked sections by
// Salary Rate Category (Daily / Weekly / Monthly), each a glass band over a solid
// table. Search ignores grouping (results carry their section tag). Contractual
// employees < 6 months from contract end carry a ⚠ flag AND fire a contract-
// expiry notification into the shared slice (bell + X4). Edit authority (+Add) is
// hrhead || owner — ABSENT, not disabled, for everyone else.

// Fire the contract-expiry alerts once per session (module guard survives
// remounts as the user navigates back to the list).
let contractAlertsFired = false;

function ExpiryFlag({ emp }: { emp: Employee }) {
  if (!expiringFlag(emp)) return null;
  return (
    <Chip tone="pending" title={`Contract ends ${emp.contractEnd}`}>
      <TriangleAlertIcon className="size-3" aria-hidden />{" "}
      {monthsLeft(emp.contractEnd)}mo left
    </Chip>
  );
}

export function EmployeesList() {
  const { role, addNotification } = useJce();
  const router = useRouter();
  const canEditEmployees = role === "hrhead" || role === "owner";

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [type, setType] = useState<string>("All");

  useEffect(() => {
    if (contractAlertsFired) return;
    contractAlertsFired = true;
    EMPLOYEES.filter(expiringFlag).forEach((e) => {
      addNotification({
        mod: "HR",
        type: "Contract",
        tone: "danger",
        unread: true,
        msg: `Contract expiring < 6 months — ${e.name} (${monthsLeft(e.contractEnd)}mo left)`,
        time: "just now",
        doc: e.no,
      });
    });
  }, [addNotification]);

  const match = (e: Employee) =>
    (q === "" ||
      `${e.name}${e.no}${e.bio}${e.pos}${e.assign}`
        .toLowerCase()
        .includes(q.toLowerCase())) &&
    (status === "All" || e.status === status) &&
    (type === "All" || e.type === type);

  const filtered = EMPLOYEES.filter(match);

  const columns = (group: SalaryCategory): LedgerColumn<Employee>[] => [
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
          {q ? (
            <span className="rounded bg-jce-green-50 px-1.5 py-0.5 text-[10px] font-semibold text-jce-green-700">
              {group}
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
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="HR · H1 · Employee Management"
        title="Employees"
        description="Grouped by Salary Rate Category. Contract-expiry flags surface contractuals with under six months remaining."
        actions={
          <>
            <div className="flex h-9 w-60 items-center gap-2 rounded-[8px] border border-jce-line bg-white/70 px-2.5">
              <SearchIcon
                className="size-4 shrink-0 text-jce-ink-2"
                aria-hidden
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, BIO, position…"
                aria-label="Search employees"
                className="w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
              />
            </div>
            <select
              className="field h-9 w-auto"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter by status"
            >
              {EMP_STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              className="field h-9 w-auto"
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-label="Filter by employment type"
            >
              {EMP_TYPE_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Button asChild variant="ghost" size="sm">
              <Link href="/hr/employees/archived">Archived</Link>
            </Button>
            {canEditEmployees ? (
              <Button asChild size="sm">
                <Link href="/hr/employees/new">+ Add employee</Link>
              </Button>
            ) : null}
          </>
        }
      />

      {q ? (
        <p className="text-ui-12 text-jce-ink-2">
          Search ignores grouping — results show their Salary Rate Category tag.
        </p>
      ) : null}

      {filtered.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-2">
          <div className="px-6 py-10 text-center">
            <div className="text-ui-14 font-semibold text-jce-ink">
              No employees match
            </div>
            <div className="mt-1 text-ui-12 text-jce-ink-2">
              Adjust your search or filters.
            </div>
          </div>
        </div>
      ) : (
        SALARY_CATEGORIES.map((cat) => {
          const rows = filtered.filter((e) => e.cat === cat);
          if (rows.length === 0) return null;
          return (
            <section key={cat} className="flex flex-col gap-2">
              <div className="glass flex items-center justify-between rounded-(--r-glass) px-4 py-2.5">
                <span className="text-ui-14 font-bold text-jce-ink">{cat}</span>
                <span className="text-ui-12 text-jce-ink-2">
                  Salary Rate Category · {rows.length}{" "}
                  {rows.length === 1 ? "employee" : "employees"}
                </span>
              </div>
              <LedgerGrid
                columns={columns(cat)}
                rows={rows}
                getRowKey={(e) => e.id}
                onRowClick={(e) => router.push(`/hr/employees/${e.id}`)}
              />
            </section>
          );
        })
      )}
    </div>
  );
}
