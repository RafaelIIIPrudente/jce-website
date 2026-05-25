import Link from "next/link";

import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/about-us", label: "About Us" },
  { href: "/product-services", label: "Product & Services" },
  { href: "/professional-services", label: "Professional Services" },
  { href: "/projects", label: "Projects" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-semibold tracking-tight">
          JC Electrofields
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm">
          <Link href="/contact-us">Contact</Link>
        </Button>
      </div>
    </header>
  );
}
