import type { Metadata } from "next";
import { WrenchIcon } from "lucide-react";

import { PageHeader } from "@/components/jce/page-header";
import { EmptyState } from "@/components/jce/empty-state";

export const metadata: Metadata = { title: "Engineering" };

// E1 · Engineering placeholder stub (brief:1106-1114). HONEST stub — the module
// is pending its stakeholder interview (OQ#9); no speculative screens.
export default function EngineeringPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader kicker="Module · E1" title="Engineering" />
      <div className="glass rounded-(--r-glass) p-8">
        <EmptyState
          icon={
            <WrenchIcon className="size-7" strokeWidth={1.75} aria-hidden />
          }
          title="Engineering module — pending scoping"
          description="This module is awaiting its stakeholder interview (OPEN-Q #9 — PROPOSED). It will likely own BOM ownership and Technical Drawing review, which feed Purchasing's import stages 1 & 6. Nothing here is a committed requirement, so no screens are designed yet."
        />
      </div>
    </div>
  );
}
