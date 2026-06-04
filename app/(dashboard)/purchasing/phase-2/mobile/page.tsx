import type { Metadata } from "next";

import { MobileApprovals } from "./mobile";

export const metadata: Metadata = { title: "Mobile approvals" };

export default function MobilePage() {
  return <MobileApprovals />;
}
