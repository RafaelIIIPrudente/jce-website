import type { Metadata } from "next";

import { ArchivedList } from "./archived-list";

export const metadata: Metadata = { title: "Archived employees" };

// H4 · Archived employees.
export default function ArchivedPage() {
  return <ArchivedList />;
}
