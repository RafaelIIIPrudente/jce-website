import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Contact Us</h1>
      <p className="text-lg text-muted-foreground">
        Contact form and details coming soon.
      </p>
    </section>
  );
}
