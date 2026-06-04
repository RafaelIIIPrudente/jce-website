import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/web-reveal";
import { MagneticButton } from "@/components/sections/web-magnetic-button";
import { OmegaMark } from "@/components/sections/web-omega-mark";
import { TAGLINE } from "@/lib/content/website";

// S1 closing CTA — the Ω (ohms) brand motif as a faint pulsing watermark behind,
// a small Ω accent above the heading, the verbatim tagline as the sub, and the
// primary "Request a consultation" CTA (MagneticButton). On the luminous
// backdrop; the watermark pulse freezes under reduced-motion.

export function HomeCta() {
  return (
    <section className="jce-backdrop relative isolate overflow-hidden">
      <span className="jce-glow-3" aria-hidden />
      <OmegaMark
        pulse
        strokeWidth={4}
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 size-[clamp(280px,40vw,460px)] -translate-x-1/2 -translate-y-1/2 text-jce-green-700/10"
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 py-20 text-center sm:py-24 md:py-28">
        <Reveal>
          <OmegaMark className="mx-auto mb-5 size-10 text-jce-green-700" />
          <h2 className="text-[clamp(26px,4vw,42px)] leading-[1.05] font-bold tracking-[-0.02em] text-balance text-jce-ink">
            Let&rsquo;s energize what&rsquo;s next.
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-ui-16 text-pretty text-jce-ink-2 sm:text-ui-18">
            {TAGLINE}
          </p>
          <div className="mt-7 flex justify-center">
            <MagneticButton>
              <Button asChild size="lg" className="h-12 px-7">
                <Link href="/contact-us">Request a consultation</Link>
              </Button>
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
