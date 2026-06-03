import { cn } from "@/lib/utils";

// KPI / stat tile (screens-core.jsx:208-217 · Foundations "KPI / stat tile").
// Glass chrome surface; the delta colour carries the tone. Used on X3, P1, U1, W1.
// Tag: Glass.

export type KpiTone = "pending" | "success" | "danger" | "info" | "neutral";

const TONE_TEXT: Record<KpiTone, string> = {
  pending: "text-[var(--st-pending-ink)]",
  success: "text-[var(--st-success)]",
  danger: "text-[var(--st-danger)]",
  info: "text-[var(--st-info)]",
  neutral: "text-jce-ink-2",
};

export function KpiTile({
  label,
  value,
  delta,
  tone = "neutral",
  className,
}: {
  label: string;
  value: React.ReactNode;
  delta?: string;
  tone?: KpiTone;
  className?: string;
}) {
  return (
    <div
      data-slot="kpi-tile"
      className={cn("glass rounded-[var(--r-glass)] p-4", className)}
    >
      <div className="kicker">{label}</div>
      <div className="mt-1.5 text-ui-28 leading-none font-bold tracking-tight tabular-nums text-jce-ink">
        {value}
      </div>
      {delta ? (
        <div className={cn("mt-1.5 text-ui-12 font-semibold", TONE_TEXT[tone])}>
          {delta}
        </div>
      ) : null}
    </div>
  );
}
