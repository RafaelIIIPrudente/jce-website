"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { type Notification } from "@/lib/mock/shell";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Segmented } from "@/components/jce/segmented";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";
import { BellIcon } from "lucide-react";

// X4 · Notifications center (screens-core.jsx:319-360). Full solid table over the
// shared role-context notifications slice (so marking read here updates the bell
// badge). Module + unread filters; mark-as-read per row + mark-all-read.

export function NotificationsCenter() {
  const { notifications, markRead, markAllRead } = useJce();
  const [mod, setMod] = useState("All");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const mods = useMemo(
    () => ["All", ...Array.from(new Set(notifications.map((n) => n.mod)))],
    [notifications],
  );

  const filtered = notifications.filter(
    (n) => (mod === "All" || n.mod === mod) && (!unreadOnly || n.unread),
  );

  const columns: LedgerColumn<Notification>[] = [
    {
      id: "dot",
      header: "",
      headerClassName: "w-8",
      cell: (n) =>
        n.unread ? (
          <span
            className="block size-2 rounded-full bg-jce-orange-600"
            aria-label="Unread"
          />
        ) : null,
    },
    {
      id: "msg",
      header: "Notification",
      cell: (n) => (
        <span className={cn("text-ui-13", n.unread && "font-semibold")}>
          {n.msg}
        </span>
      ),
    },
    { id: "mod", header: "Module", cell: (n) => n.mod },
    {
      id: "type",
      header: "Type",
      cell: (n) => <Chip tone={n.tone}>{n.type}</Chip>,
    },
    {
      id: "ref",
      header: "Reference",
      cell: (n) =>
        n.doc ? (
          <DocChip code={n.doc} />
        ) : (
          <span className="text-jce-ink-2">—</span>
        ),
    },
    {
      id: "when",
      header: "When",
      cell: (n) => (
        <span className="whitespace-nowrap text-jce-ink-2">{n.time}</span>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="Cross-cutting · X4"
        title="Notifications"
        actions={
          <>
            <label className="flex cursor-pointer items-center gap-2 text-ui-12 text-jce-ink-2">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(e) => setUnreadOnly(e.target.checked)}
                className="size-4 accent-jce-green-700"
              />
              Unread only
            </label>
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              Mark all read
            </Button>
          </>
        }
      />

      <Segmented
        aria-label="Filter by module"
        options={mods.map((m) => ({ value: m, label: m }))}
        value={mod}
        onValueChange={setMod}
      />

      {filtered.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            icon={
              <BellIcon className="size-7" strokeWidth={1.75} aria-hidden />
            }
            title="No notifications"
            description="You're all caught up — nothing matches these filters."
          />
        </div>
      ) : (
        <LedgerGrid
          columns={columns}
          rows={filtered}
          getRowKey={(n) => n.id}
          onRowClick={(n) => markRead(n.id)}
          className="max-h-[calc(100dvh-15rem)]"
        />
      )}

      <p className="text-ui-12 text-jce-ink-2">
        Click a row to mark it read. Includes sensitive-change alerts (e.g.
        Contract Amount edited).
      </p>
    </div>
  );
}
