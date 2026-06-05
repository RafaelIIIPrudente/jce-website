import type { ConsultingItem } from "@/lib/content/products";

export function ConsultingScope({
  eyebrow,
  heading,
  description,
  items,
}: {
  eyebrow?: string;
  heading: string;
  description?: string;
  items: readonly ConsultingItem[];
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

        <div className="grid gap-x-10 gap-y-10 md:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="flex flex-col gap-3 border-t border-border pt-6"
            >
              <p className="text-eyebrow uppercase text-primary">
                {item.eyebrow}
              </p>
              <h3 className="font-display text-h3 text-balance text-foreground">
                {item.title}
              </h3>
              <p className="text-body text-pretty text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
