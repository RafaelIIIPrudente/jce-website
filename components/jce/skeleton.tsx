import { cn } from "@/lib/utils";

// Skeleton loader (Foundations.html:210-212). Token-driven shimmer; the
// `jce-shimmer` keyframe is defined in globals.css and collapsed under
// prefers-reduced-motion. No `ui/skeleton` exists, so this is the canonical one.

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "animate-[jce-shimmer_1.4s_infinite] rounded-md bg-[length:200%_100%] bg-[linear-gradient(90deg,var(--jce-line)_25%,var(--table-zebra)_50%,var(--jce-line)_75%)]",
        className,
      )}
    />
  );
}
