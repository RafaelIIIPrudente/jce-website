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
// to a 72px icon rail. Tag: Glass.

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
        "glass-nav z-10 flex h-full shrink-0 flex-col gap-1 p-2 transition-[width] duration-300 ease-(--ease-jce)",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className="flex items-center gap-2.5 px-2 py-2">
        <Image
          src="/jce-logo.jpg"
          width={34}
          height={34}
          alt="JCE"
          className="shrink-0 rounded-md shadow-(--solid-shadow)"
        />
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

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
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
                "focus-ring-jce flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-ui-13 font-medium transition-colors",
                active
                  ? "bg-jce-green-700 text-primary-foreground"
                  : "text-jce-ink-2 hover:bg-jce-green-50 hover:text-jce-green-900",
                collapsed && "justify-center px-0",
              )}
            >
              <ModuleIcon icon={m.icon} className="size-[18px] shrink-0" />
              {!collapsed ? (
                <span className="flex-1 truncate">{m.label}</span>
              ) : null}
              {!collapsed && grant === "R" ? (
                <span
                  title="Read-only access"
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-bold",
                    active
                      ? "bg-white/20 text-primary-foreground"
                      : "bg-jce-green-100 text-jce-green-900",
                  )}
                >
                  R
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onToggle}
        title={collapsed ? "Expand" : "Collapse"}
        className="focus-ring-jce flex items-center gap-2 rounded-[10px] px-2.5 py-2 text-ui-12 text-jce-ink-2 transition-colors hover:bg-jce-green-50"
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
    </aside>
  );
}
