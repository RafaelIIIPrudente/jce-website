import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} JC Electrofields Power System, Inc. All
          rights reserved.
        </p>
        <Link href="/contact-us" className="hover:text-foreground">
          Get in touch
        </Link>
      </div>
    </footer>
  );
}
