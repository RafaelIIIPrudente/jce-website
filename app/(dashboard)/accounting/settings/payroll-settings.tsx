"use client";

import { LockIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import { SETTINGS_SECTIONS } from "@/lib/mock/accounting";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";

// A1 · Payroll Settings (acc-payroll.jsx:710). 8 effectivity-versioned sections.
// Read-only for Payroll Officer (reads); editable by Accounting Lead / Owner.
export function PayrollSettings() {
  const { role } = useJce();
  const canManage = canVerb(role, "acc");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="Accounting · A1"
        title="Payroll Settings"
        description="Every table versioned by effectivity date so past periods reproduce historical figures · edits audited (SET-003)."
        actions={
          !canManage ? (
            <span className="inline-flex items-center gap-1.5 rounded-(--r-input) bg-(--table-zebra) px-2.5 py-1 text-ui-12 text-jce-ink-2">
              <LockIcon className="size-3.5" aria-hidden /> Read-only
            </span>
          ) : null
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {SETTINGS_SECTIONS.map((s) => (
          <div
            key={s.n}
            className="solid flex items-start gap-3 rounded-(--r-solid) p-4"
          >
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-jce-green-100 text-ui-13 font-bold text-jce-green-700">
              {s.n}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-ui-14 font-semibold text-jce-ink">
                {s.title}
              </div>
              <div className="mt-0.5 text-ui-12 text-jce-ink-2">{s.desc}</div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="rounded bg-jce-green-50 px-1.5 py-0.5 text-[9px] font-semibold text-jce-green-700">
                effectivity-versioned
              </span>
              {canManage ? (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => toast.success(`Editing “${s.title}” (mock).`)}
                >
                  Edit
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
