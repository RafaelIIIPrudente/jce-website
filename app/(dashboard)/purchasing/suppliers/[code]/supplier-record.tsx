"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { ccyAmt } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import {
  PO_STATUS_TONE,
  posForSupplier,
  type Supplier,
} from "@/lib/mock/purchasing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { LockGateBanner } from "@/components/jce/lock-gate-banner";

const TABS = ["Details", "Bank accounts", "Performance", "POs"] as const;
type Tab = (typeof TABS)[number];

// U10 · Supplier record (pur-core.jsx:968). Bank-account fraud-control: a
// pending account is not payable-from until Supervisor approval + a logged
// confirmation. Soft-delete (Deactivate) only — never hard-delete a
// PO-referenced supplier. Approve-verification + Deactivate verbs are canVerb-only.
export function SupplierRecord({ supplier }: { supplier: Supplier }) {
  const { role } = useJce();
  const mayVerb = canVerb(role, "pur");
  const [tab, setTab] = useState<Tab>("Details");
  const [verified, setVerified] = useState(!supplier.bankPending);
  const [active, setActive] = useState(supplier.active);

  const pos = posForSupplier(supplier.name);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <Link
        href="/purchasing/suppliers"
        className="focus-ring-jce inline-flex w-fit items-center gap-1.5 rounded-(--r-chip) text-ui-12 font-semibold text-jce-ink-2 hover:text-jce-green-900"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden /> Suppliers
      </Link>

      <PageHeader
        kicker="Purchasing · U10"
        title={
          <span className="flex items-center gap-2">
            {supplier.name}
            <Chip tone={active ? "success" : "neutral"}>
              {active ? "Active" : "Deactivated"}
            </Chip>
          </span>
        }
        description={`${supplier.code} · ${supplier.cat}`}
        actions={
          mayVerb && active ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActive(false);
                toast.success(
                  "Supplier deactivated (soft-delete — PO history retained).",
                );
              }}
            >
              Deactivate
            </Button>
          ) : null
        }
      />

      <nav className="glass-nav inline-flex w-fit flex-wrap gap-0.5 rounded-[10px] p-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "focus-ring-jce rounded-[7px] px-3.5 py-1.5 text-ui-12 font-semibold transition-colors",
              tab === t
                ? "bg-jce-green-700 text-primary-foreground"
                : "text-jce-ink-2 hover:text-jce-green-900",
            )}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="solid rounded-(--r-solid) p-5">
        {tab === "Details" ? (
          <dl className="grid grid-cols-2 gap-4 text-ui-13 sm:grid-cols-4">
            <Pair k="TIN" v={supplier.tin} />
            <Pair k="Terms of Payment" v={supplier.top} />
            <Pair k="City / Country" v={supplier.city} />
            <Pair k="Items / Services" v={supplier.offers.join(", ")} />
          </dl>
        ) : null}

        {tab === "Bank accounts" ? (
          <div className="flex flex-col gap-3">
            {!verified ? (
              <LockGateBanner
                state="locked"
                title="Bank account pending verification (fraud-control)"
                detail="Not payable-from until Supervisor approval + a logged supplier email / phone confirmation."
              />
            ) : null}
            <div className="overflow-auto rounded-(--r-solid) border border-jce-line">
              <table className="jtable">
                <thead>
                  <tr>
                    <th>Bank</th>
                    <th>Account No.</th>
                    <th>Currency</th>
                    <th>SWIFT</th>
                    <th>Primary</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Bank of China</td>
                    <td className="mono">···· 8821</td>
                    <td>USD</td>
                    <td className="mono">BKCHCNBJ</td>
                    <td>Yes</td>
                    <td>
                      <Chip tone={verified ? "success" : "pending"}>
                        {verified ? "Verified" : "Pending verification"}
                      </Chip>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {mayVerb && !verified ? (
              <Button
                variant="approve"
                size="sm"
                className="w-fit"
                onClick={() => {
                  setVerified(true);
                  toast.success(
                    "Bank account verified — confirmation logged (supplier email + phone).",
                  );
                }}
              >
                Approve verification
              </Button>
            ) : null}
            <p className="text-ui-12 text-jce-ink-2">
              Duplicate guard runs on add (Name / TIN match → warning).
              Suppliers are deactivated, never hard-deleted, when PO-referenced.
            </p>
          </div>
        ) : null}

        {tab === "Performance" ? (
          <dl className="grid grid-cols-2 gap-4 text-ui-13 sm:grid-cols-4">
            <Pair k="Total spend" v="$1.2M" />
            <Pair k="PO count" v={String(pos.length)} />
            <Pair k="On-time delivery" v="86%" />
            <Pair k="Last order" v="2026-05-22" />
          </dl>
        ) : null}

        {tab === "POs" ? (
          <div className="overflow-auto rounded-(--r-solid) border border-jce-line">
            <table className="jtable">
              <thead>
                <tr>
                  <th>PO No.</th>
                  <th className="num">Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pos.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-jce-ink-2">
                      No purchase orders on file.
                    </td>
                  </tr>
                ) : (
                  pos.map((p) => (
                    <tr key={p.no}>
                      <td>
                        <DocChip code={p.no} />
                      </td>
                      <td className="num">{ccyAmt(p.amount, p.ccy)}</td>
                      <td>
                        <Chip tone={PO_STATUS_TONE[p.status] ?? "neutral"}>
                          {p.status}
                        </Chip>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Pair({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-ui-12 text-jce-ink-2">{k}</dt>
      <dd className="mt-1 font-semibold text-jce-ink">{v}</dd>
    </div>
  );
}
