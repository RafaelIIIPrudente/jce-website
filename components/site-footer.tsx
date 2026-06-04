import Link from "next/link";
import Image from "next/image";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import { FOOTER_LINKS, NAV_LINKS, SITE } from "@/lib/content/site";
import { OmegaMark } from "@/components/sections/web-omega-mark";
import { ElectrifiedDivider } from "@/components/sections/web-electrified-divider";
import { VoltageTag } from "@/components/sections/web-voltage-tag";
import { CREDENTIAL_STRIP } from "@/lib/content/accreditations";

// Electrified dark footer (--footer-bg). Mirrors the dark-section aesthetic: a
// faint circuit-field grid + a large Ω brand watermark behind the content (both
// decorative, clipped, behind content), an animated current-hairline divider,
// and the electric-cyan hover/focus accent. Carries the canonical NAP + nav +
// social. Tag: chrome.

function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.261c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12Z" />
    </svg>
  );
}

function YoutubeGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.546 15.568V8.432L15.818 12l-6.272 3.568Z" />
    </svg>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate bg-(--footer-bg) text-jce-dark-ink-2">
      {/* Decorative electrified layer — faint circuit grid + Ω watermark, clipped
          and behind content; never intercepts pointer or focus. */}
      <div
        aria-hidden
        className="circuit-field pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <OmegaMark className="absolute -right-12 bottom-2 size-[clamp(220px,28vw,360px)] text-jce-cyan/10" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-12 md:gap-8 md:px-10 md:py-20">
        {/* Brand + tagline + social */}
        <div className="flex flex-col gap-4 md:col-span-4">
          <Link
            href="/"
            aria-label={SITE.brand}
            className="focus-ring-cyan flex w-fit items-center gap-2.5 rounded-md"
          >
            <Image
              src="/jce-logo.jpg"
              width={36}
              height={36}
              alt=""
              className="rounded-md"
            />
            <span className="text-ui-16 font-bold tracking-tight text-jce-dark-ink">
              JC Electrofields
            </span>
          </Link>
          <p className="max-w-[30ch] text-ui-13 text-jce-dark-ink-2">
            {SITE.tagline}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="focus-ring-cyan inline-flex size-11 items-center justify-center rounded-md border border-jce-dark-line text-jce-dark-ink-2 transition-colors hover:border-jce-cyan hover:text-jce-cyan-bright"
            >
              <FacebookGlyph className="size-4" />
            </a>
            <a
              href={SITE.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="focus-ring-cyan inline-flex size-11 items-center justify-center rounded-md border border-jce-dark-line text-jce-dark-ink-2 transition-colors hover:border-jce-cyan hover:text-jce-cyan-bright"
            >
              <YoutubeGlyph className="size-4" />
            </a>
          </div>
        </div>

        {/* Canonical NAP */}
        <div className="flex flex-col gap-3 md:col-span-4">
          <p className="text-[11px] tracking-[0.18em] text-jce-dark-ink-2 uppercase">
            Office
          </p>
          <ul className="flex flex-col text-ui-13">
            <li className="flex items-start gap-2.5 py-1.5">
              <MapPinIcon
                className="mt-0.5 size-4 shrink-0 text-jce-cyan"
                aria-hidden
              />
              <span className="text-jce-dark-ink">
                {SITE.address.line1}
                <br />
                {SITE.address.line2}
                <br />
                {SITE.address.country}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <PhoneIcon
                className="size-4 shrink-0 text-jce-cyan"
                aria-hidden
              />
              <a
                href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                className="focus-ring-cyan inline-flex min-h-11 items-center rounded-md text-jce-dark-ink transition-colors hover:text-jce-cyan-bright"
              >
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MailIcon className="size-4 shrink-0 text-jce-cyan" aria-hidden />
              <a
                href={`mailto:${SITE.email}`}
                className="focus-ring-cyan inline-flex min-h-11 items-center rounded-md text-jce-dark-ink transition-colors hover:text-jce-cyan-bright"
              >
                {SITE.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5 py-1.5">
              <ClockIcon
                className="size-4 shrink-0 text-jce-cyan"
                aria-hidden
              />
              <span className="text-jce-dark-ink">
                {SITE.hours.days} · {SITE.hours.open}
              </span>
            </li>
          </ul>
        </div>

        {/* Nav */}
        <nav aria-label="Footer" className="flex flex-col gap-3 md:col-span-4">
          <p className="text-[11px] tracking-[0.18em] text-jce-dark-ink-2 uppercase">
            Site
          </p>
          <ul className="grid grid-cols-2 gap-x-6 text-ui-13">
            <li>
              <Link
                href="/"
                className="focus-ring-cyan inline-flex min-h-11 items-center rounded-md text-jce-dark-ink transition-colors hover:text-jce-cyan-bright"
              >
                Home
              </Link>
            </li>
            {[...NAV_LINKS, ...FOOTER_LINKS].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="focus-ring-cyan inline-flex min-h-11 items-center rounded-md text-jce-dark-ink transition-colors hover:text-jce-cyan-bright"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Credential strip — static §9-SAFE chips, full-width above the hairline.
          Static text (no links → no 44px rule); dark-surface VoltageTags carry
          the amber accent marker. Wraps cleanly at 360/390. */}
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <ul className="flex flex-wrap items-center gap-2 border-t border-jce-dark-line pt-6 md:gap-3">
          {CREDENTIAL_STRIP.map((c) => (
            <li key={c.acronym}>
              <VoltageTag tone="dark">
                {c.acronym} {c.label}
              </VoltageTag>
            </li>
          ))}
        </ul>
      </div>

      {/* Animated current hairline (frozen under prefers-reduced-motion) */}
      <ElectrifiedDivider tone="dark" />
      <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-start justify-between gap-3 px-6 py-6 text-[11px] tracking-[0.14em] text-jce-dark-ink-2 uppercase md:flex-row md:items-center md:px-10">
        <p>
          © {year} {SITE.brand} · All rights reserved
        </p>
        <p>EPC — Philippines · since {SITE.founded}</p>
      </div>
    </footer>
  );
}
