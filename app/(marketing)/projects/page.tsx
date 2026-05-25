import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

const PROJECTS = [
  {
    href: "/projects/solar-farm",
    title: "Solar Farm",
    blurb: "Utility-scale solar generation projects.",
  },
  {
    href: "/projects/distribution-utility",
    title: "Distribution Utility",
    blurb: "Power distribution infrastructure for utility companies.",
  },
  {
    href: "/projects/ngcp",
    title: "NGCP",
    blurb:
      "Transmission projects with the National Grid Corporation of the Philippines.",
  },
] as const;

export default function ProjectsPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>
        <p className="text-lg text-muted-foreground">
          A portfolio of solar, distribution, and grid infrastructure work.
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="flex h-full flex-col gap-2 rounded-lg border border-border bg-card p-6 transition-colors hover:bg-muted"
            >
              <h2 className="text-lg font-medium">{p.title}</h2>
              <p className="text-sm text-muted-foreground">{p.blurb}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
