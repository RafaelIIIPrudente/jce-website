import { Skeleton } from "@/components/jce/skeleton";

// H6 · Verification batches — register loading skeleton (header band → KPI strip
// → search/status toolbar → ledger rows). Streamed via Suspense; the shimmer
// collapses to a static block under prefers-reduced-motion.
export default function Loading() {
  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <div className="glass rounded-(--r-glass) px-5 py-4">
        <Skeleton className="h-3 w-28" />
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
        <Skeleton className="h-11 w-full rounded-(--r-input) sm:w-44" />
      </div>

      <div className="solid overflow-hidden rounded-(--r-solid) p-0">
        <div className="border-b border-jce-line bg-(--table-head) p-3">
          <Skeleton className="h-4 w-full" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b border-jce-line p-3"
          >
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="ml-auto h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
