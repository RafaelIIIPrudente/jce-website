import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/sections/kit/web-reveal";

// Shared website section shell — cinematic vertical rhythm + max-w container,
// and a section header (eyebrow + Inter heading + optional "view all" link).
// Inter headings (handoff source of truth), never Fraunces, on the website.

export function WebSection({
  children,
  alt,
  id,
  className,
}: {
  children: React.ReactNode;
  alt?: boolean;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "px-5 py-16 sm:py-20 md:py-24",
        alt && "bg-jce-green-50/40",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  heading,
  sub,
  viewAll,
}: {
  eyebrow?: string;
  heading: React.ReactNode;
  sub?: string;
  viewAll?: { href: string; label: string };
}) {
  return (
    <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-10">
      <div className="max-w-[40ch]">
        {eyebrow ? (
          <div className="kicker text-jce-green-600">{eyebrow}</div>
        ) : null}
        <h2 className="mt-2 text-[clamp(24px,3.6vw,38px)] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-jce-ink">
          {heading}
        </h2>
        {sub ? (
          <p className="mt-3 text-ui-16 text-pretty text-jce-ink-2">{sub}</p>
        ) : null}
      </div>
      {viewAll ? (
        <Link
          href={viewAll.href}
          className="focus-ring-jce group inline-flex min-h-11 -my-2 items-center gap-1.5 rounded-md px-1 text-ui-14 font-semibold text-jce-green-700 transition-colors hover:text-jce-green-600"
        >
          {viewAll.label}
          <ArrowRightIcon
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      ) : null}
    </Reveal>
  );
}
