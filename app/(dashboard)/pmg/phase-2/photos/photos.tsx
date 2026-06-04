"use client";

import { CameraIcon, ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";

// P14 · Field photo evidence (pmg-phase2.jsx:8). Camera-first capture per BOQ
// line/stage; a reviewed photo surfaces a review badge on the P8 grid.
const LINES = [
  { line: "A.1 · Concrete poles — Procure", photos: 3, reviewed: true },
  { line: "A.1 · Concrete poles — Install", photos: 2, reviewed: false },
  { line: "B.1 · Transformer 100KVA — Deliver", photos: 4, reviewed: true },
  { line: "B.2 · ACSR conductor — Install", photos: 0, reviewed: false },
];

export function Photos() {
  const { role } = useJce();
  const isEngineer = role === "siteeng";

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        kicker="PMG · P14 · Phase 2"
        title="Field photo evidence"
        actions={
          isEngineer ? (
            <Button
              size="sm"
              onClick={() => toast.success("Camera opened (mock).")}
            >
              <CameraIcon data-icon="inline-start" /> Capture photo
            </Button>
          ) : (
            <span className="text-ui-12 text-jce-ink-2">
              PM Head reviews before keying %
            </span>
          )
        }
      />
      {isEngineer ? (
        <div className="flex items-start gap-2 rounded-(--r-solid) border border-(--st-info) border-l-4 bg-card px-4 py-3 text-ui-13 text-jce-ink-2">
          <CameraIcon
            className="mt-0.5 size-4 shrink-0 text-(--st-info)"
            aria-hidden
          />
          <span>
            <strong className="text-jce-ink">Camera-first capture.</strong>{" "}
            Attach progress photos per BOQ line/stage, caption, and link to the
            current period. Large touch targets for on-site use.
          </span>
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {LINES.map((l) => (
          <div
            key={l.line}
            className="solid flex flex-col gap-3 rounded-(--r-solid) p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-ui-13 font-semibold text-jce-ink">
                {l.line}
              </div>
              {l.reviewed ? (
                <Chip tone="success">Reviewed</Chip>
              ) : l.photos > 0 ? (
                <Chip tone="pending">Needs review</Chip>
              ) : (
                <Chip tone="neutral">No photos</Chip>
              )}
            </div>
            {l.photos > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {Array.from({ length: Math.min(l.photos, 4) }).map((_, j) => (
                  <div
                    key={j}
                    className="grid size-14 place-items-center rounded-(--r-input) bg-(--table-zebra) text-jce-ink-2"
                  >
                    <ImageIcon className="size-5" aria-hidden />
                  </div>
                ))}
                <span className="text-ui-12 text-jce-ink-2">
                  {l.photos} photo{l.photos > 1 ? "s" : ""}
                </span>
              </div>
            ) : (
              <div className="rounded-(--r-input) bg-(--table-zebra) px-3 py-4 text-center text-ui-12 text-jce-ink-2">
                No photos attached for this line/stage yet.
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-ui-12 text-jce-ink-2">
        Lines with photos surface a review badge on the P8 accomplishment grid
        so the PM Head can verify before keying This Period %.
      </p>
    </div>
  );
}
