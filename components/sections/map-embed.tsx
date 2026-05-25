import { MapPinIcon } from "lucide-react";

import { SITE } from "@/lib/content/site";

const QUERY = encodeURIComponent(
  `${SITE.address.line1}, ${SITE.address.line2}`,
);

export function MapEmbed() {
  return (
    <section className="border-b border-border bg-muted/40">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-section md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <p className="mb-3 text-eyebrow uppercase text-muted-foreground">
            Visit us
          </p>
          <h2 className="font-display text-h2 text-balance text-foreground">
            Valenzuela City office.
          </h2>
          <p className="mt-4 max-w-[40ch] text-body text-pretty text-muted-foreground">
            {SITE.address.line1}, {SITE.address.line2}, {SITE.address.country}.
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${QUERY}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-caption uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <MapPinIcon className="size-3.5" strokeWidth={1.5} />
            Open in Maps
          </a>
        </div>
        <div className="md:col-span-7">
          <div
            aria-hidden="true"
            className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border bg-[radial-gradient(circle_at_50%_50%,oklch(0.34_0.06_155/0.20),transparent_70%),linear-gradient(180deg,oklch(0.94_0.008_95),oklch(0.88_0.008_95))]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,oklch(0.18_0.015_160)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.18_0.015_160)_1px,transparent_1px)] [background-size:32px_32px]"
            />
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft">
                <MapPinIcon className="size-4" strokeWidth={1.5} />
              </span>
              <p className="text-caption text-foreground">
                JC Electrofields Power System
              </p>
              <p className="text-caption uppercase tracking-[0.18em] text-muted-foreground">
                Valenzuela City
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
