"use client";

import Link from "next/link";
import { BellRingIcon, ChevronLeftIcon, LockIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { CAN_SEE_COMP, ROLES } from "@/lib/rbac";
import {
  HR_AUDIT,
  STATUS_TONE,
  ageOf,
  dailyTotal,
  expiringFlag,
  monthsLeft,
  totalMonthly,
  yearsOfService,
  type Compensation,
  type Employee,
} from "@/lib/mock/hr";
import { peso } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { FieldComputed } from "@/components/jce/field-computed";
import { FieldMasked } from "@/components/jce/field-masked";

// H2 · Employee record (hr-employees.jsx:223). Glass identity header + 7 solid
// tabs. Years of service + age are COMPUTED (read-only). Compensation figures and
// the ATM number are MASKED for every role except Payroll + Owner (CAN_SEE_COMP)
// — •••••• in a field-masked pill, never blank. Government IDs / personal data are
// badged "sensitive" but visible to HR. History reads HR_AUDIT for this employee.

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

export function EmployeeRecord({ emp }: { emp: Employee }) {
  const { role } = useJce();
  const canEditEmployees = role === "hrhead" || role === "owner";
  const seeComp = CAN_SEE_COMP(role);

  const yos = yearsOfService(emp.hired);
  const age = ageOf(emp.birthday);
  const c: Compensation = emp.comp;
  const tm = totalMonthly(c);
  const dt = dailyTotal(c);

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
            <Field label="Insurance">{emp.insurance}</Field>
            <Field label="Vaccinated">{emp.vaccinated}</Field>
            <Field label="ATM Account Number" sensitive>
              {seeComp ? emp.atm : <FieldMasked length={8} />}
            </Field>
            <Field label="Expiration Date">{emp.atmExp}</Field>
            <Field label="Remarks">{emp.remarks}</Field>
          </dl>
        </TabsContent>

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
    </div>
  );
}
