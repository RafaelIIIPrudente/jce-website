"use client";

import { cn } from "@/lib/utils";
import { type Notification, type NotifTone } from "@/lib/mock/shell";

// Bell feed (screens-core.jsx:296-317 BellDropdown) — the notifications list shown
// in the top-bar bell popover. Rendered as content; the popover wrapper + unread
// badge live in the top bar. Tag: Glass popover / solid list.

const TONE_DOT: Record<NotifTone, string> = {
  pending: "bg-[var(--st-pending)]",
  info: "bg-[var(--st-info)]",
  danger: "bg-[var(--st-danger)]",
  neutral: "bg-jce-ink-2",
  success: "bg-[var(--st-success)]",
};

export function BellFeed({
  notifications,
  onMarkAllRead,
  onOpenAll,
  className,
}: {
  notifications: readonly Notification[];
  onMarkAllRead?: () => void;
  onOpenAll?: () => void;
  className?: string;
}) {
  return (
    <div data-slot="bell-feed" className={cn("w-80", className)}>
      <div className="mb-2 flex items-center justify-between">
        <strong className="text-ui-13 text-jce-ink">Notifications</strong>
        {onMarkAllRead ? (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="focus-ring-jce rounded text-ui-12 font-medium text-jce-green-700 hover:underline"
          >
            Mark all read
          </button>
        ) : null}
      </div>
      <div className="solid max-h-80 divide-y divide-jce-line overflow-auto p-0">
        {notifications.slice(0, 10).map((n) => (
          <div
            key={n.id}
            className={cn(
              "flex gap-2.5 px-3 py-2.5",
              n.unread && "bg-jce-green-50",
            )}
          >
            <span
              className={cn(
                "mt-1.5 size-2 shrink-0 rounded-full",
                TONE_DOT[n.tone],
              )}
              aria-hidden
            />
            <div className="min-w-0">
              <div className="text-ui-12 font-medium text-jce-ink">{n.msg}</div>
              <div className="mt-0.5 text-ui-12 text-jce-ink-2">
                {n.mod} · {n.type} · {n.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      {onOpenAll ? (
        <button
          type="button"
          onClick={onOpenAll}
          className="focus-ring-jce mt-2 w-full rounded-md py-2 text-center text-ui-12 font-medium text-jce-green-700 hover:bg-jce-green-50"
        >
          Open notifications center →
        </button>
      ) : null}
    </div>
  );
}
