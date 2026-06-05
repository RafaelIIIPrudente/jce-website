import type { License } from "@/lib/content/accreditations";

export function AccreditationStrip({
  eyebrow = "Accredited & registered",
  items,
}: {
  eyebrow?: string;
  items: readonly License[];
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-block md:px-10">
        <p className="text-center text-eyebrow uppercase text-muted-foreground">
          {eyebrow}
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {items.map((item) => (
            <li
              key={item.acronym}
              className="flex flex-col items-center justify-center gap-1 rounded-lg border border-border bg-card px-4 py-6 text-center"
              aria-label={
                item.detail ? `${item.issuer} — ${item.detail}` : item.issuer
              }
            >
              <p className="font-display text-h4 leading-none text-foreground">
                {item.acronym}
              </p>
              {item.detail ? (
                <p className="text-caption text-muted-foreground">
                  {item.detail}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
