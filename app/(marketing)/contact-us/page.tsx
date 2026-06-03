import type { Metadata } from "next";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import { WebHero } from "@/components/sections/web-hero";
import { ContactForm } from "@/components/sections/contact-form";
import { MapEmbed } from "@/components/sections/map-embed";
import { Reveal } from "@/components/sections/web-reveal";
import { SITE } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Send us a project brief — utility, developer, or industrial. We respond inside one business day. JC Electrofields Power System, Valenzuela City.",
};

// S8 · Contact / Inquiry (FLAGSHIP). Glass contact-info aside + solid inquiry
// form (web-pages-b.jsx:104-317). Split collapses to one column at ≤900px.
export default function ContactPage() {
  return (
    <>
      <WebHero
        eyebrow="Get in touch"
        title="Send a project brief."
        sub="Tell us about your power requirement. Required fields are marked with an asterisk — we respond inside one business day."
      />

      <section className="px-5 py-16 sm:py-20 md:py-24">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 min-[900px]:grid-cols-12">
          <Reveal className="min-[900px]:col-span-5">
            <aside className="glass flex h-full flex-col gap-6 rounded-[var(--r-glass)] p-6">
              <InfoBlock icon={MapPinIcon} label="Office">
                {SITE.address.line1}
                <br />
                {SITE.address.line2}
                <br />
                {SITE.address.country}
              </InfoBlock>
              <InfoBlock icon={PhoneIcon} label="Phone">
                <a
                  href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                  className="transition-colors hover:text-jce-green-700"
                >
                  {SITE.phone}
                </a>
              </InfoBlock>
              <InfoBlock icon={MailIcon} label="Email">
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition-colors hover:text-jce-green-700"
                >
                  {SITE.email}
                </a>
              </InfoBlock>
              <InfoBlock icon={ClockIcon} label="Hours">
                {SITE.hours.days} · {SITE.hours.open}
              </InfoBlock>
              <div className="mt-auto rounded-[var(--r-solid)] border border-jce-line bg-card p-4 text-ui-12 text-jce-ink-2">
                We respond inside one business day during {SITE.hours.days}.
              </div>
            </aside>
          </Reveal>

          <div className="min-[900px]:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>

      <MapEmbed />
    </>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPinIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[10px] bg-jce-green-50 text-jce-green-700">
        <Icon className="size-4" strokeWidth={1.75} aria-hidden />
      </span>
      <div>
        <div className="text-[11px] tracking-[0.16em] text-jce-ink-2 uppercase">
          {label}
        </div>
        <div className="mt-1 text-ui-14 text-jce-ink">{children}</div>
      </div>
    </div>
  );
}
