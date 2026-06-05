export type FigureItem = {
  value: string;
  label: string;
};

export function PortfolioFigures({
  eyebrow,
  figures,
}: {
  eyebrow?: string;
  figures: readonly FigureItem[];
}) {
  return (
    <section className="border-b border-border bg-muted/40">
      <div className="mx-auto w-full max-w-site px-6 py-block md:px-10">
        {eyebrow && (
          <p className="mb-8 text-eyebrow uppercase text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {figures.map((f) => (
            <div key={f.label} className="flex flex-col gap-2">
              <dt className="text-eyebrow uppercase text-muted-foreground">
                {f.label}
              </dt>
              <dd className="font-display text-h3 leading-none text-foreground">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
