// ============================================================================
// JCE SYSTEM — HR · H7 register · H8–H11 forms · H12 My HR · H13 submit · H14 audit
// ============================================================================

const REQ_TABS = [
  "OB/Travel",
  "Overtime",
  "Request for Leave",
  "LOA Without Pay",
];
const REQ_TONE = {
  Pending: "pending",
  Approved: "success",
  Recorded: "success",
};

// signer chains (print-only wet-signature blocks)
const SIGNERS = {
  "OB/Travel": [
    "Requester",
    "Approving Officer / Dept. Head",
    "Admin and Finance",
    "HR Acknowledger",
  ],
  Overtime: [
    "Requester",
    "Department Head",
    "Timekeeper (Noted by)",
    "HR Head (Approved by)",
  ],
  "Request for Leave": [
    "Employee's Signature",
    "Approved by (Dept Head)",
    "Checked by (HR Head)",
    "Noted by (President / VP)",
  ],
  "LOA Without Pay": [
    "Requester",
    "Approved by (Section Head)",
    "Noted by (Plant Operation Head)",
    "Acknowledged by (HR)",
  ],
};

// ---------------------------------------------------------------------------
// H7 · Register
// ---------------------------------------------------------------------------
function H7Register({ role, selfMode }) {
  const [tab, setTab] = useState("OB/Travel");
  const [status, setStatus] = useState("All");
  const [detail, setDetail] = useState(null);
  const rows = (REQUESTS[tab] || []).filter(
    (r) => status === "All" || r.status === status,
  );

  if (detail)
    return (
      <RequestForm
        type={tab}
        record={detail}
        role={role}
        onBack={() => setDetail(null)}
      />
    );

  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">
            HR · H7 · {selfMode ? "My requests" : "HR Requests"}
          </div>
          <h2 className="ph-title">
            {selfMode ? "My requests" : "HR Requests register"}
          </h2>
        </div>
        <div className="ph-actions">
          <select
            className="field"
            style={{ width: "auto" }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["All", "Pending", "Approved", "Recorded"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {(role === "hrhead" || role === "owner") && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                setDetail({
                  no: "NEW",
                  filed: "2026-06-03",
                  emp: "",
                  key: "",
                  status: "Pending",
                  scan: false,
                })
              }
            >
              + New record
            </button>
          )}
        </div>
      </div>

      <div
        className="tabbar glass-nav"
        style={{
          marginBottom: 14,
          alignSelf: "flex-start",
          display: "inline-flex",
        }}
      >
        {REQ_TABS.map((t) => (
          <span
            key={t}
            className={"tab" + (tab === t ? " on" : "")}
            onClick={() => setTab(t)}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Form number</th>
              <th>Date filed</th>
              <th>Employee(s)</th>
              <th>Key fields</th>
              <th>Status</th>
              <th>Scan</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                onClick={() => setDetail(r)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span className="docchip">{r.no}</span>
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {r.filed}
                </td>
                <td style={{ fontWeight: 600 }}>{r.emp}</td>
                <td style={{ color: "var(--jce-ink-2)" }}>{r.key}</td>
                <td>
                  <span className={"chip chip-" + REQ_TONE[r.status]}>
                    {r.status}
                  </span>
                </td>
                <td>
                  {r.scan ? (
                    <span
                      className="chip chip-success"
                      style={{ padding: "1px 7px" }}
                    >
                      ✓ attached
                    </span>
                  ) : (
                    <span
                      className="chip chip-pending"
                      style={{ padding: "1px 7px" }}
                    >
                      required
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="empty" style={{ padding: 40 }}>
            <div className="ill">▤</div>
            <div className="et">No {tab} records</div>
            <div className="ed">
              Pending intake appears here before signatures complete.
            </div>
          </div>
        )}
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Pending exists on all forms — digital intake precedes offline wet
        signatures. A scanned signed copy is required to reach Approved /
        Recorded.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// H8–H11 · Form record (adapts per type) — used by register + self-service
// ---------------------------------------------------------------------------
function SignerBlocks({ type }) {
  return (
    <div className="signer-zone">
      <div className="signer-head">
        Signatories{" "}
        <span className="print-only-tag">
          print-only · offline wet signature
        </span>
      </div>
      <div className="signer-grid">
        {SIGNERS[type].map((s, i) => (
          <div key={i} className="signer">
            <div className="sig-line"></div>
            <div className="sig-role">{s}</div>
            <div className="sig-date">Date: ____________</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RequestForm({ type, record, role, onBack, selfMode }) {
  const isNew = record.no === "NEW";
  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Back
      </button>
      <div className="page-head glass">
        <div>
          <div className="kicker">
            HR ·{" "}
            {
              {
                "OB/Travel": "H8",
                Overtime: "H9",
                "Request for Leave": "H10",
                "LOA Without Pay": "H11",
              }[type]
            }
          </div>
          <h2 className="ph-title">
            {type} {!isNew && <span className="docchip">{record.no}</span>}
          </h2>
        </div>
        <div className="ph-actions">
          {!isNew && (
            <span className={"chip chip-" + REQ_TONE[record.status]}>
              {record.status}
            </span>
          )}
          <button className="btn btn-primary btn-sm">
            {isNew ? (selfMode ? "Submit → Pending" : "Save Pending") : "Save"}
          </button>
        </div>
      </div>

      {/* status timeline */}
      {!isNew && (
        <div className="solid statusline">
          <div className={"sl-step done"}>
            <span className="sl-dot">✓</span> Filed · {record.filed}
          </div>
          <div className="sl-bar"></div>
          <div className={"sl-step " + (record.scan ? "done" : "curr")}>
            <span className="sl-dot">{record.scan ? "✓" : "○"}</span> Signed
            scan uploaded
          </div>
          <div className="sl-bar"></div>
          <div
            className={
              "sl-step " + (record.status !== "Pending" ? "done" : "todo")
            }
          >
            <span className="sl-dot">
              {record.status !== "Pending" ? "✓" : "○"}
            </span>{" "}
            {type === "OB/Travel" || type === "Overtime"
              ? "Approved"
              : "Recorded"}
          </div>
        </div>
      )}

      <div className="solid form-body" style={{ maxWidth: 880 }}>
        {/* form-level fields, per type */}
        <div className="form-section-title">Form details</div>
        <div className="form-grid">
          <L l="Form number">
            <input
              className="field"
              defaultValue={isNew ? "" : record.no}
              placeholder={
                {
                  "OB/Travel": "OB-2026-001",
                  Overtime: "OT FORM NO. 2026-001",
                  "Request for Leave": "RFL-26-001",
                  "LOA Without Pay": "LOA-WP-2026-001",
                }[type]
              }
            />
          </L>
          <L l="Date filed">
            <input
              className="field"
              type="date"
              defaultValue={isNew ? "2026-06-03" : record.filed}
            />
          </L>

          {type === "OB/Travel" && (
            <React.Fragment>
              <L l="Reasons for leaving">
                <input className="field" />
              </L>
              <L l="Project Name">
                <select className="field">
                  {PROJECTS.map((p) => (
                    <option key={p.so}>{p.label}</option>
                  ))}
                </select>
              </L>
              <L l="Sales Order #">
                <select className="field">
                  {PROJECTS.map((p) => (
                    <option key={p.so}>
                      {p.so} · {p.label}
                    </option>
                  ))}
                </select>
              </L>
              <L l="Destination">
                <input className="field" />
              </L>
              <L l="Departure (date & time)">
                <input className="field" type="datetime-local" />
              </L>
              <L l="Return (date & time)">
                <input className="field" type="datetime-local" />
              </L>
            </React.Fragment>
          )}

          {type === "Overtime" && (
            <React.Fragment>
              <L l="Section">
                <select className="field">
                  <option>Servicing</option>
                  <option>Shop / Office</option>
                  <option>Project site</option>
                </select>
              </L>
              <L l="Project">
                <select className="field">
                  {PROJECTS.map((p) => (
                    <option key={p.so}>{p.label}</option>
                  ))}
                </select>
              </L>
              <L l="Date of overtime">
                <input className="field" type="date" />
              </L>
              <L l="OT Type">
                <select className="field">
                  <option>Pre-approved</option>
                  <option>After-the-fact</option>
                </select>
              </L>
              <L l="Overtime Request From / To">
                <input className="field" placeholder="18:00 – 22:00" />
              </L>
              <L l="Actual Time From / To">
                <input className="field" placeholder="18:10 – 22:05" />
              </L>
              <L l="Reason for rendering overtime">
                <input className="field" />
              </L>
            </React.Fragment>
          )}

          {type === "Request for Leave" && (
            <React.Fragment>
              <L l="Employee">
                <input
                  className="field"
                  defaultValue={record.emp}
                  placeholder="auto: Name, Position, Dept., Length of Service"
                />
              </L>
              <L l="Type of Leave">
                <select className="field">
                  <option>Vacation Leave</option>
                  <option>Sick Leave</option>
                  <option>Others (specify)</option>
                </select>
              </L>
              <L l="Pay type">
                <select className="field">
                  <option>With Pay</option>
                  <option>Without Pay</option>
                </select>
              </L>
              <L l="Applied Period From / To">
                <input
                  className="field"
                  type="text"
                  placeholder="2026-06-10 – 2026-06-12"
                />
              </L>
              <L l="Leave Category (No. of Days)" computed>
                <div className="field is-computed">
                  auto: working days excl. Sundays — editable
                </div>
              </L>
              <L l="Request Type">
                <select className="field">
                  <option>Pre-approved</option>
                  <option>After-the-fact (needs proof)</option>
                </select>
              </L>
            </React.Fragment>
          )}

          {type === "LOA Without Pay" && (
            <React.Fragment>
              <L l="Internal ID">
                <input className="field" placeholder="LOA-WP-2026-001" />
              </L>
              <L l="Employee">
                <input
                  className="field"
                  defaultValue={record.emp}
                  placeholder="Position auto-fills"
                />
              </L>
              <L l="Date of Absence From / To">
                <input
                  className="field"
                  placeholder="2026-06-15 – 2026-06-19"
                />
              </L>
              <L l="No. of Days" computed>
                <div className="field is-computed">
                  auto working days — override allowed
                </div>
              </L>
              <L l="Leave Type">
                <select className="field">
                  <option>Vacation</option>
                  <option>Sick</option>
                  <option>Paternity</option>
                  <option>Maternity</option>
                  <option>Others</option>
                </select>
              </L>
              <L l="Reason">
                <input className="field" />
              </L>
            </React.Fragment>
          )}
        </div>

        {/* employee list for team forms */}
        {(type === "OB/Travel" || type === "Overtime") && (
          <React.Fragment>
            <div className="form-section-title">
              Employees on this form{" "}
              <span className="muted">(name / position auto-populate)</span>
            </div>
            <div className="emp-list-mini">
              <div className="elm-row head">
                <span>Employee</span>
                <span>Position</span>
                <span>Place of Assignment</span>
              </div>
              <div className="elm-row">
                <span>N. Bautista</span>
                <span>Lineman</span>
                <span>26-05-378 · Bulacan</span>
              </div>
              <div className="elm-row">
                <span>A. Tolentino</span>
                <span>Lineman</span>
                <span>25-11-290 · Tarlac</span>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ margin: 8 }}>
                + Add employee
              </button>
            </div>
            <div className="muted-note">
              {type === "OB/Travel"
                ? "Shared form-level fields are one team / one trip — not per row. OB does not auto-create timekeeping rows."
                : "OT does not auto-create timekeeping rows; each employee signs their own row on paper."}
            </div>
          </React.Fragment>
        )}

        {(type === "Request for Leave" || type === "LOA Without Pay") && (
          <div className="autorow-note solid">
            <Icon name="check" size={15} color="var(--st-success)" />
            <span>
              On save this <strong>auto-creates Timekeeping rows</strong> for
              each working day in range — Leave Status “
              {type === "LOA Without Pay"
                ? "Leave Without Pay"
                : "Leave With Pay / Without Pay"}
              ”, distribution zeros, source{" "}
              {type === "LOA Without Pay" ? "LOA" : "RFL"} reference — flowing
              into H6 batches. No leave balances (recording-only).
            </span>
          </div>
        )}

        {/* proof for after-the-fact */}
        {type === "Request for Leave" && (
          <div className="form-section-title">
            Proof / Evidence{" "}
            <span className="muted">(after-the-fact only)</span>
          </div>
        )}

        {/* scan uploader */}
        <div className="form-section-title">Signed scan</div>
        <div className="uploader">
          <div className="u1">⤓ Drop signed scan or browse</div>
          <div className="u2">
            PDF / JPG / PNG · ≤10 MB each · multiple files{" "}
            <span className="req">
              REQUIRED to reach{" "}
              {type === "OB/Travel" || type === "Overtime"
                ? "Approved"
                : "Recorded"}
            </span>
          </div>
        </div>

        {/* print-only signers */}
        <SignerBlocks type={type} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// H12 · Self-service — My HR
// ---------------------------------------------------------------------------
function H12MyHR({ onSubmit }) {
  const [view, setView] = useState("home");
  const me = EMPLOYEES.find((e) => e.id === 9); // demo "self" = Noel Bautista
  if (view === "requests")
    return (
      <div className="screen">
        <button className="back-link" onClick={() => setView("home")}>
          ← My HR
        </button>
        <H7Register role="employee" selfMode />
      </div>
    );

  return (
    <div className="screen">
      <div className="home-greet">
        <h1>My HR</h1>
        <p>
          Your own records — payslips, leave, timekeeping and requests.{" "}
          <span className="scope-pill">Own records only</span>
        </p>
      </div>

      <div className="kpi-row">
        <div className="kpi-tile glass">
          <div className="kpi-k">Pending requests</div>
          <div className="kpi-v">1</div>
          <div className="kpi-d" style={{ color: "var(--st-pending-ink)" }}>
            RFL-26-044 recorded
          </div>
        </div>
        <div className="kpi-tile glass">
          <div className="kpi-k">Last payslip</div>
          <div className="kpi-v" style={{ fontSize: 22 }}>
            May 30
          </div>
          <div className="kpi-d" style={{ color: "var(--jce-ink-2)" }}>
            available to view
          </div>
        </div>
        <button className="kpi-tile glass cta-tile" onClick={onSubmit}>
          <div className="kpi-k">Submit a request</div>
          <div className="kpi-v" style={{ fontSize: 20 }}>
            OB · OT · Leave
          </div>
          <div className="kpi-d" style={{ color: "var(--jce-green-700)" }}>
            New request →
          </div>
        </button>
      </div>

      <div className="home-cols">
        <div className="glass home-panel">
          <div className="panel-head">
            <h3>My requests</h3>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setView("requests")}
            >
              View all
            </button>
          </div>
          <div className="solid approval-list">
            <div className="approval-row">
              <span className="docchip">RFL-26-044</span>
              <div className="ap-main">
                <div className="ap-t">Sick Leave · 1 day</div>
                <div className="ap-m">Request for Leave</div>
              </div>
              <span className="chip chip-success">Recorded</span>
            </div>
            <div className="approval-row">
              <span className="docchip">OT-2026-019</span>
              <div className="ap-main">
                <div className="ap-t">Night energization</div>
                <div className="ap-m">Overtime</div>
              </div>
              <span className="chip chip-success">Approved</span>
            </div>
          </div>
        </div>
        <div className="glass home-panel">
          <div className="panel-head">
            <h3>My payslips</h3>
            <span className="chip chip-neutral">read-only</span>
          </div>
          <div className="solid approval-list">
            <div className="approval-row">
              <span className="docchip">PSL · May 30</span>
              <div className="ap-main">
                <div className="ap-t">Daily 06–20 cut-off</div>
                <div className="ap-m">Approved payslip</div>
              </div>
              <button className="btn btn-ghost btn-sm">View / PDF</button>
            </div>
            <div className="approval-row">
              <span className="docchip">PSL · May 15</span>
              <div className="ap-main">
                <div className="ap-t">Daily 21–05 cut-off</div>
                <div className="ap-m">Approved payslip</div>
              </div>
              <button className="btn btn-ghost btn-sm">View / PDF</button>
            </div>
          </div>
        </div>
      </div>

      <div className="glass home-panel" style={{ marginTop: 16 }}>
        <div className="panel-head">
          <h3>My timekeeping</h3>
          <span className="chip chip-neutral">read-only · own rows</span>
        </div>
        <div className="solid table-wrap">
          <table className="jtable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th className="num">In</th>
                <th className="num">Out</th>
                <th className="num">Reg</th>
                <th className="num">OT</th>
                <th>Leave</th>
              </tr>
            </thead>
            <tbody>
              {TIME_ROWS.slice(1, 6).map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.day} {r.date.slice(8)}
                  </td>
                  <td>{r.proj === "—" ? "—" : projLabel(r.proj)}</td>
                  <td className="num">{r.in}</td>
                  <td className="num">{r.out}</td>
                  <td className="num">{r.reg.toFixed(1)}</td>
                  <td className="num">{r.ot.toFixed(1)}</td>
                  <td>{r.leave || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// H13 · submit chooser
function H13Chooser({ onPick, onBack }) {
  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← My HR
      </button>
      <div className="home-greet">
        <h1>Submit a request</h1>
        <p>
          Pick a form. After you submit, the paper chain is signed offline; HR
          uploads the signed scan and your record flips to Approved / Recorded.
        </p>
      </div>
      <div className="chooser-grid">
        {REQ_TABS.map((t) => (
          <button
            key={t}
            className="glass chooser-card"
            onClick={() => onPick(t)}
          >
            <div className="chooser-ic">
              <Icon
                name={
                  t === "Request for Leave" || t === "LOA Without Pay"
                    ? "self"
                    : "pmg"
                }
                size={22}
                color="var(--jce-green-700)"
              />
            </div>
            <div className="chooser-t">{t}</div>
            <div className="chooser-d">
              {
                {
                  "OB/Travel": "Off-site work — still a working day",
                  Overtime: "Pre-approved or after-the-fact",
                  "Request for Leave": "Vacation / Sick · With or Without Pay",
                  "LOA Without Pay": "Unpaid leave of absence",
                }[t]
              }
            </div>
            <div className="chooser-go">Start →</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// H14 · HR audit log
// ---------------------------------------------------------------------------
function H14Audit() {
  const [action, setAction] = useState("All");
  const actions = [
    "All",
    ...Array.from(new Set(HR_AUDIT.map((a) => a.action))),
  ];
  const rows = HR_AUDIT.filter((a) => action === "All" || a.action === action);
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">HR · H14</div>
          <h2 className="ph-title">HR audit log</h2>
        </div>
        <div className="ph-actions">
          <select
            className="field"
            style={{ width: "auto" }}
            value={action}
            onChange={(e) => setAction(e.target.value)}
          >
            {actions.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          <button className="btn btn-ghost btn-sm">Export</button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Affected record</th>
              <th>Action</th>
              <th>Before → After</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 11 }}>
                  {a.ts}
                </td>
                <td>{a.actor}</td>
                <td>
                  <span className="docchip">{a.rec}</span>
                </td>
                <td>
                  <span className="chip chip-neutral">{a.action}</span>
                </td>
                <td>{a.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Append-only · entries immutable · read-only.
      </div>
    </div>
  );
}

Object.assign(window, {
  H7Register,
  RequestForm,
  H12MyHR,
  H13Chooser,
  H14Audit,
  projLabel,
});
