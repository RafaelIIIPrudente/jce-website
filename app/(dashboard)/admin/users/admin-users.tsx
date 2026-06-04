"use client";

import { useState } from "react";
import { LockIcon, SearchIcon } from "lucide-react";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import {
  ALL_ROLE_NAMES,
  USERS,
  USER_STATUS_TONE,
  type User,
  type UserStatus,
} from "@/lib/mock/shell";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// X5 · Admin users & roles (screens-admin.jsx:137-365). Solid users table → glass
// row drawer with single-select role + confirm dialog. One role per user, no
// unions. Read-only for non-admins: role as static text, action verbs absent.

function StatusChip({ status }: { status: UserStatus }) {
  return <Chip tone={USER_STATUS_TONE[status]}>{status}</Chip>;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AdminUsers() {
  const { role } = useJce();
  const readOnly = !canEdit(role, "admin");

  const [users, setUsers] = useState<User[]>(() =>
    USERS.map((u) => ({ ...u })),
  );
  const [selId, setSelId] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const [confirmRole, setConfirmRole] = useState<string | null>(null);

  const sel = users.find((u) => u.id === selId) ?? null;
  const filtered = users.filter((u) =>
    (u.name + u.email + u.role).toLowerCase().includes(q.toLowerCase()),
  );

  const applyRole = () => {
    if (!sel || !confirmRole) return;
    setUsers((us) =>
      us.map((u) => (u.id === sel.id ? { ...u, role: confirmRole } : u)),
    );
    setConfirmRole(null);
  };

  const columns: LedgerColumn<User>[] = [
    {
      id: "name",
      header: "Name",
      cell: (u) => <span className="font-semibold text-jce-ink">{u.name}</span>,
    },
    {
      id: "email",
      header: "Email / username",
      cell: (u) => <span className="text-jce-ink-2">{u.email}</span>,
    },
    { id: "role", header: "Role (one only)", cell: (u) => u.role },
    {
      id: "status",
      header: "Status",
      cell: (u) => <StatusChip status={u.status} />,
    },
    {
      id: "last",
      header: "Last login",
      cell: (u) => (
        <span className="font-mono text-ui-12 whitespace-nowrap text-jce-ink-2">
          {u.last}
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="Admin · X5"
        title="Users & roles"
        actions={
          <>
            <div className="flex h-9 w-56 items-center gap-2 rounded-[8px] border border-jce-line bg-white/70 px-2.5">
              <SearchIcon
                className="size-4 shrink-0 text-jce-ink-2"
                aria-hidden
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search users…"
                aria-label="Search users"
                className="w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
              />
            </div>
            {readOnly ? (
              <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-(--st-neutral-bg) px-2.5 py-1.5 text-ui-12 text-(--st-neutral-ink)">
                <LockIcon className="size-3.5" aria-hidden /> Read-only — Admin
                provisions
              </span>
            ) : (
              <Button size="sm">+ Create user</Button>
            )}
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <LedgerGrid
          columns={columns}
          rows={filtered}
          getRowKey={(u) => u.id}
          onRowClick={(u) => setSelId(u.id)}
          activeRowKey={sel?.id}
          className="max-h-[calc(100dvh-15rem)]"
        />

        {/* Role roster (read-only reference — the §3 matrix) */}
        <aside className="glass h-fit rounded-(--r-glass) p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-ui-14 font-semibold text-jce-ink">
              Role roster
            </h2>
            <Chip tone="neutral">{ALL_ROLE_NAMES.length} roles</Chip>
          </div>
          <ul className="solid flex flex-col divide-y divide-jce-line overflow-hidden rounded-(--r-solid)">
            {ALL_ROLE_NAMES.map((n) => (
              <li
                key={n}
                className="flex items-center gap-2 px-3 py-2 text-ui-13 text-jce-ink"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-jce-green-600" />
                {n}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-ui-12 text-jce-ink-2">
            One role per user — effective permissions are exactly the assigned
            role&rsquo;s. No permission unions. Threshold bands are data —
            OPEN-Q&nbsp;#17.
          </p>
        </aside>
      </div>

      {/* Row drawer — glass frame, solid form */}
      <Sheet open={!!sel} onOpenChange={(o) => !o && setSelId(null)}>
        <SheetContent
          side="right"
          className="w-full gap-0 border-jce-line bg-(--glass-modal) supports-backdrop-filter:backdrop-blur-xl sm:max-w-md"
        >
          {sel ? (
            <>
              <SheetHeader className="flex-row items-center gap-3">
                <Avatar className="size-11">
                  <AvatarFallback>{initials(sel.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <SheetTitle className="text-ui-16">{sel.name}</SheetTitle>
                  <SheetDescription className="flex items-center gap-1.5">
                    {sel.email} · <DocChip code={sel.emp} />
                  </SheetDescription>
                </div>
              </SheetHeader>

              <div className="solid mt-2 flex flex-col gap-4 rounded-(--r-solid) p-4">
                <div>
                  <label className="text-ui-12 font-semibold text-jce-ink-2">
                    Assign role{" "}
                    <span className="font-normal">
                      (single-select — changes effective permissions)
                    </span>
                  </label>
                  {readOnly ? (
                    <div className="mt-1.5 text-ui-14 font-medium text-jce-ink">
                      {sel.role}
                    </div>
                  ) : (
                    <Select
                      value={sel.role}
                      onValueChange={(v) => setConfirmRole(v)}
                    >
                      <SelectTrigger className="mt-1.5 h-10 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_ROLE_NAMES.map((n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div>
                  <label className="text-ui-12 font-semibold text-jce-ink-2">
                    Linked employee record
                  </label>
                  <div className="mt-1.5">
                    <DocChip code={sel.emp} />
                  </div>
                </div>

                <div>
                  <label className="text-ui-12 font-semibold text-jce-ink-2">
                    Account status
                  </label>
                  <div className="mt-1.5">
                    <StatusChip status={sel.status} />
                  </div>
                </div>

                {!readOnly ? (
                  <div className="flex flex-wrap items-center gap-2 border-t border-jce-line pt-4">
                    <Button variant="outline" size="sm">
                      Reset password
                    </Button>
                    {sel.status === "Locked" ? (
                      <Button size="sm">Unlock</Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        Lock
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-(--st-danger) hover:text-(--st-danger)"
                    >
                      Deactivate
                    </Button>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Role-change confirm */}
      <Dialog
        open={!!confirmRole}
        onOpenChange={(o) => !o && setConfirmRole(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change role to “{confirmRole}”?</DialogTitle>
            <DialogDescription>
              This immediately changes <strong>{sel?.name}</strong>&rsquo;s
              effective permissions across every module. The change is audited
              (NFR-SEC-06).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmRole(null)}>
              Cancel
            </Button>
            <Button onClick={applyRole}>Change role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
