"use client";

import { useRef, useState } from "react";
import { FileIcon, TrashIcon, UploadIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Chip } from "@/components/jce/chip";

// File uploader + attachment list (Foundations.html:170-176,683-689). HR scans,
// A14, W4, P8. The required flag communicates the gate to Approved. Mock only —
// files are listed client-side, nothing is uploaded. Tag: Solid.

type MockFile = { name: string; size: string };

export function FileUploader({
  label = "Drop signed scan or browse",
  hint = "PDF / JPG / PNG · ≤10 MB each · multiple files",
  required = false,
  accept,
  className,
}: {
  label?: string;
  hint?: string;
  required?: boolean;
  accept?: string;
  className?: string;
}) {
  const [files, setFiles] = useState<MockFile[]>([]);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).map((f) => ({
      name: f.name,
      size: `${(f.size / 1_048_576).toFixed(1)} MB`,
    }));
    setFiles((fs) => [...fs, ...next]);
  };

  return (
    <div data-slot="file-uploader" className={className}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
        className={cn(
          "focus-ring-jce w-full rounded-[10px] border-2 border-dashed px-5 py-6 text-center transition-colors",
          drag
            ? "border-jce-green-500 bg-jce-green-50"
            : "border-(--masked-border) bg-(--table-zebra) hover:border-jce-green-500",
        )}
      >
        <UploadIcon
          className="mx-auto size-5 text-jce-green-700"
          strokeWidth={1.75}
          aria-hidden
        />
        <div className="mt-2 text-ui-13 font-semibold text-jce-ink">
          {label}
        </div>
        <div className="mt-1 text-ui-12 text-jce-ink-2">
          {hint}
          {required ? (
            <span className="ml-1 font-bold text-(--st-danger)">
              REQUIRED to reach Approved
            </span>
          ) : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => add(e.target.files)}
        />
      </button>

      {files.length > 0 ? (
        <ul className="mt-2.5 flex flex-col gap-1.5">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-2.5 rounded-lg border border-jce-line bg-card px-2.5 py-1.5 text-ui-12"
            >
              <FileIcon className="size-3.5 text-jce-ink-2" aria-hidden />
              <span className="flex-1 truncate text-jce-ink">{f.name}</span>
              <span className="tabular-nums text-jce-ink-2">{f.size}</span>
              <Chip tone="success">Uploaded</Chip>
              <button
                type="button"
                onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))}
                aria-label={`Remove ${f.name}`}
                className="focus-ring-jce rounded text-jce-ink-2 hover:text-(--st-danger)"
              >
                <TrashIcon className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
