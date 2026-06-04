import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/web-reveal";
import { VoltageTag } from "@/components/sections/web-voltage-tag";
import { OmegaMark } from "@/components/sections/web-omega-mark";
import { PRODUCTS, type Product } from "@/lib/content/website";

// S5 Products — electrified spec cards, kept distinct from services, "Request
// quote" → contact. Each card is a circuit-card (hairline + amber corner ticks)
// over a solid surface. Photography is pending (OPEN-Q #13), so the 16:9 media box
// is a tokenized blueprint panel — a near-black circuit-field grid with the brand Ω
// seal and a VoltageTag for the product family — NOT a fake gradient and NOT a
// broken image. The box reserves its 16:9 height (aspect-ratio) so layout never
// shifts. Decorative layers are aria-hidden + pointer-events-none + contained; all
// amber comes from the repointed --jce-cyan* accent. Products-only (not shared);
// data stays on PRODUCTS (website.ts).

export function WebProductsGrid({
  products = PRODUCTS,
}: {
  products?: readonly Product[];
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {products.map((p, i) => (
        <Reveal key={p.name} delay={Math.min(i * 0.05, 0.2)}>
          <div className="circuit-card flex h-full flex-col gap-3 bg-card p-5 shadow-(--solid-shadow)">
            <div className="circuit-field relative isolate flex aspect-[16/9] items-center justify-center overflow-hidden rounded-(--r-input) border border-jce-dark-line bg-jce-dark">
              <OmegaMark className="pointer-events-none size-16 text-jce-cyan/12" />
              <VoltageTag tone="dark" className="absolute top-3 left-3">
                {p.tag}
              </VoltageTag>
            </div>
            <div className="text-ui-18 font-semibold text-jce-ink">
              {p.name}
            </div>
            <div className="text-ui-13 text-jce-ink-2">{p.spec}</div>
            <Button
              asChild
              variant="outline"
              className="mt-auto h-11 self-start px-5"
            >
              <Link href="/contact-us">Request quote</Link>
            </Button>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
