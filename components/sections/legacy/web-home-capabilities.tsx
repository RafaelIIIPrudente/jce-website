import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Reveal } from "@/components/sections/kit/web-reveal";
import { CircuitReveal } from "@/components/sections/kit/web-circuit-reveal";
import { PhotoCard } from "@/components/sections/kit/web-photo-card";

// QUARANTINED — the former home "What we do" PhotoCard grid, replaced by the
// orbital CapabilityOrbit. Its content (formerly HOME_CAPABILITIES + the
// CapabilityCard type in lib/content/website.ts) is inlined below so this file
// is self-contained and the live content file carries no orphaned export. Not
// imported by any route. The heading traces in (CircuitReveal); cards fade up
// staggered (Reveal). Photographic alts; the card chrome is decorative.

type CapabilityCard = {
  name: string;
  spec: string;
  img: string;
  href: string;
};

const HOME_CAPABILITIES: readonly CapabilityCard[] = [
  {
    name: "Substations to 230 kV",
    spec: "Design–build EPC",
    img: "/home/substation-transformer-mountains.webp",
    href: "/services",
  },
  {
    name: "Transmission & Distribution Lines",
    spec: "Switchyard & line work",
    img: "/home/distribution-line-bucket-truck-aerial.webp",
    href: "/services",
  },
  {
    name: "Solar PV / Renewables",
    spec: "Utility & C&I scale",
    img: "/home/solar-farm-rows-aerial.webp",
    href: "/services",
  },
  {
    name: "Testing & Commissioning",
    spec: "Energization-ready",
    img: "/home/substation-shenda-transformer-engineer.webp",
    href: "/services",
  },
  {
    name: "Switchgear HVSG/MVSG/LVSG",
    spec: "Supply & integration",
    img: "/home/substation-topdown-aerial.webp",
    href: "/products",
  },
  {
    name: "NGCP Direct Connection",
    spec: "Application → energization",
    img: "/home/substation-ricefield-aerial.webp",
    href: "/services",
  },
] as const;

export function HomeCapabilities() {
  return (
    <section className="px-5 py-16 sm:py-20 md:py-24">
      <div className="mx-auto w-full max-w-site">
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
