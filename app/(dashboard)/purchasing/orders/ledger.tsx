"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, ChevronRightIcon, SearchIcon } from "lucide-react";

import { ccyAmt } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import {
  POS,
  PO_STATUS_TONE,
  PAY_TONE,
  RFPS,
  derivePaymentStatus,
  type PurchaseOrder,
} from "@/lib/mock/purchasing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { Segmented } from "@/components/jce/segmented";
import { EmptyState } from "@/components/jce/empty-state";

const TYPES = [
  { value: "All", label: "All" },
  { value: "Local", label: "Local" },
  { value: "Import", label: "Import" },
];
const STATUSES = ["All", "For Approval", "Approved", "Sent", "Closed"];

// U2 · PO monitoring ledger (FLAGSHIP · pur-core.jsx:100). Local/Import/All
// toggle, status filter, full-text search; default grouped + collapsible by
// project. Payment Status is DERIVED (tooltip "Derived, never typed"). The
// tracker cell deep-links Import → n/15, Local → n/5. CSV export is client-side.
export function PoLedger() {
  const router = useRouter();
  const { role } = useJce();
  const canCreate = canEdit(role, "pur");

  const [typeF, setTypeF] = useState("All");
  const [status, setStatus] = useState("All");
  const [q, setQ] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const rows = useMemo(
    () =>
      POS.filter(
        (p) =>
          (typeF === "All" || p.type === typeF) &&
          (status === "All" || p.status === status) &&
          (q === "" ||
            (p.no + p.supplier + p.project + p.desc + p.so + p.mr)
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [typeF, status, q],
  );

  const groups = useMemo(() => {
    const g = new Map<string, PurchaseOrder[]>();
    rows.forEach((p) => {
      const list = g.get(p.project) ?? [];
      list.push(p);
      g.set(p.project, list);
    });
    return [...g.entries()];
  }, [rows]);

  const exportCsv = () => {
    const head = [
      "PO No.",
      "Type",
      "Date",
      "Supplier",
      "Project",
      "Amount",
      "Ccy",
      "Status",
      "Payment",
    ];
    const body = rows.map((p) => [
      p.no,
      p.type,
      p.date,
      p.supplier,
      p.project,
      p.amount,
      p.ccy,
      p.status,
      derivePaymentStatus(p, RFPS),
    ]);
    const csv = [head, ...body]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "po-ledger.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        kicker="Purchasing · U2"
        title="PO monitoring ledger"
        actions={
          <>
            <Segmented options={TYPES} value={typeF} onValueChange={setTypeF} />
            {canCreate ? (
              <Button size="sm" asChild>
                <Link href="/purchasing/orders/new">+ Create PO</Link>
              </Button>
            ) : null}
          </>
        }
      />

      <div className="glass flex flex-wrap items-center gap-3 rounded-(--r-glass) p-3">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-(--r-input) border border-jce-line bg-(--solid-surface) px-2.5 py-1.5">
          <SearchIcon className="size-4 shrink-0 text-jce-ink-2" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="PO No., supplier, project, MR/SO, item…"
            className="min-w-0 flex-1 bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
            aria-label="Search purchase orders"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="field h-9 w-auto"
          aria-label="Status filter"
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={exportCsv}
        >
          Export CSV
        </Button>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          icon={<SearchIcon className="size-6" aria-hidden />}
          title="No purchase orders match"
          description="Adjust the type, status, or search terms to see POs."
        />
      ) : (
        groups.map(([proj, list]) => {
          const open = !collapsed[proj];
          return (
            <div key={proj} className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setCollapsed((c) => ({ ...c, [proj]: !c[proj] }))
                }
                className="glass-nav focus-ring-jce flex items-center gap-2 rounded-(--r-solid) px-3 py-2 text-left"
              >
                {open ? (
                  <ChevronDownIcon
                    className="size-4 text-jce-ink-2"
                    aria-hidden
                  />
                ) : (
                  <ChevronRightIcon
                    className="size-4 text-jce-ink-2"
                    aria-hidden
                  />
                )}
                <span className="text-ui-13 font-semibold text-jce-ink">
                  {proj}
                </span>
                <span className="text-ui-12 text-jce-ink-2">
                  {list.length} PO{list.length > 1 ? "s" : ""}
                </span>
              </button>
              {open ? (
                <div className="solid overflow-auto rounded-(--r-solid) p-0">
                  <table className="jtable">
                    <thead>
                      <tr>
                        <th>PO No.</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Supplier</th>
                        <th>Description</th>
                        <th className="num">Amount</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Tracker</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((p) => {
                        const pay = derivePaymentStatus(p, RFPS);
                        return (
                          <tr
                            key={p.no}
                            onClick={() =>
                              router.push(`/purchasing/orders/${p.no}`)
                            }
                            className="cursor-pointer"
                          >
                            <td>
                              <DocChip code={p.no} />
                            </td>
                            <td>
                              <Chip
                                tone={p.type === "Import" ? "info" : "neutral"}
                              >
                                {p.type}
                              </Chip>
                            </td>
                            <td className="mono text-ui-12">{p.date}</td>
                            <td className="font-semibold">{p.supplier}</td>
                            <td className="text-jce-ink-2">{p.desc}</td>
                            <td className="num">{ccyAmt(p.amount, p.ccy)}</td>
                            <td>
                              <Chip
                                tone={PO_STATUS_TONE[p.status] ?? "neutral"}
                              >
                                {p.status}
                              </Chip>
                            </td>
                            <td>
                              <span title="Derived, never typed">
                                <Chip tone={PAY_TONE[pay] ?? "neutral"}>
                                  {pay}
                                </Chip>
                              </span>
                            </td>
                            <td onClick={(e) => e.stopPropagation()}>
                              <Link
                                href={`/purchasing/orders/${p.no}/tracker`}
                                className="focus-ring-jce rounded-(--r-chip) font-mono text-ui-12 font-semibold text-jce-green-700 hover:text-jce-green-900"
                              >
                                {p.type === "Import"
                                  ? `${p.stage ?? 0}/15 →`
                                  : `${p.localStage ?? 0}/5 →`}
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          );
        })
      )}

      <p className="text-ui-12 text-jce-ink-2">
        Default grouped by project. Payment Status is derived from linked-RFP
        state, never typed.
      </p>
    </div>
  );
}
