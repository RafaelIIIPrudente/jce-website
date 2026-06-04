import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Reveal } from "@/components/sections/web-reveal";
import { CircuitReveal } from "@/components/sections/web-circuit-reveal";
import { PhotoCard } from "@/components/sections/web-photo-card";
import { HOME_CAPABILITIES } from "@/lib/content/website";

// S1 capability band — six EPC capabilities backed by real cropped textures
// (PhotoCard, circuit-trace border + hover glow). The heading traces in
// (CircuitReveal); cards fade up staggered (Reveal). Photographic alts; the
// card chrome is decorative.

export function HomeCapabilities() {
  return (
    <section className="px-5 py-16 sm:py-20 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <CircuitReveal className="mb-8 max-w-[44ch] md:mb-10">
          <p className="kicker text-jce-green-600">What we do</p>
          <h2 className="mt-2 text-[clamp(24px,3.6vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-jce-ink">
            Full-scope power engineering
          </h2>
          <p className="mt-3 text-ui-16 text-pretty text-jce-ink-2">
            Substations, transmission, switchgear and renewables — single-vendor
            EPC from study to energization, up to 230&nbsp;kV.
          </p>
        </CircuitReveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_CAPABILITIES.map((c, i) => (
            <Reveal key={c.name} delay={Math.min(i * 0.05, 0.25)}>
              <Link
                href={c.href}
                className="focus-ring-jce group/cap block rounded-(--r-glass)"
              >
                <PhotoCard
                  src={c.img}
                  alt={`${c.name} — JC Electrofields power-systems capability`}
                  aspect="aspect-[4/3]"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                >
                  <div className="text-ui-16 leading-snug font-semibold text-jce-dark-ink">
                    {c.name}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-ui-12 font-medium text-jce-cyan-bright">
                    {c.spec}
                    <ArrowRightIcon
                      className="size-3.5 transition-transform duration-200 group-hover/cap:translate-x-0.5"
                      aria-hidden
                    />
                  </div>
                </PhotoCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
