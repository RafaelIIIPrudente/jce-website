import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NGCP",
};

export default function NgcpPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">NGCP</h1>
      <p className="text-lg text-muted-foreground">
        Project details are being prepared.
      </p>
    </section>
  );
}
