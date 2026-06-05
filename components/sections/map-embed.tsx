import { MapPinIcon } from "lucide-react";

import { SITE } from "@/lib/content/site";
import { Reveal } from "@/components/sections/web-reveal";

// Contact "Visit us" band — electrified re-skin of the legacy map block. A text
// column + a decorative (aria-hidden) map placeholder built from the kit: a
// photo-poster green gradient under the faint circuit-field blueprint grid, with
// the green pin motif. The "Open in Maps" deep link stays a real external link.
// Map embed is client-input per SRS §11.9, so the visual is a placeholder, not a
// live iframe.

const QUERY = encodeURIComponent(
  `${SITE.address.line1}, ${SITE.address.line2}`,
);

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
            href={`https://www.google.com/maps/search/?api=1&query=${QUERY}`}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring-jce mt-6 inline-flex min-h-11 items-center gap-2 rounded-(--r-solid) border border-jce-green-700 px-4 text-ui-14 font-semibold text-jce-green-700 transition-colors hover:bg-jce-green-50"
          >
            <MapPinIcon className="size-4" strokeWidth={1.75} aria-hidden />
            Open in Maps
          </a>
        </div>
        <div className="md:col-span-7">
          <div
            aria-hidden="true"
            className="circuit-field photo-poster relative isolate aspect-[16/10] w-full overflow-hidden rounded-(--r-solid) border border-jce-line"
          >
            <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-jce-green-700 text-white shadow-(--solid-shadow)">
                <MapPinIcon className="size-4" strokeWidth={1.75} />
              </span>
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
