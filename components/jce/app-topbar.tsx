"use client";

import { Fragment } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BellIcon, LogOutIcon, SearchIcon, UserIcon } from "lucide-react";

import { useJce } from "@/lib/mock/role-context";
import { ROLES } from "@/lib/rbac";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Chip } from "@/components/jce/chip";
import { BellFeed } from "@/components/jce/bell-feed";
import { RoleSwitcher } from "@/components/jce/role-switcher";

// Glass top bar (shell.jsx:121-184). Breadcrumbs · search · prototype role
// switcher · bell + unread badge · user menu with role chip. Tag: Glass.

function prettify(segment: string): string {
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function AppTopbar() {
  const { notifications, unread, markAllRead, role } = useJce();
  const pathname = usePathname();
  const router = useRouter();
  const r = ROLES[role];

  const crumbs = [
    "JCE System",
    ...pathname.split("/").filter(Boolean).map(prettify),
  ];

  return (
    <header className="glass-nav z-10 flex items-center gap-3 px-4 py-2.5">
      <nav
        aria-label="Breadcrumb"
        className="hidden min-w-0 items-center gap-1.5 text-ui-13 sm:flex"
      >
        {crumbs.map((c, i) => (
          <Fragment key={i}>
            {i > 0 ? <span className="text-jce-ink-2">/</span> : null}
            <span
              className={
                i === crumbs.length - 1
                  ? "truncate font-semibold text-jce-ink"
                  : "truncate text-jce-ink-2"
              }
            >
              {c}
            </span>
          </Fragment>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden w-64 items-center gap-2 rounded-[8px] border border-jce-line bg-white/70 px-2.5 py-1.5 lg:flex">
          <SearchIcon className="size-4 shrink-0 text-jce-ink-2" aria-hidden />
          <input
            placeholder="Search SO#, employee, document…"
            className="w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
            aria-label="Search"
          />
          <kbd className="rounded border border-jce-line bg-white px-1 text-[10px] text-jce-ink-2">
            /
          </kbd>
        </div>

        <RoleSwitcher />

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
              className="focus-ring-jce relative grid size-9 place-items-center rounded-[8px] text-jce-ink-2 transition-colors hover:bg-jce-green-50 hover:text-jce-green-900"
            >
              <BellIcon className="size-[18px]" aria-hidden />
              {unread > 0 ? (
                <span className="absolute top-1 right-1 grid min-w-4 place-items-center rounded-full bg-jce-orange-600 px-1 text-[9px] font-bold text-white tabular-nums">
                  {unread}
                </span>
              ) : null}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="glass-modal w-auto border-0 p-3"
          >
            <BellFeed
              notifications={notifications}
              onMarkAllRead={markAllRead}
              onOpenAll={() => router.push("/dashboard/notifications")}
            />
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="focus-ring-jce flex items-center gap-2 rounded-[8px] py-1 pr-2 pl-1 transition-colors hover:bg-jce-green-50"
            >
              <Avatar className="size-8">
                <AvatarFallback>
                  {r.short.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-left sm:block">
                <span className="block text-ui-12 leading-tight font-semibold text-jce-ink">
                  {r.name}
                </span>
                <Chip tone="success" className="px-1.5 py-0">
                  {r.short}
                </Chip>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-ui-13 font-semibold text-jce-ink">
                {r.name}
              </div>
              {r.note ? (
                <div className="text-ui-12 font-normal text-jce-ink-2">
                  {r.note}
                </div>
              ) : null}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon />
              Profile &amp; preferences
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/login")}>
              <LogOutIcon />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
