import type { Metadata } from "next";

import { AdminSettings } from "./admin-settings";

export const metadata: Metadata = { title: "System settings" };

// X6 · Admin — system settings.
export default function AdminSettingsPage() {
  return <AdminSettings />;
}
