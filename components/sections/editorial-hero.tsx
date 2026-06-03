import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type EditorialHeroCTA = {
  label: string;
  href: string;
  variant?: "default" | "outline" | "secondary";
};

export type EditorialHeroVariant =
  | "home"
  | "about"
  | "products"
  | "services"
  | "projects"
  | "category"
  | "contact";

export type EditorialHeroProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  primary?: EditorialHeroCTA;
  secondary?: EditorialHeroCTA;
  image?: {
    src: string;
    alt: string;
  };
  variant?: EditorialHeroVariant;
  children?: ReactNode;
};

const FALLBACK_PATTERN: Record<EditorialHeroVariant, string> = {
  home: "bg-[radial-gradient(circle_at_30%_20%,oklch(0.34_0.06_155/0.20),transparent_50%),radial-gradient(circle_at_80%_80%,oklch(0.62_0.12_65/0.16),transparent_55%),linear-gradient(180deg,oklch(0.985_0.005_95),oklch(0.94_0.008_95))]",
  about:
    "bg-[radial-gradient(circle_at_70%_20%,oklch(0.34_0.06_155/0.18),transparent_55%),linear-gradient(160deg,oklch(0.985_0.005_95),oklch(0.94_0.008_95))]",
  products:
    "bg-[radial-gradient(circle_at_85%_30%,oklch(0.62_0.12_65/0.20),transparent_50%),linear-gradient(180deg,oklch(0.985_0.005_95),oklch(0.94_0.008_95))]",
  services:
    "bg-[radial-gradient(circle_at_15%_85%,oklch(0.34_0.06_155/0.16),transparent_55%),linear-gradient(180deg,oklch(0.985_0.005_95),oklch(0.94_0.008_95))]",
  projects:
    "bg-[radial-gradient(circle_at_50%_30%,oklch(0.34_0.06_155/0.22),transparent_60%),linear-gradient(180deg,oklch(0.985_0.005_95),oklch(0.94_0.008_95))]",
  category:
    "bg-[radial-gradient(circle_at_30%_70%,oklch(0.34_0.06_155/0.22),transparent_55%),radial-gradient(circle_at_80%_20%,oklch(0.62_0.12_65/0.14),transparent_60%),linear-gradient(180deg,oklch(0.985_0.005_95),oklch(0.94_0.008_95))]",
  contact: "",
};

export function EditorialHero({
  eyebrow,
  title,
  subtitle,
  primary,
  secondary,
  image,
  variant = "home",
  children,
}: EditorialHeroProps) {
  const isCompact = variant === "contact";

  return (
    <section
      aria-labelledby="hero-title"
      className={cn(
        "relative isolate overflow-hidden",
        isCompact ? "pt-32 pb-20" : "pt-32 pb-24 md:pt-40 md:pb-32",
      )}
    >
      {/* Background layer */}
      {!isCompact && (
        <div className="absolute inset-0 -z-10">
          {image ? (
            <>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              {/* Forest-green tint for text contrast */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[oklch(0.18_0.015_160/0.45)]"
              />
              {/* Bottom-left contrast gradient */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(120deg,oklch(0.18_0.015_160/0.65)_0%,oklch(0.18_0.015_160/0.20)_55%,transparent_85%)]"
              />
            </>
          ) : (
            <>
              <div
                aria-hidden="true"
                className={cn("absolute inset-0", FALLBACK_PATTERN[variant])}
              />
              {/* Subtle bottom hairline */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px bg-border"
              />
            </>
          )}
        </div>
      )}

      <div
        className={cn(
          "relative mx-auto w-full max-w-6xl px-6 md:px-10",
          "grid gap-8 md:grid-cols-12",
        )}
      >
        <div className="flex flex-col gap-6 md:col-span-8 lg:col-span-7">
          {children}
          <p
            className={cn(
              "text-eyebrow uppercase",
              image
                ? "text-[oklch(0.95_0.005_95/0.85)]"
                : "text-muted-foreground",
            )}
          >
            {eyebrow}
          </p>
          <h1
            id="hero-title"
            className={cn(
              "font-display text-balance",
              isCompact
                ? "text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em]"
                : "text-[clamp(2.75rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.02em]",
              image ? "text-[oklch(0.99_0_0)]" : "text-foreground",
            )}
          >
            {title}
          </h1>
          <p
            className={cn(
              "max-w-[58ch] text-body-lg text-pretty",
              image
                ? "text-[oklch(0.95_0.005_95/0.92)]"
                : "text-muted-foreground",
            )}
          >
            {subtitle}
          </p>

          {(primary || secondary) && (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {primary && (
                <Button
                  asChild
                  size="lg"
                  variant={primary.variant ?? "default"}
                  className="h-11 px-5 text-sm"
                >
                  <Link href={primary.href}>{primary.label}</Link>
                </Button>
              )}
              {secondary && (
                <Button
                  asChild
                  size="lg"
                  variant={secondary.variant ?? "outline"}
                  className={cn(
                    "h-11 px-5 text-sm",
                    image &&
                      "border-[oklch(0.99_0_0/0.25)] bg-[oklch(0.99_0_0/0.08)] text-[oklch(0.99_0_0)] hover:bg-[oklch(0.99_0_0/0.18)]",
                  )}
                >
                  <Link href={secondary.href}>{secondary.label}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
