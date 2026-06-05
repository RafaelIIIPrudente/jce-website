export function HistoryNarrative({
  eyebrow,
  heading,
  paragraphs,
}: {
  eyebrow?: string;
  heading?: string;
  paragraphs: readonly string[];
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid w-full max-w-site gap-12 px-6 py-section md:grid-cols-12 md:px-10">
        <header className="md:col-span-4">
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

        <div className="flex flex-col gap-5 md:col-span-7 md:col-start-6">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-body-lg text-pretty text-foreground first:[&]:first-letter:font-display first:[&]:first-letter:text-[4rem] first:[&]:first-letter:leading-[1] first:[&]:first-letter:float-left first:[&]:first-letter:pr-3 first:[&]:first-letter:pt-1 first:[&]:first-letter:text-primary"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
