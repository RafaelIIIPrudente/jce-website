import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product & Services",
};

export default function ProductServicesPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">
        Product &amp; Services
      </h1>
      <p className="text-lg text-muted-foreground">
        Content for this section is being prepared.
      </p>
    </section>
  );
}
