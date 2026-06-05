import { Skeleton } from "@/components/jce/skeleton";

// B11 · BDD audit log — register loading skeleton (header band → KPI strip →
// toolbar → audit rows), mirroring the canonical SO register loading. Streamed
// via Suspense; the shimmer collapses to a static block under prefers-reduced-motion.
export default function Loading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <div className="glass rounded-(--r-glass) px-5 py-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-6 w-40" />
        <Skeleton className="mt-2 h-3 w-80 max-w-full" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-(--r-glass) p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-7 w-12" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Skeleton className="h-11 w-full rounded-(--r-input) lg:max-w-sm" />
        <Skeleton className="h-11 w-full rounded-(--r-input) lg:w-72" />
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
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="ml-auto h-4 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
}
