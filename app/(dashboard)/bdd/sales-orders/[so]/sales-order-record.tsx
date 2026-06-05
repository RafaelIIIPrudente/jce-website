"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { ROLES, canEdit } from "@/lib/rbac";
import {
  DP_PCT,
  DP_RECOUP_PCT,
  OFFERS,
  OFFER_STATUS_TONE,
  RETENTION_PCT,
  SO_REMARK_OPTIONS,
  SO_REMARK_TONE,
  SO_STATUS_OPTIONS,
  SO_STATUS_TONE,
  appendBddAudit,
  bddNow,
  getBddHistory,
  getSalesOrders,
  getSoLinked,
  soDerived,
  updateSalesOrder,
  type SalesOrder,
  type SoLinkedRow,
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
// read-only (.computed hatch). Status/Remarks/Contract-Amount edits persist to
// the shared in-session store AND append a live BDD audit entry; editing Contract
// Amount additionally fires a sensitive-change notification (bell + X4 reflect it).

const HISTORY_PAGE_SIZE = 5;

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

function LinkedGroup({
  title,
  rows,
}: {
  title: string;
  rows: readonly SoLinkedRow[];
}) {
  return (
    <div>
      <h4 className="text-ui-12 font-semibold text-jce-ink-2">{title}</h4>
      {rows.length === 0 ? (
        <p className="mt-1 text-ui-12 text-jce-ink-2">None linked yet.</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-2">
          {rows.map((r) => (
            <li
              key={r.doc}
              className="flex flex-wrap items-center gap-2 text-ui-13"
            >
              <DocChip code={r.doc} />
              <span className="min-w-0 flex-1 truncate text-jce-ink">
                {r.label}
              </span>
              <span className="font-mono tabular-nums text-jce-ink-2">
                {r.amount != null ? peso(r.amount) : r.date}
              </span>
              <Chip tone={r.tone}>{r.status}</Chip>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Resolve the order from the shared in-session store (client-side) so SOs created
// this session open without a 404. A genuinely-absent SO# renders an empty state.
export function SalesOrderRecord({ so }: { so: string }) {
  const order = getSalesOrders().find((o) => o.so === so);

  if (!order) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <Link
          href="/bdd/sales-orders"
          className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
        >
          <ChevronLeftIcon className="size-4" aria-hidden /> Sales Orders
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
            title="Sales order not found"
            description={`No SO# “${so}” exists in this session. The mock registry resets on reload — a record created earlier may no longer be here.`}
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/bdd/sales-orders">Back to Sales Orders</Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return <SalesOrderDetail order={order} />;
}

function SalesOrderDetail({ order }: { order: SalesOrder }) {
  const { role, addNotification } = useJce();
  const readOnly = !canEdit(role, "bdd");

  const [amount, setAmount] = useState(order.amount);
  const [status, setStatus] = useState(order.status);
  const [remarks, setRemarks] = useState(order.remarks);
  const [editOpen, setEditOpen] = useState(false);
  const [draftAmount, setDraftAmount] = useState(String(order.amount));
  const [histPage, setHistPage] = useState(1);

  const d = soDerived({ amount, cumBilled: order.cumBilled });
  const relatedOffers = OFFERS.filter((o) => o.client === order.client);
  const linked = getSoLinked(order.so);

  const history = getBddHistory(order.so); // seed + live edits, newest-first
  const histTotalPages = Math.max(
    1,
    Math.ceil(history.length / HISTORY_PAGE_SIZE),
  );
  const histSafePage = Math.min(histPage, histTotalPages);
  const histStart = (histSafePage - 1) * HISTORY_PAGE_SIZE;
  const histRows = history.slice(histStart, histStart + HISTORY_PAGE_SIZE);

  const audit = (field: string, action: string, delta: string) => {
    appendBddAudit({
      ts: bddNow(),
      user: ROLES[role].name,
      area: "Sales Order",
      action,
      rec: order.so,
      field,
      delta,
    });
    setHistPage(1); // surface the new entry (page 1, newest-first)
  };

  const onStatusChange = (next: string) => {
    if (next === status) return;
    audit("Status", "Status Change", `${status} → ${next}`);
    setStatus(next);
    updateSalesOrder(order.so, { status: next });
  };

  const onRemarksChange = (next: string) => {
    if (next === remarks) return;
    audit("Remarks", "Edited", `${remarks} → ${next}`);
    setRemarks(next);
    updateSalesOrder(order.so, { remarks: next });
  };

  const saveAmount = () => {
    const next = Number(draftAmount);
    setEditOpen(false);
    if (!Number.isFinite(next) || next === amount) return;
    audit(
      "Contract Amount",
      "Edited",
      `${peso(amount)} → ${peso(next)} (sensitive)`,
    );
    setAmount(next);
    updateSalesOrder(order.so, { amount: next });
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
            <p className="mt-1 text-ui-13 text-jce-ink">
              Scope of Work · {order.scope}
            </p>
            <p className="mt-0.5 text-ui-13 text-jce-ink-2">
              {order.client} · requested by {order.by} · {order.date}
            </p>
          </div>
          {!readOnly ? (
            <div className="flex flex-wrap items-center gap-2">
              <Select value={status} onValueChange={onStatusChange}>
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
              <Select value={remarks} onValueChange={onRemarksChange}>
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
              <div className="mt-3 flex flex-col gap-4">
                <LinkedGroup
                  title="Billings · Accounting (Part 5)"
                  rows={linked.billings}
                />
                <LinkedGroup
                  title="Purchase Orders · Purchasing (Part 7)"
                  rows={linked.pos}
                />
                <LinkedGroup
                  title="Material Requests · Warehouse (Part 8)"
                  rows={linked.mrs}
                />
              </div>
              <p className="mt-4 text-ui-12 text-jce-ink-2">
                Mock data — these surface live once Accounting, Purchasing and
                Warehouse are wired, all keyed on SO# {order.so}.
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
            <div className="flex flex-col gap-3">
              <div className="solid divide-y divide-jce-line overflow-hidden rounded-(--r-solid)">
                {histRows.map((h, i) => (
                  <div
                    key={histStart + i}
                    className="flex flex-wrap items-center gap-3 p-3"
                  >
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
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-ui-12 text-jce-ink-2">
                  Page {histSafePage} of {histTotalPages} · {history.length}{" "}
                  entries
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="focus-ring-jce min-h-11"
                    disabled={histSafePage <= 1}
                    onClick={() => setHistPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeftIcon aria-hidden /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="focus-ring-jce min-h-11"
                    disabled={histSafePage >= histTotalPages}
                    onClick={() =>
                      setHistPage((p) => Math.min(histTotalPages, p + 1))
                    }
                  >
                    Next <ChevronRightIcon aria-hidden />
                  </Button>
                </div>
              </div>
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
