"use client";

import { useState } from "react";

import { AppSidebar } from "@/components/jce/app-sidebar";
import { AppTopbar } from "@/components/jce/app-topbar";
import { IdleModal } from "@/components/jce/idle-modal";

// App shell (X1, shell.jsx) — glass sidebar + glass top bar over the luminous
// `.jce-backdrop`, with the 30-minute idle modal. 2 of max-3 blur layers (the
// two glass chrome surfaces); the backdrop blobs are the soft glow, not blur of
// content. Tag: Glass.

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="jce-backdrop flex h-[100dvh] overflow-hidden">
      <span className="jce-glow-3" aria-hidden />
      <AppSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 overflow-auto p-5">{children}</main>
      </div>
      <IdleModal />
    </div>
  );
}
