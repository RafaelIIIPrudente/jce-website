"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import {
  WEB_PRODUCTS,
  WEB_PROJECTS,
  WEB_SERVICES,
  WEB_STATUS_OPTIONS,
  WEB_STATUS_TONE,
  type WebEntry,
  type WebProject,
  type WebStatus,
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { PhotoManager } from "@/components/jce/photo-manager";

// B7/B8/B9 · Website content CMS (bdd-core.jsx:104-109, brief:1068-1088). Manage
// the WEB_* records' Published/Draft/Hidden state, show-client toggle (projects)
// and the ×10 photo manager. UI-only over the mock store — live propagation to
// the public website (Part 1) is PROPOSED (shared CMS↔website store not wired).

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
      <SelectTrigger className="h-9 w-32">
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

export function WebsiteCms() {
  const { role } = useJce();
  const readOnly = !canEdit(role, "bdd");

  const [projects, setProjects] = useState<WebProject[]>(() =>
    WEB_PROJECTS.map((p) => ({ ...p })),
  );
  const [services, setServices] = useState<WebEntry[]>(() =>
    WEB_SERVICES.map((s) => ({ ...s })),
  );
  const [products, setProducts] = useState<WebEntry[]>(() =>
    WEB_PRODUCTS.map((p) => ({ ...p })),
  );
  const [photoFor, setPhotoFor] = useState<string | null>(null);

  const setEntryStatus = (
    list: WebEntry[],
    set: (v: WebEntry[]) => void,
    name: string,
    status: WebStatus,
  ) => set(list.map((e) => (e.name === name ? { ...e, status } : e)));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="BDD · B7–B9"
        title="Website content"
        description="The CMS for the public site's Projects, Services and Products. UI-only over the mock store — live propagation to the website is PROPOSED."
        actions={!readOnly ? <Button size="sm">+ Add</Button> : undefined}
      />

      <Tabs defaultValue="projects" className="gap-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        {/* B7 Projects */}
        <TabsContent value="projects">
          <div className="flex flex-col gap-3">
            {projects.map((p) => (
              <div
                key={p.name}
                className="solid flex flex-wrap items-center gap-3 rounded-(--r-solid) p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-jce-ink">{p.name}</div>
                  <div className="text-ui-12 text-jce-ink-2">
                    {p.loc} · {p.done} · {p.tags.join(" · ")}
                  </div>
                </div>
                <label className="flex items-center gap-2 text-ui-12 text-jce-ink-2">
                  <input
                    type="checkbox"
                    checked={p.showClient}
                    disabled={readOnly}
                    onChange={(e) =>
                      setProjects(
                        projects.map((x) =>
                          x.name === p.name
                            ? { ...x, showClient: e.target.checked }
                            : x,
                        ),
                      )
                    }
                    className="size-4 accent-jce-green-700"
                  />
                  Show client{p.showClient ? `: ${p.client}` : ""}
                </label>
                <StatusControl
                  status={p.status}
                  readOnly={readOnly}
                  onChange={(s) =>
                    setProjects(
                      projects.map((x) =>
                        x.name === p.name ? { ...x, status: s } : x,
                      ),
                    )
                  }
                />
                {!readOnly ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPhotoFor(p.name)}
                  >
                    <ImageIcon data-icon="inline-start" /> Photos
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* B8 Services */}
        <TabsContent value="services">
          <div className="flex flex-col gap-3">
            {services.map((s) => (
              <div
                key={s.name}
                className="solid flex flex-wrap items-center gap-3 rounded-(--r-solid) p-4"
              >
                <div className="min-w-0 flex-1 font-medium text-jce-ink">
                  {s.name}
                </div>
                <StatusControl
                  status={s.status}
                  readOnly={readOnly}
                  onChange={(v) =>
                    setEntryStatus(services, setServices, s.name, v)
                  }
                />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* B9 Products */}
        <TabsContent value="products">
          <div className="flex flex-col gap-3">
            {products.map((p) => (
              <div
                key={p.name}
                className="solid flex flex-wrap items-center gap-3 rounded-(--r-solid) p-4"
              >
                <div className="min-w-0 flex-1 font-medium text-jce-ink">
                  {p.name}
                </div>
                <StatusControl
                  status={p.status}
                  readOnly={readOnly}
                  onChange={(v) =>
                    setEntryStatus(products, setProducts, p.name, v)
                  }
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Photo manager (×10) per project */}
      <Sheet open={!!photoFor} onOpenChange={(o) => !o && setPhotoFor(null)}>
        <SheetContent
          side="right"
          className="w-full gap-3 border-jce-line bg-(--glass-modal) supports-backdrop-filter:backdrop-blur-xl sm:max-w-lg"
        >
          <SheetHeader>
            <SheetTitle className="text-ui-16">Photos — {photoFor}</SheetTitle>
            <SheetDescription>
              Up to 10 images · captions · drag-sort · cover designation.
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-auto">
            <PhotoManager />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
