// ============================================================================
// JCE SYSTEM — Accounting · A18 Reporting hub (FLAGSHIP)
//   catalog (glass cards by family) → generate panel → report viewer + drill-down
// ============================================================================

function A18Reporting({ role }) {
  const [picked, setPicked] = useState(null); // [family, [name, desc, tag]]
  const [generated, setGenerated] = useState(false);
  const [drill, setDrill] = useState(null);

  // ---- catalog ----
  if (!picked) {
    return (
      <div className="screen">
        <div className="page-head glass">
          <div>
            <div className="kicker">Accounting · A18</div>
            <h2 className="ph-title">Reporting hub</h2>
          </div>
          <div className="ph-actions">
            <span className="muted-note">
              Drill-down everywhere · snapshots · live-vs-snapshot labeling
            </span>
          </div>
        </div>
        {Object.entries(REPORTS).map(([fam, items]) => (
          <div key={fam} className="report-family">
            <div className="rep-fam-title">{fam}</div>
            <div className="rep-cards">
              {items.map((it, i) => (
                <button
                  key={i}
                  className="glass rep-card"
                  onClick={() => {
                    setPicked([fam, it]);
                    setGenerated(false);
                  }}
                >
                  <div className="rep-card-t">{it[0]}</div>
                  <div className="rep-card-d">{it[1]}</div>
                  <div className="rep-card-tag">{it[2]}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const [fam, it] = picked;
  const isTB = it[0] === "Trial Balance";
  const isBS = it[0] === "Balance Sheet";
  const isAging = it[0] === "AR Aging";

  // ---- generate panel + viewer ----
  return (
    <div className="screen wide">
      <button
        className="back-link"
        onClick={() => {
          setPicked(null);
          setDrill(null);
        }}
      >
        ← Report catalog
      </button>
      <div className="page-head glass">
        <div>
          <div className="kicker">{fam}</div>
          <h2 className="ph-title">{it[0]}</h2>
        </div>
        <div className="ph-actions">
          {generated && (
            <React.Fragment>
              <button className="btn btn-ghost btn-sm">
                Export PDF / Excel
              </button>
              <button className="btn btn-accent btn-sm">Snapshot</button>
            </React.Fragment>
          )}
        </div>
      </div>

      <div className="report-split">
        {/* generate panel */}
        <div className="solid gen-panel">
          <div className="card-title">Parameters</div>
          <label className="lbl">Report type</label>
          <div className="field is-computed">{it[0]}</div>
          <label className="lbl" style={{ marginTop: 12 }}>
            As-of / period
          </label>
          <select className="field">
            <option>This month</option>
            <option>Last month</option>
            <option>This quarter</option>
            <option>This year</option>
          </select>
          <div className="quick-picks">
            {["MTD", "QTD", "YTD"].map((q) => (
              <span key={q} className="qp">
                {q}
              </span>
            ))}
          </div>
          <label className="checkrow" style={{ marginTop: 12 }}>
            <input type="checkbox" defaultChecked /> Comparative (prior period)
          </label>
          {isTB && (
            <label className="checkrow">
              <input type="checkbox" defaultChecked /> Display all CoA accounts
            </label>
          )}
          <label className="lbl" style={{ marginTop: 12 }}>
            Project filter
          </label>
          <select className="field">
            <option>All projects</option>
            {PROJECTS.map((p) => (
              <option key={p.so}>
                {p.so} · {p.label}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 16 }}
            onClick={() => setGenerated(true)}
          >
            Generate report
          </button>
          {generated && (
            <div className="gen-meta">
              Generated 2026-06-03 10:22 · by {ROLES[role].short} ·{" "}
              <span
                className="chip chip-success"
                style={{ padding: "1px 7px" }}
              >
                Live
              </span>
            </div>
          )}
        </div>

        {/* viewer */}
        <div className="solid report-viewer">
          {!generated ? (
            <div className="empty" style={{ padding: 60 }}>
              <div className="ill">▦</div>
              <div className="et">Set parameters &amp; generate</div>
              <div className="ed">
                The {it[0]} renders here with drill-down.
              </div>
            </div>
          ) : isTB ? (
            <React.Fragment>
              <div className="rv-head">
                <div className="rv-co">JC ELECTROFIELDS POWER SYSTEM, INC.</div>
                <div className="rv-title">
                  Trial Balance · as of 2026-06-03 · Landscape Long bond
                </div>
              </div>
              <table className="jtable rv-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Account</th>
                    <th className="num">Debit</th>
                    <th className="num">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {TB_ROWS.map((r, i) => (
                    <tr
                      key={i}
                      onClick={() => setDrill(r)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="mono" style={{ fontWeight: 600 }}>
                        {r[0]}
                      </td>
                      <td>
                        {r[1]} <span className="drill-hint">drill →</span>
                      </td>
                      <td className="num money">{r[2] ? pmoney(r[2]) : "—"}</td>
                      <td className="num money">{r[3] ? pmoney(r[3]) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="grid-tot">
                    <td colSpan="2">TOTALS</td>
                    <td className="num money">
                      {pmoney(TB_ROWS.reduce((a, r) => a + r[2], 0))}
                    </td>
                    <td className="num money">
                      {pmoney(TB_ROWS.reduce((a, r) => a + r[3], 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </React.Fragment>
          ) : isBS ? (
            <React.Fragment>
              <div className="rv-head">
                <div className="rv-co">JC ELECTROFIELDS POWER SYSTEM, INC.</div>
                <div className="rv-title">Balance Sheet · as of 2026-06-03</div>
              </div>
              <table className="jtable rv-table">
                <tbody>
                  <tr className="bs-band">
                    <td colSpan="2">I · CURRENT ASSETS</td>
                  </tr>
                  <tr>
                    <td>Cash in Bank</td>
                    <td className="num money">{pmoney(5745000)}</td>
                  </tr>
                  <tr>
                    <td>Trade &amp; Retention Receivable</td>
                    <td className="num money">{pmoney(3967000)}</td>
                  </tr>
                  <tr className="bs-sub">
                    <td>Total Current Assets</td>
                    <td className="num money">{pmoney(9712000)}</td>
                  </tr>
                  <tr className="bs-band">
                    <td colSpan="2">XX · CURRENT LIABILITIES</td>
                  </tr>
                  <tr>
                    <td>Voucher's &amp; Trade Payable</td>
                    <td className="num money">{pmoney(4470081)}</td>
                  </tr>
                  <tr>
                    <td>Output VAT &amp; WHT Payable</td>
                    <td className="num money">{pmoney(1492714)}</td>
                  </tr>
                  <tr className="bs-sub">
                    <td>Total Current Liabilities</td>
                    <td className="num money">{pmoney(5962795)}</td>
                  </tr>
                  <tr className="bs-band">
                    <td colSpan="2">XXXV · STOCKHOLDERS EQUITY</td>
                  </tr>
                  <tr>
                    <td>Owner's Capital + Retained Earnings</td>
                    <td className="num money">{pmoney(3749205)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="muted-note" style={{ padding: "8px 12px" }}>
                Roman-numeral lines driven by mapping_version (A1 §9). Click any
                line to drill to contributing accounts.
              </div>
            </React.Fragment>
          ) : isAging ? (
            <React.Fragment>
              <div className="rv-head">
                <div className="rv-co">JC ELECTROFIELDS POWER SYSTEM, INC.</div>
                <div className="rv-title">AR Aging · as of 2026-06-03</div>
              </div>
              <table className="jtable rv-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th className="num">0–30</th>
                    <th className="num">31–60</th>
                    <th className="num">61–90</th>
                    <th className="num">90+</th>
                    <th className="num">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>NORECO II</td>
                    <td className="num money">{pmoney(2410000)}</td>
                    <td className="num">—</td>
                    <td className="num">—</td>
                    <td className="num">—</td>
                    <td className="num money">{pmoney(2410000)}</td>
                  </tr>
                  <tr>
                    <td>Meralco</td>
                    <td className="num">—</td>
                    <td className="num money">{pmoney(880000)}</td>
                    <td className="num">—</td>
                    <td className="num">—</td>
                    <td className="num money">{pmoney(880000)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="grid-tot">
                    <td>Total</td>
                    <td className="num money">{pmoney(2410000)}</td>
                    <td className="num money">{pmoney(880000)}</td>
                    <td className="num">—</td>
                    <td className="num">—</td>
                    <td className="num money">{pmoney(3290000)}</td>
                  </tr>
                </tfoot>
              </table>
            </React.Fragment>
          ) : (
            <div className="rv-generic">
              <div className="rv-head">
                <div className="rv-co">JC ELECTROFIELDS POWER SYSTEM, INC.</div>
                <div className="rv-title">{it[0]} · 2026-06-03</div>
              </div>
              <div className="empty" style={{ padding: 40 }}>
                <div className="ill">{fam.startsWith("B") ? "§" : "▤"}</div>
                <div className="et">{it[0]}</div>
                <div className="ed">
                  {fam.startsWith("B")
                    ? "Generated via guided wizard in official agency layout (period + RDO/branch params)."
                    : "Rendered in " +
                      it[2] +
                      " layout with drill-down to source documents."}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* drill-down panel */}
      {drill && (
        <div className="jce-scrim" onClick={() => setDrill(null)}>
          <div
            className="drawer glass-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-head">
              <div>
                <div className="drawer-name">
                  {drill[0]} · {drill[1]}
                </div>
                <div className="drawer-sub">
                  GL drill-down → journal entries → source document
                </div>
              </div>
              <button className="iconbtn" onClick={() => setDrill(null)}>
                ✕
              </button>
            </div>
            <div className="solid drawer-body">
              <table className="jtable">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Source</th>
                    <th>Description</th>
                    <th className="num">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="mono" style={{ fontSize: 11 }}>
                      05-28
                    </td>
                    <td>
                      <span className="docchip sm">CR-0902</span>
                    </td>
                    <td>NORECO II 8th billing</td>
                    <td className="num money">{pmoney(2361800)}</td>
                  </tr>
                  <tr>
                    <td className="mono" style={{ fontSize: 11 }}>
                      05-12
                    </td>
                    <td>
                      <span className="docchip sm">CR-0888</span>
                    </td>
                    <td>NGCP mobilization</td>
                    <td className="num money">{pmoney(13269200)}</td>
                  </tr>
                  <tr>
                    <td className="mono" style={{ fontSize: 11 }}>
                      05-30
                    </td>
                    <td>
                      <span className="docchip sm">CV-1634</span>
                    </td>
                    <td>Cebu Steel payment</td>
                    <td className="num money">{pmoney(-312081)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="muted-note" style={{ marginTop: 12 }}>
                Each entry links to its source document (CV / SI / CR / JV).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.A18Reporting = A18Reporting;
