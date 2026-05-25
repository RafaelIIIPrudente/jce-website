"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, MenuIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/lib/content/site";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        "sticky top-0 z-40 transition-all duration-280 ease-[var(--ease-spring)]",
        scrolled
          ? "border-b border-border bg-background/90 supports-backdrop-filter:backdrop-blur"
          : "border-b border-transparent bg-background/0",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-foreground"
          aria-label={SITE.brand}
        >
          <span className="font-medium">JC</span>
          <span className="text-muted-foreground"> Electrofields</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) =>
            "children" in link && link.children ? (
              <DropdownMenu key={link.href}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    data-active={pathname.startsWith(link.href)}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-foreground focus-visible:outline-none focus-visible:text-foreground"
                  >
                    {link.label}
                    <ChevronDownIcon className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="min-w-[200px] p-2"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href={link.href}
                      className="text-xs uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      All {link.label}
                    </Link>
                  </DropdownMenuItem>
                  {link.children.map((child) => (
                    <DropdownMenuItem key={child.href} asChild>
                      <Link href={child.href}>{child.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                data-active={pathname === link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-foreground"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/contact-us">Start a project</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                aria-label="Open menu"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>
                  <span className="font-medium">JC</span>
                  <span className="text-muted-foreground"> Electrofields</span>
                </SheetTitle>
              </SheetHeader>

              <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <div key={link.href} className="flex flex-col">
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        className="rounded-md px-2 py-3 text-h4 font-display text-foreground transition-colors hover:bg-muted"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                    {"children" in link && link.children ? (
                      <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-border pl-3">
                        {link.children.map((child) => (
                          <SheetClose asChild key={child.href}>
                            <Link
                              href={child.href}
                              className="rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                              {child.label}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3 border-t border-border pt-6">
                <SheetClose asChild>
                  <Button asChild size="lg">
                    <Link href="/contact-us">Start a project</Link>
                  </Button>
                </SheetClose>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {SITE.phone}
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
