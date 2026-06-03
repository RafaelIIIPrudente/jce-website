import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type CTABannerCTA = {
  label: string;
  href: string;
  variant?: "default" | "outline" | "secondary";
};

export function CTABanner({
  eyebrow,
  heading,
  subhead,
  primary,
  secondary,
  tone = "muted",
}: {
  eyebrow?: string;
  heading: string;
  subhead?: string;
  primary: CTABannerCTA;
  secondary?: CTABannerCTA;
  tone?: "muted" | "primary";
}) {
  const isPrimary = tone === "primary";

  return (
    <section
      className={cn(
        "border-y border-border",
        isPrimary
          ? "bg-primary text-primary-foreground"
          : "bg-muted/60 text-foreground",
      )}
    >
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-section md:grid-cols-12 md:items-end md:gap-10 md:px-10">
        <div className="md:col-span-7">
          {eyebrow && (
            <p
              className={cn(
                "mb-4 text-eyebrow uppercase",
                isPrimary
                  ? "text-[oklch(0.99_0_0/0.7)]"
                  : "text-muted-foreground",
              )}
            >
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-h2 text-balance">{heading}</h2>
          {subhead && (
            <p
              className={cn(
                "mt-4 max-w-[55ch] text-body-lg text-pretty",
                isPrimary
                  ? "text-[oklch(0.99_0_0/0.85)]"
                  : "text-muted-foreground",
              )}
            >
              {subhead}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 md:col-span-5 md:justify-end">
          <Button
            asChild
            size="lg"
            variant={primary.variant ?? (isPrimary ? "secondary" : "default")}
            className="h-11 px-5 text-sm"
          >
            <Link href={primary.href}>{primary.label}</Link>
          </Button>
          {secondary && (
            <Button
              asChild
              size="lg"
              variant={secondary.variant ?? "outline"}
              className={cn(
                "h-11 px-5 text-sm",
                isPrimary &&
                  "border-[oklch(0.99_0_0/0.25)] bg-transparent text-[oklch(0.99_0_0)] hover:bg-[oklch(0.99_0_0/0.12)]",
              )}
            >
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
