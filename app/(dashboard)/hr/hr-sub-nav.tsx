"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { hasGrant } from "@/lib/rbac";

// HR section sub-nav. The HR module (sidebar) links to /hr → the department
// Overview dashboard; Employees (H1) and the rest are their own tabs. Self-Service
// cross-links to /my-hr and is shown only to roles that hold the `self` grant
// (hidden, never disabled).
const TABS = [
  { href: "/hr", label: "Overview", module: "hr" as const },
  { href: "/hr/employees", label: "Employees", module: "hr" as const },
  { href: "/hr/timekeeping", label: "Timekeeping", module: "hr" as const },
  { href: "/hr/requests", label: "HR Requests", module: "hr" as const },
  { href: "/hr/news-careers", label: "News & Careers", module: "hr" as const },
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
      className="glass-nav inline-flex flex-wrap gap-0.5 rounded-(--r-solid) p-1"
    >
      {tabs.map((t) => {
        // Overview is the module home — EXACT match only, so it doesn't light up
        // on every /hr/* route (mirrors the sidebar's /dashboard precedent).
        const active =
          t.href === "/hr" ? pathname === "/hr" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-ring-jce inline-flex min-h-11 items-center rounded-(--r-input) px-3.5 text-ui-12 font-semibold transition-colors",
              active
                ? "bg-jce-green-50 text-jce-green-900"
                : "text-jce-ink-2 hover:bg-jce-green-50 hover:text-jce-green-900",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
