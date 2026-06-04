"use client";

// ============================================================================
// JCE SYSTEM — mock auth/role context (prototype only).
// Holds the active role + the prototype role switcher (shell.jsx:142-158) and a
// small in-session notifications slice for the bell-feed / X4. No persistence,
// no real auth — proxy.ts stays short-circuited and /dashboard is NOT gated.
// ============================================================================

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { type RoleId } from "@/lib/rbac";
import { NOTIFICATIONS, type Notification } from "@/lib/mock/shell";

type JceContextValue = {
  /** active mock role (drives RBAC visible states across the shell) */
  role: RoleId;
  setRole: (role: RoleId) => void;
  notifications: Notification[];
  unread: number;
  markAllRead: () => void;
  markRead: (id: number) => void;
  /** prepend a notification (e.g. a sensitive-change alert from BDD B2/B6) */
  addNotification: (n: Omit<Notification, "id">) => void;
};

const JceContext = createContext<JceContextValue | null>(null);

export function JceProvider({
  children,
  initialRole = "owner",
}: {
  children: ReactNode;
  initialRole?: RoleId;
}) {
  const [role, setRole] = useState<RoleId>(initialRole);
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    NOTIFICATIONS.map((n) => ({ ...n })),
  );

  const markAllRead = useCallback(
    () => setNotifications((ns) => ns.map((n) => ({ ...n, unread: false }))),
    [],
  );
  const markRead = useCallback(
    (id: number) =>
      setNotifications((ns) =>
        ns.map((n) => (n.id === id ? { ...n, unread: false } : n)),
      ),
    [],
  );
  const addNotification = useCallback(
    (n: Omit<Notification, "id">) =>
      setNotifications((ns) => [
        { ...n, id: ns.reduce((m, x) => Math.max(m, x.id), 0) + 1 },
        ...ns,
      ]),
    [],
  );

  const unread = notifications.reduce((c, n) => c + (n.unread ? 1 : 0), 0);

  const value = useMemo<JceContextValue>(
    () => ({
      role,
      setRole,
      notifications,
      unread,
      markAllRead,
      markRead,
      addNotification,
    }),
    [role, notifications, unread, markAllRead, markRead, addNotification],
  );

  return <JceContext.Provider value={value}>{children}</JceContext.Provider>;
}

export function useJce(): JceContextValue {
  const ctx = useContext(JceContext);
  if (!ctx) throw new Error("useJce must be used within <JceProvider>");
  return ctx;
}
