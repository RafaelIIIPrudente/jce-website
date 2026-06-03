"use client";

import { LockIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Masked sensitive field — compensation, ATM account numbers. Shown for every
// role except Payroll Officer + Owner (see lib/rbac.CAN_SEE_COMP). The tooltip
// explains the restriction. (jce-tokens.css:242-248 · Foundations.html:620-621)
// Tag: Solid.

export function FieldMasked({
  length = 6,
  reason = "Restricted — visible to Payroll Officer & Owner only",
  className,
}: {
  length?: number;
  reason?: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          data-slot="field-masked"
          className={cn("masked text-ui-13", className)}
        >
          {"•".repeat(length)}
          <LockIcon className="size-3" aria-hidden />
          <span className="sr-only">Masked sensitive value</span>
        </span>
      </TooltipTrigger>
      <TooltipContent>{reason}</TooltipContent>
    </Tooltip>
  );
}
