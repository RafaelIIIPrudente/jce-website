import Image from "next/image";

import { Reveal } from "@/components/sections/kit/web-reveal";
import { EnergizedCounter } from "@/components/sections/kit/web-energized-counter";
import { HOME_PROOF } from "@/lib/content/website";

// Home "Proof at scale" — a calm, photography-led proof band: a heading, the
// four corporate aerials as a strip, a current-trace divider, and the verified
// figures counting up. Server Component composing client leaves (Reveal fade-ups
// + EnergizedCounter count-up, both reduced-motion-safe). NOT pinned/sticky —
// every element is in normal flow and always visible (no scroll-gated content),
// so the section never reads as empty.

const CARD_CLASS =
  "rounded-(--r-glass) border border-jce-dark-line bg-jce-dark-2/70 p-4 text-left backdrop-blur-sm sm:p-5";

export function HomeProofScale() {
  return (
    <section className="dark-section circuit-field relative isolate overflow-hidden px-5 py-20 sm:py-24 md:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="max-w-[56ch]">
          <p className="kicker text-jce-cyan-bright">{HOME_PROOF.eyebrow}</p>
          <h2 className="mt-3 text-[clamp(24px,4vw,40px)] leading-[1.08] font-bold tracking-[-0.02em] text-balance text-jce-dark-ink">
            {HOME_PROOF.heading}
          </h2>
          <p className="mt-4 text-ui-16 text-pretty text-jce-dark-ink-2">
            {HOME_PROOF.intro}
          </p>
        </Reveal>

        {/* Proof aerials — a four-up strip of real corporate sites. */}
        <Reveal delay={0.06} className="mt-8 sm:mt-10">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOME_PROOF.images.map((image) => (
              <li
                key={image.img}
                className="relative aspect-4/3 overflow-hidden rounded-(--r-glass) border border-jce-dark-line"
              >
                <Image
                  src={image.img}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Current-trace divider — a static, full-width "current line". */}
        <svg
          viewBox="0 0 1200 80"
          fill="none"
          aria-hidden
          role="presentation"
          preserveAspectRatio="none"
          className="mt-10 h-8 w-full opacity-80 sm:mt-12"
        >
          <defs>
            <linearGradient id="proof-trace" x1="0" y1="0" x2="1" y2="0">
              <stop
                offset="0%"
                style={{ stopColor: "var(--current-trace-from)" }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "var(--current-trace-to)" }}
              />
            </linearGradient>
          </defs>
          <path
            d="M8 64 H320 a12 12 0 0 0 12 -12 V28 H640 a12 12 0 0 1 12 -12 V16 H1192"
            stroke="url(#proof-trace)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Verified figures — count up on view (reduced-motion → final value). */}
        <Reveal delay={0.06} className="mt-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {HOME_PROOF.stats.map((stat) => (
              <div key={stat.label} className={CARD_CLASS}>
                <div className="text-[clamp(26px,5vw,44px)] leading-none font-bold tracking-tight tabular-nums text-jce-dark-ink">
                  <EnergizedCounter
                    value={stat.value}
                    suffix={stat.suffix ?? ""}
                    grouping={stat.grouping ?? true}
                  />
                </div>
                <div className="mt-2 text-ui-14 font-semibold text-jce-cyan-bright">
                  {stat.label}
                </div>
                <div className="mt-1 text-ui-12 text-pretty text-jce-dark-ink-2">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
