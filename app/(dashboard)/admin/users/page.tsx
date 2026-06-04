import type { Metadata } from "next";

import { AdminUsers } from "./admin-users";

export const metadata: Metadata = { title: "Users & roles" };

// X5 · Admin — users & roles.
export default function AdminUsersPage() {
  return <AdminUsers />;
}
