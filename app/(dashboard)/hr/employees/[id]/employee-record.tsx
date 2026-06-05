"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BellRingIcon,
  ChevronLeftIcon,
  LockIcon,
  RefreshCwIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { CAN_SEE_COMP, ROLES } from "@/lib/rbac";
import {
  HR_AUDIT,
  HR_TODAY,
  INS_STATUS_TONE,
  STATUS_TONE,
  addMonths,
  ageOf,
  dailyTotal,
  expiringFlag,
  findEmployee,
  getContractExtensions,
  insuranceStatus,
  monthsLeft,
  renewContract,
  totalMonthly,
  yearsOfService,
  type Compensation,
  type ContractExtension,
  type Employee,
  type InsuranceStatus,
} from "@/lib/mock/hr";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chip, type ChipTone } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";
import { FieldComputed } from "@/components/jce/field-computed";
import { FieldMasked } from "@/components/jce/field-masked";
import { Segmented } from "@/components/jce/segmented";

// H2 · Employee record (hr-employees.jsx:223). Glass identity header + solid tabs.
// Years of service + age are COMPUTED. Compensation + ATM are MASKED except for
// Payroll + Owner (CAN_SEE_COMP). Government / personal data is badged "sensitive"
// but visible to HR. CONTRACTUAL employees get an extra "Contract" tab with the
// renewal action + append-only extension history; renewals re-resolve the record
// from the in-session store so the banner + tab update live (no reload).

function Field({
  label,
  sensitive,
  computed,
  children,
}: {
  label: string;
  sensitive?: boolean;
  computed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="kicker flex items-center gap-1.5 text-jce-green-600">
        {label}
        {sensitive ? (
          <span className="rounded bg-(--st-danger-bg) px-1 py-0.5 text-[8px] font-bold tracking-wide text-(--st-danger-ink)">
            SENSITIVE
          </span>
        ) : null}
        {computed ? (
          <span className="rounded bg-jce-green-50 px-1 py-0.5 text-[8px] font-bold tracking-wide text-jce-green-700">
            COMPUTED
          </span>
        ) : null}
      </dt>
      <dd className="mt-1 text-ui-13 text-jce-ink">{children}</dd>
    </div>
  );
}

function money(v: number | "—"): string {
  return v === "—" ? "—" : peso(v);
}

const INS_LABEL: Record<InsuranceStatus, string> = {
  active: "Active",
  expiring: "Expiring",
  expired: "Expired",
  none: "",
};

export function EmployeeRecord({ emp: empProp }: { emp: Employee }) {
  const { role } = useJce();
  const canEditEmployees = role === "hrhead" || role === "owner";
  const seeComp = CAN_SEE_COMP(role);

  // Hold the employee in client state + re-resolve from the store after a renewal
  // so the expiry banner, header and Contract tab update without a reload.
  const [emp, setEmp] = useState<Employee>(empProp);
  const isContractual = emp.type === "Contractual";

  const [exts, setExts] = useState<readonly ContractExtension[]>(() =>
    getContractExtensions(empProp.no),
  );
  const [renewOpen, setRenewOpen] = useState(false);
  const [term, setTerm] = useState<"3" | "6">("3");
  const termN: 3 | 6 = term === "6" ? 6 : 3;
  const previewEnd = addMonths(HR_TODAY, termN);

  const confirmRenew = () => {
    const ext = renewContract({
      empNo: emp.no,
      term: termN,
      by: ROLES[role].name,
    });
    setEmp(findEmployee(emp.id) ?? emp);
    setExts(getContractExtensions(emp.no));
    setRenewOpen(false);
    toast.success(`Contract renewed +${termN} months — new end ${ext.newEnd}.`);
  };

  const yos = yearsOfService(emp.hired);
  const age = ageOf(emp.birthday);
  const c: Compensation = emp.comp;
  const tm = totalMonthly(c);
  const dt = dailyTotal(c);

  const cm = monthsLeft(emp.contractEnd);
  const contractChip: { tone: ChipTone; label: string } =
    cm == null
      ? { tone: "neutral", label: "No end set" }
      : cm < 0
        ? { tone: "danger", label: "Expired" }
        : cm < 6
          ? { tone: "pending", label: `Expiring · ${cm}mo` }
          : { tone: "success", label: `Active · ${cm}mo` };

  const insStatus = insuranceStatus(emp);

  const initials = emp.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const history = HR_AUDIT.filter((a) => a.rec === emp.no);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <Link
        href="/hr/employees"
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Employees
      </Link>

      {expiringFlag(emp) ? (
        <div className="flex flex-wrap items-center gap-2 rounded-(--r-solid) border border-(--st-pending) bg-(--st-pending-bg) px-4 py-2.5 text-ui-13 text-(--st-pending-ink)">
          <BellRingIcon className="size-4 shrink-0" aria-hidden />
          <span>
            Contract expires <strong>{emp.contractEnd}</strong> —{" "}
            {monthsLeft(emp.contractEnd)} months remaining.
          </span>
          <span className="ml-auto rounded bg-card/60 px-2 py-0.5 text-[10px] font-semibold">
            flag &lt; 6 months · OQ#2
          </span>
        </div>
      ) : null}

      {/* Identity header (glass) */}
      <div className="glass flex flex-wrap items-center gap-4 rounded-(--r-glass) p-5">
        <div className="grid size-14 shrink-0 place-items-center rounded-full bg-jce-green-100 text-ui-16 font-bold text-jce-green-700">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-ui-22 font-bold tracking-tight text-jce-ink">
            {emp.name}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-ui-13 text-jce-ink-2">
            {emp.pos} <span aria-hidden>·</span> <DocChip code={emp.no} />{" "}
            <span aria-hidden>·</span> BIO {emp.bio}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-ui-12 text-jce-ink-2">
            <Chip tone={STATUS_TONE[emp.status] ?? "neutral"}>
              {emp.status}
            </Chip>
            <span aria-hidden>·</span>
            <FieldComputed>{yos.toFixed(1)} yrs of service</FieldComputed>
            <span aria-hidden>·</span>
            {emp.type}
          </div>
        </div>
        {canEditEmployees ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm">
              <Link href={`/hr/employees/${emp.id}/edit`}>Edit</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.success(`${emp.name} archived (mock).`)}
            >
              Archive
            </Button>
          </div>
        ) : null}
      </div>

      <Tabs defaultValue="ident" className="gap-3">
        <TabsList className="flex-wrap">
          <TabsTrigger value="ident">Identification</TabsTrigger>
          <TabsTrigger value="comp">Compensation</TabsTrigger>
          <TabsTrigger value="gov">Government IDs</TabsTrigger>
          <TabsTrigger value="pers">Personal</TabsTrigger>
          <TabsTrigger value="emer">Emergency</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
          {isContractual ? (
            <TabsTrigger value="contract">Contract</TabsTrigger>
          ) : null}
          <TabsTrigger value="hist">History</TabsTrigger>
        </TabsList>

        <TabsContent value="ident">
          <dl className="solid grid gap-x-8 gap-y-4 rounded-(--r-solid) p-5 sm:grid-cols-2">
            <Field label="S/N">{emp.sn}</Field>
            <Field label="Name of Employee">{emp.name}</Field>
            <Field label="BIO Nos">{emp.bio}</Field>
            <Field label="Place of Assignment">{emp.assign}</Field>
            <Field label="Position">{emp.pos}</Field>
            <Field label="Date Hired">{emp.hired}</Field>
            <Field label="Years of Service" computed>
              <FieldComputed>{yos.toFixed(1)} yrs</FieldComputed>
            </Field>
            <Field label="Status">
              <Chip tone={STATUS_TONE[emp.status] ?? "neutral"}>
                {emp.status}
              </Chip>
            </Field>
          </dl>
        </TabsContent>

        <TabsContent value="comp">
          <div className="flex flex-col gap-4">
            {!seeComp ? (
              <div className="flex flex-wrap items-center gap-2 rounded-(--r-solid) border border-(--masked-border) bg-(--table-zebra) px-4 py-2.5 text-ui-12 text-jce-ink-2">
                <LockIcon className="size-3.5 shrink-0" aria-hidden />
                Compensation is restricted to{" "}
                <strong className="text-jce-ink">
                  Payroll Officer &amp; Owner
                </strong>
                . You are viewing as <strong>{ROLES[role].short}</strong>.
              </div>
            ) : null}
            <dl className="solid grid gap-x-8 gap-y-4 rounded-(--r-solid) p-5 sm:grid-cols-2">
              <Field label="Salary Rate Category">{c.cat}</Field>
              <Field label="Daily Rate (Basic)" sensitive>
                {seeComp ? money(c.daily) : <FieldMasked />}
              </Field>
              <Field label="Equivalent Monthly Rate" sensitive>
                {seeComp ? money(c.monthly) : <FieldMasked />}
              </Field>
              <Field label="Monthly Allowance" sensitive>
                {seeComp ? peso(c.allowance) : <FieldMasked />}
              </Field>
              <Field label="Duty Meal Allowance" sensitive>
                {seeComp ? peso(c.dutyMeal) : <FieldMasked />}
              </Field>
              <Field label="Project Allowance" sensitive>
                {seeComp ? peso(c.project) : <FieldMasked />}
              </Field>
              <Field label="Total Monthly Compensation" sensitive computed>
                {seeComp ? (
                  <FieldComputed>{tm != null ? peso(tm) : "—"}</FieldComputed>
                ) : (
                  <FieldMasked />
                )}
              </Field>
              <Field label="Daily (Basic + Allowances)" sensitive computed>
                {seeComp ? (
                  <FieldComputed>{dt != null ? peso(dt) : "—"}</FieldComputed>
                ) : (
                  <FieldMasked />
                )}
              </Field>
            </dl>
          </div>
        </TabsContent>

        <TabsContent value="gov">
          <dl className="solid grid gap-x-8 gap-y-4 rounded-(--r-solid) p-5 sm:grid-cols-2">
            <Field label="SSS" sensitive>
              {emp.sss}
            </Field>
            <Field label="Pag-IBIG" sensitive>
              {emp.pagibig}
            </Field>
            <Field label="PhilHealth" sensitive>
              {emp.philhealth}
            </Field>
            <Field label="TIN" sensitive>
              {emp.tin}
            </Field>
          </dl>
        </TabsContent>

        <TabsContent value="pers">
          <dl className="solid grid gap-x-8 gap-y-4 rounded-(--r-solid) p-5 sm:grid-cols-2">
            <Field label="Birthday" sensitive>
              {emp.birthday}
            </Field>
            <Field label="Age" computed>
              <FieldComputed>{age} yrs</FieldComputed>
            </Field>
            <Field label="Gender">{emp.gender}</Field>
            <Field label="Address" sensitive>
              {emp.address}
            </Field>
            <Field label="Contact Number" sensitive>
              {emp.contact}
            </Field>
          </dl>
        </TabsContent>

        <TabsContent value="emer">
          <dl className="solid grid gap-x-8 gap-y-4 rounded-(--r-solid) p-5 sm:grid-cols-2">
            <Field label="Contact Person">{emp.emName}</Field>
            <Field label="Contact Number">{emp.emNum}</Field>
          </dl>
        </TabsContent>

        <TabsContent value="other">
          <dl className="solid grid gap-x-8 gap-y-4 rounded-(--r-solid) p-5 sm:grid-cols-2">
            <Field label="Insurance">
              <span className="flex flex-wrap items-center gap-2">
                {emp.insurance}
                {insStatus !== "none" ? (
                  <Chip tone={INS_STATUS_TONE[insStatus]}>
                    {INS_LABEL[insStatus]}
                  </Chip>
                ) : null}
              </span>
            </Field>
            <Field label="Insurance Provider">{emp.insProvider ?? "—"}</Field>
            <Field label="Policy No." sensitive>
              {emp.insPolicyNo ?? "—"}
            </Field>
            <Field label="Insurance Enrolled">{emp.insEnrolled ?? "—"}</Field>
            <Field label="Insurance Expiry">{emp.insExpiry ?? "—"}</Field>
            <Field label="Vaccinated">{emp.vaccinated}</Field>
            <Field label="ATM Account Number" sensitive>
              {seeComp ? emp.atm : <FieldMasked length={8} />}
            </Field>
            <Field label="ATM Expiration Date">{emp.atmExp}</Field>
            <Field label="Remarks">{emp.remarks}</Field>
          </dl>
        </TabsContent>

        {isContractual ? (
          <TabsContent value="contract">
            <div className="flex flex-col gap-5">
              {/* Term summary */}
              <div className="solid rounded-(--r-solid) p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-ui-14 font-semibold text-jce-ink">
                    Contract term
                  </h2>
                  {canEditEmployees ? (
                    <Button
                      size="sm"
                      className="min-h-11"
                      onClick={() => {
                        setTerm("3");
                        setRenewOpen(true);
                      }}
                    >
                      <RefreshCwIcon className="size-4" aria-hidden /> Renew
                    </Button>
                  ) : null}
                </div>
                <dl className="mt-3 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Date Hired (start)">{emp.hired}</Field>
                  <Field label="Current contract end">
                    {emp.contractEnd ?? "—"}
                  </Field>
                  <Field label="Months left" computed>
                    <span className="flex flex-wrap items-center gap-2">
                      <FieldComputed>
                        {cm == null ? "—" : `${cm} mo`}
                      </FieldComputed>
                      <Chip tone={contractChip.tone}>{contractChip.label}</Chip>
                    </span>
                  </Field>
                </dl>
              </div>

              {/* Append-only extension history */}
              <div className="flex flex-col gap-2">
                <h2 className="kicker text-jce-green-600">
                  Contract extension history
                </h2>
                {exts.length === 0 ? (
                  <div className="glass rounded-(--r-glass) p-6">
                    <EmptyState
                      icon={
                        <RefreshCwIcon
                          className="size-7"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      }
                      title="No extensions recorded yet"
                      description="Renewals will appear here, newest first."
                    />
                  </div>
                ) : (
                  <div className="solid divide-y divide-jce-line overflow-hidden rounded-(--r-solid)">
                    {exts.map((x) => (
                      <div
                        key={x.id}
                        className="flex flex-wrap items-center gap-3 p-3"
                      >
                        <span className="font-mono text-ui-12 whitespace-nowrap text-jce-ink-2">
                          {x.renewedOn}
                        </span>
                        <Chip tone="success">+{x.term} mo</Chip>
                        <span className="min-w-40 flex-1 text-ui-13 text-jce-ink">
                          <span className="font-mono tabular-nums">
                            {x.previousEnd ?? "—"}
                          </span>{" "}
                          →{" "}
                          <span className="font-mono font-semibold tabular-nums">
                            {x.newEnd}
                          </span>
                        </span>
                        <span className="text-ui-12 text-jce-ink-2">
                          {x.by}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        ) : null}

        <TabsContent value="hist">
          <div className="solid divide-y divide-jce-line overflow-hidden rounded-(--r-solid)">
            {history.map((h, i) => (
              <div key={i} className="flex flex-wrap items-center gap-3 p-3">
                <span className="font-mono text-ui-12 whitespace-nowrap text-jce-ink-2">
                  {h.ts}
                </span>
                <div className="min-w-0">
                  <div className="text-ui-13 font-medium text-jce-ink">
                    {h.action} — {h.delta}
                  </div>
                  <div className="text-ui-12 text-jce-ink-2">{h.actor}</div>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3 p-3">
              <span className="font-mono text-ui-12 whitespace-nowrap text-jce-ink-2">
                {emp.hired}
              </span>
              <div className="min-w-0">
                <div className="text-ui-13 font-medium text-jce-ink">
                  Employee created — {emp.status}
                </div>
                <div className="text-ui-12 text-jce-ink-2">HR Head</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Renew-contract dialog (hrhead/owner) */}
      <Dialog open={renewOpen} onOpenChange={setRenewOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Renew contract</DialogTitle>
            <DialogDescription>
              Extends {emp.name}&rsquo;s contract from today ({HR_TODAY}) by the
              chosen term. The new end is computed from the renewal date.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-ui-12 font-semibold text-jce-ink-2">
                Term
              </span>
              <Segmented
                aria-label="Renewal term"
                options={[
                  { value: "3", label: "3 months" },
                  { value: "6", label: "6 months" },
                ]}
                value={term}
                onValueChange={(v) => setTerm(v === "6" ? "6" : "3")}
              />
            </div>
            <div className="solid rounded-(--r-solid) p-4 text-ui-13">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-jce-ink-2">Current end</span>
                <span className="font-mono tabular-nums text-jce-ink">
                  {emp.contractEnd ?? "—"}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-jce-line pt-2">
                <span className="text-jce-ink-2">New end (+{termN} mo)</span>
                <span className="font-mono font-bold tabular-nums text-jce-green-700">
                  {previewEnd}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              className="min-h-11"
              onClick={() => setRenewOpen(false)}
            >
              Cancel
            </Button>
            <Button className="min-h-11" onClick={confirmRenew}>
              Confirm renewal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
