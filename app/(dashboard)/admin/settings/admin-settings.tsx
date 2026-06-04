"use client";

import { useState } from "react";
import { LockIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { SETTINGS_DATA, SETTINGS_NAV } from "@/lib/mock/shell";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// X6 · System settings (screens-admin.jsx:507-592). Glass settings rail over
// solid lookup tables. Read-only gates +Add / Edit for non-admins.

type Row = readonly string[];

export function AdminSettings() {
  const { role } = useJce();
  const readOnly = !canEdit(role, "admin");
  const [tab, setTab] = useState(SETTINGS_NAV[0]!.id);

  const d = SETTINGS_DATA[tab]!;

  const columns: LedgerColumn<Row>[] = [
    ...d.cols.map((c, j) => ({
      id: String(j),
      header: c,
      cell: (row: Row) =>
        row[j] ? row[j] : <span className="text-jce-ink-2">—</span>,
    })),
    ...(readOnly
      ? []
      : [
          {
            id: "edit",
            header: "",
            align: "right" as const,
            cell: () => (
              <span className="cursor-pointer text-ui-12 font-semibold text-jce-green-700">
                Edit
              </span>
            ),
          },
        ]),
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="Admin · X6"
        title="System settings"
        actions={
          readOnly ? (
            <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-(--st-neutral-bg) px-2.5 py-1.5 text-ui-12 text-(--st-neutral-ink)">
              <LockIcon className="size-3.5" aria-hidden /> Read-only
            </span>
          ) : undefined
        }
      />

      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        {/* Glass settings rail */}
        <nav className="glass flex h-fit flex-col gap-0.5 rounded-(--r-glass) p-2">
          {SETTINGS_NAV.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setTab(s.id)}
              className={cn(
                "focus-ring-jce rounded-[8px] px-3 py-2 text-left text-ui-13 font-medium transition-colors",
                tab === s.id
                  ? "bg-jce-green-700 text-primary-foreground"
                  : "text-jce-ink-2 hover:bg-jce-green-50 hover:text-jce-green-900",
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Body */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="max-w-[60ch]">
              <h2 className="flex items-center gap-2 text-ui-18 font-semibold text-jce-ink">
                {d.title}
                {d.oq ? (
                  <span className="rounded-full bg-(--st-pending-bg) px-2 py-0.5 text-ui-12 font-semibold text-(--st-pending-ink)">
                    OPEN-Q #{d.oq}
                  </span>
                ) : null}
              </h2>
              <p className="mt-1 text-ui-13 text-pretty text-jce-ink-2">
                {d.desc}
              </p>
            </div>
            {!readOnly ? <Button size="sm">+ Add</Button> : null}
          </div>

          <LedgerGrid columns={columns} rows={d.rows} getRowKey={(_, i) => i} />

          <p className="text-ui-12 text-jce-ink-2">
            CRUD per lookup with soft-delete / active flags. In-flight approval
            chains are never retroactively changed (FR-APV-06).
          </p>
        </div>
      </div>
    </div>
  );
}
