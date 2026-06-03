export type TimelineMilestone = {
  year: number;
  title: string;
  body?: string;
};

export function TimelineSegment({
  eyebrow,
  heading,
  milestones,
}: {
  eyebrow?: string;
  heading?: string;
  milestones: readonly TimelineMilestone[];
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
          {heading && (
            <h2 className="font-display text-h2 text-balance text-foreground">
              {heading}
            </h2>
          )}
        </header>

        <ol className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m) => (
            <li
              key={`${m.year}-${m.title}`}
              className="flex flex-col gap-2 border-t border-border pt-5"
            >
              <p className="font-display text-h3 leading-none text-primary">
                {m.year}
              </p>
              <p className="text-body font-medium text-foreground">{m.title}</p>
              {m.body && (
                <p className="text-body-sm text-pretty text-muted-foreground">
                  {m.body}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
