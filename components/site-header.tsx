"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { FOOTER_LINKS, NAV_LINKS, SITE } from "@/lib/content/site";
import { OmegaMark } from "@/components/sections/kit/web-omega-mark";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dark-aware condensing site nav. Fixed overlay chrome that reads the page's
// leading hero: a page that opens on a dark hero tags that <section> with
// `data-nav-overlay`, and while the nav floats over it the bar is OVERLAY mode —
// transparent, light wordmark + links, no pill. Scroll the hero away (or land on
// a page with no sentinel) and it CONDENSES into the refined glass island with
// dark ink. The boxless Ω (ohms) mark + wordmark recolour with the mode; the lone
// constant is the deep-amber inquiry CTA. Every transition is opacity/colour/
// transform (no layout thrash), is suppressed on first paint so the correct mode
// renders without a settle-flash, and collapses to instant under reduced motion
// via the global reduce block. Layout is a true 3-zone grid (wordmark · nav ·
// action) so the nav reads dead-centre, never false-centred. Tag: Glass chrome.

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

// Sync the overlay/condensed decision BEFORE the first post-hydration paint so a
// dark-hero page doesn't flash the glass island; falls back to useEffect on the
// server (where layout effects are a no-op) to avoid the SSR warning.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

// The one anchor that stays put across both modes. Deep burnt amber
// (cyan-deep #9a4d06 — white text clears AA at 6.08:1, unlike the brighter
// orange-600/500) with a dark inset bevel; hover LIFTS (shadow + arrow nudge, no
// garish colour flip), ≥44px target, double-ring focus. Shared by the desktop bar
// and the pinned mobile-menu footer so the conversion action reads identically.
function InquiryCta({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/contact-us"
      onClick={onClick}
      className={cn(
        "group/cta focus-ring-jce relative inline-flex min-h-11 items-center justify-center gap-1.5 rounded-(--r-input) bg-jce-cyan-deep px-4 text-ui-14 font-semibold text-white shadow-(--shadow-soft) ring-1 ring-inset ring-black/10 transition-[box-shadow] duration-300 ease-(--ease-editorial) hover:shadow-(--shadow-elevated)",
        className,
      )}
    >
      Send an inquiry
      <ArrowUpRightIcon
        aria-hidden
        className="size-4 transition-transform duration-300 ease-(--ease-editorial) group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
      />
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [overlay, setOverlay] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const burgerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLElement>(null);
  const wasOpen = React.useRef(false);

  // Dark-hero awareness. Observe the page's leading dark hero (tagged
  // `data-nav-overlay`); while it is still behind the bar → OVERLAY, once it
  // scrolls past the nav's lower edge → CONDENSED. The IntersectionObserver reads
  // the real (Lenis-smoothed) scroll position, so it works under smooth scroll.
  // No sentinel on the page → condensed glass island always. Re-runs per route.
  useIsoLayoutEffect(() => {
    const sentinel = document.querySelector("[data-nav-overlay]");
    if (!sentinel) {
      setOverlay(false);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setOverlay(entry?.isIntersecting ?? false),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [pathname]);

  // Enable transitions only AFTER the first paint, so the initial overlay sync
  // (above, pre-paint) lands instantly — no glass-island fade or dark-on-dark
  // text blip on a hero-page load. Scroll-driven mode changes animate normally.
  // Deferred via rAF so the duration-0 first paint commits before transitions arm.
  React.useEffect(() => {
    const raf = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

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

  // First-paint transitions are instant (duration-0); they animate once mounted.
  const txn = mounted ? "duration-300 ease-(--ease-editorial)" : "duration-0";

  // Mode-aware link + underline treatments. Light over the dark hero (amber-bright
  // spark on the active route); dark ink on the glass island (brand-green
  // authority line). The underline draws in from the leading edge of the label —
  // never the old opacity fade.
  const linkBase =
    "group focus-ring-jce relative inline-flex min-h-11 items-center rounded-md px-3 text-ui-14 font-medium tracking-[-0.01em] transition-colors";
  const linkColor = overlay
    ? "text-jce-dark-ink-2 hover:bg-white/10 hover:text-jce-dark-ink data-[active=true]:text-jce-dark-ink"
    : "text-jce-ink-2 hover:bg-jce-green-50 hover:text-jce-green-900 data-[active=true]:text-jce-green-900";
  const underline = cn(
    "pointer-events-none absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 rounded-(--r-pill) transition-transform group-hover:scale-x-100 group-data-[active=true]:scale-x-100",
    txn,
    overlay ? "bg-jce-cyan-bright" : "bg-jce-green-700",
  );

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Overlay scrim — a faint top vignette that guarantees light-text legibility
          over busy hero imagery; fades out as the bar condenses. Static gradient,
          so reduced motion is a non-issue. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-linear-to-b from-jce-dark/25 to-transparent transition-opacity",
          txn,
          overlay ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="relative z-10 mx-auto mt-3 w-full max-w-site px-4 sm:px-6">
        <div
          className={cn(
            "relative isolate grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-(--r-glass) px-3 transition-[padding]",
            txn,
            overlay ? "py-3" : "py-2",
          )}
        >
          {/* Glass island surface — fades in for condensed mode (opacity only,
              GPU-friendly). Carries the hairline border, the elevated shadow and a
              whisper of circuit texture, clipped to its own rounded layer so it
              never clips the items' focus rings. Absent (transparent) in overlay. */}
          <span
            aria-hidden
            className={cn(
              "glass-nav pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-(--r-glass) shadow-(--shadow-elevated) transition-opacity",
              txn,
              overlay ? "opacity-0" : "opacity-100",
            )}
          >
            <span className="circuit-field absolute inset-0 rounded-(--r-glass) opacity-50" />
          </span>

          {/* Logo lockup — boxless Ω (ohms) mark + wordmark; both recolour by mode. */}
          <Link
            href="/"
            aria-label={SITE.brand}
            className="focus-ring-jce flex min-w-0 items-center gap-2 justify-self-start rounded-md py-1 pr-2"
          >
            <OmegaMark
              strokeWidth={9}
              className={cn(
                "size-8 shrink-0 transition-colors",
                txn,
                overlay ? "text-jce-dark-ink" : "text-jce-green-700",
              )}
            />
            <span className="min-w-0 leading-tight">
              <span
                className={cn(
                  "block truncate text-ui-16 font-bold tracking-tight transition-colors",
                  txn,
                  overlay ? "text-jce-dark-ink" : "text-jce-ink",
                )}
              >
                JC Electrofields
              </span>
              <span
                className={cn(
                  "block truncate text-ui-12 transition-colors",
                  txn,
                  overlay ? "text-jce-dark-ink-2" : "text-jce-ink-2",
                )}
              >
                Power System, Inc.
              </span>
            </span>
          </Link>

          {/* Desktop nav — true-centred in the middle grid cell. */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-0.5 justify-self-center min-[900px]:flex"
          >
            {NAV_LINKS.map((link) =>
              "children" in link && link.children ? (
                <DropdownMenu key={link.href}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      data-active={isActive(pathname, link.href)}
                      className={cn(linkBase, linkColor, txn)}
                    >
                      <span className="relative inline-flex items-center gap-1">
                        {link.label}
                        <ChevronDownIcon
                          className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
                          aria-hidden
                        />
                        <span aria-hidden className={underline} />
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-56 p-1.5">
                    <DropdownMenuItem
                      asChild
                      className="focus:bg-jce-green-50 focus:text-jce-green-900"
                    >
                      <Link
                        href={link.href}
                        className="text-ui-12 tracking-widest text-jce-ink-2 uppercase"
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
                  className={cn(linkBase, linkColor, txn)}
                >
                  <span className="relative">
                    {link.label}
                    <span aria-hidden className={underline} />
                  </span>
                </Link>
              ),
            )}
          </nav>

          {/* Right cluster — inquiry CTA (desktop) / burger (≤900px), end-aligned. */}
          <div className="flex items-center gap-2 justify-self-end">
            <InquiryCta className="hidden min-[900px]:inline-flex" />
            <button
              ref={burgerRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={cn(
                "focus-ring-jce grid size-11 place-items-center rounded-md border transition-colors min-[900px]:hidden",
                txn,
                overlay
                  ? "border-white/15 bg-white/10 text-jce-dark-ink hover:bg-white/20"
                  : "border-jce-line bg-card/70 text-jce-ink hover:bg-jce-green-50",
              )}
            >
              {open ? (
                <XIcon className="size-5" aria-hidden />
              ) : (
                <MenuIcon className="size-5" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Glass mobile menu + dismiss backdrop (≤900px). The backdrop sits below the
          nav bar (z-10) so the burger/close control stays tappable; tapping it,
          Escape, a link tap, or resizing to desktop all close. */}
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
            className="relative z-10 mx-auto mt-2 w-full max-w-site px-4 sm:px-6 min-[900px]:hidden"
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
                      className="focus-ring-jce flex min-h-11 items-center rounded-md px-3 text-ui-16 font-medium text-jce-ink transition-colors hover:bg-jce-green-50 hover:text-jce-green-900 data-[active=true]:bg-jce-green-50 data-[active=true]:text-jce-green-900"
                    >
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
                            className="focus-ring-jce flex min-h-11 items-center rounded-md px-3 text-ui-14 font-medium text-jce-ink-2 transition-colors hover:bg-jce-green-50 hover:text-jce-green-900 data-[active=true]:bg-jce-green-50 data-[active=true]:text-jce-green-900"
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
                <InquiryCta
                  onClick={() => setOpen(false)}
                  className="h-12 w-full"
                />
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
