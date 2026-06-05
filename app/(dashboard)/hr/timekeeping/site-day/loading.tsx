import { Skeleton } from "@/components/jce/skeleton";

// H5b · Site Day Sheet — loading skeleton (header → recording-context card → KPI
// strip → ~10 roster rows). Static under prefers-reduced-motion.
export default function Loading() {
  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <div className="glass rounded-(--r-glass) px-5 py-4">
        <Skeleton className="h-3 w-44" />
        <Skeleton className="mt-2 h-6 w-48" />
        <Skeleton className="mt-2 h-3 w-80 max-w-full" />
      </div>

      <div className="glass flex flex-col gap-3 rounded-(--r-glass) p-4 lg:flex-row">
        <Skeleton className="h-11 w-full rounded-(--r-input) lg:max-w-xs" />
        <Skeleton className="h-11 w-full rounded-(--r-input) lg:w-48" />
        <Skeleton className="h-11 w-full rounded-(--r-input) lg:w-56" />
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

      <div className="solid overflow-hidden rounded-(--r-solid) p-0">
        <div className="border-b border-jce-line bg-(--table-head) p-3">
          <Skeleton className="h-4 w-full" />
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b border-jce-line p-3"
          >
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="ml-auto h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
