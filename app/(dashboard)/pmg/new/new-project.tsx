"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckIcon,
  ChevronLeftIcon,
  CheckCircle2Icon,
  CopyIcon,
  PencilRulerIcon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { CONTRACT, boqRows } from "@/lib/mock/pmg";
import { peso, pmoney } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { Segmented } from "@/components/jce/segmented";
import { FileUploader } from "@/components/jce/file-uploader";

const WIZ_STEPS = [
  "Upload",
  ".xlsx Sheet",
  "Confirm header",
  "Column mapping",
  "Row preview",
  "Commit",
];

const MAPPINGS: readonly [string, string, "high" | "low"][] = [
  ["ITEM", "Item No.", "high"],
  ["DESCRIPTION", "Description", "high"],
  ["QTY.", "Quantity", "high"],
  ["UNIT", "Unit", "high"],
  ["UNIT PRICE", "Unit Price", "high"],
  ["TOTAL", "Line Total", "low"],
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-ui-12 font-semibold text-jce-ink-2">
      {label}
      {children}
    </label>
  );
}

function Wizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [mapOk, setMapOk] = useState(false);
  const blockNext = step === 3 && !mapOk;

  const back = () => {
    if (step === 0) router.push("/pmg/portfolio");
    else setStep((s) => s - 1);
  };
  const commit = () => {
    toast.success(
      "Project committed — BOQ + opening period PB1 created (mock).",
    );
    router.push("/pmg/portfolio");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="glass rounded-(--r-glass) p-5">
        <div className="kicker">PMG · P3 · New project</div>
        <h2 className="mt-1 text-ui-22 font-bold tracking-tight text-jce-ink">
          BOQ import wizard
        </h2>
        <ol className="mt-4 flex flex-wrap items-center gap-1">
          {WIZ_STEPS.map((s, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={s} className="flex items-center gap-1">
                <span
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-ui-12 font-semibold",
                    done && "bg-jce-green-100 text-jce-green-900",
                    current && "bg-jce-green-700 text-primary-foreground",
                    !done && !current && "bg-(--table-zebra) text-jce-ink-2",
                  )}
                >
                  <span className="grid size-4 place-items-center rounded-full bg-card/40 text-[10px]">
                    {done ? (
                      <CheckIcon
                        className="size-3"
                        strokeWidth={3}
                        aria-hidden
                      />
                    ) : (
                      i + 1
                    )}
                  </span>
                  {s}
                </span>
                {i < WIZ_STEPS.length - 1 ? (
                  <span className="h-px w-4 shrink-0 bg-jce-line" aria-hidden />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="solid rounded-(--r-solid) p-5">
        {step === 0 ? (
          <div className="flex flex-col gap-3">
            <FileUploader
              label="Drop the PM head's BOQ spreadsheet (.xlsx)"
              hint="Never a silent auto-parse — you confirm every step before commit."
            />
            <div className="flex items-center gap-2 rounded-(--r-input) border border-jce-line bg-card px-3 py-2 text-ui-13">
              <span aria-hidden>📄</span> NORECO2_BOQ_v3.xlsx · 84 KB{" "}
              <Chip tone="success" className="ml-auto">
                ready
              </Chip>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="flex flex-col gap-2">
            <h3 className="text-ui-14 font-semibold text-jce-ink">
              Select sheet{" "}
              <span className="font-normal text-jce-ink-2">
                (default: first / largest)
              </span>
            </h3>
            {[
              ["BOQ (used)", "325 rows"],
              ["Summary", ""],
              ["Notes", ""],
            ].map(([s, badge], i) => (
              <label
                key={s}
                className="flex items-center gap-2 rounded-(--r-input) border border-jce-line px-3 py-2 text-ui-13"
              >
                <input
                  type="radio"
                  name="sheet"
                  defaultChecked={i === 0}
                  className="accent-jce-green-700"
                />
                {s}
                {badge ? (
                  <Chip tone="info" className="ml-2">
                    {badge}
                  </Chip>
                ) : null}
              </label>
            ))}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="flex flex-col gap-4">
            <h3 className="text-ui-14 font-semibold text-jce-ink">
              Confirm project header
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Project title">
                <input
                  className="field"
                  defaultValue="NORECO II — 13.2KV Distribution Line"
                />
              </Field>
              <Field label="Client / Cooperative">
                <input className="field" defaultValue="NORECO II" />
              </Field>
              <Field label="Location">
                <input className="field" defaultValue="Negros Oriental" />
              </Field>
              <Field label="SO / Contract No.">
                <input className="field" defaultValue="26-05-378" />
              </Field>
              <Field label="Contract amount">
                <div className="computed field flex items-center font-mono tabular-nums">
                  {peso(CONTRACT)}
                </div>
              </Field>
              <Field label="Start date">
                <input
                  className="field"
                  type="date"
                  defaultValue="2026-03-15"
                />
              </Field>
              <Field label="DP recoupment %">
                <input className="field" defaultValue="15" />
              </Field>
              <Field label="Retention %">
                <input className="field" defaultValue="10" />
              </Field>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="flex flex-col gap-3">
            <h3 className="text-ui-14 font-semibold text-jce-ink">
              Column mapping{" "}
              <span className="font-normal text-jce-ink-2">
                low-confidence mappings block commit until confirmed
              </span>
            </h3>
            <div className="overflow-auto rounded-(--r-input) border border-jce-line">
              <table className="jtable">
                <thead>
                  <tr>
                    <th>Source column</th>
                    <th>→ System field</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {MAPPINGS.map(([src, fld, conf]) => (
                    <tr key={src}>
                      <td className="font-mono">{src}</td>
                      <td>
                        <select className="field h-8 w-40" defaultValue={fld}>
                          <option>{fld}</option>
                          <option>(ignore)</option>
                        </select>
                      </td>
                      <td>
                        <Chip tone={conf === "high" ? "success" : "pending"}>
                          {conf === "high" ? "high" : "low — confirm"}
                        </Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <label className="flex items-center gap-2 text-ui-13 text-jce-ink">
              <input
                type="checkbox"
                checked={mapOk}
                onChange={(e) => setMapOk(e.target.checked)}
                className="accent-jce-green-700"
              />
              I&rsquo;ve confirmed the low-confidence “TOTAL → Line Total”
              mapping
            </label>
            {!mapOk ? (
              <p className="text-ui-12 text-(--st-pending-ink)">
                Commit is blocked until the low-confidence mapping is confirmed.
              </p>
            ) : null}
          </div>
        ) : null}

        {step === 4 ? (
          <div className="flex flex-col gap-3">
            <h3 className="text-ui-14 font-semibold text-jce-ink">
              Row preview
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["5", "lines"],
                ["3", "staged (P/D/I)"],
                [peso(CONTRACT), "grand total"],
                ["PB1", "opening period"],
              ].map(([v, k]) => (
                <div key={k} className="solid rounded-(--r-input) p-3">
                  <div className="font-mono text-ui-16 font-bold tabular-nums text-jce-ink">
                    {v}
                  </div>
                  <div className="text-ui-12 text-jce-ink-2">{k}</div>
                </div>
              ))}
            </div>
            <div className="overflow-auto rounded-(--r-input) border border-jce-line">
              <table className="jtable">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th className="text-right">Amount</th>
                    <th className="text-right">Weight %</th>
                  </tr>
                </thead>
                <tbody>
                  {boqRows().map((r) => (
                    <tr key={r.key}>
                      <td className="font-mono">{r.no}</td>
                      <td>
                        {r.desc}
                        {r.stage ? (
                          <span className="ml-1.5 rounded bg-jce-green-50 px-1 py-0.5 text-[9px] font-semibold text-jce-green-700">
                            {r.stage}
                          </span>
                        ) : null}
                      </td>
                      <td>{r.stage ? "Staged" : "Single"}</td>
                      <td className="num">{pmoney(r.value)}</td>
                      <td className="num computed">
                        {pmoney((r.value / CONTRACT) * 100)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="rounded-(--r-input) bg-jce-green-50 px-3 py-2 text-ui-12 text-jce-green-900">
              Acceptance anchor — grand total reproduces{" "}
              <strong>{peso(CONTRACT)}</strong> and per-line weights within
              rounding.
            </p>
          </div>
        ) : null}

        {step === 5 ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2Icon
              className="size-10 text-jce-green-700"
              strokeWidth={1.5}
              aria-hidden
            />
            <div className="text-ui-16 font-semibold text-jce-ink">
              Ready to commit
            </div>
            <p className="max-w-[44ch] text-ui-13 text-jce-ink-2">
              Nothing has persisted until now. Committing creates the project,
              BOQ and opening period PB1.
            </p>
            <Button onClick={commit}>Commit project</Button>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={back}>
          <ChevronLeftIcon data-icon="inline-start" />
          {step === 0 ? "Discard & exit" : "Back"}
        </Button>
        {step < 5 ? (
          <Button
            size="sm"
            onClick={() => setStep((s) => Math.min(5, s + 1))}
            disabled={blockNext}
          >
            {blockNext ? "Confirm mapping to continue" : "Continue →"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function CloneManual() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="glass flex flex-col gap-2 rounded-(--r-glass) p-5">
        <span className="grid size-10 place-items-center rounded-[10px] bg-jce-green-50 text-jce-green-700">
          <CopyIcon className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="mt-1 text-ui-16 font-semibold text-jce-ink">
          Clone existing project
        </div>
        <p className="text-ui-12 text-jce-ink-2">
          Copy a BOQ structure → edit header / quantities / prices. The clone is
          an INDEPENDENT copy of its source.
        </p>
        <Button variant="ghost" size="sm" className="mt-1 w-fit">
          Pick source →
        </Button>
      </div>
      <div className="glass flex flex-col gap-2 rounded-(--r-glass) p-5">
        <span className="grid size-10 place-items-center rounded-[10px] bg-jce-green-50 text-jce-green-700">
          <PencilRulerIcon className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="mt-1 text-ui-16 font-semibold text-jce-ink">
          Manual builder
        </div>
        <p className="text-ui-12 text-jce-ink-2">
          Header form → add category → add line. Staged lines need all three
          P/D/I amounts; weights recompute live, never typed.
        </p>
        <Button variant="ghost" size="sm" className="mt-1 w-fit">
          Start blank →
        </Button>
      </div>
    </div>
  );
}

export function NewProject() {
  const { role } = useJce();
  const canCreate = canEdit(role, "pmg");
  const [mode, setMode] = useState("wizard");

  if (!canCreate) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <PageHeader kicker="PMG · P3 / P4" title="New project" />
        <div className="glass rounded-(--r-glass) px-6 py-10 text-center">
          <div className="text-ui-14 font-semibold text-jce-ink">Read-only</div>
          <div className="mt-1 text-ui-12 text-jce-ink-2">
            Only the PM Head / Owner can create projects.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <Segmented
        aria-label="New project mode"
        value={mode}
        onValueChange={setMode}
        options={[
          { value: "wizard", label: "BOQ import · P3" },
          { value: "manual", label: "Clone / Manual · P4" },
        ]}
      />
      {mode === "wizard" ? <Wizard /> : <CloneManual />}
    </div>
  );
}
