"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Self-hosted click-to-play film — the sibling to web-video-embed (which is the
// YouTube facade) for media we host in public/. A poster + a branded play
// affordance render first; the <video> (with its own native controls + AUDIO)
// mounts only on click, so no video bytes load on page view and the aspect-video
// box reserves height (no CLS). The click is a user gesture, so the freshly
// mounted autoPlay video is allowed to play WITH sound. The poster is a local
// asset → next/image optimizes it. Decorative chrome is aria-hidden; the button
// carries the accessible label. No-JS: the poster + play affordance still render
// (a graceful, non-broken still). Reduced motion is unaffected — playback is
// always user-initiated, never autoplay.

export function VideoPlayer({
  src,
  poster,
  title,
  className,
}: {
  /** public/ path to the self-hosted video, e.g. "/home/jce-omega-reveal.mp4". */
  src: string;
  /** public/ path to the poster still. */
  poster: string;
  /** Accessible title — the button label + caption. */
  title: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);

  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div className="circuit-card circuit-card-dark relative aspect-video overflow-hidden rounded-(--r-glass) bg-jce-dark-2">
        {active ? (
          <video
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full bg-black object-contain"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Play film: ${title}`}
            className="focus-ring-cyan group/play absolute inset-0 h-full w-full cursor-pointer"
          >
            <Image
              src={poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 56rem, 100vw"
              className="object-cover opacity-90 transition-opacity duration-300 group-hover/play:opacity-100"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-jce-dark/75 via-jce-dark/15 to-transparent"
            />
            <span
              aria-hidden
              className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-jce-cyan/60 bg-jce-dark/60 text-jce-cyan-bright backdrop-blur-sm transition-transform duration-200 group-hover/play:scale-110"
            >
              <PlayIcon className="size-7 translate-x-0.5 fill-current" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="text-ui-13 text-pretty text-jce-dark-ink-2">
        {title}
      </figcaption>
    </figure>
  );
}
