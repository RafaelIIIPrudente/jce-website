import { cn } from "@/lib/utils";

// Section divider with a faint cyan current travelling along a hairline. Pure CSS
// (.current-divider) — no JS; the travel animation freezes to a clean hairline
// under prefers-reduced-motion. Decorative: aria-hidden. tone="dark" for the
// near-black sections.

export function ElectrifiedDivider({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      role="presentation"
      aria-hidden
      className={cn(
        "current-divider",
        tone === "dark" && "current-divider-dark",
        className,
      )}
    />
  );
}
