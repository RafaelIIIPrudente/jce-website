"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCheckIcon,
  ClipboardCheckIcon,
  ClockIcon,
  FileTextIcon,
  type LucideIcon,
  ShieldCheckIcon,
  UserPlusIcon,
} from "lucide-react";

import { useJce } from "@/lib/mock/role-context";
import {
  BATCH_TONE,
  EMPLOYEES,
  HR_AUDIT,
  REQUESTS,
  REQUEST_TYPES,
  SALARY_CATEGORIES,
  STATUS_TONE,
  expiringFlag,
  getBatches,
  monthsLeft,
} from "@/lib/mock/hr";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { KpiTile } from "@/components/jce/kpi-tile";
import { MetricCard } from "@/components/jce/metric-card";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";

// HR module dashboard — the /hr landing (supersedes the H1 redirect; OQ#7
// deviation, impl-plan Part 4). Full department pulse derived live from
// lib/mock/hr.ts: KPIs (incl. the contract-expiry danger tile), an attention
// panel, workforce composition, RBAC-gated quick actions, and recent audit
// activity. Premium tier + mobile-first.

// Fire the AGGREGATED contract-expiry summary ONCE per session (module guard
// survives remounts) — replaces the old per-employee bell spam, which would
// flood the bell at 100+ employees. Per-employee detail lives in the Attention
// panel + the H1 list ⚠ flags.
let expirySummaryFired = false;

function QuickAction({
  href,
  icon: Icon,
  title,
  sub,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="focus-ring-jce glass flex min-h-11 flex-col gap-1 rounded-(--r-glass) p-4 transition-colors hover:border-jce-green-500"
    >
      <Icon className="size-5 text-jce-green-700" aria-hidden />
      <div className="mt-1 text-ui-14 font-bold text-jce-ink">{title}</div>
      <div className="text-ui-12 text-jce-ink-2">{sub}</div>
    </Link>
  );
}

export function HrHome() {
  const { role, addNotification } = useJce();
  const canEditEmployees = role === "hrhead" || role === "owner";

  const expiring = EMPLOYEES.filter(expiringFlag);
  const pending = REQUEST_TYPES.flatMap((t) =>
    REQUESTS[t.label]
      .filter((r) => r.status === "Pending")
      .map((r) => ({ ...r, type: t.label })),
  );
  const openBatches = getBatches().filter((b) => b.status !== "Verified");
  const recent = HR_AUDIT.slice(0, 5);

  const byCat = SALARY_CATEGORIES.map((cat) => ({
    cat,
    n: EMPLOYEES.filter((e) => e.cat === cat).length,
  }));
  const statusCounts = EMPLOYEES.reduce<Record<string, number>>((m, e) => {
    m[e.status] = (m[e.status] ?? 0) + 1;
    return m;
  }, {});
  const statusEntries = Object.entries(statusCounts).sort(
    (a, b) => b[1] - a[1],
  );

  useEffect(() => {
    if (expirySummaryFired) return;
    expirySummaryFired = true;
    const n = EMPLOYEES.filter(expiringFlag).length;
    if (n > 0) {
      addNotification({
        mod: "HR",
        type: "Contract",
        tone: "danger",
        unread: true,
        msg: `${n} contract${n === 1 ? "" : "s"} expiring < 6 months — review HR`,
        time: "just now",
        doc: null,
      });
    }
  }, [addNotification]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="HR · Overview"
        title="HR"
        description="Department pulse — headcount, contract risk, pending approvals and timekeeping at a glance."
      />

      {/* KPI strip — derived live from the roster + stores */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          label="Active headcount"
          value={EMPLOYEES.length}
          delta="on the roster"
          tone="neutral"
        />
        <KpiTile
          label="Contracts expiring"
          value={expiring.length}
          delta="< 6 months"
          tone="danger"
        />
        <KpiTile
          label="Pending requests"
          value={pending.length}
          delta="awaiting action"
          tone="pending"
        />
        <KpiTile
          label="Open batches"
          value={openBatches.length}
          delta="to verify"
          tone="info"
        />
      </div>

      {/* Attention panel */}
      <section className="grid gap-5 lg:grid-cols-3">
        {/* Expiring contracts */}
        <div className="glass flex flex-col rounded-(--r-glass) p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-ui-16 font-semibold text-jce-ink">
              Expiring contracts
            </h2>
            {expiring.length > 0 ? (
              <Chip tone="danger">{expiring.length}</Chip>
            ) : null}
          </div>
          {expiring.length === 0 ? (
            <EmptyState
              icon={
                <CheckCheckIcon
                  className="size-7"
                  strokeWidth={1.75}
                  aria-hidden
                />
              }
              title="All clear"
              description="No contracts within six months of expiry."
            />
          ) : (
            <div className="solid divide-y divide-jce-line overflow-hidden rounded-(--r-solid)">
              {expiring.slice(0, 5).map((e) => (
                <Link
                  key={e.id}
                  href={`/hr/employees/${e.id}`}
                  className="focus-ring-jce flex min-h-11 items-center gap-3 p-3 transition-colors hover:bg-jce-green-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-ui-13 font-medium text-jce-ink">
                      {e.name}
                    </div>
                    <div className="truncate text-ui-12 text-jce-ink-2">
                      {e.pos} · {e.no}
                    </div>
                  </div>
                  <Chip tone="pending">{monthsLeft(e.contractEnd)}mo</Chip>
                </Link>
              ))}
            </div>
          )}
          {expiring.length > 5 ? (
            <Link
              href="/hr/employees"
              className="focus-ring-jce mt-3 inline-flex w-fit items-center gap-1 rounded text-ui-12 font-semibold text-jce-green-700 hover:underline"
            >
              View all {expiring.length}{" "}
              <ArrowRightIcon className="size-3.5" aria-hidden />
            </Link>
          ) : null}
        </div>

        {/* Pending requests */}
        <div className="glass flex flex-col rounded-(--r-glass) p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-ui-16 font-semibold text-jce-ink">
              Pending requests
            </h2>
            {pending.length > 0 ? (
              <Chip tone="pending">{pending.length}</Chip>
            ) : null}
          </div>
          {pending.length === 0 ? (
            <EmptyState
              icon={
                <CheckCheckIcon
                  className="size-7"
                  strokeWidth={1.75}
                  aria-hidden
                />
              }
              title="Nothing waiting"
              description="No HR requests are pending review."
            />
          ) : (
            <div className="solid divide-y divide-jce-line overflow-hidden rounded-(--r-solid)">
              {pending.slice(0, 5).map((r) => (
                <Link
                  key={r.no}
                  href="/hr/requests"
                  className="focus-ring-jce flex min-h-11 flex-wrap items-center gap-2 p-3 transition-colors hover:bg-jce-green-50"
                >
                  <DocChip code={r.no} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-ui-13 font-medium text-jce-ink">
                      {r.key}
                    </div>
                    <div className="truncate text-ui-12 text-jce-ink-2">
                      {r.type} · {r.emp}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Batches awaiting verification */}
        <div className="glass flex flex-col rounded-(--r-glass) p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-ui-16 font-semibold text-jce-ink">
              Batches to verify
            </h2>
            {openBatches.length > 0 ? (
              <Chip tone="info">{openBatches.length}</Chip>
            ) : null}
          </div>
          {openBatches.length === 0 ? (
            <EmptyState
              icon={
                <CheckCheckIcon
                  className="size-7"
                  strokeWidth={1.75}
                  aria-hidden
                />
              }
              title="All verified"
              description="Every timekeeping batch is verified."
            />
          ) : (
            <div className="solid divide-y divide-jce-line overflow-hidden rounded-(--r-solid)">
              {openBatches.slice(0, 5).map((b) => (
                <Link
                  key={b.id}
                  href="/hr/timekeeping/batches"
                  className="focus-ring-jce flex min-h-11 items-center gap-3 p-3 transition-colors hover:bg-jce-green-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-ui-13 font-medium text-jce-ink">
                      {b.emp}
                    </div>
                    <div className="truncate text-ui-12 text-jce-ink-2">
                      {b.period} · {b.rows} rows
                    </div>
                  </div>
                  <Chip tone={BATCH_TONE[b.status] ?? "neutral"}>
                    {b.status}
                  </Chip>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Workforce composition */}
      <section className="flex flex-col gap-3">
        <h2 className="kicker text-jce-green-600">Workforce composition</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {byCat.map((c) => (
            <MetricCard
              key={c.cat}
              label={`${c.cat} rate`}
              value={c.n}
              hint="employees"
            />
          ))}
        </div>
        <div className="glass rounded-(--r-glass) p-4">
          <div className="kicker mb-2.5">By status</div>
          <div className="flex flex-wrap gap-2">
            {statusEntries.map(([s, n]) => (
              <Chip key={s} tone={STATUS_TONE[s] ?? "neutral"}>
                {s} · {n}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      {/* Quick actions (RBAC-gated) */}
      <section className="flex flex-col gap-3">
        <h2 className="kicker text-jce-green-600">Quick actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {canEditEmployees ? (
            <QuickAction
              href="/hr/employees/new"
              icon={UserPlusIcon}
              title="Add employee"
              sub="New PIS record"
            />
          ) : null}
          <QuickAction
            href="/hr/requests"
            icon={FileTextIcon}
            title="HR requests"
            sub="OB · OT · Leave"
          />
          <QuickAction
            href="/hr/timekeeping"
            icon={ClockIcon}
            title="Timekeeping"
            sub="Daily manhours"
          />
          <QuickAction
            href="/hr/timekeeping/batches"
            icon={ClipboardCheckIcon}
            title="Verify batches"
            sub="Lock for payroll"
          />
          <QuickAction
            href="/hr/audit"
            icon={ShieldCheckIcon}
            title="Audit log"
            sub="HR changes"
          />
        </div>
      </section>

      {/* Recent activity */}
      <div className="glass rounded-(--r-glass) p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-ui-16 font-semibold text-jce-ink">
            Recent activity
          </h2>
          <Button asChild variant="ghost" size="sm" className="min-h-11">
            <Link href="/hr/audit">View all</Link>
          </Button>
        </div>
        <div className="solid divide-y divide-jce-line overflow-hidden rounded-(--r-solid)">
          {recent.map((a, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-3 p-3 text-ui-13"
            >
              <span className="font-mono text-ui-12 whitespace-nowrap text-jce-ink-2">
                {a.ts}
              </span>
              <span className="min-w-40 flex-1 text-jce-ink">
                <span className="font-medium">{a.action}</span> — {a.delta}
              </span>
              <span className="text-ui-12 text-jce-ink-2">{a.actor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
