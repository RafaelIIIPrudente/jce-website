import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/web-reveal";
import { PRODUCTS, type Product } from "@/lib/content/website";

// S5 Products — solid cards, kept distinct from services, "Request quote" →
// contact (web-pages-a.jsx:298-320). Gradient placeholders (photography pending,
// OPEN-Q #13). Tag: Solid.

export function WebProductsGrid({
  products = PRODUCTS,
}: {
  products?: readonly Product[];
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {products.map((p, i) => (
        <Reveal key={p.name} delay={Math.min(i * 0.05, 0.2)}>
          <div className="solid flex h-full flex-col gap-3 rounded-[var(--r-solid)] p-5">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[8px] border border-jce-line bg-[linear-gradient(135deg,var(--jce-green-50),var(--jce-orange-100))]">
              <span className="absolute top-3 left-3 rounded-full bg-white/85 px-2.5 py-0.5 text-ui-12 font-semibold text-jce-green-700">
                {p.tag}
              </span>
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
