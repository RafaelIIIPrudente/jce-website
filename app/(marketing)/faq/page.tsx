import type { Metadata } from "next";

import { FaqHero } from "@/components/sections/faq/web-faq-hero";
import { WebSection } from "@/components/sections/kit/web-section";
import { WebFaq } from "@/components/sections/faq/web-faq";
import { WebCta } from "@/components/sections/kit/web-cta";
import { FAQS } from "@/lib/content/website";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to the questions buyers ask most about JCE's power capabilities — substations up to 230 KV, NGCP direct connection, transformers, and solar EPC.",
};

// S9 · FAQ (web-pages-b.jsx:415-444). Accordion + FAQPage structured data (GEO/SEO).
export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // FAQPage structured data — static content, no user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqHero />
      <WebSection>
        <WebFaq />
      </WebSection>
      <WebCta
        heading="Still have a question?"
        sub="Send it our way — our team responds inside one business day."
        ctaLabel="Ask us directly"
      />
    </>
  );
}
