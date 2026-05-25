import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-start justify-center gap-6 px-6 py-24">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        JC Electrofields Power System, Inc.
      </p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Powering the Philippines — solar, distribution, and grid infrastructure.
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Electrical power systems and engineering services for solar farms,
        distribution utilities, and national grid projects.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/projects">See our work</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/contact-us">Contact us</Link>
        </Button>
      </div>
    </section>
  );
}
