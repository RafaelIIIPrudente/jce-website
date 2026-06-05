"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { ROLES, canEdit } from "@/lib/rbac";
import {
  addSalesOrder,
  getSalesOrders,
  SO_REMARK_OPTIONS,
  SO_REMARK_TONE,
  SO_STATUS_OPTIONS,
  SO_STATUS_TONE,
  type SalesOrder,
} from "@/lib/mock/bdd";
import { peso, pesoCompact } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
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
import { KpiTile } from "@/components/jce/kpi-tile";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// B1 · Sales Orders list (bdd-core.jsx:14) — the canonical SO# registry every
// operational module (Parts 4–8) references. Row → B2 record. Reads the shared
// in-session store so newly-created SOs appear immediately and open a working
// detail. Search-filtered, then paginated.

const PAGE_SIZE = 4;

type FormState = {
  so: string;
  date: string;
  client: string;
  name: string;
  scope: string;
  amount: string;
  remarks: string;
  status: string;
  by: string;
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Suggest the next SO# in the YY-MM-### registry format (editable; validated). */
function suggestSoNumber(existing: readonly SalesOrder[]): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const prefix = `${yy}-${mm}-`;
  const tails = existing
    .filter((o) => o.so.startsWith(prefix))
    .map((o) => Number(o.so.slice(prefix.length)))
    .filter((n) => Number.isFinite(n));
  const next = (tails.length ? Math.max(...tails) : 390) + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

/** A blank New-SO form, prefilled with a suggested unique SO# and sensible defaults. */
function emptyForm(byShort: string): FormState {
  return {
    so: suggestSoNumber(getSalesOrders()),
    date: todayISO(),
    client: "",
    name: "",
    scope: "",
    amount: "0",
    remarks: "No Offer Yet",
    status: "Ongoing Project",
    by: byShort,
  };
}

function LabeledField({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-ui-12 font-semibold text-jce-ink-2"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-ui-12 text-(--st-danger-ink)">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SalesOrdersList() {
  const { role } = useJce();
  const readOnly = !canEdit(role, "bdd");
  const router = useRouter();

  const [rows, setRows] = useState<readonly SalesOrder[]>(() =>
    getSalesOrders(),
  );
  const refresh = () => setRows(getSalesOrders());

  // KPI summary — derived from the full store (not the search-filtered view) so
  // the strip always summarises the whole register and tracks a newly-created SO.
  const totalValue = rows.reduce((sum, o) => sum + o.amount, 0);
  const ongoing = rows.filter((o) => o.status === "Ongoing Project").length;
  const onHold = rows.filter((o) => o.status === "On Hold").length;
  const completed = rows.filter(
    (o) => o.turned || o.status === "Project Completed",
  ).length;

  // Search + pagination.
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  // A search change resets to page 1.
  const onSearch = (v: string) => {
    setQ(v);
    setPage(1);
  };
  const clearSearch = () => {
    setQ("");
    setPage(1);
  };

  const filtered = rows.filter((o) =>
    (o.so + o.client + o.name + o.scope)
      .toLowerCase()
      .includes(q.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages); // clamp when the search shrinks the list
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // New-SO dialog.
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<FormState>(() =>
    emptyForm(ROLES[role].short),
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const openCreate = () => {
    setForm(emptyForm(ROLES[role].short));
    setErrors({});
    setCreateOpen(true);
  };

  const setField = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submitCreate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    const so = form.so.trim();
    if (!so) next.so = "SO# is required.";
    else if (getSalesOrders().some((o) => o.so === so))
      next.so = "That SO# already exists — choose a unique number.";
    if (!form.client.trim()) next.client = "Client is required.";
    if (!form.name.trim()) next.name = "Project name is required.";
    if (!form.scope.trim()) next.scope = "Scope of work is required.";
    const amount = Number(form.amount);
    if (form.amount.trim() === "" || !Number.isFinite(amount) || amount < 0)
      next.amount = "Enter a valid amount of ₱0 or more.";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return; // keep the dialog open; do not append on failure
    }

    const created = addSalesOrder({
      so,
      date: form.date || todayISO(),
      client: form.client.trim(),
      name: form.name.trim(),
      scope: form.scope.trim(),
      amount,
      remarks: form.remarks,
      status: form.status,
      by: form.by.trim() || ROLES[role].short,
    });
    setCreateOpen(false);
    refresh();
    setPage(1); // new row is prepended → visible on page 1
    toast.success(`Sales Order ${created.so} created.`);
  };

  const columns: LedgerColumn<SalesOrder>[] = [
    {
      id: "date",
      header: "Date",
      cell: (o) => (
        <span className="font-mono text-ui-12 whitespace-nowrap text-jce-ink-2">
          {o.date}
        </span>
      ),
    },
    { id: "so", header: "SO No.", cell: (o) => <DocChip code={o.so} /> },
    { id: "client", header: "Client", cell: (o) => o.client },
    {
      id: "name",
      header: "Project Name",
      cell: (o) => <span className="font-medium text-jce-ink">{o.name}</span>,
    },
    {
      id: "amt",
      header: "Contract Amount",
      align: "right",
      cell: (o) => peso(o.amount),
    },
    {
      id: "remarks",
      header: "Remarks",
      cell: (o) => (
        <Chip tone={SO_REMARK_TONE[o.remarks] ?? "neutral"}>{o.remarks}</Chip>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (o) => (
        <Chip tone={SO_STATUS_TONE[o.status] ?? "neutral"}>{o.status}</Chip>
      ),
    },
    {
      id: "turned",
      header: "Turned over",
      cell: (o) =>
        o.turned ? (
          <Chip tone="success">Yes</Chip>
        ) : (
          <span className="text-jce-ink-2">—</span>
        ),
    },
    {
      id: "by",
      header: "Requested by",
      cell: (o) => <span className="text-jce-ink-2">{o.by}</span>,
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="BDD · B1"
        title="Sales Orders"
        description="The canonical SO# registry — every operational module keys off these numbers."
      />

      {/* KPI summary strip — derived live from the store (tracks created SOs) */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          label="Total contract value"
          value={
            <span title={peso(totalValue)}>{pesoCompact(totalValue)}</span>
          }
          delta={`${rows.length} sales order${rows.length === 1 ? "" : "s"}`}
          tone="neutral"
        />
        <KpiTile
          label="Ongoing"
          value={ongoing}
          delta="in progress"
          tone="info"
        />
        <KpiTile label="On hold" value={onHold} delta="paused" tone="pending" />
        <KpiTile
          label="Completed"
          value={completed}
          delta="turned over"
          tone="success"
        />
      </div>

      {/* Toolbar — search + primary action (consistent 44px control heights) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex h-11 w-full max-w-sm items-center gap-2 rounded-(--r-input) border border-jce-line bg-white/70 px-3 transition-colors focus-within:border-jce-green-600 focus-within:shadow-(--focus-ring)">
          <SearchIcon className="size-4 shrink-0 text-jce-ink-2" aria-hidden />
          <input
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search SO#, client, project, scope…"
            aria-label="Search sales orders"
            className="h-full w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
          />
        </div>
        {!readOnly ? (
          <Button onClick={openCreate} className="min-h-11 w-full sm:w-auto">
            <PlusIcon aria-hidden /> New SO
          </Button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            icon={
              <SearchIcon className="size-7" strokeWidth={1.5} aria-hidden />
            }
            title="No sales orders match your search"
            description="Try a different SO#, client, project, or scope keyword."
            action={
              <Button variant="outline" size="sm" onClick={clearSearch}>
                Clear search
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <LedgerGrid
            columns={columns}
            rows={pageRows}
            getRowKey={(o) => o.so}
            onRowClick={(o) => router.push(`/bdd/sales-orders/${o.so}`)}
            className="max-h-[calc(100dvh-20rem)]"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-ui-12 text-jce-ink-2">
              Page {safePage} of {totalPages} · {filtered.length} sales orders
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="focus-ring-jce min-h-11"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeftIcon aria-hidden /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="focus-ring-jce min-h-11"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRightIcon aria-hidden />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* New-SO dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>New Sales Order</DialogTitle>
            <DialogDescription>
              Register a new SO#. It becomes the anchor every operational module
              keys off — keep the number unique.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <LabeledField label="SO#" htmlFor="so-no" error={errors.so}>
              <input
                id="so-no"
                value={form.so}
                onChange={(e) => setField("so", e.target.value)}
                className="field font-mono"
                aria-invalid={errors.so ? true : undefined}
              />
            </LabeledField>
            <LabeledField label="Date" htmlFor="so-date" error={errors.date}>
              <input
                id="so-date"
                type="date"
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
                className="field"
              />
            </LabeledField>
            <LabeledField
              label="Client"
              htmlFor="so-client"
              error={errors.client}
            >
              <input
                id="so-client"
                value={form.client}
                onChange={(e) => setField("client", e.target.value)}
                className="field"
                placeholder="e.g. NORECO II"
                aria-invalid={errors.client ? true : undefined}
              />
            </LabeledField>
            <LabeledField
              label="Requested by"
              htmlFor="so-by"
              error={errors.by}
            >
              <input
                id="so-by"
                value={form.by}
                onChange={(e) => setField("by", e.target.value)}
                className="field"
              />
            </LabeledField>
            <LabeledField
              label="Project Name"
              htmlFor="so-name"
              error={errors.name}
              className="sm:col-span-2"
            >
              <input
                id="so-name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className="field"
                placeholder="e.g. 13.2KV Distribution Line"
                aria-invalid={errors.name ? true : undefined}
              />
            </LabeledField>
            <LabeledField
              label="Scope of Work"
              htmlFor="so-scope"
              error={errors.scope}
              className="sm:col-span-2"
            >
              <input
                id="so-scope"
                value={form.scope}
                onChange={(e) => setField("scope", e.target.value)}
                className="field"
                placeholder="e.g. 13.2KV distribution line construction"
                aria-invalid={errors.scope ? true : undefined}
              />
            </LabeledField>
            <LabeledField
              label="Contract Amount (₱)"
              htmlFor="so-amount"
              error={errors.amount}
            >
              <input
                id="so-amount"
                type="number"
                min={0}
                step="0.01"
                value={form.amount}
                onChange={(e) => setField("amount", e.target.value)}
                className="field font-mono tabular-nums"
                aria-invalid={errors.amount ? true : undefined}
              />
            </LabeledField>
            <div className="grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-2">
              <LabeledField label="Remarks" htmlFor="so-remarks">
                <Select
                  value={form.remarks}
                  onValueChange={(v) => setField("remarks", v)}
                >
                  <SelectTrigger id="so-remarks" className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SO_REMARK_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </LabeledField>
              <LabeledField label="Status" htmlFor="so-status">
                <Select
                  value={form.status}
                  onValueChange={(v) => setField("status", v)}
                >
                  <SelectTrigger id="so-status" className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SO_STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </LabeledField>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              className="min-h-11"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button className="min-h-11" onClick={submitCreate}>
              Create Sales Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
