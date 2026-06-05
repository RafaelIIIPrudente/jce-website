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
  addEmployee,
  addMonths,
  updateEmployee,
  type Employee,
  type EmployeeType,
  type SalaryCategory,
} from "@/lib/mock/hr";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { FieldComputed } from "@/components/jce/field-computed";
import { FieldMasked } from "@/components/jce/field-masked";

// H3 · Add / edit employee (hr-employees.jsx:504). Sticky section rail + solid
// multi-section form. CONTROLLED form state (one object) so values survive
// section switches and Save PERSISTS the whole record into the in-session
// employee store (addEmployee / updateEmployee) — the saved data then shows on
// the H2 record. Required identity fields (Name, Position) validate on save;
// Contract End is DERIVED from Date Hired + the contractual term; computed
// fields are read-only; compensation + ATM are masked for non-payroll/owner; an
// HR read-grant role renders the whole form as static text (never disabled).

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

const ASSIGN_OPTIONS: readonly string[] = [
  ...PROJECTS.filter((p) => p.so !== "WORKSHOP" && p.so !== "MOTORPOOL").map(
    (p) => `${p.so} · ${p.label}`,
  ),
  "Main Office",
  "Workshop",
  "Motorpool",
];

type EmpForm = {
  name: string;
  bio: string;
  assign: string;
  pos: string;
  type: EmployeeType;
  hired: string;
  term: "3" | "6";
  no: string;
  status: string;
  cat: SalaryCategory;
  daily: string;
  monthly: string;
  allowance: string;
  sss: string;
  pagibig: string;
  philhealth: string;
  tin: string;
  birthday: string;
  gender: string;
  address: string;
  contact: string;
  emName: string;
  emNum: string;
  insurance: string;
  insProvider: string;
  insPolicyNo: string;
  insEnrolled: string;
  insExpiry: string;
  vaccinated: string;
  atm: string;
  atmExp: string;
  remarks: string;
};

function initForm(emp?: Employee): EmpForm {
  const initialTerm: "3" | "6" =
    emp &&
    emp.type === "Contractual" &&
    emp.contractEnd === addMonths(emp.hired, 6)
      ? "6"
      : "3";
  return {
    name: emp?.name ?? "",
    bio: emp?.bio ?? "",
    assign: emp?.assign ?? ASSIGN_OPTIONS[0] ?? "Main Office",
    pos: emp?.pos ?? "",
    type: emp?.type ?? "Regular",
    hired: emp?.hired ?? "",
    term: initialTerm,
    no: emp?.no ?? "",
    status: emp?.status ?? "Probationary",
    cat: emp?.comp.cat ?? "Daily",
    daily:
      emp && typeof emp.comp.daily === "number" ? String(emp.comp.daily) : "",
    monthly:
      emp && typeof emp.comp.monthly === "number"
        ? String(emp.comp.monthly)
        : "",
    allowance: emp ? String(emp.comp.allowance) : "",
    sss: emp?.sss ?? "",
    pagibig: emp?.pagibig ?? "",
    philhealth: emp?.philhealth ?? "",
    tin: emp?.tin ?? "",
    birthday: emp?.birthday ?? "",
    gender: emp?.gender ?? "Male",
    address: emp?.address ?? "",
    contact: emp?.contact ?? "",
    emName: emp?.emName ?? "",
    emNum: emp?.emNum ?? "",
    insurance: emp?.insurance ?? "No",
    insProvider: emp?.insProvider ?? "",
    insPolicyNo: emp?.insPolicyNo ?? "",
    insEnrolled: emp?.insEnrolled ?? "",
    insExpiry: emp?.insExpiry ?? "",
    vaccinated: emp?.vaccinated ?? "No",
    atm: emp?.atm ?? "",
    atmExp: emp?.atmExp ?? "",
    remarks: emp?.remarks ?? "",
  };
}

function numOrDash(s: string): number | "—" {
  const n = Number(s);
  return s.trim() === "" || !Number.isFinite(n) ? "—" : n;
}
function numOrZero(s: string): number {
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

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
  const [form, setForm] = useState<EmpForm>(() => initForm(emp));
  const set = <K extends keyof EmpForm>(k: K, v: EmpForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // Contract End is DERIVED from Date Hired + the chosen term (contractual only).
  const contractEnd =
    form.type === "Contractual" && form.hired
      ? addMonths(form.hired, form.term === "6" ? 6 : 3)
      : "";

  const cancelHref =
    mode === "edit" && emp ? `/hr/employees/${emp.id}` : "/hr/employees";

  const save = () => {
    if (!form.name.trim() || !form.pos.trim()) {
      setSec("ident");
      toast.error("Name and Position are required.");
      return;
    }
    const built: Omit<Employee, "id" | "sn"> = {
      no: form.no,
      name: form.name.trim(),
      bio: form.bio.trim(),
      pos: form.pos.trim(),
      assign: form.assign,
      cat: form.cat,
      status: form.status,
      hired: form.hired,
      type: form.type,
      contractEnd: contractEnd || undefined,
      birthday: form.birthday,
      gender: form.gender,
      contact: form.contact,
      address: form.address,
      sss: form.sss,
      pagibig: form.pagibig,
      philhealth: form.philhealth,
      tin: form.tin,
      emName: form.emName,
      emNum: form.emNum,
      insurance: form.insurance,
      insProvider: form.insProvider || undefined,
      insPolicyNo: form.insPolicyNo || undefined,
      insEnrolled: form.insEnrolled || undefined,
      insExpiry: form.insExpiry || undefined,
      vaccinated: form.vaccinated,
      atm: form.atm,
      atmExp: form.atmExp,
      remarks: form.remarks.trim() || "—",
      comp: {
        cat: form.cat,
        daily: numOrDash(form.daily),
        monthly: numOrDash(form.monthly),
        allowance: numOrZero(form.allowance),
        dutyMeal: emp?.comp.dutyMeal ?? 0,
        project: emp?.comp.project ?? 0,
      },
    };
    if (mode === "edit" && emp) {
      updateEmployee({ ...built, id: emp.id, sn: emp.sn });
      toast.success(`${built.name} updated.`);
      router.push(`/hr/employees/${emp.id}`);
    } else {
      const created = addEmployee(built);
      toast.success(`Employee “${built.name}” added.`);
      router.push(`/hr/employees/${created.id}`);
    }
  };

  // Render helpers (controlled). For a read-grant role they fall back to static
  // text — never disabled inputs.
  const staticText = (v?: string | number) => (
    <div className="field flex items-center bg-(--table-zebra)">
      {v === undefined || v === "" ? "—" : v}
    </div>
  );

  const textField = (k: keyof EmpForm, type = "text") =>
    editable ? (
      <input
        className="field"
        type={type}
        value={form[k]}
        onChange={(e) => set(k, e.target.value)}
      />
    ) : (
      staticText(form[k])
    );

  const selectField = (k: keyof EmpForm, options: readonly string[]) =>
    editable ? (
      <select
        className="field"
        value={form[k]}
        onChange={(e) => set(k, e.target.value as EmpForm[typeof k])}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    ) : (
      staticText(form[k])
    );

  const compField = (k: "daily" | "monthly" | "allowance") => {
    if (!seeComp) return <FieldMasked />;
    return editable ? (
      <input
        className="field font-mono tabular-nums"
        value={form[k]}
        onChange={(e) => set(k, e.target.value)}
      />
    ) : (
      staticText(form[k])
    );
  };

  const computedField = (hint: string) => (
    <div className="computed field flex items-center">
      <FieldComputed>{hint}</FieldComputed>
    </div>
  );

  const assignOptions =
    form.assign && !ASSIGN_OPTIONS.includes(form.assign)
      ? [form.assign, ...ASSIGN_OPTIONS]
      : ASSIGN_OPTIONS;

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
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                ) : (
                  staticText(form.name)
                )}
              </Row>
              <Row label="BIO Nos">{textField("bio")}</Row>
              <Row label="Place of Assignment">
                {editable ? (
                  <select
                    className="field"
                    value={form.assign}
                    onChange={(e) => set("assign", e.target.value)}
                  >
                    {assignOptions.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                ) : (
                  staticText(form.assign)
                )}
              </Row>
              <Row label="Position" required>
                {editable ? (
                  <input
                    className="field"
                    value={form.pos}
                    onChange={(e) => set("pos", e.target.value)}
                  />
                ) : (
                  staticText(form.pos)
                )}
              </Row>
              <Row label="Employment Type">
                {editable ? (
                  <select
                    className="field"
                    value={form.type}
                    onChange={(e) =>
                      set("type", e.target.value as EmployeeType)
                    }
                  >
                    <option value="Regular">Regular</option>
                    <option value="Contractual">Contractual</option>
                  </select>
                ) : (
                  staticText(form.type)
                )}
              </Row>
              <Row label="Date Hired">
                {editable ? (
                  <input
                    className="field"
                    type="date"
                    value={form.hired}
                    onChange={(e) => set("hired", e.target.value)}
                  />
                ) : (
                  staticText(form.hired)
                )}
              </Row>
              {form.type === "Contractual" ? (
                <>
                  <Row label="Contract Term">
                    {editable ? (
                      <select
                        className="field"
                        value={form.term}
                        onChange={(e) =>
                          set("term", e.target.value === "6" ? "6" : "3")
                        }
                      >
                        <option value="3">3 months</option>
                        <option value="6">6 months</option>
                      </select>
                    ) : (
                      staticText(`${form.term} months`)
                    )}
                  </Row>
                  <Row label="Contract End" computed>
                    <div className="computed field flex items-center">
                      <FieldComputed>
                        {contractEnd || "set Date Hired"}
                      </FieldComputed>
                    </div>
                  </Row>
                </>
              ) : null}
              <Row label="Years of Service" computed>
                {computedField("auto from Date Hired")}
              </Row>
              <Row label="Employee Number">{textField("no")}</Row>
              <Row label="Status">
                {selectField("status", EMP_STATUS_OPTIONS)}
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
                  {selectField("cat", SALARY_CATEGORIES)}
                </Row>
                <Row label="Daily Rate (Basic)" sensitive>
                  {compField("daily")}
                </Row>
                <Row label="Equivalent Monthly Rate" sensitive>
                  {compField("monthly")}
                </Row>
                <Row label="Monthly Allowance" sensitive>
                  {compField("allowance")}
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
                {textField("sss")}
              </Row>
              <Row label="Pag-IBIG" sensitive>
                {textField("pagibig")}
              </Row>
              <Row label="PhilHealth" sensitive>
                {textField("philhealth")}
              </Row>
              <Row label="TIN" sensitive>
                {textField("tin")}
              </Row>
            </div>
          ) : null}

          {sec === "pers" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Row label="Birthday" sensitive>
                {textField("birthday", "date")}
              </Row>
              <Row label="Age" computed>
                {computedField("auto from Birthday")}
              </Row>
              <Row label="Gender">
                {selectField("gender", ["Male", "Female"])}
              </Row>
              <Row label="Address" sensitive>
                {textField("address")}
              </Row>
              <Row label="Contact Number" sensitive>
                {textField("contact")}
              </Row>
            </div>
          ) : null}

          {sec === "emer" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Row label="Contact Person">{textField("emName")}</Row>
              <Row label="Contact Number">{textField("emNum")}</Row>
            </div>
          ) : null}

          {sec === "other" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Row label="Insurance">
                {selectField("insurance", ["Yes", "No"])}
              </Row>
              <Row label="Insurance Provider">{textField("insProvider")}</Row>
              <Row label="Policy No." sensitive>
                {textField("insPolicyNo")}
              </Row>
              <Row label="Insurance Enrolled">
                {textField("insEnrolled", "date")}
              </Row>
              <Row label="Insurance Expiry">
                {textField("insExpiry", "date")}
              </Row>
              <Row label="Vaccinated">
                {selectField("vaccinated", ["Yes", "No"])}
              </Row>
              <Row label="ATM Account Number" sensitive>
                {seeComp ? textField("atm") : <FieldMasked length={8} />}
              </Row>
              <Row label="ATM Expiration Date">{textField("atmExp")}</Row>
              <Row label="Remarks">{textField("remarks")}</Row>
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
