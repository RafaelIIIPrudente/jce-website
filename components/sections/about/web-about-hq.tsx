import { Reveal } from "@/components/sections/kit/web-reveal";
import { CircuitReveal } from "@/components/sections/kit/web-circuit-reveal";
import { VoltageTag } from "@/components/sections/kit/web-voltage-tag";
import { AmbientVideo } from "@/components/sections/kit/web-ambient-video";
import { ABOUT } from "@/lib/content/website";

// "Who we are / our HQ" — the established-and-substantial beat. A light editorial
// band: the company statement + §9-SAFE fact chips beside a muted aerial orbit of
// the headquarters (AmbientVideo → static poster under reduced motion). The office
// still itself is the page hero, so it isn't repeated here (one next/image
// instance → no LCP src collision); this shows the same building from the air.
// Server component; AmbientVideo is the only client leaf.

export function AboutHQ() {
  const { hq } = ABOUT;
  return (
    <section className="px-5 py-16 sm:py-20 md:py-24">
      <div className="mx-auto w-full max-w-site">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <CircuitReveal lineClassName="text-jce-cyan" className="max-w-[48ch]">
            <p className="kicker text-jce-cyan-deep">{hq.eyebrow}</p>
            <h2 className="mt-2 text-heading-section font-bold tracking-[-0.02em] text-balance text-jce-ink">
              {hq.heading}
            </h2>
            <p className="mt-4 text-ui-16 text-pretty text-jce-ink-2">
              {hq.body}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {hq.facts.map((f) => (
                <VoltageTag key={f}>{f}</VoltageTag>
              ))}
            </div>
          </CircuitReveal>

          <Reveal delay={0.1}>
            <AmbientVideo
              src={hq.video.src}
              poster={hq.video.poster}
              posterAlt="Aerial orbit of the JC Electrofields headquarters in Valenzuela City — a glass-and-concrete building with a rooftop canopy and equipment yard"
              aspect="aspect-video"
              sizes="(min-width: 1024px) 48vw, 100vw"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
