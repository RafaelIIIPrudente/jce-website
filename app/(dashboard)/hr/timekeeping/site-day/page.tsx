import type { Metadata } from "next";

import { SiteDaySheet } from "./site-day-sheet";

export const metadata: Metadata = { title: "Timekeeping" };

// H5b · Site Day Sheet. Optional ?site=&date= deep-link (e.g. from the import
// result panel) pre-selects the recording context; otherwise it starts blank.
export default async function SiteDayPage({
  searchParams,
}: {
  searchParams: Promise<{ site?: string; date?: string }>;
}) {
  const sp = await searchParams;
  return (
    <SiteDaySheet
      initialSite={typeof sp.site === "string" ? sp.site : ""}
      initialDate={typeof sp.date === "string" ? sp.date : undefined}
    />
  );
}
