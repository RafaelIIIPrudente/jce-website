import type { Metadata } from "next";

import { PageHeader } from "@/components/jce/page-header";

export const metadata: Metadata = { title: "S-curve" };

// P16 · S-curve & charting (pmg-phase2.jsx:169). Planned-vs-actual cumulative %
// (SVG) + portfolio heatmap. Static SVG — colours route through CSS variables.
const planned = [0, 8, 20, 35, 52, 68, 82, 92, 100];
const actual: (number | null)[] = [0, 6, 16, 28, 44, 58, null, null, null];
const PERIODS = ["PB1", "PB2", "PB3", "PB4", "PB5", "PB6", "PB7", "PB8", "PB9"];
const W = 560;
const H = 220;
const PAD = 30;

const x = (i: number) => PAD + (i * (W - 2 * PAD)) / (planned.length - 1);
const y = (v: number) => H - PAD - (v * (H - 2 * PAD)) / 100;
const linePath = (arr: (number | null)[]) =>
  arr
    .map((v, i) => (v == null ? null : `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`))
    .filter(Boolean)
    .join(" ");

const HEAT: [string, number[]][] = [
  ["NORECO II — 13.2KV", [100, 100, 80, 40, 0]],
  ["Cavite 69KV", [100, 100, 100, 90, 60]],
  ["Solar Tarlac", [100, 100, 100, 100, 80]],
];
function heatColor(v: number): string {
  if (v === 100) return "var(--jce-green-600)";
  if (v >= 60) return "var(--jce-green-500)";
  if (v >= 30) return "var(--jce-orange-500)";
  if (v > 0) return "var(--jce-orange-600)";
  return "var(--table-zebra)";
}

export default function SCurvePage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        kicker="PMG · P16 · Phase 2"
        title="S-curve & progress charting"
      />

      <div className="glass rounded-(--r-glass) p-5">
        <div className="text-ui-14 font-semibold text-jce-ink">
          Planned vs actual — cumulative % accomplishment
        </div>
        <div className="solid mt-3 rounded-(--r-solid) p-4">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label="Planned vs actual S-curve"
          >
            {[0, 25, 50, 75, 100].map((g) => (
              <g key={g}>
                <line
                  x1={PAD}
                  y1={y(g)}
                  x2={W - PAD}
                  y2={y(g)}
                  stroke="var(--jce-line)"
                  strokeWidth={1}
                />
                <text
                  x={PAD - 6}
                  y={y(g) + 3}
                  textAnchor="end"
                  fontSize={9}
                  fill="var(--jce-ink-2)"
                >
                  {g}
                </text>
              </g>
            ))}
            <path
              d={linePath(planned)}
              fill="none"
              stroke="var(--jce-ink-2)"
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            <path
              d={linePath(actual)}
              fill="none"
              stroke="var(--jce-green-700)"
              strokeWidth={2.5}
            />
            {actual.map((v, i) =>
              v == null ? null : (
                <circle
                  key={i}
                  cx={x(i)}
                  cy={y(v)}
                  r={3.5}
                  fill="var(--jce-green-700)"
                />
              ),
            )}
            {PERIODS.map((p, i) => (
              <text
                key={p}
                x={x(i)}
                y={H - PAD + 14}
                textAnchor="middle"
                fontSize={8}
                fill="var(--jce-ink-2)"
              >
                {p}
              </text>
            ))}
          </svg>
          <div className="mt-2 flex gap-5 text-ui-12">
            <span className="text-jce-ink-2">— — Planned</span>
            <span className="font-semibold text-jce-green-700">
              —— Actual (PB5: 58% · 10% behind)
            </span>
          </div>
        </div>
      </div>

      <div className="glass rounded-(--r-glass) p-5">
        <div className="text-ui-14 font-semibold text-jce-ink">
          Portfolio heatmap — % to date by period
        </div>
        <div className="solid mt-3 overflow-auto rounded-(--r-solid) p-0">
          <table className="jtable">
            <thead>
              <tr>
                <th>Project</th>
                {["PB1", "PB2", "PB3", "PB4", "PB5"].map((p) => (
                  <th key={p} className="text-right">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEAT.map(([name, row]) => (
                <tr key={name}>
                  <td className="font-semibold text-jce-ink">{name}</td>
                  {row.map((v, i) => (
                    <td key={i} className="num">
                      <span
                        className="inline-grid size-7 place-items-center rounded-(--r-input) text-[11px] font-semibold text-jce-ink"
                        style={{ background: heatColor(v) }}
                      >
                        {v}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
