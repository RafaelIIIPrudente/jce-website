import type { Metadata } from "next";

import { LeadTime } from "./lead-time";

export const metadata: Metadata = { title: "Lead-time" };

export default function LeadTimePage() {
  return <LeadTime />;
}
