import Link from "next/link";
import Image from "next/image";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import { FOOTER_LINKS, NAV_LINKS, SITE } from "@/lib/content/site";

// Dark footer (#11150f via --footer-bg). Carries the canonical NAP from the
// brief (brief:1124, already in SITE) + nav + social. Tag: chrome.

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
    <footer className="bg-[var(--footer-bg)] text-white/70">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-12 md:gap-8 md:px-10 md:py-20">
        {/* Brand + tagline + social */}
        <div className="flex flex-col gap-4 md:col-span-4">
          <Link
            href="/"
            aria-label={SITE.brand}
            className="flex items-center gap-2.5"
          >
            <Image
              src="/jce-logo.jpg"
              width={36}
              height={36}
              alt=""
              className="rounded-md"
            />
            <span className="text-ui-16 font-bold tracking-tight text-white">
              JC Electrofields
            </span>
          </Link>
          <p className="max-w-[30ch] text-ui-13 text-white/60">
            {SITE.tagline}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex size-10 items-center justify-center rounded-md border border-white/15 text-white/70 transition-colors hover:border-jce-green-500 hover:text-jce-green-500"
            >
              <FacebookGlyph className="size-4" />
            </a>
            <a
              href={SITE.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="inline-flex size-10 items-center justify-center rounded-md border border-white/15 text-white/70 transition-colors hover:border-jce-green-500 hover:text-jce-green-500"
            >
              <YoutubeGlyph className="size-4" />
            </a>
          </div>
        </div>

        {/* Canonical NAP */}
        <div className="flex flex-col gap-3 md:col-span-4">
          <p className="text-[11px] tracking-[0.18em] text-white/45 uppercase">
            Office
          </p>
          <ul className="flex flex-col gap-2.5 text-ui-13">
            <li className="flex items-start gap-2.5">
              <MapPinIcon
                className="mt-0.5 size-4 shrink-0 text-white/45"
                aria-hidden
              />
              <span className="text-white/75">
                {SITE.address.line1}
                <br />
                {SITE.address.line2}
                <br />
                {SITE.address.country}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <PhoneIcon
                className="size-4 shrink-0 text-white/45"
                aria-hidden
              />
              <a
                href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                className="text-white/75 transition-colors hover:text-jce-green-500"
              >
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MailIcon className="size-4 shrink-0 text-white/45" aria-hidden />
              <a
                href={`mailto:${SITE.email}`}
                className="text-white/75 transition-colors hover:text-jce-green-500"
              >
                {SITE.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <ClockIcon
                className="size-4 shrink-0 text-white/45"
                aria-hidden
              />
              <span className="text-white/75">
                {SITE.hours.days} · {SITE.hours.open}
              </span>
            </li>
          </ul>
        </div>

        {/* Nav */}
        <nav aria-label="Footer" className="flex flex-col gap-3 md:col-span-4">
          <p className="text-[11px] tracking-[0.18em] text-white/45 uppercase">
            Site
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-ui-13">
            <li>
              <Link
                href="/"
                className="text-white/75 transition-colors hover:text-jce-green-500"
              >
                Home
              </Link>
            </li>
            {[...NAV_LINKS, ...FOOTER_LINKS].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/75 transition-colors hover:text-jce-green-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-start justify-between gap-3 px-6 py-6 text-[11px] tracking-[0.14em] text-white/45 uppercase md:flex-row md:items-center md:px-10">
          <p>
            © {year} {SITE.brand} · All rights reserved
          </p>
          <p>EPC — Philippines · since {SITE.founded}</p>
        </div>
      </div>
    </footer>
  );
}
