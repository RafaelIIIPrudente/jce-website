// ============================================================================
// JCE SYSTEM — Accounting · Sales & Collections
//   A7 register · A8 Issue SI · A9 Issue SOA · A10 register · A11 CR · A12 AR · A19 Clients
// ============================================================================

// ---------------------------------------------------------------------------
// A7 · Billing register (SI + SOA)
// ---------------------------------------------------------------------------
function A7Register({ role, onIssueSI, onIssueSOA }) {
  const [type, setType] = useState("All");
  const rows = BILLINGS.filter((b) => type === "All" || b.type === type);
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Accounting · A7 · Sales</div>
          <h2 className="ph-title">Billing statement register</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-primary btn-sm" onClick={onIssueSI}>
            + Issue Service Invoice
          </button>
          <button className="btn btn-accent btn-sm" onClick={onIssueSOA}>
            + Issue Statement of Account
          </button>
        </div>
      </div>
      <div
        className="seg glass-nav"
        style={{ marginBottom: 14, display: "inline-flex" }}
      >
        {["All", "SI", "SOA"].map((t) => (
          <button
            key={t}
            className={type === t ? "on" : ""}
            onClick={() => setType(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Doc No.</th>
              <th>OR/CR Ref</th>
              <th>Client</th>
              <th>SO#</th>
              <th>Particulars</th>
              <th className="num">Amount</th>
              <th className="num">VAT</th>
              <th>Status</th>
              <th className="num">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b, i) => (
              <tr key={i} style={{ cursor: "pointer" }}>
                <td className="mono" style={{ fontSize: 12 }}>
                  {b.date}
                </td>
                <td>
                  <span
                    className={
                      "chip chip-" + (b.type === "SI" ? "info" : "neutral")
                    }
                  >
                    {b.type}
                  </span>
                </td>
                <td>
                  <span className="docchip">{b.no}</span>
                </td>
                <td>
                  {b.or === "—" ? (
                    <span className="muted">—</span>
                  ) : (
                    <span className="docchip sm">{b.or}</span>
                  )}
                </td>
                <td style={{ fontWeight: 600 }}>{b.client}</td>
                <td>
                  <span className="docchip sm">{b.so}</span>
                </td>
                <td style={{ color: "var(--jce-ink-2)" }}>{b.particulars}</td>
                <td className="num money">{pmoney(b.debit || b.credit)}</td>
                <td className="num money">{b.vat ? pmoney(b.vat) : "—"}</td>
                <td>
                  <span className={"chip chip-" + BILL_TONE[b.status]}>
                    {b.status}
                  </span>
                </td>
                <td className="num money" style={{ fontWeight: 600 }}>
                  {pmoney(b.bal)}
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
// A8 · Issue Service Invoice (FLAGSHIP — two-pane + live preview)
// ---------------------------------------------------------------------------
function A8IssueSI({ onBack }) {
  const [lines, setLines] = useState([
    {
      qty: 1,
      unit: "Lot",
      desc: "8th progress billing — 230KV Substation",
      price: 2410000,
      vat: "VATable",
    },
  ]);
  const [issued, setIssued] = useState(false);
  const [client, setClient] = useState("NORECO II");
  const cl = CLIENTS.find((c) => c.name === client) || CLIENTS[0];
  const vatable = lines
    .filter((l) => l.vat === "VATable")
    .reduce((a, l) => a + l.qty * l.price, 0);
  const exempt = lines
    .filter((l) => l.vat === "VAT-Exempt")
    .reduce((a, l) => a + l.qty * l.price, 0);
  const zero = lines
    .filter((l) => l.vat === "Zero-Rated")
    .reduce((a, l) => a + l.qty * l.price, 0);
  const vat = vatable * 0.12;
  const totalDue = vatable + exempt + zero + vat;
  const upd = (i, k, v) =>
    setLines(
      lines.map((l, j) =>
        j === i
          ? { ...l, [k]: k === "qty" || k === "price" ? Number(v) : v }
          : l,
      ),
    );

  return (
    <div className="screen wide">
      <button className="back-link" onClick={onBack}>
        ← Sales register
      </button>
      <div className="page-head glass">
        <div>
          <div className="kicker">Accounting · A8</div>
          <h2 className="ph-title">
            Issue Service Invoice{" "}
            {issued && <span className="chip chip-info">Issued</span>}
          </h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">Save Draft</button>
          {!issued ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIssued(true)}
            >
              Issue → post to books
            </button>
          ) : (
            <button className="btn btn-post btn-sm">⎙ Print</button>
          )}
        </div>
      </div>

      <div className="twopane">
        {/* FORM */}
        <div className="solid form-body">
          <div className="form-section-title">Header</div>
          <div className="form-grid">
            <L l="Service Invoice No." req>
              <input
                className="field"
                defaultValue="SI-004513"
                placeholder="from booklet"
              />
            </L>
            <L l="Date" req>
              <input className="field" type="date" defaultValue="2026-06-03" />
            </L>
            <L l="Customer" req>
              <select
                className="field"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              >
                {CLIENTS.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </L>
            <L l="TIN" computed>
              <div className="field is-computed">{cl.tin}</div>
            </L>
            <L l="Terms">
              <input className="field" defaultValue="30 days" />
            </L>
            <L l="SO# (multi)" req>
              <select className="field">
                {PROJECTS.map((p) => (
                  <option key={p.so}>
                    {p.so} · {p.label}
                  </option>
                ))}
              </select>
            </L>
          </div>
          <div className="seq-hint">
            Last SI issued: <strong>SI-004512</strong> — next expected SI-004513
            (out-of-sequence warns).
          </div>

          <div className="form-section-title">Line items</div>
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
                  <th className="num">Amount</th>
                  <th>VAT class</th>
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
                    <td className="num money">{pmoney(l.qty * l.price)}</td>
                    <td>
                      <select
                        className="cell-input"
                        value={l.vat}
                        onChange={(e) => upd(i, "vat", e.target.value)}
                      >
                        {["VATable", "VAT-Exempt", "Zero-Rated"].map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 8 }}
            onClick={() =>
              setLines([
                ...lines,
                { qty: 1, unit: "Lot", desc: "", price: 0, vat: "VATable" },
              ])
            }
          >
            + Add line
          </button>
          <L l="Authorized Representative" sensitive>
            <select className="field" style={{ marginTop: 14 }}>
              <option>A. Reyes · CFO</option>
              <option>J. Cruz · President</option>
            </select>
          </L>
        </div>

        {/* LIVE PREVIEW */}
        <div className="preview-frame glass">
          <div className="preview-bar">
            <span className="kicker" style={{ margin: 0 }}>
              Live print preview
            </span>
            <span className="chip chip-neutral">A4 · BIR booklet</span>
          </div>
          <div className="paper si-paper">
            <div className="ph">
              <div>
                <div className="co">JC ELECTROFIELDS POWER SYSTEM, INC.</div>
                <div className="ad">
                  Valenzuela City · VAT Reg TIN 000-000-000-000
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800 }}>SERVICE INVOICE</div>
                <div className="docn">SI-004513</div>
              </div>
            </div>
            <div className="si-cust">
              <div>
                <span className="sl">Customer:</span> {cl.name}
              </div>
              <div>
                <span className="sl">TIN:</span> {cl.tin}
              </div>
              <div>
                <span className="sl">Address:</span> {cl.addr}
              </div>
              <div>
                <span className="sl">Date:</span> 2026-06-03
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Description</th>
                  <th className="num">Unit Price</th>
                  <th className="num">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={i}>
                    <td>{l.qty}</td>
                    <td>{l.unit}</td>
                    <td>
                      {l.desc}
                      {l.vat !== "VATable" && <em> ({l.vat})</em>}
                    </td>
                    <td className="num">{pmoney(l.price)}</td>
                    <td className="num">{pmoney(l.qty * l.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="si-totals">
              <div>
                <span>VATable Sales</span>
                <span className="num">{pmoney(vatable)}</span>
              </div>
              {exempt > 0 && (
                <div>
                  <span>VAT-Exempt Sales</span>
                  <span className="num">{pmoney(exempt)}</span>
                </div>
              )}
              {zero > 0 && (
                <div>
                  <span>Zero-Rated Sales</span>
                  <span className="num">{pmoney(zero)}</span>
                </div>
              )}
              <div>
                <span>VAT (12%)</span>
                <span className="num">{pmoney(vat)}</span>
              </div>
              <div className="gt">
                <span>TOTAL AMOUNT DUE</span>
                <span className="num">₱{pmoney(totalDue)}</span>
              </div>
            </div>
            <div
              className="sigblock"
              style={{ gridTemplateColumns: "1fr", marginTop: 14 }}
            >
              <div className="sig">
                <div className="line"></div>
                <div className="role">Authorized Representative</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A9 · Issue Statement of Account (FLAGSHIP — billing breakdown, NET AMOUNT)
// ---------------------------------------------------------------------------
function A9IssueSOA({ onBack }) {
  const contract = 13540000,
    dpPct = 15,
    retPct = 10;
  const [billPct, setBillPct] = useState(8);
  const [recoupPct, setRecoupPct] = useState(15);
  const [issued, setIssued] = useState(false);
  const gross = (contract * billPct) / 100;
  const retention = (gross * retPct) / 100;
  const recoup = (gross * recoupPct) / 100;
  const net = gross - retention - recoup;

  return (
    <div className="screen wide">
      <button className="back-link" onClick={onBack}>
        ← Sales register
      </button>
      <div className="page-head glass">
        <div>
          <div className="kicker">Accounting · A9</div>
          <h2 className="ph-title">
            Issue Statement of Account{" "}
            {issued && <span className="chip chip-info">Issued</span>}
          </h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">Save Draft</button>
          {!issued ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIssued(true)}
            >
              Issue
            </button>
          ) : (
            <button className="btn btn-post btn-sm">⎙ Print</button>
          )}
        </div>
      </div>

      <div className="twopane">
        <div className="solid form-body">
          <div className="form-section-title">
            Header ·{" "}
            <span className="muted">Body mode A — Billing Breakdown</span>
          </div>
          <div className="form-grid">
            <L l="SOA No." req>
              <input className="field" defaultValue="SOA-2026-089" />
            </L>
            <L l="Date" req>
              <input className="field" type="date" defaultValue="2026-06-03" />
            </L>
            <L l="Billed To" req>
              <select className="field">
                <option>NGCP</option>
                <option>NORECO II</option>
              </select>
            </L>
            <L l="SO#" req>
              <select className="field">
                {PROJECTS.map((p) => (
                  <option key={p.so}>
                    {p.so} · {p.label}
                  </option>
                ))}
              </select>
            </L>
          </div>

          <div className="form-section-title">
            Contract context{" "}
            <span className="muted">(read-only, always printed)</span>
          </div>
          <div className="ctx-strip solid" style={{ margin: 0 }}>
            <div>
              <span className="ctx-k">Contract Price</span>
              <span className="ctx-v">₱{pmoney(contract)}</span>
            </div>
            <div>
              <span className="ctx-k">Down Payment ({dpPct}%)</span>
              <span className="ctx-v">₱{pmoney((contract * dpPct) / 100)}</span>
            </div>
            <div>
              <span className="ctx-k">Prior billings</span>
              <span className="ctx-v">7th · 52% · ₱7.04M</span>
            </div>
          </div>

          <div className="form-section-title">This billing</div>
          <div className="form-grid">
            <L l="Billing label">
              <input className="field" defaultValue="8th Billing" />
            </L>
            <L l={"Billing % of Contract — " + billPct + "%"}>
              <input
                className="field"
                type="range"
                min="1"
                max="20"
                value={billPct}
                onChange={(e) => setBillPct(Number(e.target.value))}
              />
            </L>
            <L l="Gross amount" computed>
              <div className="field is-computed">₱{pmoney(gross)}</div>
            </L>
            <L l={"Retention (" + retPct + "%)"} computed>
              <div className="field is-computed">₱{pmoney(retention)}</div>
            </L>
            <L l={"DP Recoupment % — " + recoupPct + "%"}>
              <input
                className="field"
                type="range"
                min="0"
                max="20"
                value={recoupPct}
                onChange={(e) => setRecoupPct(Number(e.target.value))}
              />
            </L>
            <L l="Net Amount (Total)" computed>
              <div
                className="field is-computed"
                style={{ fontWeight: 700, color: "var(--jce-green-900)" }}
              >
                ₱{pmoney(net)}
              </div>
            </L>
          </div>
          <div className="muted-note">
            Net Amount = Gross − Retention − Recoupment. Register mapping:
            trade_receivable = Net · retention = Retention · down_payment =
            Recoupment.
          </div>
        </div>

        <div className="preview-frame glass">
          <div className="preview-bar">
            <span className="kicker" style={{ margin: 0 }}>
              Live print preview
            </span>
            <span className="chip chip-neutral">
              Non-VAT · progress billing
            </span>
          </div>
          <div className="paper">
            <div className="ph">
              <div>
                <div className="co">JC ELECTROFIELDS POWER SYSTEM, INC.</div>
                <div className="ad">Valenzuela City</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800 }}>STATEMENT OF ACCOUNT</div>
                <div className="docn">SOA-2026-089</div>
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 11, margin: "6px 0" }}>
              230KV Substation — Bulacan · SO# 26-05-378
            </div>
            <table>
              <tbody>
                <tr>
                  <td>Contract Price</td>
                  <td className="num">{pmoney(contract)}</td>
                </tr>
                <tr>
                  <td>8th Billing — {billPct}% of Contract</td>
                  <td className="num">{pmoney(gross)}</td>
                </tr>
                <tr>
                  <td>Less: Retention ({retPct}%)</td>
                  <td className="num">({pmoney(retention)})</td>
                </tr>
                <tr>
                  <td>Less: DP Recoupment ({recoupPct}%)</td>
                  <td className="num">({pmoney(recoup)})</td>
                </tr>
                <tr style={{ fontWeight: 800 }}>
                  <td>NET AMOUNT</td>
                  <td className="num">{pmoney(net)}</td>
                </tr>
              </tbody>
            </table>
            <table style={{ marginTop: 8 }}>
              <thead>
                <tr>
                  <th className="num">Qty</th>
                  <th>Unit</th>
                  <th className="num">Unit Cost</th>
                  <th className="num">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="num">1</td>
                  <td>Lot</td>
                  <td className="num">{pmoney(net)}</td>
                  <td className="num">{pmoney(net)}</td>
                </tr>
              </tbody>
            </table>
            <div
              style={{
                fontSize: 9,
                fontStyle: "italic",
                color: "#444",
                marginTop: 6,
              }}
            >
              ***{net >= 1000000 ? "One Million " : ""}… &amp; 00/100 Pesos
              Only***
            </div>
            <div
              className="sigblock"
              style={{ gridTemplateColumns: "1fr 1fr", marginTop: 14 }}
            >
              <div className="sig">
                <div className="line"></div>
                <div className="role">
                  Authorized by · Billing &amp; Collection Officer
                </div>
              </div>
              <div className="sig">
                <div className="line"></div>
                <div className="role">Approved by · Accounting Head</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A10 · Collections register
// ---------------------------------------------------------------------------
function A10Register({ onCR, onAR }) {
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Accounting · A10 · Collections</div>
          <h2 className="ph-title">Collections register</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-primary btn-sm" onClick={onCR}>
            + Issue Collection Receipt
          </button>
          <button className="btn btn-accent btn-sm" onClick={onAR}>
            + Issue Acknowledgement Receipt
          </button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Doc No.</th>
              <th>Client</th>
              <th>SO#</th>
              <th>Ref</th>
              <th className="num">Trade Recv.</th>
              <th className="num">CWT (2%)</th>
              <th className="num">Banks (Net)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {COLLECTIONS.map((c, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 12 }}>
                  {c.date}
                </td>
                <td>
                  <span
                    className={
                      "chip chip-" + (c.type === "CR" ? "info" : "neutral")
                    }
                  >
                    {c.type}
                  </span>
                </td>
                <td>
                  <span className="docchip">{c.no}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{c.client}</td>
                <td>
                  <span className="docchip sm">{c.so}</span>
                </td>
                <td>
                  <span className="docchip sm">{c.ref}</span>
                </td>
                <td className="num money">{pmoney(c.tr)}</td>
                <td className="num money">{pmoney(c.cwt)}</td>
                <td className="num money bank-col">{pmoney(c.banks)}</td>
                <td>
                  <span className="chip chip-success">{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Banks (Net) = gross − CWT, the reconciliation figure. Partial payment
        flags the billing Partially Paid; void restores balance (audited).
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A11 / A12 · Issue CR / AR (two-pane)
// ---------------------------------------------------------------------------
function A11A12Issue({ type, onBack }) {
  const isCR = type === "CR";
  const [issued, setIssued] = useState(false);
  return (
    <div className="screen wide">
      <button className="back-link" onClick={onBack}>
        ← Collections register
      </button>
      <div className="page-head glass">
        <div>
          <div className="kicker">Accounting · {isCR ? "A11" : "A12"}</div>
          <h2 className="ph-title">
            Issue {isCR ? "Collection Receipt" : "Acknowledgement Receipt"}
          </h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">Save Draft</button>
          {!issued ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIssued(true)}
            >
              Issue
            </button>
          ) : (
            <button className="btn btn-post btn-sm">
              ⎙ Print{isCR ? "" : " — 2 copies"}
            </button>
          )}
        </div>
      </div>
      <div className="twopane">
        <div className="solid form-body">
          <div className="form-grid">
            <L l={isCR ? "CR No. (booklet)" : "AR No. (auto)"} req>
              <input
                className="field"
                defaultValue={isCR ? "CR-0903" : "AR-2026-045"}
              />
            </L>
            <L l="Date" req>
              <input className="field" type="date" defaultValue="2026-06-03" />
            </L>
            <L l="Received from" req>
              <select className="field">
                {CLIENTS.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </L>
            <L l="SO#" req>
              <select className="field">
                {PROJECTS.map((p) => (
                  <option key={p.so}>{p.so}</option>
                ))}
              </select>
            </L>
            <L l={isCR ? "Source SI No." : "SOA No."} req>
              <input
                className="field"
                defaultValue={isCR ? "SI-004512" : "SOA-2026-088"}
              />
            </L>
            <L l="Amount (figures)" req>
              <input className="field" defaultValue="2,410,000.00" />
            </L>
            <L l="Creditable Tax (2%)" computed>
              <div className="field is-computed">48,200.00</div>
            </L>
            <L l="Banks (Net)" computed>
              <div className="field is-computed">2,361,800.00</div>
            </L>
          </div>
          {isCR && (
            <div className="seq-hint">
              Source SI-004512 outstanding balance:{" "}
              <strong>₱2,410,000.00</strong> — amount defaults to it. Partial
              leaves balance open.
            </div>
          )}
          <L
            l={isCR ? "By Cashier / Authorized Signature" : "Received by"}
            sensitive
          >
            <select className="field" style={{ marginTop: 12 }}>
              <option>L. Tan · Cashier</option>
            </select>
          </L>
        </div>
        <div className="preview-frame glass">
          <div className="preview-bar">
            <span className="kicker" style={{ margin: 0 }}>
              Live preview
            </span>
            <span className="chip chip-neutral">
              {isCR ? "BIR booklet" : "2 copies / page"}
            </span>
          </div>
          <div className="paper">
            <div className="ph">
              <div>
                <div className="co">JC ELECTROFIELDS POWER SYSTEM, INC.</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800 }}>
                  {isCR ? "COLLECTION RECEIPT" : "ACKNOWLEDGEMENT RECEIPT"}
                </div>
                <div className="docn">{isCR ? "CR-0903" : "AR-2026-045"}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, margin: "8px 0" }}>
              Received from <strong>NORECO II</strong> the sum of{" "}
              <em>***Two Million Four Hundred Ten Thousand Pesos Only***</em>
            </div>
            <table>
              <tbody>
                <tr>
                  <td>Trade Receivables</td>
                  <td className="num">2,410,000.00</td>
                </tr>
                <tr>
                  <td>Less: Creditable Tax (2%)</td>
                  <td className="num">(48,200.00)</td>
                </tr>
                <tr style={{ fontWeight: 800 }}>
                  <td>Banks (Net)</td>
                  <td className="num">2,361,800.00</td>
                </tr>
              </tbody>
            </table>
            {isCR && (
              <div
                style={{
                  fontSize: 8,
                  fontStyle: "italic",
                  color: "#666",
                  marginTop: 8,
                  border: "1px solid #ccc",
                  padding: "4px 6px",
                }}
              >
                THIS DOCUMENT IS NOT VALID FOR CLAIMING INPUT TAXES · ATP/permit
                footer
              </div>
            )}
            <div
              className="sigblock"
              style={{ gridTemplateColumns: "1fr", marginTop: 12 }}
            >
              <div className="sig">
                <div className="line"></div>
                <div className="role">
                  {isCR ? "By · Cashier / Authorized" : "Received by"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A19 · Clients
// ---------------------------------------------------------------------------
function A19Clients() {
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Accounting · A19</div>
          <h2 className="ph-title">Clients</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-primary btn-sm">+ Add client</button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Client name</th>
              <th>Address</th>
              <th>TIN</th>
              <th className="num">AR balance</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map((c, i) => (
              <tr key={i} style={{ cursor: "pointer" }}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td style={{ color: "var(--jce-ink-2)" }}>{c.addr}</td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {c.tin}
                </td>
                <td className="num money" style={{ fontWeight: 600 }}>
                  {pmoney(c.ar)}
                </td>
                <td>
                  <span className="rowedit">Sub-ledger →</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Feeds SI/SOA/CR/AR auto-fill · merge-safe duplicate warning · used-by
        indicator.
      </div>
    </div>
  );
}

Object.assign(window, {
  A7Register,
  A8IssueSI,
  A9IssueSOA,
  A10Register,
  A11A12Issue,
  A19Clients,
});
