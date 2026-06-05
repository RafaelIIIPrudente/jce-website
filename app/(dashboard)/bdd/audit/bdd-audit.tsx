"use client";

import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  ShieldAlertIcon,
} from "lucide-react";

import {
  BDD_AUDIT,
  BDD_AUDIT_AREAS,
  getBddLog,
  type BddAuditEntry,
} from "@/lib/mock/bdd";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AuditLog,
  type AuditEntry,
  Chip,
  EmptyState,
  KpiTile,
  PageHeader,
  Segmented,
} from "@/components/jce";

// B11 · BDD audit log (bdd-core.jsx, brief:1098-1104). Append-only, read-only.
// Reads getBddLog() — this-session live edits (incl. Website-CMS changes),
// newest-first, on top of the frozen BDD_AUDIT seed — then filters by area,
// searches across the row text, and paginates. This is the register-tier chrome
// (KPI strip → toolbar → grid → pager) over the shared AuditLog; the data,
// ordering, and read-only/append-only nature are never mutated here.

const PAGE_SIZE = 8;
const SENSITIVE = "(sensitive)";

/** A delta carrying the "(sensitive)" sentinel marks a protected figure/winner. */
function isSensitive(a: BddAuditEntry): boolean {
  return a.delta.includes(SENSITIVE);
}

/** Map a raw BDD entry → shared AuditLog row, splitting "before → after" on the
 *  first arrow (delta may carry extra "→" or none) and surfacing a non-colour-only
 *  Chip + lock glyph for sensitive changes. */
function toAuditEntry(a: BddAuditEntry): AuditEntry {
  let before: string | undefined;
  let afterText: string;
  if (a.delta.includes("→")) {
    const [b, ...rest] = a.delta.split("→");
    before = (b ?? "").trim() || undefined;
    afterText = rest.join("→").trim();
  } else {
    before = a.field;
    afterText = a.delta;
  }
  // The Chip carries the "sensitive" meaning — strip the literal sentinel text.
  const cleanedAfter = afterText.replace(SENSITIVE, "").trim();

  const after = isSensitive(a) ? (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span>{cleanedAfter}</span>
      <Chip tone="locked">Sensitive</Chip>
    </span>
  ) : (
    cleanedAfter
  );

  return {
    ts: a.ts,
    actor: a.user,
    record: a.rec,
    action: `${a.area} · ${a.action}`,
    before,
    after,
  };
}

/** Searchable haystack for a row — record / actor / action / before→after. */
function haystack(a: BddAuditEntry): string {
  return `${a.rec} ${a.user} ${a.area} ${a.action} ${a.field} ${a.delta}`.toLowerCase();
}

export function BddAudit() {
  // Snapshot at mount — getBddLog() already returns this-session live edits
  // (newest-first) on top of the frozen seed, so a Website-CMS save lands on top
  // and is counted by the strip below the moment this screen is opened.
  const [log] = useState<readonly BddAuditEntry[]>(() => getBddLog());

  const [area, setArea] = useState<string>("All");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  // KPI summary — derived live from the WHOLE log (not the filtered view) so the
  // strip always summarises the full register and tracks this-session edits.
  const total = log.length;
  const sensitiveCount = log.filter(isSensitive).length;
  const sessionCount = Math.max(0, log.length - BDD_AUDIT.length);
  const areasActive = new Set(log.map((a) => a.area)).size;

  // Area-change and search-change both reset to page 1.
  const onArea = (v: string) => {
    setArea(v);
    setPage(1);
  };
  const onSearch = (v: string) => {
    setQ(v);
    setPage(1);
  };
  const clearFilters = () => {
    setArea("All");
    setQ("");
    setPage(1);
  };

  const needle = q.trim().toLowerCase();
  const isSearching = needle !== "";
  const isFiltering = area !== "All";

  const filtered = log.filter(
    (a) =>
      (area === "All" || a.area === area) &&
      (needle === "" || haystack(a).includes(needle)),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages); // clamp when filters shrink the list
  const pageEntries: AuditEntry[] = filtered
    .slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
    .map(toAuditEntry);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="BDD · B11"
        title="Audit log"
        description="Append-only, read-only — every action across the BDD module, oldest changes preserved."
      />

      {/* KPI summary strip — derived live from the full log (tracks session edits) */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          label="Total events"
          value={total}
          delta="all areas"
          tone="neutral"
        />
        <KpiTile
          label="Sensitive changes"
          value={sensitiveCount}
          delta="flagged for review"
          tone="danger"
        />
        <KpiTile
          label="This session"
          value={sessionCount}
          delta={sessionCount === 1 ? "live edit" : "live edits"}
          tone="info"
        />
        <KpiTile
          label="Areas active"
          value={areasActive}
          delta="distinct areas"
          tone="neutral"
        />
      </div>

      {/* Toolbar — search + area filter (read-only log: no create action) */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex h-11 w-full items-center gap-2 rounded-(--r-input) border border-jce-line bg-white/70 px-3 transition-colors focus-within:border-jce-green-600 focus-within:shadow-(--focus-ring) lg:max-w-sm">
          <SearchIcon className="size-4 shrink-0 text-jce-ink-2" aria-hidden />
          <input
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search record, actor, action, change…"
            aria-label="Search audit events"
            className="h-full w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
          />
        </div>

        {/* Area filter — full-width Select on touch/small screens, Segmented on
            desktop (the 9 options exceed phone/tablet widths). */}
        <div className="w-full lg:w-auto">
          <div className="lg:hidden">
            <Select value={area} onValueChange={onArea}>
              <SelectTrigger
                aria-label="Filter by area"
                className="min-h-11 w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BDD_AUDIT_AREAS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="hidden overflow-x-auto lg:block">
            <Segmented
              aria-label="Filter by area"
              options={BDD_AUDIT_AREAS.map((a) => ({ value: a, label: a }))}
              value={area}
              onValueChange={onArea}
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-(--r-glass) p-6">
          <EmptyState
            icon={
              isSearching ? (
                <SearchIcon className="size-7" strokeWidth={1.5} aria-hidden />
              ) : (
                <ShieldAlertIcon
                  className="size-7"
                  strokeWidth={1.5}
                  aria-hidden
                />
              )
            }
            title={
              isSearching
                ? "No events match your search"
                : "No events in this area"
            }
            description={
              isSearching
                ? "Try a different record, actor, action, or change keyword."
                : "Choose a different area, or clear the filter to see the whole log."
            }
            action={
              isSearching || isFiltering ? (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <>
          <AuditLog
            entries={pageEntries}
            stickyFirstColumn
            className="max-h-[calc(100dvh-22rem)]"
          />
          {/* Standard pager — keeps a large future log usable; newest-first kept */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-ui-12 text-jce-ink-2">
              Page {safePage} of {totalPages} · {filtered.length}{" "}
              {filtered.length === 1 ? "event" : "events"}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="focus-ring-jce min-h-11"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeftIcon aria-hidden /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="focus-ring-jce min-h-11"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRightIcon aria-hidden />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
