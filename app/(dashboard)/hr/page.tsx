import type { Metadata } from "next";

import { HrHome } from "./hr-home";

export const metadata: Metadata = { title: "HR" };

// The HR module lands on the department dashboard (supersedes the old H1 redirect;
// OQ#7 deviation noted in docs/JCE-IMPLEMENTATION-PLAN.md). Employees stays its
// own tab. Thin Server shell around the client overview surface.
export default function HrPage() {
  return <HrHome />;
}
