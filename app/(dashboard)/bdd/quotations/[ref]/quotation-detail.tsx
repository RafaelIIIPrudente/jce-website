"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  PlusIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { ROLES, canEdit } from "@/lib/rbac";
import {
  EVENT_TONE,
  QRESP_OPTIONS,
  QRESP_TONE,
  addSupplierQuote,
  getQuotations,
  getSupplierQuotes,
  lowestPrice,
  quotationCounts,
  updateQuotation,
  updateSupplierQuote,
  type OfferEvent,
  type Quotation,
  type SupplierQuote,
  type Tone,
} from "@/lib/mock/bdd";
import { peso } from "@/lib/mock/format";
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
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { MetricCard } from "@/components/jce/metric-card";
import {
  ComparisonMatrix,
  type MatrixColumn,
  type MatrixRow,
} from "@/components/jce/comparison-matrix";
import { Timeline, type TimelineEvent } from "@/components/jce/timeline";
import { EmptyState } from "@/components/jce/empty-state";

// B6 · Quotation comparison (bdd-flagships.jsx:90-128, brief:1060-1066). The BDD
// admin LOGS each supplier's quote (there is no invite/await flow); the matrix,
// the responded/invited counts and the winner all derive from those logged rows.
// The request header is immutable; a logged quote can be edited in-session (each
// supplier is logged once). Select Winner fires a sensitive-change notification.
// Premium tier: glass hero header (best/winning quote) + derived MetricCard strip
// + the ComparisonMatrix as the centerpiece (NO Meter — no part-of-a-whole
// headline). See CLAUDE.md "Dashboard UI Standard".

const DONE_STATUS = "Done (Quote Received)";
const MATRIX_PAGE_SIZE = 4; // supplier columns per matrix page
const EVENTS_PAGE_SIZE = 5; // events per stream page

type LogForm = {
  supplier: string;
  status: string;
  price: string;
  respDate: string;
  note: string;
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
function timestamp(): string {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}
function tlTone(t: Tone): TimelineEvent["tone"] {
  if (t === "success" || t === "info") return "green";
  if (t === "pending" || t === "danger") return "orange";
  return "ink";
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

// Resolve the request from the shared in-session store (client-side) so requests
// created this session open without a 404. A genuinely-absent ref renders an
// empty state.
export function QuotationDetail({ quotationRef }: { quotationRef: string }) {
  const quotation = getQuotations().find((q) => q.ref === quotationRef);

  if (!quotation) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <Link
          href="/bdd/quotations"
          className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
        >
          <ChevronLeftIcon className="size-4" aria-hidden /> Quotations
        </Link>
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            icon={
              <TriangleAlertIcon
                className="size-7"
                strokeWidth={1.5}
                aria-hidden
              />
            }
            title="Quotation request not found"
            description={`No request “${quotationRef}” exists in this session. The mock registry resets on reload — a request created earlier may no longer be here.`}
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/bdd/quotations">Back to Quotations</Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return <QuotationDetailBody quotation={quotation} />;
}

function QuotationDetailBody({ quotation }: { quotation: Quotation }) {
  const { role, addNotification } = useJce();
  const readOnly = !canEdit(role, "bdd");

  const [quotes, setQuotes] = useState<readonly SupplierQuote[]>(() =>
    getSupplierQuotes(quotation.ref),
  );

  const initialWinner =
    quotes.find((q) => q.winner)?.supplier ?? quotation.winner ?? null;
  const [winner, setWinner] = useState<string | null>(initialWinner);
  const [events, setEvents] = useState<OfferEvent[]>(() => {
    const priced: OfferEvent[] = quotes
      .filter((q) => q.price != null)
      .map((q) => ({
        type: "Price Recorded",
        data: `${q.supplier} · ${peso(q.price as number)}`,
        ts: q.respDate,
        user: "B. Navarro",
      }));
    if (initialWinner) {
      priced.unshift({
        type: "Selected as Winner",
        data: initialWinner,
        ts: "2026-05-22 10:30",
        user: "B. Navarro",
      });
    }
    return priced;
  });

  // Pagination — matrix supplier columns + event stream.
  const [matrixPage, setMatrixPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);

  // Log/edit-supplier-quote dialog (one form, two modes).
  const [logOpen, setLogOpen] = useState(false);
  const [mode, setMode] = useState<"log" | "edit">("log");
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null);
  const [form, setForm] = useState<LogForm>(() => ({
    supplier: "",
    status: DONE_STATUS,
    price: "",
    respDate: todayISO(),
    note: "",
  }));
  const [errors, setErrors] = useState<Partial<Record<keyof LogForm, string>>>(
    {},
  );

  const openLog = () => {
    setMode("log");
    setEditingSupplier(null);
    setForm({
      supplier: "",
      status: DONE_STATUS,
      price: "",
      respDate: todayISO(),
      note: "",
    });
    setErrors({});
    setLogOpen(true);
  };
  const openEdit = (quote: SupplierQuote) => {
    setMode("edit");
    setEditingSupplier(quote.supplier);
    setForm({
      supplier: quote.supplier,
      status: quote.status,
      price: quote.price != null ? String(quote.price) : "",
      respDate: quote.respDate === "—" ? "" : quote.respDate,
      note: quote.note,
    });
    setErrors({});
    setLogOpen(true);
  };
  const setField = (key: keyof LogForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const counts = quotationCounts(quotation);
  const lowest = lowestPrice(quotes);

  // Hero metric — the winning supplier's price if a winner is selected, else the
  // lowest logged price, else nothing. All derived from the logged quotes.
  const winnerQuote = winner
    ? (quotes.find((qq) => qq.supplier === winner) ?? null)
    : null;
  const heroValue = winnerQuote?.price ?? lowest;
  const heroLabel =
    winnerQuote?.price != null
      ? "Winning quote"
      : lowest != null
        ? "Best quote so far"
        : "Best quote";

  const submitQuote = () => {
    const next: Partial<Record<keyof LogForm, string>> = {};
    const supplier = form.supplier.trim();
    if (!supplier) next.supplier = "Supplier is required.";
    else if (
      quotes.some(
        (s) =>
          s.supplier.toLowerCase() === supplier.toLowerCase() &&
          s.supplier !== editingSupplier,
      )
    )
      next.supplier = "That supplier is already logged on this request.";

    const isDone = form.status === DONE_STATUS;
    const hasPrice = form.price.trim() !== "";
    const price = Number(form.price);
    if (isDone && !hasPrice)
      next.price = "Unit price is required when status is Done.";
    else if (hasPrice && (!Number.isFinite(price) || price < 0))
      next.price = "Enter a valid price of ₱0 or more.";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return; // keep the dialog open; do not save on failure
    }

    const finalPrice = hasPrice ? price : null;
    const respDate = form.respDate.trim() === "" ? "—" : form.respDate;

    if (mode === "edit" && editingSupplier) {
      updateSupplierQuote(quotation.ref, editingSupplier, {
        supplier,
        respDate,
        status: form.status,
        price: finalPrice,
        note: form.note.trim(),
      });
      setQuotes([...getSupplierQuotes(quotation.ref)]);
      // keep the winner highlight consistent if a winning supplier was renamed
      if (editingSupplier === winner && supplier !== editingSupplier) {
        setWinner(supplier);
        updateQuotation(quotation.ref, { winner: supplier });
      }
      setLogOpen(false);
      toast.success(`Updated quote — ${supplier}.`);
      return;
    }

    const quote: SupplierQuote = {
      supplier,
      respDate,
      status: form.status,
      price: finalPrice,
      winner: false,
      note: form.note.trim(),
    };
    addSupplierQuote(quotation.ref, quote);
    const nextQuotes = getSupplierQuotes(quotation.ref);
    setQuotes([...nextQuotes]); // new reference → re-render
    // surface the newly-logged supplier (appended last → last matrix page)
    setMatrixPage(Math.ceil(nextQuotes.length / MATRIX_PAGE_SIZE));
    if (finalPrice != null) {
      setEvents((ev) => [
        {
          type: "Price Recorded",
          data: `${supplier} · ${peso(finalPrice)}`,
          ts: timestamp(),
          user: ROLES[role].short,
        },
        ...ev,
      ]);
      setEventsPage(1); // new event is newest-first → page 1
    }
    setLogOpen(false);
    toast.success(`Logged quote — ${supplier}.`);
  };

  const selectWinner = (supplier: string) => {
    if (supplier === winner) return;
    setWinner(supplier);
    updateQuotation(quotation.ref, { winner: supplier }); // persist across nav
    setEvents((ev) => [
      {
        type: "Selected as Winner",
        data: supplier,
        ts: timestamp(),
        user: ROLES[role].short,
      },
      ...ev,
    ]);
    setEventsPage(1); // new event is newest-first → page 1
    addNotification({
      mod: "BDD",
      type: "Sensitive",
      tone: "danger",
      unread: true,
      msg: `Winner selected on ${quotation.ref} → ${supplier}`,
      time: "just now",
      doc: quotation.ref,
    });
    toast.success(`Winner recorded — ${supplier} (sensitive-change sent)`);
  };

  // Matrix supplier-column pagination (BEST highlight stays global).
  const matrixTotalPages = Math.max(
    1,
    Math.ceil(quotes.length / MATRIX_PAGE_SIZE),
  );
  const matrixSafePage = Math.min(matrixPage, matrixTotalPages);
  const matrixStart = (matrixSafePage - 1) * MATRIX_PAGE_SIZE;
  const pagedQuotes = quotes.slice(matrixStart, matrixStart + MATRIX_PAGE_SIZE);

  const columns: MatrixColumn[] = pagedQuotes.map((q) => ({
    id: q.supplier,
    label: readOnly ? (
      q.supplier
    ) : (
      <span className="inline-flex items-center gap-1.5">
        {q.supplier}
        <button
          type="button"
          onClick={() => openEdit(q)}
          aria-label={`Edit ${q.supplier} quote`}
          className="focus-ring-jce inline-grid size-6 shrink-0 place-items-center rounded text-jce-ink-2 transition-colors hover:text-jce-green-700"
        >
          <PencilIcon className="size-3.5" aria-hidden />
        </button>
      </span>
    ),
    winner: winner === q.supplier,
  }));
  const rows: MatrixRow[] = [
    {
      label: "Unit price",
      cells: pagedQuotes.map((q) => ({
        value: q.price != null ? peso(q.price) : "—",
        best: q.price != null && q.price === lowest,
        align: "right",
      })),
    },
    {
      label: "Response date",
      cells: pagedQuotes.map((q) => ({ value: q.respDate })),
    },
    {
      label: "Status",
      cells: pagedQuotes.map((q) => ({
        value: <Chip tone={QRESP_TONE[q.status] ?? "neutral"}>{q.status}</Chip>,
      })),
    },
    {
      label: "Notes",
      cells: pagedQuotes.map((q) => ({ value: q.note || "—" })),
    },
  ];

  // Event-stream pagination (newest-first).
  const eventsTotalPages = Math.max(
    1,
    Math.ceil(events.length / EVENTS_PAGE_SIZE),
  );
  const eventsSafePage = Math.min(eventsPage, eventsTotalPages);
  const eventsStart = (eventsSafePage - 1) * EVENTS_PAGE_SIZE;

  const tlEvents: TimelineEvent[] = events
    .slice(eventsStart, eventsStart + EVENTS_PAGE_SIZE)
    .map((e) => ({
      title: (
        <>
          <span className="font-semibold">{e.type}</span>
          {" — "}
          {e.data}
        </>
      ),
      meta: `${e.user} · ${e.ts}`,
      tone: tlTone(EVENT_TONE[e.type] ?? "neutral"),
    }));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <Link
        href="/bdd/quotations"
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Quotations
      </Link>

      {/* Header card (glass) — identity + hero best/winning quote */}
      <div className="glass rounded-(--r-glass) p-5">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <DocChip code={quotation.ref} />
              <Chip tone="neutral">{quotation.cat}</Chip>
              {quotation.offer ? <DocChip code={quotation.offer} /> : null}
              {quotation.so && quotation.so !== "WORKSHOP" ? (
                <DocChip code={quotation.so} />
              ) : null}
              <span className="rounded bg-(--st-locked-bg) px-2 py-0.5 text-[10px] font-semibold text-(--st-locked-ink)">
                Immutable request
              </span>
            </div>
            <h1 className="mt-2 text-ui-22 font-bold tracking-tight text-jce-ink">
              {quotation.item}
            </h1>
            <p className="mt-1 text-ui-13 text-jce-ink">{quotation.client}</p>
            <p className="mt-0.5 text-ui-13 text-jce-ink-2">
              requested {quotation.date} · {counts.responded}/{counts.invited}{" "}
              quotes logged
            </p>
          </div>

          {/* Hero metric — winning / best logged quote */}
          <div className="flex shrink-0 flex-col gap-1 sm:items-end">
            <span className="kicker">{heroLabel}</span>
            <div className="text-ui-22 leading-none font-bold tracking-tight tabular-nums text-jce-ink sm:text-ui-28">
              {heroValue != null ? peso(heroValue) : "—"}
            </div>
            {winner ? (
              <span className="text-ui-12 font-semibold text-(--st-success)">
                {winner}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Derived quote summary — MetricCards (computed from logged quotes, never typed) */}
      <section className="flex flex-col gap-3">
        <h2 className="kicker text-jce-green-600">
          Quote summary · derived (read-only)
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricCard
            label="Quotes logged"
            value={`${counts.responded}/${counts.invited}`}
            hint="priced / logged"
            derived
          />
          <MetricCard
            label="Lowest price"
            value={
              lowest != null ? (
                peso(lowest)
              ) : (
                <span className="text-ui-16 text-jce-ink-2">—</span>
              )
            }
            derived
          />
          <MetricCard
            label="Winner"
            value={
              winner ? (
                <Chip tone="success">{winner}</Chip>
              ) : (
                <span className="text-ui-16 text-jce-ink-2">Not selected</span>
              )
            }
            derived
          />
        </div>
        <p className="text-ui-12 text-jce-ink-2">
          Derived from logged supplier quotes — never typed on the request.
        </p>
      </section>

      {quotes.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            icon={<PlusIcon className="size-7" strokeWidth={1.5} aria-hidden />}
            title="No supplier quotes logged yet"
            description="Log each supplier's quote (price, status, date) to start comparing and pick a winner."
            action={
              !readOnly ? (
                <Button size="sm" className="min-h-11" onClick={openLog}>
                  <PlusIcon aria-hidden /> Log supplier quote
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <>
          {/* Supplier comparison — the record's centerpiece visualization */}
          <section className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-ui-16 font-semibold text-jce-ink">
                  Supplier comparison
                </h2>
                <p className="mt-0.5 text-ui-12 text-jce-ink-2">
                  {counts.responded} of {counts.invited} logged supplier
                  {counts.invited === 1 ? "" : "s"} quoted a price · lowest
                  highlighted BEST
                  {winner ? ` · winner ${winner}` : ""}.
                </p>
              </div>
              {!readOnly ? (
                <Button onClick={openLog} className="min-h-11 w-full sm:w-auto">
                  <PlusIcon aria-hidden /> Log supplier quote
                </Button>
              ) : null}
            </div>

            <ComparisonMatrix
              rowHeader="Criterion"
              columns={columns}
              rows={rows}
            />

            {matrixTotalPages > 1 ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-ui-12 text-jce-ink-2">
                  Suppliers {matrixStart + 1}–{matrixStart + pagedQuotes.length}{" "}
                  of {quotes.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="focus-ring-jce min-h-11"
                    disabled={matrixSafePage <= 1}
                    onClick={() => setMatrixPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeftIcon aria-hidden /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="focus-ring-jce min-h-11"
                    disabled={matrixSafePage >= matrixTotalPages}
                    onClick={() =>
                      setMatrixPage((p) => Math.min(matrixTotalPages, p + 1))
                    }
                  >
                    Next <ChevronRightIcon aria-hidden />
                  </Button>
                </div>
              </div>
            ) : null}

            {!readOnly ? (
              <div className="solid flex flex-wrap items-center gap-2 rounded-(--r-solid) p-4">
                <span className="mr-1 text-ui-12 font-semibold text-jce-ink-2">
                  Select winner:
                </span>
                {quotes.map((q) => (
                  <Button
                    key={q.supplier}
                    size="sm"
                    className="min-h-11"
                    variant={winner === q.supplier ? "approve" : "outline"}
                    disabled={q.price == null}
                    onClick={() => selectWinner(q.supplier)}
                  >
                    {winner === q.supplier
                      ? `Winner · ${q.supplier}`
                      : q.supplier}
                  </Button>
                ))}
              </div>
            ) : null}
          </section>

          {/* Event stream (solid) */}
          <section className="solid rounded-(--r-solid) p-5">
            <div className="mb-4">
              <h2 className="text-ui-16 font-semibold text-jce-ink">
                Event stream
              </h2>
              <p className="mt-0.5 text-ui-12 text-jce-ink-2">
                Append-only · {events.length} event
                {events.length === 1 ? "" : "s"} (price logs + winner
                selection).
              </p>
            </div>
            {events.length === 0 ? (
              <div className="rounded-(--r-input) border border-dashed border-jce-line p-5 text-center">
                <p className="text-ui-13 text-jce-ink-2">
                  No priced events yet — log a quote with a price to start the
                  stream.
                </p>
              </div>
            ) : (
              <Timeline events={tlEvents} />
            )}
            {eventsTotalPages > 1 ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-jce-line pt-4">
                <p className="text-ui-12 text-jce-ink-2">
                  Page {eventsSafePage} of {eventsTotalPages} · {events.length}{" "}
                  events
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="focus-ring-jce min-h-11"
                    disabled={eventsSafePage <= 1}
                    onClick={() => setEventsPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeftIcon aria-hidden /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="focus-ring-jce min-h-11"
                    disabled={eventsSafePage >= eventsTotalPages}
                    onClick={() =>
                      setEventsPage((p) => Math.min(eventsTotalPages, p + 1))
                    }
                  >
                    Next <ChevronRightIcon aria-hidden />
                  </Button>
                </div>
              </div>
            ) : null}
          </section>
        </>
      )}

      {/* Log-supplier-quote dialog */}
      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {mode === "edit" ? "Edit supplier quote" : "Log supplier quote"}
            </DialogTitle>
            <DialogDescription>
              {mode === "edit"
                ? `Update the quote recorded for ${editingSupplier} on ${quotation.ref}.`
                : `Record a quote you received from a supplier on ${quotation.ref}. Each supplier is logged once — you can edit it later.`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <LabeledField
              label="Supplier"
              htmlFor="sq-supplier"
              error={errors.supplier}
              className="sm:col-span-2"
            >
              <input
                id="sq-supplier"
                value={form.supplier}
                onChange={(e) => setField("supplier", e.target.value)}
                className="field"
                placeholder="e.g. ABB Inc."
                aria-invalid={errors.supplier ? true : undefined}
              />
            </LabeledField>
            <LabeledField label="Status" htmlFor="sq-status">
              <Select
                value={form.status}
                onValueChange={(v) => setField("status", v)}
              >
                <SelectTrigger id="sq-status" className="min-h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QRESP_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </LabeledField>
            <LabeledField
              label="Unit price (₱)"
              htmlFor="sq-price"
              error={errors.price}
              hint={
                form.status === DONE_STATUS
                  ? "Required for a received quote."
                  : "Optional until a quote is received."
              }
            >
              <input
                id="sq-price"
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                className="field font-mono tabular-nums"
                aria-invalid={errors.price ? true : undefined}
              />
            </LabeledField>
            <LabeledField label="Response date" htmlFor="sq-date">
              <input
                id="sq-date"
                type="date"
                value={form.respDate}
                onChange={(e) => setField("respDate", e.target.value)}
                className="field"
              />
            </LabeledField>
            <LabeledField
              label="Note (optional)"
              htmlFor="sq-note"
              className="sm:col-span-2"
            >
              <input
                id="sq-note"
                value={form.note}
                onChange={(e) => setField("note", e.target.value)}
                className="field"
                placeholder="e.g. Best price + 30d lead"
              />
            </LabeledField>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              className="min-h-11"
              onClick={() => setLogOpen(false)}
            >
              Cancel
            </Button>
            <Button className="min-h-11" onClick={submitQuote}>
              {mode === "edit" ? "Save changes" : "Log quote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
