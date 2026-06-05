import { Badge } from "@/components/ui/badge";
import type { ProductLine } from "@/lib/content/products";

export function ProductLineGrid({
  eyebrow,
  heading,
  description,
  items,
}: {
  eyebrow?: string;
  heading: string;
  description?: string;
  items: readonly ProductLine[];
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-10">
        <header className="mb-12 max-w-3xl">
          {eyebrow && (
            <p className="mb-4 text-eyebrow uppercase text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-h2 text-balance text-foreground">
            {heading}
          </h2>
          {description && (
            <p className="mt-4 text-body-lg text-pretty text-muted-foreground">
              {description}
            </p>
          )}
        </header>

        <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.name}
              className="flex flex-col gap-2 bg-card p-6 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-h4 font-medium text-foreground">
                  {item.name}
                </h3>
                {item.voltageRange && (
                  <Badge variant="muted" className="shrink-0">
                    {item.voltageRange}
                  </Badge>
                )}
              </div>
              <p className="text-body-sm text-pretty text-muted-foreground">
                {item.spec}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
