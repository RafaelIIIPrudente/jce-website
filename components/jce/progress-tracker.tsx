import { cn } from "@/lib/utils";

import { Chip, type ChipTone } from "@/components/jce/chip";

// Progress tracker — the N-stage segmented bar (U7 15-stage import, 5-stage
// flows). Completed stages green, the active stage orange, the rest neutral.
// (Foundations.html:640-658). Tag: Glass rail / solid rows.

export function ProgressTracker({
  total,
  current,
  stageLabel,
  statusLabel,
  statusTone = "pending",
  className,
}: {
  total: number;
  /** 1-based index of the active stage */
  current: number;
  stageLabel?: string;
  statusLabel?: string;
  statusTone?: ChipTone;
  className?: string;
}) {
  return (
    <div data-slot="progress-tracker" className={className}>
      <div className="mb-2 font-mono text-ui-12 text-jce-ink-2">
        Stage {current} / {total}
      </div>
      <div className="flex gap-[3px]" aria-hidden>
        {Array.from({ length: total }).map((_, i) => {
          const done = i < current - 1;
          const active = i === current - 1;
          return (
            <div
              key={i}
              className={cn(
                "h-2 flex-1 rounded-[3px]",
                done && "bg-jce-green-600",
                active && "bg-jce-orange-500",
                !done && !active && "bg-jce-line",
              )}
            />
          );
        })}
      </div>
      {statusLabel ? (
        <div className="mt-3 flex items-center gap-2 text-ui-12 text-jce-ink-2">
          <Chip tone={statusTone}>{statusLabel}</Chip>
          {stageLabel ? <span>{stageLabel}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
