import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import type { ReactNode } from "react";

import { SITE } from "@/lib/content/site";

function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
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
      aria-hidden="true"
      className={className}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.546 15.568V8.432L15.818 12l-6.272 3.568Z" />
    </svg>
  );
}

export function ContactSplit({ form }: { form: ReactNode }) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid w-full max-w-site gap-12 px-6 py-section md:grid-cols-12 md:px-10">
        <div className="md:col-span-7">{form}</div>

        <aside className="flex flex-col gap-8 md:col-span-5">
          <div className="flex flex-col gap-3">
            <p className="text-eyebrow uppercase text-muted-foreground">
              Office
            </p>
            <ul className="flex flex-col gap-3 text-body text-foreground">
              <li className="flex items-start gap-3">
                <MapPinIcon
                  className="mt-1 size-4 shrink-0 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <span>
                  {SITE.address.line1}
                  <br />
                  {SITE.address.line2}
                  <br />
                  {SITE.address.country}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon
                  className="size-4 shrink-0 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <a
                  href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                  className="transition-colors hover:text-primary"
                >
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon
                  className="size-4 shrink-0 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition-colors hover:text-primary"
                >
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <ClockIcon
                  className="size-4 shrink-0 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <span>
                  {SITE.hours.days} · {SITE.hours.open}
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-eyebrow uppercase text-muted-foreground">
              Social
            </p>
            <div className="flex items-center gap-2">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <FacebookGlyph className="size-4" />
              </a>
              <a
                href={SITE.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="inline-flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <YoutubeGlyph className="size-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-6">
            <p className="text-eyebrow uppercase text-muted-foreground">
              Response time
            </p>
            <p className="text-body-sm text-muted-foreground">
              We respond inside one business day during {SITE.hours.days}.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
