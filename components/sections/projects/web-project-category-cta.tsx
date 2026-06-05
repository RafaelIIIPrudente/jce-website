import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/kit/web-reveal";
import { OmegaMark } from "@/components/sections/kit/web-omega-mark";
import { MagneticButton } from "@/components/sections/kit/web-magnetic-button";

// Projects category closing CTA — the electrified Ω-on-luminous-backdrop idiom,
// matching the About / Services closing CTAs (a pulsing Ω brand watermark behind
// the jce-backdrop glow, anime.js, frozen under reduced-motion). Extends that
// pattern with an optional outline secondary CTA beside the primary MagneticButton
// (the legacy CTABanner's secondary action). Page-scoped — kept separate from the
// shared WebCta (used by the index / FAQ / careers / news), so those stay
// unchanged. Mobile-first: both buttons go full-width and wrap; side-by-side from
// sm up.

export function WebProjectCategoryCta({
  eyebrow,
  heading,
  sub,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
}: {
  eyebrow: string;
  heading: string;
  sub: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  const hasSecondary = Boolean(secondaryLabel && secondaryHref);
  return (
    <section className="jce-backdrop relative isolate overflow-hidden">
      <span className="jce-glow-3" aria-hidden />
      <OmegaMark
        pulse
        strokeWidth={4}
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[clamp(260px,40vw,440px)] -translate-x-1/2 -translate-y-1/2 text-jce-cyan/10"
      />
      <div className="relative mx-auto w-full max-w-3xl px-5 py-20 text-center sm:py-24 md:py-28">
        <Reveal>
          <p className="kicker text-jce-cyan-deep">{eyebrow}</p>
          <h2 className="mt-3 text-[clamp(26px,4vw,42px)] leading-[1.05] font-bold tracking-[-0.02em] text-balance text-jce-ink">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-ui-16 text-pretty text-jce-ink-2 sm:text-ui-18">
            {sub}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <MagneticButton className="w-full sm:w-auto">
              <Button asChild size="lg" className="h-12 w-full px-7 sm:w-auto">
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
            </MagneticButton>
            {hasSecondary ? (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 w-full px-7 sm:w-auto"
              >
                <Link href={secondaryHref!}>{secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
