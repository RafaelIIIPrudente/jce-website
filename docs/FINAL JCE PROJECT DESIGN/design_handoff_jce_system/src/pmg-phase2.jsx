// ============================================================================
// JCE SYSTEM — PMG Phase 2 (P14–P19)
//   P14 Field photo evidence · P15 BOQ template library · P16 S-curve & charting
//   P17 MR→PO→delivery traceability · P18 Document pack export · P19 Budget vs actual
// ============================================================================

// ---- P14 · Field photo evidence -------------------------------------------
function P14Photos({ role }) {
  const isEngineer = role === "siteeng";
  const LINES = [
    { line: "A.1 · Concrete poles — Procure", photos: 3, reviewed: true },
    { line: "A.1 · Concrete poles — Install", photos: 2, reviewed: false },
    { line: "B.1 · Transformer 100KVA — Deliver", photos: 4, reviewed: true },
    { line: "B.2 · ACSR conductor — Install", photos: 0, reviewed: false },
  ];
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">PMG · P14 · Phase 2</div>
          <h2 className="ph-title">Field photo evidence</h2>
        </div>
        <div className="ph-actions">
          {isEngineer ? (
            <button className="btn btn-primary btn-sm">📷 Capture photo</button>
          ) : (
            <span className="muted-note">PM Head reviews before keying %</span>
          )}
        </div>
      </div>
      {isEngineer && (
        <div
          className="threeway solid"
          style={{ borderLeftColor: "var(--st-info)" }}
        >
          <span style={{ fontSize: 15 }}>📷</span>
          <span>
            <strong>Camera-first capture.</strong> Attach progress photos per
            BOQ line/stage, caption, and link to the current period. Large touch
            targets for on-site use.
          </span>
        </div>
      )}
      <div className="p14-grid">
        {LINES.map((l, i) => (
          <div key={i} className="solid p14-card">
            <div className="p14-head">
              <div className="p14-line">{l.line}</div>
              {l.reviewed ? (
                <span className="chip chip-success">Reviewed</span>
              ) : l.photos > 0 ? (
                <span className="chip chip-pending">Needs review</span>
              ) : (
                <span className="chip chip-neutral">No photos</span>
              )}
            </div>
            <div className="p14-thumbs">
              {l.photos > 0 ? (
                Array.from({ length: Math.min(l.photos, 4) }).map((_, j) => (
                  <div key={j} className="p14-thumb">
                    <Icon name="bdd" size={20} color="var(--jce-ink-2)" />
                  </div>
                ))
              ) : (
                <div className="p14-empty">
                  No photos attached for this line/stage yet.
                </div>
              )}
              {l.photos > 0 && (
                <div className="p14-count">
                  {l.photos} photo{l.photos > 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="muted-note" style={{ marginTop: 12 }}>
        Lines with photos surface a review badge on the P8 accomplishment grid
        so the PM Head can verify before keying This Period %.
      </div>
    </div>
  );
}

// ---- P15 · BOQ template library --------------------------------------------
function P15Templates() {
  const TPL = [
    {
      name: "69KV Substation — Standard",
      cat: "Substation",
      lines: 42,
      value: "₱48–62M",
      uses: 7,
    },
    {
      name: "230KV Substation — Full EPC",
      cat: "Substation",
      lines: 88,
      value: "₱110–140M",
      uses: 3,
    },
    {
      name: "13.2KV Distribution Line",
      cat: "Distribution",
      lines: 24,
      value: "₱18–30M",
      uses: 11,
    },
    {
      name: "Solar Farm 5MWp — Ground Mount",
      cat: "Solar",
      lines: 36,
      value: "₱55–70M",
      uses: 2,
    },
  ];
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">PMG · P15 · Phase 2</div>
          <h2 className="ph-title">BOQ template library</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-primary btn-sm">
            + Save current BOQ as template
          </button>
        </div>
      </div>
      <div className="portfolio-grid">
        {TPL.map((t, i) => (
          <div key={i} className="glass proj-card">
            <div className="proj-top">
              <span className="chip chip-info">{t.cat}</span>
              <span className="muted-note">{t.uses}× used</span>
            </div>
            <div className="proj-name">{t.name}</div>
            <div className="wh-figs">
              <div>
                <span className="ps-k">BOQ lines</span>
                <span className="ps-v">{t.lines}</span>
              </div>
              <div>
                <span className="ps-k">Typical value</span>
                <span className="ps-v" style={{ fontSize: 14 }}>
                  {t.value}
                </span>
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              style={{ width: "100%", marginTop: 12 }}
            >
              Start project from template →
            </button>
          </div>
        ))}
      </div>
      <div className="muted-note" style={{ marginTop: 12 }}>
        "Start project from template" enters the P3 import wizard at step 3
        (Confirm header) with the BOQ prefilled.
      </div>
    </div>
  );
}

// ---- P16 · S-curve & progress charting ------------------------------------
function P16Scurve() {
  // planned vs actual cumulative % across periods
  const planned = [0, 8, 20, 35, 52, 68, 82, 92, 100];
  const actual = [0, 6, 16, 28, 44, 58, null, null, null];
  const W = 560,
    H = 220,
    pad = 30;
  const x = (i) => pad + (i * (W - 2 * pad)) / (planned.length - 1);
  const y = (v) => H - pad - (v * (H - 2 * pad)) / 100;
  const linePath = (arr) =>
    arr
      .map((v, i) =>
        v == null ? null : `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`,
      )
      .filter(Boolean)
      .join(" ");
  const HEAT = [
    ["NORECO II — 13.2KV", [100, 100, 80, 40, 0]],
    ["Cavite 69KV", [100, 100, 100, 90, 60]],
    ["Solar Tarlac", [100, 100, 100, 100, 80]],
  ];
  const heatColor = (v) =>
    v === 100
      ? "var(--jce-green-600)"
      : v >= 60
        ? "var(--jce-green-500)"
        : v >= 30
          ? "var(--jce-orange-500)"
          : v > 0
            ? "var(--jce-orange-600)"
            : "#EEF1EF";
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">PMG · P16 · Phase 2</div>
          <h2 className="ph-title">S-curve &amp; progress charting</h2>
        </div>
        <div className="ph-actions">
          <select className="field" style={{ width: "auto" }}>
            <option>NORECO II — 13.2KV</option>
            <option>Cavite 69KV</option>
          </select>
        </div>
      </div>
      <div className="glass" style={{ padding: 18, marginBottom: 16 }}>
        <div className="card-title">
          Planned vs actual — cumulative % accomplishment
        </div>
        <div className="solid" style={{ padding: 16, marginTop: 10 }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: "100%", height: "auto" }}
          >
            {[0, 25, 50, 75, 100].map((g) => (
              <g key={g}>
                <line
                  x1={pad}
                  y1={y(g)}
                  x2={W - pad}
                  y2={y(g)}
                  stroke="#E2EAE4"
                  strokeWidth="1"
                />
                <text
                  x={pad - 6}
                  y={y(g) + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#4A5B51"
                >
                  {g}
                </text>
              </g>
            ))}
            <path
              d={linePath(planned)}
              fill="none"
              stroke="#4A5B51"
              strokeWidth="2"
              strokeDasharray="5 4"
            />
            <path
              d={linePath(actual)}
              fill="none"
              stroke="#007817"
              strokeWidth="2.5"
            />
            {actual.map(
              (v, i) =>
                v != null && (
                  <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="#007817" />
                ),
            )}
            {[
              "PB1",
              "PB2",
              "PB3",
              "PB4",
              "PB5",
              "PB6",
              "PB7",
              "PB8",
              "PB9",
            ].map((p, i) => (
              <text
                key={p}
                x={x(i)}
                y={H - pad + 14}
                textAnchor="middle"
                fontSize="8"
                fill="#4A5B51"
              >
                {p}
              </text>
            ))}
          </svg>
          <div style={{ display: "flex", gap: 18, marginTop: 8, fontSize: 12 }}>
            <span style={{ color: "var(--jce-ink-2)" }}>— — Planned</span>
            <span style={{ color: "var(--jce-green-700)", fontWeight: 600 }}>
              —— Actual (PB5: 58% · 10% behind)
            </span>
          </div>
        </div>
      </div>
      <div className="glass" style={{ padding: 18 }}>
        <div className="card-title">
          Portfolio heatmap — % to date by period
        </div>
        <div
          className="solid"
          style={{ padding: 14, marginTop: 10, overflowX: "auto" }}
        >
          <table className="jtable">
            <thead>
              <tr>
                <th>Project</th>
                {["PB1", "PB2", "PB3", "PB4", "PB5"].map((p) => (
                  <th key={p} className="num">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEAT.map(([n, row]) => (
                <tr key={n}>
                  <td style={{ fontWeight: 600 }}>{n}</td>
                  {row.map((v, i) => (
                    <td key={i} className="num">
                      <span
                        className="heat-cell"
                        style={{ background: heatColor(v) }}
                      >
                        {v}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---- P17 · MR → PO → delivery traceability board --------------------------
function P17Traceability() {
  const ROWS = [
    {
      mr: "JCE-MR-2026-0142 · L3",
      item: "Transformer 100KVA ×4",
      po: "2605-0188IC",
      stage: 6,
      mrr: null,
      hops: ["done", "done", "active", "pending"],
    },
    {
      mr: "JCE-MR-2026-0142 · L1",
      item: "ACSR conductor 1,800m",
      po: "2605-0201",
      stage: null,
      local: 1,
      mrr: null,
      hops: ["done", "done", "active", "pending"],
    },
    {
      mr: "JCE-MR-2026-0138 · L2",
      item: "Relays ×6",
      po: "2604-0166",
      stage: null,
      local: 5,
      mrr: "MRR-2026-0140",
      hops: ["done", "done", "done", "done"],
    },
  ];
  const light = (s) =>
    s === "done"
      ? "var(--st-success)"
      : s === "active"
        ? "var(--st-info)"
        : "#D4D9D5";
  return (
    <div className="screen wide">
      <div className="page-head glass">
        <div>
          <div className="kicker">PMG · P17 · Phase 2</div>
          <h2 className="ph-title">MR → PO → delivery traceability</h2>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>MR line</th>
              <th>Item</th>
              <th>① MR approved</th>
              <th>② PO raised</th>
              <th>③ Shipment / stage</th>
              <th>④ Stock receipt</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i}>
                <td>
                  <span className="docchip sm">{r.mr}</span>
                </td>
                <td>{r.item}</td>
                <td>
                  <span
                    className="hop-light"
                    style={{ background: light(r.hops[0]) }}
                  ></span>{" "}
                  approved
                </td>
                <td>
                  <span
                    className="hop-light"
                    style={{ background: light(r.hops[1]) }}
                  ></span>{" "}
                  <span className="docchip sm">{r.po}</span>
                </td>
                <td>
                  <span
                    className="hop-light"
                    style={{ background: light(r.hops[2]) }}
                  ></span>{" "}
                  {r.stage ? (
                    <span className="chip chip-info">Import {r.stage}/15</span>
                  ) : (
                    <span className="chip chip-neutral">Local {r.local}/5</span>
                  )}
                </td>
                <td>
                  <span
                    className="hop-light"
                    style={{ background: light(r.hops[3]) }}
                  ></span>{" "}
                  {r.mrr ? (
                    <span className="docchip sm">{r.mrr}</span>
                  ) : (
                    <span className="muted">awaiting</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        End-to-end status lights per hop: each For-Purchase MR line → its PO →
        import/local tracker stage → the Locked MRR that closes the loop.
      </div>
    </div>
  );
}

// ---- P18 · Document pack export -------------------------------------------
function P18DocPack() {
  const [sel, setSel] = useState({
    report: true,
    net: true,
    soa: true,
    photos: true,
    mrr: false,
    signoff: true,
  });
  const items = [
    ["report", "Accomplishment report (byte-faithful print)", "P8"],
    ["net", "NET AMOUNT computation sheet", "P8"],
    ["soa", "Statement of Account", "A9"],
    ["photos", "Field photo evidence (reviewed)", "P14"],
    ["mrr", "Supporting MRR receipts", "W4"],
    ["signoff", "Signatory page (print-only)", "—"],
  ];
  const count = Object.values(sel).filter(Boolean).length;
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">PMG · P18 · Phase 2</div>
          <h2 className="ph-title">Document pack export</h2>
        </div>
        <div className="ph-actions">
          <select className="field" style={{ width: "auto" }}>
            <option>PB5 · Cavite 69KV</option>
            <option>PB1 · NORECO II</option>
          </select>
        </div>
      </div>
      <div className="twopane">
        <div className="solid form-body">
          <div className="form-section-title">Pack contents</div>
          {items.map(([k, label, src]) => (
            <label
              key={k}
              className="checkrow"
              style={{
                padding: "10px 0",
                borderBottom: "1px solid var(--jce-line)",
              }}
            >
              <input
                type="checkbox"
                checked={sel[k]}
                onChange={(e) =>
                  setSel((s) => ({ ...s, [k]: e.target.checked }))
                }
              />
              <span style={{ flex: 1 }}>{label}</span>
              <span className="docchip sm">{src}</span>
            </label>
          ))}
          <button
            className="btn btn-post"
            style={{ marginTop: 16, width: "100%" }}
          >
            ⎙ Export pack ({count} docs) → PDF set
          </button>
        </div>
        <div className="preview-frame glass">
          <div className="preview-bar">
            <span className="kicker" style={{ margin: 0 }}>
              Pack preview
            </span>
            <span className="chip chip-neutral">{count}-document bundle</span>
          </div>
          <div className="solid" style={{ padding: 16 }}>
            {items
              .filter(([k]) => sel[k])
              .map(([k, label], i) => (
                <div key={k} className="pack-row">
                  <span className="pack-num">{i + 1}</span>
                  <span>{label}</span>
                  <Icon name="check" size={14} color="var(--st-success)" />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        One-click bundle per progress billing — report + NET AMOUNT +
        attachments collated into a single ordered PDF set for the client
        submission.
      </div>
    </div>
  );
}

// ---- P19 · Project budget vs actual (PMG side) ----------------------------
function P19Budget() {
  const ROWS = [
    {
      proj: "NORECO II — 13.2KV",
      contract: 53277688,
      committed: 18400000,
      actual: 9820000,
    },
    {
      proj: "Cavite 69KV",
      contract: 38400000,
      committed: 24200000,
      actual: 19600000,
    },
    {
      proj: "Solar Tarlac",
      contract: 62000000,
      committed: 54800000,
      actual: 51200000,
    },
  ];
  return (
    <div className="screen wide">
      <div className="page-head glass">
        <div>
          <div className="kicker">PMG · P19 · Phase 2</div>
          <h2 className="ph-title">Project budget vs actual</h2>
        </div>
        <div className="ph-actions">
          <span className="muted-note">
            BOQ contract vs committed POs &amp; issued materials · ties to
            Purchasing U21
          </span>
        </div>
      </div>
      <div className="budget-cards">
        {ROWS.map((r, i) => {
          const usedPct = Math.round((r.actual / r.contract) * 100);
          const commPct = Math.round((r.committed / r.contract) * 100);
          const remaining = r.contract - r.committed;
          const over = commPct > 90;
          return (
            <div key={i} className="solid budget-card">
              <div className="bc-head">
                <div className="bc-name">{r.proj}</div>
                {over ? (
                  <span className="chip chip-pending">
                    {commPct}% committed
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
                  style={{ width: usedPct + "%" }}
                ></div>
                <div
                  className="bc-committed"
                  style={{ width: commPct - usedPct + "%" }}
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
                  <span className="bc-k">Contract</span>
                  <span className="bc-v">₱{pmoney(r.contract)}</span>
                </div>
                <div>
                  <span className="bc-k">Remaining</span>
                  <span
                    className="bc-v"
                    style={{
                      color: remaining < 0 ? "var(--st-danger)" : "inherit",
                    }}
                  >
                    ₱{pmoney(remaining)}
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
    </div>
  );
}

window.P14Photos = P14Photos;
window.P15Templates = P15Templates;
window.P16Scurve = P16Scurve;
window.P17Traceability = P17Traceability;
window.P18DocPack = P18DocPack;
window.P19Budget = P19Budget;
