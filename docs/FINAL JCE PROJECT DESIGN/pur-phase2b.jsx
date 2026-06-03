// ============================================================================
// JCE SYSTEM — Purchasing Phase 2 (part 2): U19 BIR 2307 · U20 lead-time
//   U21 budget vs actual · U22 mobile approvals · U23 cycle-time · U24 blanket POs
// ============================================================================

// ---- U19 · BIR withholding reporting (Form 2307) --------------------------
function U19BIR() {
  const [step, setStep] = useState(0);
  const STEPS = ["Period & scope", "2307 render", "Export"];
  const rows = [
    {
      supplier: "Cebu Steel Corp.",
      tin: "004-221-118-000",
      atc: "WI010",
      base: 312081,
      rate: "1%",
      tax: 3120.81,
    },
    {
      supplier: "Shenda Electric",
      tin: "—",
      atc: "WI020",
      base: 1764000,
      rate: "2%",
      tax: 35280.0,
    },
  ];
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U19 · Phase 2</div>
          <h2 className="ph-title">BIR withholding — Form 2307</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-post btn-sm">Export Excel / DAT</button>
        </div>
      </div>
      <div className="pay-stepper" style={{ marginBottom: 16 }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <button
              className={
                "pstep " + (i < step ? "done" : i === step ? "curr" : "todo")
              }
              onClick={() => setStep(i)}
            >
              <span className="pdot">{i < step ? "✓" : i + 1}</span>
              <span className="plabel">{s}</span>
            </button>
            {i < 2 && (
              <span className={"pline " + (i < step ? "done" : "")}></span>
            )}
          </React.Fragment>
        ))}
      </div>
      {step === 0 && (
        <div className="solid form-body">
          <div className="form-grid">
            <L l="Period">
              <select className="field">
                <option>May 2026</option>
                <option>Q2 2026</option>
              </select>
            </L>
            <L l="Supplier scope">
              <select className="field">
                <option>All suppliers</option>
                <option>Single supplier</option>
              </select>
            </L>
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ marginTop: 14 }}
            onClick={() => setStep(1)}
          >
            Generate 2307s →
          </button>
        </div>
      )}
      {step >= 1 && (
        <React.Fragment>
          <div className="solid table-wrap">
            <table className="jtable">
              <thead>
                <tr>
                  <th>Supplier (payee)</th>
                  <th>TIN</th>
                  <th>ATC</th>
                  <th className="num">Tax base</th>
                  <th>Rate</th>
                  <th className="num">Tax withheld</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{r.supplier}</td>
                    <td className="mono" style={{ fontSize: 11 }}>
                      {r.tin}
                    </td>
                    <td className="mono">{r.atc}</td>
                    <td className="num money">{pmoney(r.base)}</td>
                    <td>{r.rate}</td>
                    <td className="num money">{pmoney(r.tax)}</td>
                    <td>
                      <span className="chip chip-pending">To issue</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="grid-tot">
                  <td colSpan="5">Total withheld — May 2026</td>
                  <td className="num money">
                    {pmoney(rows.reduce((a, r) => a + r.tax, 0))}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="muted-note" style={{ marginTop: 10 }}>
            One 2307 per supplier per payment (agency layout) + periodic
            alphalist summary by supplier/ATC. Issuance-status tracker per
            supplier per period.
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

// ---- U20 · Lead-time & supplier reliability -------------------------------
function U20LeadTime() {
  const sup = [
    { name: "ABB Inc.", onTime: 92, avgDelay: 1.2, orders: 14, score: "A" },
    {
      name: "Shenda Electric",
      onTime: 74,
      avgDelay: 6.8,
      orders: 8,
      score: "B",
    },
    {
      name: "Cebu Steel Corp.",
      onTime: 88,
      avgDelay: 2.1,
      orders: 22,
      score: "A",
    },
    {
      name: "JinkoSolar Intl.",
      onTime: 67,
      avgDelay: 11.0,
      orders: 5,
      score: "C",
    },
  ];
  const tone = (s) =>
    s === "A" ? "success" : s === "B" ? "pending" : "danger";
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U20 · Phase 2</div>
          <h2 className="ph-title">Lead-time &amp; supplier reliability</h2>
        </div>
      </div>
      <div className="solid" style={{ padding: 18, marginBottom: 14 }}>
        <div className="card-title">Structured lead-time editor</div>
        <div className="form-grid" style={{ marginTop: 10 }}>
          <L l="Trigger event">
            <select className="field">
              <option>PO Approved</option>
              <option>Downpayment paid</option>
              <option>PO Sent</option>
            </select>
          </L>
          <L l="Lead-time (days)">
            <input className="field" defaultValue="30" />
          </L>
          <L l="Computed expected date" computed>
            <div className="field is-computed">
              2026-07-03 (from trigger + 30d)
            </div>
          </L>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Supplier</th>
              <th className="num">On-time %</th>
              <th className="num">Avg delay (days)</th>
              <th className="num">Orders</th>
              <th>Reliability</th>
            </tr>
          </thead>
          <tbody>
            {sup.map((s) => (
              <tr key={s.name}>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td className="num">{s.onTime}%</td>
                <td className="num">{s.avgDelay}</td>
                <td className="num">{s.orders}</td>
                <td>
                  <span className={"chip chip-" + tone(s.score)}>
                    Score {s.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Computed expected vs actual dates with early/on-time/late flags; the
        reliability panel surfaces on the supplier record (U10) during
        selection.
      </div>
    </div>
  );
}

// ---- U21 · Budget vs actual per project (Purchasing side) ------------------
function U21Budget() {
  const ROWS = [
    {
      proj: "NORECO II — 13.2KV",
      budget: 24000000,
      committed: 18400000,
      actual: 9820000,
    },
    {
      proj: "Cavite 69KV",
      budget: 22000000,
      committed: 24200000,
      actual: 19600000,
    },
  ];
  return (
    <div className="screen wide">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U21 · Phase 2</div>
          <h2 className="ph-title">Budget vs actual per project</h2>
        </div>
        <div className="ph-actions">
          <span className="muted-note">
            Committed = approved + open POs · Actual = paid RFPs
          </span>
        </div>
      </div>
      <div className="budget-cards">
        {ROWS.map((r, i) => {
          const usedPct = Math.round((r.actual / r.budget) * 100),
            commPct = Math.round((r.committed / r.budget) * 100),
            over = commPct > 100;
          return (
            <div key={i} className="solid budget-card">
              <div className="bc-head">
                <div className="bc-name">{r.proj}</div>
                {over ? (
                  <span className="chip chip-danger">
                    ⚠ over budget {commPct}%
                  </span>
                ) : (
                  <span className="chip chip-success">
                    {commPct}% committed
                  </span>
                )}
              </div>
              <div className="bc-bar">
                <div
                  className="bc-actual"
                  style={{ width: Math.min(usedPct, 100) + "%" }}
                ></div>
                <div
                  className="bc-committed"
                  style={{
                    width: Math.min(commPct - usedPct, 100 - usedPct) + "%",
                  }}
                ></div>
              </div>
              <div className="bc-legend">
                <span>
                  <span className="bc-dot a"></span>Actual {pmoney(r.actual)}
                </span>
                <span>
                  <span className="bc-dot c"></span>Committed{" "}
                  {pmoney(r.committed)}
                </span>
              </div>
              <div className="bc-grid">
                <div>
                  <span className="bc-k">Budget</span>
                  <span className="bc-v">₱{pmoney(r.budget)}</span>
                </div>
                <div>
                  <span className="bc-k">Remaining</span>
                  <span
                    className="bc-v"
                    style={{
                      color:
                        r.budget - r.committed < 0
                          ? "var(--st-danger)"
                          : "inherit",
                    }}
                  >
                    ₱{pmoney(r.budget - r.committed)}
                  </span>
                </div>
                <div>
                  <span className="bc-k">% used</span>
                  <span className="bc-v">{usedPct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="threeway solid"
        style={{ borderLeftColor: "var(--st-pending)", marginTop: 14 }}
      >
        <Icon name="check" size={15} color="var(--st-pending-ink)" />
        <span>
          Over-budget warnings fire at PO/PR time — configurable{" "}
          <strong>warn vs hard-block</strong> behavior.
        </span>
      </div>
    </div>
  );
}

// ---- U22 · Mobile approvals -----------------------------------------------
function U22Mobile() {
  const [items, setItems] = useState([
    {
      ref: "2605-0188IC",
      entity: "Import gate 7",
      payee: "Shenda Electric",
      amt: "₱1,764,000",
      urgency: "Critical",
      age: "2d",
    },
    {
      ref: "2606-0210",
      entity: "PO · For Approval",
      payee: "Cebu Steel",
      amt: "₱48,200",
      urgency: "Routine",
      age: "6h",
    },
  ]);
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U22 · Phase 2</div>
          <h2 className="ph-title">Mobile approvals</h2>
        </div>
        <div className="ph-actions">
          <span className="muted-note">
            U12 at phone width · the two stall points
          </span>
        </div>
      </div>
      <div className="mobile-approvals">
        <div className="phone-frame">
          <div className="phone-notch"></div>
          <div className="phone-screen">
            <div className="pa-head glass-nav">
              <span style={{ fontWeight: 700 }}>Approvals</span>
              <span className="bell-badge" style={{ position: "static" }}>
                {items.length}
              </span>
            </div>
            <div className="pa-list">
              {items.length === 0 && (
                <div className="empty" style={{ padding: 30 }}>
                  <div className="ill">◷</div>
                  <div className="et">All caught up</div>
                </div>
              )}
              {items.map((a) => (
                <div key={a.ref} className="solid pa-card">
                  <div className="pa-top">
                    <span className="chip chip-danger" style={{ fontSize: 10 }}>
                      {a.entity}
                    </span>
                    <span
                      className={
                        "chip chip-" +
                        (a.urgency === "Critical" ? "danger" : "neutral")
                      }
                      style={{ fontSize: 10 }}
                    >
                      {a.urgency}
                    </span>
                  </div>
                  <div className="pa-ref">
                    <span className="docchip sm">{a.ref}</span>
                  </div>
                  <div className="pa-payee">{a.payee}</div>
                  <div className="pa-amt">
                    {a.amt}{" "}
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--jce-ink-2)",
                        fontWeight: 400,
                      }}
                    >
                      · {a.age}
                    </span>
                  </div>
                  <div className="pa-actions">
                    <button
                      className="btn btn-approve"
                      style={{ flex: 1, minHeight: 44 }}
                      onClick={() =>
                        setItems(items.filter((x) => x.ref !== a.ref))
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-ghost"
                      style={{ minHeight: 44 }}
                      onClick={() =>
                        setItems(items.filter((x) => x.ref !== a.ref))
                      }
                    >
                      Hold
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mobile-note glass">
          <div className="card-title">Mobile approval queue</div>
          <p className="muted-note" style={{ lineHeight: 1.6 }}>
            Single-column queue, large ≥44px Approve/Hold/Reject targets, note
            input. Push/email reminders fire after N days. Scoped to the two
            biggest stall points: <strong>import stages 4 &amp; 7</strong> and{" "}
            <strong>POs in For Approval</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---- U23 · Cycle-time analytics -------------------------------------------
function U23Cycle() {
  const stages = [
    { name: "Creation → Approved", mean: 1.8, median: 1.0 },
    { name: "Approved → Sent", mean: 0.9, median: 0.5 },
    { name: "Import gate 4", mean: 3.2, median: 2.0, slow: false },
    { name: "Import gate 7 (DP)", mean: 8.4, median: 6.0, slow: true },
    { name: "Production", mean: 24.0, median: 21.0 },
    { name: "Delivery", mean: 12.5, median: 11.0 },
  ];
  const maxV = Math.max(...stages.map((s) => s.mean));
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U23 · Phase 2</div>
          <h2 className="ph-title">Cycle-time analytics</h2>
        </div>
        <div className="ph-actions">
          <select className="field" style={{ width: "auto" }}>
            <option>All suppliers</option>
          </select>
          <select className="field" style={{ width: "auto" }}>
            <option>Import POs</option>
            <option>Local POs</option>
          </select>
        </div>
      </div>
      <div className="solid" style={{ padding: 18 }}>
        <div className="card-title">
          Mean stage duration (days){" "}
          <span className="muted">— slowest stage highlighted</span>
        </div>
        <div className="cycle-chart">
          {stages.map((s, i) => (
            <div key={i} className="cyc-row">
              <div className="cyc-label">
                {s.name}
                {s.slow && (
                  <span
                    className="chip chip-danger"
                    style={{ marginLeft: 8, fontSize: 10 }}
                  >
                    bottleneck
                  </span>
                )}
              </div>
              <div className="cyc-bar-wrap">
                <div
                  className={"cyc-bar" + (s.slow ? " slow" : "")}
                  style={{ width: (s.mean / maxV) * 100 + "%" }}
                >
                  <span>{s.mean}d</span>
                </div>
              </div>
              <div className="cyc-median">med {s.median}d</div>
            </div>
          ))}
        </div>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Per-stage mean/median with slowest-stage highlight; filters by supplier,
        project, period, item type. Local PO cycle (creation → approved → sent)
        included.
      </div>
    </div>
  );
}

// ---- U24 · Blanket POs -----------------------------------------------------
const BLANKETS = [
  {
    no: "BPO-26-0004",
    supplier: "Cebu Steel Corp.",
    project: "Workshop",
    ceiling: 2000000,
    used: 1480000,
    status: "Active",
    releases: 6,
  },
  {
    no: "BPO-26-0002",
    supplier: "Meralco Industrial",
    project: "—",
    ceiling: 1500000,
    used: 1500000,
    status: "Exhausted",
    releases: 9,
  },
  {
    no: "BPO-26-0001",
    supplier: "ABB Inc.",
    project: "NORECO II",
    ceiling: 5000000,
    used: 900000,
    status: "Active",
    releases: 2,
  },
];
const BPO_TONE = {
  Draft: "neutral",
  Active: "success",
  Suspended: "pending",
  Exhausted: "danger",
  Expired: "neutral",
  Closed: "neutral",
};
function U24Blanket() {
  const [sel, setSel] = useState(null);
  if (sel) {
    const usedPct = Math.round((sel.used / sel.ceiling) * 100);
    return (
      <div className="screen">
        <button className="back-link" onClick={() => setSel(null)}>
          ← Blanket POs
        </button>
        <div className="page-head glass">
          <div>
            <div className="kicker">Purchasing · U24</div>
            <h2 className="ph-title">
              <span className="docchip">{sel.no}</span> {sel.supplier}
            </h2>
          </div>
          <div className="ph-actions">
            <span className={"chip chip-" + BPO_TONE[sel.status]}>
              {sel.status}
            </span>
            <button
              className="btn btn-primary btn-sm"
              disabled={usedPct >= 100}
            >
              + New release (child PO)
            </button>
          </div>
        </div>
        <div className="solid budget-card" style={{ marginBottom: 14 }}>
          <div className="bc-head">
            <div className="bc-name">Ceiling utilization</div>
            <span
              className={
                "chip chip-" +
                (usedPct >= 100
                  ? "danger"
                  : usedPct >= 80
                    ? "pending"
                    : "success")
              }
            >
              {usedPct}% used
            </span>
          </div>
          <div className="bc-bar">
            <div
              className="bc-actual"
              style={{
                width: usedPct + "%",
                background:
                  usedPct >= 100
                    ? "var(--st-danger)"
                    : usedPct >= 80
                      ? "var(--jce-orange-500)"
                      : "var(--jce-green-600)",
              }}
            ></div>
          </div>
          <div className="bc-grid">
            <div>
              <span className="bc-k">Ceiling</span>
              <span className="bc-v">₱{pmoney(sel.ceiling)}</span>
            </div>
            <div>
              <span className="bc-k">Drawn</span>
              <span className="bc-v">₱{pmoney(sel.used)}</span>
            </div>
            <div>
              <span className="bc-k">Remaining</span>
              <span className="bc-v">₱{pmoney(sel.ceiling - sel.used)}</span>
            </div>
          </div>
        </div>
        <div
          className="threeway solid"
          style={{ borderLeftColor: "var(--st-pending)" }}
        >
          <Icon name="check" size={15} color="var(--st-pending-ink)" />
          <span>
            Utilization bar warns at 80%, blocks at 100% (supervisor override).
            Each release <strong>auto-generates a child PO</strong> (no fresh
            approval; carries the blanket ref).
          </span>
        </div>
        <div className="solid table-wrap" style={{ marginTop: 14 }}>
          <table className="jtable">
            <thead>
              <tr>
                <th>Release</th>
                <th>Child PO</th>
                <th>Date</th>
                <th className="num">Amount</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.min(sel.releases, 4) }).map((_, i) => (
                <tr key={i}>
                  <td>R-{String(i + 1).padStart(2, "0")}</td>
                  <td>
                    <span className="docchip sm">
                      {sel.no.replace("BPO", "2606")}-{i + 1}
                    </span>
                  </td>
                  <td className="mono" style={{ fontSize: 12 }}>
                    2026-0{5 + (i % 2)}-1{i}
                  </td>
                  <td className="num money">
                    {pmoney(Math.round(sel.used / sel.releases))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U24 · Phase 2</div>
          <h2 className="ph-title">Blanket POs</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-primary btn-sm">+ New blanket</button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Blanket No.</th>
              <th>Supplier</th>
              <th>Project</th>
              <th className="num">Ceiling</th>
              <th>Utilization</th>
              <th className="num">Releases</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {BLANKETS.map((b) => {
              const p = Math.round((b.used / b.ceiling) * 100);
              return (
                <tr
                  key={b.no}
                  onClick={() => setSel(b)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <span className="docchip">{b.no}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{b.supplier}</td>
                  <td>{b.project}</td>
                  <td className="num money">{pmoney(b.ceiling)}</td>
                  <td>
                    <div className="mini-bar">
                      <div
                        className="mini-fill"
                        style={{
                          width: p + "%",
                          background:
                            p >= 100
                              ? "var(--st-danger)"
                              : p >= 80
                                ? "var(--jce-orange-500)"
                                : "var(--jce-green-600)",
                        }}
                      ></div>
                    </div>
                    <span style={{ fontSize: 11 }}>{p}%</span>
                  </td>
                  <td className="num">{b.releases}</td>
                  <td>
                    <span className={"chip chip-" + BPO_TONE[b.status]}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Ceiling + draw-down for routine supplies. Number format{" "}
        <span className="mono">BPO-YY-XXXX</span>. Reporting: utilization %, avg
        release size, projected exhaustion.
      </div>
    </div>
  );
}

window.U19BIR = U19BIR;
window.U20LeadTime = U20LeadTime;
window.U21Budget = U21Budget;
window.U22Mobile = U22Mobile;
window.U23Cycle = U23Cycle;
window.U24Blanket = U24Blanket;
