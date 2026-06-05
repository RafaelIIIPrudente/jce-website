"use client";

import { useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ImageIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/jce/chip";

// Photo manager (P14) — up to 10 photos with captions, reorder and a cover flag.
// Mock only: "Add photo" appends a placeholder tile; no real upload. Tag: Solid.
//
// Two modes:
//   • Uncontrolled (no value/onChange) — self-contained local state (P14 demo,
//     foundations-gallery). Unchanged behavior.
//   • Controlled (value + onChange) — bound to an owner record's photos, so the
//     BDD Website CMS persists captions/cover/order to its in-session store.
// `readOnly` renders the tiles statically (no add/remove/caption/reorder/cover).

/** The owner-facing photo shape (caption + cover designation). */
export type ManagedPhoto = { caption: string; cover: boolean };

type Photo = { id: number; caption: string; cover: boolean };

const SEED: Photo[] = [
  { id: 1, caption: "Site mobilization", cover: true },
  { id: 2, caption: "Foundation works", cover: false },
];

export function PhotoManager({
  max = 10,
  value,
  onChange,
  readOnly = false,
  className,
}: {
  max?: number;
  value?: readonly ManagedPhoto[];
  onChange?: (next: ManagedPhoto[]) => void;
  readOnly?: boolean;
  className?: string;
}) {
  const controlled = value != null && onChange != null;
  const [internal, setInternal] = useState<Photo[]>(SEED);

  // Working list: controlled from `value` (stable ids by position), else local.
  const photos: Photo[] = controlled
    ? value.map((p, i) => ({ id: i + 1, caption: p.caption, cover: p.cover }))
    : internal;

  const commit = (np: Photo[]) => {
    if (controlled)
      onChange(np.map((p) => ({ caption: p.caption, cover: p.cover })));
    else setInternal(np);
  };

  const add = () => {
    if (readOnly || photos.length >= max) return;
    const nextId = photos.reduce((m, p) => Math.max(m, p.id), 0) + 1;
    commit([
      ...photos,
      { id: nextId, caption: "", cover: photos.length === 0 },
    ]);
  };

  const remove = (id: number) => {
    let np = photos.filter((x) => x.id !== id);
    // Keep exactly one cover designated when photos remain.
    if (np.length > 0 && !np.some((x) => x.cover)) {
      np = np.map((x, i) => (i === 0 ? { ...x, cover: true } : x));
    }
    commit(np);
  };

  const setCover = (id: number) =>
    commit(photos.map((x) => ({ ...x, cover: x.id === id })));

  const setCaption = (id: number, caption: string) =>
    commit(photos.map((x) => (x.id === id ? { ...x, caption } : x)));

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= photos.length) return;
    const a = photos[idx];
    const b = photos[j];
    if (!a || !b) return;
    const np = [...photos];
    np[idx] = b;
    np[j] = a;
    commit(np);
  };

  return (
    <div data-slot="photo-manager" className={className}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-ui-12 text-jce-ink-2">
          {photos.length} / {max} photos
        </span>
        {!readOnly ? (
          <Button
            size="sm"
            variant="outline"
            className="min-h-11"
            onClick={add}
            disabled={photos.length >= max}
          >
            <PlusIcon data-icon="inline-start" />
            Add photo
          </Button>
        ) : null}
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center rounded-[10px] border border-dashed border-jce-line px-6 py-8 text-center">
          <ImageIcon
            className="size-7 text-jce-ink-2"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="mt-2 text-ui-12 text-jce-ink-2">
            {readOnly
              ? "No photos on this record."
              : "No photos yet — add up to 10 placeholder images."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((ph, idx) => (
            <div
              key={ph.id}
              className="overflow-hidden rounded-[10px] border border-jce-line bg-card"
            >
              <div className="relative grid aspect-4/3 place-items-center bg-[linear-gradient(135deg,var(--jce-green-50),var(--jce-orange-100))] text-jce-green-700">
                <ImageIcon className="size-7" strokeWidth={1.5} aria-hidden />
                {ph.cover ? (
                  <span className="absolute top-2 left-2">
                    <Chip tone="success">Cover</Chip>
                  </span>
                ) : null}
              </div>
              <div className="p-2">
                <input
                  value={ph.caption}
                  onChange={(e) => setCaption(ph.id, e.target.value)}
                  placeholder="Caption…"
                  readOnly={readOnly}
                  className="field text-ui-12"
                />
                {!readOnly ? (
                  <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex gap-0.5">
                      <IconBtn
                        label="Move up"
                        onClick={() => move(idx, -1)}
                        disabled={idx === 0}
                      >
                        <ArrowUpIcon className="size-3.5" aria-hidden />
                      </IconBtn>
                      <IconBtn
                        label="Move down"
                        onClick={() => move(idx, 1)}
                        disabled={idx === photos.length - 1}
                      >
                        <ArrowDownIcon className="size-3.5" aria-hidden />
                      </IconBtn>
                    </div>
                    <div className="flex gap-0.5">
                      <IconBtn
                        label="Set as cover"
                        onClick={() => setCover(ph.id)}
                      >
                        <StarIcon
                          className={cn(
                            "size-3.5",
                            ph.cover &&
                              "fill-jce-orange-500 text-jce-orange-500",
                          )}
                          aria-hidden
                        />
                      </IconBtn>
                      <IconBtn label="Remove" onClick={() => remove(ph.id)}>
                        <TrashIcon className="size-3.5" aria-hidden />
                      </IconBtn>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="focus-ring-jce grid size-7 place-items-center rounded-md text-jce-ink-2 transition-colors hover:bg-jce-green-50 hover:text-jce-green-900 disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}
