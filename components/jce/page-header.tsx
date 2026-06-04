import { cn } from "@/lib/utils";

// Page header — glass band with a mono kicker, title, and an actions slot
// (screens-core.jsx:326-338 `.page-head`/`.ph-title`/`.ph-actions`). Tag: Glass.

export function PageHeader({
  kicker,
  title,
  description,
  actions,
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "glass flex flex-wrap items-end justify-between gap-4 rounded-(--r-glass) px-5 py-4",
        className,
      )}
    >
      <div className="min-w-0">
        {kicker ? <div className="kicker">{kicker}</div> : null}
        <h1 className="mt-1 text-ui-22 font-bold tracking-tight text-balance text-jce-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-prose text-ui-13 text-jce-ink-2">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
