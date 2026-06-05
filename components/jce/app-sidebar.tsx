"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { getGrant, visibleModules } from "@/lib/rbac";
import { ModuleIcon } from "@/components/jce/module-icon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

// Glass sidebar (shell.jsx:80-115). RBAC-gated nav — modules are HIDDEN (not
// disabled) when the role has no grant; read-grants carry an "R" tag. The
// desktop rail is persistent + collapsible (256↔72px, `hidden lg:flex`); below
// `lg` the SAME nav renders inside an off-canvas `Sheet` drawer (MobileNavDrawer)
// opened by the top-bar hamburger. Tag: Glass.
//
// Active item = soft jce-green-50 fill + a 3px left accent rail + green icon +
// green-900 semibold label (NOT a saturated block). The rail anchors "you are
// here". GOTCHA: <nav> is overflow-y-auto, so anything bled past the left edge
// (a negative-offset rail) is clipped — the rail sits at left-0 INSIDE the box.

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 pb-3",
        collapsed && "justify-center",
      )}
    >
      <div className="relative size-9 shrink-0 overflow-hidden rounded-(--r-solid) shadow-(--solid-shadow) ring-1 ring-jce-line">
        <Image
          src="/jce-logo.jpg"
          alt="JCE"
          fill
          sizes="36px"
          className="object-cover"
        />
      </div>
      {!collapsed ? (
        <div className="min-w-0">
          <div className="truncate text-ui-14 leading-tight font-bold text-jce-ink">
            JCE System
          </div>
          <div className="truncate text-ui-12 text-jce-ink-2">
            JC Electrofields
          </div>
        </div>
      ) : null}
    </div>
  );
}

// The RBAC-gated module list — shared verbatim by the desktop rail and the mobile
// drawer so the nav, active logic and "R" tags can never drift between them.
function SidebarNav({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const { role } = useJce();
  const pathname = usePathname();
  const modules = visibleModules(role);

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pt-3">
      {!collapsed ? <div className="kicker px-2.5 pb-1">Modules</div> : null}
      {modules.map((m) => {
        const grant = getGrant(role, m.id);
        const active =
          m.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === m.href || pathname.startsWith(m.href + "/");
        return (
          <Link
            key={m.id}
            href={m.href}
            title={m.label}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "group focus-ring-jce relative flex min-h-11 items-center gap-2.5 rounded-(--r-solid) px-2.5 py-2.5 text-ui-13 transition-colors",
              active ? "bg-jce-green-50" : "hover:bg-jce-green-50",
              collapsed && "justify-center px-0",
            )}
          >
            {active ? (
              <span
                aria-hidden
                className="absolute top-1/2 left-0 h-5 w-0.75 -translate-y-1/2 rounded-(--r-pill) bg-jce-green-700"
              />
            ) : null}
            <ModuleIcon
              icon={m.icon}
              className={cn(
                "size-4.5 shrink-0 transition-colors",
                active
                  ? "text-jce-green-700"
                  : "text-jce-ink-2 group-hover:text-jce-green-700",
              )}
            />
            {!collapsed ? (
              <span
                className={cn(
                  "flex-1 truncate",
                  active
                    ? "font-semibold text-jce-green-900"
                    : "font-medium text-jce-ink-2 group-hover:text-jce-ink",
                )}
              >
                {m.label}
              </span>
            ) : null}
            {!collapsed && grant === "R" ? (
              <span
                title="Read-only access"
                className="rounded-(--r-chip) bg-card px-1.5 py-0.5 text-ui-12 leading-none font-bold text-jce-green-900 ring-1 ring-jce-green-100 ring-inset"
              >
                R
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        "glass-nav z-10 hidden h-full shrink-0 flex-col p-3 transition-[width] duration-300 ease-jce lg:flex",
        collapsed ? "w-18" : "w-64",
      )}
    >
      <SidebarBrand collapsed={collapsed} />

      <div className="border-t border-jce-line" />

      <SidebarNav collapsed={collapsed} />

      {/* Refined collapse affordance — a compact, right-aligned edge toggle
          (not a full-width block), ≥44px hit area, keyboard + tooltip. */}
      <div
        className={cn(
          "mt-2 flex border-t border-jce-line pt-2",
          collapsed ? "justify-center" : "justify-end",
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "focus-ring-jce inline-flex min-h-11 items-center gap-1.5 rounded-(--r-input) text-jce-ink-2 transition-colors hover:bg-jce-green-50 hover:text-jce-ink",
            collapsed ? "w-full justify-center" : "px-2.5",
          )}
        >
          <ChevronLeftIcon
            className={cn(
              "size-4 transition-transform",
              collapsed && "rotate-180",
            )}
            aria-hidden
          />
          {!collapsed ? <span className="text-ui-12">Collapse</span> : null}
        </button>
      </div>
    </aside>
  );
}

// Mobile off-canvas drawer — the same RBAC nav inside a left `Sheet` (scrim +
// focus-trap + Escape built in), closing on nav-item select. Opened by the
// top-bar hamburger; never rendered as a persistent rail on mobile.
export function MobileNavDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        id="mobile-nav"
        side="left"
        className="flex flex-col gap-0 border-jce-line bg-card p-3"
      >
        <SheetTitle className="sr-only">JCE System navigation</SheetTitle>
        <SheetDescription className="sr-only">
          Module navigation, gated by your role.
        </SheetDescription>
        <SidebarBrand collapsed={false} />
        <div className="border-t border-jce-line" />
        <SidebarNav collapsed={false} onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
