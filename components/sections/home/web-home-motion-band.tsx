import Image from "next/image";

import { Reveal } from "@/components/sections/kit/web-reveal";
import { CircuitReveal } from "@/components/sections/kit/web-circuit-reveal";
import { PhotoCard } from "@/components/sections/kit/web-photo-card";
import { VoltageTag } from "@/components/sections/kit/web-voltage-tag";

// S1 "engineering in motion" dark band — a darkened night transformer-lift
// backdrop (decorative) with the live-switchyard work as a foreground PhotoCard.
// The copy energizes line by line: heading traces in (CircuitReveal), paragraphs
// fade up staggered (Reveal). Contrast: near-white ink on near-black → AA.

export function HomeMotionBand() {
  return (
    <section className="dark-section circuit-field relative isolate overflow-hidden px-5 py-20 sm:py-24 md:py-28">
      <Image
        src="/projects/night-buseco.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-25"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-r from-jce-dark via-jce-dark/85 to-jce-dark/55"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <CircuitReveal lineClassName="text-jce-cyan">
            <p className="kicker text-jce-cyan-bright">On site, after dark</p>
            <h2 className="mt-2 text-[clamp(26px,4vw,42px)] leading-[1.08] font-bold tracking-[-0.02em] text-balance text-jce-dark-ink">
              Engineering in motion
            </h2>
          </CircuitReveal>
          <Reveal delay={0.12}>
            <p className="mt-4 max-w-[52ch] text-ui-16 text-pretty text-jce-dark-ink-2 sm:text-ui-18">
              Night transformer lifts. Live switchyard work. Crews mobilized
              across Luzon, Visayas and Mindanao — energizing on the dates we
              commit to.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-3 max-w-[52ch] text-ui-14 text-pretty text-jce-dark-ink-2">
              Single-vendor accountability from study to handover, with
              124+&nbsp;engineers and technicians under one roof.
            </p>
          </Reveal>
          <Reveal delay={0.28}>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <VoltageTag tone="dark">Up to 230 kV</VoltageTag>
              <VoltageTag tone="dark">300 MVA</VoltageTag>
              <VoltageTag tone="dark">Since 1997</VoltageTag>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <PhotoCard
            src="/projects/switchyard-bauang.webp"
            alt="JC Electrofields crews performing live switchyard assembly at the Bauang 230/69 kV substation"
            aspect="aspect-[4/5]"
            tone="dark"
            sizes="(min-width: 768px) 44vw, 100vw"
          >
            <VoltageTag tone="dark" className="mb-2 self-start">
              100 MVA · 230/69 kV
            </VoltageTag>
            <div className="text-ui-14 font-semibold text-jce-dark-ink">
              Bauang Switchyard — Luzon Grid Expansion
            </div>
          </PhotoCard>
        </Reveal>
      </div>
    </section>
  );
}
