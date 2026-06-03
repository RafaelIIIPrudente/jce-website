// ============================================================================
// JCE SYSTEM — BDD flagships: B4 offer event stream · B6 quotation comparison
//   B10 inquiries inbox
// ============================================================================

// ---------------------------------------------------------------------------
// B4 · Offer record (event stream — immutable record, append-only events)
// ---------------------------------------------------------------------------
function B4Offer({ offer, onBack }) {
  const [events, setEvents] = useState(OFFER_EVENTS);
  const [adding, setAdding] = useState(false);
  const [evType, setEvType] = useState("Status Change");
  const [evData, setEvData] = useState("");
  const o = offer || OFFERS[0];
  // current state derived from events
  const status = events.find((e) => e.type === "Status Change")
    ? o.status
    : o.status;
  const noa = events.find((e) => e.type === "P.O./NOA Received");
  const linkedSO = events.find((e) => e.type === "Sales Order Linked");

  const append = () => {
    setEvents([
      {
        type: evType,
        data: evData || "(no detail)",
        ts: "2026-06-03 10:30",
        user: "You (BDD Staff)",
      },
      ...events,
    ]);
    setAdding(false);
    setEvData("");
  };

  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Offers
      </button>

      <div className="glass offer-card">
        <div className="offer-top">
          <div>
            <div className="kicker">BDD · B4 · Offer (immutable)</div>
            <h2 className="ph-title">
              <span className="docchip">{o.ref}</span>{" "}
              <span
                className={
                  "chip chip-" + (o.entity === "JICA" ? "info" : "neutral")
                }
              >
                {o.entity}
              </span>
            </h2>
            <div className="offer-subject">{o.subject}</div>
          </div>
          <span className={"chip chip-" + OFFER_STATUS_TONE[status]}>
            {status}
          </span>
        </div>
        <div className="offer-meta">
          <div>
            <span className="om-k">Client</span>
            <span className="om-v">{o.client}</span>
          </div>
          <div>
            <span className="om-k">Total Amount</span>
            <span className="om-v money">₱{pmoney(o.amount)}</span>
          </div>
          <div>
            <span className="om-k">Offer Date</span>
            <span className="om-v">{o.date}</span>
          </div>
          <div>
            <span className="om-k">Date Emailed</span>
            <span className="om-v">{o.emailed}</span>
          </div>
          <div>
            <span className="om-k">Sent By</span>
            <span className="om-v">{o.by}</span>
          </div>
          {o.rev > 0 && (
            <div>
              <span className="om-k">Revision</span>
              <span className="om-v">
                Rev.{String(o.rev).padStart(2, "0")}{" "}
                <a className="rev-link">← predecessor</a>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* current state strip (derived) */}
      <div className="state-strip solid">
        <div>
          <span className="ss-k">Status</span>
          <span className={"chip chip-" + OFFER_STATUS_TONE[status]}>
            {status}
          </span>
        </div>
        <div>
          <span className="ss-k">P.O./NOA</span>
          <span className="ss-v">{noa ? noa.data.split(" · ")[0] : "—"}</span>
        </div>
        <div>
          <span className="ss-k">Linked SO</span>
          <span className="ss-v">
            {linkedSO ? (
              <span className="docchip sm">{linkedSO.data}</span>
            ) : (
              "—"
            )}
          </span>
        </div>
      </div>

      <div className="event-head">
        <h3>
          Event timeline{" "}
          <span className="muted">
            — the record never edits; everything moves by events
          </span>
        </h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setAdding(true)}
        >
          Update status / record event
        </button>
      </div>

      {adding && (
        <div className="solid event-form">
          <div className="form-grid">
            <L l="Event type">
              <select
                className="field"
                value={evType}
                onChange={(e) => setEvType(e.target.value)}
              >
                {[
                  "Status Change",
                  "P.O./NOA Received",
                  "COC Date",
                  "Receipt",
                  "Remark",
                  "Sales Order Linked",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </L>
            <L l="Detail">
              <input
                className="field"
                value={evData}
                onChange={(e) => setEvData(e.target.value)}
                placeholder="e.g. Awarded · NOA No. …"
              />
            </L>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setAdding(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={append}>
              Append event
            </button>
          </div>
        </div>
      )}

      <div className="solid event-feed">
        {events.map((e, i) => (
          <div key={i} className="event-row">
            <div className="event-rail">
              <div className="event-dot"></div>
              {i < events.length - 1 && <div className="event-line"></div>}
            </div>
            <div className="event-body">
              <div className="event-toprow">
                <span className={"chip chip-" + EVENT_TONE[e.type]}>
                  {e.type}
                </span>
                <span className="event-ts mono">{e.ts}</span>
              </div>
              <div className="event-data">{e.data}</div>
              <div className="event-user">{e.user}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Revision flow: <strong>For Revision</strong> creates a new Offer Rev.NN
        linked back (predecessor → Revised). <strong>Awarded</strong> → BDD
        manually creates the Sales Order then links it (event).
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// B6 · Quotation request detail (supplier comparison + winner)
// ---------------------------------------------------------------------------
function B6Comparison({ quote, onBack }) {
  const [quotes, setQuotes] = useState(SUPPLIER_QUOTES);
  const q = quote || QUOTATIONS[0];
  const setWinner = (sup) =>
    setQuotes(quotes.map((x) => ({ ...x, winner: x.supplier === sup })));
  const prices = quotes.filter((x) => x.price != null).map((x) => x.price);
  const lowest = prices.length ? Math.min(...prices) : null;

  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Quotations
      </button>
      <div className="glass offer-card">
        <div className="offer-top">
          <div>
            <div className="kicker">BDD · B6 · Quotation request</div>
            <h2 className="ph-title">
              <span className="docchip">{q.ref}</span>{" "}
              <span className="chip chip-info">{q.cat}</span>
            </h2>
            <div className="offer-subject">{q.item}</div>
          </div>
        </div>
        <div className="offer-meta">
          <div>
            <span className="om-k">Client</span>
            <span className="om-v">{q.client}</span>
          </div>
          <div>
            <span className="om-k">Request Date</span>
            <span className="om-v">{q.date}</span>
          </div>
          <div>
            <span className="om-k">Linked Offer</span>
            <span className="om-v">
              {q.offer ? <span className="docchip sm">{q.offer}</span> : "—"}
            </span>
          </div>
          <div>
            <span className="om-k">Linked SO</span>
            <span className="om-v">
              {q.so ? <span className="docchip sm">{q.so}</span> : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="event-head">
        <h3>Supplier quotes comparison</h3>
        <button className="btn btn-ghost btn-sm">+ Add supplier quote</button>
      </div>
      <div className="solid table-wrap">
        <table className="jtable cmatrix">
          <thead>
            <tr>
              <th>Attribute</th>
              {quotes.map((s) => (
                <th key={s.supplier} className={s.winner ? "best" : ""}>
                  {s.supplier}
                  {s.winner && <span className="winflag"> ★ WINNER</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Response Status</td>
              {quotes.map((s) => (
                <td key={s.supplier} className={s.winner ? "best" : ""}>
                  <span className={"chip chip-" + QRESP_TONE[s.status]}>
                    {s.status}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td>Response Date</td>
              {quotes.map((s) => (
                <td
                  key={s.supplier}
                  className={(s.winner ? "best " : "") + "mono"}
                  style={{ fontSize: 12 }}
                >
                  {s.respDate}
                </td>
              ))}
            </tr>
            <tr>
              <td>Quoted Price (₱)</td>
              {quotes.map((s) => (
                <td
                  key={s.supplier}
                  className={
                    "num " +
                    (s.winner ? "best " : "") +
                    (s.price === lowest ? "lowest" : "")
                  }
                >
                  {s.price != null ? pmoney(s.price) : "—"}
                  {s.price === lowest && s.price != null && (
                    <span className="low-tag">lowest</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td>Notes</td>
              {quotes.map((s) => (
                <td
                  key={s.supplier}
                  className={s.winner ? "best" : ""}
                  style={{ fontSize: 12, color: "var(--jce-ink-2)" }}
                >
                  {s.note}
                </td>
              ))}
            </tr>
            <tr>
              <td></td>
              {quotes.map((s) => (
                <td key={s.supplier} className={s.winner ? "best" : ""}>
                  {s.price != null &&
                    (s.winner ? (
                      <span className="chip chip-success">Selected ★</span>
                    ) : (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setWinner(s.supplier)}
                      >
                        Select winner
                      </button>
                    ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Request + children immutable once created — record price / change status
        / select winner are all <strong>events</strong>. Selecting a winner
        fires a sensitive-change notification.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// B10 · Inquiries inbox (FLAGSHIP)
// ---------------------------------------------------------------------------
function B10Inbox() {
  const [items, setItems] = useState(INQUIRIES);
  const [sel, setSel] = useState(null);
  const [filter, setFilter] = useState("All");
  const rows = items.filter((i) => filter === "All" || i.status === filter);

  const setStatus = (id, st) => {
    setItems(items.map((i) => (i.id === id ? { ...i, status: st } : i)));
    setSel((s) => (s && s.id === id ? { ...s, status: st } : s));
  };

  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">BDD · B10</div>
          <h2 className="ph-title">Inquiries inbox</h2>
        </div>
        <div className="ph-actions">
          <div className="seg glass-nav">
            {["All", "New", "In Review", "Replied", "Spam"].map((f) => (
              <button
                key={f}
                className={filter === f ? "on" : ""}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="inbox-split">
        <div className="solid table-wrap" style={{ maxHeight: "none" }}>
          <table className="jtable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name / Company</th>
                <th>Type</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => (
                <tr
                  key={i.id}
                  className={sel && sel.id === i.id ? "row-sel" : ""}
                  onClick={() => setSel(i)}
                  style={{ cursor: "pointer" }}
                >
                  <td className="mono" style={{ fontSize: 12 }}>
                    {i.date}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{i.name}</div>
                    <div style={{ fontSize: 11, color: "var(--jce-ink-2)" }}>
                      {i.company}
                    </div>
                  </td>
                  <td>{i.type}</td>
                  <td style={{ fontSize: 12, color: "var(--jce-ink-2)" }}>
                    {i.source}
                  </td>
                  <td>
                    <span className={"chip chip-" + INQ_TONE[i.status]}>
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sel ? (
          <div className="glass inq-detail">
            <div className="inq-head">
              <div>
                <div className="inq-name">{sel.name}</div>
                <div className="inq-co">
                  {sel.company} · {sel.position}
                </div>
              </div>
              <span className={"chip chip-" + INQ_TONE[sel.status]}>
                {sel.status}
              </span>
            </div>
            <div className="solid inq-fields">
              <div className="inq-grid">
                <Field label="Email" value={sel.email} />
                <Field label="Phone" value={sel.phone} />
                <Field label="Industry" value={sel.industry} />
                <Field label="Inquiry Type" value={sel.type} />
                <Field label="Project Location" value={sel.projLoc} />
                <Field label="Estimated Timeline" value={sel.timeline} />
                <Field label="Budget Range" value={sel.budget} />
                <Field label="How heard" value={sel.heard} />
              </div>
              <div className="inq-msg">
                <div className="rec-label">Subject</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  {sel.subject}
                </div>
                <div className="rec-label">Message</div>
                <div className="inq-message">{sel.message}</div>
              </div>
            </div>
            <div className="inq-actions">
              <select
                className="field"
                style={{ width: "auto" }}
                value={sel.status}
                onChange={(e) => setStatus(sel.id, e.target.value)}
              >
                {["New", "In Review", "Replied", "Closed", "Spam"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button className="btn btn-primary btn-sm">
                + Create Offer from Inquiry
              </button>
            </div>
            <div className="muted-note" style={{ marginTop: 8 }}>
              "Create Offer" prefills a draft Offer (Subject→Subject,
              Company→Client, Type+Message→context, Sent By←Assigned To) and
              back-links the Linked Offer automatically.
            </div>
          </div>
        ) : (
          <div className="glass inq-detail">
            <div className="empty" style={{ padding: 60 }}>
              <div className="ill">✉</div>
              <div className="et">Select an inquiry</div>
              <div className="ed">
                Website form submissions and manually logged leads land here.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { B4Offer, B6Comparison, B10Inbox });
