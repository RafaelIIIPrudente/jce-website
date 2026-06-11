import { Reveal } from "@/components/sections/kit/web-reveal";
import { CircuitReveal } from "@/components/sections/kit/web-circuit-reveal";
import { HeroParallax } from "@/components/sections/kit/web-hero-parallax";
import { PhotoCard } from "@/components/sections/kit/web-photo-card";
import { ABOUT } from "@/lib/content/website";

// "Our people" — the human layer: directly-employed crews. A text column states
// the in-house promise next to a 3:4 portrait cluster (editorial, not full-bleed),
// then a wide team-group shot spans the row. HeroParallax drifts the cluster a few
// percent for subtle depth; Reveal staggers the fade-ups; all motion self-gates
// under reduced motion. Server component composing client leaves.

export function AboutPeople() {
  const { people } = ABOUT;
  const [first, second, third] = people.portraits;

  return (
    <section className="px-5 py-16 sm:py-20 md:py-24">
      <div className="mx-auto w-full max-w-site">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <CircuitReveal lineClassName="text-jce-cyan" className="max-w-[46ch]">
            <p className="kicker text-jce-cyan-deep">{people.eyebrow}</p>
            <h2 className="mt-2 text-heading-section font-bold tracking-[-0.02em] text-balance text-jce-ink">
              {people.heading}
            </h2>
            <p className="mt-3 text-ui-16 text-pretty text-jce-ink-2">
              {people.body}
            </p>
          </CircuitReveal>

          {/* Portrait cluster — the first portrait spans two rows so the trio
              reads as an editorial composition, not a flat row. Drifts on scroll. */}
          <HeroParallax distance="7%">
            <div className="grid grid-cols-2 gap-4">
              {first ? (
                <Reveal className="row-span-2">
                  <PhotoCard
                    src={first.img}
                    alt={first.alt}
                    aspect="aspect-3/4"
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
                    aspect="aspect-3/4"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                </Reveal>
              ) : null}
              {third ? (
                <Reveal delay={0.16}>
                  <PhotoCard
                    src={third.img}
                    alt={third.alt}
                    aspect="aspect-3/4"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                </Reveal>
              ) : null}
            </div>
          </HeroParallax>
        </div>

        {/* Wide team-group shot — full container width, its own reveal */}
        <Reveal className="mt-8 lg:mt-12" delay={0.1}>
          <PhotoCard
            src={people.team.img}
            alt={people.team.alt}
            aspect="aspect-2/1"
            sizes="(min-width: 1280px) 1280px, 100vw"
          />
        </Reveal>
      </div>
    </section>
  );
}
