import { cn } from "@/lib/utils";

// Empty state (Foundations.html:205-208, 775-780) — used on every list/queue.
// The tinted gradient illustration tile keeps it on-brand on the backdrop.

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center px-6 py-8 text-center",
        className,
      )}
    >
      <div className="grid size-16 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--jce-green-50),var(--jce-orange-100))] text-jce-green-700">
        {icon}
      </div>
      <div className="mt-4 text-ui-14 font-semibold text-jce-ink">{title}</div>
      {description ? (
        <div className="mt-1.5 max-w-[40ch] text-ui-12 text-jce-ink-2">
          {description}
        </div>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
