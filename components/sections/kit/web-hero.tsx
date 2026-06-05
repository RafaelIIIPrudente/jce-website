import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/kit/web-reveal";
import { MagneticButton } from "@/components/sections/kit/web-magnetic-button";
import type { Stat } from "@/lib/content/website";

// Website hero (web-pages-a.jsx:13-46 home · :327-337 inner). Sits on the
// luminous .jce-backdrop glow. Inter display type with a green accent span; the
// home variant adds the 4-tile glass stat strip. Mobile-first: h1 clamps to
// ~30px at the 560px stage. Tag: Glass chrome over backdrop.

type HeroCta = { href: string; label: string };

export function WebHero({
  eyebrow,
  title,
  sub,
  primary,
  secondary,
  stats,
  size = "inner",
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  primary?: HeroCta;
  secondary?: HeroCta;
  stats?: readonly Stat[];
  size?: "home" | "inner";
}) {
  const home = size === "home";
  return (
    <section className="jce-backdrop relative isolate overflow-hidden">
      <span className="jce-glow-3" aria-hidden />
      <div
        className={cn(
          "mx-auto w-full max-w-6xl px-5",
          home
            ? "py-20 text-center sm:py-28 md:py-36"
            : "py-16 sm:py-20 md:py-24",
        )}
      >
        <Reveal>
          <p className="kicker text-jce-green-600">{eyebrow}</p>
          <h1
            className={cn(
              "mt-3 font-bold tracking-[-0.02em] text-balance text-jce-ink",
              home
                ? "mx-auto max-w-[18ch] text-[clamp(30px,6vw,64px)] leading-[1.04]"
                : "max-w-[20ch] text-[clamp(28px,5vw,44px)] leading-[1.1]",
            )}
          >
            {title}
          </h1>
          {sub ? (
            <p
              className={cn(
                "mt-5 text-ui-16 text-pretty text-jce-ink-2 sm:text-ui-18",
                home ? "mx-auto max-w-[58ch]" : "max-w-[60ch]",
              )}
            >
              {sub}
            </p>
          ) : null}
          {primary || secondary ? (
            <div
              className={cn(
                "mt-7 flex flex-wrap gap-3",
                home && "justify-center",
              )}
            >
              {primary ? (
                <MagneticButton>
                  <Button asChild size="lg" className="h-12 px-6 text-ui-14">
                    <Link href={primary.href}>{primary.label}</Link>
                  </Button>
                </MagneticButton>
              ) : null}
              {secondary ? (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 text-ui-14"
                >
                  <Link href={secondary.href}>{secondary.label}</Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </Reveal>

        {stats ? (
          <Reveal delay={0.1} className="mt-12 md:mt-14">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.k}
                  className="glass rounded-(--r-glass) p-4 text-left"
                >
                  <div className="text-[clamp(22px,4vw,34px)] leading-none font-bold tracking-tight tabular-nums text-jce-ink">
                    {s.v}
                  </div>
                  <div className="mt-1.5 text-ui-12 text-jce-ink-2">{s.k}</div>
                </div>
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
