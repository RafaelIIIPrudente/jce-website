"use client";

import { useState } from "react";

import { peso, pmoney, ccyAmt, qn } from "@/lib/mock/format";
import { NOTIFICATIONS } from "@/lib/mock/shell";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  ApprovalQueueItem,
  AuditLog,
  type AuditEntry,
  BellFeed,
  ChartSurface,
  Chip,
  ComparisonMatrix,
  DocChip,
  EmptyState,
  EntryGrid,
  type EntryColumn,
  FieldComputed,
  FieldMasked,
  FileUploader,
  IdleWarningCard,
  KpiTile,
  LedgerGrid,
  type LedgerColumn,
  LockGateBanner,
  PageHeader,
  PhotoManager,
  Picker,
  PrintPreview,
  PrintSignatureBlock,
  ProgressTracker,
  Segmented,
  SignOffChain,
  Skeleton,
  Stepper,
  Timeline,
  Wizard,
} from "@/components/jce";

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------

function Section({
  no,
  title,
  desc,
  children,
}: {
  no: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-0">
      <div className="mb-5">
        <div className="font-mono text-[11px] font-semibold tracking-[0.16em] text-jce-green-600 uppercase">
          {no} · {title}
        </div>
        {desc ? (
          <p className="mt-2 max-w-[68ch] text-ui-14 text-jce-ink-2">{desc}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

const TAG_CLASS: Record<string, string> = {
  Glass: "bg-jce-green-700/10 text-jce-green-900 border-jce-green-700/20",
  Solid: "bg-[#EEF1EF] text-jce-ink border-jce-line",
  Print: "border-[#E4D9C4] bg-[#F4EFE7] text-[#6B5320]",
};

function DemoCard({
  label,
  tags = [],
  where,
  full,
  children,
}: {
  label: string;
  tags?: string[];
  where?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col", full && "lg:col-span-2")}>
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <span className="text-ui-14 font-semibold text-jce-ink">{label}</span>
        {tags.map((t) => (
          <span
            key={t}
            className={cn(
              "rounded-[5px] border px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wide uppercase",
              TAG_CLASS[t],
            )}
          >
            {t}
          </span>
        ))}
        {where ? (
          <span className="text-ui-12 text-jce-ink-2">— {where}</span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3 rounded-[14px] border border-white/60 bg-white/40 p-5 supports-backdrop-filter:backdrop-blur-[6px]">
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Token swatches
// ---------------------------------------------------------------------------

function Swatches({
  items,
}: {
  items: readonly { name: string; varName: string; hex: string; use: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((s) => (
        <div
          key={s.varName}
          className="overflow-hidden rounded-xl border border-jce-line bg-card"
        >
          <div className="h-16" style={{ background: `var(${s.varName})` }} />
          <div className="p-2.5">
            <div className="font-mono text-[11px] font-semibold text-jce-ink">
              {s.name}
            </div>
            <div className="font-mono text-[11px] text-jce-ink-2 uppercase">
              {s.hex}
            </div>
            <div className="mt-1 text-[11px] leading-snug text-jce-ink-2">
              {s.use}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const GREENS = [
  {
    name: "green-50",
    varName: "--jce-green-50",
    hex: "#EFFBEF",
    use: "Tinted panels · focused row",
  },
  {
    name: "green-100",
    varName: "--jce-green-100",
    hex: "#D4F1D3",
    use: "Tinted chips · highlights",
  },
  {
    name: "green-500",
    varName: "--jce-green-500",
    hex: "#5AB75C",
    use: "Success · positive deltas",
  },
  {
    name: "green-600",
    varName: "--jce-green-600",
    hex: "#23982F",
    use: "Hover/active · fills · ring",
  },
  {
    name: "green-700",
    varName: "--jce-green-700",
    hex: "#007817",
    use: "PRIMARY · logo-exact",
  },
] as const;

const ORANGES = [
  {
    name: "orange-100",
    varName: "--jce-orange-100",
    hex: "#FFDEC7",
    use: "Accent chips / tints",
  },
  {
    name: "orange-500",
    varName: "--jce-orange-500",
    hex: "#FA8838",
    use: "Accent hover · glow",
  },
  {
    name: "orange-600",
    varName: "--jce-orange-600",
    hex: "#DE6F11",
    use: "Accent · secondary CTA (not in logo)",
  },
] as const;

const NEUTRALS = [
  {
    name: "bg",
    varName: "--jce-bg",
    hex: "#F4F8F5",
    use: "Page backdrop base",
  },
  {
    name: "line",
    varName: "--jce-line",
    hex: "#E2EAE4",
    use: "Borders · table rules",
  },
  {
    name: "ink-2",
    varName: "--jce-ink-2",
    hex: "#4A5B51",
    use: "Secondary text · labels",
  },
  { name: "ink", varName: "--jce-ink", hex: "#0F1B14", use: "Primary text" },
  {
    name: "green-900",
    varName: "--jce-green-900",
    hex: "#013907",
    use: "Headings · active nav",
  },
] as const;

const STATUS = [
  {
    name: "success",
    varName: "--st-success",
    hex: "#16833B",
    use: "Approved · Paid",
  },
  {
    name: "pending",
    varName: "--st-pending",
    hex: "#C9760A",
    use: "Pending · For Checking",
  },
  {
    name: "danger",
    varName: "--st-danger",
    hex: "#C8341F",
    use: "Void · Overdue",
  },
  {
    name: "info",
    varName: "--st-info",
    hex: "#0E6FB8",
    use: "In Transit · Posted",
  },
  {
    name: "locked",
    varName: "--st-locked",
    hex: "#0F1B14",
    use: "Locked (+ glyph)",
  },
] as const;

// ---------------------------------------------------------------------------
// Sample data for the data-heavy components
// ---------------------------------------------------------------------------

type RegRow = {
  doc: string;
  desc: string;
  client: string;
  amount: number;
  tone: "info" | "success" | "pending" | "danger";
  status: string;
  date: string;
};

const REGISTER: RegRow[] = [
  {
    doc: "SO# 26-05-378",
    desc: "230KV Substation — Bulacan",
    client: "NGCP",
    amount: 13540000,
    tone: "info",
    status: "Ongoing",
    date: "05-12-2026",
  },
  {
    doc: "CV-0902",
    desc: "Progress billing #4",
    client: "NGCP",
    amount: 2410000,
    tone: "success",
    status: "Paid",
    date: "05-28-2026",
  },
  {
    doc: "CV-0903",
    desc: "Retention release",
    client: "Meralco",
    amount: 677000,
    tone: "pending",
    status: "Pending",
    date: "06-01-2026",
  },
  {
    doc: "CV-0888",
    desc: "Mobilization",
    client: "SMC Global",
    amount: -1700.68,
    tone: "danger",
    status: "Void",
    date: "04-19-2026",
  },
];

const REGISTER_COLS: LedgerColumn<RegRow>[] = [
  { id: "doc", header: "SO# / Doc", cell: (r) => <DocChip code={r.doc} /> },
  { id: "desc", header: "Description", cell: (r) => r.desc },
  { id: "client", header: "Client", cell: (r) => r.client },
  {
    id: "amount",
    header: "Amount",
    align: "right",
    cell: (r) => pmoney(r.amount),
  },
  {
    id: "status",
    header: "Status",
    cell: (r) => <Chip tone={r.tone}>{r.status}</Chip>,
  },
  { id: "date", header: "Date", cell: (r) => r.date },
];

type LedgerRow = {
  date: string;
  movement: string;
  doc?: string;
  inQty: number | null;
  outQty: number | null;
  balance: number;
};

const LEDGER: LedgerRow[] = [
  {
    date: "05-01",
    movement: "Opening",
    inQty: null,
    outQty: null,
    balance: 1200,
  },
  {
    date: "05-08",
    movement: "Goods receipt",
    doc: "MRR-0140",
    inQty: 800,
    outQty: null,
    balance: 2000,
  },
  {
    date: "05-15",
    movement: "Release",
    doc: "REL-0066",
    inQty: null,
    outQty: 540,
    balance: 1460,
  },
  {
    date: "05-22",
    movement: "Adjustment",
    inQty: null,
    outQty: 12,
    balance: 1448,
  },
];

const LEDGER_COLS: LedgerColumn<LedgerRow>[] = [
  { id: "date", header: "Date", cell: (r) => r.date },
  {
    id: "movement",
    header: "Movement",
    cell: (r) => (r.doc ? <DocChip code={r.doc} /> : r.movement),
  },
  {
    id: "in",
    header: "In",
    align: "right",
    cell: (r) => (r.inQty != null ? qn(r.inQty) : "—"),
  },
  {
    id: "out",
    header: "Out",
    align: "right",
    cell: (r) => (r.outQty != null ? `(${qn(r.outQty)})` : "—"),
  },
  {
    id: "balance",
    header: "Balance",
    align: "right",
    cell: (r) => <FieldComputed>{qn(r.balance)}</FieldComputed>,
  },
];

function hoursBetween(a: string, b: string): number {
  const parse = (s: string) => {
    const parts = s.split(":");
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    return (Number.isFinite(h) ? h : 0) + (Number.isFinite(m) ? m : 0) / 60;
  };
  const d = parse(b) - parse(a);
  return d > 0 ? d : 0;
}

const TK_ROWS: Record<string, string>[] = [
  { day: "Mon 18", project: "26-05-378", in: "08:00", out: "17:00" },
  { day: "Tue 19", project: "26-05-378", in: "08:00", out: "20:00" },
  { day: "Wed 20", project: "26-05-378", in: "08:00", out: "17:00" },
];

const TK_COLS: EntryColumn<Record<string, string>>[] = [
  { id: "day", header: "Day" },
  { id: "project", header: "Project" },
  {
    id: "in",
    header: "In",
    editable: true,
    align: "right",
    placeholder: "08:00",
  },
  {
    id: "out",
    header: "Out",
    editable: true,
    align: "right",
    placeholder: "17:00",
  },
  {
    id: "reg",
    header: "Reg",
    align: "right",
    compute: (r) =>
      Math.min(8, hoursBetween(r.in ?? "", r.out ?? "")).toFixed(1),
  },
  {
    id: "ot",
    header: "OT",
    align: "right",
    compute: (r) =>
      Math.max(0, hoursBetween(r.in ?? "", r.out ?? "") - 8).toFixed(1),
  },
];

const AUDIT: AuditEntry[] = [
  {
    ts: "2026-06-01 14:22",
    actor: "BDD Lead",
    record: "SO# 26-05-378",
    action: "Status change",
    before: "Pending",
    after: "Won",
  },
  {
    ts: "2026-05-28 09:10",
    actor: "BDD Staff",
    record: "OFR-2026-021",
    action: "Edit",
    before: "₱12.0M",
    after: "₱13.54M",
  },
  {
    ts: "2026-05-22 16:05",
    actor: "Warehouse",
    record: "MRR-2026-0144",
    action: "Lock",
    before: "For Checking",
    after: "Locked",
  },
];

// ---------------------------------------------------------------------------

export function FoundationsGallery() {
  const [entity, setEntity] = useState("jcepsi");
  const [scope, setScope] = useState("local");
  const [project, setProject] = useState<string | undefined>("26-05-378");
  const [confirmCommit, setConfirmCommit] = useState(false);

  return (
    <div className="mx-auto max-w-6xl pb-16">
      {/* Intro */}
      <div className="glass rounded-(--r-glass) p-6 md:p-8">
        <div className="font-mono text-[11px] font-semibold tracking-[0.14em] text-jce-ink-2 uppercase">
          JC Electrofields Power System, Inc. · Internal dashboard + public
          website
        </div>
        <h1 className="mt-3 max-w-[22ch] text-ui-36 leading-[1.1] font-bold tracking-tight text-jce-ink">
          One visual language.{" "}
          <span className="text-jce-green-700">Glass for chrome,</span>{" "}
          <span className="text-jce-orange-600">solid for content.</span>
        </h1>
        <p className="mt-4 max-w-[70ch] text-ui-16 text-jce-ink-2">
          A light, frosted-white interface over a soft luminous backdrop with a
          slow-drifting green &amp; orange glow. Framing and navigation are
          frosted glass; every data-dense surface — tables, ledgers, forms,
          registers, payslips — sits on high-contrast solid white. Maximum 3
          blurred layers per viewport; motion honours{" "}
          <code className="font-mono">prefers-reduced-motion</code>; text on
          glass meets WCAG AA. Tokens are swappable — brand hexes pending
          official JCE guidelines (OPEN-Q&nbsp;#1).
        </p>
      </div>

      {/* Palette */}
      <Section
        no="01"
        title="Palette — derived from the logo"
        desc="Green sampled from the JCE logo (#007817). The logo contains no orange — the accent is a harmonized proposal. Every colour routes through a CSS variable."
      >
        <div className="flex flex-col gap-5">
          <div>
            <SubHead>Green ramp · primary</SubHead>
            <Swatches items={GREENS} />
          </div>
          <div>
            <SubHead>Orange ramp · accent (not in logo)</SubHead>
            <Swatches items={ORANGES} />
          </div>
          <div>
            <SubHead>Neutrals &amp; ink</SubHead>
            <Swatches items={NEUTRALS} />
          </div>
          <div>
            <SubHead>Semantic / status</SubHead>
            <Swatches items={STATUS} />
          </div>
        </div>
      </Section>

      {/* Type */}
      <Section
        no="02"
        title="Type & numerals"
        desc="Inter for UI (handoff source of truth, OPEN-Q #1); JetBrains Mono for document numbers and money. Ledgers are tabular, right-aligned, ₱ with comma thousands and 2 dp; negatives in parentheses."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <DemoCard label="Type scale" tags={["Solid"]}>
            <div className="solid flex flex-col gap-1.5 p-4">
              <div className="text-ui-36 font-bold tracking-tight">
                36 · Display
              </div>
              <div className="text-ui-28 font-bold">28 · Page title</div>
              <div className="text-ui-22 font-semibold">22 · Section</div>
              <div className="text-ui-18 font-semibold">18 · Subsection</div>
              <div className="text-ui-16">16 · Lead body</div>
              <div className="text-ui-14">14 · Body (default)</div>
              <div className="text-ui-13 text-jce-ink-2">
                13 · Dense table text
              </div>
              <div className="text-ui-12 text-jce-ink-2">
                12 · Meta / caption
              </div>
            </div>
          </DemoCard>
          <DemoCard label="Numerals & money" tags={["Solid"]}>
            <LedgerGrid
              columns={[
                {
                  id: "acct",
                  header: "Account",
                  cell: (r: {
                    acct: string;
                    debit: number | null;
                    credit: number | null;
                  }) => r.acct,
                },
                {
                  id: "debit",
                  header: "Debit",
                  align: "right",
                  cell: (r) => (r.debit != null ? pmoney(r.debit) : "—"),
                },
                {
                  id: "credit",
                  header: "Credit",
                  align: "right",
                  cell: (r) => (r.credit != null ? pmoney(r.credit) : "—"),
                },
              ]}
              rows={[
                { acct: "Service Income", debit: null, credit: 13540000 },
                { acct: "Output VAT", debit: null, credit: 1624800 },
                { acct: "Retention Receivable", debit: 677000, credit: null },
                { acct: "Adjustment", debit: -1700.68, credit: null },
              ]}
            />
            <p className="text-ui-12 text-jce-ink-2">
              {ccyAmt(128500, "USD")} · {peso(4200000)} · amount-in-words on
              financial documents.
            </p>
          </DemoCard>
          <DemoCard
            label="Document-number chips"
            tags={["Solid"]}
            where="copyable, in every register & header"
            full
          >
            <div className="flex flex-wrap gap-2.5">
              {[
                "SO# 26-05-378",
                "CV-0902",
                "JV-2026-0188",
                "MRR-2026-0144",
                "REL-2026-0071",
                "PRQ-26-0210",
                "RFP-PUR-26020188",
                "BPO-2026-004",
              ].map((c) => (
                <DocChip key={c} code={c} />
              ))}
            </div>
          </DemoCard>
        </div>
      </Section>

      {/* Surfaces */}
      <Section
        no="03"
        title="Glass & solid recipes"
        desc="Two surface systems, one rule. Glass frames; solid carries data."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <DemoCard label="Glass chrome" tags={["Glass"]}>
            <div className="glass p-4">
              <div className="kicker">Section header</div>
              <div className="mt-1.5 font-semibold text-jce-ink">
                Frosted nav, top bars, cards, modals
              </div>
            </div>
          </DemoCard>
          <DemoCard label="Solid content" tags={["Solid"]}>
            <div className="solid p-4">
              <div className="kicker">Data surface</div>
              <div className="mt-1.5 font-semibold text-jce-ink">
                Tables, ledgers, forms, registers, payslips
              </div>
            </div>
          </DemoCard>
        </div>
      </Section>

      {/* Status + buttons */}
      <Section
        no="04"
        title="Status & actions"
        desc="Every lifecycle renders as a chip; error states carry a dot or glyph. Workflow verbs are distinct and conditionally rendered — absent (not disabled) for roles lacking them."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <DemoCard label="Status-chip vocabulary" tags={["Solid"]}>
            <div className="flex flex-wrap gap-2.5">
              <Chip tone="neutral">Draft</Chip>
              <Chip tone="pending">For Checking</Chip>
              <Chip tone="success">Approved</Chip>
              <Chip tone="success">Paid</Chip>
              <Chip tone="info">Posted</Chip>
              <Chip tone="info">In Transit</Chip>
              <Chip tone="locked">Locked</Chip>
              <Chip tone="danger">Void</Chip>
              <Chip tone="danger">Overdue</Chip>
            </div>
          </DemoCard>
          <DemoCard label="Buttons & workflow verbs" tags={["Solid"]}>
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="outline">Ghost</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="approve" size="sm">
                Approve
              </Button>
              <Button variant="post" size="sm">
                Post
              </Button>
              <Button variant="lock" size="sm">
                Lock
              </Button>
              <Button variant="outline" size="sm" disabled>
                Disabled (blocked state)
              </Button>
            </div>
            <p className="text-ui-12 text-jce-ink-2">
              Verb buttons are <em>absent</em> for roles without the verb —
              disabled only when a state blocks the action.
            </p>
          </DemoCard>
        </div>
      </Section>

      {/* Component library */}
      <Section
        no="05"
        title="Shared component library"
        desc="One library serves every dashboard module and the website. Each component is tagged Glass (chrome), Solid (content), or Print (paper artifact)."
      >
        <div className="grid gap-x-5 gap-y-8 lg:grid-cols-2">
          <DemoCard
            label="KPI / stat tile"
            tags={["Glass"]}
            where="X3, P1, U1, W1"
          >
            <div className="flex flex-wrap gap-3">
              <KpiTile
                className="min-w-44 flex-1"
                label="POs awaiting approval"
                value="12"
                delta="▲ 4 since Mon"
                tone="pending"
              />
              <KpiTile
                className="min-w-44 flex-1"
                label="Collections this week"
                value="₱2.41M"
                delta="▲ 18%"
                tone="success"
              />
            </div>
          </DemoCard>

          <DemoCard label="Page header" tags={["Glass"]}>
            <PageHeader
              kicker="Cross-cutting · X4"
              title="Notifications"
              actions={
                <Button variant="outline" size="sm">
                  Mark all read
                </Button>
              }
            />
          </DemoCard>

          <DemoCard
            label="Segmented / entity toggle"
            tags={["Glass"]}
            where="B3, B5, U2"
          >
            <Segmented
              value={entity}
              onValueChange={setEntity}
              options={[
                { value: "jcepsi", label: "JCEPSI" },
                { value: "jica", label: "JICA" },
              ]}
            />
            <Segmented
              value={scope}
              onValueChange={setScope}
              options={[
                { value: "local", label: "Local" },
                { value: "import", label: "Import" },
                { value: "all", label: "All" },
              ]}
            />
          </DemoCard>

          <DemoCard
            label="Picker — code + label"
            tags={["Solid"]}
            where="SO# / Employee / CoA"
          >
            <Picker
              value={project}
              onChange={setProject}
              placeholder="Working project…"
              options={[
                { code: "26-05-378", label: "230KV Substation — Bulacan" },
                { code: "26-04-355", label: "Transmission line — Cavite" },
                { code: "WORKSHOP", label: "Internal cost center" },
              ]}
            />
          </DemoCard>

          <DemoCard
            label="Data table / register"
            tags={["Solid"]}
            where="H1, A4/A7/A10, U2, W4, B1"
            full
          >
            <LedgerGrid
              columns={REGISTER_COLS}
              rows={REGISTER}
              getRowKey={(r) => r.doc}
            />
          </DemoCard>

          <DemoCard
            label="Ledger grid — running balance"
            tags={["Solid"]}
            where="W2, A3, P9"
          >
            <LedgerGrid
              columns={LEDGER_COLS}
              rows={LEDGER}
              getRowKey={(r) => r.date}
            />
          </DemoCard>

          <DemoCard
            label="Entry grid — keyboard cell editing"
            tags={["Solid"]}
            where="H5, P8, A16"
          >
            <EntryGrid
              columns={TK_COLS}
              initialRows={TK_ROWS}
              getRowKey={(r, i) => r.day ?? i}
            />
            <p className="text-ui-12 text-jce-ink-2">
              Edit In/Out (try the arrow keys). Reg &amp; OT are computed — the
              hatch marks them read-only.
            </p>
          </DemoCard>

          <DemoCard
            label="Computed & masked fields"
            tags={["Solid"]}
            where="all create/edit screens"
          >
            <div className="flex flex-col gap-2.5">
              <label className="text-ui-12 font-semibold text-jce-ink-2">
                Years of Service
                <span className="ml-1 font-normal">computed</span>
              </label>
              <FieldComputed>6.4 yrs</FieldComputed>
              <label className="mt-1.5 text-ui-12 font-semibold text-jce-ink-2">
                Daily Rate (Basic)
                <span className="ml-1 font-bold text-(--st-danger)">
                  SENSITIVE
                </span>
              </label>
              <FieldMasked length={6} />
            </div>
          </DemoCard>

          <DemoCard
            label="Stepper — 3-state lock gate"
            tags={["Glass", "Solid"]}
          >
            <div className="solid p-4">
              <Stepper
                steps={[
                  {
                    state: "done",
                    label: "Draft",
                    sub: "Created by Site Engineer",
                  },
                  {
                    state: "done",
                    label: "For Checking",
                    sub: "Submitted · awaiting Warehouse Admin",
                  },
                  {
                    state: "locked",
                    label: "Locked",
                    sub: "Immutable once locked",
                  },
                ]}
              />
            </div>
          </DemoCard>

          <DemoCard
            label="Progress tracker — 15-stage import"
            tags={["Glass", "Solid"]}
            where="U7"
          >
            <div className="solid p-4">
              <ProgressTracker
                total={15}
                current={6}
                statusLabel="In progress"
                stageLabel="Stage 6 — Bank endorsement · ETA 06-14"
                statusTone="pending"
              />
            </div>
          </DemoCard>

          <DemoCard
            label="Lock-gate banner"
            tags={["Solid"]}
            where="W4-W6, P8, A5"
          >
            <LockGateBanner
              state="draft"
              detail="Editable by Site Engineer · not yet submitted"
            />
            <LockGateBanner
              state="locked"
              detail="Posted by Warehouse Admin · read-only for all roles"
            />
          </DemoCard>

          <DemoCard
            label="Sign-off chain"
            tags={["Solid"]}
            where="on-screen status — wet signature on print"
          >
            <div className="solid p-4">
              <SignOffChain
                signoffs={[
                  { role: "Prepared", name: "Purchasing", status: "approved" },
                  { role: "Verified", name: "Supervisor", status: "current" },
                  { role: "Approved", name: "President", status: "pending" },
                ]}
              />
            </div>
          </DemoCard>

          <DemoCard
            label="Timeline / event feed"
            tags={["Solid"]}
            where="P12, B4, B6, History"
          >
            <div className="solid p-4">
              <Timeline
                events={[
                  {
                    title: "Selected as Winner",
                    meta: "BDD Lead · 06-01 14:22",
                    tone: "green",
                  },
                  {
                    title: "Contract Amount edited → ₱13.54M",
                    meta: "BDD Staff · 05-28 09:10",
                    tone: "orange",
                  },
                  {
                    title: "Offer issued (immutable)",
                    meta: "BDD Staff · 05-20 16:40",
                    tone: "ink",
                  },
                ]}
              />
            </div>
          </DemoCard>

          <DemoCard
            label="Approval queue item"
            tags={["Glass", "Solid"]}
            where="U12, X3"
          >
            <ApprovalQueueItem
              doc="RFP-PUR-26020188"
              title="Shenda Electric — transformer lot"
              meta="Stage 4 gate · waiting 2 days"
              amount="₱4.20M"
              actions={
                <>
                  <Button variant="approve" size="sm">
                    Approve
                  </Button>
                  <Button variant="outline" size="sm">
                    Hold
                  </Button>
                </>
              }
            />
          </DemoCard>

          <DemoCard
            label="Comparison matrix — best value"
            tags={["Solid"]}
            where="B6, U16"
          >
            <ComparisonMatrix
              columns={[
                { id: "shenda", label: "Shenda" },
                { id: "abb", label: "ABB", winner: true },
                { id: "schneider", label: "Schneider" },
              ]}
              rows={[
                {
                  label: "Unit price",
                  cells: [
                    { value: "142,000", align: "right" },
                    { value: "128,500", align: "right", best: true },
                    { value: "151,200", align: "right" },
                  ],
                },
                {
                  label: "Lead time",
                  cells: [
                    { value: "45 d" },
                    { value: "30 d", best: true },
                    { value: "60 d" },
                  ],
                },
              ]}
            />
          </DemoCard>

          <DemoCard
            label="Chart surface"
            tags={["Glass", "Solid"]}
            where="A18, U18, P16, W1"
          >
            <ChartSurface
              title="Collections — last 6 mo (₱M)"
              data={[
                { label: "Jan", value: 1.8 },
                { label: "Feb", value: 2.4 },
                { label: "Mar", value: 1.5 },
                { label: "Apr", value: 3.1 },
                { label: "May", value: 2.3, accent: true },
                { label: "Jun", value: 2.7 },
              ]}
            />
          </DemoCard>

          <DemoCard
            label="Chart surface — S-curve"
            tags={["Glass", "Solid"]}
            where="P16"
          >
            <ChartSurface
              variant="line"
              title="To-date accomplishment (%)"
              data={[
                { label: "P1", value: 8 },
                { label: "P2", value: 22 },
                { label: "P3", value: 41 },
                { label: "P4", value: 64 },
                { label: "P5", value: 82 },
                { label: "P6", value: 95 },
              ]}
              max={100}
            />
          </DemoCard>

          <DemoCard
            label="File uploader"
            tags={["Solid"]}
            where="HR scans, A14, W4, P8"
          >
            <FileUploader required />
          </DemoCard>

          <DemoCard label="Photo manager (×10)" tags={["Solid"]} where="P14">
            <PhotoManager />
          </DemoCard>

          <DemoCard
            label="Audit log — append-only"
            tags={["Solid"]}
            where="H14, P13, U13, W9, B11"
            full
          >
            <AuditLog entries={AUDIT} />
          </DemoCard>

          <DemoCard
            label="Wizard — guarded commit"
            tags={["Glass", "Solid"]}
            where="P3 BOQ wizard"
            full
          >
            <Wizard
              steps={[
                {
                  title: "Header",
                  description: "Project & client",
                  content: (
                    <p className="text-ui-13 text-jce-ink-2">
                      Choose the SO# and project header. (Demo step.)
                    </p>
                  ),
                },
                {
                  title: "Lines",
                  description: "BOQ lines",
                  content: (
                    <p className="text-ui-13 text-jce-ink-2">
                      Enter BOQ lines. (Demo step.)
                    </p>
                  ),
                },
                {
                  title: "Review & commit",
                  description: "Guarded",
                  canAdvance: confirmCommit,
                  content: (
                    <label className="flex items-center gap-2 text-ui-13 text-jce-ink">
                      <input
                        type="checkbox"
                        checked={confirmCommit}
                        onChange={(e) => setConfirmCommit(e.target.checked)}
                      />
                      I confirm the figures are correct (gates the commit).
                    </label>
                  ),
                },
              ]}
              commitLabel="Commit BOQ"
            />
          </DemoCard>

          <DemoCard
            label="Print preview + signature block"
            tags={["Print"]}
            where="A8/A9, U4 PO, A6, P8"
            full
          >
            <PrintPreview>
              <div className="flex items-start justify-between border-b-2 border-jce-ink pb-2">
                <div>
                  <div className="text-ui-13 font-extrabold tracking-wide">
                    JC ELECTROFIELDS POWER SYSTEM, INC.
                  </div>
                  <div className="text-[9px] text-jce-ink-2">
                    Valenzuela City · TIN 000-000-000-000
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">PURCHASE ORDER</div>
                  <div className="font-mono font-semibold">PO-IMP-26-0188</div>
                </div>
              </div>
              <table className="mt-2 w-full border-collapse text-[10px]">
                <thead>
                  <tr className="bg-[#eee]">
                    <th className="border border-[#999] px-1.5 py-1 text-left">
                      Qty
                    </th>
                    <th className="border border-[#999] px-1.5 py-1 text-left">
                      Description
                    </th>
                    <th className="border border-[#999] px-1.5 py-1 text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-[#999] px-1.5 py-1">2 set</td>
                    <td className="border border-[#999] px-1.5 py-1">
                      Power transformer 10MVA 69/13.8KV
                    </td>
                    <td className="border border-[#999] px-1.5 py-1 text-right font-mono tabular-nums">
                      {pmoney(4200000)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="border border-[#999] px-1.5 py-1 text-right font-bold"
                      colSpan={2}
                    >
                      TOTAL
                    </td>
                    <td className="border border-[#999] px-1.5 py-1 text-right font-mono font-bold tabular-nums">
                      {pmoney(4200000)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-1 text-[9px] italic">
                ***Four Million Two Hundred Thousand Pesos Only***
              </div>
              <PrintSignatureBlock
                signatories={[
                  { role: "Prepared by · Purchasing" },
                  { role: "Verified by · Supervisor" },
                  { role: "Approved by · President" },
                ]}
              />
            </PrintPreview>
          </DemoCard>

          <DemoCard label="Empty state" tags={["Glass"]} where="all lists">
            <EmptyState
              icon={<span className="text-2xl">◷</span>}
              title="All caught up"
              description="No requests waiting on you right now."
              action={<Button size="sm">New request</Button>}
            />
          </DemoCard>

          <DemoCard label="Skeleton loaders" tags={["Solid"]}>
            <div className="solid flex flex-col gap-2 p-4">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-4/5" />
            </div>
          </DemoCard>

          <DemoCard
            label="Bell feed"
            tags={["Glass", "Solid"]}
            where="top-bar popover, X4"
          >
            <div className="glass-modal rounded-(--r-glass) p-3">
              <BellFeed
                notifications={NOTIFICATIONS}
                onMarkAllRead={() => {}}
                onOpenAll={() => {}}
              />
            </div>
          </DemoCard>

          <DemoCard
            label="Idle-timeout modal"
            tags={["Glass"]}
            where="X1 · 30-min NFR-SEC-03"
          >
            <IdleWarningCard
              seconds={60}
              onStay={() => {}}
              onSignOut={() => {}}
            />
          </DemoCard>

          <DemoCard
            label="Tooltip · Avatar · Progress"
            tags={["Glass", "Solid"]}
          >
            <div className="flex flex-wrap items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    Hover me
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Computed — derived, read-only.</TooltipContent>
              </Tooltip>
              <Avatar>
                <AvatarFallback>JC</AvatarFallback>
              </Avatar>
              <div className="w-40">
                <Progress value={64} />
                <div className="mt-1 text-ui-12 text-jce-ink-2">
                  64% to-date
                </div>
              </div>
            </div>
          </DemoCard>
        </div>
      </Section>

      <p className="mt-12 text-center text-ui-12 text-jce-ink-2">
        JCE System — Part 0 Foundations · palette derived from the logo, pending
        official JCE brand guidelines.
      </p>
    </div>
  );
}

function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 font-mono text-[11px] font-semibold tracking-[0.14em] text-jce-ink-2 uppercase">
      {children}
    </div>
  );
}
