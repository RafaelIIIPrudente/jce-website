import { Skeleton } from "@/components/jce/skeleton";

// H5b · Import wizard — loading skeleton (header → stepper → drop zone → template
// builder). Static under prefers-reduced-motion.
export default function Loading() {
  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <div className="glass rounded-(--r-glass) px-5 py-4">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-2 h-6 w-52" />
        <Skeleton className="mt-2 h-3 w-80 max-w-full" />
      </div>

      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-24 rounded-(--r-input)" />
        ))}
      </div>

      <Skeleton className="h-40 w-full rounded-(--r-glass)" />

      <div className="glass flex flex-col gap-3 rounded-(--r-glass) p-4">
        <Skeleton className="h-4 w-56" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-11 w-full rounded-(--r-input) sm:max-w-xs" />
          <Skeleton className="h-11 w-full rounded-(--r-input) sm:w-40" />
          <Skeleton className="h-11 w-full rounded-(--r-input) sm:w-40" />
          <Skeleton className="h-11 w-44 rounded-(--r-solid)" />
        </div>
      </div>
    </div>
  );
}
