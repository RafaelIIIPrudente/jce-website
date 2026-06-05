import { CircuitReveal } from "@/components/sections/kit/web-circuit-reveal";
import { Reveal } from "@/components/sections/kit/web-reveal";
import { PhotoCard } from "@/components/sections/kit/web-photo-card";
import { VoltageTag } from "@/components/sections/kit/web-voltage-tag";
import { PRODUCT_EQUIPMENT } from "@/lib/content/website";

// S5 equipment band — real JCE equipment photography (extracted & cleaned from the
// company profile) on a dark section: the Shenda Electric transformer line, MV
// switchgear, a 230 kV capacitor bank, and NGCP protection panels. It gives the
// otherwise photo-less Products page genuine documentary imagery where it's
// strong, without forcing a photo onto every spec card. Mobile-first 1 → 2(sm) →
// 4(lg) grid; PhotoCard reserves its aspect (no CLS); reveals settle under
// reduced-motion. No priority image here → no next/image LCP src collision.

export function ProductsEquipment() {
  return (
    <section className="dark-section circuit-field relative isolate overflow-hidden px-5 py-16 sm:py-20 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <CircuitReveal
          lineClassName="text-jce-cyan"
          className="mb-8 max-w-[56ch] md:mb-10"
        >
          <p className="kicker text-jce-cyan-bright">In the field</p>
          <h2 className="mt-2 text-[clamp(24px,3.6vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-jce-dark-ink">
            Equipment we supply &amp; integrate.
          </h2>
          <p className="mt-3 text-ui-16 text-pretty text-jce-dark-ink-2">
            As the exclusive Philippine distributor of Shenda Electric power
            transformers — supplied, installed and energized on JCE projects
            nationwide.
          </p>
        </CircuitReveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCT_EQUIPMENT.map((e, i) => (
            <Reveal key={e.img} delay={Math.min(i * 0.05, 0.2)}>
              <PhotoCard
                src={e.img}
                alt={`${e.name} supplied and integrated by JC Electrofields`}
                aspect="aspect-[4/3]"
                tone="dark"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              >
                <VoltageTag tone="dark" className="mb-2 self-start">
                  {e.tag}
                </VoltageTag>
                <div className="text-ui-14 font-semibold text-pretty text-jce-dark-ink">
                  {e.name}
                </div>
              </PhotoCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
