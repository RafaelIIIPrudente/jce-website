import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Reveal } from "@/components/sections/web-reveal";
import { SERVICES, type Service } from "@/lib/content/website";

// S1 capability band — glass cards linking to Services (web-pages-a.jsx:48-69).
// Green-50 icon wells; orange is reserved for CTAs elsewhere. Tag: Glass.

export function WebCapabilityGrid({
  services = SERVICES.slice(0, 6),
  href = "/services",
}: {
  services?: readonly Service[];
  href?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => {
        const Icon = s.icon;
        return (
          <Reveal key={s.slug} delay={Math.min(i * 0.05, 0.25)}>
            <Link
              href={href}
              className="focus-ring-jce glass group/cap flex h-full flex-col rounded-(--r-glass) p-5 transition-transform duration-300 ease-jce hover:-translate-y-0.5"
            >
              <span className="grid size-11 place-items-center rounded-[12px] bg-jce-green-50 text-jce-green-700">
                <Icon className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="mt-4 text-ui-16 font-semibold text-jce-ink">
                {s.name}
              </span>
              <span className="mt-1 text-ui-13 font-medium text-jce-green-700">
                {s.spec}
              </span>
              <span className="mt-3 inline-flex items-center gap-1 text-ui-13 text-jce-ink-2 transition-colors group-hover/cap:text-jce-green-700">
                Learn more
                <ArrowRightIcon
                  className="size-3.5 transition-transform duration-200 group-hover/cap:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
