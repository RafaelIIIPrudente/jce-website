"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { hasGrant } from "@/lib/rbac";

// Warehouse sub-nav (W1–W13). Renders only for roles with a `wh` grant
// (owner/warehouse F; siteeng E; admin/pmhead/purchsup R; hidden otherwise).
// Trackers/forms are reached from a register row, not a top tab.

const tabClass = (active: boolean) =>
  cn(
    "focus-ring-jce rounded-[7px] px-3.5 py-1.5 text-ui-12 font-semibold transition-colors",
    active
      ? "bg-jce-green-700 text-primary-foreground"
      : "text-jce-ink-2 hover:text-jce-green-900",
  );

const MAIN = [
  {
    href: "/warehouse/dashboard",
    label: "Dashboard",
    prefixes: ["/warehouse/dashboard"],
  },
  {
    href: "/warehouse/ledger",
    label: "Stock Ledger",
    prefixes: ["/warehouse/ledger"],
  },
  {
    href: "/warehouse/items",
    label: "Item Master",
    prefixes: ["/warehouse/items"],
  },
  { href: "/warehouse/mrr", label: "MRR", prefixes: ["/warehouse/mrr"] },
  {
    href: "/warehouse/releases",
    label: "Release",
    prefixes: ["/warehouse/releases"],
  },
  {
    href: "/warehouse/transfers",
    label: "Transfer",
    prefixes: ["/warehouse/transfers"],
  },
  {
    href: "/warehouse/movements",
    label: "Movements",
    prefixes: ["/warehouse/movements"],
  },
  {
    href: "/warehouse/verification",
    label: "MR Verification",
    prefixes: ["/warehouse/verification"],
  },
  {
    href: "/warehouse/phase-2/reorder",
    label: "Phase 2",
    prefixes: ["/warehouse/phase-2"],
  },
  {
    href: "/warehouse/audit",
    label: "Audit Log",
    prefixes: ["/warehouse/audit"],
  },
];

export function WarehouseSubNav() {
  const pathname = usePathname();
  const { role } = useJce();
  if (!hasGrant(role, "wh")) return null;
  return (
    <nav
      aria-label="Warehouse"
      className="glass-nav inline-flex flex-wrap gap-0.5 rounded-[10px] p-1"
    >
      {MAIN.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={
            t.prefixes.some((p) => pathname.startsWith(p)) ? "page" : undefined
          }
          className={tabClass(t.prefixes.some((p) => pathname.startsWith(p)))}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

// Phase-2 secondary rail (W10–W13).
export function WarehousePhase2SubNav() {
  const pathname = usePathname();
  const tabs = [
    { href: "/warehouse/phase-2/reorder", label: "Reorder · W10" },
    { href: "/warehouse/phase-2/stock-take", label: "Stock-take · W11" },
    { href: "/warehouse/phase-2/custody", label: "Custody · W12" },
    { href: "/warehouse/phase-2/bins", label: "Bins · W13" },
  ];
  return (
    <nav
      aria-label="Warehouse Phase 2"
      className="glass-nav inline-flex flex-wrap gap-0.5 rounded-[10px] p-1"
    >
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={pathname.startsWith(t.href) ? "page" : undefined}
          className={tabClass(pathname.startsWith(t.href))}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
