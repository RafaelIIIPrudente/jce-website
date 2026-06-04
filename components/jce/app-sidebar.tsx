"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { getGrant, visibleModules } from "@/lib/rbac";
import { ModuleIcon } from "@/components/jce/module-icon";

// Glass sidebar (shell.jsx:80-115). RBAC-gated nav — modules are HIDDEN (not
// disabled) when the role has no grant; read-grants carry an "R" tag. Collapses
// to a ~72px icon rail. Tag: Glass.
//
// Active item = soft jce-green-50 fill + a 3px left accent rail + green icon +
// green-900 semibold label (NOT a saturated block). The rail anchors "you are
// here". GOTCHA: <nav> is overflow-y-auto, so anything bled past the left edge
// (a negative-offset rail) is clipped — the rail sits at left-0 INSIDE the box.

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { role } = useJce();
  const pathname = usePathname();
  const modules = visibleModules(role);

  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        "glass-nav z-10 flex h-full shrink-0 flex-col p-3 transition-[width] duration-300 ease-jce",
        collapsed ? "w-18" : "w-64",
      )}
    >
      {/* Brand — logo framed as an intentional app mark, not a floating JPG */}
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

      <div className="border-t border-jce-line" />

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
              className={cn(
                "group focus-ring-jce relative flex items-center gap-2.5 rounded-(--r-solid) px-2.5 py-2.5 text-ui-13 transition-colors",
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
                  className="rounded-(--r-chip) bg-white px-1.5 py-0.5 text-[10px] font-bold text-jce-green-900 ring-1 ring-jce-green-100 ring-inset"
                >
                  R
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-2 border-t border-jce-line pt-2">
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? "Expand" : "Collapse"}
          className={cn(
            "focus-ring-jce flex w-full items-center gap-2 rounded-(--r-solid) px-2.5 py-2 text-ui-12 text-jce-ink-2 transition-colors hover:bg-jce-green-50 hover:text-jce-ink",
            collapsed && "justify-center px-0",
          )}
        >
          <ChevronLeftIcon
            className={cn(
              "size-4 transition-transform",
              collapsed && "rotate-180",
            )}
            aria-hidden
          />
          {!collapsed ? <span>Collapse</span> : null}
        </button>
      </div>
    </aside>
  );
}
