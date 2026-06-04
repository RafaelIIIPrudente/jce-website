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
  const burgerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLElement>(null);
  const wasOpen = React.useRef(false);

  // While the menu is open: lock body scroll, dismiss on Escape, dismiss when the
  // viewport grows past the desktop breakpoint, and move focus into the panel.
  // Everything is restored on close/unmount (no leaked scroll-lock or listeners).
  React.useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 900px)");
    const onDesktop = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);

    const raf = window.requestAnimationFrame(() =>
      panelRef.current?.focus({ preventScroll: true }),
    );

    return () => {
      body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
      window.cancelAnimationFrame(raf);
    };
  }, [open]);

  // Return focus to the burger when the menu closes (skip the initial mount).
  React.useEffect(() => {
    if (wasOpen.current && !open)
      burgerRef.current?.focus({ preventScroll: true });
    wasOpen.current = open;
  }, [open]);

  return (
    <header className="sticky top-0 z-40">
      <div className="relative z-10 mx-auto mt-3 w-full max-w-6xl px-4 sm:px-6">
        <div className="glass-nav relative isolate flex items-center gap-3 rounded-(--r-glass) px-3 py-2.5 shadow-(--glass-shadow)">
          {/* Faint circuit texture inside the glass — decorative, clipped to its
              own rounded layer so it never clips the items' focus rings. */}
          <span
            aria-hidden
            className="circuit-field pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-(--r-glass)"
          />
          {/* Logo lockup */}
          <Link
            href="/"
            aria-label={SITE.brand}
            className="focus-ring-jce flex min-w-0 items-center gap-2.5 rounded-md pr-2"
          >
            <Image
              src="/jce-logo.jpg"
              width={36}
              height={36}
              alt=""
              className="shrink-0 rounded-md shadow-(--solid-shadow)"
            />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-ui-14 font-bold tracking-tight text-jce-ink">
                JC Electrofields
              </span>
              <span className="block truncate text-[11px] text-jce-ink-2">
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
                      className="group focus-ring-jce relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-ui-14 font-medium text-jce-ink-2 transition-colors hover:bg-jce-green-50 hover:text-jce-green-900 data-[active=true]:text-jce-green-900"
                    >
                      {link.label}
                      <ChevronDownIcon
                        className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
                        aria-hidden
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-3 bottom-1 h-0.5 rounded-(--r-pill) bg-jce-cyan opacity-0 transition-opacity duration-200 group-hover:opacity-40 group-data-[active=true]:opacity-100"
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
                  className="group focus-ring-jce relative rounded-md px-3 py-2 text-ui-14 font-medium text-jce-ink-2 transition-colors hover:bg-jce-green-50 hover:text-jce-green-900 data-[active=true]:text-jce-green-900"
                >
                  {link.label}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-3 bottom-1 h-0.5 rounded-(--r-pill) bg-jce-cyan opacity-0 transition-opacity duration-200 group-hover:opacity-40 group-data-[active=true]:opacity-100"
                  />
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
            ref={burgerRef}
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

      {/* Glass mobile menu + dismiss backdrop (≤900px). The backdrop sits below
          the nav bar (which is z-10) so the burger/close control stays tappable;
          tapping it, Escape, a link tap, or resizing to desktop all close. */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="nav-backdrop"
            aria-hidden
            onClick={() => setOpen(false)}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-0 bg-jce-dark/40 min-[900px]:hidden"
          />
        ) : null}
        {open ? (
          <motion.div
            key="nav-menu"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto mt-2 w-full max-w-6xl px-4 sm:px-6 min-[900px]:hidden"
          >
            <nav
              ref={panelRef}
              tabIndex={-1}
              aria-label="Mobile"
              className="glass flex max-h-[calc(100svh-5.5rem)] flex-col rounded-(--r-glass) p-2 focus:outline-none"
            >
              {/* Scrolls internally on short viewports so every link stays
                  reachable; the CTA below is pinned and always in reach. */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {[...NAV_LINKS, ...FOOTER_LINKS].map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      data-active={isActive(pathname, link.href)}
                      className="group focus-ring-jce relative flex min-h-11 items-center rounded-md px-3 text-ui-16 font-medium text-jce-ink transition-colors hover:bg-jce-green-50 hover:text-jce-green-900 data-[active=true]:text-jce-green-900"
                    >
                      <span
                        aria-hidden
                        className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-(--r-pill) bg-jce-cyan opacity-0 transition-opacity group-data-[active=true]:opacity-100"
                      />
                      {link.label}
                    </Link>
                    {"children" in link && link.children ? (
                      <div className="mb-1 ml-3 flex flex-col border-l border-jce-line pl-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            data-active={isActive(pathname, child.href)}
                            className="focus-ring-jce flex min-h-11 items-center rounded-md px-3 text-ui-14 font-medium text-jce-ink-2 transition-colors hover:bg-jce-green-50 hover:text-jce-green-900 data-[active=true]:text-jce-green-900"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="mt-2 border-t border-jce-line pt-2">
                <Button asChild variant="accent" className="h-12 w-full">
                  <Link href="/contact-us" onClick={() => setOpen(false)}>
                    Send an inquiry
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
