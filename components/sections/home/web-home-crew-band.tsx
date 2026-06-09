import { Reveal } from "@/components/sections/kit/web-reveal";
import { HeroParallax } from "@/components/sections/kit/web-hero-parallax";
import { PhotoCard } from "@/components/sections/kit/web-photo-card";
import { HOME_CREW } from "@/lib/content/website";

// S1 "From the ground" crew band — the missing human layer. A LIGHT editorial
// section between a dark pinned section above and lighter sections below:
// kept bright and calm. A text column states the directly-employed-crew
// promise next to a 3:4 portrait cluster (PhotoCard, clean photo + circuit-
// trace border, no scrim), then a wide 16:9 team group shot spans the row.
// HeroParallax drifts the portrait cluster a few percent for subtle depth;
// Reveal staggers the fade-ups. All motion self-gates under reduced-motion.
// Server component — composes client leaves only. Below the fold → no priority.

export function HomeCrewBand() {
  const [first, second, third] = HOME_CREW.portraits;

  return (
    <section className="px-5 py-16 sm:py-20 md:py-24">
      <div className="mx-auto w-full max-w-site">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Text column */}
          <Reveal className="max-w-[46ch]">
            <p className="kicker text-jce-green-600">{HOME_CREW.eyebrow}</p>
            <h2 className="mt-2 text-[clamp(24px,3.6vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-jce-ink">
              {HOME_CREW.heading}
            </h2>
            <p className="mt-3 text-ui-16 text-pretty text-jce-ink-2">
              {HOME_CREW.body}
            </p>
          </Reveal>

          {/* Portrait cluster — 3:4 portraits, the first spanning taller so the
              trio reads as an editorial composition, not a flat row. Drifts on
              scroll for depth (parallax self-gates under reduced-motion). */}
          <HeroParallax distance="7%">
            <div className="grid grid-cols-2 gap-4">
              {first ? (
                <Reveal className="row-span-2">
                  <PhotoCard
                    src={first.img}
                    alt={first.alt}
                    aspect="aspect-[3/4]"
                    className="h-full"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                </Reveal>
              ) : null}
              {second ? (
                <Reveal delay={0.08}>
                  <PhotoCard
                    src={second.img}
                    alt={second.alt}
                    aspect="aspect-[3/4]"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                </Reveal>
              ) : null}
              {third ? (
                <Reveal delay={0.16}>
                  <PhotoCard
                    src={third.img}
                    alt={third.alt}
                    aspect="aspect-[3/4]"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                </Reveal>
              ) : null}
            </div>
          </HeroParallax>
        </div>

        {/* Wide team group shot — full container width, its own reveal */}
        <Reveal className="mt-8 lg:mt-12" delay={0.1}>
          <PhotoCard
            src={HOME_CREW.team.img}
            alt={HOME_CREW.team.alt}
            aspect="aspect-[2/1]"
            sizes="(min-width: 1280px) 1280px, 100vw"
          />
        </Reveal>
      </div>
    </section>
  );
}
