import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { WebSection } from "@/components/sections/web-section";
import { Reveal } from "@/components/sections/web-reveal";
import { MagneticButton } from "@/components/sections/web-magnetic-button";
import { OmegaMark } from "@/components/sections/web-omega-mark";
import { ProductsHero } from "@/components/sections/web-products-hero";
import { WebProductsGrid } from "@/components/sections/web-products-grid";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Power equipment specified, supplied and integrated by JCE — power and distribution transformers (15 KV–230 KV), HVSG/MVSG/LVSG switchgear, and protection & control. Exclusive Philippine distributor of Shenda Electric.",
};

// S5 · Products (web-pages-a.jsx:290-323). Kept distinct from Services. Electrified
// rebuild: a photo-less dark hero, circuit-card spec grid, and an inline Ω-backed
// closing CTA on the luminous backdrop. Content / metadata / IA unchanged.
export default function ProductsPage() {
  return (
    <>
      <ProductsHero />

      <WebSection>
        <WebProductsGrid />
      </WebSection>

      {/* Closing CTA — Ω brand motif pulsing behind the luminous backdrop, a green
          primary "Request a quote" on a MagneticButton. Mobile: the button is
          full-width (both the wrapper and the Button get w-full sm:w-auto, else the
          inline-flex wrapper would shrink to content). */}
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
              Need a quotation?
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-ui-16 text-pretty text-jce-ink-2 sm:text-ui-18">
              {
                "Send your specification — transformer rating, switchgear class or protection scheme — and we'll respond with a quote."
              }
            </p>
            <div className="mt-7 flex justify-center">
              <MagneticButton className="w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  className="h-12 w-full px-7 sm:w-auto"
                >
                  <Link href="/contact-us">Request a quote</Link>
                </Button>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
