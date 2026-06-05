import { Skeleton } from "@/components/jce/skeleton";

// B2 · Sales Order record — loading skeleton mirroring the premium record layout
// (back link → glass hero header → billed-vs-contract meter → derived metric
// strip). Static under prefers-reduced-motion.
export default function Loading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <Skeleton className="h-4 w-28" />

      <div className="glass rounded-(--r-glass) p-5">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-3 w-56" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-44" />
          </div>
        </div>
      </div>

      <div className="solid rounded-(--r-solid) p-5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-3 h-2.5 w-full rounded-full" />
        <Skeleton className="mt-3 h-3 w-full" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="solid rounded-(--r-solid) p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-6 w-28" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
