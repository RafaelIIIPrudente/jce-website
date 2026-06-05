import { Skeleton } from "@/components/jce/skeleton";

// B7–B9 · Website CMS — register loading skeleton (header band → publish-state
// KPI strip → toolbar → tabs → card rows). Streamed via Suspense; the shimmer
// collapses to a static block under prefers-reduced-motion.
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
            <Skeleton className="mt-2 h-7 w-16" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-11 w-full max-w-sm rounded-(--r-input)" />
        <Skeleton className="h-11 w-28 rounded-(--r-solid)" />
      </div>

      <Skeleton className="h-11 w-full rounded-lg sm:w-72" />

      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="solid flex items-center gap-3 rounded-(--r-solid) p-4"
          >
            <Skeleton className="size-12 shrink-0 rounded-(--r-input)" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-40 max-w-full" />
              <Skeleton className="mt-2 h-3 w-64 max-w-full" />
            </div>
            <Skeleton className="hidden h-9 w-40 shrink-0 rounded-(--r-input) sm:block" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-3 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-11 w-20 rounded-(--r-solid)" />
          <Skeleton className="h-11 w-20 rounded-(--r-solid)" />
        </div>
      </div>
    </div>
  );
}
