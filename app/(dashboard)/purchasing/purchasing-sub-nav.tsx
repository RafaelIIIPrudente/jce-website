"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { hasGrant } from "@/lib/rbac";

// Purchasing sub-nav (U1–U13 + Phase 2). The whole module — and this sub-nav —
// render ONLY for roles with a `pur` grant (owner/purchsup F; admin/acctglead/
// pmhead/warehouse R; hidden otherwise). Trackers are reached from a PO row's
// tracker cell + the PO detail, not a top tab.

const tabClass = (active: boolean) =>
  cn(
    "focus-ring-jce rounded-[7px] px-3.5 py-1.5 text-ui-12 font-semibold transition-colors",
    active
      ? "bg-jce-green-700 text-primary-foreground"
      : "text-jce-ink-2 hover:text-jce-green-900",
  );

const MAIN = [
  {
    href: "/purchasing/dashboard",
    label: "Dashboard",
    prefixes: ["/purchasing/dashboard"],
  },
  {
    href: "/purchasing/orders",
    label: "PO Ledger",
    prefixes: ["/purchasing/orders"],
  },
  { href: "/purchasing/rfp", label: "RFP", prefixes: ["/purchasing/rfp"] },
  {
    href: "/purchasing/suppliers",
    label: "Suppliers",
    prefixes: ["/purchasing/suppliers"],
  },
  {
    href: "/purchasing/requisitions",
    label: "Requisitions",
    prefixes: ["/purchasing/requisitions"],
  },
  {
    href: "/purchasing/approvals",
    label: "Approvals",
    prefixes: ["/purchasing/approvals"],
  },
  {
    href: "/purchasing/phase-2/rfq",
    label: "Phase 2",
    prefixes: ["/purchasing/phase-2"],
  },
  {
    href: "/purchasing/audit",
    label: "Audit Log",
    prefixes: ["/purchasing/audit"],
  },
];

export function PurchasingSubNav() {
  const pathname = usePathname();
  const { role } = useJce();
  if (!hasGrant(role, "pur")) return null;
  return (
    <nav
      aria-label="Purchasing"
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

// Phase-2 sub-nav (U14–U24) — the secondary rail inside /purchasing/phase-2.
export function PurchasingPhase2SubNav() {
  const pathname = usePathname();
  const tabs = [
    {
      href: "/purchasing/phase-2/rfq",
      label: "RFQ · U15",
      prefixes: ["/purchasing/phase-2/rfq"],
    },
    {
      href: "/purchasing/phase-2/catalog",
      label: "Catalog · U17",
      prefixes: ["/purchasing/phase-2/catalog"],
    },
    {
      href: "/purchasing/phase-2/price-history",
      label: "Price history · U18",
      prefixes: ["/purchasing/phase-2/price-history"],
    },
    {
      href: "/purchasing/phase-2/lead-time",
      label: "Lead-time · U20",
      prefixes: ["/purchasing/phase-2/lead-time"],
    },
    {
      href: "/purchasing/phase-2/cycle-time",
      label: "Cycle-time · U23",
      prefixes: ["/purchasing/phase-2/cycle-time"],
    },
    {
      href: "/purchasing/phase-2/budget",
      label: "Budget · U21",
      prefixes: ["/purchasing/phase-2/budget"],
    },
    {
      href: "/purchasing/phase-2/bir-2307",
      label: "BIR 2307 · U19",
      prefixes: ["/purchasing/phase-2/bir-2307"],
    },
    {
      href: "/purchasing/phase-2/blanket",
      label: "Blanket · U24",
      prefixes: ["/purchasing/phase-2/blanket"],
    },
    {
      href: "/purchasing/phase-2/mobile",
      label: "Mobile · U22",
      prefixes: ["/purchasing/phase-2/mobile"],
    },
    {
      href: "/purchasing/phase-2/merge",
      label: "Merge · U14",
      prefixes: ["/purchasing/phase-2/merge"],
    },
  ];
  return (
    <nav
      aria-label="Purchasing Phase 2"
      className="glass-nav inline-flex flex-wrap gap-0.5 rounded-[10px] p-1"
    >
      {tabs.map((t) => (
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
