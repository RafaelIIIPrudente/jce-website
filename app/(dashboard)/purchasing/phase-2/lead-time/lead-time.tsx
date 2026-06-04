"use client";

import { useState } from "react";

import { LEAD_TIME_ROWS, SCORE_TONE } from "@/lib/mock/purchasing";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { FieldComputed } from "@/components/jce/field-computed";

const TRIGGERS: Record<string, string> = {
  "PO Approved": "2026-06-03",
  "Downpayment paid": "2026-06-08",
  "PO Sent": "2026-06-05",
};

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// U20 · Lead-time & supplier reliability (pur-phase2b.jsx:137). Structured
// lead-time editor (trigger + days → computed expected date) + reliability table.
export function LeadTime() {
  const [trigger, setTrigger] = useState("PO Approved");
  const [days, setDays] = useState(30);
  const base = TRIGGERS[trigger] ?? "2026-06-03";
  const expected = addDays(base, days);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <PageHeader
        kicker="Purchasing · U20 · Phase 2"
        title="Lead-time & supplier reliability"
      />

      <div className="solid rounded-(--r-solid) p-5">
        <div className="mb-3 text-ui-13 font-semibold text-jce-ink">
          Structured lead-time editor
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-ui-12 font-semibold text-jce-ink-2">
              Trigger event
            </span>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="field h-9"
            >
              {Object.keys(TRIGGERS).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-ui-12 font-semibold text-jce-ink-2">
              Lead-time (days)
            </span>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(Number(e.target.value) || 0)}
              className="field h-9"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-ui-12 font-semibold text-jce-ink-2">
              Computed expected date
            </span>
            <FieldComputed>
              {expected} (from {trigger.toLowerCase()} + {days}d)
            </FieldComputed>
          </label>
        </div>
      </div>

      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>Supplier</th>
              <th className="num">On-time %</th>
              <th className="num">Avg delay (days)</th>
              <th className="num">Orders</th>
              <th>Reliability</th>
            </tr>
          </thead>
          <tbody>
            {LEAD_TIME_ROWS.map((s) => (
              <tr key={s.name}>
                <td className="font-semibold">{s.name}</td>
                <td className="num">{s.onTime}%</td>
                <td className="num">{s.avgDelay}</td>
                <td className="num">{s.orders}</td>
                <td>
                  <Chip tone={SCORE_TONE[s.score] ?? "neutral"}>
                    Score {s.score}
                  </Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-ui-12 text-jce-ink-2">
        Computed expected vs actual dates with early / on-time / late flags; the
        reliability panel surfaces on the supplier record (U10) during
        selection.
      </p>
    </div>
  );
}
