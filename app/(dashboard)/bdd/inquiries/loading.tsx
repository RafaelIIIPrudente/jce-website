import { Skeleton } from "@/components/jce/skeleton";

// B10 · Inquiries inbox — loading skeleton mirroring the premium layout (header
// band → lead-pipeline KPI strip → search + status filter → master list ↔ detail
// pane). Streamed via Suspense; the shimmer collapses to a static block under
// prefers-reduced-motion.
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
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-7 w-12" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-11 w-full max-w-sm rounded-(--r-input)" />
        <Skeleton className="h-9 w-72 max-w-full rounded-[10px]" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className="solid divide-y divide-jce-line overflow-hidden rounded-(--r-solid) p-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-40 max-w-full" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>

        <div className="solid flex flex-col gap-5 rounded-(--r-solid) p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-3 w-56 max-w-full" />
            </div>
            <Skeleton className="h-11 w-40 rounded-(--r-solid)" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
          <Skeleton className="h-4 w-64 max-w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
}
