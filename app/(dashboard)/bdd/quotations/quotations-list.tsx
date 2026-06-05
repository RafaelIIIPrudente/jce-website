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
import { canEdit } from "@/lib/rbac";
import {
  addQuotation,
  getOffers,
  getQuotations,
  getSalesOrders,
  QUOTATION_CAT_PREFIX,
  quotationCounts,
  type Quotation,
  type QuotationCat,
} from "@/lib/mock/bdd";
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
import { Segmented } from "@/components/jce/segmented";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// B5 · Quotations list (bdd-core.jsx). EC / Workshop / Solar category streams
// with per-category Ref. No. counters. Reads the shared in-session store so a
// newly-created request appears immediately and opens a working detail. Filtered
// by category AND search, then paginated. A quotation request = the BDD admin
// asking suppliers to quote, then logging each quote received (no invite flow).

const PAGE_SIZE = 10;
const NONE = "__none"; // sentinel for "no linked record" (Radix needs non-empty)

type FormState = {
  cat: QuotationCat;
  ref: string;
  item: string;
  client: string;
  date: string;
  so: string; // "" = none, "WORKSHOP" for Workshop
  offer: string; // "" = none
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Suggest the next Ref. No. (Q-XX-YYNNN) for a category stream (editable;
 *  validated unique). NNN is the next sequential number seen in that category. */
function suggestQuotationRef(
  cat: QuotationCat,
  existing: readonly Quotation[],
): string {
  const prefix = QUOTATION_CAT_PREFIX[cat];
  const yy = String(new Date().getFullYear()).slice(-2);
  const re = new RegExp(`^${prefix}\\d{2}(\\d{3})$`);
  const tails = existing
    .filter((q) => q.cat === cat)
    .map((q) => q.ref.match(re)?.[1])
    .filter((m): m is string => m != null)
    .map(Number);
  const base = cat === "EC" ? 31 : cat === "Workshop" ? 12 : 8;
  const next = (tails.length ? Math.max(...tails) : base) + 1;
  return `${prefix}${yy}${String(next).padStart(3, "0")}`;
}

/** A blank New-request form for a category, prefilled with a suggested Ref. No.
 *  Workshop requests are internal (Client = Internal, SO = WORKSHOP, no pickers). */
function emptyForm(cat: QuotationCat): FormState {
  const workshop = cat === "Workshop";
  return {
    cat,
    ref: suggestQuotationRef(cat, getQuotations()),
    item: "",
    client: workshop ? "Internal" : "",
    date: todayISO(),
    so: workshop ? "WORKSHOP" : "",
    offer: "",
  };
}

function LabeledField({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
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
      ) : hint ? (
        <p className="text-ui-12 text-jce-ink-2">{hint}</p>
      ) : null}
    </div>
  );
}

export function QuotationsList() {
  const { role } = useJce();
  const readOnly = !canEdit(role, "bdd");
  const router = useRouter();

  const [cat, setCat] = useState<QuotationCat>("EC");

  const [rows, setRows] = useState<readonly Quotation[]>(() => getQuotations());
  const refresh = () => setRows(getQuotations());

  // KPI summary — derived from ALL categories (not the category/search-filtered
  // view) so the strip summarises the whole request book and tracks a created
  // request. Counts only (no headline money figure for Quotations).
  const winnerCount = rows.filter((r) => r.winner).length;
  const awaiting = rows.filter((r) => !r.winner).length;
  const quotesReceived = rows.reduce(
    (n, r) => n + quotationCounts(r).responded,
    0,
  );

  // Search + pagination.
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  // Category OR search changes reset pagination to page 1.
  const onCat = (v: string) => {
    setCat(v as QuotationCat);
    setPage(1);
  };
  const onSearch = (v: string) => {
    setQ(v);
    setPage(1);
  };
  const clearSearch = () => {
    setQ("");
    setPage(1);
  };

  // Category filter AND search, in that order, then paginate.
  const filtered = rows
    .filter((r) => r.cat === cat)
    .filter((r) =>
      (r.ref + r.item + r.client).toLowerCase().includes(q.toLowerCase()),
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages); // clamp when the filter shrinks the list
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // New-request dialog.
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<FormState>(() => emptyForm("EC"));
  const [refTouched, setRefTouched] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const openCreate = () => {
    setForm(emptyForm(cat)); // default to the active category stream
    setRefTouched(false);
    setErrors({});
    setCreateOpen(true);
  };

  const setField = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Switching the category re-suggests the Ref. No. (unless edited) and toggles
  // the Workshop locks (Internal client / WORKSHOP so / no linked pickers).
  const onCatField = (v: string) => {
    const c = v as QuotationCat;
    setForm((f) => ({
      ...f,
      cat: c,
      ref: refTouched ? f.ref : suggestQuotationRef(c, getQuotations()),
      client:
        c === "Workshop" ? "Internal" : f.cat === "Workshop" ? "" : f.client,
      so: c === "Workshop" ? "WORKSHOP" : f.cat === "Workshop" ? "" : f.so,
      offer: c === "Workshop" ? "" : f.offer,
    }));
  };
  const onRefField = (v: string) => {
    setRefTouched(true);
    setField("ref", v);
  };

  const submitCreate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    const ref = form.ref.trim();
    if (!ref) next.ref = "Ref. No. is required.";
    else if (getQuotations().some((r) => r.ref === ref))
      next.ref = "That Ref. No. already exists — choose a unique number.";
    if (!form.item.trim()) next.item = "Item is required.";
    if (form.cat !== "Workshop" && !form.client.trim())
      next.client = "Client is required for EC and Solar requests.";
    if (!form.date) next.date = "Request date is required.";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return; // keep the dialog open; do not create on failure
    }

    const created = addQuotation({
      ref,
      cat: form.cat,
      item: form.item.trim(),
      client: form.cat === "Workshop" ? "Internal" : form.client.trim(),
      date: form.date || todayISO(),
      so: form.cat === "Workshop" ? "WORKSHOP" : form.so.trim(),
      offer: form.offer.trim() === "" ? null : form.offer.trim(),
    });
    setCreateOpen(false);
    setCat(created.cat);
    setPage(1);
    refresh();
    toast.success(`Quotation request ${created.ref} created.`);
    router.push(`/bdd/quotations/${encodeURIComponent(created.ref)}`);
  };

  const isWorkshop = form.cat === "Workshop";

  const columns: LedgerColumn<Quotation>[] = [
    { id: "ref", header: "Ref. No.", cell: (r) => <DocChip code={r.ref} /> },
    {
      id: "item",
      header: "Item",
      cell: (r) => <span className="font-medium text-jce-ink">{r.item}</span>,
    },
    { id: "client", header: "Client", cell: (r) => r.client },
    {
      id: "date",
      header: "Request Date",
      cell: (r) => (
        <span className="font-mono text-ui-12 whitespace-nowrap text-jce-ink-2">
          {r.date}
        </span>
      ),
    },
    {
      id: "resp",
      header: "Responded",
      align: "center",
      cell: (r) => {
        const c = quotationCounts(r);
        return (
          <span className="tabular-nums">
            {c.responded}/{c.invited}
          </span>
        );
      },
    },
    {
      id: "winner",
      header: "Winner",
      cell: (r) =>
        r.winner ? (
          <Chip tone="success">{r.winner}</Chip>
        ) : (
          <span className="text-jce-ink-2">—</span>
        ),
    },
    {
      id: "links",
      header: "Linked",
      cell: (r) => (
        <span className="flex flex-wrap gap-1.5">
          {r.offer ? <DocChip code={r.offer} /> : null}
          {r.so && r.so !== "WORKSHOP" ? <DocChip code={r.so} /> : null}
          {!r.offer && (!r.so || r.so === "WORKSHOP") ? (
            <span className="text-jce-ink-2">—</span>
          ) : null}
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="BDD · B5"
        title="Quotations"
        description="Supplier quote requests by category. Log each quote you receive, then compare prices and pick a winner."
      />

      {/* KPI summary strip — derived live across all categories (tracks created requests) */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          label="Total requests"
          value={rows.length}
          delta="all categories"
          tone="neutral"
        />
        <KpiTile
          label="Winner selected"
          value={winnerCount}
          delta="awarded"
          tone="success"
        />
        <KpiTile
          label="Awaiting decision"
          value={awaiting}
          delta="no winner yet"
          tone="pending"
        />
        <KpiTile
          label="Quotes received"
          value={quotesReceived}
          delta="across requests"
          tone="info"
        />
      </div>

      {/* Toolbar — search + category filter + primary action (≥44px controls;
          stacks full-width on phones) */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex h-11 w-full items-center gap-2 rounded-(--r-input) border border-jce-line bg-white/70 px-3 transition-colors focus-within:border-jce-green-600 focus-within:shadow-(--focus-ring) sm:max-w-sm">
            <SearchIcon
              className="size-4 shrink-0 text-jce-ink-2"
              aria-hidden
            />
            <input
              value={q}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search Ref. No., item, client…"
              aria-label="Search quotation requests"
              className="h-full w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
            />
          </div>
          {!readOnly ? (
            <Button onClick={openCreate} className="min-h-11 w-full sm:w-auto">
              <PlusIcon aria-hidden /> New request
            </Button>
          ) : null}
        </div>
        <Segmented
          aria-label="Category"
          options={[
            { value: "EC", label: "EC" },
            { value: "Workshop", label: "Workshop" },
            { value: "Solar", label: "Solar" },
          ]}
          value={cat}
          onValueChange={onCat}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            icon={
              <SearchIcon className="size-7" strokeWidth={1.5} aria-hidden />
            }
            title="No requests match your search"
            description="Try a different Ref. No., item, or client keyword in this category."
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
            getRowKey={(r) => r.ref}
            onRowClick={(r) =>
              router.push(`/bdd/quotations/${encodeURIComponent(r.ref)}`)
            }
            className="max-h-[calc(100dvh-22rem)]"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-ui-12 text-jce-ink-2">
              Page {safePage} of {totalPages} · {filtered.length} requests
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

      {/* New-request dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>New quotation request</DialogTitle>
            <DialogDescription>
              Open a request to collect supplier quotes for an item. You&apos;ll
              log each quote you receive on the next screen, then compare and
              pick a winner.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <LabeledField label="Category" htmlFor="q-cat">
              <Select value={form.cat} onValueChange={onCatField}>
                <SelectTrigger id="q-cat" className="min-h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EC">EC</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Solar">Solar</SelectItem>
                </SelectContent>
              </Select>
            </LabeledField>
            <LabeledField label="Ref. No." htmlFor="q-ref" error={errors.ref}>
              <input
                id="q-ref"
                value={form.ref}
                onChange={(e) => onRefField(e.target.value)}
                className="field font-mono"
                aria-invalid={errors.ref ? true : undefined}
              />
            </LabeledField>
            <LabeledField
              label="Item / what's being quoted"
              htmlFor="q-item"
              error={errors.item}
              className="sm:col-span-2"
            >
              <input
                id="q-item"
                value={form.item}
                onChange={(e) => setField("item", e.target.value)}
                className="field"
                placeholder="e.g. Power transformer 10MVA"
                aria-invalid={errors.item ? true : undefined}
              />
            </LabeledField>
            {isWorkshop ? (
              <LabeledField
                label="Client"
                htmlFor="q-client-ws"
                hint="Workshop requests are internal."
              >
                <input
                  id="q-client-ws"
                  value="Internal"
                  disabled
                  className="field"
                />
              </LabeledField>
            ) : (
              <LabeledField
                label="Client"
                htmlFor="q-client"
                error={errors.client}
              >
                <input
                  id="q-client"
                  value={form.client}
                  onChange={(e) => setField("client", e.target.value)}
                  className="field"
                  placeholder="e.g. NORECO II"
                  aria-invalid={errors.client ? true : undefined}
                />
              </LabeledField>
            )}
            <LabeledField
              label="Request date"
              htmlFor="q-date"
              error={errors.date}
            >
              <input
                id="q-date"
                type="date"
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
                className="field"
                aria-invalid={errors.date ? true : undefined}
              />
            </LabeledField>
            {!isWorkshop ? (
              <>
                <LabeledField
                  label="Linked Sales Order (optional)"
                  htmlFor="q-so"
                >
                  <Select
                    value={form.so === "" ? NONE : form.so}
                    onValueChange={(v) => setField("so", v === NONE ? "" : v)}
                  >
                    <SelectTrigger id="q-so" className="min-h-11 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>None</SelectItem>
                      {getSalesOrders().map((s) => (
                        <SelectItem key={s.so} value={s.so}>
                          {s.so} · {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </LabeledField>
                <LabeledField label="Linked Offer (optional)" htmlFor="q-offer">
                  <Select
                    value={form.offer === "" ? NONE : form.offer}
                    onValueChange={(v) =>
                      setField("offer", v === NONE ? "" : v)
                    }
                  >
                    <SelectTrigger id="q-offer" className="min-h-11 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>None</SelectItem>
                      {getOffers().map((o) => (
                        <SelectItem key={o.ref} value={o.ref}>
                          {o.ref} · {o.client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </LabeledField>
              </>
            ) : null}
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
              Create request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
