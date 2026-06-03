"use client";

import { cn } from "@/lib/utils";

// Segmented control (`.seg`, Foundations.html:139-141) — entity/category toggles
// (B3 JCEPSI·JICA, B5 EC·WS·Solar, U2 Local·Import·All), notification filters.
// Tag: Glass bar.

export type SegmentedOption = { value: string; label: React.ReactNode };

export function Segmented({
  options,
  value,
  onValueChange,
  className,
  "aria-label": ariaLabel,
}: {
  options: readonly SegmentedOption[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <div
      data-slot="segmented"
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "glass-nav inline-flex gap-0.5 rounded-[10px] p-1",
        className,
      )}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(o.value)}
            className={cn(
              "focus-ring-jce rounded-[7px] px-3.5 py-1.5 text-ui-12 font-semibold transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-jce-ink-2 hover:text-jce-green-900",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
