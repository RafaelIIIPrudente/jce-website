"use client";

import { useState } from "react";
import { ChevronLeftIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import {
  JV_LINES,
  JV_TONE,
  getJvs,
  postJv,
  type Jv,
  type JvLine,
  type JvStatus,
} from "@/lib/mock/accounting";
import { pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// A16 · Journal Voucher (acc-vouchers.jsx:494). Must BALANCE (Σdr − Σcr = 0) to
// Post; Post is IMMUTABLE (no edit verbs after). CA-liquidation wizard note.

function JvDetail({ jv, onBack }: { jv: Jv; onBack: () => void }) {
  const { role } = useJce();
  const canPost = canVerb(role, "acc");
  const [status, setStatus] = useState<JvStatus>(jv.status);
  const [lines, setLines] = useState<JvLine[]>(() =>
    JV_LINES.map((l) => ({ ...l })),
  );

  const posted = status === "Posted";
  const dr = lines.reduce((a, l) => a + l.dr, 0);
  const cr = lines.reduce((a, l) => a + l.cr, 0);
  const delta = dr - cr;
  const balanced = delta === 0;

  const setLine = (i: number, patch: Partial<JvLine>) =>
    setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  const post = () => {
    if (!balanced || posted || !canPost) return;
    postJv(jv.jv);
    setStatus("Posted");
    toast.success(`${jv.jv} posted — now immutable.`);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5">
      <button
        type="button"
        onClick={onBack}
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Journal Vouchers
      </button>

      <PageHeader
        kicker={`Accounting · A16 · ${jv.cat}`}
        title={
          <span className="flex items-center gap-2">
            <DocChip code={jv.jv} />
            <Chip tone={JV_TONE[status] ?? "neutral"}>{status}</Chip>
          </span>
        }
        actions={
          canPost && !posted ? (
            <Button size="sm" onClick={post} disabled={!balanced}>
              Post
            </Button>
          ) : posted ? (
            <Chip tone="success">Posted · immutable</Chip>
          ) : null
        }
      />

      {jv.cat === "Cash Advance Liquidation" ? (
        <div className="flex items-start gap-2 rounded-(--r-solid) border border-(--st-success) bg-(--st-success-bg) px-4 py-3 text-ui-12 text-(--st-success-ink)">
          <span aria-hidden>✓</span>
          <span>
            CA Liquidation wizard — source <strong>CV-1633</strong> ·
            cash_advance_ref <strong>CA-26-0033</strong> · outstanding
            ₱95,000.00. Validates: Σ expenses + returned cash = outstanding
            balance.
          </span>
        </div>
      ) : null}

      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Account</th>
              <th>Description</th>
              <th className="text-right">Debit</th>
              <th className="text-right">Credit</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i}>
                <td>
                  {l.ref ? (
                    <DocChip code={l.ref} />
                  ) : (
                    <span className="text-jce-ink-2">—</span>
                  )}
                </td>
                <td>{l.acct}</td>
                <td className="text-jce-ink-2">{l.desc}</td>
                <td className="num">
                  {posted ? (
                    l.dr ? (
                      pmoney(l.dr)
                    ) : (
                      <span className="text-jce-ink-2">—</span>
                    )
                  ) : (
                    <input
                      type="number"
                      className="field h-8 w-28 text-right"
                      value={l.dr}
                      onChange={(e) =>
                        setLine(i, { dr: Number(e.target.value) || 0 })
                      }
                    />
                  )}
                </td>
                <td className="num">
                  {posted ? (
                    l.cr ? (
                      pmoney(l.cr)
                    ) : (
                      <span className="text-jce-ink-2">—</span>
                    )
                  ) : (
                    <input
                      type="number"
                      className="field h-8 w-28 text-right"
                      value={l.cr}
                      onChange={(e) =>
                        setLine(i, { cr: Number(e.target.value) || 0 })
                      }
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td colSpan={3}>
                Σ · Difference{" "}
                <span
                  className={
                    balanced ? "text-(--st-success)" : "text-(--st-danger)"
                  }
                >
                  {pmoney(delta)}
                </span>
              </td>
              <td className="num">{pmoney(dr)}</td>
              <td className="num">{pmoney(cr)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p
        className={
          balanced
            ? "text-ui-12 text-jce-ink-2"
            : "flex items-center gap-1.5 text-ui-12 text-(--st-danger-ink)"
        }
      >
        {balanced
          ? "Balanced — Post writes an immutable entry. Reverse auto-flips a draft JV citing the original."
          : `Out of balance by ${pmoney(Math.abs(delta))} — Post is blocked until Σ debits = Σ credits.`}
      </p>
    </div>
  );
}

export function JournalVouchers() {
  const [sel, setSel] = useState<Jv | null>(null);

  if (sel) return <JvDetail jv={sel} onBack={() => setSel(null)} />;

  const columns: LedgerColumn<Jv>[] = [
    { id: "jv", header: "JV No.", cell: (j) => <DocChip code={j.jv} /> },
    {
      id: "date",
      header: "Date",
      cell: (j) => <span className="font-mono text-ui-12">{j.date}</span>,
    },
    { id: "cat", header: "Category", cell: (j) => j.cat },
    {
      id: "so",
      header: "SO#",
      cell: (j) =>
        j.so === "—" ? (
          <span className="text-jce-ink-2">—</span>
        ) : (
          <DocChip code={j.so} />
        ),
    },
    {
      id: "desc",
      header: "Description",
      cell: (j) => <span className="text-jce-ink-2">{j.desc}</span>,
    },
    {
      id: "total",
      header: "Total",
      align: "right",
      cell: (j) => pmoney(j.total),
    },
    {
      id: "status",
      header: "Status",
      cell: (j) => (
        <Chip tone={JV_TONE[j.status] ?? "neutral"}>{j.status}</Chip>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="Accounting · A16"
        title="Journal Vouchers"
        description="Manual journal entries. A JV must balance to Post; a Posted JV is immutable."
        actions={<Button size="sm">+ New JV</Button>}
      />
      <LedgerGrid
        columns={columns}
        rows={getJvs()}
        getRowKey={(j) => j.jv}
        onRowClick={(j) => setSel(j)}
      />
    </div>
  );
}
