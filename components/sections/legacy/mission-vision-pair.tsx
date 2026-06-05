export function MissionVisionPair({
  mission,
  vision,
  eyebrow,
}: {
  mission: string;
  vision: string;
  eyebrow?: string;
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-10">
        {eyebrow && (
          <p className="mb-10 text-eyebrow uppercase text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-4 border-t border-border pt-6">
            <p className="text-eyebrow uppercase text-primary">Mission</p>
            <p className="text-body-lg text-pretty text-foreground">
              {mission}
            </p>
          </div>
          <div className="flex flex-col gap-4 border-t border-border pt-6">
            <p className="text-eyebrow uppercase text-primary">Vision</p>
            <p className="text-body-lg text-pretty text-foreground">{vision}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
