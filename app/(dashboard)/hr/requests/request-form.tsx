"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import {
  PROJECTS,
  REQ_TONE,
  SIGNERS,
  addLeaveRow,
  nextLeaveRef,
  typeByLabel,
  type RequestRecord,
  type RequestTypeLabel,
} from "@/lib/mock/hr";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { FieldComputed } from "@/components/jce/field-computed";
import { FileUploader } from "@/components/jce/file-uploader";
import { PrintSignatureBlock } from "@/components/jce/print-signature-block";
import { Stepper, type Step } from "@/components/jce/stepper";

// H8–H11 · Request forms (hr-requests.jsx:224). One component adapts per type.
// Approvals are OFFLINE wet signatures: print-only signatory blocks (render-only)
// + a REQUIRED scanned-copy uploader that gates Pending → Approved/Recorded.
// RFL/LOA auto-create read-only timekeeping rows on save (recording-only — no
// leave balances). Verbs are role-scoped: employees submit → Pending; HR records.

function Field({
  label,
  computed,
  children,
}: {
  label: string;
  computed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
        {label}
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

const FORM_PLACEHOLDER: Record<RequestTypeLabel, string> = {
  "OB/Travel": "OB-2026-001",
  Overtime: "OT FORM NO. 2026-001",
  "Request for Leave": "RFL-26-001",
  "LOA Without Pay": "LOA-WP-2026-001",
};

export function RequestForm({
  type,
  record,
  onBack,
}: {
  type: RequestTypeLabel;
  record?: RequestRecord;
  onBack?: () => void;
}) {
  const { role } = useJce();
  const selfMode = role === "employee";
  const canManage = role === "hrhead" || role === "owner";
  const readOnly = !selfMode && !canManage;

  const def = typeByLabel(type);
  const isNew = !record;

  const [status, setStatus] = useState<RequestRecord["status"]>(
    record?.status ?? "Pending",
  );
  const [filed, setFiled] = useState(!isNew);
  const [scanAttached, setScanAttached] = useState(record?.scan ?? false);
  const onScan = useCallback((n: number) => setScanAttached(n > 0), []);

  if (!def) return null;
  const terminal = def.terminal;

  const fileRequest = () => {
    setFiled(true);
    if (def.autoLeave) {
      const ref = nextLeaveRef(type);
      addLeaveRow({
        date: "2026-06-02",
        leave:
          type === "LOA Without Pay" ? "Leave Without Pay" : "Leave With Pay",
        leaveRef: ref,
        remarks: `Auto from ${type === "LOA Without Pay" ? "LOA" : "RFL"}`,
      });
      toast.success(
        `Filed — Pending. Auto-created a 🔒 read-only timekeeping row (${ref}) in H5.`,
      );
    } else {
      toast.success("Filed — Pending. Attach the signed scan to advance.");
    }
  };

  const advance = () => {
    if (!scanAttached) return;
    setStatus(terminal);
    toast.success(`Signed scan recorded — status ${terminal}.`);
  };

  const steps: Step[] = [
    {
      label: "Filed",
      sub: record?.filed ?? "2026-06-03",
      state: filed ? "done" : "current",
    },
    {
      label: "Signed scan uploaded",
      state: scanAttached ? "done" : filed ? "current" : "todo",
    },
    {
      label: terminal,
      state: status === terminal ? "done" : "todo",
    },
  ];

  const backHref = selfMode ? "/my-hr" : "/hr/requests";

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
        >
          <ChevronLeftIcon className="size-4" aria-hidden /> Back
        </button>
      ) : (
        <Link
          href={backHref}
          className="focus-ring-jce inline-flex w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900"
        >
          <ChevronLeftIcon className="size-4" aria-hidden /> Back
        </Link>
      )}

      <PageHeader
        kicker={`HR · ${def.code}`}
        title={
          <span className="flex flex-wrap items-center gap-2">
            {type}
            {!isNew && record ? <DocChip code={record.no} /> : null}
          </span>
        }
        actions={
          <>
            {!isNew ? (
              <Chip tone={REQ_TONE[status] ?? "neutral"}>{status}</Chip>
            ) : null}
            {readOnly ? (
              <Chip tone="neutral">Read-only</Chip>
            ) : !filed ? (
              <Button size="sm" onClick={fileRequest}>
                {selfMode ? "Submit → Pending" : "Save Pending"}
              </Button>
            ) : status === "Pending" && canManage ? (
              <Button size="sm" onClick={advance} disabled={!scanAttached}>
                Mark as {terminal}
              </Button>
            ) : null}
          </>
        }
      />

      {filed ? (
        <div className="solid rounded-(--r-solid) p-5">
          <Stepper steps={steps} />
          {status === "Pending" && selfMode ? (
            <p className="mt-3 border-t border-jce-line pt-3 text-ui-12 text-jce-ink-2">
              Submitted. HR records this once the offline-signed scan is
              attached.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="solid flex flex-col gap-5 rounded-(--r-solid) p-5">
        <div>
          <h2 className="text-ui-14 font-semibold text-jce-ink">
            Form details
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Form number">
              <input
                className="field"
                defaultValue={isNew ? "" : record?.no}
                placeholder={FORM_PLACEHOLDER[type]}
              />
            </Field>
            <Field label="Date filed">
              <input
                className="field"
                type="date"
                defaultValue={isNew ? "2026-06-03" : record?.filed}
              />
            </Field>

            {type === "OB/Travel" ? (
              <>
                <Field label="Reasons for leaving">
                  <input className="field" />
                </Field>
                <Field label="Project Name">
                  <select className="field">
                    {PROJECTS.map((p) => (
                      <option key={p.so}>{p.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Sales Order #">
                  <select className="field">
                    {PROJECTS.map((p) => (
                      <option key={p.so}>
                        {p.so} · {p.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Destination">
                  <input className="field" />
                </Field>
                <Field label="Departure (date & time)">
                  <input className="field" type="datetime-local" />
                </Field>
                <Field label="Return (date & time)">
                  <input className="field" type="datetime-local" />
                </Field>
              </>
            ) : null}

            {type === "Overtime" ? (
              <>
                <Field label="Section">
                  <select className="field">
                    <option>Servicing</option>
                    <option>Shop / Office</option>
                    <option>Project site</option>
                  </select>
                </Field>
                <Field label="Project">
                  <select className="field">
                    {PROJECTS.map((p) => (
                      <option key={p.so}>{p.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Date of overtime">
                  <input className="field" type="date" />
                </Field>
                <Field label="OT Type">
                  <select className="field">
                    <option>Pre-approved</option>
                    <option>After-the-fact</option>
                  </select>
                </Field>
                <Field label="Overtime Request From / To">
                  <input className="field" placeholder="18:00 – 22:00" />
                </Field>
                <Field label="Actual Time From / To">
                  <input className="field" placeholder="18:10 – 22:05" />
                </Field>
                <Field label="Reason for rendering overtime">
                  <input className="field" />
                </Field>
              </>
            ) : null}

            {type === "Request for Leave" ? (
              <>
                <Field label="Employee">
                  <input
                    className="field"
                    defaultValue={record?.emp}
                    placeholder="auto: Name, Position, Dept., Length of Service"
                  />
                </Field>
                <Field label="Type of Leave">
                  <select className="field">
                    <option>Vacation Leave</option>
                    <option>Sick Leave</option>
                    <option>Others (specify)</option>
                  </select>
                </Field>
                <Field label="Pay type">
                  <select className="field">
                    <option>With Pay</option>
                    <option>Without Pay</option>
                  </select>
                </Field>
                <Field label="Applied Period From / To">
                  <input
                    className="field"
                    placeholder="2026-06-10 – 2026-06-12"
                  />
                </Field>
                <Field label="Leave Category (No. of Days)" computed>
                  <div className="computed field flex items-center">
                    <FieldComputed>
                      auto: working days excl. Sundays — editable
                    </FieldComputed>
                  </div>
                </Field>
                <Field label="Request Type">
                  <select className="field">
                    <option>Pre-approved</option>
                    <option>After-the-fact (needs proof)</option>
                  </select>
                </Field>
              </>
            ) : null}

            {type === "LOA Without Pay" ? (
              <>
                <Field label="Internal ID">
                  <input className="field" placeholder="LOA-WP-2026-001" />
                </Field>
                <Field label="Employee">
                  <input
                    className="field"
                    defaultValue={record?.emp}
                    placeholder="Position auto-fills"
                  />
                </Field>
                <Field label="Date of Absence From / To">
                  <input
                    className="field"
                    placeholder="2026-06-15 – 2026-06-19"
                  />
                </Field>
                <Field label="No. of Days" computed>
                  <div className="computed field flex items-center">
                    <FieldComputed>
                      auto working days — override allowed
                    </FieldComputed>
                  </div>
                </Field>
                <Field label="Leave Type">
                  <select className="field">
                    <option>Vacation</option>
                    <option>Sick</option>
                    <option>Paternity</option>
                    <option>Maternity</option>
                    <option>Others</option>
                  </select>
                </Field>
                <Field label="Reason">
                  <input className="field" />
                </Field>
              </>
            ) : null}
          </div>
        </div>

        {type === "OB/Travel" || type === "Overtime" ? (
          <div>
            <h2 className="text-ui-14 font-semibold text-jce-ink">
              Employees on this form{" "}
              <span className="text-ui-12 font-normal text-jce-ink-2">
                (name / position auto-populate)
              </span>
            </h2>
            <div className="mt-3 overflow-hidden rounded-(--r-solid) border border-jce-line">
              <table className="jtable">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Place of Assignment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>N. Bautista</td>
                    <td>Lineman</td>
                    <td>26-05-378 · 13.2KV Distribution Line</td>
                  </tr>
                  <tr>
                    <td>A. Tolentino</td>
                    <td>Lineman</td>
                    <td>25-11-290 · Solar Farm Tarlac 5MWp</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-ui-12 text-jce-ink-2">
              {type === "OB/Travel"
                ? "Shared form-level fields are one team / one trip — not per row. OB does not auto-create timekeeping rows."
                : "OT does not auto-create timekeeping rows; each employee signs their own row on paper."}
            </p>
          </div>
        ) : null}

        {def.autoLeave ? (
          <div className="flex items-start gap-2 rounded-(--r-solid) border border-(--st-success) bg-(--st-success-bg) px-4 py-3 text-ui-12 text-(--st-success-ink)">
            <span aria-hidden>✓</span>
            <span>
              On save this <strong>auto-creates Timekeeping rows</strong> for
              each working day in range — Leave Status “
              {type === "LOA Without Pay"
                ? "Leave Without Pay"
                : "Leave With Pay / Without Pay"}
              ”, distribution zeros, source{" "}
              {type === "LOA Without Pay" ? "LOA" : "RFL"} reference — flowing
              into H6 batches. No leave balances (recording-only).
            </span>
          </div>
        ) : null}

        {!readOnly ? (
          <div>
            <h2 className="text-ui-14 font-semibold text-jce-ink">
              Signed scan
            </h2>
            <FileUploader
              className="mt-3"
              required
              requiredLabel={`REQUIRED to reach ${terminal}`}
              onFilesChange={onScan}
            />
          </div>
        ) : (
          <div className="text-ui-13 text-jce-ink-2">
            Signed scan:{" "}
            {scanAttached ? (
              <Chip tone="success">attached</Chip>
            ) : (
              <Chip tone="pending">required</Chip>
            )}
          </div>
        )}

        <div>
          <h2 className="flex flex-wrap items-center gap-2 text-ui-14 font-semibold text-jce-ink">
            Signatories
            <span className="rounded bg-(--table-zebra) px-2 py-0.5 text-[10px] font-semibold text-jce-ink-2">
              print-only · offline wet signature
            </span>
          </h2>
          <PrintSignatureBlock
            signatories={SIGNERS[type].map((r) => ({ role: r }))}
          />
        </div>
      </div>
    </div>
  );
}
