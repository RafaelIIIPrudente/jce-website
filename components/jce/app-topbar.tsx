"use client";

import { Fragment } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BellIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";

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

// Glass top bar (shell.jsx:121-184). Hamburger (mobile) · breadcrumbs (desktop) /
// compact location (mobile) · search · prototype role switcher · bell + unread
// badge · user menu with role chip. Tag: Glass.

function prettify(segment: string): string {
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function AppTopbar({
  onMenuClick,
  mobileOpen,
}: {
  onMenuClick: () => void;
  mobileOpen: boolean;
}) {
  const { notifications, unread, markAllRead, role } = useJce();
  const pathname = usePathname();
  const router = useRouter();
  const r = ROLES[role];

  const crumbs = [
    "JCE System",
    ...pathname.split("/").filter(Boolean).map(prettify),
  ];
  const current = crumbs[crumbs.length - 1] ?? "JCE System";

  return (
    <header className="glass-nav z-10 flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4">
      {/* Hamburger — opens the off-canvas nav drawer (mobile / tablet only) */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        aria-controls="mobile-nav"
        aria-expanded={mobileOpen}
        className="focus-ring-jce grid size-11 shrink-0 place-items-center rounded-(--r-input) text-jce-ink-2 transition-colors hover:bg-jce-green-50 hover:text-jce-green-900 lg:hidden"
      >
        <MenuIcon className="size-5" aria-hidden />
      </button>

      {/* Breadcrumbs — desktop / tablet */}
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

      {/* Compact location — phones (breadcrumbs hidden) */}
      <span className="min-w-0 flex-1 truncate text-ui-14 font-semibold text-jce-ink sm:hidden">
        {current}
      </span>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <div className="hidden h-11 w-64 items-center gap-2 rounded-(--r-input) border border-jce-line bg-card/70 px-3 transition-colors focus-within:border-jce-green-600 focus-within:shadow-(--focus-ring) lg:flex">
          <SearchIcon className="size-4 shrink-0 text-jce-ink-2" aria-hidden />
          <input
            placeholder="Search SO#, employee, document…"
            className="w-full bg-transparent text-ui-13 text-jce-ink outline-none placeholder:text-jce-ink-2"
            aria-label="Search"
          />
          <kbd className="rounded-(--r-chip) border border-jce-line bg-card px-1 text-ui-12 text-jce-ink-2">
            /
          </kbd>
        </div>

        <RoleSwitcher />

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
              className="focus-ring-jce relative grid size-11 place-items-center rounded-(--r-input) text-jce-ink-2 transition-colors hover:bg-jce-green-50 hover:text-jce-green-900"
            >
              <BellIcon className="size-4.5" aria-hidden />
              {unread > 0 ? (
                <span className="absolute top-1.5 right-1.5 grid h-4.5 min-w-4.5 place-items-center rounded-(--r-pill) bg-jce-orange-600 px-1 text-ui-12 leading-none font-bold text-white tabular-nums">
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
              className="focus-ring-jce flex min-h-11 items-center gap-2 rounded-(--r-input) py-1 pr-2 pl-1 transition-colors hover:bg-jce-green-50"
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
