"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, PencilIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import {
  BDD_AUDIT,
  DP_PCT,
  DP_RECOUP_PCT,
  OFFERS,
  OFFER_STATUS_TONE,
  RETENTION_PCT,
  SO_REMARK_OPTIONS,
  SO_REMARK_TONE,
  SO_STATUS_OPTIONS,
  SO_STATUS_TONE,
  soDerived,
  type SalesOrder,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { FieldComputed } from "@/components/jce/field-computed";
import { EmptyState } from "@/components/jce/empty-state";

// B2 · Sales Order record (bdd-core.jsx:26-50, brief:1028-1034). Edit-with-audit
// (NOT an immutable event stream — OQ#16). Derived progress-billing values are
// read-only (.computed hatch). Editing Contract Amount fires a sensitive-change
// notification into the shared role-context slice (bell + X4 reflect it).

function Row({
  label,
  sensitive,
  action,
  children,
}: {
  label: string;
  sensitive?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-1.5 text-jce-ink-2">
        {label}
        {sensitive ? (
          <span className="rounded bg-(--st-danger-bg) px-1.5 py-0.5 text-[9px] font-bold text-(--st-danger-ink)">
            SENSITIVE
          </span>
        ) : null}
      </dt>
      <dd className="flex items-center gap-2">
        {children}
        {action}
      </dd>
    </div>
  );
}

export function SalesOrderRecord({ order }: { order: SalesOrder }) {
  const { role, addNotification } = useJce();
  const readOnly = !canEdit(role, "bdd");

  const [amount, setAmount] = useState(order.amount);
  const [status, setStatus] = useState(order.status);
  const [remarks, setRemarks] = useState(order.remarks);
  const [editOpen, setEditOpen] = useState(false);
  const [draftAmount, setDraftAmount] = useState(String(order.amount));

  const d = soDerived({ amount, cumBilled: order.cumBilled });
  const relatedOffers = OFFERS.filter((o) => o.client === order.client);
  const history = BDD_AUDIT.filter((a) => a.rec === order.so);

  const saveAmount = () => {
    const next = Number(draftAmount);
    setEditOpen(false);
    if (!Number.isFinite(next) || next === amount) return;
    setAmount(next);
    addNotification({
      mod: "BDD",
      type: "Sensitive",
      tone: "danger",
      unread: true,
      msg: `Contract Amount edited on SO# ${order.so} → ${peso(next)}`,
      time: "just now",
      doc: order.so,
    });
    toast.success(
      "Contract Amount updated — sensitive-change notification sent.",
    );
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <Link
        href="/bdd/sales-orders"
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Sales Orders
      </Link>

      {/* Header card (glass) */}
      <div className="glass rounded-(--r-glass) p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <DocChip code={`SO# ${order.so}`} />
              <Chip tone={SO_STATUS_TONE[status] ?? "neutral"}>{status}</Chip>
              <Chip tone={SO_REMARK_TONE[remarks] ?? "neutral"}>{remarks}</Chip>
            </div>
            <h1 className="mt-2 text-ui-22 font-bold tracking-tight text-jce-ink">
              {order.name}
            </h1>
            <p className="mt-1 text-ui-13 text-jce-ink-2">
              {order.client} · requested by {order.by} · {order.date}
            </p>
          </div>
          {!readOnly ? (
            <div className="flex flex-wrap items-center gap-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-9 w-44">
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
              <Select value={remarks} onValueChange={setRemarks}>
                <SelectTrigger className="h-9 w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SO_REMARK_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>
        <p className="mt-3 text-ui-12 text-jce-ink-2">
          Status transitions are free (any → any) and audited. Sales Orders are
          edit-with-audit — distinct from Offers/Quotations, which are immutable
          event streams (OQ#16).
        </p>
      </div>

      {/* Commercial + derived billing */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="solid rounded-(--r-solid) p-5">
          <h2 className="kicker text-jce-green-600">Commercial</h2>
          <dl className="mt-3 flex flex-col gap-3 text-ui-13">
            <Row
              label="Contract Amount"
              sensitive
              action={
                !readOnly ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDraftAmount(String(amount));
                      setEditOpen(true);
                    }}
                    className="focus-ring-jce inline-flex items-center gap-1 rounded text-ui-12 font-semibold text-jce-green-700 hover:underline"
                  >
                    <PencilIcon className="size-3" aria-hidden /> Edit
                  </button>
                ) : null
              }
            >
              <span className="font-mono font-semibold tabular-nums text-jce-ink">
                {peso(amount)}
              </span>
            </Row>
            <Row label="Down Payment %">{(DP_PCT * 100).toFixed(0)}%</Row>
            <Row label="Retention %">{(RETENTION_PCT * 100).toFixed(0)}%</Row>
            <Row label="DP Recoupment %">
              {(DP_RECOUP_PCT * 100).toFixed(0)}%
            </Row>
          </dl>
        </div>

        <div className="solid rounded-(--r-solid) p-5">
          <h2 className="kicker text-jce-green-600">
            Progress billing · derived (read-only)
          </h2>
          <dl className="mt-3 flex flex-col gap-3 text-ui-13">
            <Row label="Down Payment Amount">
              <FieldComputed>{peso(d.dpAmt)}</FieldComputed>
            </Row>
            <Row label="Cumulative Billed to Date">
              <FieldComputed>{peso(d.cumBilled)}</FieldComputed>
            </Row>
            <Row label="Cumulative Retention Held">
              <FieldComputed>{peso(d.retentionHeld)}</FieldComputed>
            </Row>
            <Row label="Cumulative DP Recouped">
              <FieldComputed>{peso(d.dpRecouped)}</FieldComputed>
            </Row>
            <Row label="Remaining Contract Balance">
              <FieldComputed>{peso(d.remaining)}</FieldComputed>
            </Row>
          </dl>
        </div>
      </div>

      {/* Linked records / History */}
      <Tabs defaultValue="linked" className="gap-3">
        <TabsList>
          <TabsTrigger value="linked">Linked records</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="linked">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="solid rounded-(--r-solid) p-5">
              <h3 className="kicker text-jce-green-600">Offers</h3>
              {relatedOffers.length === 0 ? (
                <p className="mt-3 text-ui-13 text-jce-ink-2">
                  No offers linked.
                </p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2">
                  {relatedOffers.map((o) => (
                    <li
                      key={o.ref}
                      className="flex flex-wrap items-center gap-2 text-ui-13"
                    >
                      <DocChip code={o.ref} />
                      <span className="min-w-0 flex-1 truncate text-jce-ink">
                        {o.subject}
                      </span>
                      <Chip tone={OFFER_STATUS_TONE[o.status] ?? "neutral"}>
                        {o.status}
                      </Chip>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="solid rounded-(--r-solid) p-5">
              <h3 className="kicker text-jce-green-600">
                Billings · POs · Material Requests
              </h3>
              <p className="mt-3 text-ui-13 text-jce-ink-2">
                Linked billings (Accounting · Part 5), purchase orders
                (Purchasing · Part 7) and material requests (Warehouse · Part 8)
                surface here once those modules are built — all keyed on SO#{" "}
                {order.so}.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          {history.length === 0 ? (
            <div className="glass rounded-(--r-glass) p-6">
              <EmptyState
                icon={
                  <PencilIcon
                    className="size-7"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                }
                title="No history yet"
                description="Edits and status changes to this record will appear here."
              />
            </div>
          ) : (
            <div className="solid divide-y divide-jce-line overflow-hidden rounded-(--r-solid)">
              {history.map((h, i) => (
                <div key={i} className="flex flex-wrap items-center gap-3 p-3">
                  <span className="font-mono text-ui-12 whitespace-nowrap text-jce-ink-2">
                    {h.ts}
                  </span>
                  <span className="text-ui-13 font-medium text-jce-ink">
                    {h.field}
                  </span>
                  <span className="text-ui-13 text-jce-ink-2">{h.delta}</span>
                  <span className="ml-auto text-ui-12 text-jce-ink-2">
                    {h.user}
                  </span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Contract-amount edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contract Amount</DialogTitle>
            <DialogDescription>
              Contract Amount is sensitive — saving fires a sensitive-change
              notification (audited, 9.9#2). SO# {order.so}.
            </DialogDescription>
          </DialogHeader>
          <label className="text-ui-12 font-semibold text-jce-ink-2">
            Contract Amount (₱)
            <input
              type="number"
              value={draftAmount}
              onChange={(e) => setDraftAmount(e.target.value)}
              className="field mt-1.5 font-mono tabular-nums"
              autoFocus
            />
          </label>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveAmount}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
