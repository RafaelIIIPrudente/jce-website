import { MapPinIcon } from "lucide-react";

import { SITE } from "@/lib/content/site";
import { Reveal } from "@/components/sections/kit/web-reveal";

// Contact "Visit us" band — a text column beside a LIVE Google Maps embed pinned
// to the exact office NAP (SITE.address). Keyless `output=embed` (no Maps API key
// in this project); lazy-loaded inside a fixed 16:10 electrified circuit-card
// frame so there's no layout shift. A non-interactive brand caption carries the
// identity; the "Open in Maps" deep link opens the same location in full Maps.

const QUERY = encodeURIComponent(
  `${SITE.address.line1}, ${SITE.address.line2}, ${SITE.address.country}`,
);
const EMBED_SRC = `https://www.google.com/maps?q=${QUERY}&z=16&output=embed`;
const MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${QUERY}`;

export function MapEmbed() {
  return (
    <section className="bg-jce-green-50/40 px-5 py-16 sm:py-20 md:py-24">
      <Reveal className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-12 md:items-center">
        <div className="md:col-span-5">
          <p className="kicker text-jce-green-600">Visit us</p>
          <h2 className="mt-2 text-[clamp(24px,3.6vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-jce-ink">
            Valenzuela City office.
          </h2>
          <p className="mt-4 max-w-[40ch] text-ui-16 text-pretty text-jce-ink-2">
            {SITE.address.line1}, {SITE.address.line2}, {SITE.address.country}.
          </p>
          <a
            href={MAPS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring-jce mt-6 inline-flex min-h-11 items-center gap-2 rounded-(--r-solid) border border-jce-green-700 px-4 text-ui-14 font-semibold text-jce-green-700 transition-colors hover:bg-jce-green-50"
          >
            <MapPinIcon className="size-4" strokeWidth={1.75} aria-hidden />
            Open in Maps
          </a>
        </div>
        <div className="md:col-span-7">
          <div className="circuit-card relative aspect-16/10 w-full overflow-hidden rounded-(--r-glass) border border-jce-line bg-jce-green-50">
            <iframe
              src={EMBED_SRC}
              title={`Map showing the ${SITE.brand} office at ${SITE.address.line1}, ${SITE.address.line2}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
            {/* Brand caption — non-interactive so the map stays fully usable. */}
            <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-(--r-solid) bg-white/90 px-3 py-2 shadow-(--solid-shadow) backdrop-blur-sm">
              <p className="text-ui-12 font-semibold text-jce-ink">
                JC Electrofields Power System
              </p>
              <p className="kicker text-jce-ink-2">Valenzuela City</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
