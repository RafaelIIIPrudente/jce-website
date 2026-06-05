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
  addOffer,
  getOffers,
  OFFER_STATUS_OPTIONS,
  OFFER_STATUS_TONE,
  type Offer,
  type OfferEntity,
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
import { Segmented } from "@/components/jce/segmented";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// B3 · Offers list (bdd-core.jsx:56-65). JCEPSI / JICA are separate streams with
// separate per-entity Ref. No. counters (CLIENT_CODE-YY-XXX[Rev.NN]). Reads the
// shared in-session store so newly-created offers appear immediately and open a
// working detail. Filtered by entity AND search, then paginated.

const PAGE_SIZE = 10;

type FormState = {
  ref: string;
  entity: OfferEntity;
  date: string;
  emailed: string;
  client: string;
  subject: string;
  amount: string;
  status: string;
  by: string;
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Suggest the next Ref. No. in CLIENT_CODE-YY-XXX format for an entity stream
 *  (editable; validated unique). The CODE is an entity stand-in the user edits to
 *  the real client code; XXX is the next sequential number seen for that entity. */
function suggestOfferRef(
  entity: OfferEntity,
  existing: readonly Offer[],
): string {
  const yy = String(new Date().getFullYear()).slice(-2);
  const code = entity === "JICA" ? "JICA" : "JCE";
  const re = new RegExp(`-${yy}-(\\d{3})`);
  const tails = existing
    .filter((o) => o.entity === entity)
    .map((o) => o.ref.match(re)?.[1])
    .filter((m): m is string => m != null)
    .map(Number);
  const base = entity === "JICA" ? 4 : 21;
  const next = (tails.length ? Math.max(...tails) : base) + 1;
  return `${code}-${yy}-${String(next).padStart(3, "0")}`;
}

/** A blank New-offer form, prefilled with a suggested unique Ref. No. + defaults. */
function emptyForm(entity: OfferEntity, byShort: string): FormState {
  return {
    ref: suggestOfferRef(entity, getOffers()),
    entity,
    date: todayISO(),
    emailed: "",
    client: "",
    subject: "",
    amount: "0",
    status: OFFER_STATUS_OPTIONS[0],
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

export function OffersList() {
  const { role } = useJce();
  const readOnly = !canEdit(role, "bdd");
  const router = useRouter();

  const [entity, setEntity] = useState<OfferEntity>("JCEPSI");

  const [rows, setRows] = useState<readonly Offer[]>(() => getOffers());
  const refresh = () => setRows(getOffers());

  // KPI summary — derived from the WHOLE offer book (both entity streams, not the
  // entity/search-filtered view) so the strip summarises the full register and
  // tracks a newly-created offer. Status grouping follows OFFER_STATUS_TONE.
  const totalValue = rows.reduce((sum, o) => sum + o.amount, 0);
  const awarded = rows.filter((o) => o.status === "Awarded").length;
  const awaiting = rows.filter(
    (o) =>
      o.status === "Waiting for Client Response" ||
      o.status === "Acknowledged" ||
      o.status === "For Revision",
  ).length;
  const notAwarded = rows.filter(
    (o) =>
      o.status === "Not Awarded" ||
      o.status === "Offer Lapsed" ||
      o.status === "Cancelled",
  ).length;

  // Search + pagination.
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  // Entity OR search changes reset pagination to page 1.
  const onEntity = (v: string) => {
    setEntity(v as OfferEntity);
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

  // Entity filter AND search, in that order, then paginate.
  const filtered = rows
    .filter((o) => o.entity === entity)
    .filter((o) =>
      (o.ref + o.client + o.subject).toLowerCase().includes(q.toLowerCase()),
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages); // clamp when the filter shrinks the list
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // New-offer dialog.
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<FormState>(() =>
    emptyForm("JCEPSI", ROLES[role].short),
  );
  const [refTouched, setRefTouched] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const openCreate = () => {
    setForm(emptyForm(entity, ROLES[role].short)); // default to the active stream
    setRefTouched(false);
    setErrors({});
    setCreateOpen(true);
  };

  const setField = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Switching the entity re-suggests the Ref. No. unless the user edited it.
  const onEntityField = (v: string) => {
    const e = v as OfferEntity;
    setForm((f) => ({
      ...f,
      entity: e,
      ref: refTouched ? f.ref : suggestOfferRef(e, getOffers()),
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
    else if (getOffers().some((o) => o.ref === ref))
      next.ref = "That Ref. No. already exists — choose a unique number.";
    if (!form.entity) next.entity = "Entity is required.";
    if (!form.client.trim()) next.client = "Client is required.";
    if (!form.subject.trim()) next.subject = "Subject is required.";
    const amount = Number(form.amount);
    if (form.amount.trim() === "" || !Number.isFinite(amount) || amount < 0)
      next.amount = "Enter a valid amount of ₱0 or more.";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return; // keep the dialog open; do not append on failure
    }

    const created = addOffer({
      ref,
      entity: form.entity,
      date: form.date || todayISO(),
      emailed: form.emailed.trim(),
      by: form.by.trim() || ROLES[role].short,
      client: form.client.trim(),
      subject: form.subject.trim(),
      amount,
      status: form.status,
    });
    setCreateOpen(false);
    refresh();
    setEntity(created.entity); // jump to the new offer's stream so it's visible
    setPage(1); // prepended → on page 1
    toast.success(`Offer ${created.ref} created.`);
  };

  const columns: LedgerColumn<Offer>[] = [
    { id: "ref", header: "Ref. No.", cell: (o) => <DocChip code={o.ref} /> },
    {
      id: "date",
      header: "Offer Date",
      cell: (o) => (
        <span className="font-mono text-ui-12 whitespace-nowrap text-jce-ink-2">
          {o.date}
        </span>
      ),
    },
    { id: "client", header: "Client", cell: (o) => o.client },
    {
      id: "subject",
      header: "Subject",
      cell: (o) => (
        <span className="font-medium text-jce-ink">{o.subject}</span>
      ),
    },
    {
      id: "amt",
      header: "Total Amount",
      align: "right",
      cell: (o) => peso(o.amount),
    },
    {
      id: "status",
      header: "Status",
      cell: (o) => (
        <Chip tone={OFFER_STATUS_TONE[o.status] ?? "neutral"}>{o.status}</Chip>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="BDD · B3"
        title="Offers"
        description="Formal offers per entity stream. Immutable once issued — the record moves only by appended events (OQ#16)."
      />

      {/* KPI summary strip — derived live from the whole offer book (tracks created offers) */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          label="Total offered value"
          value={
            <span title={peso(totalValue)}>{pesoCompact(totalValue)}</span>
          }
          delta={`${rows.length} offer${rows.length === 1 ? "" : "s"}`}
          tone="neutral"
        />
        <KpiTile label="Awarded" value={awarded} delta="won" tone="success" />
        <KpiTile
          label="Awaiting response"
          value={awaiting}
          delta="in play"
          tone="pending"
        />
        <KpiTile
          label="Not awarded"
          value={notAwarded}
          delta="lapsed / declined"
          tone="danger"
        />
      </div>

      {/* Toolbar — search + entity filter + primary action (≥44px controls;
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
              placeholder="Search Ref. No., client, subject…"
              aria-label="Search offers"
              className="h-full w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
            />
          </div>
          {!readOnly ? (
            <Button onClick={openCreate} className="min-h-11 w-full sm:w-auto">
              <PlusIcon aria-hidden /> New offer
            </Button>
          ) : null}
        </div>
        <Segmented
          aria-label="Entity stream"
          options={[
            { value: "JCEPSI", label: "JCEPSI" },
            { value: "JICA", label: "JICA" },
          ]}
          value={entity}
          onValueChange={onEntity}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            icon={
              <SearchIcon className="size-7" strokeWidth={1.5} aria-hidden />
            }
            title="No offers match your search"
            description="Try a different Ref. No., client, or subject keyword in this entity stream."
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
            getRowKey={(o) => o.ref}
            onRowClick={(o) =>
              router.push(`/bdd/offers/${encodeURIComponent(o.ref)}`)
            }
            className="max-h-[calc(100dvh-22rem)]"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-ui-12 text-jce-ink-2">
              Page {safePage} of {totalPages} · {filtered.length} offers
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

      {/* New-offer dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>New offer</DialogTitle>
            <DialogDescription>
              Issue a formal offer into the selected entity stream. The Ref. No.
              is the record key — keep it unique.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <LabeledField
              label="Entity"
              htmlFor="offer-entity"
              error={errors.entity}
            >
              <Select value={form.entity} onValueChange={onEntityField}>
                <SelectTrigger id="offer-entity" className="min-h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JCEPSI">JCEPSI</SelectItem>
                  <SelectItem value="JICA">JICA</SelectItem>
                </SelectContent>
              </Select>
            </LabeledField>
            <LabeledField
              label="Ref. No."
              htmlFor="offer-ref"
              error={errors.ref}
            >
              <input
                id="offer-ref"
                value={form.ref}
                onChange={(e) => onRefField(e.target.value)}
                className="field font-mono"
                aria-invalid={errors.ref ? true : undefined}
              />
            </LabeledField>
            <LabeledField label="Offer Date" htmlFor="offer-date">
              <input
                id="offer-date"
                type="date"
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
                className="field"
              />
            </LabeledField>
            <LabeledField label="Emailed (optional)" htmlFor="offer-emailed">
              <input
                id="offer-emailed"
                type="date"
                value={form.emailed}
                onChange={(e) => setField("emailed", e.target.value)}
                className="field"
              />
            </LabeledField>
            <LabeledField
              label="Client"
              htmlFor="offer-client"
              error={errors.client}
            >
              <input
                id="offer-client"
                value={form.client}
                onChange={(e) => setField("client", e.target.value)}
                className="field"
                placeholder="e.g. NORECO II"
                aria-invalid={errors.client ? true : undefined}
              />
            </LabeledField>
            <LabeledField label="Requested by" htmlFor="offer-by">
              <input
                id="offer-by"
                value={form.by}
                onChange={(e) => setField("by", e.target.value)}
                className="field"
              />
            </LabeledField>
            <LabeledField
              label="Subject"
              htmlFor="offer-subject"
              error={errors.subject}
              className="sm:col-span-2"
            >
              <input
                id="offer-subject"
                value={form.subject}
                onChange={(e) => setField("subject", e.target.value)}
                className="field"
                placeholder="e.g. 13.2KV Distribution Line — formal offer"
                aria-invalid={errors.subject ? true : undefined}
              />
            </LabeledField>
            <LabeledField
              label="Total Amount (₱)"
              htmlFor="offer-amount"
              error={errors.amount}
            >
              <input
                id="offer-amount"
                type="number"
                min={0}
                step="0.01"
                value={form.amount}
                onChange={(e) => setField("amount", e.target.value)}
                className="field font-mono tabular-nums"
                aria-invalid={errors.amount ? true : undefined}
              />
            </LabeledField>
            <LabeledField label="Status" htmlFor="offer-status">
              <Select
                value={form.status}
                onValueChange={(v) => setField("status", v)}
              >
                <SelectTrigger id="offer-status" className="min-h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OFFER_STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </LabeledField>
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
              Create offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
