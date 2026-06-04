"use client";

import { useState } from "react";
import { ChevronLeftIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { ROLES } from "@/lib/rbac";
import {
  ACC_PROJECTS,
  REPORTS,
  TB_ROWS,
  type ReportItem,
  type TbRow,
} from "@/lib/mock/accounting";
import { peso, pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";
import { BarChart3Icon } from "lucide-react";

// A18 · Reporting hub (FLAGSHIP — acc-reporting.jsx:6). Catalog by family →
// params panel → viewer rendering Trial Balance, Balance Sheet (Roman-numeral
// bands), AR Aging — with GL drill-down (line → entries → source doc) and
// Live/Snapshot labeling.

// Accounts with posted activity in the current snapshot (others drill to a
// graceful "source not available" note — sad path).
const GL_ENTRIES: Record<
  string,
  readonly { date: string; src: string | null; desc: string; amt: number }[]
> = {
  "10001": [
    {
      date: "05-28",
      src: "CR-0902",
      desc: "NORECO II 8th billing",
      amt: 2361800,
    },
    { date: "05-12", src: "CR-0888", desc: "NGCP mobilization", amt: 13269200 },
    { date: "05-30", src: "CV-1634", desc: "Cebu Steel payment", amt: -312081 },
  ],
  "10101": [
    {
      date: "05-28",
      src: "SI-004512",
      desc: "NORECO II 8th billing",
      amt: 2410000,
    },
    {
      date: "05-20",
      src: "SOA-2026-088",
      desc: "Meralco progress",
      amt: 880000,
    },
  ],
  "50001": [
    {
      date: "05-30",
      src: "CV-1633",
      desc: "Mobilization expenses",
      amt: 72000,
    },
    {
      date: "05-25",
      src: null,
      desc: "Reclass (source not attached)",
      amt: 18000,
    },
  ],
};

export function Reporting() {
  const { role } = useJce();
  const [picked, setPicked] = useState<{
    fam: string;
    item: ReportItem;
  } | null>(null);
  const [generated, setGenerated] = useState(false);
  const [drill, setDrill] = useState<TbRow | null>(null);

  // ---- catalog ----
  if (!picked) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <PageHeader
          kicker="Accounting · A18"
          title="Reporting hub"
          description="Drill-down everywhere · snapshots · live-vs-snapshot labeling."
        />
        {Object.entries(REPORTS).map(([fam, items]) => (
          <section key={fam} className="flex flex-col gap-2">
            <div className="kicker text-jce-green-600">{fam}</div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((it) => (
                <button
                  key={it.name}
                  type="button"
                  onClick={() => {
                    setPicked({ fam, item: it });
                    setGenerated(false);
                  }}
                  className="focus-ring-jce glass flex flex-col gap-1 rounded-(--r-glass) p-4 text-left transition-colors hover:border-jce-green-500"
                >
                  <div className="text-ui-14 font-semibold text-jce-ink">
                    {it.name}
                  </div>
                  <div className="text-ui-12 text-jce-ink-2">{it.desc}</div>
                  <div className="mt-1">
                    <Chip tone="neutral">{it.tag}</Chip>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  const { fam, item } = picked;
  const isTB = item.name === "Trial Balance";
  const isBS = item.name === "Balance Sheet";
  const isAging = item.name === "AR Aging";
  const drDr = TB_ROWS.reduce((a, r) => a + r.dr, 0);
  const drCr = TB_ROWS.reduce((a, r) => a + r.cr, 0);

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5">
      <button
        type="button"
        onClick={() => {
          setPicked(null);
          setDrill(null);
        }}
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Report catalog
      </button>

      <PageHeader
        kicker={fam}
        title={item.name}
        actions={
          generated ? (
            <>
              <Button variant="ghost" size="sm">
                Export PDF / Excel
              </Button>
              <Button variant="accent" size="sm">
                Snapshot
              </Button>
            </>
          ) : null
        }
      />

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        {/* params */}
        <div className="solid flex flex-col gap-3 rounded-(--r-solid) p-5">
          <h2 className="text-ui-14 font-semibold text-jce-ink">Parameters</h2>
          <label className="text-ui-12 font-semibold text-jce-ink-2">
            Report type
            <div className="computed field mt-1 flex items-center">
              {item.name}
            </div>
          </label>
          <label className="text-ui-12 font-semibold text-jce-ink-2">
            As-of / period
            <select className="field mt-1">
              <option>This month</option>
              <option>Last month</option>
              <option>This quarter</option>
              <option>This year</option>
            </select>
          </label>
          <div className="flex gap-1.5">
            {["MTD", "QTD", "YTD"].map((q) => (
              <span
                key={q}
                className="rounded-(--r-pill) bg-(--table-zebra) px-2 py-0.5 text-ui-12 text-jce-ink-2"
              >
                {q}
              </span>
            ))}
          </div>
          <label className="flex items-center gap-2 text-ui-12 text-jce-ink">
            <input
              type="checkbox"
              defaultChecked
              className="accent-jce-green-700"
            />{" "}
            Comparative (prior period)
          </label>
          {isTB ? (
            <label className="flex items-center gap-2 text-ui-12 text-jce-ink">
              <input
                type="checkbox"
                defaultChecked
                className="accent-jce-green-700"
              />{" "}
              Display all CoA accounts
            </label>
          ) : null}
          <label className="text-ui-12 font-semibold text-jce-ink-2">
            Project filter
            <select className="field mt-1">
              <option>All projects</option>
              {ACC_PROJECTS.map((p) => (
                <option key={p.so}>
                  {p.so} · {p.label}
                </option>
              ))}
            </select>
          </label>
          <Button
            className="mt-1 w-full"
            size="sm"
            onClick={() => setGenerated(true)}
          >
            Generate report
          </Button>
          {generated ? (
            <div className="flex items-center gap-1.5 text-ui-12 text-jce-ink-2">
              Generated 2026-06-03 10:22 · {ROLES[role].short} ·{" "}
              <Chip tone="success">Live</Chip>
            </div>
          ) : null}
        </div>

        {/* viewer */}
        <div className="solid rounded-(--r-solid) p-5">
          {!generated ? (
            <EmptyState
              icon={
                <BarChart3Icon
                  className="size-7"
                  strokeWidth={1.5}
                  aria-hidden
                />
              }
              title="Set parameters & generate"
              description={`The ${item.name} renders here with drill-down.`}
            />
          ) : isTB ? (
            <>
              <ViewerHead
                title={`Trial Balance · as of 2026-06-03 · Landscape Long bond`}
              />
              <table className="jtable mt-3">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Account</th>
                    <th className="text-right">Debit</th>
                    <th className="text-right">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {TB_ROWS.map((r) => (
                    <tr
                      key={r.code}
                      tabIndex={0}
                      onClick={() => setDrill(r)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setDrill(r);
                        }
                      }}
                      className="focus-ring-jce cursor-pointer outline-none"
                    >
                      <td className="font-mono font-semibold">{r.code}</td>
                      <td>
                        {r.name}{" "}
                        <span className="text-ui-12 text-jce-green-700">
                          drill →
                        </span>
                      </td>
                      <td className="num">
                        {r.dr ? (
                          pmoney(r.dr)
                        ) : (
                          <span className="text-jce-ink-2">—</span>
                        )}
                      </td>
                      <td className="num">
                        {r.cr ? (
                          pmoney(r.cr)
                        ) : (
                          <span className="text-jce-ink-2">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold">
                    <td colSpan={2}>TOTALS</td>
                    <td className="num">{pmoney(drDr)}</td>
                    <td className="num">{pmoney(drCr)}</td>
                  </tr>
                </tfoot>
              </table>
              <p className="mt-2 text-ui-12 text-jce-ink-2">
                Representative subset — the full Trial Balance foots to zero
                across all 129 accounts.
              </p>
            </>
          ) : isBS ? (
            <>
              <ViewerHead title="Balance Sheet · as of 2026-06-03" />
              <table className="jtable mt-3">
                <tbody>
                  <BsBand label="I · CURRENT ASSETS" />
                  <BsRow k="Cash in Bank" v={5745000} />
                  <BsRow k="Trade & Retention Receivable" v={3967000} />
                  <BsRow k="Total Current Assets" v={9712000} sub />
                  <BsBand label="XX · CURRENT LIABILITIES" />
                  <BsRow k="Voucher's & Trade Payable" v={4470081} />
                  <BsRow k="Output VAT & WHT Payable" v={1492714} />
                  <BsRow k="Total Current Liabilities" v={5962795} sub />
                  <BsBand label="XXXV · STOCKHOLDERS EQUITY" />
                  <BsRow k="Owner's Capital + Retained Earnings" v={3749205} />
                </tbody>
              </table>
              <p className="mt-2 text-ui-12 text-jce-ink-2">
                Roman-numeral lines driven by mapping_version (A1 §9).
              </p>
            </>
          ) : isAging ? (
            <>
              <ViewerHead title="AR Aging · as of 2026-06-03" />
              <table className="jtable mt-3">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th className="text-right">0–30</th>
                    <th className="text-right">31–60</th>
                    <th className="text-right">61–90</th>
                    <th className="text-right">90+</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>NORECO II</td>
                    <td className="num">{pmoney(2410000)}</td>
                    <td className="num text-jce-ink-2">—</td>
                    <td className="num text-jce-ink-2">—</td>
                    <td className="num text-jce-ink-2">—</td>
                    <td className="num">{pmoney(2410000)}</td>
                  </tr>
                  <tr>
                    <td>Meralco</td>
                    <td className="num text-jce-ink-2">—</td>
                    <td className="num">{pmoney(880000)}</td>
                    <td className="num text-jce-ink-2">—</td>
                    <td className="num text-jce-ink-2">—</td>
                    <td className="num">{pmoney(880000)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="font-semibold">
                    <td>Total</td>
                    <td className="num">{pmoney(2410000)}</td>
                    <td className="num">{pmoney(880000)}</td>
                    <td className="num text-jce-ink-2">—</td>
                    <td className="num text-jce-ink-2">—</td>
                    <td className="num">{pmoney(3290000)}</td>
                  </tr>
                </tfoot>
              </table>
            </>
          ) : (
            <div className="py-6">
              <ViewerHead title={`${item.name} · 2026-06-03`} />
              <div className="mt-3">
                <EmptyState
                  icon={
                    <BarChart3Icon
                      className="size-7"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  }
                  title={item.name}
                  description={
                    fam.startsWith("B")
                      ? "Generated via guided wizard in the official agency layout (period + RDO/branch params)."
                      : `Rendered in ${item.tag} layout with drill-down to source documents.`
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GL drill-down */}
      <Sheet open={drill != null} onOpenChange={(o) => !o && setDrill(null)}>
        <SheetContent className="w-full gap-0 sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>
              {drill ? `${drill.code} · ${drill.name}` : "GL drill-down"}
            </SheetTitle>
            <SheetDescription>
              GL drill-down → journal entries → source document.
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-auto p-4">
            {drill && GL_ENTRIES[drill.code] ? (
              <table className="jtable">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Source</th>
                    <th>Description</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {GL_ENTRIES[drill.code]?.map((e, i) => (
                    <tr key={i}>
                      <td className="font-mono text-ui-12">{e.date}</td>
                      <td>
                        {e.src ? (
                          <DocChip code={e.src} />
                        ) : (
                          <span className="text-ui-12 text-(--st-pending-ink)">
                            source not available
                          </span>
                        )}
                      </td>
                      <td>{e.desc}</td>
                      <td
                        className={cn(
                          "num font-mono tabular-nums",
                          e.amt < 0 && "text-(--st-danger)",
                        )}
                      >
                        {e.amt < 0
                          ? `(${pmoney(Math.abs(e.amt))})`
                          : pmoney(e.amt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="rounded-(--r-input) bg-(--table-zebra) px-3 py-6 text-center text-ui-12 text-jce-ink-2">
                No posted entries for this line in the current snapshot — source
                documents not available.
              </div>
            )}
            <p className="mt-3 text-ui-12 text-jce-ink-2">
              Each entry links to its source document (CV / SI / CR / JV).
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ViewerHead({ title }: { title: string }) {
  return (
    <div className="border-b border-jce-line pb-2 text-center">
      <div className="text-ui-14 font-extrabold text-jce-ink">
        JC ELECTROFIELDS POWER SYSTEM, INC.
      </div>
      <div className="text-ui-12 text-jce-ink-2">{title}</div>
    </div>
  );
}

function BsBand({ label }: { label: string }) {
  return (
    <tr className="bg-jce-green-50">
      <td colSpan={2} className="font-bold text-jce-green-900">
        {label}
      </td>
    </tr>
  );
}

function BsRow({ k, v, sub }: { k: string; v: number; sub?: boolean }) {
  return (
    <tr className={sub ? "font-semibold" : ""}>
      <td className={sub ? "text-jce-ink" : "text-jce-ink-2"}>{k}</td>
      <td className="num">{peso(v)}</td>
    </tr>
  );
}
