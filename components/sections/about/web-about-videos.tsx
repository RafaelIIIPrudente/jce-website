import { ArrowUpRightIcon } from "lucide-react";

import { CircuitReveal } from "@/components/sections/kit/web-circuit-reveal";
import { Reveal } from "@/components/sections/kit/web-reveal";
import { VideoEmbed } from "@/components/sections/kit/web-video-embed";
import {
  ABOUT_VIDEOS,
  YOUTUBE_CHANNEL,
  type AboutVideo,
} from "@/lib/content/website";

// S2 video showcase — a dark "Watch" section. The curated ABOUT_VIDEOS are always
// featured; below them a live "Latest from our channel" strip pulls the channel
// RSS feed (revalidated daily) and de-dupes against the curated set, so brand-new
// uploads surface automatically. The fetch is wrapped so a feed outage (or an
// offline build) simply renders the curated block — never an error or empty shell.

function decodeXml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#x27;/g, "'");
}

async function fetchLatest(channelId: string): Promise<AboutVideo[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return [];
    const xml = await res.text();
    return xml
      .split("<entry>")
      .slice(1)
      .map((entry): AboutVideo | null => {
        const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
        const title = entry.match(/<title>([^<]*)<\/title>/)?.[1];
        if (!id || !title) return null;
        return { id, title: decodeXml(title) };
      })
      .filter((v): v is AboutVideo => v !== null);
  } catch {
    return [];
  }
}

export async function AboutVideos() {
  const curatedIds = new Set(ABOUT_VIDEOS.map((v) => v.id));
  const latest = (await fetchLatest(YOUTUBE_CHANNEL.channelId))
    .filter((v) => !curatedIds.has(v.id))
    .slice(0, 3);

  return (
    <section className="dark-section circuit-field relative isolate overflow-hidden px-5 py-16 sm:py-20 md:py-24">
      <div className="mx-auto w-full max-w-site">
        <CircuitReveal
          lineClassName="text-jce-cyan"
          className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-10"
        >
          <div className="max-w-[44ch]">
            <p className="kicker text-jce-cyan-bright">Watch</p>
            <h2 className="mt-2 text-[clamp(24px,3.6vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-jce-dark-ink">
              See the work in motion.
            </h2>
          </div>
          <a
            href={YOUTUBE_CHANNEL.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring-cyan group inline-flex min-h-11 items-center gap-1.5 rounded-md text-ui-14 font-semibold text-jce-cyan-bright transition-colors hover:text-jce-dark-ink"
          >
            Visit our channel
            <ArrowUpRightIcon
              className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        </CircuitReveal>

        {/* Featured — the curated set (always shown) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT_VIDEOS.map((v, i) => (
            <Reveal key={v.id} delay={Math.min(i * 0.05, 0.2)}>
              <VideoEmbed id={v.id} title={v.title} />
            </Reveal>
          ))}
        </div>

        {/* Latest from the channel — live, de-duped; appears only when the channel
            has uploads beyond the featured set (otherwise the header link covers it). */}
        {latest.length > 0 ? (
          <div className="mt-10 md:mt-12">
            <p className="kicker mb-5 text-jce-dark-ink-2">
              Latest from our channel
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((v, i) => (
                <Reveal key={v.id} delay={Math.min(i * 0.05, 0.2)}>
                  <VideoEmbed id={v.id} title={v.title} />
                </Reveal>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
