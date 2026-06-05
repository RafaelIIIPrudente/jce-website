import { Skeleton } from "@/components/jce/skeleton";

// B6 · Quotation comparison — loading skeleton mirroring the premium record
// layout (back link → glass hero header → derived MetricCard strip → supplier
// ComparisonMatrix → event-stream Timeline). NO meter — Quotations has no
// part-of-a-whole headline. Static under prefers-reduced-motion.
export default function Loading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <Skeleton className="h-4 w-28" />

      <div className="glass rounded-(--r-glass) p-5">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-6 w-72 max-w-full" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-56 max-w-full" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-40" />
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

      <div className="solid overflow-hidden rounded-(--r-solid) p-0">
        <div className="border-b border-jce-line bg-(--table-head) p-3">
          <Skeleton className="h-4 w-full" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b border-jce-line p-3"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ml-auto h-4 w-20" />
          </div>
        ))}
      </div>

      <div className="solid rounded-(--r-solid) p-5">
        <Skeleton className="h-4 w-32" />
        <div className="mt-4 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
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
