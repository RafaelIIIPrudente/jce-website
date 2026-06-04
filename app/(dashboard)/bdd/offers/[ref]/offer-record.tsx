"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { ROLES, canEdit } from "@/lib/rbac";
import {
  EVENT_TONE,
  OFFER_EVENT_TYPES,
  OFFER_STATUS_TONE,
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
import { Timeline, type TimelineEvent } from "@/components/jce/timeline";

// B4 · Offer record — event stream (bdd-flagships.jsx:9-85, brief:1044-1050).
// IMMUTABLE record; current state (status / NOA / linked SO) is DERIVED from the
// append-only event stream. "Record event" PREPENDS — the record never edits
// inline. Strictly divergent from Accounting edit-after-issue (OQ#16).

function tlTone(t: Tone): TimelineEvent["tone"] {
  if (t === "success" || t === "info") return "green";
  if (t === "pending" || t === "danger") return "orange";
  return "ink";
}

function timestamp(): string {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}

export function OfferRecord({
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

      {/* Immutable header card (glass) */}
      <div className="glass rounded-(--r-glass) p-5">
        <div className="flex flex-wrap items-center gap-2">
          <DocChip code={offer.ref} />
          <Chip tone="neutral">{offer.entity}</Chip>
          <Chip tone={OFFER_STATUS_TONE[state.status] ?? "neutral"}>
            {state.status}
          </Chip>
          <span className="ml-auto rounded bg-(--st-locked-bg) px-2 py-0.5 text-[10px] font-semibold text-(--st-locked-ink)">
            Immutable record
          </span>
        </div>
        <h1 className="mt-2 text-ui-22 font-bold tracking-tight text-jce-ink">
          {offer.subject}
        </h1>
        <p className="mt-1 text-ui-13 text-jce-ink-2">
          {offer.client} · offered {offer.date} · emailed {offer.emailed} · by{" "}
          {offer.by}
        </p>
        <div className="mt-3 font-mono text-ui-16 font-bold tabular-nums text-jce-ink">
          {peso(offer.amount)}
        </div>
      </div>

      {/* Derived current-state strip (solid) */}
      <div className="solid grid grid-cols-1 gap-4 rounded-(--r-solid) p-5 sm:grid-cols-3">
        <div>
          <div className="kicker text-jce-green-600">Current status</div>
          <div className="mt-1.5">
            <Chip tone={OFFER_STATUS_TONE[state.status] ?? "neutral"}>
              {state.status}
            </Chip>
          </div>
        </div>
        <div>
          <div className="kicker text-jce-green-600">P.O. / NOA</div>
          <div className="mt-1.5 text-ui-13 text-jce-ink">
            {state.noa ?? <span className="text-jce-ink-2">—</span>}
          </div>
        </div>
        <div>
          <div className="kicker text-jce-green-600">Linked Sales Order</div>
          <div className="mt-1.5">
            {state.linkedSO ? (
              <DocChip code={state.linkedSO} />
            ) : (
              <span className="text-ui-13 text-jce-ink-2">—</span>
            )}
          </div>
        </div>
        <p className="text-ui-12 text-jce-ink-2 sm:col-span-3">
          Derived from the event stream below — never typed on the record.
        </p>
      </div>

      {/* Event stream (solid) */}
      <div className="solid rounded-(--r-solid) p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-ui-16 font-semibold text-jce-ink">
            Event stream
          </h2>
          {!readOnly ? (
            <Button size="sm" onClick={() => setOpen(true)}>
              <PlusIcon data-icon="inline-start" /> Record event
            </Button>
          ) : null}
        </div>
        {events.length === 0 ? (
          <p className="text-ui-13 text-jce-ink-2">
            No events yet. The offer keeps its issued status until an event is
            recorded.
          </p>
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
      </div>

      {/* Record-event dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
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
                <SelectTrigger className="mt-1.5 h-10 w-full">
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
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={append}>Append event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
