import { cn } from "@/lib/utils";

import { DocChip } from "@/components/jce/doc-chip";

// Approval queue item (Foundations.html:669-680, screens-core.jsx:245-254) —
// glass card wrapping a doc-chip, summary, amount and an actions slot. The
// actions (Approve/Hold) are passed in so callers can RENDER them conditionally
// by RBAC (verbs are absent, not disabled). Used on U12, X3. Tag: Glass.

export function ApprovalQueueItem({
  doc,
  title,
  meta,
  amount,
  actions,
  className,
}: {
  doc: string;
  title: React.ReactNode;
  meta?: string;
  amount?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="approval-queue-item"
      className={cn(
        "glass flex flex-wrap items-center gap-3 rounded-(--r-glass) px-4 py-3",
        className,
      )}
    >
      <DocChip code={doc} />
      <div className="min-w-40 flex-1">
        <div className="text-ui-13 font-semibold text-jce-ink">{title}</div>
        {meta ? <div className="text-ui-12 text-jce-ink-2">{meta}</div> : null}
      </div>
      {amount != null ? (
        <div className="font-mono text-ui-14 font-bold tabular-nums text-jce-ink">
          {amount}
        </div>
      ) : null}
      {actions ? (
        <div className="flex items-center gap-1.5">{actions}</div>
      ) : null}
    </div>
  );
}
