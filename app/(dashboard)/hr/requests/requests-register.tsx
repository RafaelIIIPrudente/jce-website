"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon, SearchIcon } from "lucide-react";

import { useJce } from "@/lib/mock/role-context";
import {
  REQUEST_TYPES,
  REQ_STATUS_FILTERS,
  REQ_TONE,
  getAllRequests,
  getRequests,
  typeByLabel,
  type RequestRecord,
  type RequestTypeLabel,
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
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";
import { Segmented } from "@/components/jce/segmented";

// H7 · HR requests register (SRS §4.3). Paper-first intake — a scanned signed copy
// is REQUIRED to reach Approved / Recorded. Premium register: live KPI strip,
// search + status filter, 4-type Segmented (with counts), deep-linkable rows.

const PAGE_SIZE = 8;

export function RequestsRegister() {
  const { role } = useJce();
  const router = useRouter();
  const canManage = role === "hrhead" || role === "owner";

  const [type, setType] = useState<RequestTypeLabel>("OB/Travel");
  const [status, setStatus] = useState<string>("All");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const slug = typeByLabel(type)?.slug ?? "";

  // KPI strip — derived live across ALL request types.
  const all = getAllRequests();
  const pendingCount = all.filter((r) => r.status === "Pending").length;
  const terminalCount = all.filter(
    (r) => r.status === "Approved" || r.status === "Recorded",
  ).length;
  const awaitingScan = all.filter(
    (r) => r.status === "Pending" && !r.scan,
  ).length;

  const query = q.trim().toLowerCase();
  const typed = getRequests(type);
  const filtered = typed.filter((r) => {
    if (status !== "All" && r.status !== status) return false;
    if (query) {
      const hay = `${r.no} ${r.emp} ${r.key}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const onType = (v: string) => {
    setType(v as RequestTypeLabel);
    setQ("");
    setPage(1);
  };
  const onSearch = (v: string) => {
    setQ(v);
    setPage(1);
  };
  const clearSearch = () => {
    setQ("");
    setPage(1);
  };

  const columns: LedgerColumn<RequestRecord>[] = [
    { id: "no", header: "Form number", cell: (r) => <DocChip code={r.no} /> },
    {
      id: "filed",
      header: "Date filed",
      cell: (r) => <span className="font-mono text-ui-12">{r.filed}</span>,
    },
    {
      id: "emp",
      header: "Employee(s)",
      cell: (r) => <span className="font-medium text-jce-ink">{r.emp}</span>,
    },
    {
      id: "key",
      header: "Key fields",
      cell: (r) => <span className="text-jce-ink-2">{r.key}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (r) => (
        <Chip tone={REQ_TONE[r.status] ?? "neutral"}>{r.status}</Chip>
      ),
    },
    {
      id: "scan",
      header: "Scan",
      cell: (r) =>
        r.scan ? (
          <Chip tone="success">✓ attached</Chip>
        ) : (
          <Chip tone="pending">required</Chip>
        ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="HR · H7 · HR Requests"
        title="HR Requests register"
        description="Digital intake precedes offline wet signatures. A scanned signed copy is required to reach Approved / Recorded (SRS §4.3)."
      />

      {/* Publish-state KPI strip — live across all request types */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          label="Pending"
          value={pendingCount}
          delta="awaiting action"
          tone="pending"
        />
        <KpiTile
          label="Recorded / Approved"
          value={terminalCount}
          delta="terminal"
          tone="success"
        />
        <KpiTile
          label="Awaiting signed scan"
          value={awaitingScan}
          delta="blocks terminal"
          tone="danger"
        />
        <KpiTile
          label="Total records"
          value={all.length}
          delta={`${REQUEST_TYPES.length} form types`}
          tone="info"
        />
      </div>

      {/* Toolbar — search + status filter + tab-aware New (hrhead/owner) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex h-11 w-full items-center gap-2 rounded-(--r-input) border border-jce-line bg-card/70 px-3 transition-colors focus-within:border-jce-green-600 focus-within:shadow-(--focus-ring) sm:max-w-sm">
          <SearchIcon className="size-4 shrink-0 text-jce-ink-2" aria-hidden />
          <input
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search no., employee, key…"
            aria-label="Search requests"
            className="h-full w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={status} onValueChange={(v) => setStatus(v)}>
            <SelectTrigger
              className="min-h-11 w-full sm:w-44"
              aria-label="Filter by status"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REQ_STATUS_FILTERS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "All" ? "All statuses" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {canManage ? (
            <Button asChild className="min-h-11 w-full sm:w-auto">
              <Link href={`/hr/requests/${slug}/new`}>
                <PlusIcon aria-hidden /> New {type}
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="-mx-1 overflow-x-auto px-1">
        <Segmented
          aria-label="Request type"
          value={type}
          onValueChange={onType}
          options={REQUEST_TYPES.map((t) => ({
            value: t.label,
            label: `${t.label} (${getRequests(t.label).length})`,
          }))}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            icon={
              <SearchIcon className="size-7" strokeWidth={1.5} aria-hidden />
            }
            title={
              query || status !== "All"
                ? "No requests match"
                : `No ${type} records`
            }
            description={
              query || status !== "All"
                ? "Adjust the search or status filter."
                : "Pending intake appears here before signatures complete."
            }
            action={
              query || status !== "All" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearSearch();
                    setStatus("All");
                  }}
                >
                  Clear filters
                </Button>
              ) : canManage ? (
                <Button asChild size="sm">
                  <Link href={`/hr/requests/${slug}/new`}>
                    <PlusIcon aria-hidden /> New {type}
                  </Link>
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <>
          <LedgerGrid
            columns={columns}
            rows={rows}
            getRowKey={(r) => r.id}
            onRowClick={(r) => router.push(`/hr/requests/${slug}/${r.id}`)}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-ui-12 text-jce-ink-2">
              Page {safePage} of {totalPages} · {filtered.length} record
              {filtered.length === 1 ? "" : "s"}
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
    </div>
  );
}
