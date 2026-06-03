// ============================================================================
// JCE SYSTEM — Purchasing core: U1 dashboard · U2 PO ledger · U3 create
//   U4 detail/PDF · U5 RFP register · U6 RFP form · U9/U10 suppliers
//   U11 PRQ · U13 audit
// ============================================================================

// ---------------------------------------------------------------------------
// U1 · Dashboard
// ---------------------------------------------------------------------------
function U1Dashboard({ onLedger, onTracker, onApprovals }) {
  return (
    <div className="screen">
      <div className="home-greet">
        <h1>Purchasing</h1>
        <p>POs awaiting approval, balances due, shipments arriving.</p>
      </div>
      <div className="kpi-row">
        <button className="kpi-tile glass cta-tile" onClick={onApprovals}>
          <div className="kpi-k">POs awaiting approval</div>
          <div className="kpi-v">3</div>
          <div className="kpi-d" style={{ color: "var(--st-pending-ink)" }}>
            ▲ 1 today
          </div>
        </button>
        <div className="kpi-tile glass">
          <div className="kpi-k">Balances due this week</div>
          <div className="kpi-v" style={{ fontSize: 22 }}>
            ₱2.08M
          </div>
          <div className="kpi-d" style={{ color: "var(--st-danger)" }}>
            1 overdue
          </div>
        </div>
        <button className="kpi-tile glass cta-tile" onClick={onTracker}>
          <div className="kpi-k">Shipments arriving</div>
          <div className="kpi-v">2</div>
          <div className="kpi-d" style={{ color: "var(--st-info)" }}>
            ETA ≤ 7 days
          </div>
        </button>
        <div className="kpi-tile glass">
          <div className="kpi-k">Missing import docs</div>
          <div className="kpi-v">1</div>
          <div className="kpi-d" style={{ color: "var(--st-danger)" }}>
            stage 7 blocked
          </div>
        </div>
      </div>
      <div className="home-cols">
        <div className="glass home-panel">
          <div className="panel-head">
            <h3>POs awaiting approval</h3>
            <button className="btn btn-ghost btn-sm" onClick={onLedger}>
              PO ledger
            </button>
          </div>
          <div className="solid approval-list">
            {POS.filter(
              (p) => p.status === "For Approval" || p.status === "Sent",
            )
              .slice(0, 3)
              .map((p) => (
                <div key={p.no} className="approval-row">
                  <span className="docchip sm">{p.no}</span>
                  <div className="ap-main">
                    <div className="ap-t">{p.supplier}</div>
                    <div className="ap-m">
                      {p.project} · {p.desc}
                    </div>
                  </div>
                  <div className="ap-amt money">{ccyAmt(p.amount, p.ccy)}</div>
                </div>
              ))}
          </div>
        </div>
        <div className="glass home-panel">
          <div className="panel-head">
            <h3>Spend snapshot</h3>
            <span className="chip chip-neutral">last 6 mo</span>
          </div>
          <div className="solid" style={{ padding: 14 }}>
            <div className="chart">
              <div className="bar" style={{ height: "50%" }}></div>
              <div className="bar" style={{ height: "72%" }}></div>
              <div className="bar acc" style={{ height: "40%" }}></div>
              <div className="bar" style={{ height: "88%" }}></div>
              <div className="bar" style={{ height: "60%" }}></div>
              <div className="bar" style={{ height: "75%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// U2 · PO monitoring ledger (FLAGSHIP)
// ---------------------------------------------------------------------------
function U2Ledger({ role, onOpen, onTracker, onCreate }) {
  const [typeF, setTypeF] = useState("All");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [collapsed, setCollapsed] = useState({});
  const canCreate = role !== "management";

  const rows = POS.filter(
    (p) =>
      (typeF === "All" || p.type === typeF) &&
      (status === "All" || p.status === status) &&
      (q === "" ||
        (p.no + p.supplier + p.project + p.desc + p.so + p.mr)
          .toLowerCase()
          .includes(q.toLowerCase())),
  );

  const groups = {};
  rows.forEach((p) => {
    groups[p.project] = groups[p.project] || [];
    groups[p.project].push(p);
  });

  return (
    <div className="screen wide">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U2</div>
          <h2 className="ph-title">PO monitoring ledger</h2>
        </div>
        <div className="ph-actions">
          <div className="seg glass-nav">
            {["Local", "Import", "All"].map((t) => (
              <button
                key={t}
                className={typeF === t ? "on" : ""}
                onClick={() => setTypeF(t)}
              >
                {t}
              </button>
            ))}
          </div>
          {canCreate && (
            <button className="btn btn-primary btn-sm" onClick={onCreate}>
              + Create PO
            </button>
          )}
        </div>
      </div>
      <div className="filterbar solid">
        <div
          className="top-search"
          style={{ maxWidth: 300, background: "#fff" }}
        >
          <Icon name="search" size={15} />
          <input
            placeholder="PO No., supplier, project, MR/SO, item…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          className="field"
          style={{ width: "auto" }}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {["All", "For Approval", "Approved", "Sent", "Closed"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }}>
          Export CSV
        </button>
      </div>

      {Object.entries(groups).map(([proj, list]) => (
        <div key={proj} className="po-group">
          <button
            className="po-group-band glass"
            onClick={() => setCollapsed((c) => ({ ...c, [proj]: !c[proj] }))}
          >
            <span className="pg-caret">{collapsed[proj] ? "▸" : "▾"}</span>
            <span className="pg-name">{proj}</span>
            <span className="pg-count">
              {list.length} PO{list.length > 1 ? "s" : ""}
            </span>
          </button>
          {!collapsed[proj] && (
            <div className="solid table-wrap">
              <table className="jtable">
                <thead>
                  <tr>
                    <th>PO No.</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Supplier</th>
                    <th>Description</th>
                    <th className="num">Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Tracker</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((p) => (
                    <tr
                      key={p.no}
                      onClick={() => onOpen(p)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <span className="docchip">{p.no}</span>
                      </td>
                      <td>
                        <span
                          className={
                            "chip chip-" +
                            (p.type === "Import" ? "info" : "neutral")
                          }
                        >
                          {p.type}
                        </span>
                      </td>
                      <td className="mono" style={{ fontSize: 12 }}>
                        {p.date}
                      </td>
                      <td style={{ fontWeight: 600 }}>{p.supplier}</td>
                      <td style={{ color: "var(--jce-ink-2)" }}>{p.desc}</td>
                      <td className="num money">{ccyAmt(p.amount, p.ccy)}</td>
                      <td>
                        <span
                          className={"chip chip-" + PO_STATUS_TONE[p.status]}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={"chip chip-" + PAY_TONE[p.pay]}
                          title="Derived, never typed"
                        >
                          {p.pay}
                        </span>
                      </td>
                      <td
                        onClick={(e) => {
                          e.stopPropagation();
                          onTracker(p);
                        }}
                      >
                        {p.type === "Import" ? (
                          <span className="track-link">{p.stage}/15 →</span>
                        ) : (
                          <span className="track-link">{p.localStage}/5 →</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
      <div className="muted-note" style={{ marginTop: 10 }}>
        Default grouped by project. Payment Status is derived from RFP state,
        never typed.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// U3 · PO create/edit (branches on type)
// ---------------------------------------------------------------------------
function U3Create({ onBack }) {
  const [type, setType] = useState("Local");
  const [lines, setLines] = useState([
    {
      qty: 2,
      unit: "set",
      desc: "Power transformer 10MVA 69/13.8KV",
      price: type === "Local" ? 30440 : 42000,
    },
  ]);
  const total = lines.reduce((a, l) => a + l.qty * l.price, 0);
  const net = type === "Local" ? total / 1.12 : total;
  const vat = type === "Local" ? net * 0.12 : 0;
  const upd = (i, k, v) =>
    setLines(
      lines.map((l, j) =>
        j === i
          ? { ...l, [k]: k === "desc" || k === "unit" ? v : Number(v) }
          : l,
      ),
    );
  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← PO ledger
      </button>
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U3</div>
          <h2 className="ph-title">Create Purchase Order</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">Save Draft</button>
          <button className="btn btn-primary btn-sm">
            Submit for approval
          </button>
        </div>
      </div>
      <div className="solid form-body">
        <div
          className="seg glass-nav"
          style={{ marginBottom: 16, display: "inline-flex" }}
        >
          {["Local", "Import"].map((t) => (
            <button
              key={t}
              className={type === t ? "on" : ""}
              onClick={() => setType(t)}
            >
              {t} PO
            </button>
          ))}
        </div>
        <div className="form-grid">
          <L l="PO Number" computed>
            <div className="field is-computed">
              auto on leaving Draft ·{" "}
              {type === "Local" ? "2606-####" : "2606-####IC"}
            </div>
          </L>
          <L l="PO Date" req>
            <input className="field" type="date" defaultValue="2026-06-03" />
          </L>
          <L l="Supplier" req>
            <select className="field">
              {SUPPLIERS.map((s) => (
                <option key={s.code}>{s.name}</option>
              ))}
            </select>
          </L>
          <L l="Project">
            <select className="field">
              {PROJECTS.map((p) => (
                <option key={p.so}>{p.label}</option>
              ))}
            </select>
          </L>
          <L l="SO No.">
            <input
              className="field"
              defaultValue="26-05-378"
              placeholder="N/A allowed"
            />
          </L>
          <L l="MR No.">
            <input className="field" defaultValue="JCE-MR-2026-0142" />
          </L>
          <L l="Payment Terms">
            <input
              className="field"
              defaultValue={type === "Local" ? "NET30" : "50/50"}
            />
          </L>
          {type === "Local" ? (
            <L l="Delivery Address">
              <input
                className="field"
                defaultValue="2129 La Mesa Street, Ugong, Valenzuela"
              />
            </L>
          ) : (
            <L l="Incoterm">
              <select className="field">
                <option>DDP JCE</option>
                <option>CIF CEBU</option>
              </select>
            </L>
          )}
        </div>
        <div className="form-section-title">
          Line items{" "}
          <span className="muted">
            {type === "Local" ? "PHP · VAT-inclusive" : "USD"}
          </span>
        </div>
        <div
          className="solid table-wrap"
          style={{ boxShadow: "none", border: "1px solid var(--jce-line)" }}
        >
          <table className="jtable">
            <thead>
              <tr>
                <th className="num">Qty</th>
                <th>Unit</th>
                <th>Description</th>
                <th className="num">Unit Price</th>
                <th className="num">Total</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i}>
                  <td className="num">
                    <input
                      className="cell-input num"
                      value={l.qty}
                      onChange={(e) => upd(i, "qty", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input"
                      value={l.unit}
                      onChange={(e) => upd(i, "unit", e.target.value)}
                      style={{ width: 50 }}
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input"
                      value={l.desc}
                      onChange={(e) => upd(i, "desc", e.target.value)}
                      style={{ width: "100%", minWidth: 180 }}
                    />
                  </td>
                  <td className="num">
                    <input
                      className="cell-input num"
                      value={l.price}
                      onChange={(e) => upd(i, "price", e.target.value)}
                    />
                  </td>
                  <td className="num money">{pmoneyU(l.qty * l.price)}</td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan="5"
                  style={{
                    color: "var(--jce-ink-2)",
                    fontStyle: "italic",
                    fontSize: 11,
                  }}
                >
                  "Nothing Follows"
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginTop: 8 }}
          onClick={() =>
            setLines([...lines, { qty: 1, unit: "pcs", desc: "", price: 0 }])
          }
        >
          + Add line
        </button>
        <div className="po-totals">
          {type === "Local" ? (
            <React.Fragment>
              <div>
                <span>TOTAL (VAT-incl)</span>
                <span className="money">₱{pmoneyU(total)}</span>
              </div>
              <div>
                <span>Net of VAT</span>
                <span className="money">₱{pmoneyU(net)}</span>
              </div>
              <div>
                <span>VAT (12%)</span>
                <span className="money">₱{pmoneyU(vat)}</span>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div>
                <span>Sub-Total</span>
                <span className="money">${pmoneyU(total)}</span>
              </div>
              <div>
                <span>Discount</span>
                <span className="money">$0.00</span>
              </div>
              <div className="gt">
                <span>Grand Total</span>
                <span className="money">USD {pmoneyU(total)}</span>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// U4 · PO detail + PDF
// ---------------------------------------------------------------------------
function U4Detail({ po, onBack, onTracker }) {
  const STAGES = ["Draft", "For Approval", "Approved", "Sent", "Closed"];
  const idx = STAGES.indexOf(po.status);
  return (
    <div className="screen wide">
      <button className="back-link" onClick={onBack}>
        ← PO ledger
      </button>
      <div className="glass pay-header">
        <div className="pay-head-top">
          <div>
            <div className="kicker">Purchasing · U4</div>
            <h2 className="ph-title">
              <span className="docchip">{po.no}</span>{" "}
              <span
                className={
                  "chip chip-" + (po.type === "Import" ? "info" : "neutral")
                }
              >
                {po.type}
              </span>
            </h2>
            <div className="pay-meta">
              {po.supplier} · {po.project} · {ccyAmt(po.amount, po.ccy)}
            </div>
          </div>
          <div className="pay-head-actions">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onTracker(po)}
            >
              {po.type === "Import" ? "Import tracker" : "5-stage tracker"} →
            </button>
            <button className="btn btn-post btn-sm">⎙ Regenerate PDF</button>
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
          <div className="form-section-title">Linked records</div>
          <div className="linked-grid">
            <div className="linked-item">
              <span className="li-k">RFPs</span>
              <span className="docchip sm">
                {RFPS.find((r) => r.po === po.no)?.no || "—"}
              </span>
            </div>
            <div className="linked-item">
              <span className="li-k">MRRs / Goods Receipt</span>
              <span className="docchip sm">MRR-2026-0144</span>{" "}
              <span
                className="chip chip-pending"
                style={{ padding: "1px 7px" }}
              >
                Partial
              </span>
            </div>
            <div className="linked-item">
              <span className="li-k">SO No.</span>
              <span className="docchip sm">{po.so}</span>
            </div>
            <div className="linked-item">
              <span className="li-k">MR No.</span>
              <span className="docchip sm">{po.mr}</span>
            </div>
          </div>
          <div className="form-section-title">
            Payment status <span className="muted">(derived)</span>
          </div>
          <span
            className={"chip chip-" + PAY_TONE[po.pay]}
            style={{ fontSize: 13 }}
          >
            {po.pay}
          </span>
        </div>
        <div className="preview-frame glass">
          <div className="preview-bar">
            <span className="kicker" style={{ margin: 0 }}>
              PDF preview
            </span>
            <span className="chip chip-neutral">{po.type} template</span>
          </div>
          <div className="paper">
            <div className="ph">
              <div className="co">JC ELECTROFIELDS POWER SYSTEM, INC.</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800 }}>PURCHASE ORDER</div>
                <div className="docn">{po.no}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, margin: "6px 0" }}>
              Supplier: <strong>{po.supplier}</strong> · {po.date} ·{" "}
              {ccyAmt(po.amount, po.ccy)}
            </div>
            <table>
              <thead>
                <tr>
                  <th>Qty</th>
                  <th>Description</th>
                  <th className="num">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2 set</td>
                  <td>{po.desc}</td>
                  <td className="num">{pmoneyU(po.amount)}</td>
                </tr>
                <tr>
                  <td colSpan="2" style={{ fontStyle: "italic", fontSize: 9 }}>
                    "Nothing Follows"
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <div className="sigblock">
              {(po.type === "Local"
                ? [
                    "Prepared by · Purchasing Asst.",
                    "Verified by · Supervisor",
                    "Approved by · Fin./Admin Mgr",
                  ]
                : [
                    "Prepared by · Asst. Purchasing Head",
                    "Verified by · Senior Engineer",
                    "Approved by · (role)",
                  ]
              ).map((s, i) => (
                <div key={i} className="sig">
                  <div className="line"></div>
                  <div className="role">{s}</div>
                </div>
              ))}
            </div>
            <div
              className="sigblock"
              style={{ gridTemplateColumns: "1fr", marginTop: 10 }}
            >
              <div className="sig">
                <div className="line"></div>
                <div className="role">Supplier's Conforme · President</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// U5 · RFP register  ·  U6 · RFP form
// ---------------------------------------------------------------------------
function U5Register({ onOpen }) {
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U5</div>
          <h2 className="ph-title">RFP register</h2>
        </div>
        <div className="ph-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onOpen(RFPS[1])}
          >
            + New RFP
          </button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>RFP No.</th>
              <th>Date</th>
              <th>PO No.</th>
              <th>Supplier</th>
              <th>Type</th>
              <th>Due</th>
              <th className="num">Net payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {RFPS.map((r) => (
              <tr
                key={r.no}
                onClick={() => onOpen(r)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span className="docchip">{r.no}</span>
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {r.date}
                </td>
                <td>
                  <span className="docchip sm">{r.po}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{r.supplier}</td>
                <td>{r.type}</td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {r.due}
                </td>
                <td className="num money">{pmoneyU(r.net)}</td>
                <td>
                  <span className={"chip chip-" + RFP_TONE[r.status]}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Import POs show two linked RFPs (Downpayment + Balance) with a
        reconcile-to-grand-total warning when DP + Balance ≠ PO total.
      </div>
    </div>
  );
}

function U6Form({ rfp, onBack }) {
  return (
    <div className="screen wide">
      <button className="back-link" onClick={onBack}>
        ← RFP register
      </button>
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U6</div>
          <h2 className="ph-title">
            Request for Payment <span className="docchip">{rfp.no}</span>
          </h2>
        </div>
        <div className="ph-actions">
          <span className={"chip chip-" + RFP_TONE[rfp.status]}>
            {rfp.status}
          </span>
        </div>
      </div>
      <div className="threeway solid">
        <Icon name="check" size={15} color="var(--st-pending-ink)" />
        <span>
          <strong>Three-way match gate</strong> — RFP can't leave Draft until PO
          qty + supplier invoice + MRR received qty reconcile (tolerance 1% qty
          / ₱100). Over-tolerance flagged with Supervisor override.
        </span>
      </div>
      <div className="twopane">
        <div className="solid form-body">
          <div className="form-section-title">Originator zone</div>
          <div className="form-grid">
            <L l="RFP No." computed>
              <div className="field is-computed">{rfp.no}</div>
            </L>
            <L l="Date">
              <input className="field" type="date" defaultValue={rfp.date} />
            </L>
            <L l="Purchase Order No.">
              <div className="field is-computed">
                {rfp.po} (inherits supplier, TIN, terms)
              </div>
            </L>
            <L l="Due Date">
              <input className="field" type="date" defaultValue={rfp.due} />
            </L>
          </div>
          <div className="form-section-title">Line items &amp; EWT</div>
          <div
            className="solid table-wrap"
            style={{ boxShadow: "none", border: "1px solid var(--jce-line)" }}
          >
            <table className="jtable">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Particulars</th>
                  <th className="num">VAT Payment</th>
                  <th className="num">Non-VAT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono">1</td>
                  <td>Per PO {rfp.po}</td>
                  <td className="num money">{pmoneyU(rfp.net * 1.02)}</td>
                  <td className="num">—</td>
                </tr>
                <tr>
                  <td colSpan="4" style={{ fontStyle: "italic", fontSize: 10 }}>
                    "NOTHING FOLLOWS"
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="po-totals">
            <div>
              <span>Classification EWT</span>
              <span>Goods 1%</span>
            </div>
            <div className="gt">
              <span>Net Payment</span>
              <span className="money">₱{pmoneyU(rfp.net)}</span>
            </div>
          </div>
        </div>
        <div className="preview-frame glass">
          <div className="preview-bar">
            <span className="kicker" style={{ margin: 0 }}>
              JCE RFP form
            </span>
          </div>
          <div className="paper">
            <div className="ph">
              <div className="co">JC ELECTROFIELDS POWER SYSTEM, INC.</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800 }}>REQUEST FOR PAYMENT</div>
                <div className="docn">{rfp.no}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, margin: "6px 0" }}>
              {rfp.supplier} · PO {rfp.po} · Net ₱{pmoneyU(rfp.net)}
            </div>
            <div
              className="sigblock"
              style={{ gridTemplateColumns: "1fr 1fr" }}
            >
              {[
                "Prepared by",
                "Verified & Authorized by",
                "Received by (Accounting)",
                "Checked by",
              ].map((s, i) => (
                <div key={i} className="sig">
                  <div className="line"></div>
                  <div className="role">{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// U9 · Suppliers list  ·  U10 · Supplier record
// ---------------------------------------------------------------------------
function U9Suppliers({ onOpen }) {
  const [q, setQ] = useState("");
  const rows = SUPPLIERS.filter(
    (s) =>
      q === "" ||
      (s.name + s.code + s.cat).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U9</div>
          <h2 className="ph-title">Suppliers</h2>
        </div>
        <div className="ph-actions">
          <div className="top-search" style={{ maxWidth: 240 }}>
            <Icon name="search" size={15} />
            <input
              placeholder="Name, code, category…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-sm">+ Add supplier</button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Code</th>
              <th>Supplier</th>
              <th>TOP</th>
              <th>TIN</th>
              <th>City / Country</th>
              <th>Category</th>
              <th>Offers</th>
              <th>Bank</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr
                key={s.code}
                onClick={() => onOpen(s)}
                style={{ cursor: "pointer" }}
              >
                <td className="mono" style={{ fontWeight: 600 }}>
                  {s.code}
                </td>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td>{s.top}</td>
                <td className="mono" style={{ fontSize: 11 }}>
                  {s.tin}
                </td>
                <td>{s.city}</td>
                <td style={{ color: "var(--jce-ink-2)" }}>{s.cat}</td>
                <td>
                  {s.offers.map((o) => (
                    <span key={o} className="tag-chip">
                      {o}
                    </span>
                  ))}
                </td>
                <td>
                  {s.bankPending ? (
                    <span
                      className="chip chip-pending"
                      style={{ padding: "1px 7px" }}
                    >
                      pending verify
                    </span>
                  ) : (
                    <span
                      className="chip chip-success"
                      style={{ padding: "1px 7px" }}
                    >
                      verified
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function U10Supplier({ sup, onBack }) {
  const [tab, setTab] = useState("Details");
  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Suppliers
      </button>
      <div className="glass rec-header">
        <div className="rec-av">
          {sup.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="rec-id">
          <div className="rec-name">{sup.name}</div>
          <div className="rec-meta">
            <span className="docchip">{sup.code}</span> · {sup.cat}
          </div>
        </div>
        <span className="chip chip-success">Active</span>
      </div>
      <div className="tabbar glass-nav rec-tabs">
        {["Details", "Bank accounts", "Performance", "POs"].map((t) => (
          <span
            key={t}
            className={"tab" + (tab === t ? " on" : "")}
            onClick={() => setTab(t)}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="solid rec-panel">
        {tab === "Details" && (
          <div className="rec-grid">
            <Field label="TIN" value={sup.tin} />
            <Field label="Terms of Payment" value={sup.top} />
            <Field label="City / Country" value={sup.city} />
            <Field label="Items / Services" value={sup.offers.join(", ")} />
          </div>
        )}
        {tab === "Bank accounts" && (
          <React.Fragment>
            {sup.bankPending && (
              <div
                className="mask-banner"
                style={{ borderColor: "var(--st-pending)" }}
              >
                <Icon name="lock" size={15} color="var(--st-pending-ink)" />{" "}
                <strong>Fraud-control:</strong> this bank account is{" "}
                <strong>pending verification</strong> — not payable-from until
                Supervisor approval + a logged supplier email/phone
                confirmation.
              </div>
            )}
            <div
              className="solid table-wrap"
              style={{ boxShadow: "none", border: "1px solid var(--jce-line)" }}
            >
              <table className="jtable">
                <thead>
                  <tr>
                    <th>Bank</th>
                    <th>Account No.</th>
                    <th>Currency</th>
                    <th>SWIFT</th>
                    <th>Primary</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Bank of China</td>
                    <td className="mono">···· 8821</td>
                    <td>USD</td>
                    <td className="mono">BKCHCNBJ</td>
                    <td>Yes</td>
                    <td>
                      {sup.bankPending ? (
                        <span className="chip chip-pending">
                          Pending verification
                        </span>
                      ) : (
                        <span className="chip chip-success">Verified</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </React.Fragment>
        )}
        {tab === "Performance" && (
          <div className="rec-grid">
            <Field label="Total spend" value="$1.2M" />
            <Field label="PO count" value="14" />
            <Field label="On-time delivery" value="86%" />
            <Field label="Last order" value="2026-05-22" />
          </div>
        )}
        {tab === "POs" && (
          <div className="solid table-wrap" style={{ boxShadow: "none" }}>
            <table className="jtable">
              <thead>
                <tr>
                  <th>PO No.</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {POS.filter((p) => p.supplier === sup.name).map((p) => (
                  <tr key={p.no}>
                    <td>
                      <span className="docchip sm">{p.no}</span>
                    </td>
                    <td className="num money">{ccyAmt(p.amount, p.ccy)}</td>
                    <td>
                      <span className={"chip chip-" + PO_STATUS_TONE[p.status]}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// U11 · PRQ  ·  U13 · audit
// ---------------------------------------------------------------------------
function U11PRQ() {
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U11</div>
          <h2 className="ph-title">
            Purchase Requisitions <span className="oq">OPEN-Q #17</span>
          </h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-primary btn-sm">+ New PRQ</button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>PRQ No.</th>
              <th>Date</th>
              <th>Requestor</th>
              <th>Project</th>
              <th>MR No.</th>
              <th className="num">Est. total</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Current step</th>
            </tr>
          </thead>
          <tbody>
            {PRQS.map((p) => (
              <tr key={p.no}>
                <td>
                  <span className="docchip">{p.no}</span>
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {p.date}
                </td>
                <td>{p.requestor}</td>
                <td>{p.project}</td>
                <td>
                  {p.mr === "—" ? (
                    "—"
                  ) : (
                    <span className="docchip sm">{p.mr}</span>
                  )}
                </td>
                <td className="num money">{pmoneyU(p.est)}</td>
                <td>
                  <span className={"chip chip-" + URGENCY_TONE[p.urgency]}>
                    {p.urgency}
                  </span>
                </td>
                <td>
                  <span className={"chip chip-" + PRQ_TONE[p.status]}>
                    {p.status}
                  </span>
                </td>
                <td style={{ color: "var(--jce-ink-2)" }}>{p.step}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Approval chain resolved at submit from the threshold table and stored on
        the record (later edits don't change it). SLA: Critical 4h vs Routine
        48h. Mandatory threshold ₱20K recommendation —{" "}
        <span className="oq">OPEN-Q #17</span>.
      </div>
    </div>
  );
}

function U13Audit() {
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U13</div>
          <h2 className="ph-title">Purchasing audit log</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">Export</button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Entity</th>
              <th>Action</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {PUR_AUDIT.map((a, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 11 }}>
                  {a.ts}
                </td>
                <td>{a.actor}</td>
                <td>
                  <span className="docchip">{a.entity}</span>
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
    </div>
  );
}

Object.assign(window, {
  U1Dashboard,
  U2Ledger,
  U3Create,
  U4Detail,
  U5Register,
  U6Form,
  U9Suppliers,
  U10Supplier,
  U11PRQ,
  U13Audit,
});
