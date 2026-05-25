import Link from "next/link";
import { MailIcon, MapPinIcon, PhoneIcon, ClockIcon } from "lucide-react";

import { NAV_LINKS, SITE } from "@/lib/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 md:grid-cols-12 md:gap-8 md:px-10 md:py-24">
        {/* Brand + tagline */}
        <div className="flex flex-col gap-4 md:col-span-4">
          <Link
            href="/"
            className="font-display text-h4 tracking-tight text-foreground"
            aria-label={SITE.brand}
          >
            <span className="font-medium">JC</span>
            <span className="text-muted-foreground"> Electrofields</span>
          </Link>
          <p className="max-w-[28ch] text-sm text-muted-foreground">
            {SITE.tagline}
          </p>
        </div>

        {/* Contact details */}
        <div className="flex flex-col gap-3 md:col-span-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Office
          </p>
          <ul className="flex flex-col gap-2 text-sm text-foreground">
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>
                {SITE.address.line1}
                <br />
                {SITE.address.line2}
                <br />
                {SITE.address.country}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="size-4 shrink-0 text-muted-foreground" />
              <a
                href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                className="transition-colors hover:text-primary"
              >
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon className="size-4 shrink-0 text-muted-foreground" />
              <a
                href={`mailto:${SITE.email}`}
                className="transition-colors hover:text-primary"
              >
                {SITE.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <ClockIcon className="size-4 shrink-0 text-muted-foreground" />
              <span>
                {SITE.hours.days} · {SITE.hours.open}
              </span>
            </li>
          </ul>
        </div>

        {/* Nav */}
        <nav aria-label="Footer" className="flex flex-col gap-3 md:col-span-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Site
          </p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-foreground transition-colors hover:text-primary"
              >
                Home
              </Link>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact-us"
                className="text-foreground transition-colors hover:text-primary"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-start justify-between gap-3 px-6 py-6 text-xs uppercase tracking-[0.18em] text-muted-foreground md:flex-row md:items-center md:px-10">
          <p>
            © {year} {SITE.brand} · All rights reserved
          </p>
          <p>EPC — Philippines</p>
        </div>
      </div>
    </footer>
  );
}
