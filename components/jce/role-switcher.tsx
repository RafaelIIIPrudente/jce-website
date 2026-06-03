"use client";

import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { ROLE_IDS, ROLES } from "@/lib/rbac";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Prototype-only role switcher (shell.jsx:142-158). Changing the role re-drives
// every RBAC visible state — the sidebar shows/hides modules, read-grants gain
// the "R" tag, compensation masking flips. In-session only.

export function RoleSwitcher() {
  const { role, setRole } = useJce();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="focus-ring-jce flex items-center gap-1.5 rounded-[8px] border border-jce-line bg-white/70 px-2.5 py-1.5 text-ui-12 transition-colors hover:border-jce-green-500"
        >
          <span className="hidden text-jce-ink-2 sm:inline">
            Prototype · view as
          </span>
          <span className="font-semibold text-jce-ink">
            {ROLES[role].short}
          </span>
          <ChevronDownIcon className="size-3.5 text-jce-ink-2" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Prototype role switcher</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ROLE_IDS.map((id) => {
          const v = ROLES[id];
          return (
            <DropdownMenuItem
              key={id}
              onClick={() => setRole(id)}
              className={cn(id === role && "bg-jce-green-50")}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-ui-13">{v.name}</span>
                {v.note ? (
                  <span className="shrink-0 text-[10px] text-jce-ink-2">
                    {v.note}
                  </span>
                ) : null}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
