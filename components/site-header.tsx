"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { FOOTER_LINKS, NAV_LINKS, SITE } from "@/lib/content/site";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Glass sticky nav (Website.html:38-53). Floating glass island, logo lockup +
// links + an orange-accent "Send an inquiry" CTA, and a burger that reveals a
// glass mobile menu at ≤900px. Hover surfaces are green-50 (orange is reserved
// for the CTA). Tag: Glass chrome.

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto mt-3 w-full max-w-6xl px-4 sm:px-6">
        <div className="glass-nav flex items-center gap-3 rounded-[var(--r-glass)] px-3 py-2.5 shadow-[var(--glass-shadow)]">
          {/* Logo lockup */}
          <Link
            href="/"
            aria-label={SITE.brand}
            className="focus-ring-jce flex items-center gap-2.5 rounded-md pr-2"
          >
            <Image
              src="/jce-logo.jpg"
              width={36}
              height={36}
              alt=""
              className="shrink-0 rounded-md shadow-[var(--solid-shadow)]"
            />
            <span className="leading-tight">
              <span className="block text-ui-14 font-bold tracking-tight text-jce-ink">
                JC Electrofields
              </span>
              <span className="block text-[11px] text-jce-ink-2">
                Power System, Inc.
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Primary"
            className="ml-auto hidden items-center gap-0.5 min-[900px]:flex"
          >
            {NAV_LINKS.map((link) =>
              "children" in link && link.children ? (
                <DropdownMenu key={link.href}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      data-active={isActive(pathname, link.href)}
                      className="focus-ring-jce group inline-flex items-center gap-1 rounded-md px-3 py-2 text-ui-14 font-medium text-jce-ink-2 transition-colors hover:bg-jce-green-50 hover:text-jce-green-900 data-[active=true]:text-jce-green-900"
                    >
                      {link.label}
                      <ChevronDownIcon
                        className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
                        aria-hidden
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-56 p-1.5">
                    <DropdownMenuItem
                      asChild
                      className="focus:bg-jce-green-50 focus:text-jce-green-900"
                    >
                      <Link
                        href={link.href}
                        className="text-[11px] tracking-[0.14em] text-jce-ink-2 uppercase"
                      >
                        All {link.label}
                      </Link>
                    </DropdownMenuItem>
                    {link.children.map((child) => (
                      <DropdownMenuItem
                        key={child.href}
                        asChild
                        className="focus:bg-jce-green-50 focus:text-jce-green-900"
                      >
                        <Link href={child.href}>{child.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={isActive(pathname, link.href)}
                  className="focus-ring-jce rounded-md px-3 py-2 text-ui-14 font-medium text-jce-ink-2 transition-colors hover:bg-jce-green-50 hover:text-jce-green-900 data-[active=true]:text-jce-green-900"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          {/* Orange-accent Contact CTA (desktop) */}
          <Button
            asChild
            variant="accent"
            className="ml-2 hidden h-10 px-4 min-[900px]:inline-flex"
          >
            <Link href="/contact-us">Send an inquiry</Link>
          </Button>

          {/* Burger (≤900px) */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="focus-ring-jce ml-auto grid size-11 place-items-center rounded-md border border-jce-line bg-white/60 text-jce-ink transition-colors hover:bg-jce-green-50 min-[900px]:hidden"
          >
            {open ? (
              <XIcon className="size-5" aria-hidden />
            ) : (
              <MenuIcon className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Glass mobile menu */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 w-full max-w-6xl px-4 sm:px-6 min-[900px]:hidden"
          >
            <nav
              aria-label="Mobile"
              className="glass flex flex-col rounded-[var(--r-glass)] p-2"
            >
              {[...NAV_LINKS, ...FOOTER_LINKS].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="focus-ring-jce flex min-h-11 items-center rounded-md px-3 text-ui-16 font-medium text-jce-ink transition-colors hover:bg-jce-green-50 hover:text-jce-green-900"
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild variant="accent" className="mt-2 h-12">
                <Link href="/contact-us" onClick={() => setOpen(false)}>
                  Send an inquiry
                </Link>
              </Button>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
