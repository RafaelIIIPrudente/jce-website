// ============================================================================
// JCE SYSTEM — App Shell (X1) + RBAC config + cross-cutting chrome
// ============================================================================
const { useState, useEffect, useRef } = React;

// ---- Inline stroke icons (Lucide-style, 1.5px) -----------------------------
const ICON = {
  home: "M3 11.5 12 4l9 7.5M5 10v9h5v-6h4v6h5v-9",
  hr: "M7 8a3 3 0 1 0 0-.01M3 20c0-3 2-5 4-5s4 2 4 5M16 11a2.5 2.5 0 1 0 0-.01M14 20c0-2.2 1.5-4 3-4s3 1.8 3 4",
  acc: "M4 5h16v14H4zM4 9h16M9 13h6M9 16h4",
  pmg: "M4 4h7l2 2h7v14H4zM8 12h8M8 16h5",
  pur: "M4 5h2l2 11h10l2-7H7M9 20a1 1 0 1 0 0-.01M17 20a1 1 0 1 0 0-.01",
  wh: "M3 9l9-5 9 5v11H3zM7 20v-7h10v7M7 13h10",
  bdd: "M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-3",
  eng: "M12 4v2m0 12v2m8-8h-2M6 12H4m12.5-5.5-1.4 1.4m-6.2 6.2-1.4 1.4m9 0-1.4-1.4m-6.2-6.2L7.5 6.5M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  cfg: "M10.3 4h3.4l.5 2.3 2 .9 2-1.2 2.4 2.4-1.2 2 .9 2 2.3.5v3.4l-2.3.5-.9 2 1.2 2-2.4 2.4-2-1.2-2 .9-.5 2.3h-3.4l-.5-2.3-2-.9-2 1.2L3 17.2l1.2-2-.9-2L1 12.7V9.3l2.3-.5.9-2-1.2-2L5.4 2.4l2 1.2 2-.9z",
  self: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20c0-3.5 3-6 7-6s7 2.5 7 6",
  bell: "M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0",
  search: "M11 11m-7 0a7 7 0 1 0 14 0 7 7 0 1 0-14 0M20 20l-4-4",
  chevL: "M14 6l-6 6 6 6",
  lock: "M6 11V8a6 6 0 1 1 12 0v3M5 11h14v9H5z",
  check: "M5 12l4 4 10-10",
  dot: "M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0",
};
function Icon({ name, size = 18, stroke = 1.6, fill = "none", color }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color || "currentColor"}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICON[name]} />
    </svg>
  );
}

// ---- Modules ---------------------------------------------------------------
const MODULES = [
  { id: "home", label: "Home", icon: "home" },
  { id: "hr", label: "HR", icon: "hr" },
  { id: "acc", label: "Accounting", icon: "acc" },
  { id: "pmg", label: "Project Mgmt", icon: "pmg" },
  { id: "pur", label: "Purchasing", icon: "pur" },
  { id: "wh", label: "Warehouse", icon: "wh" },
  { id: "bdd", label: "BDD", icon: "bdd" },
  { id: "eng", label: "Engineering", icon: "eng" },
  { id: "self", label: "My HR", icon: "self" },
  { id: "admin", label: "Admin", icon: "cfg" },
];

// ---- Roles & access (from brief §3.2). F/E/R/—, suffix +A/+P/+L ------------
// access: { module: 'F'|'E'|'R' }  (absent = no access / hidden nav)
const ROLES = {
  owner: {
    name: "Owner",
    short: "Owner",
    home: "home",
    access: {
      home: "F",
      hr: "F",
      acc: "F",
      pmg: "F",
      pur: "F",
      wh: "F",
      bdd: "F",
      eng: "F",
      admin: "F",
    },
  },
  admin: {
    name: "System Admin",
    short: "Admin",
    home: "admin",
    access: {
      home: "R",
      hr: "R",
      acc: "R",
      pmg: "R",
      pur: "R",
      wh: "R",
      bdd: "R",
      eng: "R",
      admin: "F",
    },
  },
  employee: {
    name: "Employee · Self-Service",
    short: "Employee",
    home: "self",
    access: { home: "F", self: "F" },
  },
  hrhead: {
    name: "HR Head",
    short: "HR Head",
    home: "hr",
    access: { home: "F", hr: "F", self: "F" },
    note: "compensation masked",
  },
  timekeeper: {
    name: "Timekeeper",
    short: "Timekeeper",
    home: "hr",
    access: { home: "F", hr: "E", pmg: "R", bdd: "R", self: "F" },
  },
  acctglead: {
    name: "Accounting Lead / CFO",
    short: "Acctg Lead",
    home: "acc",
    access: { home: "F", acc: "F", pur: "R", self: "F" },
    note: "no compensation",
  },
  payroll: {
    name: "Payroll Officer",
    short: "Payroll",
    home: "acc",
    access: { home: "F", acc: "E", hr: "R", self: "F" },
    note: "sees compensation",
  },
  pmhead: {
    name: "PM Head",
    short: "PM Head",
    home: "pmg",
    access: { home: "F", pmg: "F", pur: "R", wh: "R", self: "F" },
  },
  purchsup: {
    name: "Purchasing Supervisor",
    short: "Purch Sup",
    home: "pur",
    access: { home: "F", pur: "F", pmg: "R", wh: "R", self: "F" },
  },
  warehouse: {
    name: "Warehouse Admin",
    short: "Warehouse",
    home: "wh",
    access: { home: "F", wh: "F", pmg: "R", pur: "R", self: "F" },
    note: "Lock/Unlock authority",
  },
  siteeng: {
    name: "Site Engineer",
    short: "Site Eng",
    home: "wh",
    access: { home: "F", wh: "E", pmg: "R", self: "F" },
    note: "assigned sites only",
  },
  bddlead: {
    name: "BDD Lead / Admin",
    short: "BDD Lead",
    home: "bdd",
    access: { home: "F", bdd: "F", self: "F" },
  },
};

// ============================================================================
// SIDEBAR (glass)
// ============================================================================
function Sidebar({ role, active, onNav, collapsed, onToggle }) {
  const acc = ROLES[role].access;
  const visible = MODULES.filter((m) => acc[m.id]);
  return (
    <aside className="jce-side glass-nav" data-collapsed={collapsed}>
      <div className="side-top">
        <img className="side-logo" src="assets/jce-logo.jpg" alt="JCE" />
        {!collapsed && (
          <div className="side-wm">
            <div className="side-name">JCE System</div>
            <div className="side-sub">JC Electrofields</div>
          </div>
        )}
      </div>
      <nav className="side-nav">
        {visible.map((m) => {
          const grant = acc[m.id];
          const on = active === m.id;
          return (
            <button
              key={m.id}
              className={"navitem" + (on ? " on" : "")}
              onClick={() => onNav(m.id)}
              title={m.label}
            >
              <span className="navic">
                <Icon name={m.icon} />
              </span>
              {!collapsed && <span className="navlabel">{m.label}</span>}
              {!collapsed && grant === "R" && (
                <span className="rotag" title="Read-only access">
                  R
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <button className="side-collapse" onClick={onToggle} title="Collapse">
        <span
          style={{
            transform: collapsed ? "rotate(180deg)" : "none",
            display: "inline-flex",
            transition: "transform .2s",
          }}
        >
          <Icon name="chevL" size={16} />
        </span>
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}

// ============================================================================
// TOP BAR (glass) — search · breadcrumbs · role switcher · bell · user
// ============================================================================
function TopBar({ role, setRole, crumbs, onBell, unread, onSignout }) {
  const [menu, setMenu] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);
  const r = ROLES[role];
  return (
    <header className="jce-top glass-nav">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <span key={i} className="crumb">
            {i > 0 && <span className="crumb-sep">/</span>}
            <span className={i === crumbs.length - 1 ? "crumb-cur" : ""}>
              {c}
            </span>
          </span>
        ))}
      </div>
      <div className="top-search">
        <Icon name="search" size={16} />
        <input placeholder="Search SO#, employee, document number…" />
        <kbd>/</kbd>
      </div>

      {/* Prototype-only role switcher */}
      <div className="rolesw">
        <span className="rolesw-lbl">Prototype · view as</span>
        <button className="rolesw-btn" onClick={() => setRolesOpen((o) => !o)}>
          {r.short} <Icon name="chevL" size={13} color="var(--jce-ink-2)" />
        </button>
        {rolesOpen && (
          <div className="rolesw-menu solid">
            {Object.entries(ROLES).map(([k, v]) => (
              <button
                key={k}
                className={"rolesw-opt" + (k === role ? " on" : "")}
                onClick={() => {
                  setRole(k);
                  setRolesOpen(false);
                }}
              >
                <span>{v.name}</span>
                {v.note && <span className="rolesw-note">{v.note}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="top-bell" onClick={onBell} title="Notifications">
        <Icon name="bell" size={18} />
        {unread > 0 && <span className="bell-badge">{unread}</span>}
      </button>

      <div className="top-user">
        <button className="user-btn" onClick={() => setMenu((m) => !m)}>
          <span className="user-av">{r.short.slice(0, 2).toUpperCase()}</span>
          <span className="user-meta">
            <span className="user-name">{r.name}</span>
            <span
              className="user-role chip chip-success"
              style={{ padding: "0 6px" }}
            >
              {r.short}
            </span>
          </span>
        </button>
        {menu && (
          <div className="user-menu solid">
            <div className="user-menu-head">
              <div className="user-name">{r.name}</div>
              {r.note && <div className="user-note">{r.note}</div>}
            </div>
            <button className="user-menu-item">
              Profile &amp; preferences
            </button>
            <button className="user-menu-item" onClick={onSignout}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

// ============================================================================
// IDLE TIMEOUT modal (X1) — 30 min default
// ============================================================================
function IdleModal({ onStay, onOut }) {
  return (
    <div className="jce-scrim">
      <div className="glass-modal idle-modal">
        <div className="idle-ic">
          <Icon name="lock" size={22} color="var(--st-pending-ink)" />
        </div>
        <h3>Still there?</h3>
        <p>
          For security your session will end in <strong>60 seconds</strong> of
          continued inactivity. (30-minute idle timeout — NFR-SEC-03.)
        </p>
        <div className="idle-acts">
          <button className="btn btn-ghost" onClick={onOut}>
            Sign out
          </button>
          <button className="btn btn-primary" onClick={onStay}>
            Stay signed in
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  React,
  useState,
  useEffect,
  useRef,
  Icon,
  ICON,
  MODULES,
  ROLES,
  Sidebar,
  TopBar,
  IdleModal,
});
