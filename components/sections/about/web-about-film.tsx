import { Reveal } from "@/components/sections/kit/web-reveal";
import { VideoPlayer } from "@/components/sections/kit/web-video-player";
import { ABOUT } from "@/lib/content/website";

// Brand film — the Ω logo reveal, click-to-play WITH audio (the spoken tagline is
// meant to be heard here, intentionally). A dark cinematic band; VideoPlayer keeps
// the video bytes off the initial load until the user opts in. Server component;
// the player is the lone client leaf.

export function AboutFilm() {
  const { film } = ABOUT;
  return (
    <section className="dark-section circuit-field relative isolate overflow-hidden px-5 py-16 sm:py-20 md:py-24">
      <div className="mx-auto w-full max-w-4xl">
        <Reveal className="mb-8 text-center md:mb-10">
          <p className="kicker text-jce-cyan-bright">{film.eyebrow}</p>
          <h2 className="mt-2 text-[clamp(24px,3.6vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-jce-dark-ink">
            {film.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-ui-16 text-pretty text-jce-dark-ink-2">
            {film.body}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <VideoPlayer src={film.src} poster={film.poster} title={film.title} />
        </Reveal>
      </div>
    </section>
  );
}
