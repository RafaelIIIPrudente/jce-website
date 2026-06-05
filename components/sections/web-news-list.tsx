import { Reveal } from "@/components/sections/web-reveal";
import { OmegaMark } from "@/components/sections/web-omega-mark";
import { VoltageTag } from "@/components/sections/web-voltage-tag";
import { NEWS, type NewsArticle } from "@/lib/content/website";

// S6 News — indexable article cards (category + date + excerpt)
// (web-pages-b.jsx:336-367). Elevated to the electrified circuit-card surface with
// a VoltageTag category accent and a faint Ω seal over the var-based green poster.
// Real <article>/<time>/id markup is preserved verbatim — SEO/GEO load-bearing.
// Empty NEWS → a graceful circuit-card panel instead of a bare grid. Article detail
// pages are future (content ownership — OPEN-Q #12).

export function WebNewsList({
  items = NEWS,
}: {
  items?: readonly NewsArticle[];
}) {
  if (items.length === 0) {
    return (
      <div className="circuit-card solid mx-auto max-w-[44ch] rounded-(--r-glass) p-10 text-center">
        <OmegaMark className="mx-auto mb-4 size-10 text-jce-cyan-deep" />
        <p className="text-ui-16 font-semibold text-jce-ink">
          No posts yet — check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {items.map((n, i) => (
        <Reveal key={n.slug} delay={Math.min(i * 0.06, 0.2)}>
          <article
            id={n.slug}
            className="circuit-card solid flex h-full flex-col rounded-(--r-glass) p-5"
          >
            <div className="relative aspect-video overflow-hidden rounded-(--r-input) bg-[linear-gradient(135deg,var(--jce-green-100),var(--jce-green-50))]">
              <OmegaMark
                className="pointer-events-none absolute right-3 bottom-3 size-8 text-jce-green-700/15"
                strokeWidth={5}
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <VoltageTag>{n.cat}</VoltageTag>
              <time
                className="font-mono text-ui-12 text-jce-ink-2"
                dateTime={n.date}
              >
                {n.date}
              </time>
            </div>
            <h3 className="mt-3 text-ui-16 font-semibold text-balance text-jce-ink">
              {n.title}
            </h3>
            <p className="mt-2 text-ui-13 text-pretty text-jce-ink-2">
              {n.excerpt}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
