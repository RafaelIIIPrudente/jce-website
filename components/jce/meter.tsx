import { cn } from "@/lib/utils";

// Progress meter — a token-built horizontal bar for any "part of a whole" figure
// (billed-vs-contract, % complete, budget consumed). Accessible progressbar; the
// fill width animates but collapses to a static bar under prefers-reduced-motion
// (the global reduce block neutralises transition durations). Fixed-height track →
// no layout shift. Pair with caller-supplied % + value labels. Tag: Solid.

export type MeterTone = "green" | "info" | "pending" | "danger" | "success";

const FILL: Record<MeterTone, string> = {
  green: "bg-jce-green-600",
  info: "bg-(--st-info)",
  pending: "bg-(--st-pending)",
  danger: "bg-(--st-danger)",
  success: "bg-(--st-success)",
};

export function Meter({
  value,
  max,
  tone = "green",
  label,
  className,
}: {
  /** current value (clamped into 0…max) */
  value: number;
  /** the whole; a non-positive max renders an empty (0%) bar */
  max: number;
  tone?: MeterTone;
  /** accessible label (the visible %/figures live alongside, caller-supplied) */
  label: string;
  className?: string;
}) {
  const pct =
    Number.isFinite(value) && Number.isFinite(max) && max > 0
      ? Math.min(100, Math.max(0, (value / max) * 100))
      : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className={cn(
        "h-2.5 w-full overflow-hidden rounded-full bg-jce-line",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-700 ease-out",
          FILL[tone],
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
