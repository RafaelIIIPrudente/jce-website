import Link from "next/link";

import { CurrentTrace } from "@/components/sections/kit/web-current-trace";
import { OmegaMark } from "@/components/sections/kit/web-omega-mark";
import { HeroParallax } from "@/components/sections/kit/web-hero-parallax";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Projects category hero — the electrified dark idiom at inner-page scale, matching
// web-about-hero / web-services-hero / web-products-hero exactly: an ambient circuit
// field, a large faint Ω brand watermark, and a rising CurrentTrace that draws on
// view (anime.js, client-only, frozen under reduced-motion). Carries the page's
// single <h1>, and — above it — a real breadcrumb <nav>/<ol> toned for the dark
// surface (FR-WEB-09 BreadcrumbList SEO). Page-scoped; same prop surface as the
// legacy CategoryHero so the page diffs stay minimal.

const SHORT_LABEL = {
  solar: "Solar Farm",
  distribution: "Distribution Utility",
  ngcp: "NGCP",
} as const;

export function WebProjectCategoryHero({
  category,
  eyebrow,
  title,
  subtitle,
}: {
  category: "solar" | "distribution" | "ngcp";
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="dark-section circuit-field relative isolate overflow-hidden">
      {/* Large faint Ω brand watermark — decorative, behind content, clipped;
          drifts furthest for a layered depth cue as the hero scrolls away. */}
      <HeroParallax
        className="pointer-events-none absolute inset-0 -z-10"
        distance="18%"
      >
        <OmegaMark className="absolute top-1/2 -right-12 size-[clamp(220px,42vw,440px)] -translate-y-1/2 text-jce-cyan/10" />
      </HeroParallax>

      {/* Rising current-trace — draws on view; fully drawn + still under
          reduced-motion. Drifts less than the watermark (parallax layering). */}
      <HeroParallax className="absolute inset-0 -z-10" distance="9%">
        <CurrentTrace
          d="M30 360 H240 a16 16 0 0 0 16 -16 V210 H520 a16 16 0 0 1 16 -16 V96 H1170"
          viewBox="0 0 1200 400"
          duration={2000}
          strokeWidth={2.5}
          className="h-full w-full opacity-60"
        />
      </HeroParallax>

      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:py-28 md:py-32">
        {/* Breadcrumb — real nav/ordered list, toned for the dark surface. */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList className="text-jce-dark-ink-2">
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="text-jce-dark-ink-2 hover:text-jce-cyan-bright focus-visible:text-jce-cyan-bright"
              >
                <Link
                  href="/projects"
                  className="focus-ring-cyan -mx-1 inline-flex min-h-11 items-center rounded-md px-1"
                >
                  Projects
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-jce-dark-line" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-jce-dark-ink">
                {SHORT_LABEL[category]}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <p className="kicker text-jce-cyan-bright">{eyebrow}</p>
        <h1 className="mt-4 max-w-[20ch] text-[clamp(30px,6vw,60px)] leading-[1.04] font-bold tracking-[-0.02em] text-balance text-jce-dark-ink">
          {title}
        </h1>
        <p className="mt-5 max-w-[60ch] text-ui-16 text-pretty text-jce-dark-ink-2 sm:text-ui-18">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
