import type { ReactNode } from "react";

// Auth route group — no marketing header/footer, no dashboard shell. The login
// screen owns its full-bleed glass-on-backdrop stage.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[100dvh] flex-col">{children}</div>;
}
