import { redirect } from "next/navigation";

// The Admin module (sidebar) points at /admin; land on the Users screen.
export default function AdminIndexPage() {
  redirect("/admin/users");
}
