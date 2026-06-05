"use client";

import { useState } from "react";

import { AppSidebar, MobileNavDrawer } from "@/components/jce/app-sidebar";
import { AppTopbar } from "@/components/jce/app-topbar";
import { IdleModal } from "@/components/jce/idle-modal";

// App shell (X1, shell.jsx) — glass sidebar + glass top bar over the luminous
// `.jce-backdrop`, with the 30-minute idle modal. 2 of max-3 blur layers (the
// two glass chrome surfaces); the backdrop blobs are the soft glow, not blur of
// content. Tag: Glass.
//
// `collapsed` drives the DESKTOP rail width (256↔72px); `mobileOpen` is a
// SEPARATE state that drives the off-canvas drawer below `lg` (the rail itself is
// `hidden lg:flex`, so phones get full content width). The top-bar hamburger
// opens the drawer.

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="jce-backdrop flex h-dvh overflow-hidden">
      <span className="jce-glow-3" aria-hidden />
      <AppSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <MobileNavDrawer open={mobileOpen} onOpenChange={setMobileOpen} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar
          onMenuClick={() => setMobileOpen(true)}
          mobileOpen={mobileOpen}
        />
        <main className="flex-1 overflow-auto p-5 2xl:p-8">{children}</main>
      </div>
      <IdleModal />
    </div>
  );
}
