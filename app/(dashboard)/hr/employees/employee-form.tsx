"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, LockIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { CAN_SEE_COMP, ROLES } from "@/lib/rbac";
import {
  EMP_STATUS_OPTIONS,
  PROJECTS,
  type Employee,
  type SalaryCategory,
} from "@/lib/mock/hr";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { FieldComputed } from "@/components/jce/field-computed";
import { FieldMasked } from "@/components/jce/field-masked";

// H3 · Add / edit employee (hr-employees.jsx:504). Sticky section rail + solid
// multi-section form. Required identity fields (Name, Position) validate on save.
// Computed fields (Years of Service, Age, Total) are read-only. Compensation +
// ATM inputs are MASKED for non-payroll/owner; for an HR read-grant role the whole
// form renders as static text (never disabled inputs).

const SECTIONS = [
  { id: "ident", label: "Identification & assignment" },
  { id: "comp", label: "Compensation" },
  { id: "gov", label: "Government IDs" },
  { id: "pers", label: "Personal" },
  { id: "emer", label: "Emergency contact" },
  { id: "other", label: "Other" },
] as const;

const SALARY_CATEGORIES: readonly SalaryCategory[] = [
  "Daily",
  "Weekly",
  "Monthly",
];

function Row({
  label,
  required,
  sensitive,
  computed,
  children,
}: {
  label: string;
  required?: boolean;
  sensitive?: boolean;
  computed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
        {label}
        {required ? <span className="text-(--st-danger)">*</span> : null}
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
      </label>
      {children}
    </div>
  );
}

export function EmployeeForm({
  mode,
  emp,
}: {
  mode: "new" | "edit";
  emp?: Employee;
}) {
  const router = useRouter();
  const { role } = useJce();
  const editable = role === "hrhead" || role === "owner";
  const seeComp = CAN_SEE_COMP(role);

  const [sec, setSec] = useState<string>("ident");
  const [name, setName] = useState(emp?.name ?? "");
  const [pos, setPos] = useState(emp?.pos ?? "");

  const cancelHref =
    mode === "edit" && emp ? `/hr/employees/${emp.id}` : "/hr/employees";

  const save = () => {
    if (!name.trim() || !pos.trim()) {
      setSec("ident");
      toast.error("Name and Position are required.");
      return;
    }
    toast.success(
      mode === "new"
        ? `Employee “${name}” added (mock).`
        : `${name} updated (mock).`,
    );
    router.push(cancelHref);
  };

  // Render helpers — plain functions (NOT components) so re-renders preserve
  // uncontrolled input state.
  const staticText = (v?: string | number) => (
    <div className="field flex items-center bg-(--table-zebra)">
      {v === undefined || v === "" ? "—" : v}
    </div>
  );

  const textInput = (value?: string | number, type = "text") =>
    editable ? (
      <input className="field" type={type} defaultValue={value} />
    ) : (
      staticText(value)
    );

  const selectInput = (
    value: string | undefined,
    options: readonly string[],
  ) =>
    editable ? (
      <select className="field" defaultValue={value}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    ) : (
      staticText(value)
    );

  const compInput = (value?: number | "—") => {
    if (!seeComp) return <FieldMasked />;
    const v = value === "—" ? "" : value;
    return editable ? (
      <input className="field font-mono tabular-nums" defaultValue={v} />
    ) : (
      staticText(value)
    );
  };

  const computedField = (hint: string) => (
    <div className="computed field flex items-center">
      <FieldComputed>{hint}</FieldComputed>
    </div>
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <button
        type="button"
        onClick={() => router.push(cancelHref)}
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Cancel
      </button>

      <PageHeader
        kicker={`HR · H3${editable ? "" : " · read-only"}`}
        title={
          mode === "edit" && emp
            ? `Edit employee — ${emp.name}`
            : "Add employee"
        }
        actions={
          editable ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(cancelHref)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={save}>
                Save
              </Button>
            </>
          ) : (
            <Chip tone="neutral">Read-only — your role cannot edit HR</Chip>
          )
        }
      />

      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <nav className="glass sticky top-4 flex h-fit flex-col gap-0.5 rounded-(--r-glass) p-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSec(s.id)}
              className={cn(
                "focus-ring-jce rounded-[8px] px-3 py-2 text-left text-ui-13 font-medium transition-colors",
                sec === s.id
                  ? "bg-jce-green-700 text-primary-foreground"
                  : "text-jce-ink-2 hover:bg-jce-green-50 hover:text-jce-green-900",
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="solid rounded-(--r-solid) p-5">
          {sec === "ident" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Row label="Name of Employee" required>
                {editable ? (
                  <input
                    className="field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  staticText(name)
                )}
              </Row>
              <Row label="BIO Nos">{textInput(emp?.bio)}</Row>
              <Row label="Place of Assignment">
                {editable ? (
                  <select className="field" defaultValue={emp?.assign}>
                    {PROJECTS.map((p) => (
                      <option key={p.so}>
                        {p.so} · {p.label}
                      </option>
                    ))}
                    <option>Main Office</option>
                    <option>Workshop</option>
                    <option>Motorpool</option>
                  </select>
                ) : (
                  staticText(emp?.assign)
                )}
              </Row>
              <Row label="Position" required>
                {editable ? (
                  <input
                    className="field"
                    value={pos}
                    onChange={(e) => setPos(e.target.value)}
                  />
                ) : (
                  staticText(pos)
                )}
              </Row>
              <Row label="Date Hired">{textInput(emp?.hired, "date")}</Row>
              <Row label="Years of Service" computed>
                {computedField("auto from Date Hired")}
              </Row>
              <Row label="Employee Number">{textInput(emp?.no)}</Row>
              <Row label="Status">
                {selectInput(emp?.status, EMP_STATUS_OPTIONS)}
              </Row>
            </div>
          ) : null}

          {sec === "comp" ? (
            <div className="flex flex-col gap-4">
              {!seeComp ? (
                <div className="flex flex-wrap items-center gap-2 rounded-(--r-solid) border border-(--masked-border) bg-(--table-zebra) px-4 py-2.5 text-ui-12 text-jce-ink-2">
                  <LockIcon className="size-3.5 shrink-0" aria-hidden />
                  Compensation is editable only by{" "}
                  <strong className="text-jce-ink">
                    Payroll Officer &amp; Owner
                  </strong>
                  . You are <strong>{ROLES[role].short}</strong>.
                </div>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <Row label="Salary Rate Category">
                  {selectInput(emp?.comp.cat, SALARY_CATEGORIES)}
                </Row>
                <Row label="Daily Rate (Basic)" sensitive>
                  {compInput(emp?.comp.daily)}
                </Row>
                <Row label="Equivalent Monthly Rate" sensitive>
                  {compInput(emp?.comp.monthly)}
                </Row>
                <Row label="Monthly Allowance" sensitive>
                  {compInput(emp?.comp.allowance)}
                </Row>
                <Row label="Total Monthly Compensation" computed>
                  {computedField("auto-summed")}
                </Row>
              </div>
            </div>
          ) : null}

          {sec === "gov" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Row label="SSS" sensitive>
                {textInput(emp?.sss)}
              </Row>
              <Row label="Pag-IBIG" sensitive>
                {textInput(emp?.pagibig)}
              </Row>
              <Row label="PhilHealth" sensitive>
                {textInput(emp?.philhealth)}
              </Row>
              <Row label="TIN" sensitive>
                {textInput(emp?.tin)}
              </Row>
            </div>
          ) : null}

          {sec === "pers" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Row label="Birthday" sensitive>
                {textInput(emp?.birthday, "date")}
              </Row>
              <Row label="Age" computed>
                {computedField("auto from Birthday")}
              </Row>
              <Row label="Gender">
                {selectInput(emp?.gender, ["Male", "Female"])}
              </Row>
              <Row label="Address" sensitive>
                {textInput(emp?.address)}
              </Row>
              <Row label="Contact Number" sensitive>
                {textInput(emp?.contact)}
              </Row>
            </div>
          ) : null}

          {sec === "emer" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Row label="Contact Person">{textInput(emp?.emName)}</Row>
              <Row label="Contact Number">{textInput(emp?.emNum)}</Row>
            </div>
          ) : null}

          {sec === "other" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Row label="Insurance">
                {selectInput(emp?.insurance, ["Yes", "No"])}
              </Row>
              <Row label="Vaccinated">
                {selectInput(emp?.vaccinated, ["Yes", "No"])}
              </Row>
              <Row label="ATM Account Number" sensitive>
                {seeComp ? textInput(emp?.atm) : <FieldMasked length={8} />}
              </Row>
              <Row label="Expiration Date">{textInput(emp?.atmExp)}</Row>
              <Row label="Remarks">{textInput(emp?.remarks)}</Row>
            </div>
          ) : null}

          <p className="mt-5 border-t border-jce-line pt-3 text-ui-12 text-jce-ink-2">
            Required identity fields validate on save · computed fields are
            read-only · sensitive groups are badged · compensation is masked
            unless Payroll / Owner.
          </p>
        </div>
      </div>
    </div>
  );
}
