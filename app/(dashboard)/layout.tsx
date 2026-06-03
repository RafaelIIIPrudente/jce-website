import type { Metadata } from "next";
import type { ReactNode } from "react";

import { JceProvider } from "@/lib/mock/role-context";
import { AppShell } from "@/components/jce/app-shell";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · JCE System" },
};

// Dashboard route group — wraps every screen in the mock role provider + the
// glass app shell. proxy.ts stays short-circuited; /dashboard is NOT gated
// (mock client-side RBAC only).
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <JceProvider>
      <AppShell>{children}</AppShell>
    </JceProvider>
  );
}
