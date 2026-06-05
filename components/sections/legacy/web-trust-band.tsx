import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/kit/web-reveal";
import { MagneticButton } from "@/components/sections/kit/web-magnetic-button";

// S1 NGCP trust band (web-pages-a.jsx:107-122). Glass band + primary CTA. Glass.

export function WebTrustBand() {
  return (
    <Reveal>
      <div className="glass flex flex-col items-start gap-5 rounded-[var(--r-glass)] p-6 sm:p-8 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="max-w-[52ch]">
          <h2 className="text-[clamp(22px,3vw,30px)] font-bold tracking-[-0.01em] text-balance text-jce-ink">
            Accredited for NGCP direct connection via 69 KV
          </h2>
          <p className="mt-2.5 text-ui-16 text-pretty text-jce-ink-2">
            From application to energization — JCE is the partner of choice for
            cooperatives, industrials and government across the archipelago.
          </p>
        </div>
        <MagneticButton className="shrink-0">
          <Button asChild size="lg" className="h-12 px-6">
            <Link href="/contact-us">Start a conversation</Link>
          </Button>
        </MagneticButton>
      </div>
    </Reveal>
  );
}
