// ============================================================================
// JCE SYSTEM — BDD core: B1 SO list · B2 SO record · B3 offers · B5 quotations
//   B7/B8/B9 website content · B11 audit · E1 Engineering stub
// ============================================================================

// ---------------------------------------------------------------------------
// B1 · Sales orders list
// ---------------------------------------------------------------------------
function B1List({ onOpen }) {
  const [status, setStatus] = useState("All");
  const rows = SALES_ORDERS.filter(
    (s) => status === "All" || s.status === status,
  );
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">BDD · B1</div>
          <h2 className="ph-title">
            Sales Orders{" "}
            <span className="muted-note">— canonical SO# registry</span>
          </h2>
        </div>
        <div className="ph-actions">
          <select
            className="field"
            style={{ width: "auto" }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {[
              "All",
              "Ongoing Project",
              "On Hold",
              "Project Completed",
              "Cancelled",
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onOpen(SALES_ORDERS[0])}
          >
            + Add SO
          </button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Sales Order No.</th>
              <th>Client</th>
              <th>Project Name</th>
              <th className="num">Contract Amount</th>
              <th>Remarks</th>
              <th>Project Status</th>
              <th>Turned Over</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr
                key={s.so}
                onClick={() => onOpen(s)}
                style={{ cursor: "pointer" }}
              >
                <td className="mono" style={{ fontSize: 12 }}>
                  {s.date}
                </td>
                <td>
                  <span className="docchip">{s.so}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{s.client}</td>
                <td>{s.name}</td>
                <td className="num money">
                  {s.amount ? pmoney(s.amount) : "—"}
                </td>
                <td>
                  <span
                    className={
                      "chip chip-" + (SO_REMARK_TONE[s.remarks] || "neutral")
                    }
                  >
                    {s.remarks}
                  </span>
                </td>
                <td>
                  <span className={"chip chip-" + SO_STATUS_TONE[s.status]}>
                    {s.status}
                  </span>
                </td>
                <td>{s.turned ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// B2 · Sales order record
// ---------------------------------------------------------------------------
function B2Record({ so, onBack }) {
  const [tab, setTab] = useState("Details");
  const dpAmt = so.amount * 0.15;
  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Sales Orders
      </button>
      <div className="glass rec-header">
        <div className="rec-av">
          <Icon name="bdd" size={22} color="#fff" />
        </div>
        <div className="rec-id">
          <div className="rec-name">{so.name}</div>
          <div className="rec-meta">
            <span className="docchip">{so.so}</span> · {so.client}
          </div>
          <div className="rec-meta2">
            <span className={"chip chip-" + SO_STATUS_TONE[so.status]}>
              {so.status}
            </span>{" "}
            <span
              className={
                "chip chip-" + (SO_REMARK_TONE[so.remarks] || "neutral")
              }
            >
              {so.remarks}
            </span>
          </div>
        </div>
      </div>
      <div className="tabbar glass-nav rec-tabs">
        {["Details", "Progress billing", "Linked records", "History"].map(
          (t) => (
            <span
              key={t}
              className={"tab" + (tab === t ? " on" : "")}
              onClick={() => setTab(t)}
            >
              {t}
            </span>
          ),
        )}
      </div>
      <div className="solid rec-panel">
        {tab === "Details" && (
          <div className="rec-grid">
            <Field label="SO# (globally unique)" value={so.so} />
            <Field label="Date" value={so.date} />
            <Field label="Client" value={so.client} />
            <Field label="Project Name" value={so.name} />
            <Field
              label="Contract Amount"
              sensitive
              value={so.amount ? "₱" + pmoney(so.amount) : "—"}
            />
            <Field label="Requested By" value={so.by} />
            <Field label="Turned Over" value={so.turned ? "Yes" : "No"} />
            <Field
              label="Project Status"
              value={
                <span className={"chip chip-" + SO_STATUS_TONE[so.status]}>
                  {so.status}
                </span>
              }
            />
          </div>
        )}
        {tab === "Progress billing" && (
          <React.Fragment>
            <div className="form-grid" style={{ marginBottom: 18 }}>
              <Field label="Down Payment %" value="15%" />
              <Field label="Retention %" value="10%" />
              <Field label="DP Recoupment %" value="15%" />
            </div>
            <div className="form-section-title">
              Derived values <span className="muted">(read-only)</span>
            </div>
            <div className="rec-grid">
              <Field
                label="Down Payment Amount"
                computed
                value={so.amount ? "₱" + pmoney(dpAmt) : "—"}
              />
              <Field
                label="Cumulative Billed to Date"
                computed
                value="₱6,039,221.60"
              />
              <Field
                label="Cumulative Retention Held"
                computed
                value="₱603,922.16"
              />
              <Field
                label="Cumulative DP Recouped"
                computed
                value="₱905,883.24"
              />
              <Field
                label="Remaining Contract Balance"
                computed
                value={so.amount ? "₱" + pmoney(so.amount - 6039221.6) : "—"}
              />
            </div>
          </React.Fragment>
        )}
        {tab === "Linked records" && (
          <div className="linked-grid">
            <div className="linked-item">
              <span className="li-k">Offers</span>
              <span className="docchip sm">NER2-26-021</span>
            </div>
            <div className="linked-item">
              <span className="li-k">Billings</span>
              <span className="docchip sm">SI-004512</span>
            </div>
            <div className="linked-item">
              <span className="li-k">POs</span>
              <span className="docchip sm">2605-0188IC</span>
            </div>
            <div className="linked-item">
              <span className="li-k">MRs</span>
              <span className="docchip sm">JCE-MR-2026-0142</span>
            </div>
          </div>
        )}
        {tab === "History" && (
          <div className="rec-history">
            {BDD_AUDIT.filter((a) => a.rec === so.so).map((a, i) => (
              <div key={i} className="hist-row">
                <span className="mono hist-ts">{a.ts}</span>
                <div>
                  <div className="hist-act">
                    {a.action} — {a.field}: {a.delta}
                  </div>
                  <div className="hist-actor">{a.user}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Free status transitions (any → any; audit preserves history). Contract
        Amount edits fire a sensitive-change notification.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// B3 · Offers list (JCEPSI · JICA toggle)
// ---------------------------------------------------------------------------
function B3Offers({ onOpen }) {
  const [entity, setEntity] = useState("JCEPSI");
  const rows = OFFERS.filter((o) => o.entity === entity);
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">BDD · B3</div>
          <h2 className="ph-title">Offers</h2>
        </div>
        <div className="ph-actions">
          <div className="seg glass-nav">
            {["JCEPSI", "JICA"].map((e) => (
              <button
                key={e}
                className={entity === e ? "on" : ""}
                onClick={() => setEntity(e)}
              >
                {e}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm">+ New offer</button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Ref. No.</th>
              <th>Offer Date</th>
              <th>Emailed</th>
              <th>Sent By</th>
              <th>Client</th>
              <th>Subject</th>
              <th className="num">Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr
                key={o.ref}
                onClick={() => onOpen(o)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span className="docchip">{o.ref}</span>
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {o.date}
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {o.emailed}
                </td>
                <td>{o.by}</td>
                <td style={{ fontWeight: 600 }}>{o.client}</td>
                <td style={{ color: "var(--jce-ink-2)" }}>{o.subject}</td>
                <td className="num money">{pmoney(o.amount)}</td>
                <td>
                  <span className={"chip chip-" + OFFER_STATUS_TONE[o.status]}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        JCEPSI · JICA are separate streams with separate per-entity Ref. No.
        counters. Ref. format: CLIENT_CODE-YY-XXX[Rev.NN].
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// B5 · Quotations list (EC · Workshop · Solar toggle)
// ---------------------------------------------------------------------------
function B5Quotations({ onOpen }) {
  const [cat, setCat] = useState("EC");
  const rows = QUOTATIONS.filter((q) => q.cat === cat);
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">BDD · B5</div>
          <h2 className="ph-title">Quotations</h2>
        </div>
        <div className="ph-actions">
          <div className="seg glass-nav">
            {["EC", "Workshop", "Solar"].map((c) => (
              <button
                key={c}
                className={cat === c ? "on" : ""}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm">+ New request</button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Item</th>
              <th>Client</th>
              <th>Request Date</th>
              <th>Responses</th>
              <th>Winner</th>
              <th>Links</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((q) => (
              <tr
                key={q.ref}
                onClick={() => onOpen(q)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span className="docchip">{q.ref}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{q.item}</td>
                <td>{q.client}</td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {q.date}
                </td>
                <td>
                  <span
                    className={
                      "chip chip-" +
                      (q.responded === q.invited ? "success" : "pending")
                    }
                  >
                    {q.responded}/{q.invited}
                  </span>
                </td>
                <td>
                  {q.winner ? (
                    <span className="chip chip-success">{q.winner} ★</span>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
                <td>
                  {q.offer && <span className="docchip sm">{q.offer}</span>}{" "}
                  {q.so && <span className="docchip sm">{q.so}</span>}
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
// B7/B8/B9 · Website content (shared pattern)
// ---------------------------------------------------------------------------
function WebContent({ kind }) {
  const data =
    kind === "Projects"
      ? WEB_PROJECTS
      : kind === "Services"
        ? WEB_SERVICES
        : WEB_PRODUCTS;
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">BDD · Website · {kind}</div>
          <h2 className="ph-title">Website — {kind}</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-primary btn-sm">
            + Add {kind.replace(/s$/, "")}
          </button>
        </div>
      </div>
      <div className="web-grid">
        {data.map((d, i) => (
          <div key={i} className="solid web-card">
            <div className="web-thumb">
              <div className="web-thumb-ph">
                <Icon
                  name={
                    kind === "Products"
                      ? "pur"
                      : kind === "Services"
                        ? "eng"
                        : "wh"
                  }
                  size={24}
                  color="var(--jce-ink-2)"
                />
                <span>{kind} cover</span>
              </div>
            </div>
            <div className="web-body">
              <div className="web-top">
                <span className={"chip chip-" + WEB_STATUS_TONE[d.status]}>
                  {d.status}
                </span>
                <span className="web-sort">#{d.sort}</span>
              </div>
              <div className="web-name">{d.name}</div>
              {kind === "Projects" && (
                <div className="web-meta">
                  {d.showClient ? (
                    d.client
                  ) : (
                    <span className="muted">client hidden</span>
                  )}{" "}
                  · {d.loc} · {d.done}
                </div>
              )}
              {kind === "Projects" && (
                <div className="web-tags">
                  {d.tags.map((t) => (
                    <span key={t} className="tag-chip">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="web-actions">
                <button className="btn btn-ghost btn-sm">Edit</button>
                {kind === "Projects" && (
                  <span className="photo-count">📷 up to 10</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="muted-note" style={{ marginTop: 12 }}>
        Publish / Draft / Hide controls what the public site renders live. Photo
        manager: up to 10 images (cover, captions, drag-sort; auto-compressed
        ~200–400 KB, ~1600px longest edge).
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// B11 · BDD audit log
// ---------------------------------------------------------------------------
function B11Audit() {
  const [area, setArea] = useState("All");
  const areas = ["All", ...Array.from(new Set(BDD_AUDIT.map((a) => a.area)))];
  const rows = BDD_AUDIT.filter((a) => area === "All" || a.area === area);
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">BDD · B11</div>
          <h2 className="ph-title">BDD audit log</h2>
        </div>
        <div className="ph-actions">
          <select
            className="field"
            style={{ width: "auto" }}
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            {areas.map((a) => (
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
              <th>User</th>
              <th>Area</th>
              <th>Action</th>
              <th>Record</th>
              <th>Field</th>
              <th>Old → New</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 11 }}>
                  {a.ts}
                </td>
                <td>{a.user}</td>
                <td>{a.area}</td>
                <td>
                  <span className="chip chip-neutral">{a.action}</span>
                </td>
                <td>
                  <span className="docchip">{a.rec}</span>
                </td>
                <td>{a.field}</td>
                <td>{a.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// E1 · Engineering stub
// ---------------------------------------------------------------------------
function E1Stub() {
  return (
    <div className="screen modph">
      <div className="glass modph-card">
        <div className="modph-ic">
          <Icon name="eng" size={28} color="var(--jce-green-700)" />
        </div>
        <span className="stage-tag">E1 · PLACEHOLDER STUB</span>
        <h2>Engineering module — pending scoping</h2>
        <p>
          The module is pending its stakeholder interview; nothing here is a
          committed requirement. BOM ownership and Technical Drawing review will
          likely land here — they feed Purchasing's import stages 1 &amp; 6.
        </p>
        <p style={{ marginTop: 12 }}>
          <span className="oq">OPEN-Q #9</span> — no speculative screens
          designed.
        </p>
      </div>
    </div>
  );
}

Object.assign(window, {
  B1List,
  B2Record,
  B3Offers,
  B5Quotations,
  WebContent,
  B11Audit,
  E1Stub,
});
