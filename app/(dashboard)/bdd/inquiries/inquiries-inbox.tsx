"use client";

import { useState } from "react";
import { MailIcon } from "lucide-react";
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
import { Segmented } from "@/components/jce/segmented";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { EmptyState } from "@/components/jce/empty-state";

// B10 · Inquiries inbox (bdd-flagships.jsx:133-191, brief:1090-1096). Reads the
// SHARED lib/mock/inquiries.ts store, so website S8 submissions appear here.
// Status workflow + "Create Offer from Inquiry" (prefills a draft offer + auto
// back-links). The offers store wiring is PROPOSED — we set the back-link + ref.

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
      <dt className="text-[11px] tracking-[0.14em] text-jce-ink-2 uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 text-ui-13 text-jce-ink">
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
  const [selectedId, setSelectedId] = useState<string | null>(
    () => getInquiries()[0]?.id ?? null,
  );

  const refresh = () => setItems(getInquiries());

  const filtered = items.filter((i) => filter === "All" || i.status === filter);
  const selected = items.find((i) => i.id === selectedId) ?? null;

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

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="BDD · B10"
        title="Inquiries"
        description="Website form submissions + manually-logged leads — qualify, reply, convert."
      />
      <Segmented
        aria-label="Filter by status"
        options={FILTERS.map((f) => ({ value: f, label: f }))}
        value={filter}
        onValueChange={setFilter}
      />

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        {/* Master list */}
        <div className="solid max-h-[calc(100dvh-18rem)] divide-y divide-jce-line overflow-auto rounded-(--r-solid) p-0">
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={
                  <MailIcon className="size-7" strokeWidth={1.5} aria-hidden />
                }
                title="No inquiries"
                description="Nothing matches this filter."
              />
            </div>
          ) : (
            filtered.map((i) => {
              const active = i.id === selectedId;
              return (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => setSelectedId(i.id)}
                  className={cn(
                    "focus-ring-jce block w-full px-4 py-3 text-left transition-colors",
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
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-jce-ink-2">
                    <span className="font-mono">{i.date}</span> · {i.source}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="solid flex flex-col gap-5 rounded-(--r-solid) p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-ui-18 font-bold text-jce-ink">
                    {selected.name}
                  </h2>
                  <Chip tone={INQ_TONE[selected.status] ?? "neutral"}>
                    {selected.status}
                  </Chip>
                </div>
                <p className="mt-0.5 text-ui-13 text-jce-ink-2">
                  {selected.company} · {selected.source} · {selected.date}
                </p>
              </div>
              {!readOnly ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={selected.status}
                    onValueChange={(v) =>
                      setStatus(selected.id, v as InquiryStatus)
                    }
                  >
                    <SelectTrigger className="h-9 w-36">
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
                    size="sm"
                    disabled={!!selected.linkedOffer}
                    onClick={() => createOffer(selected)}
                  >
                    {selected.linkedOffer
                      ? "Offer linked"
                      : "Create Offer from Inquiry"}
                  </Button>
                </div>
              ) : null}
            </div>

            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
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
              <dt className="text-[11px] tracking-[0.14em] text-jce-ink-2 uppercase">
                Subject
              </dt>
              <dd className="mt-0.5 text-ui-14 font-medium text-jce-ink">
                {selected.subject}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.14em] text-jce-ink-2 uppercase">
                Message
              </dt>
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
          <div className="glass rounded-(--r-glass) p-6">
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
