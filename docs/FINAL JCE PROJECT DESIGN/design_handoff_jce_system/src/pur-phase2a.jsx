// ============================================================================
// JCE SYSTEM — Purchasing Phase 2 (part 1): U14 merge · U15 RFQ · U16 RFQ matrix
//   U17 catalog · U18 price history
// ============================================================================

// ---- U14 · Supplier merge tool (Admin only) -------------------------------
function U14Merge({ role }) {
  const [primary, setPrimary] = useState("ABB Inc.");
  const isAdmin = role === "admin" || role === "owner";
  const group = [
    {
      name: "ABB Inc.",
      tin: "002-118-552-000",
      pos: 14,
      rfps: 9,
      quotes: 5,
      primary: true,
    },
    { name: "ABB Hitachi", tin: "002-118-552-000", pos: 3, rfps: 1, quotes: 0 },
    { name: "A.B.B.", tin: "—", pos: 2, rfps: 0, quotes: 1 },
  ];
  if (!isAdmin)
    return (
      <div className="screen">
        <div className="mask-banner">
          <Icon name="lock" size={15} /> Supplier merge is{" "}
          <strong>Admin only</strong> (post-migration cleanup of ~145 records).
        </div>
      </div>
    );
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U14 · Phase 1.5</div>
          <h2 className="ph-title">Supplier merge</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">
            Find duplicate suppliers
          </button>
        </div>
      </div>
      <div className="solid" style={{ padding: 18, marginBottom: 14 }}>
        <div className="card-title">
          Suggested duplicate group{" "}
          <span className="muted">
            (TIN exact + name fuzzy + same email/phone)
          </span>
        </div>
        <table className="jtable" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Primary</th>
              <th>Supplier</th>
              <th>TIN</th>
              <th className="num">POs</th>
              <th className="num">RFPs</th>
              <th className="num">Quotes</th>
            </tr>
          </thead>
          <tbody>
            {group.map((g) => (
              <tr key={g.name}>
                <td>
                  <input
                    type="radio"
                    name="primary"
                    checked={primary === g.name}
                    onChange={() => setPrimary(g.name)}
                  />
                </td>
                <td style={{ fontWeight: 600 }}>{g.name}</td>
                <td className="mono" style={{ fontSize: 11 }}>
                  {g.tin}
                </td>
                <td className="num">{g.pos}</td>
                <td className="num">{g.rfps}</td>
                <td className="num">{g.quotes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="threeway solid">
        <Icon name="check" size={15} color="var(--st-pending-ink)" />
        <span>
          <strong>Atomic FK repoint</strong> to <strong>{primary}</strong>: 19
          POs · 10 RFPs · 6 Quotations move over. Duplicates are{" "}
          <strong>deactivated, never deleted</strong>; the merge is logged and{" "}
          <strong>reversible within 30 days</strong>.
        </span>
      </div>
      <button className="btn btn-primary" style={{ marginTop: 14 }}>
        Merge into "{primary}"
      </button>
    </div>
  );
}

// ---- U15 · RFQ management --------------------------------------------------
const RFQS = [
  {
    no: "RFQ-26-0044",
    date: "2026-06-01",
    item: "Power transformer 10MVA",
    mr: "JCE-MR-2026-0142",
    invited: 3,
    responses: 2,
    status: "Responses In",
  },
  {
    no: "RFQ-26-0041",
    date: "2026-05-22",
    item: "ACSR conductor 1/0 lot",
    mr: "—",
    invited: 4,
    responses: 4,
    status: "Awarded",
  },
  {
    no: "RFQ-26-0038",
    date: "2026-05-15",
    item: "Pole-line hardware",
    mr: "JCE-MR-2026-0138",
    invited: 2,
    responses: 0,
    status: "Sent",
  },
];
const RFQ_TONE = {
  Draft: "neutral",
  Sent: "info",
  "Responses In": "pending",
  Awarded: "success",
  Converted: "info",
  Closed: "neutral",
};
function U15RFQ({ onOpen }) {
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U15 · Phase 2</div>
          <h2 className="ph-title">RFQ management</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-primary btn-sm">+ New RFQ</button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>RFQ No.</th>
              <th>Date</th>
              <th>Item</th>
              <th>From MR</th>
              <th>Responses</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {RFQS.map((r) => (
              <tr
                key={r.no}
                onClick={() => onOpen && onOpen(r)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span className="docchip">{r.no}</span>
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {r.date}
                </td>
                <td style={{ fontWeight: 600 }}>{r.item}</td>
                <td>
                  {r.mr === "—" ? (
                    <span className="muted">standalone</span>
                  ) : (
                    <span className="docchip sm">{r.mr}</span>
                  )}
                </td>
                <td>
                  <span
                    className={
                      "chip chip-" +
                      (r.responses === r.invited ? "success" : "pending")
                    }
                  >
                    {r.responses}/{r.invited}
                  </span>
                </td>
                <td>
                  <span className={"chip chip-" + RFQ_TONE[r.status]}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Procurement-side (distinct from BDD's bid-side Quotation). Status: Draft
        → Sent → Responses In → Awarded → Converted → Closed.
      </div>
    </div>
  );
}

// ---- U16 · RFQ comparison matrix ------------------------------------------
function U16Matrix() {
  const suppliers = ["ABB Inc.", "Shenda Electric", "Schneider"];
  const rows = [
    {
      item: "Transformer 10MVA",
      prices: [128500, 142000, 151200],
      leads: [30, 45, 60],
    },
    {
      item: "HV bushings set",
      prices: [18200, 17500, 21000],
      leads: [20, 35, 25],
    },
  ];
  const lowestIdx = (arr) => arr.indexOf(Math.min(...arr));
  return (
    <div className="screen wide">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U16 · Phase 2</div>
          <h2 className="ph-title">RFQ comparison — RFQ-26-0044</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-primary btn-sm">Award → draft PO</button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable cmatrix">
          <thead>
            <tr>
              <th>Item</th>
              {suppliers.map((s) => (
                <th key={s} className="num">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => {
              const li = lowestIdx(r.prices);
              const lli = lowestIdx(r.leads);
              return (
                <React.Fragment key={ri}>
                  <tr>
                    <td
                      rowSpan="2"
                      style={{ fontWeight: 600, verticalAlign: "top" }}
                    >
                      {r.item}
                    </td>
                    {r.prices.map((p, i) => (
                      <td key={i} className={"num" + (i === li ? " best" : "")}>
                        ₱{pmoney(p)}
                        {i === li && <span className="low-tag">lowest</span>}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    {r.leads.map((l, i) => (
                      <td
                        key={i}
                        className={"num" + (i === lli ? " best" : "")}
                        style={{ fontSize: 12, color: "var(--jce-ink-2)" }}
                      >
                        {l}d lead
                        {i === lli && <span className="low-tag">fastest</span>}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              );
            })}
            <tr style={{ fontWeight: 700 }}>
              <td>Extended total</td>
              <td className="num best">₱146,700 ★</td>
              <td className="num">₱159,500</td>
              <td className="num">₱172,200</td>
            </tr>
            <tr>
              <td></td>
              <td>
                <span className="chip chip-success">Award ABB ★</span>
              </td>
              <td>
                <button className="btn btn-ghost btn-sm">Award</button>
              </td>
              <td>
                <button className="btn btn-ghost btn-sm">Award</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        className="threeway solid"
        style={{ borderLeftColor: "var(--st-pending)", marginTop: 14 }}
      >
        <Icon name="check" size={15} color="var(--st-pending-ink)" />
        <span>
          Auto-highlights lowest price &amp; shortest lead per line and overall.
          If the awarded quote isn't the lowest, a{" "}
          <strong>justification note is required</strong> and logged. Award
          converts to a prefilled draft PO.
        </span>
      </div>
    </div>
  );
}

// ---- U17 · Item / material catalog ----------------------------------------
function U17Catalog() {
  const [cat, setCat] = useState("All");
  const TREE = [
    "All",
    "MEP > Electrical > Cable & Wire",
    "MEP > Electrical > Transformers",
    "MEP > Electrical > Switchgear",
    "Civil > Structural > Steel",
  ];
  const ITEMS = [
    {
      code: "ITM-00142",
      name: "ACSR conductor 1/0",
      uom: "m",
      cat: "MEP > Electrical > Cable & Wire",
      supplier: "Meralco Ind.",
      last: "₱120.00",
      active: true,
    },
    {
      code: "ITM-00088",
      name: "Distribution transformer 100KVA",
      uom: "set",
      cat: "MEP > Electrical > Transformers",
      supplier: "ABB Inc.",
      last: "₱300,000.00",
      active: true,
    },
    {
      code: "ITM-00301",
      name: "MV switchgear panel",
      uom: "unit",
      cat: "MEP > Electrical > Switchgear",
      supplier: "Schneider",
      last: "₱128,500.00",
      active: true,
    },
    {
      code: "ITM-00410",
      name: "Structural steel angle 50×50×6",
      uom: "pcs",
      cat: "Civil > Structural > Steel",
      supplier: "Cebu Steel",
      last: "₱340.00",
      active: true,
    },
  ];
  const rows = ITEMS.filter((i) => cat === "All" || i.cat === cat);
  return (
    <div className="screen wide">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U17 · Phase 2</div>
          <h2 className="ph-title">Item / material catalog</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-primary btn-sm">+ Add item</button>
        </div>
      </div>
      <div className="catalog-split">
        <nav className="glass settings-nav" style={{ position: "static" }}>
          <div
            className="card-title"
            style={{ fontSize: 12, padding: "4px 8px" }}
          >
            Taxonomy
          </div>
          {TREE.map((t) => (
            <button
              key={t}
              className={"set-navitem" + (cat === t ? " on" : "")}
              onClick={() => setCat(t)}
              style={{ fontSize: 12 }}
            >
              {t === "All" ? "All items" : t.split(" > ").slice(-1)[0]}
              <div style={{ fontSize: 9, opacity: 0.6 }}>
                {t !== "All" && t}
              </div>
            </button>
          ))}
        </nav>
        <div className="solid table-wrap">
          <table className="jtable">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>UOM</th>
                <th>Category</th>
                <th>Preferred supplier</th>
                <th className="num">Last price</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((it) => (
                <tr key={it.code}>
                  <td className="mono" style={{ fontWeight: 600 }}>
                    {it.code}
                  </td>
                  <td style={{ fontWeight: 600 }}>{it.name}</td>
                  <td>{it.uom}</td>
                  <td style={{ fontSize: 11, color: "var(--jce-ink-2)" }}>
                    {it.cat}
                  </td>
                  <td>{it.supplier}</td>
                  <td className="num money">{it.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Two-level taxonomy tree; promote an ad-hoc PO/RFQ line to the catalog in
        one click. Speeds PO/RFQ entry.
      </div>
    </div>
  );
}

// ---- U18 · Price history & flags ------------------------------------------
function U18Price() {
  const hist = [
    {
      date: "2026-05-22",
      supplier: "ABB Inc.",
      price: 128500,
      ref: "PO 2605-0188IC",
      up: false,
    },
    {
      date: "2026-03-10",
      supplier: "ABB Inc.",
      price: 122000,
      ref: "PO 2603-0140",
      up: false,
    },
    {
      date: "2025-12-02",
      supplier: "Schneider",
      price: 131000,
      ref: "RFQ-25-0210",
      up: true,
    },
    {
      date: "2025-09-18",
      supplier: "ABB Inc.",
      price: 119000,
      ref: "PO 2509-0088",
      up: false,
    },
  ];
  const pts = [119000, 131000, 122000, 128500];
  const W = 520,
    H = 140,
    pad = 24,
    min = 110000,
    max = 135000;
  const x = (i) => pad + (i * (W - 2 * pad)) / (pts.length - 1),
    y = (v) => H - pad - ((v - min) / (max - min)) * (H - 2 * pad);
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U18 · Phase 2</div>
          <h2 className="ph-title">Price history — Transformer 10MVA</h2>
        </div>
        <div className="ph-actions">
          <span className="chip chip-pending">⚠ +5.3% vs last paid</span>
        </div>
      </div>
      <div className="glass" style={{ padding: 18, marginBottom: 14 }}>
        <div className="card-title">FX-normalized price trend (₱)</div>
        <div className="solid" style={{ padding: 16, marginTop: 10 }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: "100%", height: "auto" }}
          >
            <path
              d={pts
                .map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`)
                .join(" ")}
              fill="none"
              stroke="#007817"
              strokeWidth="2.5"
            />
            {pts.map((v, i) => (
              <g key={i}>
                <circle cx={x(i)} cy={y(v)} r="3.5" fill="#007817" />
                <text
                  x={x(i)}
                  y={y(v) - 8}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#4A5B51"
                >
                  {(v / 1000).toFixed(0)}k
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Supplier</th>
              <th className="num">Unit price</th>
              <th>Source</th>
              <th>Flag</th>
            </tr>
          </thead>
          <tbody>
            {hist.map((h, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 12 }}>
                  {h.date}
                </td>
                <td>{h.supplier}</td>
                <td className="num money">{pmoney(h.price)}</td>
                <td>
                  <span className="docchip sm">{h.ref}</span>
                </td>
                <td>
                  {h.up ? (
                    <span className="chip chip-pending">↑ over threshold</span>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Entry-time warning chip when a new price exceeds last paid by the
        configured threshold (e.g. 5%). FX-normalized for cross-currency
        comparison.
      </div>
    </div>
  );
}

window.U14Merge = U14Merge;
window.U15RFQ = U15RFQ;
window.U16Matrix = U16Matrix;
window.U17Catalog = U17Catalog;
window.U18Price = U18Price;
