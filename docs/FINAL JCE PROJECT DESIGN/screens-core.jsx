// ============================================================================
// JCE SYSTEM — Cross-cutting screens: X2 Login · X3 Home · X4 Notifications
//              X5 Admin Users & Roles · X6 Admin System Settings
// ============================================================================

// ---- ₱ formatter -----------------------------------------------------------
const peso = (n) =>
  "₱" +
  Math.abs(n).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ============================================================================
// X2 · LOGIN
// ============================================================================
function Login({ onAuth }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [tries, setTries] = useState(0);
  const [locked, setLocked] = useState(false);
  const [cool, setCool] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!locked) return;
    if (cool <= 0) {
      setLocked(false);
      setTries(0);
      setErr("");
      return;
    }
    const t = setTimeout(() => setCool((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [locked, cool]);

  const submit = (e) => {
    e.preventDefault();
    if (locked) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      // demo: any non-empty creds authenticate; "fail" username forces error path
      if (u.trim() && p.trim() && u.trim().toLowerCase() !== "fail") {
        onAuth();
        return;
      }
      const t = tries + 1;
      setTries(t);
      if (t >= 3) {
        setLocked(true);
        setCool(30);
        setErr("");
      } else setErr("The username or password you entered is incorrect.");
    }, 600);
  };

  return (
    <div className="login-stage jce-backdrop">
      <div className="jce-glow-3"></div>
      <form className="login-card glass" onSubmit={submit}>
        <div className="login-brand">
          <img src="assets/jce-logo.jpg" alt="JCE" />
          <div>
            <div className="login-title">JCE System</div>
            <div className="login-sub">JC Electrofields Power System, Inc.</div>
          </div>
        </div>

        <div className="login-form solid">
          {locked ? (
            <div className="login-lock">
              <Icon name="lock" size={20} color="var(--st-danger)" />
              <div>
                <div className="ll-t">Account temporarily locked</div>
                <div className="ll-d">
                  Too many attempts. Try again in <strong>{cool}s</strong>.
                </div>
              </div>
            </div>
          ) : (
            <React.Fragment>
              <label className="lbl">Username or Email</label>
              <input
                className="field"
                value={u}
                onChange={(e) => setU(e.target.value)}
                placeholder="firstname.lastname"
                autoFocus
              />
              <label className="lbl" style={{ marginTop: 14 }}>
                Password
              </label>
              <input
                className="field"
                type="password"
                value={p}
                onChange={(e) => setP(e.target.value)}
                placeholder="••••••••"
              />
              {err && (
                <div className="login-err">
                  <Icon name="dot" size={14} color="var(--st-danger)" /> {err}
                </div>
              )}
              <button
                className="btn btn-primary"
                type="submit"
                style={{ width: "100%", marginTop: 18 }}
                disabled={busy}
              >
                {busy ? "Signing in…" : "Sign in"}
              </button>
              <a
                className="login-forgot"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </React.Fragment>
          )}
        </div>
        <div className="login-foot">
          Authorized access only · activity is audited (NFR-SEC). MFA for
          Owner/Admin recommended — <span className="oq">OPEN-Q #15</span>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// X3 · ROLE-AWARE HOME
// ============================================================================
const HOME = {
  owner: {
    hi: "Good morning",
    kpis: [
      {
        k: "Approvals waiting on you",
        v: "8",
        d: "across 4 modules",
        tone: "pending",
      },
      { k: "Collections this week", v: "₱2.41M", d: "▲ 18%", tone: "success" },
      { k: "Projects needing update", v: "3", d: "period due", tone: "info" },
      { k: "Documents awaiting lock", v: "5", d: "Warehouse", tone: "neutral" },
    ],
    approvals: [
      {
        doc: "RFP-PUR-26020188",
        t: "Shenda Electric — transformer lot",
        amt: 4200000,
        age: "2d",
        mod: "Purchasing",
      },
      {
        doc: "PV-2026-0442",
        t: "Payable voucher — fuel & lubricants",
        amt: 318450,
        age: "1d",
        mod: "Accounting",
      },
      {
        doc: "VO-26-05-378-02",
        t: "Variation order — Bulacan substation",
        amt: 1240000,
        age: "4h",
        mod: "PMG",
      },
    ],
  },
  hrhead: {
    hi: "Good morning",
    kpis: [
      {
        k: "Pending HR requests",
        v: "6",
        d: "OB · OT · Leave",
        tone: "pending",
      },
      { k: "Contracts expiring", v: "2", d: "< 6 months", tone: "danger" },
      { k: "Batches to oversee", v: "4", d: "this pay period", tone: "info" },
      { k: "New hires (mo)", v: "3", d: "probationary", tone: "neutral" },
    ],
    approvals: [
      {
        doc: "OB-2026-014",
        t: "Site visit — Cavite line · 5 employees",
        amt: null,
        age: "3h",
        mod: "HR · OB/Travel",
      },
      {
        doc: "RFL-26-051",
        t: "Vacation leave — R. dela Cruz",
        amt: null,
        age: "1d",
        mod: "HR · Leave",
      },
      {
        doc: "OT-2026-022",
        t: "Overtime — shop fabrication · 8 staff",
        amt: null,
        age: "2d",
        mod: "HR · Overtime",
      },
    ],
  },
  acctglead: {
    hi: "Good morning",
    kpis: [
      { k: "Vouchers pending approval", v: "9", d: "PV + JV", tone: "pending" },
      { k: "Collections this week", v: "₱2.41M", d: "▲ 18%", tone: "success" },
      { k: "Disbursements to post", v: "4", d: "bank recon", tone: "info" },
      { k: "RFPs due", v: "3", d: "≤ 5 days", tone: "danger" },
    ],
    approvals: [
      {
        doc: "PV-2026-0442",
        t: "Payable voucher — fuel & lubricants",
        amt: 318450,
        age: "1d",
        mod: "Accounting",
      },
      {
        doc: "JV-2026-0188",
        t: "CA liquidation — site mobilization",
        amt: 95000,
        age: "5h",
        mod: "Accounting",
      },
      {
        doc: "CV-0903",
        t: "Retention release — Meralco",
        amt: 677000,
        age: "1d",
        mod: "Accounting",
      },
    ],
  },
  payroll: {
    hi: "Good morning",
    kpis: [
      {
        k: "Verified batches ready",
        v: "12",
        d: "for payroll run",
        tone: "success",
      },
      { k: "Loans active", v: "34", d: "this cut-off", tone: "neutral" },
      { k: "Payslips to release", v: "124", d: "30th cut-off", tone: "info" },
      { k: "Cut-off ends", v: "Jun 7", d: "monthly 23–07", tone: "pending" },
    ],
    approvals: [],
  },
  pmhead: {
    hi: "Good morning",
    kpis: [
      {
        k: "Projects needing a period update",
        v: "3",
        d: "accomplishment due",
        tone: "pending",
      },
      { k: "Variation orders to approve", v: "2", d: "awaiting", tone: "info" },
      { k: "To-Date near 100%", v: "1", d: "guardrail", tone: "danger" },
      { k: "MRs to verify", v: "5", d: "material requests", tone: "neutral" },
    ],
    approvals: [
      {
        doc: "VO-26-05-378-02",
        t: "Variation order — Bulacan substation",
        amt: 1240000,
        age: "4h",
        mod: "PMG",
      },
      {
        doc: "ACR-26-05-378-P4",
        t: "Accomplishment period #4 — submit",
        amt: null,
        age: "1d",
        mod: "PMG",
      },
    ],
  },
  purchsup: {
    hi: "Good morning",
    kpis: [
      {
        k: "POs awaiting approval",
        v: "12",
        d: "▲ 4 since Mon",
        tone: "pending",
      },
      { k: "Shipments arriving", v: "4", d: "ETA ≤ 7 days", tone: "info" },
      { k: "Blocked import stages", v: "1", d: "needs docs", tone: "danger" },
      { k: "Suppliers to review", v: "2", d: "data quality", tone: "neutral" },
    ],
    approvals: [
      {
        doc: "PO-IMP-26-0188",
        t: "Shenda Electric — transformer lot",
        amt: 4200000,
        age: "2d",
        mod: "Purchasing",
      },
      {
        doc: "PO-LOC-26-0204",
        t: "Local — consumables",
        amt: 86200,
        age: "6h",
        mod: "Purchasing",
      },
    ],
  },
  warehouse: {
    hi: "Good morning",
    kpis: [
      {
        k: "Documents awaiting lock",
        v: "5",
        d: "MRR · Release",
        tone: "pending",
      },
      {
        k: "MRs awaiting verification",
        v: "3",
        d: "available stock",
        tone: "info",
      },
      { k: "Transfers unconfirmed", v: "2", d: "site → site", tone: "neutral" },
      { k: "Stale reservations", v: "1", d: "> 14 days", tone: "danger" },
    ],
    approvals: [
      {
        doc: "MRR-2026-0144",
        t: "Goods receipt — transformer lot · For Checking",
        amt: null,
        age: "3h",
        mod: "Warehouse",
      },
      {
        doc: "REL-2026-0071",
        t: "Release form — Bulacan site",
        amt: null,
        age: "1d",
        mod: "Warehouse",
      },
    ],
  },
  siteeng: {
    hi: "Good morning",
    kpis: [
      { k: "My open documents", v: "2", d: "assigned sites", tone: "info" },
      { k: "Awaiting checking", v: "1", d: "submitted", tone: "pending" },
      { k: "My site", v: "Bulacan", d: "26-05-378", tone: "neutral" },
    ],
    approvals: [],
    scoped: true,
  },
  bddlead: {
    hi: "Good morning",
    kpis: [
      { k: "Open inquiries", v: "7", d: "from website", tone: "pending" },
      { k: "Quotations in review", v: "4", d: "EC · WS · Solar", tone: "info" },
      {
        k: "Offers awarded (mo)",
        v: "2",
        d: "→ Sales Orders",
        tone: "success",
      },
      { k: "Sensitive changes", v: "1", d: "contract amount", tone: "danger" },
    ],
    approvals: [
      {
        doc: "OFR-2026-021",
        t: "Offer — 230KV substation · approve issue",
        amt: 13540000,
        age: "5h",
        mod: "BDD",
      },
    ],
  },
  employee: {
    hi: "Hi",
    empty: true,
    kpis: [
      { k: "My pending requests", v: "0", d: "all clear", tone: "success" },
      { k: "Last payslip", v: "May 30", d: "available", tone: "neutral" },
    ],
    approvals: [],
  },
  timekeeper: {
    hi: "Good morning",
    kpis: [
      { k: "Batches to verify", v: "4", d: "this period", tone: "pending" },
      { k: "Open week entries", v: "11", d: "in progress", tone: "info" },
      {
        k: "Leave rows auto-added",
        v: "6",
        d: "from RFL/LOA",
        tone: "neutral",
      },
    ],
    approvals: [],
  },
  admin: {
    hi: "Good morning",
    kpis: [
      { k: "Active users", v: "118", d: "of 124 staff", tone: "success" },
      { k: "Locked accounts", v: "2", d: "review", tone: "danger" },
      { k: "Pending invites", v: "3", d: "not yet logged in", tone: "pending" },
      { k: "Role changes (mo)", v: "5", d: "audited", tone: "neutral" },
    ],
    approvals: [],
  },
};

function KpiTile({ k, v, d, tone }) {
  const toneColor = {
    pending: "var(--st-pending-ink)",
    success: "var(--st-success)",
    danger: "var(--st-danger)",
    info: "var(--st-info)",
    neutral: "var(--jce-ink-2)",
  }[tone];
  return (
    <div className="kpi-tile glass">
      <div className="kpi-k">{k}</div>
      <div className="kpi-v">{v}</div>
      <div className="kpi-d" style={{ color: toneColor }}>
        {d}
      </div>
    </div>
  );
}

function Home({ role, onOpenNotifs }) {
  const cfg = HOME[role] || HOME.employee;
  const r = ROLES[role];
  return (
    <div className="screen">
      <div className="home-greet">
        <h1>
          {cfg.hi}, <span className="g">{r.short}</span>.
        </h1>
        <p>
          Here's what needs you today.{" "}
          {cfg.scoped && (
            <span className="scope-pill">Scoped to assigned sites</span>
          )}
        </p>
      </div>

      <div className="kpi-row">
        {cfg.kpis.map((t, i) => (
          <KpiTile key={i} {...t} />
        ))}
      </div>

      <div className="home-cols">
        {/* My approvals — glass card wrapping a solid list */}
        <div className="glass home-panel">
          <div className="panel-head">
            <h3>My approvals</h3>
            {cfg.approvals.length > 0 && (
              <span className="chip chip-pending">
                {cfg.approvals.length} waiting
              </span>
            )}
          </div>
          {cfg.approvals.length === 0 ? (
            <div className="empty">
              <div className="ill">◷</div>
              <div className="et">All caught up</div>
              <div className="ed">Nothing waiting on your approval.</div>
            </div>
          ) : (
            <div className="solid approval-list">
              {cfg.approvals.map((a, i) => (
                <div key={i} className="approval-row">
                  <span className="docchip">{a.doc}</span>
                  <div className="ap-main">
                    <div className="ap-t">{a.t}</div>
                    <div className="ap-m">
                      {a.mod} · waiting {a.age}
                    </div>
                  </div>
                  {a.amt != null && (
                    <div className="ap-amt money">{peso(a.amt)}</div>
                  )}
                  <button className="btn btn-approve btn-sm">Approve</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent notifications */}
        <div className="glass home-panel">
          <div className="panel-head">
            <h3>Recent notifications</h3>
            <button className="btn btn-ghost btn-sm" onClick={onOpenNotifs}>
              View all
            </button>
          </div>
          <div className="solid notif-mini">
            {NOTIFS.slice(0, 4).map((n) => (
              <div
                key={n.id}
                className={"nm-row" + (n.unread ? " unread" : "")}
              >
                <span
                  className={"nm-dot chip chip-" + n.tone}
                  style={{ padding: 0, width: 8, height: 8 }}
                ></span>
                <div>
                  <div className="nm-t">{n.msg}</div>
                  <div className="nm-time">
                    {n.mod} · {n.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// X4 · NOTIFICATIONS
// ============================================================================
const NOTIFS = [
  {
    id: 1,
    mod: "Purchasing",
    type: "Approval",
    tone: "pending",
    unread: true,
    msg: "PO-IMP-26-0188 pending approval > 2 days",
    time: "10 min ago",
    doc: "PO-IMP-26-0188",
  },
  {
    id: 2,
    mod: "Warehouse",
    type: "Lock",
    tone: "info",
    unread: true,
    msg: "MRR-2026-0144 awaiting checking & lock",
    time: "42 min ago",
    doc: "MRR-2026-0144",
  },
  {
    id: 3,
    mod: "HR",
    type: "Contract",
    tone: "danger",
    unread: true,
    msg: "Contract expiring < 6 months — R. dela Cruz",
    time: "1 hr ago",
    doc: null,
  },
  {
    id: 4,
    mod: "PMG",
    type: "Period",
    tone: "pending",
    unread: false,
    msg: "Accomplishment period #4 submitted for 26-05-378",
    time: "3 hr ago",
    doc: "26-05-378",
  },
  {
    id: 5,
    mod: "BDD",
    type: "Sensitive",
    tone: "danger",
    unread: false,
    msg: "Contract Amount edited on OFR-2026-021",
    time: "5 hr ago",
    doc: "OFR-2026-021",
  },
  {
    id: 6,
    mod: "Accounting",
    type: "Approval",
    tone: "pending",
    unread: false,
    msg: "3 vouchers awaiting your approval",
    time: "Yesterday",
    doc: null,
  },
  {
    id: 7,
    mod: "Purchasing",
    type: "Shipment",
    tone: "info",
    unread: false,
    msg: "Shipment ETA approaching (7-day lead) — PO-IMP-26-0177",
    time: "Yesterday",
    doc: "PO-IMP-26-0177",
  },
  {
    id: 8,
    mod: "Warehouse",
    type: "Transfer",
    tone: "neutral",
    unread: false,
    msg: "Stock transfer TRF-2026-0033 unconfirmed",
    time: "2 days ago",
    doc: "TRF-2026-0033",
  },
];

function BellDropdown({ onClose, onFull, items, onRead }) {
  return (
    <div className="bell-pop glass-modal">
      <div className="bell-head">
        <strong>Notifications</strong>
        <button className="linkbtn" onClick={onRead}>
          Mark all read
        </button>
      </div>
      <div className="solid bell-list">
        {items.slice(0, 10).map((n) => (
          <div key={n.id} className={"bell-row" + (n.unread ? " unread" : "")}>
            <span
              className={"chip chip-" + n.tone}
              style={{ padding: 0, width: 8, height: 8, marginTop: 6 }}
            ></span>
            <div className="bell-main">
              <div className="bell-msg">{n.msg}</div>
              <div className="bell-meta">
                {n.mod} · {n.type} · {n.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="bell-foot" onClick={onFull}>
        Open notifications center →
      </button>
    </div>
  );
}

function Notifications({ items, setItems }) {
  const [mod, setMod] = useState("All");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const mods = ["All", ...Array.from(new Set(items.map((n) => n.mod)))];
  const filtered = items.filter(
    (n) => (mod === "All" || n.mod === mod) && (!unreadOnly || n.unread),
  );
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Cross-cutting · X4</div>
          <h2 className="ph-title">Notifications</h2>
        </div>
        <div className="ph-actions">
          <div className="seg glass-nav">
            {mods.slice(0, 6).map((m) => (
              <button
                key={m}
                className={mod === m ? "on" : ""}
                onClick={() => setMod(m)}
              >
                {m}
              </button>
            ))}
          </div>
          <label className="toggle-lite">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
            />{" "}
            Unread only
          </label>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() =>
              setItems(items.map((n) => ({ ...n, unread: false })))
            }
          >
            Mark all read
          </button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th style={{ width: 32 }}></th>
              <th>Notification</th>
              <th>Module</th>
              <th>Type</th>
              <th>Reference</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((n) => (
              <tr
                key={n.id}
                style={n.unread ? { fontWeight: 600 } : null}
                onClick={() =>
                  setItems(
                    items.map((x) =>
                      x.id === n.id ? { ...x, unread: false } : x,
                    ),
                  )
                }
              >
                <td>{n.unread && <span className="unread-dot"></span>}</td>
                <td>{n.msg}</td>
                <td>{n.mod}</td>
                <td>
                  <span className={"chip chip-" + n.tone}>{n.type}</span>
                </td>
                <td>
                  {n.doc ? (
                    <span className="docchip">{n.doc}</span>
                  ) : (
                    <span style={{ color: "var(--jce-ink-2)" }}>—</span>
                  )}
                </td>
                <td style={{ color: "var(--jce-ink-2)", whiteSpace: "nowrap" }}>
                  {n.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty" style={{ padding: 48 }}>
            <div className="ill">◷</div>
            <div className="et">No notifications</div>
            <div className="ed">You're all caught up.</div>
          </div>
        )}
      </div>
    </div>
  );
}

window.Login = Login;
window.Home = Home;
window.Notifications = Notifications;
window.BellDropdown = BellDropdown;
window.NOTIFS = NOTIFS;
window.peso = peso;
window.KpiTile = KpiTile;
