import type { ReactNode } from "react";

import { AdminSubNav } from "./admin-sub-nav";

// Admin section shell — the Users / Settings sub-nav over the X5/X6 screens.
// Visibility is gated in the sidebar (admin module shown only to admin/owner);
// the screens themselves render read-only for any other role reaching them.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto mb-5 w-full max-w-6xl">
        <AdminSubNav />
      </div>
      {children}
    </>
  );
}
