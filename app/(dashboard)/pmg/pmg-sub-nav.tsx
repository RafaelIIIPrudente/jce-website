"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

// PMG lives at /pmg (NEVER /projects — that namespace is the marketing site).
// The module (sidebar) links to /pmg → redirects to Dashboard (P1, OQ#7). The
// whole module is gated in the sidebar by hasGrant(role,'pmg') — owner/pmhead F;
// admin/timekeeper/purchsup/warehouse/siteeng R; hidden otherwise.

const tabClass = (active: boolean) =>
  cn(
    "focus-ring-jce rounded-[7px] px-3.5 py-1.5 text-ui-12 font-semibold transition-colors",
    active
      ? "bg-jce-green-700 text-primary-foreground"
      : "text-jce-ink-2 hover:text-jce-green-900",
  );

const MAIN = [
  { href: "/pmg/dashboard", label: "Dashboard", prefixes: ["/pmg/dashboard"] },
  {
    href: "/pmg/portfolio",
    label: "Portfolio",
    prefixes: ["/pmg/portfolio", "/pmg/projects", "/pmg/new"],
  },
  {
    href: "/pmg/material-requests",
    label: "Material Requests",
    prefixes: ["/pmg/material-requests"],
  },
  { href: "/pmg/phase-2/photos", label: "Phase 2", prefixes: ["/pmg/phase-2"] },
  { href: "/pmg/audit", label: "Audit", prefixes: ["/pmg/audit"] },
];

export function PmgSubNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Project Management"
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

// Project workspace sub-nav (pmg-module.jsx:32-39).
export function ProjectSubNav({ code }: { code: string }) {
  const pathname = usePathname();
  const base = `/pmg/projects/${code}`;
  const tabs = [
    { seg: "header", label: "Header · P5" },
    { seg: "boq", label: "BOQ · P6" },
    { seg: "variations", label: "Variation Orders · P7" },
    { seg: "accomplishment", label: "Accomplishment · P8" },
    { seg: "billing", label: "Billing · P9" },
    { seg: "timeline", label: "Timeline · P12" },
  ];
  return (
    <nav
      aria-label="Project workspace"
      className="glass-nav inline-flex flex-wrap gap-0.5 rounded-[10px] p-1"
    >
      {tabs.map((t) => {
        const href = `${base}/${t.seg}`;
        return (
          <Link
            key={t.seg}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className={tabClass(pathname === href)}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

// Phase-2 sub-nav (pmg-module.jsx:21-28).
export function Phase2SubNav() {
  const pathname = usePathname();
  const tabs = [
    { href: "/pmg/phase-2/photos", label: "Photos · P14" },
    { href: "/pmg/phase-2/templates", label: "Templates · P15" },
    { href: "/pmg/phase-2/s-curve", label: "S-curve · P16" },
    { href: "/pmg/phase-2/traceability", label: "Traceability · P17" },
    { href: "/pmg/phase-2/doc-pack", label: "Doc Pack · P18" },
    { href: "/pmg/phase-2/budget", label: "Budget · P19" },
  ];
  return (
    <nav
      aria-label="Phase 2"
      className="glass-nav inline-flex flex-wrap gap-0.5 rounded-[10px] p-1"
    >
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={pathname === t.href ? "page" : undefined}
          className={tabClass(pathname === t.href)}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
