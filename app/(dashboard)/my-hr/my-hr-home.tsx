"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import {
  REQUEST_TYPES,
  REQ_TONE,
  findEmployee,
  getRequests,
  getTimeRows,
  projLabel,
  rowDistribution,
} from "@/lib/mock/hr";
import { Button } from "@/components/ui/button";
import { KpiTile } from "@/components/jce/kpi-tile";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

// H12 · Self-service — My HR (hr-requests.jsx:549). OWN records only — keyed to
// the signed-in employee (demo "self" = Noel Bautista). Never shows another
// person's data. The Employee role lands here.
const ME_ID = 9;

export function MyHrHome() {
  const me = findEmployee(ME_ID);
  if (!me) return null;

  const myRequests = REQUEST_TYPES.flatMap((t) =>
    getRequests(t.label)
      .filter((r) => r.emp.includes("Bautista"))
      .map((r) => ({ ...r, type: t.label })),
  );
  const rows = getTimeRows().slice(1, 6);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <div>
        <h1 className="flex flex-wrap items-center gap-3 text-ui-28 font-bold tracking-tight text-jce-ink">
          My HR
          <span className="inline-flex items-center rounded-full bg-jce-green-50 px-2.5 py-0.5 text-ui-12 font-medium text-jce-green-700">
            Own records only
          </span>
        </h1>
        <p className="mt-1 text-ui-14 text-jce-ink-2">
          Your own records — payslips, leave, timekeeping and requests.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiTile
          label="My requests"
          value={myRequests.length}
          delta="1 recorded · 1 approved"
          tone="success"
        />
        <KpiTile
          label="Last payslip"
          value="May 30"
          delta="available to view"
        />
        <Link
          href="/my-hr/submit"
          className="focus-ring-jce glass flex flex-col justify-between rounded-(--r-glass) p-4 transition-colors hover:border-jce-green-500"
        >
          <div className="kicker">Submit a request</div>
          <div className="mt-1.5 text-ui-16 font-bold text-jce-ink">
            OB · OT · Leave
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-ui-12 font-semibold text-jce-green-700">
            New request <ArrowRightIcon className="size-3.5" aria-hidden />
          </div>
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-(--r-glass) p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-ui-16 font-semibold text-jce-ink">
              My requests
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/my-hr/submit">New</Link>
            </Button>
          </div>
          <div className="solid divide-y divide-jce-line overflow-hidden rounded-(--r-solid)">
            {myRequests.map((r) => (
              <div key={r.no} className="flex flex-wrap items-center gap-3 p-3">
                <DocChip code={r.no} />
                <div className="min-w-40 flex-1">
                  <div className="text-ui-13 font-medium text-jce-ink">
                    {r.key}
                  </div>
                  <div className="text-ui-12 text-jce-ink-2">{r.type}</div>
                </div>
                <Chip tone={REQ_TONE[r.status] ?? "neutral"}>{r.status}</Chip>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-(--r-glass) p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-ui-16 font-semibold text-jce-ink">
              My payslips
            </h2>
            <Chip tone="neutral">read-only</Chip>
          </div>
          <div className="solid divide-y divide-jce-line overflow-hidden rounded-(--r-solid)">
            {[
              { no: "PSL · May 30", t: "Daily 06–20 cut-off" },
              { no: "PSL · May 15", t: "Daily 21–05 cut-off" },
            ].map((p) => (
              <div key={p.no} className="flex flex-wrap items-center gap-3 p-3">
                <DocChip code={p.no} />
                <div className="min-w-40 flex-1">
                  <div className="text-ui-13 font-medium text-jce-ink">
                    {p.t}
                  </div>
                  <div className="text-ui-12 text-jce-ink-2">
                    Approved payslip
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View / PDF
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-(--r-glass) p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-ui-16 font-semibold text-jce-ink">
            My timekeeping
          </h2>
          <Chip tone="neutral">read-only · own rows</Chip>
        </div>
        <div className="solid overflow-auto rounded-(--r-solid) p-0">
          <table className="jtable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th className="text-right">In</th>
                <th className="text-right">Out</th>
                <th className="text-right">Reg</th>
                <th className="text-right">OT</th>
                <th>Leave</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const d = rowDistribution(r, getTimeRows());
                return (
                  <tr key={r.id}>
                    <td className="whitespace-nowrap">
                      {r.day} {r.date.slice(8)}
                    </td>
                    <td>
                      {r.proj === "—" ? (
                        <span className="text-jce-ink-2">—</span>
                      ) : (
                        <span className="font-mono text-ui-12">
                          {projLabel(r.proj)}
                        </span>
                      )}
                    </td>
                    <td className="num font-mono">{r.in}</td>
                    <td className="num font-mono">{r.out}</td>
                    <td className="num">{d.reg.toFixed(1)}</td>
                    <td className="num">{d.ot.toFixed(1)}</td>
                    <td>{r.leave ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
