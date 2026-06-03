import { CheckIcon, LockIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Stepper — the 3-state lock gate (Foundations.html:143-155,628-638). Nodes:
// done (green check), current (green ring), todo (grey ring), locked (ink + lock
// glyph — immutable once locked). Tag: Glass rail / solid rows.

export type StepState = "done" | "current" | "todo" | "locked";
export type Step = { label: string; sub?: string; state: StepState };

export function Stepper({
  steps,
  className,
}: {
  steps: readonly Step[];
  className?: string;
}) {
  return (
    <div data-slot="stepper" className={cn("flex flex-col", className)}>
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full text-ui-12 font-bold",
                  s.state === "done" &&
                    "bg-jce-green-700 text-primary-foreground",
                  s.state === "current" &&
                    "border-2 border-jce-green-600 bg-card text-jce-green-700",
                  s.state === "todo" &&
                    "border-2 border-jce-line bg-card text-jce-ink-2",
                  s.state === "locked" &&
                    "bg-(--st-locked) text-(--st-locked-ink)",
                )}
              >
                {s.state === "done" ? (
                  <CheckIcon className="size-3.5" strokeWidth={3} aria-hidden />
                ) : s.state === "locked" ? (
                  <LockIcon className="size-3" strokeWidth={2.5} aria-hidden />
                ) : (
                  i + 1
                )}
              </span>
              {!last ? (
                <span
                  className={cn(
                    "min-h-4 w-0.5 flex-1",
                    s.state === "done" ? "bg-jce-green-600" : "bg-jce-line",
                  )}
                />
              ) : null}
            </div>
            <div className={cn(!last && "pb-3.5")}>
              <div className="text-ui-13 font-semibold text-jce-ink">
                {s.label}
              </div>
              {s.sub ? (
                <div className="text-ui-12 text-jce-ink-2">{s.sub}</div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
