import type { Metadata } from "next";

import { pmoney } from "@/lib/mock/format";
import {
  PRICE_HISTORY,
  PRICE_SERIES,
  PRICE_THRESHOLD_PCT,
} from "@/lib/mock/purchasing";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

export const metadata: Metadata = { title: "Price history" };

// U18 · Price history & flags (pur-phase2a.jsx:445). FX-normalized trend + an
// entry-time warning chip when a new price exceeds last paid by the configured
// threshold. SVG stroke/fill use tokens — never a literal hex.
const W = 520;
const H = 140;
const PAD = 24;
const MIN = 110000;
const MAX = 135000;

export default function PriceHistoryPage() {
  const x = (i: number) =>
    PAD + (i * (W - 2 * PAD)) / (PRICE_SERIES.length - 1);
  const y = (v: number) => H - PAD - ((v - MIN) / (MAX - MIN)) * (H - 2 * PAD);
  const path = PRICE_SERIES.map(
    (v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`,
  ).join(" ");

  const last = PRICE_SERIES[PRICE_SERIES.length - 1] ?? 0;
  const prev = PRICE_SERIES[PRICE_SERIES.length - 2] ?? last;
  const deltaPct = prev ? ((last - prev) / prev) * 100 : 0;
  const overThreshold = deltaPct > PRICE_THRESHOLD_PCT;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <PageHeader
        kicker="Purchasing · U18 · Phase 2"
        title="Price history — Transformer 10MVA"
        actions={
          <Chip tone={overThreshold ? "pending" : "neutral"}>
            {overThreshold ? "⚠ " : ""}
            {deltaPct >= 0 ? "+" : ""}
            {deltaPct.toFixed(1)}% vs last paid
          </Chip>
        }
      />

      <div className="glass rounded-(--r-glass) p-4">
        <div className="mb-2 text-ui-13 font-semibold text-jce-ink">
          FX-normalized price trend (₱)
        </div>
        <div className="solid rounded-(--r-solid) p-4">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label="Price trend"
          >
            <path
              d={path}
              fill="none"
              stroke="var(--jce-green-600)"
              strokeWidth={2.5}
            />
            {PRICE_SERIES.map((v, i) => (
              <g key={i}>
                <circle
                  cx={x(i)}
                  cy={y(v)}
                  r={3.5}
                  fill="var(--jce-green-700)"
                />
                <text
                  x={x(i)}
                  y={y(v) - 8}
                  textAnchor="middle"
                  fontSize={9}
                  fill="var(--jce-ink-2)"
                >
                  {(v / 1000).toFixed(0)}k
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Supplier</th>
              <th className="num">Unit price</th>
              <th>Source</th>
              <th>Flag</th>
            </tr>
          </thead>
          <tbody>
            {PRICE_HISTORY.map((h, i) => (
              <tr key={i}>
                <td className="mono text-ui-12">{h.date}</td>
                <td>{h.supplier}</td>
                <td className="num">{pmoney(h.price)}</td>
                <td>
                  <DocChip code={h.ref} />
                </td>
                <td>
                  {h.up ? (
                    <Chip tone="pending">↑ over threshold</Chip>
                  ) : (
                    <span className="text-jce-ink-2">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-ui-12 text-jce-ink-2">
        Entry-time warning when a new price exceeds last paid by the configured
        threshold ({PRICE_THRESHOLD_PCT}%). FX-normalized for cross-currency
        comparison.
      </p>
    </div>
  );
}
