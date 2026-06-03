// ============================================================================
// JCE SYSTEM — Accounting · Payroll: A4 list · A5 workspace · A6 payslip
//              A1 settings · A2 chart of accounts · A3 loans
// ============================================================================
const seeComp = (role) => role === "payroll" || role === "owner";

// ---------------------------------------------------------------------------
// A4 · Payroll Summary batch list
// ---------------------------------------------------------------------------
function A4List({ role, onOpen }) {
  const [freq, setFreq] = useState("All");
  const rows = PAY_BATCHES.filter((b) => freq === "All" || b.freq === freq);
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Accounting · A4 · Payroll</div>
          <h2 className="ph-title">Payroll Summary</h2>
        </div>
        <div className="ph-actions">
          <select
            className="field"
            style={{ width: "auto" }}
            value={freq}
            onChange={(e) => setFreq(e.target.value)}
          >
            {["All", "Daily", "Weekly", "Monthly"].map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
          {seeComp(role) && (
            <button className="btn btn-primary btn-sm">+ New batch</button>
          )}
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Frequency</th>
              <th>Period</th>
              <th>Cut-off</th>
              <th>Scope</th>
              <th className="num">Workers</th>
              <th className="num">Gross</th>
              <th className="num">Net</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr
                key={b.id}
                onClick={() => onOpen(b)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span className="docchip">{b.id}</span>
                </td>
                <td>{b.freq}</td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {b.period}
                </td>
                <td>{b.cutoff}</td>
                <td>
                  {b.scope}
                  {b.so && (
                    <span className="docchip sm" style={{ marginLeft: 6 }}>
                      {b.so}
                    </span>
                  )}
                </td>
                <td className="num">{b.workers}</td>
                <td className="num money">
                  {seeComp(role) ? (
                    pmoney(b.gross)
                  ) : (
                    <span className="masked">••••</span>
                  )}
                </td>
                <td className="num money" style={{ fontWeight: 700 }}>
                  {seeComp(role) ? (
                    pmoney(b.net)
                  ) : (
                    <span className="masked">••••</span>
                  )}
                </td>
                <td>
                  <span
                    className={
                      "chip chip-" +
                      {
                        Draft: "neutral",
                        Prepared: "info",
                        Checked: "info",
                        Verified: "pending",
                        Approved: "success",
                        Paid: "success",
                      }[b.status]
                    }
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A5 · Payroll batch workspace (FLAGSHIP)
// ---------------------------------------------------------------------------
function A5Workspace({ role, batch, onBack }) {
  const [stage, setStage] = useState(batch.status);
  const [expand, setExpand] = useState(null);
  const can = seeComp(role);
  const locked = PAY_STAGES.indexOf(stage) >= PAY_STAGES.indexOf("Approved");
  const tot = PAY_LINES.reduce(
    (a, l) => ({
      gross: a.gross + l.gross,
      ded:
        a.ded +
        (l.sss + l.ph + l.pi + l.wtax + l.sssLoan + l.piLoan + l.coLoan + l.ca),
      net: a.net + l.net,
    }),
    { gross: 0, ded: 0, net: 0 },
  );
  const charge = {};
  PAY_LINES.forEach((l) =>
    l.charge.forEach(([p, h, a]) => {
      charge[p] = charge[p] || { h: 0, a: 0 };
      charge[p].h += h;
      charge[p].a += a;
    }),
  );

  const M = (v) => (can ? pmoney(v) : <span className="masked">••••</span>);

  return (
    <div className="screen wide">
      <button className="back-link" onClick={onBack}>
        ← Payroll Summary
      </button>

      {/* header card */}
      <div className="glass pay-header">
        <div className="pay-head-top">
          <div>
            <div className="kicker">Accounting · A5 · Batch workspace</div>
            <h2 className="ph-title">
              <span className="docchip">{batch.id}</span>
            </h2>
            <div className="pay-meta">
              {batch.freq} · {batch.period} · cut-off {batch.cutoff} ·{" "}
              {batch.scope}
              {batch.so ? " · " + batch.so : ""}
            </div>
          </div>
          <div className="pay-head-actions">
            {can && !locked && (
              <button className="btn btn-ghost btn-sm">Edit lines</button>
            )}
            {can && (
              <button className="btn btn-post btn-sm">
                ▤ Print register (PDF)
              </button>
            )}
          </div>
        </div>
        {/* status stepper */}
        <div className="pay-stepper">
          {PAY_STAGES.map((s, i) => {
            const idx = PAY_STAGES.indexOf(stage);
            const cls = i < idx ? "done" : i === idx ? "curr" : "todo";
            return (
              <React.Fragment key={s}>
                <button
                  className={"pstep " + cls}
                  onClick={() => can && setStage(s)}
                  disabled={!can}
                >
                  <span className="pdot">{i < idx ? "✓" : i + 1}</span>
                  <span className="plabel">{s}</span>
                </button>
                {i < PAY_STAGES.length - 1 && (
                  <span className={"pline " + (i < idx ? "done" : "")}></span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {!can && (
        <div className="mask-banner">
          <Icon name="lock" size={15} color="var(--jce-ink-2)" /> Per-employee
          compensation is restricted to{" "}
          <strong>Payroll Officer &amp; Owner</strong>. You see batch totals
          only. (Viewing as {ROLES[role].short}.)
        </div>
      )}

      {locked && (
        <div className="lockbar">
          <Icon name="lock" size={16} />
          <div>
            <div className="lt">Approved — lines locked</div>
            <div className="ld">
              Revert is a logged status change with remarks. Edits below
              Approved only.
            </div>
          </div>
        </div>
      )}

      {/* summary lines table */}
      <div className="solid table-wrap grid-wrap">
        <table className="jtable paygrid">
          <thead>
            <tr>
              <th className="frz" style={{ minWidth: 30 }}></th>
              <th className="frz2">Employee</th>
              <th className="num">Rate/day</th>
              <th className="num grp-e">Basic</th>
              <th className="num grp-e">OT</th>
              <th className="num grp-e">Holiday</th>
              <th className="num grp-e">Night Diff</th>
              <th className="num grp-e">Allowance</th>
              <th className="num grp-e">Gross</th>
              <th className="num grp-d">SSS</th>
              <th className="num grp-d">PhilH</th>
              <th className="num grp-d">Pag-IBIG</th>
              <th className="num grp-d">W/Tax</th>
              <th className="num grp-d">Loans</th>
              <th className="num grp-d">CA</th>
              <th className="num grp-d">Total Ded</th>
              <th className="num grp-n">NET PAY</th>
            </tr>
          </thead>
          <tbody>
            {PAY_LINES.map((l) => {
              const totDed =
                l.sss +
                l.ph +
                l.pi +
                l.wtax +
                l.sssLoan +
                l.piLoan +
                l.coLoan +
                l.ca;
              const loans = l.sssLoan + l.piLoan + l.coLoan;
              const open = expand === l.ln;
              return (
                <React.Fragment key={l.ln}>
                  <tr
                    onClick={() => setExpand(open ? null : l.ln)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="frz">{open ? "▾" : "▸"}</td>
                    <td className="frz2" style={{ fontWeight: 600 }}>
                      {l.name}
                      {l.skip && (
                        <span className="skip-flag" title={l.skip}>
                          ⚠ skip
                        </span>
                      )}
                    </td>
                    <td className="num">{M(l.rate)}</td>
                    <td className="num grp-e">{M(l.basic)}</td>
                    <td className="num grp-e">{M(l.ot)}</td>
                    <td className="num grp-e">{M(l.hol)}</td>
                    <td className="num grp-e">{M(l.nd)}</td>
                    <td className="num grp-e">{M(l.allow)}</td>
                    <td className="num grp-e" style={{ fontWeight: 600 }}>
                      {M(l.gross)}
                    </td>
                    <td className="num grp-d">{M(l.sss)}</td>
                    <td className="num grp-d">{M(l.ph)}</td>
                    <td className="num grp-d">{M(l.pi)}</td>
                    <td className="num grp-d">{M(l.wtax)}</td>
                    <td className="num grp-d">{M(loans)}</td>
                    <td className="num grp-d">{M(l.ca)}</td>
                    <td className="num grp-d" style={{ fontWeight: 600 }}>
                      {M(totDed)}
                    </td>
                    <td className="num grp-n" style={{ fontWeight: 700 }}>
                      {M(l.net)}
                    </td>
                  </tr>
                  {open && can && (
                    <tr className="daily-detail-row">
                      <td></td>
                      <td colSpan="17">
                        <div className="daily-detail">
                          <div className="dd-title">
                            Daily Earnings Detail — {l.name}
                          </div>
                          <table className="jtable dd-table">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Charge Project</th>
                                <th>Day Type</th>
                                <th className="num">Reg</th>
                                <th className="num">OT</th>
                                <th className="num">ND</th>
                                <th className="num">Rate</th>
                                <th>Multipliers</th>
                                <th className="num">Basic Amt</th>
                                <th className="num">OT Amt</th>
                                <th className="num">ND Amt</th>
                              </tr>
                            </thead>
                            <tbody>
                              {l.daily.map((d, i) => (
                                <tr key={i}>
                                  <td>{d[0]}</td>
                                  <td>
                                    <span className="docchip sm">{d[1]}</span>
                                  </td>
                                  <td>{d[2]}</td>
                                  <td className="num">{d[3]}</td>
                                  <td className="num">{d[4]}</td>
                                  <td className="num">{d[5]}</td>
                                  <td className="num">{pmoney(d[6])}</td>
                                  <td className="mono" style={{ fontSize: 11 }}>
                                    {d[7]}
                                  </td>
                                  <td className="num">{pmoney(d[8])}</td>
                                  <td className="num">{pmoney(d[9])}</td>
                                  <td className="num">{pmoney(d[10])}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {l.skip && (
                            <div className="skip-note">
                              ⚠ {l.skip} — officer may override (every override
                              ledger-logged).
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="grid-tot">
              <td className="frz"></td>
              <td className="frz2">Control totals</td>
              <td></td>
              <td colSpan="5"></td>
              <td className="num grp-e">{M(tot.gross)}</td>
              <td colSpan="6"></td>
              <td className="num grp-d">{M(tot.ded)}</td>
              <td className="num grp-n">{M(tot.net)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="pay-cols">
        {/* charging allocation */}
        <div className="solid charge-card">
          <div className="card-title">
            Charging Allocation <span className="muted">per project</span>
          </div>
          <table className="jtable">
            <thead>
              <tr>
                <th>Project</th>
                <th className="num">Allocated hrs</th>
                <th className="num">Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(charge).map(([p, v]) => (
                <tr key={p}>
                  <td>
                    <span className="docchip sm">{p}</span>
                  </td>
                  <td className="num">{v.h.toFixed(1)}</td>
                  <td className="num money">{M(v.a)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* workflow panel */}
        <div className="glass workflow-card">
          <div className="card-title">Sign-off workflow</div>
          <div className="wf-list">
            {["Prepared", "Checked", "Verified", "Approved"].map((s) => {
              const done = PAY_STAGES.indexOf(stage) >= PAY_STAGES.indexOf(s);
              return (
                <div key={s} className={"wf-row" + (done ? " done" : "")}>
                  <span className="wf-dot">{done ? "✓" : "○"}</span>
                  <div>
                    <div className="wf-label">{s} by</div>
                    <div className="wf-by">
                      {done ? "L. Tan · 2026-06-02" : "—"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {can && !locked && (
            <button
              className="btn btn-primary btn-sm"
              style={{ width: "100%", marginTop: 10 }}
              onClick={() =>
                setStage(PAY_STAGES[Math.min(PAY_STAGES.indexOf(stage) + 1, 5)])
              }
            >
              Advance stage →
            </button>
          )}
          <div className="muted-note" style={{ marginTop: 8 }}>
            Deductions appear only when the Deduction Calendar schedules them
            this cut-off. Computation order is authoritative.
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A6 · Payslip (legacy layout) — read from an Approved batch
// ---------------------------------------------------------------------------
function A6Payslip({ role }) {
  const can = seeComp(role);
  const l = PAY_LINES[0];
  if (!can)
    return (
      <div className="screen">
        <div className="mask-banner">
          <Icon name="lock" size={15} /> Payslips carry compensation —
          restricted to Payroll Officer &amp; Owner. Employees see their own via
          My HR (H12).
        </div>
      </div>
    );
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Accounting · A6</div>
          <h2 className="ph-title">Payslips · {PAY_BATCHES[0].id}</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">
            Bulk PDF (line order)
          </button>
          <button className="btn btn-post btn-sm">⎙ Print one/page</button>
        </div>
      </div>
      <div className="solid paper payslip">
        <div className="ps-head">
          <div className="ps-co">JC ELECTROFIELDS POWER SYSTEMS INC.</div>
          <div className="ps-period">
            Payroll Period: 2026-05-21 — 2026-06-05
          </div>
        </div>
        <div className="ps-emp">
          <span>
            <strong>{l.name}</strong>
          </span>
          <span>Office/Dept: Project Site</span>
          <span>Daily Rate: ₱{pmoney(l.rate)}</span>
          <span>Rate/Hour: ₱{pmoney(l.rate / 8)}</span>
        </div>
        <div className="ps-grid">
          <div className="ps-block">
            <div className="ps-bt">BASIC PAY</div>
            {[
              ["Total Work Hours ×1.00", l.basic],
              ["Sunday ×1.30", 0],
              ["Special Holiday ×1.30", 0],
              ["Regular Holiday ×2.00", 0],
              ["Rest Day–Spc Hol ×1.50", 0],
              ["Double Holiday ×3.00", 0],
              ["Travel Hours (legacy)", 0],
              ["Night Diff'l ×1.10", l.nd],
            ].map(([k, v], i) => (
              <div key={i} className="ps-row">
                <span>{k}</span>
                <span className="num">{pmoney(v)}</span>
              </div>
            ))}
            <div className="ps-row tot">
              <span>TOTAL BASIC</span>
              <span className="num">{pmoney(l.basic + l.nd)}</span>
            </div>
            <div className="ps-bt" style={{ marginTop: 8 }}>
              OVERTIME
            </div>
            {[
              ["Regular OT ×1.25", l.ot],
              ["Sunday OT ×1.69", 0],
              ["Night Diff'l OT", 0],
            ].map(([k, v], i) => (
              <div key={i} className="ps-row">
                <span>{k}</span>
                <span className="num">{pmoney(v)}</span>
              </div>
            ))}
            <div className="ps-row tot">
              <span>TOTAL OVERTIME</span>
              <span className="num">{pmoney(l.ot)}</span>
            </div>
            <div className="ps-bt" style={{ marginTop: 8 }}>
              ALLOWANCES
            </div>
            {[
              ["Allowance", l.allow],
              ["Project", 0],
              ["Meal", 0],
              ["Others", 0],
            ].map(([k, v], i) => (
              <div key={i} className="ps-row">
                <span>{k}</span>
                <span className="num">{pmoney(v)}</span>
              </div>
            ))}
            <div className="ps-row tot">
              <span>TOTAL EARNINGS</span>
              <span className="num">{pmoney(l.gross)}</span>
            </div>
          </div>
          <div className="ps-block">
            <div className="ps-bt">MANDATORY CONTRIBUTION</div>
            {[
              ["SSS", l.sss],
              ["PhilHealth", l.ph],
              ["Pag-IBIG", l.pi],
            ].map(([k, v], i) => (
              <div key={i} className="ps-row">
                <span>{k}</span>
                <span className="num">{pmoney(v)}</span>
              </div>
            ))}
            <div className="ps-row tot">
              <span>TOTAL CONTRIBUTION</span>
              <span className="num">{pmoney(l.sss + l.ph + l.pi)}</span>
            </div>
            <div className="ps-bt" style={{ marginTop: 8 }}>
              LOAN PAYMENT
            </div>
            {[
              ["SSS Loan", l.sssLoan],
              ["Pag-IBIG Loan", l.piLoan],
              ["W/Holding Tax", l.wtax],
              ["Cash Advances", l.ca],
              ["C.A 1st & 3rd Week", 0],
            ].map(([k, v], i) => (
              <div key={i} className="ps-row">
                <span>{k}</span>
                <span className="num">{pmoney(v)}</span>
              </div>
            ))}
            <div className="ps-row tot">
              <span>TOTAL LOAN PAYMENTS</span>
              <span className="num">
                {pmoney(l.sssLoan + l.piLoan + l.wtax + l.ca)}
              </span>
            </div>
            <div className="ps-row tot">
              <span>TOTAL DEDUCTIONS</span>
              <span className="num">
                {pmoney(
                  l.sss + l.ph + l.pi + l.sssLoan + l.piLoan + l.wtax + l.ca,
                )}
              </span>
            </div>
            <div className="ps-row netpay">
              <span>NET PAY</span>
              <span className="num">₱{pmoney(l.net)}</span>
            </div>
            <div className="ps-bt" style={{ marginTop: 8 }}>
              BALANCES
            </div>
            {[
              ["SSS Loan", 3600],
              ["Pag-IBIG Loan", 0],
              ["Cash Advances", 0],
            ].map(([k, v], i) => (
              <div key={i} className="ps-row">
                <span>{k}</span>
                <span className="num">{pmoney(v)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ps-sig">
          <div className="sig-line"></div>
          <div className="sig-role">Received By &amp; Date · print-only</div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A2 · Chart of Accounts
// ---------------------------------------------------------------------------
function A2CoA({ role }) {
  const [q, setQ] = useState("");
  const canEdit = role === "acctglead" || role === "owner";
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Accounting · A2</div>
          <h2 className="ph-title">Chart of Accounts</h2>
        </div>
        <div className="ph-actions">
          <div className="top-search" style={{ maxWidth: 260 }}>
            <Icon name="search" size={15} />
            <input
              placeholder="Fuzzy — e.g. ‘meal’ finds 50032…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          {canEdit && (
            <button className="btn btn-primary btn-sm">+ Add account</button>
          )}
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Code</th>
              <th>Account name</th>
              <th>Type</th>
              <th>Subtype</th>
              <th>Normal balance</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {COA.map((g) => {
              const rows = g.rows.filter(
                (r) =>
                  q === "" ||
                  (r[0] + r[1]).toLowerCase().includes(q.toLowerCase()),
              );
              if (rows.length === 0) return null;
              return (
                <React.Fragment key={g.band}>
                  <tr className="band-row">
                    <td colSpan="6">{g.band}</td>
                  </tr>
                  {rows.map((r) => (
                    <tr key={r[0]}>
                      <td className="mono" style={{ fontWeight: 600 }}>
                        {r[0]}
                      </td>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                      <td style={{ color: "var(--jce-ink-2)" }}>{r[3]}</td>
                      <td>
                        <span
                          className={
                            "chip chip-" +
                            (r[4] === "Debit" ? "info" : "neutral")
                          }
                        >
                          {r[4]}
                        </span>
                      </td>
                      <td>
                        <span
                          className="chip chip-success"
                          style={{ padding: "1px 7px" }}
                        >
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Codes manually assigned · inactivate-never-delete when posted against
        (SET-081).
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A1 · Settings (summary) · A3 · Loans (summary)
// ---------------------------------------------------------------------------
function A1Settings({ role }) {
  const can = role === "acctglead" || role === "owner";
  const secs = [
    [
      "1",
      "Pay Rate Multipliers",
      "Ordinary→Double holiday × Regular/Night/OT % matrix (100/110/125 … 390/429/507)",
    ],
    [
      "2",
      "Government Mandatory Contributions",
      "SSS 15% · PhilHealth 5% · Pag-IBIG 1/2% — versioned w/ source circular",
    ],
    [
      "3",
      "Withholding Tax (TRAIN)",
      "Graduated monthly (₱20,832 exempt … 35% over ₱666,667)",
    ],
    ["4", "Tardiness / Lates Policy", "Clock-in windows → deductions"],
    ["5", "Deduction Calendar", "Semi-monthly 15th/30th · weekly W1–W4"],
    ["6", "Cut-Off Periods", "Daily 21–05/06–20 · Monthly 23–07/08–22"],
    [
      "7",
      "Statutory Leave Benefits",
      "SIL 5 · Maternity 105/120/60 · Paternity 7",
    ],
    [
      "9",
      "Financial Statement Mapping",
      "BS Roman-numeral + IS Sched → CoA codes, effectivity-versioned",
    ],
  ];
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Accounting · A1</div>
          <h2 className="ph-title">Payroll Settings</h2>
        </div>
        {!can && (
          <span className="ro-note">
            <Icon name="lock" size={13} /> Read-only (Payroll Officer reads)
          </span>
        )}
      </div>
      <div className="settings-cards">
        {secs.map(([n, t, d]) => (
          <div key={n} className="solid set-card">
            <div className="set-num">{n}</div>
            <div>
              <div className="set-card-t">{t}</div>
              <div className="set-card-d">{d}</div>
            </div>
            <span className="eff-tag">effectivity-versioned</span>
          </div>
        ))}
      </div>
      <div className="muted-note" style={{ marginTop: 12 }}>
        Every table versioned by effectivity date so past periods reproduce
        historical figures · edits audited (SET-003).
      </div>
    </div>
  );
}

function A3Loans({ role }) {
  const LOANS = [
    [
      "N. Bautista",
      "Government Loan",
      "SSS Salary",
      "SSS-2025-114",
      "18,000.00",
      "450.00",
      "3,600.00",
      "Active",
    ],
    [
      "A. Tolentino",
      "Government Loan",
      "Pag-IBIG Calamity",
      "PI-2026-021",
      "12,000.00",
      "300.00",
      "9,900.00",
      "Active",
    ],
    [
      "R. Villanueva",
      "Company Loan",
      "—",
      "CO-2026-008",
      "8,000.00",
      "600.00",
      "2,000.00",
      "Active",
    ],
    [
      "C. Mendoza",
      "Cash Advance",
      "—",
      "CA-26-0033",
      "95,000.00",
      "—",
      "0.00",
      "Fully Paid",
    ],
  ];
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Accounting · A3</div>
          <h2 className="ph-title">Loans</h2>
        </div>
        {seeComp(role) && (
          <div className="ph-actions">
            <button className="btn btn-primary btn-sm">+ New loan</button>
          </div>
        )}
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Type</th>
              <th>Sub-type</th>
              <th>Reference</th>
              <th className="num">Principal</th>
              <th className="num">Amortization</th>
              <th className="num">Running Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {LOANS.map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{r[0]}</td>
                <td>{r[1]}</td>
                <td>{r[2]}</td>
                <td>
                  <span className="docchip sm">{r[3]}</span>
                </td>
                <td className="num money">{r[4]}</td>
                <td className="num money">{r[5]}</td>
                <td className="num money" style={{ fontWeight: 600 }}>
                  {r[6]}
                </td>
                <td>
                  <span
                    className={
                      "chip chip-" + (r[7] === "Active" ? "info" : "success")
                    }
                  >
                    {r[7]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Append-only ledger per loan · final-installment trueing · auto-stop at
        zero → Fully Paid · skip surfaces in A5.
      </div>
    </div>
  );
}

Object.assign(window, {
  A4List,
  A5Workspace,
  A6Payslip,
  A2CoA,
  A1Settings,
  A3Loans,
  seeComp,
});
