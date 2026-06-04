import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/web-reveal";
import { VoltageTag } from "@/components/sections/web-voltage-tag";
import { SERVICES, type Service } from "@/lib/content/website";

// S3 Services — 6 capability rows + Engineering Consultancy, each with an inline
// spec and an "Enquire" → contact (web-pages-a.jsx:199-221). Electrified idiom:
// circuit-card rows, an amber accent icon tile, and a VoltageTag spec badge.
// Mobile-first: each row stacks (flex-col) and goes inline from sm up.

export function WebServiceList({
  services = SERVICES,
}: {
  services?: readonly Service[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {services.map((s, i) => {
        const Icon = s.icon;
        return (
          <Reveal key={s.slug} delay={Math.min(i * 0.04, 0.2)}>
            <div className="circuit-card solid flex flex-col gap-4 rounded-(--r-glass) p-5 sm:flex-row sm:items-center">
              <span className="grid size-12 shrink-0 place-items-center rounded-(--r-solid) bg-jce-cyan/12 text-jce-cyan-deep">
                <Icon className="size-6" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                  <span className="text-ui-18 font-semibold text-jce-ink">
                    {s.name}
                  </span>
                  <VoltageTag>{s.spec}</VoltageTag>
                </div>
                <p className="mt-1.5 max-w-[70ch] text-ui-14 text-pretty text-jce-ink-2">
                  {s.desc}
                </p>
              </div>
              <Button asChild variant="outline" className="h-11 shrink-0 px-5">
                <Link href="/contact-us">Enquire</Link>
              </Button>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
