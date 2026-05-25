import type { ProcessStep } from "@/lib/content/products";

export function ProcessTimeline({
  eyebrow,
  heading,
  steps,
}: {
  eyebrow?: string;
  heading: string;
  steps: readonly ProcessStep[];
}) {
  return (
    <section className="border-b border-border bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-6 py-section md:px-10">
        <header className="mb-12 max-w-3xl">
          {eyebrow && (
            <p className="mb-4 text-eyebrow uppercase text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-h2 text-balance text-foreground">
            {heading}
          </h2>
        </header>

        <ol className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-5">
          {steps.map((step) => (
            <li key={step.n} className="flex flex-col gap-3 bg-card p-6">
              <p className="font-display text-h3 leading-none text-primary">
                {step.n}
              </p>
              <h3 className="text-h4 font-medium text-foreground">
                {step.title}
              </h3>
              <p className="text-body-sm text-pretty text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
