"use client";

import { useState } from "react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Code + label picker (Foundations.html:183-189,692-704) — Employee / Supplier /
// Client / SO# / Project / Item / CoA selection. Fuzzy filter over code + label;
// the code shows mono-green. Builds on ui/select's role with richer rows. Solid.

export type PickerOption = { code: string; label: string };

export function Picker({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search code or name…",
  className,
}: {
  options: readonly PickerOption[];
  value?: string;
  onChange: (code: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const selected = options.find((o) => o.code === value);
  const filtered = options.filter((o) =>
    `${o.code} ${o.label}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "field focus-ring-jce flex items-center justify-between gap-2",
            className,
          )}
        >
          {selected ? (
            <span className="flex min-w-0 items-center gap-2">
              <span className="font-mono text-ui-12 font-semibold text-jce-green-700">
                {selected.code}
              </span>
              <span className="truncate text-ui-13 text-jce-ink">
                {selected.label}
              </span>
            </span>
          ) : (
            <span className="text-ui-13 text-jce-ink-2">{placeholder}</span>
          )}
          <ChevronDownIcon
            className="size-4 shrink-0 text-jce-ink-2"
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) min-w-64 p-0"
      >
        <div className="flex items-center gap-2 border-b border-jce-line px-2.5 py-2">
          <SearchIcon className="size-3.5 text-jce-ink-2" aria-hidden />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
          />
        </div>
        <ul className="max-h-64 overflow-auto py-1">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-ui-12 text-jce-ink-2">
              No matches
            </li>
          ) : (
            filtered.map((o) => (
              <li key={o.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.code);
                    setOpen(false);
                    setQ("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-jce-green-50",
                    o.code === value && "bg-jce-green-50",
                  )}
                >
                  <span className="font-mono text-ui-12 font-semibold text-jce-green-700">
                    {o.code}
                  </span>
                  <span className="truncate text-ui-13 text-jce-ink">
                    {o.label}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
