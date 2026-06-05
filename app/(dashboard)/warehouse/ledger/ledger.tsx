"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { qn } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import {
  WH_PROJECTS,
  WH_LEDGER,
  WH_LEDGER_COSTCTR,
  SITEENG_SO,
  isCostCentre,
  ledgerDerive,
  type LedgerRow,
} from "@/lib/mock/warehouse";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";

const LOCATIONS = ["All locations", "Main Office", "Bulacan site"];

// W2 · Stock monitoring ledger (FLAGSHIP · wh-core.jsx:118). Derived columns
// (Undelivered/Balance/Variance) are .computed and non-editable; off-BOQ rows
// show "no plan" + Variance "—"; cost-centre ledgers hide Planned/Variance.
export function StockLedger() {
  const { role } = useJce();
  const mayPromote = canVerb(role, "wh");
  const scoped = role === "siteeng";

  const projectOptions = scoped
    ? WH_PROJECTS.filter((p) => p.so === SITEENG_SO)
    : WH_PROJECTS;
  const [proj, setProj] = useState(
    scoped ? "NORECO II — 13.2KV" : "NORECO II — 13.2KV",
  );
  const [loc, setLoc] = useState("All locations");
  const [expand, setExpand] = useState<number | null>(null);

  const costCtr = isCostCentre(proj);
  const rows: readonly LedgerRow[] = costCtr ? WH_LEDGER_COSTCTR : WH_LEDGER;

  const exportCsv = () => {
    const head = costCtr
      ? ["WBS", "Item", "Unit", "Unit cost", "Delivered", "Utilized", "Balance"]
      : [
          "WBS",
          "Item",
          "Unit",
          "Unit cost",
          "Planned",
          "Undelivered",
          "Delivered",
          "Utilized",
          "Balance",
          "Variance",
        ];
    const body = rows.map((r) => {
      const d = ledgerDerive(r);
      const base = [
        r.wbs ?? "no plan",
        r.item,
        r.unit,
        r.cost,
        r.delivered,
        r.utilized,
        d.balance,
      ];
      return costCtr
        ? base
        : [
            r.wbs ?? "no plan",
            r.item,
            r.unit,
            r.cost,
            r.planned ?? "—",
            d.undelivered ?? "—",
            r.delivered,
            r.utilized,
            d.balance,
            d.variance ?? "—",
          ];
    });
    const csv = [head, ...body]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock-ledger.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const colSpan = costCtr ? 7 : 11;

  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-4">
      <PageHeader
        kicker="Warehouse · W2"
        title="Stock monitoring ledger"
        actions={
          <>
            <select
              value={proj}
              onChange={(e) => {
                setProj(e.target.value);
                setExpand(null);
              }}
              className="field h-9 w-auto"
              aria-label="Project / cost centre"
            >
              {projectOptions.map((p) => (
                <option key={p.name}>{p.name}</option>
              ))}
            </select>
            <select
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              className="field h-9 w-auto"
              aria-label="Location"
            >
              {LOCATIONS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
            <Button variant="ghost" size="sm" onClick={exportCsv}>
              Export
            </Button>
          </>
        }
      />

      {costCtr ? (
        <p className="rounded-(--r-solid) border border-jce-line bg-(--table-zebra) px-3 py-2 text-ui-12 text-jce-ink-2">
          Cost-centre ledger — Planned / Variance hidden. Balance = Delivered −
          Utilized.
        </p>
      ) : null}

      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>WBS</th>
              <th>Item description</th>
              <th>Unit</th>
              <th className="num">Unit cost</th>
              {!costCtr ? <th className="num">Planned</th> : null}
              {!costCtr ? <th className="num">Undelivered</th> : null}
              <th className="num">Delivered</th>
              <th className="num">Utilized</th>
              <th className="num">Balance</th>
              {!costCtr ? <th className="num">Variance</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const d = ledgerDerive(r);
              const open = expand === i;
              return (
                <RowGroup
                  key={`${r.item}-${i}`}
                  r={r}
                  d={d}
                  open={open}
                  costCtr={costCtr}
                  colSpan={colSpan}
                  onToggle={() => setExpand(open ? null : i)}
                  mayPromote={mayPromote}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-ui-12 text-jce-ink-2">
        Delivered = Σ Locked MRR receipts · Utilized = Σ Locked Release issues ·
        Balance = Delivered − Utilized · Variance = Delivered − Planned
        (&ldquo;—&rdquo; for off-BOQ rows, never a misleading negative). Derived
        columns are non-editable.
      </p>
    </div>
  );
}

function RowGroup({
  r,
  d,
  open,
  costCtr,
  colSpan,
  onToggle,
  mayPromote,
}: {
  r: LedgerRow;
  d: { undelivered: number | null; balance: number; variance: number | null };
  open: boolean;
  costCtr: boolean;
  colSpan: number;
  onToggle: () => void;
  mayPromote: boolean;
}) {
  return (
    <>
      <tr className="cursor-pointer" onClick={onToggle}>
        <td className="mono">
          {r.wbs ?? <span className="text-jce-ink-2 italic">no plan</span>}
        </td>
        <td>
          <span className="inline-flex items-center gap-1.5">
            {open ? (
              <ChevronDownIcon
                className="size-3.5 text-jce-ink-2"
                aria-hidden
              />
            ) : (
              <ChevronRightIcon
                className="size-3.5 text-jce-ink-2"
                aria-hidden
              />
            )}
            {r.item}
            {r.offBoq ? (
              <span className="rounded-(--r-chip) bg-(--st-pending-bg) px-1.5 py-0.5 text-[10px] font-semibold text-(--st-pending-ink)">
                off-BOQ
              </span>
            ) : null}
          </span>
        </td>
        <td>{r.unit}</td>
        <td className="num">{r.cost ? qn(r.cost) : "—"}</td>
        {!costCtr ? (
          <td className="num">
            {r.planned != null ? (
              qn(r.planned)
            ) : (
              <span className="text-jce-ink-2">—</span>
            )}
          </td>
        ) : null}
        {!costCtr ? (
          <td className="num">
            {d.undelivered != null ? qn(d.undelivered) : "—"}
          </td>
        ) : null}
        <td className="num">
          <span className="computed">{qn(r.delivered)}</span>
        </td>
        <td className="num">
          <span className="computed">{qn(r.utilized)}</span>
        </td>
        <td className="num font-bold">
          <span className="computed">{qn(d.balance)}</span>
        </td>
        {!costCtr ? (
          <td className="num">
            {d.variance != null ? (
              <span
                className={cn(
                  "font-semibold",
                  d.variance < 0 ? "text-(--st-danger)" : "text-(--st-success)",
                )}
              >
                {d.variance > 0 ? "+" : ""}
                {qn(d.variance)}
              </span>
            ) : (
              <span className="text-jce-ink-2">—</span>
            )}
          </td>
        ) : null}
      </tr>
      {open ? (
        <tr>
          <td />
          <td colSpan={colSpan - 1} className="bg-(--table-zebra)">
            <div className="p-2">
              <div className="mb-1.5 text-ui-12 font-semibold text-jce-ink">
                Per-location breakdown · {r.item}
              </div>
              <table className="jtable">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th className="num">Delivered</th>
                    <th className="num">Utilized</th>
                    <th className="num">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <LocRow
                    loc="Main Office"
                    del={Math.round(r.delivered * 0.4)}
                    uti={Math.round(r.utilized * 0.3)}
                  />
                  <LocRow
                    loc="Bulacan site"
                    del={Math.round(r.delivered * 0.6)}
                    uti={Math.round(r.utilized * 0.7)}
                  />
                </tbody>
              </table>
              {r.offBoq && mayPromote ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    toast.success(
                      "Promoted to plan — set planned qty (audited; likely VO).",
                    )
                  }
                >
                  Promote to plan (set planned qty — audited)
                </Button>
              ) : null}
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

function LocRow({ loc, del, uti }: { loc: string; del: number; uti: number }) {
  return (
    <tr>
      <td>{loc}</td>
      <td className="num">{qn(del)}</td>
      <td className="num">{qn(uti)}</td>
      <td className="num">{qn(del - uti)}</td>
    </tr>
  );
}
