import type { Metadata } from "next";

import { NotificationsCenter } from "./notifications-center";

export const metadata: Metadata = { title: "Notifications" };

// X4 · Notifications center.
export default function NotificationsPage() {
  return <NotificationsCenter />;
}
