import type { ScopeItem } from "@/lib/content/products";

export function ScopeOfWorkList({
  eyebrow,
  heading,
  description,
  items,
}: {
  eyebrow?: string;
  heading: string;
  description?: string;
  items: readonly ScopeItem[];
}) {
  return (
    <section className="border-b border-border bg-muted/40">
      <div className="mx-auto grid w-full max-w-site gap-12 px-6 py-section md:grid-cols-12 md:px-10">
        <header className="md:col-span-4">
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

        <ol className="flex flex-col md:col-span-7 md:col-start-6">
          {items.map((item) => (
            <li
              key={item.number}
              className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 border-t border-border py-6 last:border-b"
            >
              <span className="row-span-2 font-display text-h3 leading-none text-primary">
                {item.number}
              </span>
              <h3 className="text-h4 font-medium text-foreground">
                {item.title}
              </h3>
              <p className="text-body-sm text-pretty text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
