import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";

export const metadata: Metadata = { title: "BOQ templates" };

// P15 · BOQ template library (pmg-phase2.jsx:87). Reusable cards → "Start project
// from template" enters the P3 wizard at step 3 (Confirm header).
const TPL = [
  {
    name: "69KV Substation — Standard",
    cat: "Substation",
    lines: 42,
    value: "₱48–62M",
    uses: 7,
  },
  {
    name: "230KV Substation — Full EPC",
    cat: "Substation",
    lines: 88,
    value: "₱110–140M",
    uses: 3,
  },
  {
    name: "13.2KV Distribution Line",
    cat: "Distribution",
    lines: 24,
    value: "₱18–30M",
    uses: 11,
  },
  {
    name: "Solar Farm 5MWp — Ground Mount",
    cat: "Solar",
    lines: 36,
    value: "₱55–70M",
    uses: 2,
  },
];

export default function TemplatesPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        kicker="PMG · P15 · Phase 2"
        title="BOQ template library"
        actions={<Button size="sm">+ Save current BOQ as template</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {TPL.map((t) => (
          <div
            key={t.name}
            className="glass flex flex-col gap-3 rounded-(--r-glass) p-4"
          >
            <div className="flex items-center justify-between">
              <Chip tone="info">{t.cat}</Chip>
              <span className="text-ui-12 text-jce-ink-2">{t.uses}× used</span>
            </div>
            <div className="text-ui-14 font-semibold text-jce-ink">
              {t.name}
            </div>
            <div className="flex gap-6 text-ui-12">
              <div>
                <div className="text-jce-ink-2">BOQ lines</div>
                <div className="font-semibold text-jce-ink">{t.lines}</div>
              </div>
              <div>
                <div className="text-jce-ink-2">Typical value</div>
                <div className="font-semibold text-jce-ink">{t.value}</div>
              </div>
            </div>
            <Button asChild size="sm" className="mt-1 w-full">
              <Link href="/pmg/new">Start project from template →</Link>
            </Button>
          </div>
        ))}
      </div>
      <p className="text-ui-12 text-jce-ink-2">
        “Start project from template” enters the P3 import wizard at step 3
        (Confirm header) with the BOQ prefilled.
      </p>
    </div>
  );
}
