"use client";

import { LockIcon } from "lucide-react";

import { useJce } from "@/lib/mock/role-context";
import { CAN_SEE_COMP, ROLES } from "@/lib/rbac";
import { PAY_LINES, getBatches } from "@/lib/mock/accounting";
import { peso, pmoney } from "@/lib/mock/format";
import { PageHeader } from "@/components/jce/page-header";
import { PrintPreview } from "@/components/jce/print-preview";

// A6 · Payslip (acc-payroll.jsx:440). Legacy paper layout (byte-faithful). Carries
// compensation → fully RESTRICTED for non-Payroll/Owner (banner). Employees see
// their own via My HR (H12); PAY_LINES is the source that feed reads.

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="border-b border-jce-ink/40 pb-0.5 text-[10px] font-bold tracking-wide text-jce-ink uppercase">
        {title}
      </div>
      <div className="mt-1 flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function Row({ k, v, bold }: { k: string; v: number; bold?: boolean }) {
  return (
    <div
      className={`flex justify-between gap-4 ${bold ? "border-t border-jce-line pt-0.5 font-bold text-jce-ink" : "text-jce-ink-2"}`}
    >
      <span>{k}</span>
      <span className="font-mono tabular-nums">{pmoney(v)}</span>
    </div>
  );
}

export function Payslips() {
  const { role } = useJce();
  const seeComp = CAN_SEE_COMP(role);

  if (!seeComp) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        <PageHeader kicker="Accounting · A6" title="Payslips" />
        <div className="flex flex-wrap items-center gap-2 rounded-(--r-solid) border border-(--masked-border) bg-(--table-zebra) px-4 py-3 text-ui-13 text-jce-ink-2">
          <LockIcon className="size-4 shrink-0" aria-hidden />
          Payslips carry compensation — restricted to{" "}
          <strong className="text-jce-ink">Payroll Officer &amp; Owner</strong>.
          Employees see their own via <strong>My HR (H12)</strong>. (Viewing as{" "}
          {ROLES[role].short}.)
        </div>
      </div>
    );
  }

  const l = PAY_LINES[0];
  const batch = getBatches()[0];
  if (!l || !batch) return null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <PageHeader
        kicker="Accounting · A6"
        title={`Payslips · ${batch.id}`}
        description="Legacy paper layout — one payslip per page on print."
      />
      <PrintPreview title="Payslip preview" paperSize="Half-letter">
        <div className="flex flex-col gap-3 font-mono text-[11px]">
          <div className="text-center">
            <div className="text-[12px] font-bold tracking-wide">
              JC ELECTROFIELDS POWER SYSTEMS INC.
            </div>
            <div className="text-jce-ink-2">Payroll Period: {batch.period}</div>
          </div>
          <div className="flex flex-wrap justify-between gap-2 border-y border-jce-line py-1.5">
            <span className="font-bold text-jce-ink">{l.name}</span>
            <span>Office/Dept: Project Site</span>
            <span>Daily Rate: {peso(l.rate)}</span>
            <span>Rate/Hour: {peso(l.rate / 8)}</span>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <Block title="Basic Pay">
                <Row k="Total Work Hours ×1.00" v={l.basic} />
                <Row k="Sunday ×1.30" v={0} />
                <Row k="Special Holiday ×1.30" v={0} />
                <Row k="Regular Holiday ×2.00" v={l.hol} />
                <Row k="Night Diff'l ×1.10" v={l.nd} />
                <Row k="TOTAL BASIC" v={l.basic + l.nd} bold />
              </Block>
              <Block title="Overtime">
                <Row k="Regular OT ×1.25" v={l.ot} />
                <Row k="Sunday OT ×1.69" v={0} />
                <Row k="TOTAL OVERTIME" v={l.ot} bold />
              </Block>
              <Block title="Allowances">
                <Row k="Allowance" v={l.allow} />
                <Row k="Project / Meal / Others" v={0} />
                <Row k="TOTAL EARNINGS" v={l.gross} bold />
              </Block>
            </div>
            <div className="flex flex-col gap-2">
              <Block title="Mandatory Contribution">
                <Row k="SSS" v={l.sss} />
                <Row k="PhilHealth" v={l.ph} />
                <Row k="Pag-IBIG" v={l.pi} />
                <Row k="TOTAL CONTRIBUTION" v={l.sss + l.ph + l.pi} bold />
              </Block>
              <Block title="Loan Payment">
                <Row k="SSS Loan" v={l.sssLoan} />
                <Row k="Pag-IBIG Loan" v={l.piLoan} />
                <Row k="W/Holding Tax" v={l.wtax} />
                <Row k="Cash Advances" v={l.ca} />
                <Row
                  k="TOTAL LOAN PAYMENTS"
                  v={l.sssLoan + l.piLoan + l.wtax + l.ca}
                  bold
                />
              </Block>
              <div className="flex justify-between gap-4 rounded-(--r-input) bg-jce-green-100 px-2 py-1 text-[12px] font-bold text-jce-green-900">
                <span>NET PAY</span>
                <span className="font-mono tabular-nums">{peso(l.net)}</span>
              </div>
              <Block title="Balances">
                <Row k="SSS Loan" v={3600} />
                <Row k="Pag-IBIG Loan" v={0} />
                <Row k="Cash Advances" v={0} />
              </Block>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-7 border-b border-jce-ink" />
            <div className="mt-1 text-[9px] tracking-wide text-jce-ink-2 uppercase">
              Received By &amp; Date · print-only
            </div>
          </div>
        </div>
      </PrintPreview>
    </div>
  );
}
