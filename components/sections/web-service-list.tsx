import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/web-reveal";
import { SERVICES, type Service } from "@/lib/content/website";

// S3 Services — 6 capability rows + Engineering Consultancy, each with inline
// spec and an "Enquire" → contact (web-pages-a.jsx:199-221). Tag: Glass row.

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
            <div className="glass flex flex-col gap-4 rounded-(--r-glass) p-5 sm:flex-row sm:items-center">
              <span className="grid size-12 shrink-0 place-items-center rounded-[12px] bg-jce-green-50 text-jce-green-700">
                <Icon className="size-6" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="text-ui-18 font-semibold text-jce-ink">
                    {s.name}
                  </span>
                  <span className="rounded-full bg-jce-green-50 px-2.5 py-0.5 text-ui-12 font-semibold text-jce-green-700">
                    {s.spec}
                  </span>
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
