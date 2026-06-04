import { EnergizedCounter } from "@/components/sections/web-energized-counter";
import { STATS } from "@/lib/content/website";

// S2 stat band — the four corporate figures (STATS) as EnergizedCounters on a
// dark section (mirrors the home hero's strip for contrast against the light
// Mission/Vision panel above). Each STRING stat is parsed into a countable number
// plus its retained prefix/suffix — "230 kV" → count 230, keep " kV"; "124+" →
// count 124, keep "+"; "1997" → a year (no thousands grouping). Any value with no
// countable number renders statically. Counters fire once on view and SSR-render
// their final value (the widest box is reserved → no CLS); under reduced-motion
// the final value simply stays. Mobile-first: 2-up at 360px, 4-up from md.

type ParsedStat =
  | {
      kind: "count";
      value: number;
      prefix: string;
      suffix: string;
      grouping: boolean;
    }
  | { kind: "static"; text: string };

function parseStat(v: string): ParsedStat {
  const m = v.match(/^(\D*?)([\d,]+(?:\.\d+)?)(.*)$/);
  const digits = m?.[2];
  if (!digits) return { kind: "static", text: v };
  const value = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(value)) return { kind: "static", text: v };
  // Group thousands only when the source already did — keeps years (1997) bare.
  return {
    kind: "count",
    value,
    prefix: m[1] ?? "",
    suffix: m[3] ?? "",
    grouping: digits.includes(","),
  };
}

export function AboutStatBand() {
  return (
    <section className="dark-section circuit-field relative isolate overflow-hidden px-5 py-16 sm:py-20 md:py-24">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 md:grid-cols-4">
        {STATS.map((s) => {
          const p = parseStat(s.v);
          return (
            <div
              key={s.k}
              className="rounded-(--r-glass) border border-jce-dark-line bg-white/5 p-4 text-left backdrop-blur-sm sm:p-5"
            >
              <div className="text-[clamp(24px,4vw,34px)] leading-none font-bold tracking-tight text-jce-dark-ink">
                {p.kind === "count" ? (
                  <EnergizedCounter
                    value={p.value}
                    prefix={p.prefix}
                    suffix={p.suffix}
                    grouping={p.grouping}
                  />
                ) : (
                  <span className="tabular-nums">{p.text}</span>
                )}
              </div>
              <div className="mt-2 text-ui-12 text-jce-dark-ink-2">{s.k}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
