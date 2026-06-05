import { Skeleton } from "@/components/jce/skeleton";

// H7 · HR Requests register — loading skeleton (header → KPI strip → toolbar →
// type Segmented → grid rows → pager). Static under prefers-reduced-motion.
export default function Loading() {
  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <div className="glass rounded-(--r-glass) px-5 py-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-2 h-6 w-56" />
        <Skeleton className="mt-2 h-3 w-80 max-w-full" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-(--r-glass) p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-7 w-12" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-11 w-full rounded-(--r-input) sm:max-w-sm" />
        <div className="flex gap-3">
          <Skeleton className="h-11 w-44 rounded-(--r-input)" />
          <Skeleton className="h-11 w-32 rounded-(--r-solid)" />
        </div>
      </div>

      <Skeleton className="h-11 w-full rounded-lg" />

      <div className="solid overflow-hidden rounded-(--r-solid)">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b border-jce-line px-4 py-3 last:border-0"
          >
            <Skeleton className="h-5 w-28 shrink-0" />
            <Skeleton className="hidden h-4 w-24 sm:block" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="hidden h-5 w-20 shrink-0 sm:block" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-3 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-11 w-20 rounded-(--r-solid)" />
          <Skeleton className="h-11 w-20 rounded-(--r-solid)" />
        </div>
      </div>
    </div>
  );
}
