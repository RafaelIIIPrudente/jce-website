// ============================================================================
// JCE SYSTEM — PMG · P8 Accomplishment report workspace (FLAGSHIP)
//   live NET AMOUNT math · lock-on-submit · byte-faithful print variant
// ============================================================================

function A_pct(n) {
  return n.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function P8Accomplishment({ role, project, onBack }) {
  const canEdit = role === "pmhead" || role === "owner";
  const [view, setView] = useState("screen"); // screen | print
  const [submitted, setSubmitted] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const rows = boqRows();
  const [vals, setVals] = useState(() => {
    const o = {};
    rows.forEach((r) => {
      const d = PB1_DEFAULTS[r.key] || [0, 0];
      o[r.key] = { prev: d[0], tp: d[1] };
    });
    return o;
  });

  const contract = project.contract || CONTRACT;
  const setTP = (key, v) => {
    if (!canEdit || submitted) return;
    let n = Math.max(0, Math.min(100, Number(v) || 0));
    setVals((s) => ({ ...s, [key]: { ...s[key], tp: n } }));
  };

  // computed rows
  const comp = rows.map((r) => {
    const weight = (r.value / contract) * 100;
    const { prev, tp } = vals[r.key];
    const toDate = Math.min(100, prev + tp);
    const tpW = (weight * tp) / 100;
    const tdW = (weight * toDate) / 100;
    const peso = (r.value * tp) / 100;
    return { ...r, weight, prev, tp, toDate, tpW, tdW, peso };
  });
  const PBn = comp.reduce((a, r) => a + r.peso, 0);
  const accomplishment = comp.reduce((a, r) => a + r.tpW, 0); // overall this-period %
  const recoup = Math.min((DP_PCT / 100) * PBn, DP_AMOUNT); // simplified: dp remaining = full DP
  const retention = (RET_PCT / 100) * PBn;
  const netAmount = PBn - recoup - retention;

  // stage-sequence guardrail: Install advancing while Procure/Deliver < 100% on same line
  const lineStageState = {};
  comp.forEach((r) => {
    if (r.stage) {
      lineStageState[r.no] = lineStageState[r.no] || {};
      lineStageState[r.no][r.stage] = r.toDate;
    }
  });
  const guardFlag = (r) => {
    if (r.stage !== "Install") return false;
    const s = lineStageState[r.no];
    return r.tp > 0 && ((s.Procure || 0) < 100 || (s.Deliver || 0) < 100);
  };
  // delivery cross-check (informational): Procure reported but tracker behind — demo flag on B.1 Procure
  const deliveryFlag = (r) => r.key === "B.1-Procure" && r.tp > 0;

  // ---------- BYTE-FAITHFUL PRINT VARIANT ----------
  if (view === "print") {
    return (
      <div className="screen wide">
        <div className="print-toolbar glass">
          <button
            className="back-link"
            onClick={() => setView("screen")}
            style={{ margin: 0 }}
          >
            ← Screen view
          </button>
          <span className="kicker" style={{ margin: 0 }}>
            Byte-faithful print — PM head's spreadsheet · sacred layout
          </span>
          <button
            className="btn btn-post btn-sm"
            onClick={() => window.print()}
          >
            ⎙ Print / PDF
          </button>
        </div>
        <div className="solid xls">
          <div className="xls-head">
            <div className="xls-co">JC ELECTROFIELDS POWER SYSTEM, INC.</div>
            <div className="xls-title">ACCOMPLISHMENT REPORT</div>
            <div className="xls-sub">
              {project.name} &nbsp;·&nbsp; {project.client} &nbsp;·&nbsp; SO#{" "}
              {project.so} &nbsp;·&nbsp; Period: PB1 &nbsp;·&nbsp; As of:
              2026-05-15
            </div>
          </div>
          <table className="xls-table">
            <thead>
              <tr>
                <th rowSpan="2">ITEM</th>
                <th rowSpan="2">DESCRIPTION</th>
                <th rowSpan="2">STAGE</th>
                <th rowSpan="2">AMOUNT</th>
                <th rowSpan="2">WT %</th>
                <th colSpan="2">PREVIOUS</th>
                <th colSpan="2">THIS PERIOD</th>
                <th colSpan="2">TO DATE</th>
              </tr>
              <tr>
                <th>%</th>
                <th>WT</th>
                <th>%</th>
                <th>WT</th>
                <th>%</th>
                <th>WT</th>
              </tr>
            </thead>
            <tbody>
              {BOQ.map((c) => (
                <React.Fragment key={c.cat}>
                  <tr className="xls-band">
                    <td colSpan="11">{c.cat}</td>
                  </tr>
                  {comp
                    .filter((r) =>
                      BOQ.find((cc) => cc.cat === c.cat).lines.some(
                        (l) => l.no === r.no,
                      ),
                    )
                    .map((r) => (
                      <tr key={r.key}>
                        <td>{r.no}</td>
                        <td className="xls-desc">{r.desc}</td>
                        <td>{r.stage || "—"}</td>
                        <td className="xn">{A_pct(r.value)}</td>
                        <td className="xn">{A_pct(r.weight)}</td>
                        <td className="xn">{A_pct(r.prev)}</td>
                        <td className="xn">
                          {A_pct((r.weight * r.prev) / 100)}
                        </td>
                        <td className="xn">{A_pct(r.tp)}</td>
                        <td className="xn">{A_pct(r.tpW)}</td>
                        <td className="xn">{A_pct(r.toDate)}</td>
                        <td className="xn">{A_pct(r.tdW)}</td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
              <tr className="xls-total">
                <td colSpan="3">GRAND TOTAL</td>
                <td className="xn">{A_pct(contract)}</td>
                <td className="xn">100.00</td>
                <td className="xn">0.00</td>
                <td className="xn">0.00</td>
                <td className="xn"></td>
                <td className="xn">{A_pct(accomplishment)}</td>
                <td className="xn"></td>
                <td className="xn">{A_pct(accomplishment)}</td>
              </tr>
            </tbody>
          </table>
          <div className="xls-net">
            <div className="xls-net-row">
              <span>PROGRESS BILL (PB1)</span>
              <span className="xn">{A_pct(PBn)}</span>
            </div>
            <div className="xls-net-row">
              <span>Less: DP Recoupment ({DP_PCT}%)</span>
              <span className="xn">({A_pct(recoup)})</span>
            </div>
            <div className="xls-net-row">
              <span>Less: Retention ({RET_PCT}%)</span>
              <span className="xn">({A_pct(retention)})</span>
            </div>
            <div className="xls-net-row tot">
              <span>NET AMOUNT</span>
              <span className="xn">{A_pct(netAmount)}</span>
            </div>
          </div>
          <div className="xls-sign">
            <div className="sig">
              <div className="line"></div>
              <div className="role">Prepared by · Project Manager</div>
            </div>
            <div className="sig">
              <div className="line"></div>
              <div className="role">Checked by</div>
            </div>
            <div className="sig">
              <div className="line"></div>
              <div className="role">Approved by</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- ON-SCREEN WORKSPACE ----------
  return (
    <div className="screen wide">
      <button className="back-link" onClick={onBack}>
        ← {project.name}
      </button>

      <div className="glass period-bar">
        <div className="pb-left">
          <div className="kicker">PMG · P8 · Accomplishment</div>
          <div className="pb-title">{project.name}</div>
          <div className="pb-meta">
            {project.client} · SO# {project.so} · Contract ₱{A_pct(contract)}
          </div>
        </div>
        <div className="pb-controls">
          <select className="field" style={{ width: "auto" }}>
            <option>PB1 · as of 2026-05-15</option>
            <option>PB2 (open)</option>
          </select>
          {submitted ? (
            <span className="chip chip-locked">Submitted · Locked</span>
          ) : (
            <span className="chip chip-neutral">Draft</span>
          )}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setView("print")}
          >
            Print view
          </button>
          {canEdit && !submitted && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowSubmit(true)}
            >
              Submit period
            </button>
          )}
        </div>
      </div>

      {!canEdit && (
        <div className="mask-banner">
          <Icon name="lock" size={15} /> Only the <strong>PM Head</strong> can
          key This Period %. You have read-only access ({ROLES[role].short}).
        </div>
      )}
      {submitted && (
        <div className="lockbar">
          <Icon name="lock" size={16} />
          <div>
            <div className="lt">Period PB1 submitted — immutable</div>
            <div className="ld">
              Corrections = next-period adjusting entry (default) or an audited
              re-open with full snapshot.
            </div>
          </div>
        </div>
      )}

      <div className="acc-layout">
        {/* report grid */}
        <div className="solid table-wrap grid-wrap">
          <table className="jtable accgrid">
            <thead>
              <tr>
                <th className="frz">Item</th>
                <th>Description</th>
                <th>Stage</th>
                <th className="num">Prev %</th>
                <th className="num tp-head">This Period %</th>
                <th className="num">To Date %</th>
                <th className="num">Wt %</th>
                <th className="num">TP wt</th>
                <th className="num">TD wt</th>
                <th className="num">Amount (PB)</th>
              </tr>
            </thead>
            <tbody>
              {BOQ.map((c) => (
                <React.Fragment key={c.cat}>
                  <tr className="band-row">
                    <td colSpan="10">{c.cat}</td>
                  </tr>
                  {comp
                    .filter((r) => c.lines.some((l) => l.no === r.no))
                    .map((r) => {
                      const gf = guardFlag(r),
                        df = deliveryFlag(r);
                      return (
                        <tr key={r.key} className={gf ? "guard-row" : ""}>
                          <td className="frz mono">{r.no}</td>
                          <td>{r.desc}</td>
                          <td>
                            {r.stage ? (
                              <span className="stage-chip">{r.stage}</span>
                            ) : (
                              <span className="muted">—</span>
                            )}
                          </td>
                          <td className="num">{A_pct(r.prev)}</td>
                          <td className="num tp-cell">
                            {canEdit && !submitted ? (
                              <input
                                className="tp-input"
                                value={r.tp}
                                onChange={(e) => setTP(r.key, e.target.value)}
                              />
                            ) : (
                              <span>{A_pct(r.tp)}</span>
                            )}
                            {gf && (
                              <span
                                className="flag-mini guard"
                                title="Stage-sequence guardrail: Install advancing while Procure/Deliver < 100%"
                              >
                                ⚠
                              </span>
                            )}
                            {df && (
                              <span
                                className="flag-mini deliver"
                                title="Reported ahead of delivery (informational — import tracker stage behind)"
                              >
                                ◇
                              </span>
                            )}
                          </td>
                          <td className="num computed">{A_pct(r.toDate)}</td>
                          <td className="num">{A_pct(r.weight)}</td>
                          <td className="num computed">{A_pct(r.tpW)}</td>
                          <td className="num computed">{A_pct(r.tdW)}</td>
                          <td className="num money">{A_pct(r.peso)}</td>
                        </tr>
                      );
                    })}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr className="grid-tot">
                <td colSpan="4">Grand total · this-period accomplishment</td>
                <td className="num">{A_pct(accomplishment)}%</td>
                <td></td>
                <td className="num">100.00</td>
                <td className="num">{A_pct(accomplishment)}</td>
                <td></td>
                <td className="num money">{A_pct(PBn)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* NET AMOUNT block + indicators */}
        <div className="acc-side">
          <div className="solid net-card">
            <div className="card-title">NET AMOUNT · PB1</div>
            <div className="net-row">
              <span>Progress Bill (PB1)</span>
              <span className="money">₱{A_pct(PBn)}</span>
            </div>
            <div className="net-row sub">
              <span>− DP Recoupment ({DP_PCT}%)</span>
              <span className="money">({A_pct(recoup)})</span>
            </div>
            <div className="net-row sub">
              <span>− Retention ({RET_PCT}%)</span>
              <span className="money">({A_pct(retention)})</span>
            </div>
            <div className="net-row net">
              <span>NET AMOUNT</span>
              <span className="money">₱{A_pct(netAmount)}</span>
            </div>
            <div className="net-anchor">
              Reference anchor — NORECO2 PB1: 11.34% · ₱6,039,221.60 −
              905,883.24 − 603,922.16 = <strong>₱4,529,416.20</strong>
            </div>
          </div>
          <div className="glass ind-card">
            <div className="card-title">Running indicators</div>
            <div className="ind-row">
              <span>Recouped to date</span>
              <span className="money">₱{A_pct(recoup)}</span>
            </div>
            <div className="ind-row">
              <span>Remaining downpayment</span>
              <span className="money">₱{A_pct(DP_AMOUNT - recoup)}</span>
            </div>
            <div className="ind-row">
              <span>Retention held to date</span>
              <span className="money">₱{A_pct(retention)}</span>
            </div>
            <div className="ind-row">
              <span>Outstanding retention payable</span>
              <span className="money">₱{A_pct(retention)}</span>
            </div>
          </div>
          <div className="flags-card solid">
            <div className="flag-line">
              <span className="flag-mini guard">⚠</span> Stage-sequence
              guardrail — soft block, override with recorded reason.
            </div>
            <div className="flag-line">
              <span className="flag-mini deliver">◇</span> Delivery cross-check
              — informational; never blocks. Procure↔stages 1–7, Deliver↔8–13,
              Install↔14–15.
            </div>
          </div>
        </div>
      </div>

      {showSubmit && (
        <div className="jce-scrim center">
          <div className="glass-modal idle-modal">
            <h3>Submit PB1 — lock period?</h3>
            <p>
              This locks the period (immutable). To Date becomes the baseline
              for PB2. Net Amount <strong>₱{A_pct(netAmount)}</strong> flows to
              billing (P9). Corrections then require a next-period adjusting
              entry or an audited re-open.
            </p>
            <div className="idle-acts">
              <button
                className="btn btn-ghost"
                onClick={() => setShowSubmit(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSubmitted(true);
                  setShowSubmit(false);
                }}
              >
                Submit &amp; lock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.P8Accomplishment = P8Accomplishment;
