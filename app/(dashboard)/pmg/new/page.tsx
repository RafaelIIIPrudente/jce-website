import type { Metadata } from "next";

import { NewProject } from "./new-project";

export const metadata: Metadata = { title: "New project" };

// P3 BOQ import wizard + P4 clone / manual builder.
export default function NewProjectPage() {
  return <NewProject />;
}
