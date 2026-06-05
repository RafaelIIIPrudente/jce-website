"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, PlusIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { ROLES, canEdit } from "@/lib/rbac";
import {
  EVENT_TONE,
  OFFER_EVENT_TYPES,
  OFFER_STATUS_TONE,
  getOfferEvents,
  getOffers,
  offerState,
  type Offer,
  type OfferEvent,
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
import { EmptyState } from "@/components/jce/empty-state";
import { MetricCard } from "@/components/jce/metric-card";
import { Timeline, type TimelineEvent } from "@/components/jce/timeline";

// B4 · Offer record — event stream (bdd-flagships.jsx:9-85, brief:1044-1050).
// IMMUTABLE record; current state (status / NOA / linked SO) is DERIVED from the
// append-only event stream. "Record event" PREPENDS — the record never edits
// inline. Strictly divergent from Accounting edit-after-issue (OQ#16). Premium
// tier: glass hero header + derived current-state MetricCard strip + elevated
// event-stream Timeline (NO Meter — offers have no part-of-a-whole ratio). See
// CLAUDE.md "Dashboard UI Standard".

function tlTone(t: Tone): TimelineEvent["tone"] {
  if (t === "success" || t === "info") return "green";
  if (t === "pending" || t === "danger") return "orange";
  return "ink";
}

function timestamp(): string {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}

// Resolve the offer from the shared in-session store (client-side) so offers
// created this session open without a 404. A genuinely-absent ref renders an
// empty state. Created offers have no seed events → an empty stream, so the
// derived state falls back to the offer's issued status.
export function OfferRecord({ offerRef }: { offerRef: string }) {
  const offer = getOffers().find((o) => o.ref === offerRef);

  if (!offer) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <Link
          href="/bdd/offers"
          className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
        >
          <ChevronLeftIcon className="size-4" aria-hidden /> Offers
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
            title="Offer not found"
            description={`No offer “${offerRef}” exists in this session. The mock registry resets on reload — a record created earlier may no longer be here.`}
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/bdd/offers">Back to Offers</Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return <OfferDetail offer={offer} seedEvents={getOfferEvents(offer.ref)} />;
}

function OfferDetail({
  offer,
  seedEvents,
}: {
  offer: Offer;
  seedEvents: readonly OfferEvent[];
}) {
  const { role } = useJce();
  const readOnly = !canEdit(role, "bdd");

  const [events, setEvents] = useState<OfferEvent[]>(() => [...seedEvents]);
  const [open, setOpen] = useState(false);
  const [evtType, setEvtType] = useState<string>(
    OFFER_EVENT_TYPES[0] ?? "Status Change",
  );
  const [evtData, setEvtData] = useState("");

  const state = offerState(events, offer.status);

  const append = () => {
    if (!evtData.trim()) return;
    setEvents([
      {
        type: evtType,
        data: evtData.trim(),
        ts: timestamp(),
        user: ROLES[role].short,
      },
      ...events,
    ]);
    setOpen(false);
    setEvtData("");
    toast.success(`Event recorded — ${evtType}`);
  };

  const tlEvents: TimelineEvent[] = events.map((e) => ({
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
        href="/bdd/offers"
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Offers
      </Link>

      {/* Header card (glass) — identity + hero total amount (immutable) */}
      <div className="glass rounded-(--r-glass) p-5">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <DocChip code={offer.ref} />
              <Chip tone="neutral">{offer.entity}</Chip>
              <Chip tone={OFFER_STATUS_TONE[state.status] ?? "neutral"}>
                {state.status}
              </Chip>
              <span className="rounded bg-(--st-locked-bg) px-2 py-0.5 text-[10px] font-semibold text-(--st-locked-ink)">
                Immutable record
              </span>
            </div>
            <h1 className="mt-2 text-ui-22 font-bold tracking-tight text-jce-ink">
              {offer.subject}
            </h1>
            <p className="mt-1 text-ui-13 text-jce-ink">{offer.client}</p>
            <p className="mt-0.5 text-ui-13 text-jce-ink-2">
              offered {offer.date} · emailed {offer.emailed || "—"} · by{" "}
              {offer.by}
            </p>
          </div>

          {/* Hero metric — Total Amount (immutable once issued) */}
          <div className="flex shrink-0 flex-col gap-1 sm:items-end">
            <span className="kicker">Total Amount</span>
            <div className="text-ui-22 leading-none font-bold tracking-tight tabular-nums text-jce-ink sm:text-ui-28">
              {peso(offer.amount)}
            </div>
          </div>
        </div>
      </div>

      {/* Derived current-state — MetricCards (computed from the stream, never typed) */}
      <section className="flex flex-col gap-3">
        <h2 className="kicker text-jce-green-600">
          Current state · derived (read-only)
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricCard
            label="Current status"
            value={
              <Chip tone={OFFER_STATUS_TONE[state.status] ?? "neutral"}>
                {state.status}
              </Chip>
            }
            derived
          />
          <MetricCard
            label="P.O. / NOA"
            value={
              state.noa ? (
                <span className="text-ui-14 leading-snug font-semibold text-jce-ink">
                  {state.noa}
                </span>
              ) : (
                <span className="text-ui-16 text-jce-ink-2">—</span>
              )
            }
            derived
          />
          <MetricCard
            label="Linked Sales Order"
            value={
              state.linkedSO ? (
                <DocChip code={state.linkedSO} />
              ) : (
                <span className="text-ui-16 text-jce-ink-2">—</span>
              )
            }
            derived
          />
        </div>
        <p className="text-ui-12 text-jce-ink-2">
          Derived from the event stream below — never typed on the record.
        </p>
      </section>

      {/* Event stream (solid) — the record's centerpiece visualization */}
      <section className="solid rounded-(--r-solid) p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-ui-16 font-semibold text-jce-ink">
              Event stream
            </h2>
            <p className="mt-0.5 text-ui-12 text-jce-ink-2">
              Append-only · {events.length} event
              {events.length === 1 ? "" : "s"} — the record moves only by events
              (OQ#16).
            </p>
          </div>
          {!readOnly ? (
            <Button
              onClick={() => setOpen(true)}
              className="min-h-11 w-full sm:w-auto"
            >
              <PlusIcon data-icon="inline-start" /> Record event
            </Button>
          ) : null}
        </div>
        {events.length === 0 ? (
          <div className="rounded-(--r-input) border border-dashed border-jce-line p-5 text-center">
            <p className="text-ui-13 text-jce-ink-2">
              No events yet. The offer keeps its issued status until an event is
              recorded.
            </p>
          </div>
        ) : (
          <Timeline events={tlEvents} />
        )}
        {!readOnly ? (
          <p className="mt-4 text-ui-12 text-jce-ink-2">
            <strong>For Revision</strong> → create a linked Rev.NN offer;{" "}
            <strong>Awarded</strong> → create the Sales Order, then link it via
            a “Sales Order Linked” event. The record itself is never edited.
          </p>
        ) : null}
      </section>

      {/* Record-event dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record event</DialogTitle>
            <DialogDescription>
              Appends to the append-only stream for {offer.ref}. The record is
              immutable — only events change its derived state.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <label className="text-ui-12 font-semibold text-jce-ink-2">
              Event type
              <Select value={evtType} onValueChange={setEvtType}>
                <SelectTrigger className="mt-1.5 min-h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OFFER_EVENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="text-ui-12 font-semibold text-jce-ink-2">
              Detail
              <input
                value={evtData}
                onChange={(e) => setEvtData(e.target.value)}
                placeholder="e.g. Acknowledged → Awarded · NOA No. … · SO# 26-05-378"
                className="field mt-1.5"
                autoFocus
              />
            </label>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              className="min-h-11"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button className="min-h-11" onClick={append}>
              Append event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
