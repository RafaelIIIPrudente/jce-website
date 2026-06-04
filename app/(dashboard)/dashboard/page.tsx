import type { Metadata } from "next";

import { DashboardHome } from "./dashboard-home";

export const metadata: Metadata = { title: "Home" };

// X3 · Role-aware home. Content is keyed off the active mock role (client), so
// the page is a thin server wrapper around the client home surface.
export default function DashboardPage() {
  return <DashboardHome />;
}
