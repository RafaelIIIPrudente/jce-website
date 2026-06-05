"use client";

import { useState } from "react";
import { ImageIcon, PlusIcon, SearchIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { ROLES, canEdit, type RoleId } from "@/lib/rbac";
import {
  addCmsProduct,
  addCmsProject,
  addCmsService,
  appendBddAudit,
  bddNow,
  getCmsProducts,
  getCmsProjects,
  getCmsServices,
  updateCmsProduct,
  updateCmsProject,
  updateCmsService,
  WEB_STATUS_OPTIONS,
  WEB_STATUS_TONE,
  type CmsProduct,
  type CmsProject,
  type CmsService,
  type WebStatus,
} from "@/lib/mock/bdd";
import {
  CATEGORY_LABEL,
  formatCapacity,
  type ProjectCapacity,
  type ProjectCategory,
  type ProjectImage,
  type ProjectScope,
} from "@/lib/content/projects";
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

// B7/B8/B9 · Website content CMS (bdd-core.jsx:104-109, SRS §9.2). The CMS edits
// the public site's Projects / Services / Products — its record types ARE the
// public Project/Service/Product &-extended (lib/mock/bdd), so the fields match the
// live site by construction. Edit-with-audit (§9.6): every change appends to the
// BDD audit and surfaces in B11. Live write-back to the static site is PROPOSED —
// edits persist only in-session (reload resets the mock store).

type RecordKind = "project" | "service" | "product";

const KIND_LABEL: Record<RecordKind, string> = {
  project: "project",
  service: "service",
  product: "product",
};

const CATEGORY_ORDER: readonly ProjectCategory[] = [
  "solar",
  "distribution",
  "ngcp",
];

const SCOPE_VALUES: readonly ProjectScope[] = [
  "supply",
  "delivery",
  "installation",
  "testing",
  "commissioning",
  "design",
  "fabrication",
  "assembly",
  "dismantling",
  "uprating",
];

const CAPACITY_UNITS: readonly ProjectCapacity["unit"][] = [
  "MWp",
  "MVA",
  "MVAR",
  "kV",
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ---- photo mapping: record photos (ProjectImage[] + coverIndex) ↔ ManagedPhoto[]
// Public images carry no caption/cover, so the caption rides the image `alt` and the
// cover is the record's coverIndex. Mock-added photos are placeholders (empty src).
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

// ---- shared bits -----------------------------------------------------------
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

// ===========================================================================

export function WebsiteCms() {
  const { role } = useJce();
  const readOnly = !canEdit(role, "bdd");

  const [tab, setTab] = useState<RecordKind>("project");
  const [q, setQ] = useState("");

  const [projects, setProjects] = useState<readonly CmsProject[]>(() =>
    getCmsProjects(),
  );
  const [services, setServices] = useState<readonly CmsService[]>(() =>
    getCmsServices(),
  );
  const [products, setProducts] = useState<readonly CmsProduct[]>(() =>
    getCmsProducts(),
  );
  const refreshAll = () => {
    setProjects([...getCmsProjects()]);
    setServices([...getCmsServices()]);
    setProducts([...getCmsProducts()]);
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

  // ---- inline live mutations (Status / Show-client) ----
  const setProjectStatus = (p: CmsProject, status: WebStatus) => {
    if (status === p.status) return;
    updateCmsProject(p.slug, { status });
    audit(
      "Website Project",
      "Status Change",
      p.slug,
      "Status",
      `${p.status} → ${status}`,
    );
    refreshAll();
    toast.success(`${p.name} → ${status}`);
  };
  const toggleShowClient = (p: CmsProject) => {
    const showClient = !p.showClient;
    updateCmsProject(p.slug, { showClient });
    audit(
      "Website Project",
      "Edited",
      p.slug,
      "Show client",
      showClient ? "Hidden → Shown" : "Shown → Hidden",
    );
    refreshAll();
  };
  const setServiceStatus = (s: CmsService, status: WebStatus) => {
    if (status === s.status) return;
    updateCmsService(s.slug, { status });
    audit(
      "Website Service",
      "Status Change",
      s.slug,
      "Status",
      `${s.status} → ${status}`,
    );
    refreshAll();
    toast.success(`${s.name} → ${status}`);
  };
  const setProductStatus = (p: CmsProduct, status: WebStatus) => {
    if (status === p.status) return;
    updateCmsProduct(p.name, { status });
    audit(
      "Website Product",
      "Status Change",
      p.name,
      "Status",
      `${p.status} → ${status}`,
    );
    refreshAll();
    toast.success(`${p.name} → ${status}`);
  };

  const match = (name: string) => name.toLowerCase().includes(q.toLowerCase());
  const fProjects = projects.filter((p) => match(p.name));
  const fServices = services.filter((s) => match(s.name));
  const fProducts = products.filter((p) => match(p.name));

  const groups = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: fProjects
      .filter((p) => p.category === cat)
      .slice()
      .sort((a, b) => a.sort - b.sort),
  })).filter((g) => g.items.length > 0);

  // Publish-state KPI strip — derived live from all three stores combined so it
  // tracks every created / edited / status-toggled record across content types.
  const statuses: readonly WebStatus[] = [
    ...projects.map((r) => r.status),
    ...services.map((r) => r.status),
    ...products.map((r) => r.status),
  ];
  const liveCount = statuses.filter((s) => s === "Published").length;
  const draftCount = statuses.filter((s) => s === "Draft").length;
  const hiddenCount = statuses.filter((s) => s === "Hidden").length;
  const totalCount = statuses.length;

  const clearSearch = () => setQ("");
  const onTab = (v: string) => {
    setTab(v as RecordKind);
    setQ("");
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="BDD · B7–B9"
        title="Website content"
        description="BDD manages the public site's Projects, Services & Products — Published records appear on the live site (SRS §9.2). Edits persist in-session; live write-back to the site is mocked / PROPOSED."
      />

      {/* Publish-state KPI strip — live across projects + services + products */}
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
          delta={`${projects.length} projects · ${services.length} services · ${products.length} products`}
          tone="info"
        />
      </div>

      {/* Toolbar — search + tab-aware primary action (44px control heights) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex h-11 w-full max-w-sm items-center gap-2 rounded-(--r-input) border border-jce-line bg-white/70 px-3 transition-colors focus-within:border-jce-green-600 focus-within:shadow-(--focus-ring)">
          <SearchIcon className="size-4 shrink-0 text-jce-ink-2" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${KIND_LABEL[tab]}s by name…`}
            aria-label="Search website content by name"
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
        stay off it. The seed icon is shown but not editable.
      </p>

      <Tabs value={tab} onValueChange={onTab} className="gap-4">
        <TabsList className="h-auto w-full sm:w-fit">
          <TabsTrigger value="project" className="min-h-11">
            Projects ({projects.length})
          </TabsTrigger>
          <TabsTrigger value="service" className="min-h-11">
            Services ({services.length})
          </TabsTrigger>
          <TabsTrigger value="product" className="min-h-11">
            Products ({products.length})
          </TabsTrigger>
        </TabsList>

        {/* B7 Projects — grouped by category */}
        <TabsContent value="project">
          {fProjects.length === 0 ? (
            <SearchEmpty onClear={clearSearch} />
          ) : (
            <div className="flex flex-col gap-6">
              {groups.map((g) => (
                <section key={g.cat} className="flex flex-col gap-3">
                  <h2 className="text-ui-13 font-semibold text-jce-ink">
                    {CATEGORY_LABEL[g.cat]}{" "}
                    <span className="text-jce-ink-2">({g.items.length})</span>
                  </h2>
                  {g.items.map((p) => (
                    <ProjectRow
                      key={p.slug}
                      p={p}
                      readOnly={readOnly}
                      onStatus={setProjectStatus}
                      onToggleClient={toggleShowClient}
                      onEdit={() =>
                        setDrawer({ mode: "edit", kind: "project", record: p })
                      }
                    />
                  ))}
                </section>
              ))}
            </div>
          )}
        </TabsContent>

        {/* B8 Services */}
        <TabsContent value="service">
          {fServices.length === 0 ? (
            <SearchEmpty onClear={clearSearch} />
          ) : (
            <div className="flex flex-col gap-3">
              {fServices.map((s) => (
                <ServiceRow
                  key={s.slug}
                  s={s}
                  readOnly={readOnly}
                  onStatus={setServiceStatus}
                  onEdit={() =>
                    setDrawer({ mode: "edit", kind: "service", record: s })
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* B9 Products */}
        <TabsContent value="product">
          {fProducts.length === 0 ? (
            <SearchEmpty onClear={clearSearch} />
          ) : (
            <div className="flex flex-col gap-3">
              {fProducts.map((p) => (
                <ProductRow
                  key={p.name}
                  p={p}
                  readOnly={readOnly}
                  onStatus={setProductStatus}
                  onEdit={() =>
                    setDrawer({ mode: "edit", kind: "product", record: p })
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Sheet open={drawer != null} onOpenChange={(o) => !o && setDrawer(null)}>
        <SheetContent
          side="right"
          className="w-full gap-0 border-jce-line bg-background sm:max-w-xl"
        >
          {drawer ? (
            <RecordDrawer
              key={`${drawer.kind}-${drawer.mode}-${
                drawer.mode === "edit"
                  ? drawer.kind === "product"
                    ? drawer.record.name
                    : drawer.record.slug
                  : "new"
              }`}
              state={drawer}
              readOnly={readOnly}
              role={role}
              onClose={() => setDrawer(null)}
              onSaved={() => {
                refreshAll();
                setDrawer(null);
              }}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SearchEmpty({ onClear }: { onClear: () => void }) {
  return (
    <div className="glass rounded-(--r-glass) p-6">
      <EmptyState
        icon={<SearchIcon className="size-7" strokeWidth={1.5} aria-hidden />}
        title="No records match your search"
        description="Try a different name in this tab."
        action={
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear search
          </Button>
        }
      />
    </div>
  );
}

// ---- rows ------------------------------------------------------------------
// Premium .solid card row. Mobile-first: identity (thumb + name/meta) stacks above
// the controls block, which itself stacks then goes inline at sm; at lg the whole
// row is one line with controls right-aligned. No control is a fixed width that
// clips at ~360px (the Status select is w-full → sm:w-40).
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

function ProjectRow({
  p,
  readOnly,
  onStatus,
  onToggleClient,
  onEdit,
}: {
  p: CmsProject;
  readOnly: boolean;
  onStatus: (p: CmsProject, s: WebStatus) => void;
  onToggleClient: (p: CmsProject) => void;
  onEdit: () => void;
}) {
  const cap = formatCapacity(p.capacity);
  const photoCount = p.gallery.length;
  const meta = [p.location, cap, p.voltage].filter(Boolean).join(" · ");
  return (
    <RowShell
      thumb={<CoverThumb count={photoCount} />}
      body={
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-jce-ink">{p.name}</span>
            <Chip tone="info">{CATEGORY_LABEL[p.category]}</Chip>
          </div>
          <div className="mt-0.5 text-ui-12 text-jce-ink-2">
            {meta}
            {" · "}
            {p.showClient ? (
              <span>{p.client ?? "—"}</span>
            ) : (
              <span className="text-jce-ink-2 italic">Confidential client</span>
            )}
            {" · "}
            {photoCount} photo{photoCount === 1 ? "" : "s"}
          </div>
        </>
      }
      controls={
        <>
          {readOnly ? (
            <span className="text-ui-12 text-jce-ink-2">
              {p.showClient ? "Client shown" : "Client hidden"}
            </span>
          ) : (
            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-ui-12 text-jce-ink-2">
              <input
                type="checkbox"
                checked={p.showClient}
                onChange={() => onToggleClient(p)}
                className="size-4 accent-jce-green-700"
              />
              Show client
            </label>
          )}
          <StatusControl
            status={p.status}
            readOnly={readOnly}
            onChange={(s) => onStatus(p, s)}
          />
          <RowActions onEdit={onEdit} readOnly={readOnly} />
        </>
      }
    />
  );
}

function ServiceRow({
  s,
  readOnly,
  onStatus,
  onEdit,
}: {
  s: CmsService;
  readOnly: boolean;
  onStatus: (s: CmsService, status: WebStatus) => void;
  onEdit: () => void;
}) {
  const Icon = s.icon;
  return (
    <RowShell
      thumb={
        <IconThumb>
          <Icon className="size-5" aria-hidden />
        </IconThumb>
      }
      body={
        <>
          <div className="font-medium text-jce-ink">{s.name}</div>
          <div className="mt-0.5 text-ui-12 text-jce-ink-2">
            <span className="font-medium">{s.spec}</span> · {s.desc}
          </div>
        </>
      }
      controls={
        <>
          <StatusControl
            status={s.status}
            readOnly={readOnly}
            onChange={(status) => onStatus(s, status)}
          />
          <RowActions onEdit={onEdit} readOnly={readOnly} />
        </>
      }
    />
  );
}

function ProductRow({
  p,
  readOnly,
  onStatus,
  onEdit,
}: {
  p: CmsProduct;
  readOnly: boolean;
  onStatus: (p: CmsProduct, status: WebStatus) => void;
  onEdit: () => void;
}) {
  const Icon = p.icon;
  return (
    <RowShell
      thumb={
        <IconThumb>
          <Icon className="size-5" aria-hidden />
        </IconThumb>
      }
      body={
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-jce-ink">{p.name}</span>
            <Chip tone="neutral">{p.tag}</Chip>
          </div>
          <div className="mt-0.5 text-ui-12 text-jce-ink-2">{p.spec}</div>
        </>
      }
      controls={
        <>
          <StatusControl
            status={p.status}
            readOnly={readOnly}
            onChange={(status) => onStatus(p, status)}
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
  | { mode: "add"; kind: "project" }
  | { mode: "edit"; kind: "project"; record: CmsProject }
  | { mode: "add"; kind: "service" }
  | { mode: "edit"; kind: "service"; record: CmsService }
  | { mode: "add"; kind: "product" }
  | { mode: "edit"; kind: "product"; record: CmsProduct };

type Draft = {
  name: string;
  slug: string;
  status: WebStatus;
  sort: string;
  // project
  category: ProjectCategory;
  location: string;
  client: string;
  showClient: boolean;
  capValue: string;
  capUnit: ProjectCapacity["unit"] | "";
  voltage: string;
  scope: ProjectScope[];
  year: string;
  summary: string;
  // service
  spec: string;
  desc: string;
  // product
  tag: string;
  // photos
  photos: ManagedPhoto[];
};

const BLANK_DRAFT: Draft = {
  name: "",
  slug: "",
  status: "Draft",
  sort: "",
  category: "solar",
  location: "",
  client: "",
  showClient: false,
  capValue: "",
  capUnit: "",
  voltage: "",
  scope: [],
  year: "",
  summary: "",
  spec: "",
  desc: "",
  tag: "",
  photos: [],
};

function draftFrom(state: DrawerState): Draft {
  if (state.mode === "add") return { ...BLANK_DRAFT };
  if (state.kind === "project") {
    const r = state.record;
    return {
      ...BLANK_DRAFT,
      name: r.name,
      slug: r.slug,
      status: r.status,
      sort: String(r.sort),
      category: r.category,
      location: r.location,
      client: r.client ?? "",
      showClient: r.showClient,
      capValue: r.capacity ? String(r.capacity.value) : "",
      capUnit: r.capacity?.unit ?? "",
      voltage: r.voltage ?? "",
      scope: [...r.scope],
      year: r.year != null ? String(r.year) : "",
      summary: r.summary,
      photos: toManaged(r.gallery, r.coverIndex),
    };
  }
  if (state.kind === "service") {
    const r = state.record;
    return {
      ...BLANK_DRAFT,
      name: r.name,
      slug: r.slug,
      status: r.status,
      sort: String(r.sort),
      spec: r.spec,
      desc: r.desc,
      photos: toManaged(r.photos ?? [], r.coverIndex),
    };
  }
  const r = state.record;
  return {
    ...BLANK_DRAFT,
    name: r.name,
    status: r.status,
    sort: String(r.sort),
    spec: r.spec,
    tag: r.tag,
    photos: toManaged(r.photos ?? [], r.coverIndex),
  };
}

type Errors = Partial<Record<string, string>>;

function parseSort(s: string, fallback: number): number {
  const n = Number(s);
  return s.trim() !== "" && Number.isFinite(n) ? n : fallback;
}

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
  onSaved: () => void;
}) {
  const { kind, mode } = state;
  const [draft, setDraft] = useState<Draft>(() => draftFrom(state));
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof Draft>(key: K, val: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: val }));

  const onName = (name: string) =>
    setDraft((d) => ({
      ...d,
      name,
      slug: slugTouched || kind === "product" ? d.slug : slugify(name),
    }));

  const toggleScope = (sc: ProjectScope) =>
    setDraft((d) => ({
      ...d,
      scope: d.scope.includes(sc)
        ? d.scope.filter((x) => x !== sc)
        : [...d.scope, sc],
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
    const name = draft.name.trim();
    if (!name) e.name = "Name is required.";
    if (draft.photos.length > 10) e.photos = "No more than 10 photos.";

    if (kind === "project") {
      if (!draft.category) e.category = "Category is required.";
      if (!draft.location.trim()) e.location = "Location is required.";
      if (!draft.summary.trim()) e.summary = "Summary is required.";
      const slug = slugify(draft.slug || draft.name);
      const selfSlug = mode === "edit" ? state.record.slug : undefined;
      if (!slug) e.slug = "Slug is required.";
      else if (
        getCmsProjects().some((p) => p.slug === slug && p.slug !== selfSlug)
      )
        e.slug = "That slug is already in use.";
      if (draft.capUnit) {
        const v = Number(draft.capValue);
        if (draft.capValue.trim() === "" || !Number.isFinite(v) || v < 0)
          e.capacity = "Capacity must be a number ≥ 0 when a unit is set.";
      }
    } else if (kind === "service") {
      if (!draft.spec.trim()) e.spec = "Spec is required.";
      if (!draft.desc.trim()) e.desc = "Description is required.";
      const slug = slugify(draft.slug || draft.name);
      const selfSlug = mode === "edit" ? state.record.slug : undefined;
      if (!slug) e.slug = "Slug is required.";
      else if (
        getCmsServices().some((s) => s.slug === slug && s.slug !== selfSlug)
      )
        e.slug = "That slug is already in use.";
    } else {
      if (!draft.spec.trim()) e.spec = "Spec is required.";
      const selfName = mode === "edit" ? state.record.name : undefined;
      if (
        name &&
        getCmsProducts().some((p) => p.name === name && p.name !== selfName)
      )
        e.name = "That product name already exists.";
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
    const name = draft.name.trim();

    if (kind === "project") {
      const slug = slugify(draft.slug || draft.name);
      const capacity: ProjectCapacity | undefined = draft.capUnit
        ? { value: Number(draft.capValue), unit: draft.capUnit }
        : undefined;
      const core = {
        slug,
        name,
        category: draft.category,
        location: draft.location.trim(),
        client: draft.client.trim() || undefined,
        showClient: draft.showClient,
        capacity,
        voltage: draft.voltage.trim() || undefined,
        scope: draft.scope,
        year: draft.year.trim() ? Number(draft.year) : undefined,
        summary: draft.summary.trim(),
        status: draft.status,
      };
      if (mode === "add") {
        const created = addCmsProject(core);
        updateCmsProject(created.slug, {
          gallery: photos,
          coverIndex,
          sort: parseSort(draft.sort, created.sort),
        });
        audit(
          "Website Project",
          "Created",
          created.slug,
          "Project",
          `Added “${name}”`,
        );
        toast.success(`Project “${name}” added.`);
      } else {
        const old = state.record;
        updateCmsProject(old.slug, {
          ...core,
          gallery: photos,
          coverIndex,
          sort: parseSort(draft.sort, old.sort),
        });
        audit(
          "Website Project",
          "Edited",
          old.slug,
          "Project",
          `Updated “${name}”`,
        );
        toast.success(`Project “${name}” saved.`);
      }
    } else if (kind === "service") {
      const slug = slugify(draft.slug || draft.name);
      const core = {
        slug,
        name,
        spec: draft.spec.trim(),
        desc: draft.desc.trim(),
        status: draft.status,
      };
      if (mode === "add") {
        const created = addCmsService(core);
        updateCmsService(created.slug, {
          photos,
          coverIndex,
          sort: parseSort(draft.sort, created.sort),
        });
        audit(
          "Website Service",
          "Created",
          created.slug,
          "Service",
          `Added “${name}”`,
        );
        toast.success(`Service “${name}” added.`);
      } else {
        const old = state.record;
        updateCmsService(old.slug, {
          ...core,
          photos,
          coverIndex,
          sort: parseSort(draft.sort, old.sort),
        });
        audit(
          "Website Service",
          "Edited",
          old.slug,
          "Service",
          `Updated “${name}”`,
        );
        toast.success(`Service “${name}” saved.`);
      }
    } else {
      const core = {
        name,
        spec: draft.spec.trim(),
        tag: draft.tag.trim(),
        status: draft.status,
      };
      if (mode === "add") {
        const created = addCmsProduct(core);
        updateCmsProduct(created.name, {
          photos,
          coverIndex,
          sort: parseSort(draft.sort, created.sort),
        });
        audit(
          "Website Product",
          "Created",
          created.name,
          "Product",
          `Added “${name}”`,
        );
        toast.success(`Product “${name}” added.`);
      } else {
        const old = state.record;
        updateCmsProduct(old.name, {
          ...core,
          photos,
          coverIndex,
          sort: parseSort(draft.sort, old.sort),
        });
        audit(
          "Website Product",
          "Edited",
          old.name,
          "Product",
          `Updated “${name}”`,
        );
        toast.success(`Product “${name}” saved.`);
      }
    }
    onSaved();
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
          {draft.name.trim() || `New ${noun}`}
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
            : "Field-matched to the public site. Saving updates the in-session store and the BDD audit; live write-back is PROPOSED."}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="flex flex-col gap-5">
          {/* Identity */}
          <FormGroup title="Identity">
            <Field label="Name" htmlFor="cms-name" required error={errors.name}>
              <input
                id="cms-name"
                value={draft.name}
                onChange={(e) => onName(e.target.value)}
                disabled={readOnly}
                className="field"
                aria-invalid={errors.name ? true : undefined}
              />
            </Field>
            {kind === "project" ? (
              <Field
                label="Category"
                htmlFor="cms-category"
                required
                error={errors.category}
              >
                <Select
                  value={draft.category}
                  onValueChange={(v) => set("category", v as ProjectCategory)}
                  disabled={readOnly}
                >
                  <SelectTrigger id="cms-category" className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_ORDER.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CATEGORY_LABEL[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            ) : null}
            {kind !== "product" ? (
              <Field
                label="Slug"
                htmlFor="cms-slug"
                required
                error={errors.slug}
              >
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
            ) : null}
          </FormGroup>

          {/* Project public details */}
          {kind === "project" ? (
            <FormGroup title="Public details">
              <Field
                label="Location"
                htmlFor="cms-location"
                required
                error={errors.location}
              >
                <input
                  id="cms-location"
                  value={draft.location}
                  onChange={(e) => set("location", e.target.value)}
                  disabled={readOnly}
                  className="field"
                  aria-invalid={errors.location ? true : undefined}
                />
              </Field>
              <Field label="Client" htmlFor="cms-client">
                <input
                  id="cms-client"
                  value={draft.client}
                  onChange={(e) => set("client", e.target.value)}
                  disabled={readOnly}
                  className="field"
                  placeholder="Leave blank if confidential"
                />
              </Field>
              <label className="flex min-h-11 items-center gap-2 text-ui-13 text-jce-ink-2">
                <input
                  type="checkbox"
                  checked={draft.showClient}
                  onChange={(e) => set("showClient", e.target.checked)}
                  disabled={readOnly}
                  className="size-4 accent-jce-green-700"
                />
                Show client on the public site
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label="Capacity"
                  htmlFor="cms-cap-value"
                  error={errors.capacity}
                >
                  <input
                    id="cms-cap-value"
                    type="number"
                    min={0}
                    step="0.01"
                    value={draft.capValue}
                    onChange={(e) => set("capValue", e.target.value)}
                    disabled={readOnly}
                    className="field font-mono tabular-nums"
                    placeholder="e.g. 120"
                    aria-invalid={errors.capacity ? true : undefined}
                  />
                </Field>
                <Field label="Unit" htmlFor="cms-cap-unit">
                  <Select
                    value={draft.capUnit || "none"}
                    onValueChange={(v) =>
                      set(
                        "capUnit",
                        v === "none" ? "" : (v as ProjectCapacity["unit"]),
                      )
                    }
                    disabled={readOnly}
                  >
                    <SelectTrigger
                      id="cms-cap-unit"
                      className="min-h-11 w-full"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— none —</SelectItem>
                      {CAPACITY_UNITS.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Voltage" htmlFor="cms-voltage">
                  <input
                    id="cms-voltage"
                    value={draft.voltage}
                    onChange={(e) => set("voltage", e.target.value)}
                    disabled={readOnly}
                    className="field"
                    placeholder="e.g. 69 KV"
                  />
                </Field>
                <Field label="Year" htmlFor="cms-year">
                  <input
                    id="cms-year"
                    type="number"
                    value={draft.year}
                    onChange={(e) => set("year", e.target.value)}
                    disabled={readOnly}
                    className="field font-mono tabular-nums"
                    placeholder="e.g. 2025"
                  />
                </Field>
              </div>
              <Field label="Scope">
                <div className="grid grid-cols-2 gap-1.5">
                  {SCOPE_VALUES.map((sc) => (
                    <label
                      key={sc}
                      className="flex min-h-11 items-center gap-2 text-ui-13 text-jce-ink-2"
                    >
                      <input
                        type="checkbox"
                        checked={draft.scope.includes(sc)}
                        onChange={() => toggleScope(sc)}
                        disabled={readOnly}
                        className="size-4 accent-jce-green-700"
                      />
                      {titleCase(sc)}
                    </label>
                  ))}
                </div>
              </Field>
              <Field
                label="Summary"
                htmlFor="cms-summary"
                required
                error={errors.summary}
              >
                <textarea
                  id="cms-summary"
                  value={draft.summary}
                  onChange={(e) => set("summary", e.target.value)}
                  disabled={readOnly}
                  rows={3}
                  className="field"
                  aria-invalid={errors.summary ? true : undefined}
                />
              </Field>
            </FormGroup>
          ) : null}

          {/* Service details */}
          {kind === "service" ? (
            <FormGroup title="Details">
              <Field
                label="Spec"
                htmlFor="cms-spec"
                required
                error={errors.spec}
              >
                <input
                  id="cms-spec"
                  value={draft.spec}
                  onChange={(e) => set("spec", e.target.value)}
                  disabled={readOnly}
                  className="field"
                  placeholder="e.g. Up to 230 KV"
                  aria-invalid={errors.spec ? true : undefined}
                />
              </Field>
              <Field
                label="Description"
                htmlFor="cms-desc"
                required
                error={errors.desc}
              >
                <textarea
                  id="cms-desc"
                  value={draft.desc}
                  onChange={(e) => set("desc", e.target.value)}
                  disabled={readOnly}
                  rows={3}
                  className="field"
                  aria-invalid={errors.desc ? true : undefined}
                />
              </Field>
            </FormGroup>
          ) : null}

          {/* Product details */}
          {kind === "product" ? (
            <FormGroup title="Details">
              <Field
                label="Spec"
                htmlFor="cms-spec"
                required
                error={errors.spec}
              >
                <input
                  id="cms-spec"
                  value={draft.spec}
                  onChange={(e) => set("spec", e.target.value)}
                  disabled={readOnly}
                  className="field"
                  placeholder="e.g. 230 KV – 15 KV"
                  aria-invalid={errors.spec ? true : undefined}
                />
              </Field>
              <Field label="Tag" htmlFor="cms-tag">
                <input
                  id="cms-tag"
                  value={draft.tag}
                  onChange={(e) => set("tag", e.target.value)}
                  disabled={readOnly}
                  className="field"
                  placeholder="e.g. Transformers"
                />
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
