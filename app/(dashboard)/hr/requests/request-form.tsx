"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, DownloadIcon, EyeIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import {
  EMPLOYEES,
  HR_TODAY,
  PROJECTS,
  REQ_TONE,
  SIGNERS,
  addRequest,
  autoCreateLeaveRowsForRange,
  detailsKindForType,
  getAllRequests,
  getRequestById,
  lengthOfService,
  nextLeaveRef,
  nextLoaId,
  typeByLabel,
  updateRequest,
  workingDaysBetween,
  type ReqEmployee,
  type ReqFile,
  type ReqSigner,
  type RequestDetails,
  type RequestInput,
  type RequestRecord,
  type RequestStatus,
  type RequestTypeLabel,
} from "@/lib/mock/hr";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";
import { FileUploader } from "@/components/jce/file-uploader";
import { PrintSignatureBlock } from "@/components/jce/print-signature-block";
import { Stepper, type Step } from "@/components/jce/stepper";

// H8–H11 · Request forms (SRS §4.3). One controlled, persisted component for both
// the create route (/[type]/new) and the record route (/[type]/[id]). Employees
// come from the DB (auto-populate); signer NAMES are recorded for audit alongside
// the print-only wet-signature blocks; a REQUIRED multi-file signed scan gates the
// terminal status; RFL/LOA auto-create a read-only timekeeping row per working day.

const SECTIONS = ["Servicing", "Shop / Office", "Project site"] as const;
const OT_TYPES = ["Pre-approved", "After-the-fact"] as const;
const RFL_LEAVE = ["Vacation Leave", "Sick Leave", "Others"] as const;
const PAY_TYPES = ["With Pay", "Without Pay"] as const;
const RFL_REQ = ["Pre-approved", "After-the-fact"] as const;
const LOA_LEAVE = [
  "Vacation",
  "Sick",
  "Paternity",
  "Maternity",
  "Others",
] as const;

type Draft = {
  no: string;
  filed: string;
  employees: ReqEmployee[];
  signers: ReqSigner[];
  // ob
  reasons: string;
  projectName: string;
  salesOrderNo: string;
  destination: string;
  departAt: string;
  returnAt: string;
  // ot
  section: string;
  project: string;
  otDate: string;
  otType: "Pre-approved" | "After-the-fact";
  requestedFromTo: string;
  actualFromTo: string;
  otReason: string;
  // rfl
  rflLeaveType: "Vacation Leave" | "Sick Leave" | "Others";
  othersSpecify: string;
  payType: "With Pay" | "Without Pay";
  rflRequestType: "Pre-approved" | "After-the-fact";
  // loa
  loaLeaveType: "Vacation" | "Sick" | "Paternity" | "Maternity" | "Others";
  loaReason: string;
  // shared range (rfl/loa)
  from: string;
  to: string;
  days: string;
  daysOverridden: boolean;
};

type Errors = Partial<Record<string, string>>;

function draftFrom(
  type: RequestTypeLabel,
  record: RequestRecord | undefined,
): Draft {
  const roles = SIGNERS[type];
  const base: Draft = {
    no: record?.no ?? "",
    filed: record?.filed ?? HR_TODAY,
    employees: record ? record.employees.map((e) => ({ ...e })) : [],
    signers: roles.map((role, i) => {
      const existing = record?.signers[i];
      return existing && existing.role === role ? { ...existing } : { role };
    }),
    reasons: "",
    projectName: PROJECTS[0]?.label ?? "",
    salesOrderNo: PROJECTS[0]?.so ?? "",
    destination: "",
    departAt: "",
    returnAt: "",
    section: SECTIONS[0],
    project: PROJECTS[0]?.label ?? "",
    otDate: "",
    otType: "Pre-approved",
    requestedFromTo: "",
    actualFromTo: "",
    otReason: "",
    rflLeaveType: "Vacation Leave",
    othersSpecify: "",
    payType: "With Pay",
    rflRequestType: "Pre-approved",
    loaLeaveType: "Vacation",
    loaReason: "",
    from: "",
    to: "",
    days: "0",
    daysOverridden: false,
  };
  const d = record?.details;
  if (!d) return base;
  if (d.kind === "ob")
    return {
      ...base,
      reasons: d.reasons,
      projectName: d.projectName,
      salesOrderNo: d.salesOrderNo,
      destination: d.destination,
      departAt: d.departAt,
      returnAt: d.returnAt,
    };
  if (d.kind === "ot")
    return {
      ...base,
      section: d.section,
      project: d.project,
      otDate: d.otDate,
      otType: d.otType,
      requestedFromTo: d.requestedFromTo,
      actualFromTo: d.actualFromTo,
      otReason: d.reason,
    };
  if (d.kind === "rfl")
    return {
      ...base,
      rflLeaveType: d.leaveType,
      othersSpecify: d.othersSpecify ?? "",
      payType: d.payType,
      rflRequestType: d.requestType,
      from: d.from,
      to: d.to,
      days: String(d.days),
      daysOverridden: d.daysOverridden ?? false,
    };
  return {
    ...base,
    loaLeaveType: d.leaveType,
    loaReason: d.reason,
    from: d.from,
    to: d.to,
    days: String(d.days),
    daysOverridden: d.daysOverridden ?? false,
  };
}

export function RequestForm({
  type,
  slug,
  recordId,
}: {
  type: RequestTypeLabel;
  slug: string;
  recordId?: string;
}) {
  const { role, addNotification } = useJce();
  const router = useRouter();
  const selfMode = role === "employee";
  const canManage = role === "hrhead" || role === "owner";
  const readOnly = !selfMode && !canManage;

  const def = typeByLabel(type);
  const kind = detailsKindForType(type);
  const isLoa = kind === "loa";
  const isMulti = kind === "ob" || kind === "ot";
  const autoLeave = def?.autoLeave ?? false;
  const terminal: RequestStatus = def?.terminal ?? "Approved";

  // Record mode resolves from the store (created records never 404).
  const [record, setRecord] = useState<RequestRecord | undefined>(() =>
    recordId ? getRequestById(type, recordId) : undefined,
  );
  const isNew = !recordId;

  const [draft, setDraft] = useState<Draft>(() => draftFrom(type, record));
  const [status, setStatus] = useState<RequestStatus>(
    record?.status ?? "Pending",
  );
  const [errors, setErrors] = useState<Errors>({});
  const [addPick, setAddPick] = useState("");

  // Scans/proof: a stable BASE captured at mount + new files from the uploader.
  const [baseScans, setBaseScans] = useState<ReqFile[]>(record?.scans ?? []);
  const [baseProof, setBaseProof] = useState<ReqFile[]>(
    record?.details.kind === "rfl" ? record.details.proof : [],
  );
  const [scanCount, setScanCount] = useState(0);
  const [proofCount, setProofCount] = useState(0);
  const [nonce, setNonce] = useState(0); // remounts uploaders after a record save

  const set = <K extends keyof Draft>(key: K, val: Draft[K]) =>
    setDraft((p) => ({ ...p, [key]: val }));

  const computedDays = workingDaysBetween(draft.from, draft.to).length;
  const effectiveDays = draft.daysOverridden
    ? Number(draft.days || "0")
    : computedDays;

  const afterTheFact =
    kind === "rfl" && draft.rflRequestType === "After-the-fact";
  const scanAttached = baseScans.length > 0 || scanCount > 0;
  const proofAttached = baseProof.length > 0 || proofCount > 0;
  const canAdvance = scanAttached && (!afterTheFact || proofAttached);

  const backHref = selfMode ? "/my-hr" : "/hr/requests";

  // Record route asked for an id that isn't in the store.
  if (recordId && !record) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-5">
        <Link
          href={backHref}
          className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
        >
          <ChevronLeftIcon className="size-4" aria-hidden /> Back
        </Link>
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            title="Request not found"
            description={`No ${type} record matches “${recordId}”. It may have been created in another session (the mock store resets on reload).`}
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/hr/requests">Back to HR Requests</Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (!def) return null;

  const empSummary =
    draft.employees.length === 0
      ? "No employee selected"
      : draft.employees.length === 1
        ? (draft.employees[0]?.name ?? "—")
        : `${draft.employees[0]?.name ?? "—"} +${draft.employees.length - 1}`;

  // ---- mutations ----
  const addEmployee = (no: string) => {
    const e = EMPLOYEES.find((x) => x.no === no);
    if (!e) return;
    if (draft.employees.some((x) => x.no === no)) return;
    set("employees", [
      ...draft.employees,
      { no: e.no, name: e.name, pos: e.pos, assign: e.assign },
    ]);
  };
  const removeEmployee = (no: string) =>
    set(
      "employees",
      draft.employees.filter((x) => x.no !== no),
    );
  const pickSingle = (no: string) => {
    const e = EMPLOYEES.find((x) => x.no === no);
    if (!e) return;
    set("employees", [
      { no: e.no, name: e.name, pos: e.pos, assign: e.assign },
    ]);
  };
  const setSigner = (i: number, no: string) => {
    const e = EMPLOYEES.find((x) => x.no === no);
    setDraft((p) => {
      const signers = p.signers.map((s, idx) =>
        idx === i ? { role: s.role, empNo: e?.no, name: e?.name } : s,
      );
      return { ...p, signers };
    });
  };

  const buildDetails = (): RequestDetails => {
    if (kind === "ob")
      return {
        kind: "ob",
        reasons: draft.reasons.trim(),
        projectName: draft.projectName,
        salesOrderNo: draft.salesOrderNo,
        destination: draft.destination.trim(),
        departAt: draft.departAt,
        returnAt: draft.returnAt,
      };
    if (kind === "ot")
      return {
        kind: "ot",
        section: draft.section,
        project: draft.project,
        otDate: draft.otDate,
        otType: draft.otType,
        requestedFromTo: draft.requestedFromTo.trim(),
        actualFromTo: draft.actualFromTo.trim(),
        reason: draft.otReason.trim(),
      };
    if (kind === "rfl")
      return {
        kind: "rfl",
        leaveType: draft.rflLeaveType,
        ...(draft.rflLeaveType === "Others"
          ? { othersSpecify: draft.othersSpecify.trim() }
          : {}),
        payType: draft.payType,
        from: draft.from,
        to: draft.to,
        days: effectiveDays,
        ...(draft.daysOverridden ? { daysOverridden: true } : {}),
        requestType: draft.rflRequestType,
        proof: [],
      };
    return {
      kind: "loa",
      from: draft.from,
      to: draft.to,
      days: effectiveDays,
      ...(draft.daysOverridden ? { daysOverridden: true } : {}),
      leaveType: draft.loaLeaveType,
      reason: draft.loaReason.trim(),
    };
  };

  const validate = (target: RequestStatus): Errors => {
    const e: Errors = {};
    if (isNew && !isLoa && !draft.no.trim()) e.no = "Form number is required.";
    if (isNew && !isLoa && draft.no.trim()) {
      const taken = getAllRequests().some((r) => r.no === draft.no.trim());
      if (taken) e.no = "That form number already exists.";
    }
    if (!draft.filed.trim()) e.filed = "Date filed is required.";
    if (draft.employees.length === 0)
      e.employees = isMulti
        ? "Add at least one employee."
        : "Select an employee.";

    if (kind === "ob") {
      if (!draft.destination.trim()) e.destination = "Destination is required.";
      if (!draft.departAt) e.departAt = "Departure is required.";
      if (!draft.returnAt) e.returnAt = "Return is required.";
    } else if (kind === "ot") {
      if (!draft.otDate) e.otDate = "OT date is required.";
      if (!draft.requestedFromTo.trim())
        e.requestedFromTo = "Requested time is required.";
    } else if (kind === "rfl") {
      if (!draft.from) e.from = "From date is required.";
      if (!draft.to) e.to = "To date is required.";
      if (draft.from && draft.to && draft.from > draft.to)
        e.to = "To must be on or after From.";
      if (draft.rflLeaveType === "Others" && !draft.othersSpecify.trim())
        e.othersSpecify = "Specify the leave type.";
    } else {
      if (!draft.from) e.from = "From date is required.";
      if (!draft.to) e.to = "To date is required.";
      if (draft.from && draft.to && draft.from > draft.to)
        e.to = "To must be on or after From.";
    }

    // terminal gate: the signed scan (and after-the-fact proof) must be attached
    const isTerminal = target === "Approved" || target === "Recorded";
    if (isTerminal && !scanAttached)
      e.scan = "Attach the signed scan to reach " + terminal + ".";
    if (isTerminal && afterTheFact && !proofAttached)
      e.proof = "After-the-fact leave needs proof / evidence.";
    return e;
  };

  const notify = (finalStatus: RequestStatus, no: string) => {
    if (finalStatus === "Pending")
      addNotification({
        mod: "HR",
        type: "Request",
        tone: "pending",
        unread: true,
        msg: `${type} ${no} filed — awaiting signed scan`,
        time: "just now",
        doc: no,
      });
    else
      addNotification({
        mod: "HR",
        type: "Approval",
        tone: "success",
        unread: true,
        msg: `${type} ${no} — ${finalStatus}`,
        time: "just now",
        doc: no,
      });
  };

  const save = (target: RequestStatus) => {
    if (readOnly) return;
    const e = validate(target);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});

    const recordNo = isNew
      ? isLoa
        ? nextLoaId()
        : draft.no.trim()
      : record!.no;
    const newScans: ReqFile[] = Array.from({ length: scanCount }, (_, i) => ({
      name: `${recordNo}-signed-${baseScans.length + i + 1}.pdf`,
      kind: "pdf" as const,
    }));
    const scans = [...baseScans, ...newScans];
    const newProof: ReqFile[] = Array.from({ length: proofCount }, (_, i) => ({
      name: `${recordNo}-proof-${baseProof.length + i + 1}.jpg`,
      kind: "jpg" as const,
    }));
    const proof = [...baseProof, ...newProof];

    const details = buildDetails();
    if (details.kind === "rfl") details.proof = proof;

    let leaveRef: string | undefined;
    if (autoLeave)
      leaveRef =
        record?.leaveRef ??
        (isLoa ? recordNo : nextLeaveRef("Request for Leave"));

    const input: RequestInput = {
      no: recordNo,
      filed: draft.filed,
      type,
      status: target,
      employees: draft.employees,
      signers: draft.signers,
      scans,
      details,
      ...(leaveRef ? { leaveRef } : {}),
    };

    const runAutoCreate = (rec: RequestRecord) => {
      if (!autoLeave || !rec.leaveRef) return;
      const emp = rec.employees[0];
      if (!emp) return;
      const leave = isLoa
        ? "Leave Without Pay"
        : draft.payType === "Without Pay"
          ? "Leave Without Pay"
          : "Leave With Pay";
      const n = autoCreateLeaveRowsForRange({
        empNo: emp.no,
        from: draft.from,
        to: draft.to,
        leave,
        ref: rec.leaveRef,
      });
      if (n > 0)
        toast.success(
          `Auto-created ${n} 🔒 read-only timekeeping row${n === 1 ? "" : "s"} (${rec.leaveRef}) in H5.`,
        );
    };

    if (isNew) {
      const created = addRequest(input);
      notify(target, created.no);
      runAutoCreate(created);
      toast.success(
        target === "Pending"
          ? `Filed ${created.no} — Pending.`
          : `${created.no} — ${target}.`,
      );
      router.push(`/hr/requests/${slug}/${created.id}`);
      return;
    }

    const updated = updateRequest(record!.id, input);
    if (!updated) return;
    if (target !== status) notify(target, updated.no);
    runAutoCreate(updated);
    setRecord(updated);
    setStatus(target);
    setBaseScans(updated.scans);
    setBaseProof(updated.details.kind === "rfl" ? updated.details.proof : []);
    setScanCount(0);
    setProofCount(0);
    setNonce((n) => n + 1);
    toast.success(
      target !== status ? `Status updated — ${target}.` : "Changes saved.",
    );
  };

  const steps: Step[] = [
    { label: "Filed", sub: record?.filed ?? draft.filed, state: "done" },
    {
      label: "Signed scan uploaded",
      state: scanAttached ? "done" : "current",
    },
    { label: terminal, state: status === terminal ? "done" : "todo" },
  ];

  const signerOptions = (signerRole: string) =>
    type === "OB/Travel" && signerRole === "Requester"
      ? draft.employees.map((e) => ({ no: e.no, name: e.name }))
      : EMPLOYEES.map((e) => ({ no: e.no, name: e.name }));

  const availableToAdd = EMPLOYEES.filter(
    (e) => !draft.employees.some((x) => x.no === e.no),
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <Link
        href={backHref}
        className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
      >
        <ChevronLeftIcon className="size-4" aria-hidden /> Back
      </Link>

      {/* Premium record header */}
      <div className="glass flex flex-col gap-3 rounded-(--r-glass) p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="kicker text-jce-green-600">
              HR · {def.code} · {isNew ? `New ${type}` : type}
            </div>
            <h1 className="mt-1 flex flex-wrap items-center gap-2 text-ui-22 font-bold text-jce-ink">
              {type}
              {!isNew && record ? <DocChip code={record.no} /> : null}
            </h1>
            <p className="mt-1 text-ui-12 text-jce-ink-2">
              Filed {draft.filed || "—"} · {empSummary}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!isNew ? (
              <Chip tone={REQ_TONE[status] ?? "neutral"}>{status}</Chip>
            ) : null}
            {readOnly ? <Chip tone="neutral">Read-only</Chip> : null}
          </div>
        </div>

        {/* Actions */}
        {!readOnly ? (
          <div className="flex flex-wrap gap-2 border-t border-jce-line pt-3">
            {isNew ? (
              <>
                <Button
                  className="min-h-11 w-full sm:w-auto"
                  onClick={() => save("Pending")}
                >
                  {selfMode ? "Submit → Pending" : "Save as Pending"}
                </Button>
                {canManage ? (
                  <Button
                    variant="outline"
                    className="min-h-11 w-full sm:w-auto"
                    disabled={!canAdvance}
                    onClick={() => save(terminal)}
                    title={
                      canAdvance
                        ? undefined
                        : `Attach the signed scan${afterTheFact ? " + proof" : ""} first`
                    }
                  >
                    Save &amp; mark {terminal}
                  </Button>
                ) : null}
              </>
            ) : (
              <>
                <Button
                  className="min-h-11 w-full sm:w-auto"
                  onClick={() => save(status)}
                >
                  Save changes
                </Button>
                {canManage && status === "Pending" ? (
                  <Button
                    variant="outline"
                    className="min-h-11 w-full sm:w-auto"
                    disabled={!canAdvance}
                    onClick={() => save(terminal)}
                    title={
                      canAdvance
                        ? undefined
                        : `Attach the signed scan${afterTheFact ? " + proof" : ""} first`
                    }
                  >
                    Mark as {terminal}
                  </Button>
                ) : null}
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* Lifecycle stepper — the record centerpiece */}
      {!isNew ? (
        <div className="solid rounded-(--r-solid) p-5">
          <Stepper steps={steps} />
          {!canAdvance && status === "Pending" ? (
            <p className="mt-3 border-t border-jce-line pt-3 text-ui-12 text-jce-ink-2">
              {afterTheFact
                ? "Attach the signed scan and the after-the-fact proof to record this."
                : "Attach the signed scan to reach " + terminal + "."}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Form details */}
      <Section title="Form details">
        <div className="grid gap-4 sm:grid-cols-2">
          {!isLoa ? (
            <Field label="Form number" required error={errors.no}>
              {isNew ? (
                <input
                  className="field"
                  value={draft.no}
                  onChange={(ev) => set("no", ev.target.value)}
                  placeholder={`${def.code} form no.`}
                  aria-invalid={errors.no ? true : undefined}
                />
              ) : (
                <div className="field flex items-center font-mono text-ui-13">
                  {record?.no}
                </div>
              )}
            </Field>
          ) : (
            <Field label="Internal ID">
              <div className="field flex items-center font-mono text-ui-13 text-jce-ink-2">
                {record?.no ?? "Auto-assigned on save"}
              </div>
            </Field>
          )}
          <Field label="Date filed" required error={errors.filed}>
            <input
              className="field"
              type="date"
              value={draft.filed}
              onChange={(ev) => set("filed", ev.target.value)}
              disabled={readOnly}
              aria-invalid={errors.filed ? true : undefined}
            />
          </Field>

          {kind === "ob" ? (
            <>
              <Field label="Reasons for leaving">
                <input
                  className="field"
                  value={draft.reasons}
                  onChange={(ev) => set("reasons", ev.target.value)}
                  disabled={readOnly}
                />
              </Field>
              <Field label="Project Name">
                <Select
                  value={draft.projectName}
                  onValueChange={(v) => set("projectName", v)}
                  disabled={readOnly}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECTS.map((p) => (
                      <SelectItem key={p.so} value={p.label}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Sales Order #">
                <Select
                  value={draft.salesOrderNo}
                  onValueChange={(v) => set("salesOrderNo", v)}
                  disabled={readOnly}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECTS.map((p) => (
                      <SelectItem key={p.so} value={p.so}>
                        {p.so} · {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Destination" required error={errors.destination}>
                <input
                  className="field"
                  value={draft.destination}
                  onChange={(ev) => set("destination", ev.target.value)}
                  disabled={readOnly}
                  aria-invalid={errors.destination ? true : undefined}
                />
              </Field>
              <Field
                label="Departure (date & time)"
                required
                error={errors.departAt}
              >
                <input
                  className="field"
                  type="datetime-local"
                  value={draft.departAt}
                  onChange={(ev) => set("departAt", ev.target.value)}
                  disabled={readOnly}
                  aria-invalid={errors.departAt ? true : undefined}
                />
              </Field>
              <Field
                label="Return (date & time)"
                required
                error={errors.returnAt}
              >
                <input
                  className="field"
                  type="datetime-local"
                  value={draft.returnAt}
                  onChange={(ev) => set("returnAt", ev.target.value)}
                  disabled={readOnly}
                  aria-invalid={errors.returnAt ? true : undefined}
                />
              </Field>
            </>
          ) : null}

          {kind === "ot" ? (
            <>
              <Field label="Section">
                <Select
                  value={draft.section}
                  onValueChange={(v) => set("section", v)}
                  disabled={readOnly}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Project">
                <Select
                  value={draft.project}
                  onValueChange={(v) => set("project", v)}
                  disabled={readOnly}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECTS.map((p) => (
                      <SelectItem key={p.so} value={p.label}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Date of overtime" required error={errors.otDate}>
                <input
                  className="field"
                  type="date"
                  value={draft.otDate}
                  onChange={(ev) => set("otDate", ev.target.value)}
                  disabled={readOnly}
                  aria-invalid={errors.otDate ? true : undefined}
                />
              </Field>
              <Field label="OT Type">
                <Select
                  value={draft.otType}
                  onValueChange={(v) => set("otType", v as Draft["otType"])}
                  disabled={readOnly}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OT_TYPES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field
                label="Overtime Request From / To"
                required
                error={errors.requestedFromTo}
              >
                <input
                  className="field"
                  value={draft.requestedFromTo}
                  onChange={(ev) => set("requestedFromTo", ev.target.value)}
                  placeholder="18:00 – 22:00"
                  disabled={readOnly}
                  aria-invalid={errors.requestedFromTo ? true : undefined}
                />
              </Field>
              <Field label="Actual Time From / To">
                <input
                  className="field"
                  value={draft.actualFromTo}
                  onChange={(ev) => set("actualFromTo", ev.target.value)}
                  placeholder="18:10 – 22:05"
                  disabled={readOnly}
                />
              </Field>
              <Field label="Reason for rendering overtime">
                <input
                  className="field"
                  value={draft.otReason}
                  onChange={(ev) => set("otReason", ev.target.value)}
                  disabled={readOnly}
                />
              </Field>
            </>
          ) : null}

          {kind === "rfl" ? (
            <>
              <Field label="Type of Leave">
                <Select
                  value={draft.rflLeaveType}
                  onValueChange={(v) =>
                    set("rflLeaveType", v as Draft["rflLeaveType"])
                  }
                  disabled={readOnly}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RFL_LEAVE.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              {draft.rflLeaveType === "Others" ? (
                <Field
                  label="Others — specify"
                  required
                  error={errors.othersSpecify}
                >
                  <input
                    className="field"
                    value={draft.othersSpecify}
                    onChange={(ev) => set("othersSpecify", ev.target.value)}
                    placeholder="e.g. Paternity, Bereavement"
                    disabled={readOnly}
                    aria-invalid={errors.othersSpecify ? true : undefined}
                  />
                </Field>
              ) : null}
              <Field label="Pay type">
                <Select
                  value={draft.payType}
                  onValueChange={(v) => set("payType", v as Draft["payType"])}
                  disabled={readOnly}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAY_TYPES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Request Type">
                <Select
                  value={draft.rflRequestType}
                  onValueChange={(v) =>
                    set("rflRequestType", v as Draft["rflRequestType"])
                  }
                  disabled={readOnly}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RFL_REQ.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <RangeFields
                draft={draft}
                set={set}
                readOnly={readOnly}
                computedDays={computedDays}
                errors={errors}
              />
            </>
          ) : null}

          {kind === "loa" ? (
            <>
              <Field label="Leave Type">
                <Select
                  value={draft.loaLeaveType}
                  onValueChange={(v) =>
                    set("loaLeaveType", v as Draft["loaLeaveType"])
                  }
                  disabled={readOnly}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOA_LEAVE.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Reason">
                <input
                  className="field"
                  value={draft.loaReason}
                  onChange={(ev) => set("loaReason", ev.target.value)}
                  disabled={readOnly}
                />
              </Field>
              <RangeFields
                draft={draft}
                set={set}
                readOnly={readOnly}
                computedDays={computedDays}
                errors={errors}
              />
            </>
          ) : null}
        </div>
      </Section>

      {/* Employees */}
      <Section
        title={isMulti ? "Employees on this form" : "Employee"}
        hint={
          isMulti
            ? "Name / position / assignment auto-populate from the employee database."
            : "Department & length of service auto-populate."
        }
        error={errors.employees}
      >
        {isMulti ? (
          <div className="flex flex-col gap-3">
            {!readOnly ? (
              <Select
                value={addPick}
                onValueChange={(v) => {
                  addEmployee(v);
                  setAddPick("");
                }}
              >
                <SelectTrigger className="min-h-11 w-full sm:w-80">
                  <SelectValue placeholder="Add employee…" />
                </SelectTrigger>
                <SelectContent>
                  {availableToAdd.map((e) => (
                    <SelectItem key={e.no} value={e.no}>
                      {e.name} · {e.no}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
            {draft.employees.length === 0 ? (
              <p className="text-ui-12 text-jce-ink-2">
                No employees added yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {draft.employees.map((e) => (
                  <div
                    key={e.no}
                    className="flex flex-col gap-1 rounded-(--r-input) border border-jce-line bg-card/60 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-jce-ink">
                        {e.name}{" "}
                        <span className="font-mono text-ui-12 text-jce-ink-2">
                          {e.no}
                        </span>
                      </div>
                      <div className="text-ui-12 text-jce-ink-2">
                        {e.pos} · {e.assign}
                      </div>
                    </div>
                    {!readOnly ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="min-h-11 self-start sm:self-auto"
                        onClick={() => removeEmployee(e.no)}
                        aria-label={`Remove ${e.name}`}
                      >
                        <XIcon className="size-4" aria-hidden /> Remove
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {!readOnly ? (
              <Select
                value={draft.employees[0]?.no ?? ""}
                onValueChange={pickSingle}
              >
                <SelectTrigger className="min-h-11 w-full sm:w-80">
                  <SelectValue placeholder="Select employee…" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYEES.map((e) => (
                    <SelectItem key={e.no} value={e.no}>
                      {e.name} · {e.no}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
            {draft.employees[0] ? (
              <SingleEmployeeCard emp={draft.employees[0]} />
            ) : (
              <p className="text-ui-12 text-jce-ink-2">No employee selected.</p>
            )}
          </div>
        )}
      </Section>

      {/* Signers — recorded for audit (names from the DB) */}
      <Section
        title="Signers (recorded for audit)"
        hint="Names are captured from the employee database for the audit trail; the print-only blocks below carry the offline wet signatures."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {draft.signers.map((s, i) => (
            <Field key={s.role} label={s.role}>
              {readOnly ? (
                <div className="field flex items-center text-ui-13">
                  {s.name ?? "—"}
                </div>
              ) : (
                <Select
                  value={s.empNo ?? ""}
                  onValueChange={(v) => setSigner(i, v)}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue placeholder="Select signer…" />
                  </SelectTrigger>
                  <SelectContent>
                    {signerOptions(s.role).length === 0 ? (
                      <SelectItem value="__none" disabled>
                        Add a form employee first
                      </SelectItem>
                    ) : (
                      signerOptions(s.role).map((e) => (
                        <SelectItem key={e.no} value={e.no}>
                          {e.name} · {e.no}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </Field>
          ))}
        </div>
        <div className="mt-2">
          <div className="kicker text-jce-ink-2">
            Print · offline wet signature
          </div>
          <PrintSignatureBlock
            signatories={draft.signers.map((s) => ({
              role: s.role,
              ...(s.name ? { name: s.name } : {}),
            }))}
          />
        </div>
      </Section>

      {/* Auto-create banner */}
      {autoLeave ? (
        <div className="flex items-start gap-2 rounded-(--r-solid) border border-(--st-success) bg-(--st-success-bg) px-4 py-3 text-ui-12 text-(--st-success-ink)">
          <span aria-hidden>✓</span>
          <span>
            On save this{" "}
            <strong>auto-creates a read-only Timekeeping row</strong> for each
            working day (excl. Sundays) in {draft.from || "From"} →{" "}
            {draft.to || "To"} — Leave Status “
            {isLoa
              ? "Leave Without Pay"
              : draft.payType === "Without Pay"
                ? "Leave Without Pay"
                : "Leave With Pay"}
            ”, zero distribution, source ref — flowing into H6 batches. No leave
            balances (recording-only). Re-saving never duplicates.
          </span>
        </div>
      ) : null}

      {/* Signed scan */}
      <Section title="Signed scan" error={errors.scan}>
        {baseScans.length > 0 ? (
          <FileList files={baseScans} />
        ) : (
          <p className="text-ui-12 text-jce-ink-2">
            No signed scan attached yet.
          </p>
        )}
        {!readOnly ? (
          <FileUploader
            key={`scan-${nonce}`}
            className="mt-3"
            required
            requiredLabel={`REQUIRED to reach ${terminal}`}
            accept="application/pdf,image/jpeg,image/png"
            onFilesChange={setScanCount}
          />
        ) : (
          <div className="mt-2 text-ui-13 text-jce-ink-2">
            {scanAttached ? (
              <Chip tone="success">attached</Chip>
            ) : (
              <Chip tone="pending">required</Chip>
            )}
          </div>
        )}
      </Section>

      {/* After-the-fact proof (RFL) */}
      {afterTheFact ? (
        <Section title="Proof / evidence" error={errors.proof}>
          {baseProof.length > 0 ? (
            <FileList files={baseProof} />
          ) : (
            <p className="text-ui-12 text-jce-ink-2">
              After-the-fact leave requires proof (e.g. medical certificate).
            </p>
          )}
          {!readOnly ? (
            <FileUploader
              key={`proof-${nonce}`}
              className="mt-3"
              required
              requiredLabel="Proof / evidence — REQUIRED for after-the-fact"
              accept="application/pdf,image/jpeg,image/png"
              onFilesChange={setProofCount}
            />
          ) : (
            <div className="mt-2 text-ui-13 text-jce-ink-2">
              {proofAttached ? (
                <Chip tone="success">attached</Chip>
              ) : (
                <Chip tone="pending">required</Chip>
              )}
            </div>
          )}
        </Section>
      ) : null}
    </div>
  );
}

// ---- leaf helpers ----------------------------------------------------------
function Section({
  title,
  hint,
  error,
  children,
}: {
  title: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="solid flex flex-col gap-3 rounded-(--r-solid) p-5">
      <div>
        <h2 className="text-ui-14 font-semibold text-jce-ink">{title}</h2>
        {hint ? (
          <p className="mt-0.5 text-ui-12 text-jce-ink-2">{hint}</p>
        ) : null}
      </div>
      {error ? (
        <p role="alert" className="text-ui-12 text-(--st-danger-ink)">
          {error}
        </p>
      ) : null}
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-ui-12 font-semibold text-jce-ink-2">
        {label}
        {required ? <span className="text-(--st-danger-ink)"> *</span> : null}
      </span>
      {children}
      {error ? (
        <p role="alert" className="text-ui-12 text-(--st-danger-ink)">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function RangeFields({
  draft,
  set,
  readOnly,
  computedDays,
  errors,
}: {
  draft: Draft;
  set: <K extends keyof Draft>(key: K, val: Draft[K]) => void;
  readOnly: boolean;
  computedDays: number;
  errors: Errors;
}) {
  const shownDays = draft.daysOverridden ? draft.days : String(computedDays);
  const differs =
    draft.daysOverridden && Number(draft.days || "0") !== computedDays;
  return (
    <>
      <Field label="From" required error={errors.from}>
        <input
          className="field"
          type="date"
          value={draft.from}
          onChange={(e) => set("from", e.target.value)}
          disabled={readOnly}
          aria-invalid={errors.from ? true : undefined}
        />
      </Field>
      <Field label="To" required error={errors.to}>
        <input
          className="field"
          type="date"
          value={draft.to}
          onChange={(e) => set("to", e.target.value)}
          disabled={readOnly}
          aria-invalid={errors.to ? true : undefined}
        />
      </Field>
      <Field label="No. of Days (working, excl. Sundays)">
        <input
          className="field font-mono tabular-nums"
          type="number"
          min={0}
          value={shownDays}
          onChange={(e) => {
            set("days", e.target.value);
            set("daysOverridden", true);
          }}
          disabled={readOnly}
        />
        <span className="text-ui-12 text-jce-ink-2">
          {differs
            ? `Override — differs from ${computedDays} computed working day${computedDays === 1 ? "" : "s"}.`
            : `Auto: ${computedDays} working day${computedDays === 1 ? "" : "s"} in range.`}
        </span>
      </Field>
    </>
  );
}

function SingleEmployeeCard({ emp }: { emp: ReqEmployee }) {
  const full = EMPLOYEES.find((e) => e.no === emp.no);
  return (
    <div className="grid gap-3 rounded-(--r-input) border border-jce-line bg-card/60 p-3 sm:grid-cols-2">
      <div>
        <div className="font-medium text-jce-ink">
          {emp.name}{" "}
          <span className="font-mono text-ui-12 text-jce-ink-2">{emp.no}</span>
        </div>
        <div className="text-ui-12 text-jce-ink-2">{emp.pos}</div>
      </div>
      <div className="text-ui-12 text-jce-ink-2">
        <div>
          Dept. / Assignment: <span className="text-jce-ink">{emp.assign}</span>
        </div>
        <div>
          Length of service:{" "}
          <span className="text-jce-ink">
            {full ? lengthOfService(full.hired) : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

function FileList({ files }: { files: readonly ReqFile[] }) {
  const mock = (verb: string, name: string) =>
    toast.message(`${verb} ${name}`, {
      description: "Mock — no real file bytes in the demo.",
    });
  return (
    <ul className="flex flex-col gap-1.5">
      {files.map((f, i) => (
        <li
          key={`${f.name}-${i}`}
          className="flex items-center justify-between gap-2 rounded-(--r-input) border border-jce-line bg-card/60 px-3 py-2"
        >
          <span className="min-w-0 truncate text-ui-12 text-jce-ink">
            {f.name}{" "}
            <span className="text-jce-ink-2 uppercase">· {f.kind}</span>
          </span>
          <span className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11"
              onClick={() => mock("Preview", f.name)}
              aria-label={`View ${f.name}`}
            >
              <EyeIcon className="size-4" aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11"
              onClick={() => mock("Download", f.name)}
              aria-label={`Download ${f.name}`}
            >
              <DownloadIcon className="size-4" aria-hidden />
            </Button>
          </span>
        </li>
      ))}
    </ul>
  );
}
