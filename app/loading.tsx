import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main
      className="flex flex-1 items-center justify-center p-6"
      aria-busy="true"
      aria-live="polite"
    >
      <Loader2
        className="text-muted-foreground size-8 animate-spin"
        aria-hidden="true"
      />
      <span className="sr-only">Loading…</span>
    </main>
  );
}
