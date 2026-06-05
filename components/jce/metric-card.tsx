import { cn } from "@/lib/utils";

// Metric card — the record-page analog of KpiTile (which is glass, for list KPI
// strips): a SOLID inner stat card for a single derived/commercial figure. Big
// tabular-nums value + kicker label + optional hint. The `derived` flag stamps the
// FieldComputed hatch identity ("DERIVED", read-only) at card scale, so derived
// numbers stay visibly un-editable. Tag: Solid.

export type MetricTone = "neutral" | "success" | "danger" | "info" | "pending";

const TONE_TEXT: Record<MetricTone, string> = {
  neutral: "text-jce-ink",
  success: "text-(--st-success)",
  danger: "text-(--st-danger)",
  info: "text-(--st-info)",
  pending: "text-(--st-pending-ink)",
};

export function MetricCard({
  label,
  value,
  hint,
  derived,
  tone = "neutral",
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  /** marks the figure as computed/read-only (hatched DERIVED tag + tooltip) */
  derived?: boolean;
  tone?: MetricTone;
  className?: string;
}) {
  return (
    <div
      data-slot="metric-card"
      data-computed={derived || undefined}
      title={derived ? "Computed — derived, read-only" : undefined}
      className={cn("solid rounded-(--r-solid) p-4", className)}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="kicker">{label}</span>
        {derived ? (
          <span className="computed kicker shrink-0">derived</span>
        ) : null}
      </div>
      <div
        className={cn(
          "mt-1.5 text-ui-22 leading-none font-bold tracking-tight tabular-nums",
          TONE_TEXT[tone],
        )}
      >
        {value}
      </div>
      {hint ? (
        <div className="mt-2 text-ui-12 text-jce-ink-2">{hint}</div>
      ) : null}
    </div>
  );
}
