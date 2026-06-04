"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { pmoneyU } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { SALES_ORDERS } from "@/lib/mock/bdd";
import {
  SUPPLIERS,
  findSupplier,
  localTotals,
  importTotals,
  poNumberPlaceholder,
  nextPoNumber,
  mrHeader,
  forPurchaseFromMr,
  type PoLine,
  type PoType,
  type PurchaseOrder,
} from "@/lib/mock/purchasing";
import { forPurchaseQty } from "@/lib/mock/pmg";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { FieldComputed } from "@/components/jce/field-computed";
import { DocChip } from "@/components/jce/doc-chip";
import { Chip } from "@/components/jce/chip";
import { EmptyState } from "@/components/jce/empty-state";

const DEFAULT_LINE: PoLine = {
  qty: 1,
  unit: "set",
  desc: "Power transformer 10MVA 69/13.8KV",
  price: 30440,
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-ui-12 font-semibold text-jce-ink-2">
        {label}
        {required ? <span className="text-(--st-danger)"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

// U3 · Create / edit Purchase Order (pur-core.jsx:276). One form branching on
// Local|Import. PO Number is a computed placeholder while Draft (assigned on
// leaving Draft, §7.4). Live totals: Local VAT-inclusive, Import sub−discount.
export function NewOrder({
  po,
  editing = false,
}: {
  po?: PurchaseOrder;
  editing?: boolean;
}) {
  const { role } = useJce();
  const ro = !canEdit(role, "pur");

  const [type, setType] = useState<PoType>(po?.type ?? "Local");
  const [date, setDate] = useState(po?.date ?? "2026-06-03");
  const [supplierCode, setSupplierCode] = useState(
    SUPPLIERS.find((s) => s.name === po?.supplier)?.code ??
      SUPPLIERS[0]?.code ??
      "",
  );
  const [soNo, setSoNo] = useState(po?.so ?? "26-05-378");
  const [mrNo, setMrNo] = useState(
    po?.mr && po.mr !== "—" ? po.mr : "JCE-MR-2026-0142",
  );
  const [vatable, setVatable] = useState(true);
  const [incoterm, setIncoterm] = useState("DDP JCE");
  const [discount, setDiscount] = useState(0);
  const [lines, setLines] = useState<PoLine[]>([{ ...DEFAULT_LINE }]);

  const supplier = findSupplier(supplierCode);
  const terms = supplier?.top ?? "NET30";

  const local = localTotals(lines, vatable);
  const imp = importTotals(lines, discount);

  // Cross-module: the For-Purchase remainder of the linked MR (read-only embed).
  const mr = mrHeader(mrNo);
  const fp = useMemo(() => forPurchaseFromMr(mrNo), [mrNo]);

  const lineValid =
    lines.length > 0 &&
    lines.some((l) => l.desc.trim() !== "" && l.qty > 0 && l.price >= 0);
  const valid = lineValid && supplierCode !== "" && date !== "";

  const upd = (i: number, patch: Partial<PoLine>) =>
    setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const addLine = () =>
    setLines((ls) => [...ls, { qty: 1, unit: "pcs", desc: "", price: 0 }]);
  const removeLine = (i: number) =>
    setLines((ls) => (ls.length > 1 ? ls.filter((_, j) => j !== i) : ls));

  const submit = () => {
    if (!valid) return;
    toast.success(
      `Submitted for approval — PO ${nextPoNumber(date, type)} assigned (was Draft, no number).`,
    );
  };

  if (ro) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <PageHeader kicker="Purchasing · U3" title="Create Purchase Order" />
        <EmptyState
          title="Read-only access"
          description="Creating a Purchase Order requires edit rights (Purchasing Supervisor / Owner). Your role can view the ledger and export, but not raise POs."
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/purchasing/orders">← Back to ledger</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <Link
        href="/purchasing/orders"
        className="focus-ring-jce inline-flex w-fit items-center gap-1.5 rounded-(--r-chip) text-ui-12 font-semibold text-jce-ink-2 hover:text-jce-green-900"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden /> PO ledger
      </Link>
      <PageHeader
        kicker="Purchasing · U3"
        title={editing ? "Edit Purchase Order" : "Create Purchase Order"}
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                toast.success("Draft saved (no PO number consumed).")
              }
            >
              Save Draft
            </Button>
            <Button size="sm" disabled={!valid} onClick={submit}>
              Submit for approval
            </Button>
          </>
        }
      />

      <div className="solid flex flex-col gap-5 rounded-(--r-solid) p-5">
        <Segmentish value={type} onChange={setType} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="PO Number">
            <FieldComputed>{poNumberPlaceholder(date, type)}</FieldComputed>
          </Field>
          <Field label="PO Date" required>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="field h-9"
            />
          </Field>
          <Field label="Supplier" required>
            <select
              value={supplierCode}
              onChange={(e) => setSupplierCode(e.target.value)}
              className="field h-9"
            >
              {SUPPLIERS.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Project / SO">
            <select
              value={soNo}
              onChange={(e) => setSoNo(e.target.value)}
              className="field h-9"
            >
              {SALES_ORDERS.map((s) => (
                <option key={s.so} value={s.so}>
                  {s.so} · {s.client}
                </option>
              ))}
              <option value="WORKSHOP">WORKSHOP · Internal</option>
            </select>
          </Field>
          <Field label="MR No.">
            <input
              value={mrNo}
              onChange={(e) => setMrNo(e.target.value)}
              className="field h-9"
              placeholder="N/A allowed"
            />
          </Field>
          <Field label="Payment Terms (from supplier)">
            <FieldComputed>{terms}</FieldComputed>
          </Field>
          {type === "Local" ? (
            <>
              <Field label="Delivery Address">
                <input
                  defaultValue="2129 La Mesa Street, Ugong, Valenzuela"
                  className="field h-9"
                />
              </Field>
              <label className="flex items-center gap-2 self-end pb-2 text-ui-13 text-jce-ink">
                <input
                  type="checkbox"
                  checked={vatable}
                  onChange={(e) => setVatable(e.target.checked)}
                  className="accent-jce-green-700"
                />
                VAT-able (12% inclusive)
              </label>
            </>
          ) : (
            <>
              <Field label="Incoterm">
                <select
                  value={incoterm}
                  onChange={(e) => setIncoterm(e.target.value)}
                  className="field h-9"
                >
                  <option>DDP JCE</option>
                  <option>CIF CEBU</option>
                </select>
              </Field>
              <Field label="Discount (USD)">
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  className="field h-9"
                />
              </Field>
            </>
          )}
        </div>

        {/* Cross-module: For-Purchase remainder from the linked MR (read-only). */}
        {mr && fp.length > 0 ? (
          <div className="rounded-(--r-solid) border border-jce-line bg-(--table-zebra) p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="kicker">From MR</span>
              <DocChip code={mr.no} />
              <Chip tone="info">{fp.length} line(s) For Purchase</Chip>
              <span className="text-ui-12 text-jce-ink-2">
                inventory-first remainder handed from PMG (read-only)
              </span>
            </div>
            <table className="jtable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th className="num">Required</th>
                  <th className="num">For Purchase</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {fp.map((l) => (
                  <tr key={l.no}>
                    <td className="mono text-ui-12">{l.no}</td>
                    <td>{l.desc}</td>
                    <td className="num">{l.reqQty}</td>
                    <td className="num font-semibold">{forPurchaseQty(l)}</td>
                    <td>{l.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <div>
          <div className="mb-2 text-ui-13 font-semibold text-jce-ink">
            Line items{" "}
            <span className="text-ui-12 font-normal text-jce-ink-2">
              {type === "Local" ? "PHP · VAT-inclusive" : "USD"}
            </span>
          </div>
          <div className="solid overflow-auto rounded-(--r-solid) p-0">
            <table className="jtable">
              <thead>
                <tr>
                  <th className="num">Qty</th>
                  <th>Unit</th>
                  <th>Description</th>
                  <th className="num">Unit Price</th>
                  <th className="num">Total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={i}>
                    <td className="num">
                      <input
                        type="number"
                        value={l.qty}
                        onChange={(e) =>
                          upd(i, { qty: Number(e.target.value) || 0 })
                        }
                        className="field h-8 w-16 text-right"
                        aria-label={`Quantity line ${i + 1}`}
                      />
                    </td>
                    <td>
                      <input
                        value={l.unit}
                        onChange={(e) => upd(i, { unit: e.target.value })}
                        className="field h-8 w-16"
                        aria-label={`Unit line ${i + 1}`}
                      />
                    </td>
                    <td>
                      <input
                        value={l.desc}
                        onChange={(e) => upd(i, { desc: e.target.value })}
                        className="field h-8 min-w-48"
                        aria-label={`Description line ${i + 1}`}
                      />
                    </td>
                    <td className="num">
                      <input
                        type="number"
                        value={l.price}
                        onChange={(e) =>
                          upd(i, { price: Number(e.target.value) || 0 })
                        }
                        className="field h-8 w-28 text-right"
                        aria-label={`Unit price line ${i + 1}`}
                      />
                    </td>
                    <td className="num">
                      <span className="computed">
                        {pmoneyU(l.qty * l.price)}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeLine(i)}
                        className="focus-ring-jce rounded-(--r-chip) p-1 text-jce-ink-2 hover:text-(--st-danger)"
                        aria-label={`Remove line ${i + 1}`}
                      >
                        <Trash2Icon className="size-3.5" aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={6} className="text-ui-12 italic text-jce-ink-2">
                    “Nothing Follows”
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Button variant="ghost" size="sm" className="mt-2" onClick={addLine}>
            <PlusIcon data-icon="inline-start" /> Add line
          </Button>
        </div>

        {!lineValid ? (
          <p className="rounded-(--r-solid) border border-(--st-pending) bg-(--st-pending-bg) px-3 py-2 text-ui-12 text-(--st-pending-ink)">
            At least one line item (with a description, quantity &gt; 0) is
            required before a PO can leave Draft.
          </p>
        ) : null}

        <div className="ml-auto w-full max-w-xs rounded-(--r-solid) border border-jce-line bg-(--table-zebra) p-3 text-ui-13">
          {type === "Local" ? (
            <dl className="flex flex-col gap-1.5">
              <Row k="TOTAL (VAT-incl)" v={`₱${pmoneyU(local.total)}`} strong />
              <Row k="Net of VAT" v={`₱${pmoneyU(local.net)}`} />
              <Row
                k={`VAT (${vatable ? "12" : "0"}%)`}
                v={`₱${pmoneyU(local.vat)}`}
              />
            </dl>
          ) : (
            <dl className="flex flex-col gap-1.5">
              <Row k="Sub-Total" v={`$${pmoneyU(imp.sub)}`} />
              <Row k="Discount" v={`$${pmoneyU(imp.discount)}`} />
              <Row k="Grand Total" v={`USD ${pmoneyU(imp.grand)}`} strong />
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        strong && "border-t border-jce-line pt-1.5 font-semibold text-jce-ink",
      )}
    >
      <dt className="text-jce-ink-2">{k}</dt>
      <dd className="money text-jce-ink">{v}</dd>
    </div>
  );
}

function Segmentish({
  value,
  onChange,
}: {
  value: PoType;
  onChange: (v: PoType) => void;
}) {
  return (
    <div className="glass-nav inline-flex w-fit gap-0.5 rounded-[10px] p-1">
      {(["Local", "Import"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={cn(
            "focus-ring-jce rounded-[7px] px-3.5 py-1.5 text-ui-12 font-semibold transition-colors",
            value === t
              ? "bg-jce-green-700 text-primary-foreground"
              : "text-jce-ink-2 hover:text-jce-green-900",
          )}
        >
          {t} PO
        </button>
      ))}
    </div>
  );
}
