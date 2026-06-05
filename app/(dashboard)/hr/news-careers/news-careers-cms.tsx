"use client";

import { useState } from "react";
import {
  BriefcaseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ImageIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { ROLES, canEdit, type RoleId } from "@/lib/rbac";
import {
  addCmsCareer,
  addCmsNews,
  appendBddAudit,
  bddNow,
  getCmsCareers,
  getCmsNews,
  updateCmsCareer,
  updateCmsNews,
  WEB_STATUS_OPTIONS,
  WEB_STATUS_TONE,
  type CmsCareer,
  type CmsNews,
  type WebStatus,
} from "@/lib/mock/bdd";
import { type ProjectImage } from "@/lib/content/projects";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/jce/page-header";
import { KpiTile } from "@/components/jce/kpi-tile";
import { Chip } from "@/components/jce/chip";
import { EmptyState } from "@/components/jce/empty-state";
import {
  PhotoManager,
  type ManagedPhoto,
} from "@/components/jce/photo-manager";

// HR · News & Careers CMS — manages the public site's News posts + Careers
// openings (≤10 photos each). MIRRORS the BDD Website CMS (B7–B9): same KPI strip,
// toolbar, card rows, pager, and right-side Sheet drawer; the only differences are
// the two record types. Edit-with-audit (appends to the website audit / B11); live
// write-back to lib/content is PROPOSED — edits persist only in-session.

type CmsKind = "news" | "career";
type SavedRef = { kind: CmsKind; key: string };

const KIND_LABEL: Record<CmsKind, string> = { news: "news", career: "career" };
const PAGE_SIZE = 8;
const CAREER_TYPES = [
  "Full-time",
  "Project-based",
  "Part-time",
  "Contract",
] as const;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// ---- photo mapping: record photos (ProjectImage[] + coverIndex) ↔ ManagedPhoto[]
function toManaged(
  photos: readonly ProjectImage[],
  coverIndex = 0,
): ManagedPhoto[] {
  return photos.map((p, i) => ({ caption: p.alt, cover: i === coverIndex }));
}
function fromManaged(items: readonly ManagedPhoto[]): {
  photos: ProjectImage[];
  coverIndex: number;
} {
  const ci = items.findIndex((p) => p.cover);
  return {
    photos: items.map((p) => ({
      src: "",
      alt: p.caption,
      width: 0,
      height: 0,
    })),
    coverIndex: ci < 0 ? 0 : ci,
  };
}

function StatusControl({
  status,
  readOnly,
  onChange,
}: {
  status: WebStatus;
  readOnly: boolean;
  onChange: (s: WebStatus) => void;
}) {
  if (readOnly) return <Chip tone={WEB_STATUS_TONE[status]}>{status}</Chip>;
  return (
    <Select value={status} onValueChange={(v) => onChange(v as WebStatus)}>
      <SelectTrigger className="min-h-11 w-full sm:w-40" aria-label="Status">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {WEB_STATUS_OPTIONS.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Field({
  label,
  htmlFor,
  error,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-ui-12 font-semibold text-jce-ink-2"
      >
        {label}
        {required ? <span className="text-(--st-danger-ink)"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-ui-12 text-(--st-danger-ink)">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function pageForRecord(kind: CmsKind, key: string): number {
  const idx =
    kind === "news"
      ? getCmsNews().findIndex((n) => n.slug === key)
      : getCmsCareers().findIndex((c) => c.slug === key);
  return idx < 0 ? 1 : Math.floor(idx / PAGE_SIZE) + 1;
}

// ===========================================================================

export function NewsCareersCms() {
  const { role } = useJce();
  const readOnly = !canEdit(role, "hr");

  const [tab, setTab] = useState<CmsKind>("news");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [news, setNews] = useState<readonly CmsNews[]>(() => getCmsNews());
  const [careers, setCareers] = useState<readonly CmsCareer[]>(() =>
    getCmsCareers(),
  );
  const refreshAll = () => {
    setNews([...getCmsNews()]);
    setCareers([...getCmsCareers()]);
  };

  const [drawer, setDrawer] = useState<DrawerState | null>(null);

  const audit = (
    area: string,
    action: string,
    rec: string,
    field: string,
    delta: string,
  ) =>
    appendBddAudit({
      ts: bddNow(),
      user: ROLES[role].short,
      area,
      action,
      rec,
      field,
      delta,
    });

  const setNewsStatus = (n: CmsNews, status: WebStatus) => {
    if (status === n.status) return;
    updateCmsNews(n.slug, { status });
    audit(
      "Website News",
      "Status Change",
      n.slug,
      "Status",
      `${n.status} → ${status}`,
    );
    refreshAll();
    toast.success(`${n.title} → ${status}`);
  };
  const setCareerStatus = (c: CmsCareer, status: WebStatus) => {
    if (status === c.status) return;
    updateCmsCareer(c.slug, { status });
    audit(
      "Website Careers",
      "Status Change",
      c.slug,
      "Status",
      `${c.status} → ${status}`,
    );
    refreshAll();
    toast.success(`${c.title} → ${status}`);
  };

  const match = (title: string) =>
    title.toLowerCase().includes(q.toLowerCase());
  const fNews = news.filter((n) => match(n.title));
  const fCareers = careers.filter((c) => match(c.title));

  const activeCount = tab === "news" ? fNews.length : fCareers.length;
  const totalPages = Math.max(1, Math.ceil(activeCount / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = safePage * PAGE_SIZE;
  const pageNews = fNews.slice(start, end);
  const pageCareers = fCareers.slice(start, end);

  // Publish-state KPI strip — derived live across BOTH stores.
  const statuses: readonly WebStatus[] = [
    ...news.map((r) => r.status),
    ...careers.map((r) => r.status),
  ];
  const liveCount = statuses.filter((s) => s === "Published").length;
  const draftCount = statuses.filter((s) => s === "Draft").length;
  const hiddenCount = statuses.filter((s) => s === "Hidden").length;
  const totalCount = statuses.length;

  const onSearch = (v: string) => {
    setQ(v);
    setPage(1);
  };
  const clearSearch = () => {
    setQ("");
    setPage(1);
  };
  const onTab = (v: string) => {
    setTab(v as CmsKind);
    setQ("");
    setPage(1);
  };

  return (
    <div className="mx-auto flex max-w-app flex-col gap-5">
      <PageHeader
        kicker="HR · News & Careers"
        title="News & Careers"
        description="Manage the public site's announcements and job openings — Published records target the live News & Careers pages (SRS §9.2). Edits persist in-session; live write-back is mocked / PROPOSED."
      />

      {/* Publish-state KPI strip — live across news + careers */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          label="Live on site"
          value={liveCount}
          delta="published & visible"
          tone="success"
        />
        <KpiTile
          label="Drafts"
          value={draftCount}
          delta="not yet live"
          tone="pending"
        />
        <KpiTile
          label="Hidden"
          value={hiddenCount}
          delta="withheld from site"
          tone="neutral"
        />
        <KpiTile
          label="Total records"
          value={totalCount}
          delta={`${news.length} news · ${careers.length} careers`}
          tone="info"
        />
      </div>

      {/* Toolbar — search + tab-aware primary action (44px control heights) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex h-11 w-full max-w-sm items-center gap-2 rounded-(--r-input) border border-jce-line bg-white/70 px-3 transition-colors focus-within:border-jce-green-600 focus-within:shadow-(--focus-ring)">
          <SearchIcon className="size-4 shrink-0 text-jce-ink-2" aria-hidden />
          <input
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={`Search ${KIND_LABEL[tab]} by title…`}
            aria-label="Search News & Careers by title"
            className="h-full w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
          />
        </div>
        {!readOnly ? (
          <Button
            onClick={() => setDrawer({ mode: "add", kind: tab })}
            className="min-h-11 w-full sm:w-auto"
          >
            <PlusIcon aria-hidden /> Add {KIND_LABEL[tab]}
          </Button>
        ) : null}
      </div>

      <p className="text-ui-12 text-jce-ink-2">
        <Chip tone="success">Published</Chip> shows on the public site ·{" "}
        <Chip tone="pending">Draft</Chip> and <Chip tone="neutral">Hidden</Chip>{" "}
        stay off it. Photos are placeholders (no upload) — public cover render
        is a follow-up.
      </p>

      <Tabs value={tab} onValueChange={onTab} className="gap-4">
        <TabsList className="h-auto w-full sm:w-fit">
          <TabsTrigger value="news" className="min-h-11">
            News ({news.length})
          </TabsTrigger>
          <TabsTrigger value="career" className="min-h-11">
            Careers ({careers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news">
          {fNews.length === 0 ? (
            <ListEmpty
              searching={q !== ""}
              onClear={clearSearch}
              noun="news post"
            />
          ) : (
            <div className="flex flex-col gap-3">
              {pageNews.map((n) => (
                <NewsRow
                  key={n.slug}
                  n={n}
                  readOnly={readOnly}
                  onStatus={setNewsStatus}
                  onEdit={() =>
                    setDrawer({ mode: "edit", kind: "news", record: n })
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="career">
          {fCareers.length === 0 ? (
            <ListEmpty
              searching={q !== ""}
              onClear={clearSearch}
              noun="opening"
            />
          ) : (
            <div className="flex flex-col gap-3">
              {pageCareers.map((c) => (
                <CareerRow
                  key={c.slug}
                  c={c}
                  readOnly={readOnly}
                  onStatus={setCareerStatus}
                  onEdit={() =>
                    setDrawer({ mode: "edit", kind: "career", record: c })
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {activeCount > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-ui-12 text-jce-ink-2">
            Page {safePage} of {totalPages} · {activeCount} {KIND_LABEL[tab]}
            {activeCount === 1 ? "" : "s"}
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
      ) : null}

      <Sheet open={drawer != null} onOpenChange={(o) => !o && setDrawer(null)}>
        <SheetContent
          side="right"
          className="w-full gap-0 border-jce-line bg-background sm:max-w-xl"
        >
          {drawer ? (
            <RecordDrawer
              key={`${drawer.kind}-${drawer.mode}-${
                drawer.mode === "edit" ? drawer.record.slug : "new"
              }`}
              state={drawer}
              readOnly={readOnly}
              role={role}
              onClose={() => setDrawer(null)}
              onSaved={(saved) => {
                refreshAll();
                setDrawer(null);
                setTab(saved.kind);
                setQ("");
                setPage(pageForRecord(saved.kind, saved.key));
              }}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ListEmpty({
  searching,
  onClear,
  noun,
}: {
  searching: boolean;
  onClear: () => void;
  noun: string;
}) {
  return (
    <div className="glass rounded-(--r-glass) p-6">
      <EmptyState
        icon={<SearchIcon className="size-7" strokeWidth={1.5} aria-hidden />}
        title={searching ? "No records match your search" : `No ${noun}s yet`}
        description={
          searching
            ? "Try a different title in this tab."
            : `Add a ${noun} to publish it to the site.`
        }
        action={
          searching ? (
            <Button variant="outline" size="sm" onClick={onClear}>
              Clear search
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}

// ---- rows ------------------------------------------------------------------
function RowShell({
  thumb,
  body,
  controls,
}: {
  thumb: React.ReactNode;
  body: React.ReactNode;
  controls: React.ReactNode;
}) {
  return (
    <div className="solid flex flex-col gap-3 rounded-(--r-solid) p-4 transition-shadow hover:shadow-(--shadow-elevated) lg:flex-row lg:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {thumb}
        <div className="min-w-0 flex-1">{body}</div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:shrink-0 lg:justify-end">
        {controls}
      </div>
    </div>
  );
}

function CoverThumb({ count }: { count: number }) {
  return (
    <div className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-(--r-input) border border-jce-line bg-[linear-gradient(135deg,var(--jce-green-50),var(--jce-orange-100))] text-jce-green-700">
      <ImageIcon className="size-5" aria-hidden />
      {count > 0 ? (
        <span className="absolute -right-1 -bottom-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-jce-green-700 px-1 text-[9px] font-bold text-white">
          {count}
        </span>
      ) : null}
    </div>
  );
}

function IconThumb({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid size-12 shrink-0 place-items-center rounded-(--r-input) border border-jce-line bg-jce-green-50 text-jce-green-700">
      {children}
    </div>
  );
}

function NewsRow({
  n,
  readOnly,
  onStatus,
  onEdit,
}: {
  n: CmsNews;
  readOnly: boolean;
  onStatus: (n: CmsNews, s: WebStatus) => void;
  onEdit: () => void;
}) {
  const photoCount = n.photos?.length ?? 0;
  return (
    <RowShell
      thumb={<CoverThumb count={photoCount} />}
      body={
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-jce-ink">{n.title}</span>
            {n.cat ? <Chip tone="info">{n.cat}</Chip> : null}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-ui-12 text-jce-ink-2">
            <time dateTime={n.date} className="font-mono">
              {n.date}
            </time>
            {" · "}
            <span className="min-w-0 truncate">{n.excerpt}</span>
          </div>
        </>
      }
      controls={
        <>
          <StatusControl
            status={n.status}
            readOnly={readOnly}
            onChange={(s) => onStatus(n, s)}
          />
          <RowActions onEdit={onEdit} readOnly={readOnly} />
        </>
      }
    />
  );
}

function CareerRow({
  c,
  readOnly,
  onStatus,
  onEdit,
}: {
  c: CmsCareer;
  readOnly: boolean;
  onStatus: (c: CmsCareer, s: WebStatus) => void;
  onEdit: () => void;
}) {
  const photoCount = c.photos?.length ?? 0;
  return (
    <RowShell
      thumb={
        photoCount > 0 ? (
          <CoverThumb count={photoCount} />
        ) : (
          <IconThumb>
            <BriefcaseIcon className="size-5" aria-hidden />
          </IconThumb>
        )
      }
      body={
        <>
          <div className="font-medium text-jce-ink">{c.title}</div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Chip tone="info">{c.dept}</Chip>
            <Chip tone="neutral">{c.loc}</Chip>
            <Chip tone="neutral">{c.type}</Chip>
          </div>
        </>
      }
      controls={
        <>
          <StatusControl
            status={c.status}
            readOnly={readOnly}
            onChange={(s) => onStatus(c, s)}
          />
          <RowActions onEdit={onEdit} readOnly={readOnly} />
        </>
      }
    />
  );
}

function RowActions({
  onEdit,
  readOnly,
}: {
  onEdit: () => void;
  readOnly: boolean;
}) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="min-h-11 flex-1 sm:flex-none"
        onClick={onEdit}
        aria-label="Photos"
        title="Photos"
      >
        <ImageIcon data-icon="inline-start" /> Photos
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="min-h-11 flex-1 sm:flex-none"
        onClick={onEdit}
      >
        {readOnly ? "View" : "Edit"}
      </Button>
    </div>
  );
}

// ---- edit / add drawer -----------------------------------------------------
type DrawerState =
  | { mode: "add"; kind: "news" }
  | { mode: "edit"; kind: "news"; record: CmsNews }
  | { mode: "add"; kind: "career" }
  | { mode: "edit"; kind: "career"; record: CmsCareer };

type Draft = {
  title: string;
  slug: string;
  status: WebStatus;
  sort: string;
  // news
  date: string;
  cat: string;
  excerpt: string;
  // career
  dept: string;
  loc: string;
  type: string;
  // photos
  photos: ManagedPhoto[];
};

const BLANK_DRAFT: Draft = {
  title: "",
  slug: "",
  status: "Draft",
  sort: "",
  date: "",
  cat: "",
  excerpt: "",
  dept: "",
  loc: "",
  type: "Full-time",
  photos: [],
};

function draftFrom(state: DrawerState): Draft {
  if (state.mode === "add") return { ...BLANK_DRAFT };
  if (state.kind === "news") {
    const r = state.record;
    return {
      ...BLANK_DRAFT,
      title: r.title,
      slug: r.slug,
      status: r.status,
      sort: String(r.sort),
      date: r.date,
      cat: r.cat,
      excerpt: r.excerpt,
      photos: toManaged(r.photos ?? [], r.coverIndex),
    };
  }
  const r = state.record;
  return {
    ...BLANK_DRAFT,
    title: r.title,
    slug: r.slug,
    status: r.status,
    sort: String(r.sort),
    dept: r.dept,
    loc: r.loc,
    type: r.type,
    photos: toManaged(r.photos ?? [], r.coverIndex),
  };
}

type Errors = Partial<Record<string, string>>;

function parseSort(s: string, fallback: number): number {
  const n = Number(s);
  return s.trim() !== "" && Number.isFinite(n) ? n : fallback;
}

const isIsoDate = (s: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

function RecordDrawer({
  state,
  readOnly,
  role,
  onClose,
  onSaved,
}: {
  state: DrawerState;
  readOnly: boolean;
  role: RoleId;
  onClose: () => void;
  onSaved: (saved: SavedRef) => void;
}) {
  const { kind, mode } = state;
  const [draft, setDraft] = useState<Draft>(() => draftFrom(state));
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof Draft>(key: K, val: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: val }));

  const onTitle = (title: string) =>
    setDraft((d) => ({
      ...d,
      title,
      slug: slugTouched ? d.slug : slugify(title),
    }));

  const audit = (
    area: string,
    action: string,
    rec: string,
    field: string,
    delta: string,
  ) =>
    appendBddAudit({
      ts: bddNow(),
      user: ROLES[role].short,
      area,
      action,
      rec,
      field,
      delta,
    });

  const validate = (): Errors => {
    const e: Errors = {};
    const title = draft.title.trim();
    if (!title) e.title = "Title is required.";
    if (draft.photos.length > 10) e.photos = "No more than 10 photos.";
    const slug = slugify(draft.slug || draft.title);
    const selfSlug = mode === "edit" ? state.record.slug : undefined;
    if (!slug) e.slug = "Slug is required.";

    if (kind === "news") {
      if (getCmsNews().some((n) => n.slug === slug && n.slug !== selfSlug))
        e.slug = "That slug is already in use.";
      if (!draft.date.trim() || !isIsoDate(draft.date))
        e.date = "A valid date is required.";
      if (!draft.excerpt.trim()) e.excerpt = "Excerpt is required.";
    } else {
      if (getCmsCareers().some((c) => c.slug === slug && c.slug !== selfSlug))
        e.slug = "That slug is already in use.";
      if (!draft.dept.trim()) e.dept = "Department is required.";
      if (!draft.loc.trim()) e.loc = "Location is required.";
      if (!draft.type.trim()) e.type = "Type is required.";
    }
    return e;
  };

  const save = () => {
    if (readOnly) return;
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    const { photos, coverIndex } = fromManaged(draft.photos);
    const title = draft.title.trim();
    const slug = slugify(draft.slug || draft.title);

    if (kind === "news") {
      const core = {
        slug,
        title,
        date: draft.date,
        cat: draft.cat.trim(),
        excerpt: draft.excerpt.trim(),
        status: draft.status,
      };
      if (mode === "add") {
        const created = addCmsNews(core);
        updateCmsNews(created.slug, {
          photos,
          coverIndex,
          sort: parseSort(draft.sort, created.sort),
        });
        audit(
          "Website News",
          "Created",
          created.slug,
          "News",
          `Added “${title}”`,
        );
        toast.success(`News “${title}” added.`);
      } else {
        const old = state.record;
        updateCmsNews(old.slug, {
          ...core,
          photos,
          coverIndex,
          sort: parseSort(draft.sort, old.sort),
        });
        audit("Website News", "Edited", old.slug, "News", `Updated “${title}”`);
        toast.success(`News “${title}” saved.`);
      }
    } else {
      const core = {
        slug,
        title,
        dept: draft.dept.trim(),
        loc: draft.loc.trim(),
        type: draft.type,
        status: draft.status,
      };
      if (mode === "add") {
        const created = addCmsCareer(core);
        updateCmsCareer(created.slug, {
          photos,
          coverIndex,
          sort: parseSort(draft.sort, created.sort),
        });
        audit(
          "Website Careers",
          "Created",
          created.slug,
          "Career",
          `Added “${title}”`,
        );
        toast.success(`Opening “${title}” added.`);
      } else {
        const old = state.record;
        updateCmsCareer(old.slug, {
          ...core,
          photos,
          coverIndex,
          sort: parseSort(draft.sort, old.sort),
        });
        audit(
          "Website Careers",
          "Edited",
          old.slug,
          "Career",
          `Updated “${title}”`,
        );
        toast.success(`Opening “${title}” saved.`);
      }
    }
    onSaved({ kind, key: slug });
  };

  const verb = mode === "add" ? "Add" : readOnly ? "View" : "Edit";
  const noun = KIND_LABEL[kind];

  return (
    <>
      <SheetHeader className="border-b border-jce-line pb-4 pr-8">
        <div className="kicker text-jce-green-600">
          {verb} {noun}
        </div>
        <SheetTitle className="text-ui-18">
          {draft.title.trim() || `New ${noun}`}
        </SheetTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone={WEB_STATUS_TONE[draft.status]}>{draft.status}</Chip>
          <span className="text-ui-12 text-jce-ink-2">
            {draft.status === "Published"
              ? "Live on the public site"
              : draft.status === "Draft"
                ? "Draft — not yet live"
                : "Hidden — off the site"}
          </span>
        </div>
        <SheetDescription>
          {readOnly
            ? "Read-only — your role cannot edit website content."
            : "Saving updates the in-session store and the website audit; live write-back is PROPOSED."}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="flex flex-col gap-5">
          {/* Identity */}
          <FormGroup title="Identity">
            <Field
              label="Title"
              htmlFor="cms-title"
              required
              error={errors.title}
            >
              <input
                id="cms-title"
                value={draft.title}
                onChange={(e) => onTitle(e.target.value)}
                disabled={readOnly}
                className="field"
                aria-invalid={errors.title ? true : undefined}
              />
            </Field>
            <Field label="Slug" htmlFor="cms-slug" required error={errors.slug}>
              <input
                id="cms-slug"
                value={draft.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
                disabled={readOnly}
                className="field font-mono"
                aria-invalid={errors.slug ? true : undefined}
              />
            </Field>
          </FormGroup>

          {/* News details */}
          {kind === "news" ? (
            <FormGroup title="Details">
              <Field
                label="Date"
                htmlFor="cms-date"
                required
                error={errors.date}
              >
                <input
                  id="cms-date"
                  type="date"
                  value={draft.date}
                  onChange={(e) => set("date", e.target.value)}
                  disabled={readOnly}
                  className="field"
                  aria-invalid={errors.date ? true : undefined}
                />
              </Field>
              <Field label="Category" htmlFor="cms-cat">
                <input
                  id="cms-cat"
                  value={draft.cat}
                  onChange={(e) => set("cat", e.target.value)}
                  disabled={readOnly}
                  className="field"
                  placeholder="e.g. Projects, Renewable, Insight"
                />
              </Field>
              <Field
                label="Excerpt"
                htmlFor="cms-excerpt"
                required
                error={errors.excerpt}
              >
                <textarea
                  id="cms-excerpt"
                  value={draft.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  disabled={readOnly}
                  rows={3}
                  className="field"
                  aria-invalid={errors.excerpt ? true : undefined}
                />
              </Field>
            </FormGroup>
          ) : null}

          {/* Career details */}
          {kind === "career" ? (
            <FormGroup title="Details">
              <Field
                label="Department"
                htmlFor="cms-dept"
                required
                error={errors.dept}
              >
                <input
                  id="cms-dept"
                  value={draft.dept}
                  onChange={(e) => set("dept", e.target.value)}
                  disabled={readOnly}
                  className="field"
                  placeholder="e.g. Engineering"
                  aria-invalid={errors.dept ? true : undefined}
                />
              </Field>
              <Field
                label="Location"
                htmlFor="cms-loc"
                required
                error={errors.loc}
              >
                <input
                  id="cms-loc"
                  value={draft.loc}
                  onChange={(e) => set("loc", e.target.value)}
                  disabled={readOnly}
                  className="field"
                  placeholder="e.g. Valenzuela / Project site"
                  aria-invalid={errors.loc ? true : undefined}
                />
              </Field>
              <Field
                label="Type"
                htmlFor="cms-type"
                required
                error={errors.type}
              >
                <Select
                  value={draft.type}
                  onValueChange={(v) => set("type", v)}
                  disabled={readOnly}
                >
                  <SelectTrigger id="cms-type" className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAREER_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FormGroup>
          ) : null}

          {/* Publishing */}
          <FormGroup title="Publishing">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Status" htmlFor="cms-status">
                <Select
                  value={draft.status}
                  onValueChange={(v) => set("status", v as WebStatus)}
                  disabled={readOnly}
                >
                  <SelectTrigger id="cms-status" className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WEB_STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Sort order" htmlFor="cms-sort">
                <input
                  id="cms-sort"
                  type="number"
                  value={draft.sort}
                  onChange={(e) => set("sort", e.target.value)}
                  disabled={readOnly}
                  className="field font-mono tabular-nums"
                  placeholder="0"
                />
              </Field>
            </div>
            <p className="text-ui-12 text-jce-ink-2">
              Only <strong>Published</strong> records appear on the public site.
            </p>
          </FormGroup>

          {/* Photos */}
          <FormGroup title={`Photos (${draft.photos.length}/10)`}>
            {errors.photos ? (
              <p role="alert" className="text-ui-12 text-(--st-danger-ink)">
                {errors.photos}
              </p>
            ) : null}
            <PhotoManager
              value={draft.photos}
              onChange={(next) => set("photos", next)}
              readOnly={readOnly}
            />
          </FormGroup>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-jce-line pt-4">
        <Button variant="ghost" className="min-h-11" onClick={onClose}>
          {readOnly ? "Close" : "Cancel"}
        </Button>
        {!readOnly ? (
          <Button className="min-h-11" onClick={save}>
            {mode === "add" ? `Add ${noun}` : "Save changes"}
          </Button>
        ) : null}
      </div>
    </>
  );
}

function FormGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="kicker text-jce-green-600">{title}</legend>
      {children}
    </fieldset>
  );
}
