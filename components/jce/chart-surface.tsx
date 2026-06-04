import { cn } from "@/lib/utils";

// Chart surface (Foundations.html:236-241,744-763) — a solid chart inside a glass
// card. Bars (collections, aging) or a line / S-curve (P16). Used on A18, U18,
// P16, W1. Tag: Solid chart in glass card.

export type ChartDatum = { label: string; value: number; accent?: boolean };

export function ChartSurface({
  title,
  data,
  max,
  variant = "bars",
  className,
}: {
  title?: string;
  data: readonly ChartDatum[];
  max?: number;
  variant?: "bars" | "line";
  className?: string;
}) {
  const peak = max ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      data-slot="chart-surface"
      className={cn("glass rounded-(--r-glass) p-4", className)}
    >
      {title ? <div className="kicker">{title}</div> : null}
      <div className="solid mt-2.5 px-3 pt-4 pb-2">
        {variant === "bars" ? (
          <div className="flex h-28 items-end gap-2">
            {data.map((d) => (
              <div
                key={d.label}
                className="relative flex-1 rounded-t-[5px]"
                style={{
                  height: `${Math.max(4, (d.value / peak) * 100)}%`,
                  background: d.accent
                    ? "linear-gradient(180deg,var(--jce-orange-500),var(--jce-orange-600))"
                    : "linear-gradient(180deg,var(--jce-green-500),var(--jce-green-700))",
                }}
              >
                <span className="absolute -top-4 right-0 left-0 text-center text-[9px] tabular-nums text-jce-ink-2">
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <LineChart data={data} peak={peak} />
        )}
        <div className="mt-1.5 flex gap-2">
          {data.map((d) => (
            <span
              key={d.label}
              className="flex-1 text-center text-[9px] text-jce-ink-2"
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LineChart({
  data,
  peak,
}: {
  data: readonly ChartDatum[];
  peak: number;
}) {
  const W = 100;
  const H = 40;
  const n = data.length;
  const points = data.map((d, i) => {
    const x = n === 1 ? W / 2 : (i / (n - 1)) * W;
    const y = H - (d.value / peak) * (H - 4) - 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const area = `0,${H} ${points.join(" ")} ${W},${H}`;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-28 w-full"
      aria-hidden
    >
      <polygon
        points={area}
        fill="color-mix(in srgb, var(--jce-green-500) 18%, transparent)"
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="var(--jce-green-700)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
