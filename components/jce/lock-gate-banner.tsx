import { CircleIcon, ClockIcon, LockIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Lock-gate banner (`.lockbar`, Foundations.html:157-161,660-666) — the document
// lifecycle made loud: Draft → For Checking → Locked. A locked document must look
// immutable. Used on W4-W6 and locked periods (P8, A5). Tag: Solid.

export type LockState = "draft" | "check" | "locked";

const STATE = {
  draft: {
    color: "var(--st-neutral)",
    Icon: CircleIcon,
    title: "Draft",
  },
  check: {
    color: "var(--st-pending)",
    Icon: ClockIcon,
    title: "For Checking",
  },
  locked: {
    color: "var(--st-locked)",
    Icon: LockIcon,
    title: "Locked",
  },
} satisfies Record<
  LockState,
  { color: string; Icon: typeof LockIcon; title: string }
>;

export function LockGateBanner({
  state,
  title,
  detail,
  className,
}: {
  state: LockState;
  title?: string;
  detail?: string;
  className?: string;
}) {
  const cfg = STATE[state];
  const Icon = cfg.Icon;
  return (
    <div
      data-slot="lock-gate-banner"
      data-state={state}
      style={{ borderLeftColor: cfg.color }}
      className={cn(
        "flex items-center gap-3 rounded-[10px] border border-jce-line border-l-4 bg-card px-4 py-3",
        className,
      )}
    >
      <Icon
        className="size-4 shrink-0"
        style={{ color: cfg.color }}
        strokeWidth={2}
        aria-hidden
      />
      <div className="min-w-0">
        <div className="text-ui-13 font-bold text-jce-ink">
          {title ?? cfg.title}
        </div>
        {detail ? (
          <div className="text-ui-12 text-jce-ink-2">{detail}</div>
        ) : null}
      </div>
    </div>
  );
}
