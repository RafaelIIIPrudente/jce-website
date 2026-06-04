import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import { PMG_TIMELINE } from "@/lib/mock/pmg";
import { PageHeader } from "@/components/jce/page-header";
import { DocChip } from "@/components/jce/doc-chip";

export const metadata: Metadata = { title: "Timeline" };

const DOT: Record<string, string> = {
  period: "bg-jce-green-600",
  mr: "bg-jce-green-600",
  po: "bg-jce-orange-500",
  stock: "bg-(--st-info)",
};

// P12 · Activity timeline (pmg-screens.jsx:1197). Cross-module event feed
// (periods, MRs, POs, stock).
export default function ProjectTimelinePage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader kicker="PMG · P12" title="Activity timeline" />
      <div className="solid rounded-(--r-solid) p-5">
        <ol className="flex flex-col">
          {PMG_TIMELINE.map((t, i) => (
            <li key={t.link} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "mt-1 size-2.5 shrink-0 rounded-full",
                    DOT[t.type] ?? "bg-jce-ink-2",
                  )}
                  aria-hidden
                />
                {i < PMG_TIMELINE.length - 1 ? (
                  <span
                    className="min-h-8 w-px flex-1 bg-jce-line"
                    aria-hidden
                  />
                ) : null}
              </div>
              <div className="pb-5">
                <div className="text-ui-13 text-jce-ink">{t.txt}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-ui-12 text-jce-ink-2">
                  {t.actor} · {t.ts} · <DocChip code={t.link} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
