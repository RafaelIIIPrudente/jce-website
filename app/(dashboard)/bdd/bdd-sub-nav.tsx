"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

// BDD section sub-nav. The BDD module (sidebar) links to /bdd → redirects to
// Sales Orders (B1 landing, OQ#7).
const TABS = [
  { href: "/bdd/sales-orders", label: "Sales Orders" },
  { href: "/bdd/offers", label: "Offers" },
  { href: "/bdd/quotations", label: "Quotations" },
  { href: "/bdd/website", label: "Website" },
  { href: "/bdd/inquiries", label: "Inquiries" },
  { href: "/bdd/audit", label: "Audit" },
] as const;

export function BddSubNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="BDD"
      className="glass-nav inline-flex flex-wrap gap-0.5 rounded-[10px] p-1"
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
