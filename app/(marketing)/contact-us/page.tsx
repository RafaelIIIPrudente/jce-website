import type { Metadata } from "next";

import { EditorialHero } from "@/components/sections/editorial-hero";
import { ContactSplit } from "@/components/sections/contact-split";
import { ContactForm } from "@/components/sections/contact-form";
import { MapEmbed } from "@/components/sections/map-embed";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Send us a project brief — utility, developer, or industrial. We respond inside one business day.",
};

export default function ContactPage() {
  return (
    <>
      <EditorialHero
        variant="contact"
        eyebrow="Talk to us"
        title="Send a project brief."
        subtitle="We respond inside one business day to inquiries from utilities, developers, and industrial clients."
      />

      <ContactSplit form={<ContactForm />} />

      <MapEmbed />
    </>
  );
}
