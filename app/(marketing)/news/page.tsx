import type { Metadata } from "next";

import { WebSection } from "@/components/sections/web-section";
import { NewsHero } from "@/components/sections/web-news-hero";
import { WebNewsList } from "@/components/sections/web-news-list";
import { WebCta } from "@/components/sections/web-cta";

export const metadata: Metadata = {
  title: "News",
  description:
    "Project milestones and perspectives on Philippine power infrastructure — substations, transmission, solar and NGCP direct connection.",
};

// S6 · News / Blog (web-pages-b.jsx:336-367). Indexable article cards.
export default function NewsPage() {
  return (
    <>
      <NewsHero />
      <WebSection>
        <WebNewsList />
      </WebSection>
      <WebCta
        heading="Have a project in mind?"
        sub="Tell us about your power requirement — we'll respond with a capability profile and indicative scope."
      />
    </>
  );
}
