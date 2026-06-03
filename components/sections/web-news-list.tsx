import { Reveal } from "@/components/sections/web-reveal";
import { NEWS, type NewsArticle } from "@/lib/content/website";

// S6 News — indexable article cards (category + date + excerpt)
// (web-pages-b.jsx:336-367). Real <article>/<time> for SEO/GEO. Tag: Solid.
// Article detail pages are future (content ownership — OPEN-Q #12).

export function WebNewsList({
  items = NEWS,
}: {
  items?: readonly NewsArticle[];
}) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {items.map((n, i) => (
        <Reveal key={n.slug} delay={Math.min(i * 0.06, 0.2)}>
          <article
            id={n.slug}
            className="solid flex h-full flex-col overflow-hidden rounded-[var(--r-solid)]"
          >
            <div className="aspect-[16/9] bg-[linear-gradient(135deg,var(--jce-green-100),var(--jce-green-50))]" />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-jce-green-50 px-2.5 py-0.5 text-ui-12 font-semibold text-jce-green-700">
                  {n.cat}
                </span>
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
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
