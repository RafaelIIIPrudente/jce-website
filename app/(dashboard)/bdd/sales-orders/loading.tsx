import { Skeleton } from "@/components/jce/skeleton";

// B1 · Sales Orders — register loading skeleton (the canonical register loading
// treatment: header band → KPI strip → toolbar → ledger rows). Streamed via
// Suspense; the shimmer collapses to a static block under prefers-reduced-motion.
export default function Loading() {
  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <div className="glass rounded-(--r-glass) px-5 py-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-6 w-48" />
        <Skeleton className="mt-2 h-3 w-80 max-w-full" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-(--r-glass) p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-7 w-24" />
            <Skeleton className="mt-2 h-3 w-16" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-11 w-full max-w-sm rounded-(--r-input)" />
        <Skeleton className="h-11 w-28 rounded-(--r-solid)" />
      </div>

      <div className="solid overflow-hidden rounded-(--r-solid) p-0">
        <div className="border-b border-jce-line bg-(--table-head) p-3">
          <Skeleton className="h-4 w-full" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b border-jce-line p-3"
          >
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="ml-auto h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
