import { CheckIcon, CircleIcon, XIcon } from "lucide-react";
import { Fragment } from "react";

import { cn } from "@/lib/utils";

// Sign-off chain — the ON-SCREEN approval status of a multi-party sign-off
// (e.g. Prepared → Verified → Approved). This is a status view only; the actual
// authorisation is an offline WET signature captured on the printed artifact
// (see PrintSignatureBlock). No in-app e-signing. Tag: Solid.

export type SignoffStatus = "approved" | "current" | "pending" | "rejected";
export type Signoff = { role: string; name?: string; status: SignoffStatus };

const NODE: Record<SignoffStatus, string> = {
  approved: "bg-[var(--st-success-bg)] text-[var(--st-success-ink)]",
  current: "bg-[var(--st-pending-bg)] text-[var(--st-pending-ink)]",
  pending: "bg-[var(--st-neutral-bg)] text-[var(--st-neutral-ink)]",
  rejected: "bg-[var(--st-danger-bg)] text-[var(--st-danger-ink)]",
};

export function SignOffChain({
  signoffs,
  className,
}: {
  signoffs: readonly Signoff[];
  className?: string;
}) {
  return (
    <div
      data-slot="sign-off-chain"
      className={cn("flex flex-wrap items-center gap-x-2 gap-y-3", className)}
    >
      {signoffs.map((s, i) => (
        <Fragment key={s.role}>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full",
                NODE[s.status],
              )}
            >
              {s.status === "approved" ? (
                <CheckIcon className="size-3.5" strokeWidth={3} aria-hidden />
              ) : s.status === "rejected" ? (
                <XIcon className="size-3.5" strokeWidth={3} aria-hidden />
              ) : (
                <CircleIcon className="size-2.5 fill-current" aria-hidden />
              )}
            </span>
            <div className="leading-tight">
              <div className="text-ui-12 font-semibold text-jce-ink">
                {s.role}
              </div>
              <div className="text-ui-12 text-jce-ink-2">{s.name ?? "—"}</div>
            </div>
          </div>
          {i < signoffs.length - 1 ? (
            <span className="h-px w-6 shrink-0 bg-jce-line" aria-hidden />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
