import { Skeleton } from "@/components/jce/skeleton";

// HR dashboard — loading skeleton mirroring the overview layout (header band →
// KPI strip → attention panel → composition → quick actions → recent activity).
// Streamed via Suspense; the shimmer collapses to a static block under
// prefers-reduced-motion.
export default function Loading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <div className="glass rounded-(--r-glass) px-5 py-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-6 w-20" />
        <Skeleton className="mt-2 h-3 w-80 max-w-full" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-(--r-glass) p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-7 w-12" />
            <Skeleton className="mt-2 h-3 w-16" />
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass rounded-(--r-glass) p-4">
            <Skeleton className="h-4 w-32" />
            <div className="mt-3 flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-10 w-full rounded-(--r-solid)" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="solid rounded-(--r-solid) p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-6 w-12" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-(--r-glass)" />
        ))}
      </div>
    </div>
  );
}
