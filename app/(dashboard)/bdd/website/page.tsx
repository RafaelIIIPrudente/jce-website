import type { Metadata } from "next";

import { WebsiteCms } from "./website-cms";

export const metadata: Metadata = { title: "Website" };

// B7/B8/B9 · Website content CMS.
export default function WebsitePage() {
  return <WebsiteCms />;
}
