// ============================================================================
// JCE SYSTEM — X5 Admin: Users & Roles · X6 Admin: System Settings
// ============================================================================

// ---- Sample users ----------------------------------------------------------
const USERS = [
  {
    id: 1,
    name: "Jose Cruz",
    email: "owner@jce.com.ph",
    role: "Owner",
    status: "Active",
    last: "2026-06-03 08:12",
    emp: "JCE 00001",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "hr.head@jce.com.ph",
    role: "HR Head",
    status: "Active",
    last: "2026-06-03 07:55",
    emp: "JCE 00014",
  },
  {
    id: 3,
    name: "Ramon dela Cruz",
    email: "timekeeper@jce.com.ph",
    role: "Timekeeper",
    status: "Active",
    last: "2026-06-02 17:40",
    emp: "JCE 00031",
  },
  {
    id: 4,
    name: "Ana Reyes",
    email: "acctg.lead@jce.com.ph",
    role: "Accounting Lead / CFO",
    status: "Active",
    last: "2026-06-03 08:01",
    emp: "JCE 00009",
  },
  {
    id: 5,
    name: "Liza Tan",
    email: "payroll@jce.com.ph",
    role: "Payroll Officer",
    status: "Active",
    last: "2026-06-02 16:22",
    emp: "JCE 00012",
  },
  {
    id: 6,
    name: "Carlos Mendoza",
    email: "pm.head@jce.com.ph",
    role: "PM Head",
    status: "Active",
    last: "2026-06-03 06:48",
    emp: "JCE 00007",
  },
  {
    id: 7,
    name: "Nestor Aquino",
    email: "purch.sup@jce.com.ph",
    role: "Purchasing Supervisor",
    status: "Active",
    last: "2026-06-02 18:05",
    emp: "JCE 00022",
  },
  {
    id: 8,
    name: "Grace Lim",
    email: "warehouse@jce.com.ph",
    role: "Warehouse Admin",
    status: "Active",
    last: "2026-06-03 07:30",
    emp: "JCE 00040",
  },
  {
    id: 9,
    name: "Paolo Garcia",
    email: "site.eng@jce.com.ph",
    role: "Site Engineer",
    status: "Active",
    last: "2026-06-02 12:10",
    emp: "JCE 00055",
  },
  {
    id: 10,
    name: "Bea Navarro",
    email: "bdd.lead@jce.com.ph",
    role: "BDD Lead / Admin",
    status: "Active",
    last: "2026-06-03 08:20",
    emp: "JCE 00018",
  },
  {
    id: 11,
    name: "Former Staff",
    email: "old.acct@jce.com.ph",
    role: "Accounting Staff",
    status: "Deactivated",
    last: "2026-01-14 09:00",
    emp: "JCE 00061",
  },
  {
    id: 12,
    name: "Ivan Locked",
    email: "ivan@jce.com.ph",
    role: "PMG Staff",
    status: "Locked",
    last: "2026-06-01 11:42",
    emp: "JCE 00048",
  },
];
const ALL_ROLE_NAMES = Object.values(ROLES)
  .map((r) => r.name)
  .concat([
    "Accounting Staff",
    "PMG Staff",
    "Purchasing Staff",
    "Finance / AP",
    "Management / President",
    "BDD Staff",
  ]);

function StatusChip({ s }) {
  const map = {
    Active: "success",
    Locked: "danger",
    Deactivated: "neutral",
    Pending: "pending",
  };
  return <span className={"chip chip-" + (map[s] || "neutral")}>{s}</span>;
}

function AdminUsers({ readOnly }) {
  const [users, setUsers] = useState(USERS);
  const [sel, setSel] = useState(null);
  const [q, setQ] = useState("");
  const [confirmRole, setConfirmRole] = useState(null);
  const filtered = users.filter((u) =>
    (u.name + u.email + u.role).toLowerCase().includes(q.toLowerCase()),
  );

  const applyRole = () => {
    setUsers(
      users.map((u) => (u.id === sel.id ? { ...u, role: confirmRole } : u)),
    );
    setSel({ ...sel, role: confirmRole });
    setConfirmRole(null);
  };

  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Admin · X5</div>
          <h2 className="ph-title">Users &amp; roles</h2>
        </div>
        <div className="ph-actions">
          <div className="top-search" style={{ maxWidth: 260 }}>
            <Icon name="search" size={15} />
            <input
              placeholder="Search users…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          {readOnly ? (
            <span className="ro-note">
              <Icon name="lock" size={13} /> Read-only — Admin provisions; you
              are viewing
            </span>
          ) : (
            <button className="btn btn-primary btn-sm">+ Create user</button>
          )}
        </div>
      </div>

      <div className="admin-split">
        <div className="solid table-wrap">
          <table className="jtable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email / username</th>
                <th>Role (one only)</th>
                <th>Status</th>
                <th>Last login</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className={sel && sel.id === u.id ? "row-sel" : ""}
                  onClick={() => setSel(u)}
                  style={{ cursor: "pointer" }}
                >
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ color: "var(--jce-ink-2)" }}>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <StatusChip s={u.status} />
                  </td>
                  <td
                    className="mono"
                    style={{ fontSize: 11, color: "var(--jce-ink-2)" }}
                  >
                    {u.last}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Roles reference (read-only matrix) */}
        <div className="glass roles-ref">
          <div className="panel-head">
            <h3>Role roster</h3>
            <span className="chip chip-neutral">19 roles · read-only</span>
          </div>
          <div className="roles-ref-list solid">
            {ALL_ROLE_NAMES.map((n, i) => (
              <div key={i} className="rr-row">
                <Icon name="dot" size={12} color="var(--jce-green-600)" /> {n}
              </div>
            ))}
          </div>
          <div className="rr-note">
            One role per user — effective permissions are exactly the assigned
            role's. No permission unions. Threshold bands are data —{" "}
            <span className="oq">OPEN-Q #17</span>
          </div>
        </div>
      </div>

      {/* Row drawer (glass frame, solid form) */}
      {sel && (
        <div className="jce-scrim" onClick={() => setSel(null)}>
          <div
            className="drawer glass-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-head">
              <div>
                <div className="user-av lg">
                  {sel.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <div className="drawer-name">{sel.name}</div>
                  <div className="drawer-sub">
                    {sel.email} · <span className="docchip">{sel.emp}</span>
                  </div>
                </div>
              </div>
              <button className="iconbtn" onClick={() => setSel(null)}>
                ✕
              </button>
            </div>
            <div className="solid drawer-body">
              <label className="lbl">
                Assign role{" "}
                <span style={{ fontWeight: 400, color: "var(--jce-ink-2)" }}>
                  (single-select — changes effective permissions)
                </span>
              </label>
              <select
                className="field"
                value={sel.role}
                disabled={readOnly}
                onChange={(e) => setConfirmRole(e.target.value)}
              >
                {ALL_ROLE_NAMES.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>

              <label className="lbl" style={{ marginTop: 16 }}>
                Linked employee record
              </label>
              <div
                className="field"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span className="docchip">{sel.emp}</span>
                <span
                  style={{
                    color: "var(--jce-green-700)",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  View →
                </span>
              </div>

              <label className="lbl" style={{ marginTop: 16 }}>
                Account status
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <StatusChip s={sel.status} />
              </div>

              {!readOnly && (
                <div className="drawer-acts">
                  <button className="btn btn-ghost btn-sm">
                    Reset password
                  </button>
                  {sel.status === "Locked" ? (
                    <button className="btn btn-primary btn-sm">Unlock</button>
                  ) : (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: "var(--st-pending-ink)" }}
                    >
                      Lock
                    </button>
                  )}
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: "var(--st-danger)", marginLeft: "auto" }}
                  >
                    Deactivate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Role change confirm */}
      {confirmRole && (
        <div className="jce-scrim">
          <div className="glass-modal idle-modal">
            <h3>Change role to “{confirmRole}”?</h3>
            <p>
              This immediately changes <strong>{sel.name}</strong>'s effective
              permissions across every module. The change is audited
              (NFR-SEC-06).
            </p>
            <div className="idle-acts">
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmRole(null)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={applyRole}>
                Change role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// X6 · SYSTEM SETTINGS
// ============================================================================
const SETTINGS_NAV = [
  { id: "sig", label: "Signatories" },
  { id: "appr", label: "Approval thresholds" },
  { id: "terms", label: "Payment terms" },
  { id: "cats", label: "Supplier categories" },
  { id: "banks", label: "JCE Banks" },
  { id: "units", label: "Units" },
  { id: "locs", label: "Locations / Warehouses" },
  { id: "ewt", label: "EWT rates" },
  { id: "fx", label: "FX policy" },
  { id: "notif", label: "Notification thresholds" },
];

const SETTINGS_DATA = {
  sig: {
    title: "Signatories",
    desc: "Per print template — names + positions feeding the print-only signature blocks (FR-PO-06).",
    cols: ["Template", "Block", "Name", "Position"],
    rows: [
      ["PO (Local)", "Prepared by", "N. Aquino", "Purchasing Supervisor"],
      ["PO (Local)", "Approved by", "J. Cruz", "President"],
      ["PO (Import)", "Verified by", "A. Reyes", "CFO"],
      ["PO (Import)", "Approved by", "J. Cruz", "President"],
      ["RFP", "Noted by", "Finance / AP", ""],
      ["MR · JCE-F-WMS02", "Checked by", "G. Lim", "Warehouse Admin"],
    ],
  },
  appr: {
    title: "Approval thresholds",
    desc: "Per entity type (PR/PO/RFP/Blanket): amount bands × ordered approver chain, per currency. Bands are data (7.15.4).",
    oq: "17",
    cols: ["Entity", "Currency", "Amount band", "Approver chain"],
    rows: [
      ["PO", "PHP", "≤ ₱50,000", "Supervisor"],
      ["PO", "PHP", "₱50,001 – ₱500,000", "Supervisor → CFO"],
      ["PO", "PHP", "> ₱500,000", "Supervisor → CFO → President"],
      ["PO (Import)", "USD", "Stage 4 & 7 gates", "CFO → President"],
      ["PRQ", "PHP", "≥ ₱20,000 (mandatory)", "Department Head"],
    ],
  },
  terms: {
    title: "Payment terms",
    desc: "Controlled Terms-of-Payment list (FR-SUP-08).",
    cols: ["Code", "Description", "Net days"],
    rows: [
      ["COD", "Cash on delivery", "0"],
      ["NET15", "Net 15", "15"],
      ["NET30", "Net 30", "30"],
      ["NET60", "Net 60", "60"],
      ["50/50", "50% DP · 50% on delivery", "—"],
      ["LC", "Letter of credit", "—"],
    ],
  },
  cats: {
    title: "Supplier categories",
    desc: "FR-SUP-09.",
    cols: ["Category", "Active"],
    rows: [
      ["Electrical equipment", "Yes"],
      ["Transformers & switchgear", "Yes"],
      ["Civil works", "Yes"],
      ["Consumables", "Yes"],
      ["Logistics / freight", "Yes"],
      ["Services", "Yes"],
    ],
  },
  banks: {
    title: "JCE Banks lookup",
    desc: "Bank name, SWIFT, country (7.15.2). Accounts to add per client input: BDO, 852-5, Land Bank 580 Workshop.",
    cols: ["Bank", "Account", "SWIFT", "Country"],
    rows: [
      ["BDO", "00xxx-xxxx-01", "BNORPHMM", "Philippines"],
      ["Land Bank (Workshop)", "580-xxxx", "TLBPPHMM", "Philippines"],
      ["BPI", "852-5", "BOPIPHMM", "Philippines"],
    ],
  },
  units: {
    title: "Units",
    desc: "Shared unit list (§6.3.2 / §10).",
    cols: ["Unit", "Label"],
    rows: [
      ["lot", "Lot"],
      ["set", "Set"],
      ["pcs", "Pieces"],
      ["kg", "Kilogram"],
      ["assy", "Assembly"],
      ["m", "Meter"],
      ["roll", "Roll"],
      ["drum", "Drum"],
    ],
  },
  locs: {
    title: "Locations / Warehouses",
    desc: "Main Office central + sites (FR-LOC-01). Site engineers are scoped to assigned locations.",
    cols: ["Code", "Location", "Type", "Active"],
    rows: [
      ["MAIN", "Main Office — Valenzuela", "Central", "Yes"],
      ["WS", "Workshop", "Internal", "Yes"],
      ["26-05-378", "Bulacan Substation", "Site", "Yes"],
      ["26-04-355", "Cavite Line", "Site", "Yes"],
      ["MOTORPOOL", "Motorpool", "Internal", "Yes"],
    ],
  },
  ewt: {
    title: "EWT rates",
    desc: "Expanded withholding tax (FR-RFP-06).",
    cols: ["Type", "Rate"],
    rows: [
      ["Goods", "1%"],
      ["Services", "2%"],
      ["Rentals", "5%"],
      ["Professional (≤₱3M)", "5%"],
      ["Professional (>₱3M)", "10%"],
    ],
  },
  fx: {
    title: "FX policy",
    desc: "Dual snapshot — PO-date rate + payment-date rate (FR-X-06). Display only; rates captured per document.",
    cols: ["Snapshot", "Source", "When captured"],
    rows: [
      ["PO-date rate", "BSP reference", "On PO issue"],
      ["Payment-date rate", "BSP reference", "On disbursement"],
    ],
  },
  notif: {
    title: "Notification thresholds",
    desc: "Stall days, ETA leads (FR-X-03, FR-IMP-05).",
    cols: ["Trigger", "Threshold"],
    rows: [
      ["PO pending stall", "> 2 days"],
      ["Shipment ETA leads", "7 / 3 / 1 day"],
      ["Contract expiry alert", "< 6 months"],
      ["Stale reservation", "> 14 days"],
    ],
  },
};

function AdminSettings({ readOnly }) {
  const [tab, setTab] = useState("sig");
  const d = SETTINGS_DATA[tab];
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Admin · X6</div>
          <h2 className="ph-title">System settings</h2>
        </div>
        {readOnly && (
          <span className="ro-note">
            <Icon name="lock" size={13} /> Read-only
          </span>
        )}
      </div>
      <div className="settings-split">
        <nav className="glass settings-nav">
          {SETTINGS_NAV.map((s) => (
            <button
              key={s.id}
              className={"set-navitem" + (tab === s.id ? " on" : "")}
              onClick={() => setTab(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="settings-body">
          <div className="set-head">
            <div>
              <h3>
                {d.title} {d.oq && <span className="oq">OPEN-Q #{d.oq}</span>}
              </h3>
              <p>{d.desc}</p>
            </div>
            {!readOnly && (
              <button className="btn btn-primary btn-sm">+ Add</button>
            )}
          </div>
          <div className="solid table-wrap">
            <table className="jtable">
              <thead>
                <tr>
                  {d.cols.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                  {!readOnly && <th style={{ width: 60 }}></th>}
                </tr>
              </thead>
              <tbody>
                {d.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={
                          /₱|%|days|\d/.test(cell) && j === d.cols.length - 1
                            ? ""
                            : ""
                        }
                      >
                        {cell || (
                          <span style={{ color: "var(--jce-ink-2)" }}>—</span>
                        )}
                      </td>
                    ))}
                    {!readOnly && (
                      <td>
                        <span className="rowedit">Edit</span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="set-foot">
            CRUD per lookup with soft-delete / active flags. In-flight approval
            chains are never retroactively changed (FR-APV-06).
          </div>
        </div>
      </div>
    </div>
  );
}

window.AdminUsers = AdminUsers;
window.AdminSettings = AdminSettings;
window.USERS = USERS;
