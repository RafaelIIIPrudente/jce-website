import { LockIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Status chip — the full document-lifecycle vocabulary (jce-tokens.css:174-187).
// Glass/Solid: Solid. Error states are never colour-only — the ::before dot (or
// the lock glyph) always accompanies the label. Tag: Solid.

export type ChipTone =
  | "success"
  | "pending"
  | "danger"
  | "info"
  | "neutral"
  | "locked";

const TONE_CLASS: Record<ChipTone, string> = {
  success: "chip-success",
  pending: "chip-pending",
  danger: "chip-danger",
  info: "chip-info",
  neutral: "chip-neutral",
  locked: "chip-locked",
};

export function Chip({
  tone = "neutral",
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { tone?: ChipTone }) {
  const isLocked = tone === "locked";
  return (
    <span
      data-slot="chip"
      data-tone={tone}
      className={cn(
        "chip",
        TONE_CLASS[tone],
        isLocked && "before:hidden",
        className,
      )}
      {...props}
    >
      {isLocked && (
        <LockIcon className="size-3" strokeWidth={2.25} aria-hidden />
      )}
      {children}
    </span>
  );
}
