"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Stepper, type Step } from "@/components/jce/stepper";

// Wizard with a guarded commit (P3 BOQ wizard, create flows). Steps advance only
// when `canAdvance` holds; the final Commit is gated the same way and, once
// committed, the chain renders locked (immutable). Tag: Glass rail / solid body.

export type WizardStep = {
  title: string;
  description?: string;
  content: React.ReactNode;
  /** gate — Next/Commit is disabled until true (default true) */
  canAdvance?: boolean;
};

export function Wizard({
  steps,
  onCommit,
  commitLabel = "Commit",
  className,
}: {
  steps: readonly WizardStep[];
  onCommit?: () => void;
  commitLabel?: string;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [committed, setCommitted] = useState(false);
  const current = steps[active];
  const last = active === steps.length - 1;
  const canAdvance = current?.canAdvance ?? true;

  const stepperSteps: Step[] = steps.map((s, i) => ({
    label: s.title,
    sub: s.description,
    state: committed
      ? "locked"
      : i < active
        ? "done"
        : i === active
          ? "current"
          : "todo",
  }));

  return (
    <div className={cn("grid gap-5 md:grid-cols-[220px_1fr]", className)}>
      <div className="solid p-4">
        <Stepper steps={stepperSteps} />
      </div>
      <div className="solid flex flex-col p-4">
        {committed ? (
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-[var(--st-success-bg)] text-[var(--st-success-ink)]">
              <CheckIcon className="size-6" strokeWidth={2.5} aria-hidden />
            </span>
            <div className="mt-3 text-ui-16 font-semibold text-jce-ink">
              Committed
            </div>
            <div className="mt-1 text-ui-12 text-jce-ink-2">
              The record is created and the wizard chain is now locked.
            </div>
          </div>
        ) : (
          <>
            <div className="text-ui-16 font-semibold text-jce-ink">
              {current?.title}
            </div>
            {current?.description ? (
              <div className="mt-0.5 text-ui-12 text-jce-ink-2">
                {current.description}
              </div>
            ) : null}
            <div className="mt-3 flex-1">{current?.content}</div>
            <div className="mt-4 flex justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActive((a) => Math.max(0, a - 1))}
                disabled={active === 0}
              >
                Back
              </Button>
              {last ? (
                <Button
                  variant="approve"
                  size="sm"
                  disabled={!canAdvance}
                  onClick={() => {
                    setCommitted(true);
                    onCommit?.();
                  }}
                >
                  {commitLabel}
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={!canAdvance}
                  onClick={() =>
                    setActive((a) => Math.min(steps.length - 1, a + 1))
                  }
                >
                  Next
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
