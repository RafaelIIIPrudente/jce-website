"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderOpenIcon } from "lucide-react";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import {
  BILLING_TONE,
  PROJECTS_PMG,
  PROJECT_STATUS_TONE,
  SITEENG_SO,
  type PmgProject,
} from "@/lib/mock/pmg";
import { pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";
import { Segmented } from "@/components/jce/segmented";

// P2 · Portfolio (pmg-screens.jsx:102). Card/list toggle, progress rings.
// SITE-SCOPED for Site Engineers (only their assigned SO#).

function Ring({ pct }: { pct: number }) {
  return (
    <div
      className="grid size-16 shrink-0 place-items-center rounded-full"
      style={{
        background: `conic-gradient(var(--jce-green-600) ${pct * 3.6}deg, var(--table-zebra) 0)`,
      }}
    >
      <div className="grid size-12 place-items-center rounded-full bg-card text-ui-13 font-bold tabular-nums text-jce-ink">
        {pmoney(pct)}%
      </div>
    </div>
  );
}

function workspaceHref(p: PmgProject): string {
  return `/pmg/projects/${p.code}/${p.type === "Customer" ? "accomplishment" : "header"}`;
}

export function Portfolio() {
  const { role } = useJce();
  const router = useRouter();
  const canCreate = canEdit(role, "pmg");
  const scoped = role === "siteeng";
  const [view, setView] = useState("cards");

  const list = scoped
    ? PROJECTS_PMG.filter((p) => p.so === SITEENG_SO)
    : PROJECTS_PMG;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="PMG · P2"
        title={
          <span className="flex flex-wrap items-center gap-2">
            Project portfolio
            {scoped ? (
              <span className="inline-flex items-center rounded-full bg-jce-green-50 px-2.5 py-0.5 text-ui-12 font-medium text-jce-green-700">
                assigned sites
              </span>
            ) : null}
          </span>
        }
        actions={
          <>
            <Segmented
              aria-label="View"
              value={view}
              onValueChange={setView}
              options={[
                { value: "cards", label: "Cards" },
                { value: "list", label: "List" },
              ]}
            />
            {canCreate ? (
              <Button asChild size="sm">
                <Link href="/pmg/new">+ New project</Link>
              </Button>
            ) : null}
          </>
        }
      />

      {list.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-2">
          <EmptyState
            icon={
              <FolderOpenIcon
                className="size-7"
                strokeWidth={1.5}
                aria-hidden
              />
            }
            title={scoped ? "No assigned projects" : "No projects yet"}
            description={
              scoped
                ? "You are not currently assigned to a project site. Ask the PM Head to assign you."
                : "Create a project via the BOQ import wizard or the clone / manual builder."
            }
          />
        </div>
      ) : view === "list" ? (
        <div className="solid overflow-auto rounded-(--r-solid) p-0">
          <table className="jtable">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th className="text-right">% complete</th>
                <th>Period</th>
                <th>Billing</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr
                  key={p.code}
                  tabIndex={0}
                  onClick={() => router.push(workspaceHref(p))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(workspaceHref(p));
                    }
                  }}
                  className="focus-ring-jce cursor-pointer outline-none"
                >
                  <td className="font-semibold text-jce-ink">{p.name}</td>
                  <td>{p.client}</td>
                  <td className="num">{pmoney(p.pct)}%</td>
                  <td>{p.period}</td>
                  <td>
                    {p.billing === "—" ? (
                      <span className="text-jce-ink-2">—</span>
                    ) : (
                      <Chip tone={BILLING_TONE[p.billing] ?? "neutral"}>
                        {p.billing}
                      </Chip>
                    )}
                  </td>
                  <td>
                    <Chip tone={PROJECT_STATUS_TONE[p.status] ?? "neutral"}>
                      {p.status}
                    </Chip>
                  </td>
                  <td className="font-mono text-ui-12 text-jce-ink-2">
                    {p.updated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Link
              key={p.code}
              href={workspaceHref(p)}
              className="focus-ring-jce glass flex flex-col gap-3 rounded-(--r-glass) p-4 text-left transition-colors hover:border-jce-green-500"
            >
              <div className="flex items-center justify-between">
                {p.so ? (
                  <DocChip code={p.so} />
                ) : (
                  <Chip tone="neutral">Cost center</Chip>
                )}
                <Chip tone={PROJECT_STATUS_TONE[p.status] ?? "neutral"}>
                  {p.status}
                </Chip>
              </div>
              <div>
                <div className="text-ui-14 font-semibold text-jce-ink">
                  {p.name}
                </div>
                <div className="text-ui-12 text-jce-ink-2">{p.client}</div>
              </div>
              <div className="flex items-center gap-4">
                <Ring pct={p.pct} />
                <div className="flex flex-col gap-1.5 text-ui-12">
                  <div>
                    <div className="text-jce-ink-2">This period</div>
                    <div className="font-semibold text-jce-ink">
                      +{pmoney(p.gain)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-jce-ink-2">Current</div>
                    <div className="font-semibold text-jce-ink">{p.period}</div>
                  </div>
                </div>
              </div>
              <div className="text-ui-12 text-jce-green-700">→ {p.next}</div>
              <div className="text-ui-12 text-jce-ink-2">
                updated {p.updated.slice(0, 10)} · {p.by}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
