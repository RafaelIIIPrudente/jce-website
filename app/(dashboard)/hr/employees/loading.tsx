import { Skeleton } from "@/components/jce/skeleton";

// H1 · Employees — loading skeleton (header band → count KPI strip → toolbar →
// category section bands over a ledger). Streamed via Suspense; the shimmer
// collapses to a static block under prefers-reduced-motion.
export default function Loading() {
  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <div className="glass rounded-(--r-glass) px-5 py-4">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-2 h-6 w-40" />
        <Skeleton className="mt-2 h-3 w-80 max-w-full" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-(--r-glass) p-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-2 h-7 w-12" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-11 w-full max-w-sm rounded-(--r-input)" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-11 w-40 rounded-(--r-input)" />
          <Skeleton className="h-11 w-40 rounded-(--r-input)" />
          <Skeleton className="h-11 w-28 rounded-(--r-solid)" />
        </div>
      </div>

      {Array.from({ length: 2 }).map((_, s) => (
        <div key={s} className="flex flex-col gap-2">
          <Skeleton className="h-11 w-full rounded-(--r-glass)" />
          <div className="solid overflow-hidden rounded-(--r-solid) p-0">
            <div className="border-b border-jce-line bg-(--table-head) p-3">
              <Skeleton className="h-4 w-full" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 border-b border-jce-line p-3"
              >
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="ml-auto h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
