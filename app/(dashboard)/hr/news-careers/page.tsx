import type { Metadata } from "next";

import { NewsCareersCms } from "./news-careers-cms";

export const metadata: Metadata = { title: "News & Careers" };

// HR · News & Careers CMS — HR manages the public site's News posts + Careers
// openings (mirrors the BDD Website CMS). Thin server shell.
export default function NewsCareersPage() {
  return <NewsCareersCms />;
}
