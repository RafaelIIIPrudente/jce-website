"use client";

import { useRef, useState } from "react";
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

type Photo = { id: number; caption: string; cover: boolean };

const SEED: Photo[] = [
  { id: 1, caption: "Site mobilization", cover: true },
  { id: 2, caption: "Foundation works", cover: false },
];

export function PhotoManager({
  max = 10,
  className,
}: {
  max?: number;
  className?: string;
}) {
  const [photos, setPhotos] = useState<Photo[]>(SEED);
  const nextId = useRef(SEED.length + 1);

  const add = () =>
    setPhotos((p) =>
      p.length >= max
        ? p
        : [...p, { id: nextId.current++, caption: "", cover: p.length === 0 }],
    );

  const remove = (id: number) =>
    setPhotos((p) => {
      const np = p.filter((x) => x.id !== id);
      if (np.length === 0) return np;
      return np.some((x) => x.cover)
        ? np
        : np.map((x, i) => (i === 0 ? { ...x, cover: true } : x));
    });

  const setCover = (id: number) =>
    setPhotos((p) => p.map((x) => ({ ...x, cover: x.id === id })));

  const setCaption = (id: number, caption: string) =>
    setPhotos((p) => p.map((x) => (x.id === id ? { ...x, caption } : x)));

  const move = (idx: number, dir: -1 | 1) =>
    setPhotos((p) => {
      const j = idx + dir;
      if (j < 0 || j >= p.length) return p;
      const a = p[idx];
      const b = p[j];
      if (!a || !b) return p;
      const np = [...p];
      np[idx] = b;
      np[j] = a;
      return np;
    });

  return (
    <div data-slot="photo-manager" className={className}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-ui-12 text-jce-ink-2">
          {photos.length} / {max} photos
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={add}
          disabled={photos.length >= max}
        >
          <PlusIcon data-icon="inline-start" />
          Add photo
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((ph, idx) => (
          <div
            key={ph.id}
            className="overflow-hidden rounded-[10px] border border-jce-line bg-card"
          >
            <div className="relative grid aspect-[4/3] place-items-center bg-[linear-gradient(135deg,var(--jce-green-50),var(--jce-orange-100))] text-jce-green-700">
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
                className="field text-ui-12"
              />
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
                  <IconBtn label="Set as cover" onClick={() => setCover(ph.id)}>
                    <StarIcon
                      className={cn(
                        "size-3.5",
                        ph.cover && "fill-jce-orange-500 text-jce-orange-500",
                      )}
                      aria-hidden
                    />
                  </IconBtn>
                  <IconBtn label="Remove" onClick={() => remove(ph.id)}>
                    <TrashIcon className="size-3.5" aria-hidden />
                  </IconBtn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
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
