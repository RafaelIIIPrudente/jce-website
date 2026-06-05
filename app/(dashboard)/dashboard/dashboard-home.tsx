"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { ROLES } from "@/lib/rbac";
import { HOME, type HomeApproval } from "@/lib/mock/shell";
import { type NotifTone, type Notification } from "@/lib/mock/shell";
import { peso } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { KpiTile } from "@/components/jce/kpi-tile";
import { DocChip } from "@/components/jce/doc-chip";
import { Chip } from "@/components/jce/chip";
import { EmptyState } from "@/components/jce/empty-state";

// X3 · Role-aware home (screens-core.jsx:219-280). Every surface re-keys off the
// active role via the HOME map; the prototype role switcher (top bar) drives it.
// OQ#7 (per-role landing dashboards) — for now every role lands here. PROPOSED.

const TONE_DOT: Record<NotifTone, string> = {
  pending: "bg-(--st-pending)",
  info: "bg-(--st-info)",
  danger: "bg-(--st-danger)",
  neutral: "bg-jce-ink-2",
  success: "bg-(--st-success)",
};

export function DashboardHome() {
  const { role, notifications } = useJce();
  const cfg = HOME[role];
  const r = ROLES[role];

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      {/* Greeting — on the backdrop (not glass) */}
      <div>
        <h1 className="text-ui-28 font-bold tracking-tight text-jce-ink">
          {cfg.hi}, <span className="text-jce-green-700">{r.short}</span>.
        </h1>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-ui-14 text-jce-ink-2">
          Here&rsquo;s what needs you today.
          {cfg.scoped ? (
            <span className="inline-flex items-center rounded-full bg-jce-green-50 px-2.5 py-0.5 text-ui-12 font-medium text-jce-green-700">
              Scoped to assigned sites
            </span>
          ) : null}
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cfg.kpis.map((k) => (
          <KpiTile
            key={k.k}
            label={k.k}
            value={k.v}
            delta={k.d}
            tone={k.tone}
          />
        ))}
      </div>

      {/* My approvals + recent notifications */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* keyed by role so the in-session approve state resets on role switch */}
        <ApprovalsPanel key={role} approvals={cfg.approvals} />
        <NotificationsPanel notifications={notifications.slice(0, 4)} />
      </div>

      <p className="text-ui-12 text-jce-ink-2">
        Every role lands on this home for now; per-role landing pages are
        OPEN-Q&nbsp;#7 — PROPOSED.
      </p>
    </div>
  );
}

function ApprovalsPanel({ approvals }: { approvals: readonly HomeApproval[] }) {
  const [items, setItems] = useState<readonly HomeApproval[]>(approvals);

  return (
    <div className="glass rounded-(--r-glass) p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-ui-16 font-semibold text-jce-ink">My approvals</h2>
        {items.length > 0 ? (
          <Chip tone="pending">{items.length} waiting</Chip>
        ) : null}
      </div>
      {items.length === 0 ? (
        <EmptyState
          icon={
            <CheckCheckIcon className="size-7" strokeWidth={1.75} aria-hidden />
          }
          title="All caught up"
          description="Nothing waiting on your approval right now."
        />
      ) : (
        <div className="solid divide-y divide-jce-line overflow-hidden rounded-(--r-solid)">
          {items.map((a) => (
            <div key={a.doc} className="flex flex-wrap items-center gap-3 p-3">
              <DocChip code={a.doc} />
              <div className="min-w-40 flex-1">
                <div className="text-ui-13 font-medium text-jce-ink">{a.t}</div>
                <div className="text-ui-12 text-jce-ink-2">
                  {a.mod} · waiting {a.age}
                </div>
              </div>
              {a.amt != null ? (
                <div className="font-mono text-ui-14 font-semibold tabular-nums text-jce-ink">
                  {peso(a.amt)}
                </div>
              ) : null}
              <Button
                variant="approve"
                size="sm"
                onClick={() => setItems(items.filter((x) => x.doc !== a.doc))}
              >
                Approve
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationsPanel({
  notifications,
}: {
  notifications: readonly Notification[];
}) {
  return (
    <div className="glass rounded-(--r-glass) p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-ui-16 font-semibold text-jce-ink">
          Recent notifications
        </h2>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/notifications">View all</Link>
        </Button>
      </div>
      <div className="solid divide-y divide-jce-line overflow-hidden rounded-(--r-solid)">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={cn("flex gap-2.5 p-3", n.unread && "bg-jce-green-50")}
          >
            <span
              className={cn(
                "mt-1.5 size-2 shrink-0 rounded-full",
                TONE_DOT[n.tone],
              )}
              aria-hidden
            />
            <div className="min-w-0">
              <div className="text-ui-13 text-jce-ink">{n.msg}</div>
              <div className="mt-0.5 text-ui-12 text-jce-ink-2">
                {n.mod} · {n.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
