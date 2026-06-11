import { CurrentTrace } from "@/components/sections/kit/web-current-trace";
import { OmegaMark } from "@/components/sections/kit/web-omega-mark";

// S9 FAQ hero — the electrified dark idiom at inner-page scale, identical in
// language to web-about-hero / web-services-hero: an ambient circuit field + a
// large faint Ω brand watermark + a rising CurrentTrace that draws on view.
// Carries the page's single <h1>. Deliberately photo-less — keeps the hero
// brand-led and avoids the next/image priority-LCP src-collision (no priority
// image exists on the page). Mobile-first: the headline clamps from 360px up; the
// decorative layers are clipped, behind content, and freeze to a static render
// under prefers-reduced-motion.

export function FaqHero() {
  return (
    <section
      data-nav-overlay
      className="dark-section circuit-field relative isolate overflow-hidden"
    >
      {/* Large faint Ω brand watermark — decorative, behind content, clipped. */}
      <OmegaMark className="pointer-events-none absolute top-1/2 -right-12 -z-10 size-[clamp(220px,42vw,440px)] -translate-y-1/2 text-jce-cyan/10" />

      {/* Rising current-trace — draws on view; fully drawn + still under reduced-motion. */}
      <CurrentTrace
        d="M30 360 H240 a16 16 0 0 0 16 -16 V210 H520 a16 16 0 0 1 16 -16 V96 H1170"
        viewBox="0 0 1200 400"
        duration={2000}
        strokeWidth={2.5}
        className="absolute inset-0 -z-10 h-full w-full opacity-60"
      />

      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:py-28 md:py-32">
        <p className="kicker text-jce-cyan-bright">Answers</p>
        <h1 className="mt-4 max-w-[20ch] text-[clamp(30px,6vw,60px)] leading-[1.04] font-bold tracking-[-0.02em] text-balance text-jce-dark-ink">
          Frequently asked{" "}
          <span className="text-jce-cyan-bright">questions.</span>
        </h1>
        <p className="mt-5 max-w-[60ch] text-ui-16 text-pretty text-jce-dark-ink-2 sm:text-ui-18">
          The questions buyers ask most about JCE&rsquo;s power capabilities.
        </p>
      </div>
    </section>
  );
}
