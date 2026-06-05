import { cn } from "@/lib/utils";
import type { Capability } from "@/lib/content/capabilities";

export function CapabilityGrid({
  eyebrow,
  heading,
  description,
  items,
  columns = 3,
}: {
  eyebrow?: string;
  heading: string;
  description?: string;
  items: readonly Capability[];
  columns?: 2 | 3;
}) {
  return (
    <section className="border-b border-border bg-background">
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
          {description && (
            <p className="mt-4 text-body-lg text-pretty text-muted-foreground">
              {description}
            </p>
          )}
        </header>

        <ul
          className={cn(
            "grid gap-x-10 gap-y-12",
            columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className="flex flex-col gap-3 border-t border-border pt-6"
              >
                <div className="flex items-center gap-2 text-eyebrow uppercase text-muted-foreground">
                  <Icon className="size-3.5 text-primary" strokeWidth={1.5} />
                  {item.eyebrow}
                </div>
                <h3 className="font-display text-h3 text-balance text-foreground">
                  {item.title}
                </h3>
                <p className="text-body text-pretty text-muted-foreground">
                  {item.body}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
