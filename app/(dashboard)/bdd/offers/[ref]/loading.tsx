import { Skeleton } from "@/components/jce/skeleton";

// B4 · Offer record — loading skeleton mirroring the premium record layout
// (back link → glass hero header → derived current-state MetricCard strip →
// event-stream Timeline). NO meter — offers have no part-of-a-whole ratio.
// Static under prefers-reduced-motion.
export default function Loading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <Skeleton className="h-4 w-24" />

      <div className="glass rounded-(--r-glass) p-5">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-6 w-72 max-w-full" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-56 max-w-full" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-44" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="solid rounded-(--r-solid) p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-6 w-28" />
          </div>
        ))}
      </div>

      <div className="solid rounded-(--r-solid) p-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-3 w-64 max-w-full" />
        <div className="mt-4 flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="mt-1 size-2.5 shrink-0 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-56 max-w-full" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
