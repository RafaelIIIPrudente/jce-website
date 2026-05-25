import { cn } from "@/lib/utils";

export type StatItem = {
  value: string;
  label: string;
  hint?: string;
};

export function StatBand({
  stats,
  eyebrow,
  className,
}: {
  stats: readonly StatItem[];
  eyebrow?: string;
  className?: string;
}) {
  return (
    <section className={cn("border-y border-border bg-card", className)}>
      <div className="mx-auto w-full max-w-6xl px-6 py-block md:px-10">
        {eyebrow && (
          <p className="mb-8 text-eyebrow uppercase text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <dt className="text-eyebrow uppercase text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="font-display text-h2 leading-none text-foreground">
                {stat.value}
              </dd>
              {stat.hint && (
                <p className="text-caption text-muted-foreground">
                  {stat.hint}
                </p>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
