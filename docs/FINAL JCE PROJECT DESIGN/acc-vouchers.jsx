// ============================================================================
// JCE SYSTEM — Accounting · A13 PV register · A14 PV form · A15 disbursement
//              A16 Journal Voucher · A17 Cash Advance ledger
// ============================================================================

// ---------------------------------------------------------------------------
// A13 · Payable Voucher register (+ PR worksheet tab)
// ---------------------------------------------------------------------------
function A13Register({ onOpen }) {
  const [tab, setTab] = useState("register");
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Accounting · A13 · Payable Voucher</div>
          <h2 className="ph-title">Voucher register</h2>
        </div>
        <div className="ph-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onOpen(VOUCHERS[3])}
          >
            + New voucher
          </button>
        </div>
      </div>
      <div
        className="seg glass-nav"
        style={{ marginBottom: 14, display: "inline-flex" }}
      >
        <button
          className={tab === "register" ? "on" : ""}
          onClick={() => setTab("register")}
        >
          Voucher register
        </button>
        <button
          className={tab === "pr" ? "on" : ""}
          onClick={() => setTab("pr")}
        >
          Payment Request worksheet
        </button>
      </div>
      {tab === "register" ? (
        <div className="solid table-wrap">
          <table className="jtable">
            <thead>
              <tr>
                <th>CV No.</th>
                <th>Date</th>
                <th>Payee</th>
                <th>SO#</th>
                <th>RFP</th>
                <th>PO</th>
                <th className="num">Gross</th>
                <th className="num">WHT</th>
                <th className="num">Net</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {VOUCHERS.map((v) => (
                <tr
                  key={v.cv}
                  onClick={() => onOpen(v)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <span className="docchip">{v.cv}</span>
                  </td>
                  <td className="mono" style={{ fontSize: 12 }}>
                    {v.date}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {v.payee}
                    <div className="mono sub-no">{v.ptype}</div>
                  </td>
                  <td>
                    <span className="docchip sm">{v.so}</span>
                  </td>
                  <td>
                    {v.rfp === "—" ? (
                      "—"
                    ) : (
                      <span className="docchip sm">{v.rfp}</span>
                    )}
                  </td>
                  <td>
                    {v.po === "—" ? (
                      "—"
                    ) : (
                      <span className="docchip sm">{v.po}</span>
                    )}
                  </td>
                  <td className="num money">{pmoney(v.gross)}</td>
                  <td className="num money">{pmoney(v.wtax)}</td>
                  <td className="num money" style={{ fontWeight: 600 }}>
                    {pmoney(v.net)}
                  </td>
                  <td>
                    <span className={"chip chip-" + CV_TONE[v.status]}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="solid table-wrap">
          <table className="jtable">
            <thead>
              <tr>
                <th>JCE-PR</th>
                <th>Date</th>
                <th>Payee</th>
                <th>TIN</th>
                <th>Invoice</th>
                <th>Project</th>
                <th>RFP No.</th>
                <th>Sundry Account</th>
                <th className="num">Amount</th>
                <th>ATC</th>
                <th>SO No.</th>
              </tr>
            </thead>
            <tbody>
              {VOUCHERS.map((v, i) => (
                <tr key={i}>
                  <td className="mono">PR-{1000 + i}</td>
                  <td className="mono" style={{ fontSize: 12 }}>
                    {v.date}
                  </td>
                  <td>{v.payee}</td>
                  <td className="mono" style={{ fontSize: 11 }}>
                    000-000-000
                  </td>
                  <td>{v.inv}</td>
                  <td>{v.so}</td>
                  <td>{v.rfp}</td>
                  <td>50001 Cost of Services</td>
                  <td className="num money">{pmoney(v.gross)}</td>
                  <td className="mono">WI010</td>
                  <td>{v.so}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A14 · Payable Voucher form/detail
// ---------------------------------------------------------------------------
function A14Form({ cv, onBack }) {
  const [status, setStatus] = useState(cv.status);
  const STAGES = [
    "Draft",
    "Pending VP-Finance",
    "Pending President",
    "Approved",
    "Paid",
  ];
  const idx = STAGES.indexOf(status);
  return (
    <div className="screen wide">
      <button className="back-link" onClick={onBack}>
        ← Voucher register
      </button>
      <div className="glass pay-header">
        <div className="pay-head-top">
          <div>
            <div className="kicker">
              Accounting · A14 · Bank Payment Voucher
            </div>
            <h2 className="ph-title">
              <span className="docchip">{cv.cv}</span> {cv.payee}
            </h2>
            <div className="pay-meta">
              {cv.ptype} · {cv.so} · {cv.rfp !== "—" ? cv.rfp : ""}{" "}
              {cv.po !== "—" ? "· " + cv.po : ""}
            </div>
          </div>
          <div className="pay-head-actions">
            <span className={"chip chip-" + CV_TONE[status]}>{status}</span>
            {idx < 4 && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setStatus(STAGES[idx + 1])}
              >
                {idx === 2
                  ? "Approve"
                  : idx === 3
                    ? "Record payment"
                    : "Advance →"}
              </button>
            )}
          </div>
        </div>
        <div className="pay-stepper">
          {STAGES.map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={
                  "pstep " + (i < idx ? "done" : i === idx ? "curr" : "todo")
                }
              >
                <span className="pdot">{i < idx ? "✓" : i + 1}</span>
                <span className="plabel">{s}</span>
              </div>
              {i < STAGES.length - 1 && (
                <span className={"pline " + (i < idx ? "done" : "")}></span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="twopane">
        <div className="solid form-body">
          <div className="form-section-title">Payee &amp; references</div>
          <div className="form-grid">
            <L l="CV Number">
              <input className="field" defaultValue={cv.cv} />
            </L>
            <L l="CV Date">
              <input className="field" type="date" defaultValue={cv.date} />
            </L>
            <L l="Payee">
              <input className="field" defaultValue={cv.payee} />
            </L>
            <L l="PO No. (FK for supplier)">
              <input className="field" defaultValue={cv.po} />
            </L>
            <L l="RFP No.">
              <input className="field" defaultValue={cv.rfp} />
            </L>
            <L l="Invoice No.">
              <input className="field" defaultValue={cv.inv} />
            </L>
          </div>
          <div className="form-section-title">Amounts</div>
          <div className="form-grid">
            <L l="Gross amount">
              <input className="field" defaultValue={pmoney(cv.gross)} />
            </L>
            <L l="ATC code (EWT from RFP)">
              <select className="field">
                <option>WI010 — Goods 1%</option>
                <option>WI020 — Services 2%</option>
              </select>
            </L>
            <L l="Withholding Tax" computed>
              <div className="field is-computed">{pmoney(cv.wtax)}</div>
            </L>
            <L l="Net amount" computed>
              <div className="field is-computed" style={{ fontWeight: 700 }}>
                ₱{pmoney(cv.net)}
              </div>
            </L>
          </div>
          <div className="wht-preview">
            Gross {pmoney(cv.gross)} − WHT {pmoney(cv.wtax)} ={" "}
            <strong>Net {pmoney(cv.net)}</strong>
          </div>
          <div className="form-section-title">Journal (double-entry)</div>
          <div
            className="solid table-wrap"
            style={{ boxShadow: "none", border: "1px solid var(--jce-line)" }}
          >
            <table className="jtable">
              <thead>
                <tr>
                  <th>Account</th>
                  <th className="num">Debit</th>
                  <th className="num">Credit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    50001 Cost of Services{" "}
                    <span className="muted">(Sundry)</span>
                  </td>
                  <td className="num money">{pmoney(cv.gross)}</td>
                  <td className="num">—</td>
                </tr>
                <tr>
                  <td>20021 Withholding Tax Payable</td>
                  <td className="num">—</td>
                  <td className="num money">{pmoney(cv.wtax)}</td>
                </tr>
                <tr>
                  <td>20004 Voucher's Payable</td>
                  <td className="num">—</td>
                  <td className="num money">{pmoney(cv.net)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="preview-frame glass">
          <div className="preview-bar">
            <span className="kicker" style={{ margin: 0 }}>
              Live preview
            </span>
            <span className="chip chip-neutral">BANK PAYMENT VOUCHER</span>
          </div>
          <div className="paper">
            <div className="ph">
              <div className="co">JC ELECTROFIELDS POWER SYSTEM, INC.</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800 }}>BANK PAYMENT VOUCHER</div>
                <div className="docn">{cv.cv}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, margin: "6px 0" }}>
              Payee: <strong>{cv.payee}</strong> · {cv.date}
            </div>
            <table>
              <thead>
                <tr>
                  <th>Account</th>
                  <th className="num">Debit</th>
                  <th className="num">Credit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cost of Services</td>
                  <td className="num">{pmoney(cv.gross)}</td>
                  <td className="num">—</td>
                </tr>
                <tr>
                  <td>WHT Payable</td>
                  <td className="num">—</td>
                  <td className="num">{pmoney(cv.wtax)}</td>
                </tr>
                <tr>
                  <td>Voucher's Payable</td>
                  <td className="num">—</td>
                  <td className="num">{pmoney(cv.net)}</td>
                </tr>
              </tbody>
            </table>
            <div
              style={{
                fontSize: 9,
                fontStyle: "italic",
                color: "#444",
                margin: "6px 0",
              }}
            >
              ***Net amount in words***
            </div>
            <div className="sigblock">
              <div className="sig">
                <div className="line"></div>
                <div className="role">Prepared by</div>
              </div>
              <div className="sig">
                <div className="line"></div>
                <div className="role">Approved · VP-Finance</div>
              </div>
              <div className="sig">
                <div className="line"></div>
                <div className="role">Approved · President</div>
              </div>
            </div>
            <div
              className="sigblock"
              style={{ gridTemplateColumns: "1fr", marginTop: 10 }}
            >
              <div className="sig">
                <div className="line"></div>
                <div className="role">Payment received by · paper-only</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A15 · Disbursement register + reconciliation
// ---------------------------------------------------------------------------
function A15Disbursement() {
  const [recon, setRecon] = useState(false);
  const byBank = {};
  DISBURSE.forEach((d) => {
    byBank[d.bank] = (byBank[d.bank] || 0) + d.amount;
  });
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Accounting · A15 · Disbursement</div>
          <h2 className="ph-title">
            {recon ? "Bank reconciliation" : "Disbursement register"}
          </h2>
        </div>
        <div className="ph-actions">
          <div className="seg glass-nav">
            <button
              className={!recon ? "on" : ""}
              onClick={() => setRecon(false)}
            >
              Register
            </button>
            <button
              className={recon ? "on" : ""}
              onClick={() => setRecon(true)}
            >
              Reconciliation
            </button>
          </div>
          <button className="btn btn-post btn-sm">⎙ Bank-pivot PDF</button>
        </div>
      </div>
      {!recon ? (
        <div className="solid table-wrap">
          <table className="jtable">
            <thead>
              <tr>
                <th>Date</th>
                <th>CV No.</th>
                <th>Payee</th>
                <th>Description</th>
                <th>Check Date</th>
                <th>Check No.</th>
                <th>Bank Account</th>
                <th className="num">Amount</th>
              </tr>
            </thead>
            <tbody>
              {DISBURSE.map((d, i) => (
                <tr key={i}>
                  <td className="mono" style={{ fontSize: 12 }}>
                    {d.date}
                  </td>
                  <td>
                    <span className="docchip">{d.cv}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{d.payee}</td>
                  <td style={{ color: "var(--jce-ink-2)" }}>{d.desc}</td>
                  <td className="mono" style={{ fontSize: 12 }}>
                    {d.checkDate}
                  </td>
                  <td className="mono">{d.checkNo}</td>
                  <td>
                    <span className="docchip sm">{d.bank}</span>
                  </td>
                  <td className="num money">{pmoney(d.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="recon-grid">
          {Object.entries(byBank).map(([b, t]) => (
            <div key={b} className="solid recon-bank">
              <div className="recon-head">
                <span className="docchip">Bank {b}</span>
                <span className="money" style={{ fontWeight: 700 }}>
                  ₱{pmoney(t)}
                </span>
              </div>
              <div className="recon-sub">
                Period disbursements · running cash position
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="muted-note" style={{ marginTop: 10 }}>
        Record from an Approved CV → CV flips Paid. Void = reversing entry, CV
        back to Approved (reason logged). Shared check numbers render grouped.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A16 · Journal Voucher (+ CA liquidation)
// ---------------------------------------------------------------------------
function A16JV({ onOpen }) {
  const [detail, setDetail] = useState(null);
  if (detail) {
    const dr = JV_LINES.reduce((a, l) => a + l.dr, 0),
      cr = JV_LINES.reduce((a, l) => a + l.cr, 0);
    return (
      <div className="screen wide">
        <button className="back-link" onClick={() => setDetail(null)}>
          ← Journal Vouchers
        </button>
        <div className="page-head glass">
          <div>
            <div className="kicker">Accounting · A16 · {detail.cat}</div>
            <h2 className="ph-title">
              <span className="docchip">{detail.jv}</span>
            </h2>
          </div>
          <div className="ph-actions">
            <span
              className={
                "chip chip-" +
                {
                  Draft: "neutral",
                  "Pending Check": "pending",
                  Posted: "success",
                  Reversed: "danger",
                }[detail.status]
              }
            >
              {detail.status}
            </span>
            <button className="btn btn-post btn-sm" disabled={dr !== cr}>
              Post
            </button>
          </div>
        </div>
        {detail.cat === "Cash Advance Liquidation" && (
          <div className="autorow-note solid">
            <Icon name="check" size={15} color="var(--st-success)" />
            <span>
              CA Liquidation wizard — source <strong>CV-1633</strong> ·
              cash_advance_ref <strong>CA-26-0033</strong> · outstanding
              ₱95,000.00. Validates: Σ expenses + returned cash = outstanding
              balance.
            </span>
          </div>
        )}
        <div className="solid table-wrap">
          <table className="jtable">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Account</th>
                <th>Description</th>
                <th className="num">Debit</th>
                <th className="num">Credit</th>
              </tr>
            </thead>
            <tbody>
              {JV_LINES.map((l, i) => (
                <tr key={i}>
                  <td>
                    {l.ref ? <span className="docchip sm">{l.ref}</span> : "—"}
                  </td>
                  <td>{l.acct}</td>
                  <td style={{ color: "var(--jce-ink-2)" }}>{l.desc}</td>
                  <td className="num money">{l.dr ? pmoney(l.dr) : "—"}</td>
                  <td className="num money">{l.cr ? pmoney(l.cr) : "—"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="grid-tot">
                <td colSpan="3">Σ · Difference {pmoney(dr - cr)}</td>
                <td className="num money">{pmoney(dr)}</td>
                <td className="num money">{pmoney(cr)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="muted-note" style={{ marginTop: 10 }}>
          Must equal 0.00 to Post · Post = immutable · Reverse auto-flips a
          draft JV citing the original.
        </div>
      </div>
    );
  }
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Accounting · A16</div>
          <h2 className="ph-title">Journal Vouchers</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-primary btn-sm">+ New JV</button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>JV No.</th>
              <th>Date</th>
              <th>Category</th>
              <th>SO#</th>
              <th>Description</th>
              <th className="num">Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {JVS.map((j) => (
              <tr
                key={j.jv}
                onClick={() => setDetail(j)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span className="docchip">{j.jv}</span>
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {j.date}
                </td>
                <td>{j.cat}</td>
                <td>
                  {j.so === "—" ? (
                    "—"
                  ) : (
                    <span className="docchip sm">{j.so}</span>
                  )}
                </td>
                <td style={{ color: "var(--jce-ink-2)" }}>{j.desc}</td>
                <td className="num money">{pmoney(j.total)}</td>
                <td>
                  <span
                    className={
                      "chip chip-" +
                      {
                        Draft: "neutral",
                        "Pending Check": "pending",
                        Posted: "success",
                        Reversed: "danger",
                      }[j.status]
                    }
                  >
                    {j.status}
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
// A17 · Cash Advance ledger
// ---------------------------------------------------------------------------
function A17CA() {
  const out = CASH_ADV.filter((c) => c.status === "Outstanding");
  const buckets = { "0–30": 0, "31–60": 0, "61–90": 0, "90+": 0 };
  CASH_ADV.forEach((c) => {
    if (c.bal > 0) buckets[c.age] += c.bal;
  });
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Accounting · A17</div>
          <h2 className="ph-title">Cash Advance ledger</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">Export</button>
        </div>
      </div>
      <div className="kpi-row">
        {Object.entries(buckets).map(([b, v]) => (
          <div key={b} className="kpi-tile glass">
            <div className="kpi-k">Aging · {b} days</div>
            <div className="kpi-v" style={{ fontSize: 22 }}>
              ₱{pmoney(v)}
            </div>
            <div
              className="kpi-d"
              style={{
                color:
                  b === "90+" && v > 0
                    ? "var(--st-danger)"
                    : "var(--jce-ink-2)",
              }}
            >
              {b === "90+" && v > 0 ? "stale — follow up" : "outstanding"}
            </div>
          </div>
        ))}
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>CA No.</th>
              <th>Issued to</th>
              <th>SO#</th>
              <th className="num">Issued</th>
              <th>Source CV</th>
              <th>Liquidating JV</th>
              <th className="num">Outstanding</th>
              <th>Age</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {CASH_ADV.map((c) => (
              <tr
                key={c.ca}
                className={c.age === "90+" && c.bal > 0 ? "stale-row" : ""}
              >
                <td>
                  <span className="docchip">{c.ca}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{c.to}</td>
                <td>
                  <span className="docchip sm">{c.so}</span>
                </td>
                <td className="num money">{pmoney(c.amount)}</td>
                <td>
                  <span className="docchip sm">{c.cv}</span>
                </td>
                <td>
                  {c.jv === "—" ? (
                    "—"
                  ) : (
                    <span className="docchip sm">{c.jv}</span>
                  )}
                </td>
                <td className="num money" style={{ fontWeight: 600 }}>
                  {pmoney(c.bal)}
                </td>
                <td>{c.age}</td>
                <td>
                  <span
                    className={
                      "chip chip-" +
                      (c.status === "Liquidated" ? "success" : "pending")
                    }
                  >
                    {c.status}
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

Object.assign(window, { A13Register, A14Form, A15Disbursement, A16JV, A17CA });
