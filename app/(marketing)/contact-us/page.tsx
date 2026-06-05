import type { Metadata } from "next";

import { ContactHero } from "@/components/sections/contact/web-contact-hero";
import { ContactAside } from "@/components/sections/contact/web-contact-aside";
import { ContactForm } from "@/components/sections/contact/contact-form";
import { MapEmbed } from "@/components/sections/contact/map-embed";
import { Reveal } from "@/components/sections/kit/web-reveal";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Send us a project brief — utility, developer, or industrial. We respond inside one business day. JC Electrofields Power System, Valenzuela City.",
};

// S8 · Contact / Inquiry (FLAGSHIP). Premium flow: dark electrified ContactHero →
// light contact section (circuit-card glass aside + circuit-card solid form) →
// the cohesive MapEmbed closer. The split collapses to one column at ≤900px.
export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <section className="px-5 py-16 sm:py-20 md:py-24">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 min-[900px]:grid-cols-12">
          <Reveal className="min-[900px]:col-span-5">
            <ContactAside />
          </Reveal>

          <Reveal delay={0.08} className="min-[900px]:col-span-7">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <MapEmbed />
    </>
  );
}
