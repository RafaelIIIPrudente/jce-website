"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

// Accounting section sub-nav (acc-module.jsx:16-25). The Accounting module
// (sidebar) links to /accounting → redirects to Payroll (A4 landing, OQ#7).
// The whole module is gated in the sidebar by hasGrant(role,'acc') — owner F,
// acctglead F, payroll E, admin R; HIDDEN for roles without the grant.
const TABS = [
  {
    href: "/accounting/payroll",
    label: "Payroll",
    prefixes: [
      "/accounting/payroll",
      "/accounting/payslips",
      "/accounting/loans",
      "/accounting/chart-of-accounts",
      "/accounting/settings",
    ],
  },
  {
    href: "/accounting/sales",
    label: "Sales",
    prefixes: ["/accounting/sales"],
  },
  {
    href: "/accounting/collections",
    label: "Collections",
    prefixes: ["/accounting/collections"],
  },
  {
    href: "/accounting/vouchers",
    label: "Payable Voucher",
    prefixes: ["/accounting/vouchers"],
  },
  {
    href: "/accounting/disbursement",
    label: "Disbursement",
    prefixes: ["/accounting/disbursement"],
  },
  {
    href: "/accounting/journal",
    label: "Journal",
    prefixes: ["/accounting/journal"],
  },
  {
    href: "/accounting/reporting",
    label: "Reporting",
    prefixes: ["/accounting/reporting"],
  },
  {
    href: "/accounting/clients",
    label: "Clients",
    prefixes: ["/accounting/clients"],
  },
];

export function AccSubNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Accounting"
      className="glass-nav inline-flex flex-wrap gap-0.5 rounded-[10px] p-1"
    >
      {TABS.map((t) => {
        const active = t.prefixes.some((p) => pathname.startsWith(p));
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

// Payroll secondary nav (acc-module.jsx:57-63) — Summary A4/A5 · Payslips A6 ·
// Loans A3 · Chart of Accounts A2 · Settings A1.
const PAYROLL_TABS = [
  { href: "/accounting/payroll", label: "Summary · A4/A5" },
  { href: "/accounting/payslips", label: "Payslips · A6" },
  { href: "/accounting/loans", label: "Loans · A3" },
  { href: "/accounting/chart-of-accounts", label: "Chart of Accounts · A2" },
  { href: "/accounting/settings", label: "Settings · A1" },
];

export function PayrollSubNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Payroll"
      className="glass-nav inline-flex flex-wrap gap-0.5 rounded-[10px] p-1"
    >
      {PAYROLL_TABS.map((t) => {
        const active =
          t.href === "/accounting/payroll"
            ? pathname === "/accounting/payroll" ||
              pathname.startsWith("/accounting/payroll/")
            : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-ring-jce rounded-[7px] px-3 py-1.5 text-ui-12 font-semibold transition-colors",
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

// Journal secondary nav (acc-module.jsx:139-156) — A16 JV · A17 Cash Advances.
const JOURNAL_TABS = [
  { href: "/accounting/journal", label: "Journal Vouchers · A16" },
  { href: "/accounting/journal/cash-advances", label: "Cash Advances · A17" },
];

export function JournalSubNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Journal"
      className="glass-nav inline-flex flex-wrap gap-0.5 rounded-[10px] p-1"
    >
      {JOURNAL_TABS.map((t) => {
        const active =
          t.href === "/accounting/journal"
            ? pathname === "/accounting/journal"
            : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-ring-jce rounded-[7px] px-3 py-1.5 text-ui-12 font-semibold transition-colors",
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
