import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/kit/web-reveal";
import { MagneticButton } from "@/components/sections/kit/web-magnetic-button";

// Closing CTA on the glow backdrop (web-pages-a.jsx:124-137). Reused across pages.

export function WebCta({
  heading = "Have a project in mind?",
  sub = "Tell us about your power requirement — we'll respond with a capability profile and indicative scope.",
  ctaHref = "/contact-us",
  ctaLabel = "Get in touch",
}: {
  heading?: string;
  sub?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <section className="jce-backdrop relative isolate overflow-hidden">
      <span className="jce-glow-3" aria-hidden />
      <div className="mx-auto w-full max-w-3xl px-5 py-20 text-center sm:py-24 md:py-28">
        <Reveal>
          <h2 className="text-[clamp(26px,4vw,42px)] font-bold tracking-[-0.02em] text-balance text-jce-ink">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-ui-16 text-pretty text-jce-ink-2 sm:text-ui-18">
            {sub}
          </p>
          <div className="mt-7 flex justify-center">
            <MagneticButton>
              <Button asChild size="lg" className="h-12 px-7">
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
