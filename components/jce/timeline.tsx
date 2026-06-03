import { cn } from "@/lib/utils";

// Timeline / event feed (`.timeline`, Foundations.html:191-198,716-726). Records'
// History tabs, B4 offer event stream, P12. Event streams are append-only — they
// never edit, only append (hard rule: lifecycle-as-first-class). Tag: Solid.

export type TimelineEvent = {
  title: React.ReactNode;
  meta: string;
  /** dot accent — green (default), orange (a sensitive edit), or ink (immutable) */
  tone?: "green" | "orange" | "ink";
};

const DOT: Record<NonNullable<TimelineEvent["tone"]>, string> = {
  green: "bg-jce-green-600",
  orange: "bg-jce-orange-500",
  ink: "bg-jce-ink-2",
};

export function Timeline({
  events,
  className,
}: {
  events: readonly TimelineEvent[];
  className?: string;
}) {
  return (
    <div data-slot="timeline" className={cn("flex flex-col", className)}>
      {events.map((e, i) => {
        const last = i === events.length - 1;
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-1.5 size-2.5 shrink-0 rounded-full",
                  DOT[e.tone ?? "green"],
                )}
              />
              {!last ? <span className="w-0.5 flex-1 bg-jce-line" /> : null}
            </div>
            <div className={cn(!last && "pb-3.5")}>
              <div className="text-ui-13 font-semibold text-jce-ink">
                {e.title}
              </div>
              <div className="text-ui-12 text-jce-ink-2">{e.meta}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
