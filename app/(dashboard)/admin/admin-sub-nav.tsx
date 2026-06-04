"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

// Admin section sub-nav (Users & roles / System settings). The Admin module
// (sidebar) links to /admin which redirects here.
const TABS = [
  { href: "/admin/users", label: "Users & roles" },
  { href: "/admin/settings", label: "System settings" },
] as const;

export function AdminSubNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Admin"
      className="glass-nav inline-flex gap-0.5 rounded-[10px] p-1"
    >
      {TABS.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-ring-jce rounded-[7px] px-3.5 py-1.5 text-ui-12 font-semibold transition-colors",
              active
                ? "bg-jce-green-700 text-primary-foreground"
                : "text-jce-ink-2 hover:text-jce-green-900",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
