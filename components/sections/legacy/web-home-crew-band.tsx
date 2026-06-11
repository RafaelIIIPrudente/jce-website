import { Reveal } from "@/components/sections/kit/web-reveal";
import { HeroParallax } from "@/components/sections/kit/web-hero-parallax";
import { PhotoCard } from "@/components/sections/kit/web-photo-card";

// QUARANTINED (2026-06-09) — removed from the home page. The "From the ground"
// crew/people band. Kept here for potential reuse; its content (formerly
// HOME_CREW in lib/content/website.ts) is inlined below so this file is
// self-contained and no longer references removed exports. Not imported by any
// route. The original was a thin server section composing the kit client leaves.

const HOME_CREW = {
  eyebrow: "From the ground",
  heading: "Executed by our own crews.",
  body: "No subcontracted shortcuts. Our directly-employed engineers, linemen and technicians build, test and energize every project — the same hands from foundation to handover.",
  portraits: [
    {
      img: "/home/crew-rebar-cage-trench-portrait.jpg",
      alt: "JC Electrofields worker tying a steel rebar cage inside a deep foundation trench",
    },
    {
      img: "/home/crew-rebar-column-portrait.jpg",
      alt: "JC Electrofields crew member at a rebar column in an excavated foundation trench",
    },
    {
      img: "/home/crew-team-hauling-buckets-portrait.jpg",
      alt: "JC Electrofields crew hauling buckets in line, the company logo on their uniforms",
    },
  ],
  team: {
    img: "/home/team-group-substation.jpg",
    alt: "The JC Electrofields team in a group photo in front of an energized substation",
  },
} as const;

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
