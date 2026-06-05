"use client";

import { useState } from "react";
import { ChevronLeftIcon, MailIcon, SearchIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { ROLES, canEdit } from "@/lib/rbac";
import { INQ_TONE } from "@/lib/mock/bdd";
import {
  getInquiries,
  updateInquiry,
  type Inquiry,
  type InquiryStatus,
} from "@/lib/mock/inquiries";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/jce/page-header";
import { KpiTile } from "@/components/jce/kpi-tile";
import { Segmented } from "@/components/jce/segmented";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";

// B10 · Inquiries inbox (bdd-flagships.jsx:133-191, brief:1090-1096). Reads the
// SHARED lib/mock/inquiries.ts store, so website S8 submissions appear here.
// Status workflow + "Create Offer from Inquiry" (prefills a draft offer + auto
// back-links). The offers store wiring is PROPOSED — we set the back-link + ref.
// Premium tier: lead-pipeline KPI strip + search toolbar + master-detail panes
// that collapse to a single-pane list⇄detail flow on mobile. See CLAUDE.md
// "Dashboard UI Standard".

const STATUS_OPTIONS: InquiryStatus[] = [
  "New",
  "In Review",
  "Replied",
  "Closed",
  "Spam",
];
const FILTERS = ["All", "New", "In Review", "Replied", "Spam"] as const;

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="kicker">{label}</dt>
      <dd className="mt-0.5 text-ui-13 wrap-break-word text-jce-ink">
        {value && value !== "—" ? (
          value
        ) : (
          <span className="text-jce-ink-2">—</span>
        )}
      </dd>
    </div>
  );
}

export function InquiriesInbox() {
  const { role } = useJce();
  const readOnly = !canEdit(role, "bdd");

  const [items, setItems] = useState<readonly Inquiry[]>(() => getInquiries());
  const [filter, setFilter] = useState<string>("All");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    () => getInquiries()[0]?.id ?? null,
  );
  // Mobile single-pane flow: false = master list, true = detail view.
  const [mobileDetail, setMobileDetail] = useState(false);

  const refresh = () => setItems(getInquiries());

  // Lead-pipeline KPIs — derived from the whole store (not the filtered view) so
  // a new website submission and any status/conversion change track immediately.
  const newCount = items.filter((i) => i.status === "New").length;
  const inReview = items.filter((i) => i.status === "In Review").length;
  const converted = items.filter((i) => i.linkedOffer).length;
  const total = items.length;

  // Status filter AND search (name / company / subject / email).
  const filtered = items
    .filter((i) => filter === "All" || i.status === filter)
    .filter((i) =>
      (i.name + i.company + i.subject + i.email)
        .toLowerCase()
        .includes(q.toLowerCase()),
    );

  // Keep a sane selection: the chosen lead if still visible, else the first of
  // the filtered set, else none. The list highlight tracks the shown detail.
  const selected =
    filtered.find((i) => i.id === selectedId) ?? filtered[0] ?? null;
  const activeId = selected?.id ?? null;

  const onFilter = (v: string) => {
    setFilter(v);
    setMobileDetail(false); // re-querying returns to the list on mobile
  };
  const onSearch = (v: string) => {
    setQ(v);
    setMobileDetail(false);
  };
  const clearSearch = () => {
    setQ("");
    setMobileDetail(false);
  };
  const openLead = (id: string) => {
    setSelectedId(id);
    setMobileDetail(true); // swap to the detail pane on mobile
  };

  const setStatus = (id: string, status: InquiryStatus) => {
    updateInquiry(id, { status });
    refresh();
  };

  const createOffer = (inq: Inquiry) => {
    const code =
      inq.company
        .replace(/[^A-Za-z]/g, "")
        .slice(0, 3)
        .toUpperCase() || "GEN";
    const tail = (inq.id.replace(/\D/g, "").slice(-3) || "001").padStart(
      3,
      "0",
    );
    const ref = `${code}-26-${tail}`;
    updateInquiry(inq.id, {
      linkedOffer: ref,
      status: inq.status === "New" ? "In Review" : inq.status,
      assigned:
        inq.assigned && inq.assigned !== "—" ? inq.assigned : ROLES[role].short,
    });
    refresh();
    toast.success(
      `Draft offer ${ref} created — Subject “${inq.subject}”, Client “${inq.company}” prefilled and back-linked.`,
    );
  };

  // Single-pane control: only swap to the detail pane on mobile once a lead is
  // open (desktop always shows both panes via the lg grid).
  const showDetail = mobileDetail && selected != null;

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="BDD · B10"
        title="Inquiries"
        description="Website form submissions + manually-logged leads — qualify, reply, convert."
      />

      {/* Lead-pipeline KPI strip — derived live from the shared store */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          label="New"
          value={newCount}
          delta="needs attention"
          tone="info"
        />
        <KpiTile
          label="In review"
          value={inReview}
          delta="qualifying"
          tone="pending"
        />
        <KpiTile
          label="Converted"
          value={converted}
          delta="offer linked"
          tone="success"
        />
        <KpiTile
          label="Total leads"
          value={total}
          delta="all sources"
          tone="neutral"
        />
      </div>

      {/* Toolbar — search + status filter (≥44px search; stacks full-width) */}
      <div className="flex flex-col gap-3">
        <div className="flex h-11 w-full items-center gap-2 rounded-(--r-input) border border-jce-line bg-white/70 px-3 transition-colors focus-within:border-jce-green-600 focus-within:shadow-(--focus-ring) sm:max-w-sm">
          <SearchIcon className="size-4 shrink-0 text-jce-ink-2" aria-hidden />
          <input
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search name, company, subject, email…"
            aria-label="Search inquiries"
            className="h-full w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
          />
        </div>
        {/* 5 statuses — scroll horizontally on a phone, never push the page wide */}
        <div className="-mx-1 overflow-x-auto px-1">
          <Segmented
            aria-label="Filter by status"
            options={FILTERS.map((f) => ({ value: f, label: f }))}
            value={filter}
            onValueChange={onFilter}
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[360px_1fr] 2xl:grid-cols-[420px_1fr]">
        {/* Master list */}
        <div
          className={cn(
            "solid divide-y divide-jce-line overflow-auto rounded-(--r-solid) p-0 lg:max-h-[calc(100dvh-20rem)]",
            showDetail && "hidden lg:block",
          )}
        >
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={
                  <MailIcon className="size-7" strokeWidth={1.5} aria-hidden />
                }
                title={q ? "No inquiries match your search" : "No inquiries"}
                description={
                  q
                    ? "Try a different name, company, subject, or email keyword."
                    : "Nothing matches this filter."
                }
                action={
                  q ? (
                    <Button variant="outline" size="sm" onClick={clearSearch}>
                      Clear search
                    </Button>
                  ) : undefined
                }
              />
            </div>
          ) : (
            filtered.map((i) => {
              const active = i.id === activeId;
              return (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => openLead(i.id)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "focus-ring-jce block min-h-11 w-full px-4 py-3 text-left transition-colors",
                    active ? "bg-jce-green-50" : "hover:bg-jce-green-50/60",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-ui-13 font-semibold text-jce-ink">
                      {i.name}
                    </span>
                    <Chip tone={INQ_TONE[i.status] ?? "neutral"}>
                      {i.status}
                    </Chip>
                  </div>
                  <div className="mt-0.5 truncate text-ui-12 text-jce-ink-2">
                    {i.company}
                  </div>
                  <div className="mt-1 truncate text-ui-12 text-jce-ink">
                    {i.subject}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-ui-12 text-jce-ink-2">
                    <span className="font-mono">{i.date}</span> · {i.source}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detail */}
        {selected ? (
          <div
            className={cn(
              "solid flex flex-col gap-5 rounded-(--r-solid) p-5",
              !showDetail && "hidden lg:flex",
            )}
          >
            {/* Mobile back-to-inbox */}
            <button
              type="button"
              onClick={() => setMobileDetail(false)}
              className="focus-ring-jce inline-flex min-h-11 w-fit items-center gap-1 rounded text-ui-13 text-jce-ink-2 transition-colors hover:text-jce-green-900 lg:hidden"
            >
              <ChevronLeftIcon className="size-4" aria-hidden /> Inbox
            </button>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-ui-18 font-bold text-jce-ink">
                    {selected.name}
                  </h2>
                  <Chip tone={INQ_TONE[selected.status] ?? "neutral"}>
                    {selected.status}
                  </Chip>
                </div>
                <p className="mt-0.5 text-ui-13 text-jce-ink">
                  {selected.company}
                </p>
                <p className="mt-0.5 text-ui-13 text-jce-ink-2">
                  {selected.source} · {selected.date} ·{" "}
                  {selected.assigned && selected.assigned !== "—"
                    ? `assigned ${selected.assigned}`
                    : "unassigned"}
                </p>
              </div>
              {!readOnly ? (
                <div className="flex flex-col gap-2 sm:shrink-0 sm:flex-row sm:items-center">
                  <Select
                    value={selected.status}
                    onValueChange={(v) =>
                      setStatus(selected.id, v as InquiryStatus)
                    }
                  >
                    <SelectTrigger
                      aria-label="Inquiry status"
                      className="min-h-11 w-full sm:w-40"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    disabled={!!selected.linkedOffer}
                    onClick={() => createOffer(selected)}
                    className="min-h-11 w-full sm:w-auto"
                  >
                    {selected.linkedOffer
                      ? "Offer linked"
                      : "Create Offer from Inquiry"}
                  </Button>
                </div>
              ) : null}
            </div>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Position" value={selected.position} />
              <Field label="Industry" value={selected.industry} />
              <Field label="Email" value={selected.email} />
              <Field label="Phone" value={selected.phone} />
              <Field label="Inquiry Type" value={selected.type} />
              <Field
                label="Project Location"
                value={selected.projectLocation}
              />
              <Field label="Estimated Timeline" value={selected.timeline} />
              <Field label="Budget Range" value={selected.budget} />
              <Field label="How did you hear" value={selected.heard} />
              <Field label="Assigned To" value={selected.assigned} />
            </dl>

            <div>
              <dt className="kicker">Subject</dt>
              <dd className="mt-0.5 text-ui-14 font-medium text-pretty text-jce-ink">
                {selected.subject}
              </dd>
            </div>
            <div>
              <dt className="kicker">Message</dt>
              <dd className="mt-1 text-ui-13 text-pretty text-jce-ink">
                {selected.message}
              </dd>
            </div>

            <div className="flex flex-wrap items-center gap-4 border-t border-jce-line pt-4 text-ui-13">
              <span className="text-jce-ink-2">Linked Offer:</span>
              {selected.linkedOffer ? (
                <DocChip code={selected.linkedOffer} />
              ) : (
                <span className="text-jce-ink-2">—</span>
              )}
            </div>
          </div>
        ) : (
          <div className="glass hidden rounded-(--r-glass) p-6 lg:block">
            <EmptyState
              icon={
                <MailIcon className="size-7" strokeWidth={1.5} aria-hidden />
              }
              title="Select an inquiry"
              description="Choose a lead from the list to see its detail."
            />
          </div>
        )}
      </div>
    </div>
  );
}
