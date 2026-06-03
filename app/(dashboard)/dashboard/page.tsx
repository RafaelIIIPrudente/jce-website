import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { EmptyState } from "@/components/jce/empty-state";

export const metadata: Metadata = { title: "Home" };

// X3 placeholder — the shell must render something. The real role-aware home
// (KPIs, approvals, recent notifications) is Part 2.
export default function DashboardHome() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="Cross-cutting · X3"
        title="Home"
        description="Role-aware landing. The real X3 dashboard (KPIs, approvals, notifications) arrives in Part 2."
      />
      <div className="glass rounded-[var(--r-glass)] p-8">
        <EmptyState
          icon={<HomeIcon className="size-7" strokeWidth={1.5} aria-hidden />}
          title="Foundation shell is live"
          description="Tokens, RBAC, the jce/ component library and the app shell are in place. Use the prototype role switcher (top-right) to watch the nav hide/show per role."
          action={
            <Button asChild>
              <Link href="/foundations">
                View the Foundations gallery
                <ChevronRightIcon data-icon="inline-end" />
              </Link>
            </Button>
          }
        />
      </div>
    </div>
  );
}
