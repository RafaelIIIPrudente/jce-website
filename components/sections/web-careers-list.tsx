import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/web-reveal";
import { OmegaMark } from "@/components/sections/web-omega-mark";
import { VoltageTag } from "@/components/sections/web-voltage-tag";
import { MagneticButton } from "@/components/sections/web-magnetic-button";
import { CAREERS, type CareerRole } from "@/lib/content/website";

// S7 Careers — role rows with dept/loc/type + Apply (web-pages-b.jsx:373-409).
// Elevated to the electrified circuit-card surface with VoltageTag meta chips; the
// Apply button stays green and routes to /contact-us (the confirmed behavior).
// Empty CAREERS → a graceful circuit-card panel with a green "Introduce yourself"
// CTA. Reveal stagger throughout; motion freezes under reduced-motion.

export function WebCareersList({
  roles = CAREERS,
}: {
  roles?: readonly CareerRole[];
}) {
  if (roles.length === 0) {
    return (
      <div className="circuit-card glass mx-auto max-w-[52ch] rounded-(--r-glass) p-8 text-center sm:p-10">
        <OmegaMark className="mx-auto mb-4 size-10 text-jce-cyan-deep" />
        <p className="mx-auto max-w-[44ch] text-ui-16 text-pretty text-jce-ink">
          {
            "No open roles right now. We're always glad to hear from power-engineering talent."
          }
        </p>
        <div className="mt-6 flex justify-center">
          <MagneticButton className="w-full sm:w-auto">
            <Button asChild size="lg" className="h-12 w-full px-7 sm:w-auto">
              <Link href="/contact-us">Introduce yourself</Link>
            </Button>
          </MagneticButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {roles.map((c, i) => (
        <Reveal key={c.title} delay={Math.min(i * 0.05, 0.2)}>
          <div className="circuit-card glass flex flex-col gap-4 rounded-(--r-glass) p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-ui-16 font-semibold text-jce-ink">
                {c.title}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <VoltageTag>{c.dept}</VoltageTag>
                <VoltageTag>{c.loc}</VoltageTag>
                <VoltageTag>{c.type}</VoltageTag>
              </div>
            </div>
            <Button asChild className="h-11 w-full shrink-0 px-5 sm:w-auto">
              <Link href="/contact-us">Apply</Link>
            </Button>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
