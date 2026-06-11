"use client";

import { useState } from "react";
import { PlayIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Lazy YouTube facade — renders the poster thumbnail + a play affordance and only
// mounts the (privacy-enhanced, no-cookie) iframe player on click. Keeps YouTube's
// heavy player SDK off the initial page load; the fixed 16:9 box reserves height
// so there's no CLS. The play chrome is decorative (aria-hidden); the button
// carries the accessible label. The thumbnail is a plain lazy <img> on purpose —
// it's a click-to-load facade, not an optimization target, and avoids wiring an
// external image host into next/image just for a poster frame.

export function VideoEmbed({
  id,
  title,
  className,
}: {
  id: string;
  title: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);

  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div
        data-lenis-prevent
        className="circuit-card circuit-card-dark relative aspect-video overflow-hidden rounded-(--r-glass) bg-jce-dark-2"
      >
        {active ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Play video: ${title}`}
            className="focus-ring-cyan group/play absolute inset-0 h-full w-full cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- YouTube CDN poster for a click-to-load facade; next/image would force an external-host config for no gain. */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              width={480}
              height={360}
              className="absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity duration-300 group-hover/play:opacity-100"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-jce-dark/70 via-jce-dark/10 to-transparent"
            />
            <span
              aria-hidden
              className="absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-jce-cyan/60 bg-jce-dark/60 text-jce-cyan-bright backdrop-blur-sm transition-transform duration-200 group-hover/play:scale-110"
            >
              <PlayIcon className="size-6 translate-x-0.5 fill-current" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="text-ui-14 font-semibold text-pretty text-jce-dark-ink">
        {title}
      </figcaption>
    </figure>
  );
}
