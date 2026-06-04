"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";

import { pmoneyU } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canEdit, canVerb } from "@/lib/rbac";
import {
  RFP_TONE,
  ewt,
  threeWayMatch,
  type Rfp,
  type EwtClass,
} from "@/lib/mock/purchasing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { FieldComputed } from "@/components/jce/field-computed";
import { Picker, type PickerOption } from "@/components/jce/picker";
import { LockGateBanner } from "@/components/jce/lock-gate-banner";
import { PrintPreview } from "@/components/jce/print-preview";
import {
  PrintSignatureBlock,
  type Signatory,
} from "@/components/jce/print-signature-block";

const EWT_OPTIONS: readonly PickerOption[] = [
  { code: "Goods", label: "Goods · 1% (WI010)" },
  { code: "Services", label: "Services · 2% (WI020)" },
  { code: "Rentals", label: "Rentals · 5% (WI100)" },
  { code: "Professional", label: "Professional · 10% (WI011)" },
];

const RFP_SIGS: readonly Signatory[] = [
  { role: "Prepared by" },
  { role: "Verified & Authorized by" },
  { role: "Received by (Accounting)" },
  { role: "Checked by" },
];

const ONES = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const TENS = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];
function words3(n: number): string {
  let s = "";
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (h) s += `${ONES[h]} hundred `;
  if (r < 20) s += ONES[r] ?? "";
  else s += `${TENS[Math.floor(r / 10)]}${r % 10 ? "-" + ONES[r % 10] : ""}`;
  return s.trim();
}
function amountInWords(n: number): string {
  const whole = Math.floor(Math.abs(n));
  if (whole === 0) return "ZERO PESOS ONLY";
  const groups = ["", " thousand", " million", " billion"];
  let g = 0;
  let rest = whole;
  let out = "";
  while (rest > 0 && g < groups.length) {
    const chunk = rest % 1000;
    if (chunk) out = `${words3(chunk)}${groups[g]} ${out}`;
    rest = Math.floor(rest / 1000);
    g++;
  }
  return `${out.trim().toUpperCase()} PESOS ONLY`;
}

// U6 · RFP form (pur-core.jsx:749). Originator zone (editable for Purchasing) +
// Accounting-received zone (static for Purchasing). EWT classification drives
// ewt(); three-way match gate blocks Draft → Submitted; over-tolerance opens a
// Supervisor-only override. Byte-faithful print with render-only signatories.
export function RfpForm({ rfp }: { rfp: Rfp }) {
  const { role } = useJce();
  const mayEdit = canEdit(role, "pur");
  const mayVerb = canVerb(role, "pur");

  const [klass, setKlass] = useState<EwtClass>("Goods");
  const [variance, setVariance] = useState(false);
  const [overridden, setOverridden] = useState(false);

  const base = rfp.net;
  const e = ewt(base, klass);

  // Three-way match — passing by default; "simulate variance" pushes the invoice
  // beyond tolerance (1% qty / ₱100) to exercise the blocked + override path.
  const match = threeWayMatch({
    poQty: 2,
    invoiceQty: variance ? 3 : 2,
    mrrQty: 2,
    poAmt: base,
    invoiceAmt: variance ? base + 5000 : base,
  });
  const gatePassed = match.ok || overridden;
  const isDraftLike = rfp.status === "Draft";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <Link
        href="/purchasing/rfp"
        className="focus-ring-jce inline-flex w-fit items-center gap-1.5 rounded-(--r-chip) text-ui-12 font-semibold text-jce-ink-2 hover:text-jce-green-900"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden /> RFP register
      </Link>

      <PageHeader
        kicker="Purchasing · U6"
        title={
          <span className="flex items-center gap-2">
            Request for Payment <DocChip code={rfp.no} />
          </span>
        }
        actions={
          <Chip tone={RFP_TONE[rfp.status] ?? "neutral"}>{rfp.status}</Chip>
        }
      />

      {/* Three-way match gate */}
      {match.ok ? (
        <div className="solid flex items-center gap-3 rounded-(--r-solid) border-l-4 border-l-(--st-success) px-3 py-2.5">
          <span className="text-ui-13 font-semibold text-(--st-success-ink)">
            Three-way match ✓
          </span>
          <span className="text-ui-12 text-jce-ink-2">
            PO qty + supplier invoice + MRR received reconcile within tolerance
            (1% qty / ₱100). RFP may leave Draft.
          </span>
        </div>
      ) : (
        <LockGateBanner
          state="locked"
          title="Three-way match over tolerance"
          detail={`Invoice vs PO/MRR variance exceeds tolerance (qty Δ ${match.qtyDelta}, amount Δ ₱${pmoneyU(match.amtDelta)}). The RFP cannot leave Draft until reconciled${overridden ? " — Supervisor override applied." : "."}`}
        />
      )}
      {mayEdit ? (
        <label className="flex w-fit items-center gap-2 text-ui-12 text-jce-ink-2">
          <input
            type="checkbox"
            checked={variance}
            onChange={(ev) => {
              setVariance(ev.target.checked);
              setOverridden(false);
            }}
            className="accent-jce-green-700"
          />
          Simulate invoice variance (over tolerance)
        </label>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="solid flex flex-col gap-4 rounded-(--r-solid) p-5">
          <div className="text-ui-13 font-semibold text-jce-ink">
            Originator zone
          </div>
          <dl className="grid grid-cols-2 gap-3 text-ui-12">
            <Pair k="RFP No." v={<FieldComputed>{rfp.no}</FieldComputed>} />
            <Pair k="Date" v={<span className="mono">{rfp.date}</span>} />
            <Pair
              k="Purchase Order"
              v={
                <span className="flex items-center gap-1.5">
                  <DocChip code={rfp.po} />
                  <span className="text-jce-ink-2">
                    inherits supplier · terms
                  </span>
                </span>
              }
            />
            <Pair k="Due Date" v={<span className="mono">{rfp.due}</span>} />
          </dl>

          <div>
            <div className="mb-1.5 text-ui-12 font-semibold text-jce-ink-2">
              EWT classification (RFP is canonical for ATC)
            </div>
            <Picker
              options={EWT_OPTIONS}
              value={klass}
              onChange={(c) => setKlass(c as EwtClass)}
            />
          </div>

          <div className="overflow-auto rounded-(--r-solid) border border-jce-line">
            <table className="jtable">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Particulars</th>
                  <th className="num">VAT Payment</th>
                  <th className="num">Non-VAT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono">1</td>
                  <td>Per PO {rfp.po}</td>
                  <td className="num">{pmoneyU(base * 1.02)}</td>
                  <td className="num">—</td>
                </tr>
                <tr>
                  <td colSpan={4} className="text-ui-12 italic text-jce-ink-2">
                    “NOTHING FOLLOWS”
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <dl className="ml-auto w-full max-w-xs flex-col gap-1.5 text-ui-13">
            <Money
              k={`EWT · ${klass} ${e.rate}% (${e.atc})`}
              v={`(₱${pmoneyU(e.withholding)})`}
            />
            <Money k="Net Payment" v={`₱${pmoneyU(e.netPayment)}`} strong />
          </dl>
          <p className="text-ui-12 text-jce-ink-2">
            Amount in words:{" "}
            <span className="font-semibold text-jce-ink">
              {amountInWords(e.netPayment)}
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {mayEdit && isDraftLike && gatePassed ? (
              <Button
                size="sm"
                onClick={() =>
                  toast.success("RFP submitted (Draft → Submitted).")
                }
              >
                Submit RFP
              </Button>
            ) : null}
            {mayVerb && !match.ok && !overridden ? (
              <Button
                variant="lock"
                size="sm"
                onClick={() => {
                  setOverridden(true);
                  toast.success(
                    "Supervisor override logged — over-tolerance accepted.",
                  );
                }}
              >
                Supervisor override
              </Button>
            ) : null}
            {mayVerb ? (
              <Button
                variant="post"
                size="sm"
                onClick={() =>
                  toast.success(
                    "Marked Paid (mock) — PO payment status flips; import stage 7/10 stamped.",
                  )
                }
              >
                Mark Paid
              </Button>
            ) : null}
          </div>

          <div className="rounded-(--r-solid) border border-jce-line bg-(--table-zebra) p-3">
            <div className="mb-1.5 text-ui-12 font-semibold text-jce-ink-2">
              Accounting-received zone{" "}
              <span className="font-normal">(read-only for Purchasing)</span>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-ui-12">
              <Pair
                k="Received by Accounting"
                v={<FieldComputed>—</FieldComputed>}
              />
              <Pair
                k="Voucher / Disbursement"
                v={
                  rfp.status === "Paid" ? (
                    <Link
                      href="/accounting"
                      className="focus-ring-jce rounded-(--r-chip) text-ui-12 font-semibold text-jce-green-700 hover:text-jce-green-900"
                    >
                      → Accounting
                    </Link>
                  ) : (
                    <FieldComputed>—</FieldComputed>
                  )
                }
              />
            </dl>
          </div>
        </div>

        <PrintPreview
          title="JCE RFP form"
          paperSize="A4"
          note="Signatory names render-only — paper is wet-signed offline."
        >
          <div className="flex items-start justify-between gap-3 border-b border-jce-ink/30 pb-2">
            <div className="text-[11px] font-extrabold tracking-tight text-jce-ink">
              JC ELECTROFIELDS POWER SYSTEM, INC.
            </div>
            <div className="text-right">
              <div className="text-[11px] font-extrabold">
                REQUEST FOR PAYMENT
              </div>
              <div className="font-mono text-[10px] text-jce-ink-2">
                {rfp.no}
              </div>
            </div>
          </div>
          <div className="my-2 text-[10px]">
            {rfp.supplier} · PO {rfp.po} · Net ₱{pmoneyU(e.netPayment)}
          </div>
          <div className="text-[10px]">{amountInWords(e.netPayment)}</div>
          <PrintSignatureBlock signatories={RFP_SIGS} />
        </PrintPreview>
      </div>
    </div>
  );
}

function Pair({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <dt className="text-jce-ink-2">{k}</dt>
      <dd className="mt-1 text-jce-ink">{v}</dd>
    </div>
  );
}
function Money({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div
      className={
        strong
          ? "flex items-center justify-between gap-4 border-t border-jce-line pt-1.5 font-semibold text-jce-ink"
          : "flex items-center justify-between gap-4"
      }
    >
      <dt className="text-jce-ink-2">{k}</dt>
      <dd className="money text-jce-ink">{v}</dd>
    </div>
  );
}
