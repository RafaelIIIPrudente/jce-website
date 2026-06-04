"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { hasGrant } from "@/lib/rbac";

// HR section sub-nav. The HR module (sidebar) links to /hr → redirects to
// Employees (H1 landing, OQ#7). Self-Service cross-links to /my-hr and is shown
// only to roles that hold the `self` grant (hidden, never disabled).
const TABS = [
  { href: "/hr/employees", label: "Employees", module: "hr" as const },
  { href: "/hr/timekeeping", label: "Timekeeping", module: "hr" as const },
  { href: "/hr/requests", label: "HR Requests", module: "hr" as const },
  { href: "/my-hr", label: "Self-Service", module: "self" as const },
  { href: "/hr/audit", label: "Audit", module: "hr" as const },
];

export function HrSubNav() {
  const pathname = usePathname();
  const { role } = useJce();
  const tabs = TABS.filter((t) => hasGrant(role, t.module));

  return (
    <nav
      aria-label="HR"
      className="glass-nav inline-flex flex-wrap gap-0.5 rounded-[10px] p-1"
    >
      {tabs.map((t) => {
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
