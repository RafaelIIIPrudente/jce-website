// ============================================================================
// JCE SYSTEM — PMG screens: P1 dashboard · P2 portfolio · P3 import wizard
//   P4 clone/manual · P5 header · P6 BOQ · P7 VO · P9 billing · P10/P11 MR
//   P12 timeline · P13 audit
// ============================================================================

// ---------------------------------------------------------------------------
// P1 · PMG dashboard
// ---------------------------------------------------------------------------
function P1Dashboard({ onPortfolio }) {
  return (
    <div className="screen">
      <div className="home-greet">
        <h1>Project Management</h1>
        <p>What needs attention across the portfolio.</p>
      </div>
      <div className="kpi-row">
        <div className="kpi-tile glass">
          <div className="kpi-k">Active projects</div>
          <div className="kpi-v">3</div>
          <div className="kpi-d" style={{ color: "var(--st-info)" }}>
            1 on hold
          </div>
        </div>
        <div className="kpi-tile glass">
          <div className="kpi-k">Needing a period update</div>
          <div className="kpi-v">3</div>
          <div className="kpi-d" style={{ color: "var(--st-pending-ink)" }}>
            accomplishment due
          </div>
        </div>
        <div className="kpi-tile glass">
          <div className="kpi-k">Open MRs</div>
          <div className="kpi-v">2</div>
          <div className="kpi-d" style={{ color: "var(--jce-ink-2)" }}>
            1 pending approval
          </div>
        </div>
        <div className="kpi-tile glass">
          <div className="kpi-k">To-Date near 100%</div>
          <div className="kpi-v">1</div>
          <div className="kpi-d" style={{ color: "var(--st-danger)" }}>
            guardrail
          </div>
        </div>
      </div>
      <div className="home-cols">
        <div className="glass home-panel">
          <div className="panel-head">
            <h3>Projects needing a period update</h3>
            <button className="btn btn-ghost btn-sm" onClick={onPortfolio}>
              Portfolio
            </button>
          </div>
          <div className="solid approval-list">
            {PROJECTS_PMG.filter((p) => p.type === "Customer").map((p) => (
              <div key={p.code} className="approval-row">
                <span className="docchip sm">{p.so}</span>
                <div className="ap-main">
                  <div className="ap-t">{p.name}</div>
                  <div className="ap-m">
                    {p.period} · {A_pct(p.pct)}% to date
                  </div>
                </div>
                <span className="chip chip-pending">Update</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass home-panel">
          <div className="panel-head">
            <h3>Recent stock movements</h3>
            <span className="chip chip-neutral">read · Warehouse</span>
          </div>
          <div className="solid notif-mini">
            {PMG_TIMELINE.filter(
              (t) => t.type === "stock" || t.type === "po",
            ).map((t, i) => (
              <div key={i} className="nm-row">
                <span
                  className="nm-dot chip chip-info"
                  style={{ padding: 0, width: 8, height: 8 }}
                ></span>
                <div>
                  <div className="nm-t">{t.txt}</div>
                  <div className="nm-time">
                    {t.actor} · {t.ts}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// P2 · Portfolio
// ---------------------------------------------------------------------------
function P2Portfolio({ role, onOpen, onNew }) {
  const [dense, setDense] = useState(false);
  const scoped = role === "siteeng";
  const list = scoped
    ? PROJECTS_PMG.filter((p) => p.so === "26-05-378")
    : PROJECTS_PMG;
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">PMG · P2</div>
          <h2 className="ph-title">
            Project portfolio{" "}
            {scoped && <span className="scope-pill">assigned sites</span>}
          </h2>
        </div>
        <div className="ph-actions">
          <div className="seg glass-nav">
            <button
              className={!dense ? "on" : ""}
              onClick={() => setDense(false)}
            >
              Cards
            </button>
            <button
              className={dense ? "on" : ""}
              onClick={() => setDense(true)}
            >
              List
            </button>
          </div>
          {(role === "pmhead" || role === "owner") && (
            <button className="btn btn-primary btn-sm" onClick={onNew}>
              + New project
            </button>
          )}
        </div>
      </div>
      {dense ? (
        <div className="solid table-wrap">
          <table className="jtable">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th className="num">% complete</th>
                <th>Period</th>
                <th>Billing</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr
                  key={p.code}
                  onClick={() => onOpen(p)}
                  style={{ cursor: "pointer" }}
                >
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.client}</td>
                  <td className="num">{A_pct(p.pct)}%</td>
                  <td>{p.period}</td>
                  <td>
                    {p.billing === "—" ? (
                      "—"
                    ) : (
                      <span
                        className={
                          "chip chip-" +
                          (p.billing === "Paid"
                            ? "success"
                            : p.billing === "Partially Paid"
                              ? "pending"
                              : "info")
                        }
                      >
                        {p.billing}
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={
                        "chip chip-" +
                        (p.status === "Active"
                          ? "success"
                          : p.status === "On Hold"
                            ? "pending"
                            : "neutral")
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                  <td
                    className="mono"
                    style={{ fontSize: 11, color: "var(--jce-ink-2)" }}
                  >
                    {p.updated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="portfolio-grid">
          {list.map((p) => (
            <button
              key={p.code}
              className="glass proj-card"
              onClick={() => onOpen(p)}
            >
              <div className="proj-top">
                {p.so ? (
                  <span className="docchip sm">{p.so}</span>
                ) : (
                  <span className="chip chip-neutral">Cost center</span>
                )}
                <span
                  className={
                    "chip chip-" +
                    (p.status === "Active"
                      ? "success"
                      : p.status === "On Hold"
                        ? "pending"
                        : "neutral")
                  }
                >
                  {p.status}
                </span>
              </div>
              <div className="proj-name">{p.name}</div>
              <div className="proj-client">{p.client}</div>
              <div className="proj-ring-row">
                <div
                  className="ring"
                  style={{
                    background: `conic-gradient(var(--jce-green-600) ${p.pct * 3.6}deg, #EEF1EF 0)`,
                  }}
                >
                  <span>{A_pct(p.pct)}%</span>
                </div>
                <div className="proj-stats">
                  <div>
                    <span className="ps-k">This period</span>
                    <span className="ps-v">+{A_pct(p.gain)}%</span>
                  </div>
                  <div>
                    <span className="ps-k">Current</span>
                    <span className="ps-v">{p.period}</span>
                  </div>
                </div>
              </div>
              <div className="proj-next">→ {p.next}</div>
              <div className="proj-updated">
                updated {p.updated.slice(0, 10)} · {p.by}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// P3 · BOQ import wizard (FLAGSHIP)
// ---------------------------------------------------------------------------
const WIZ_STEPS = [
  "Upload",
  ".xlsx Sheet",
  "Confirm header",
  "Column mapping",
  "Row preview",
  "Commit",
];
function P3Wizard({ onBack, onCommit }) {
  const [step, setStep] = useState(0);
  const [mapOk, setMapOk] = useState(false);
  const next = () => setStep((s) => Math.min(5, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const blockCommit = step === 3 && !mapOk;

  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Portfolio
      </button>
      <div className="glass wiz-head">
        <div className="kicker">PMG · P3 · New project</div>
        <h2 className="ph-title">BOQ import wizard</h2>
        <div className="wiz-stepper">
          {WIZ_STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={
                  "wstep " + (i < step ? "done" : i === step ? "curr" : "todo")
                }
              >
                <span className="wdot">{i < step ? "✓" : i + 1}</span>
                <span className="wlabel">{s}</span>
              </div>
              {i < 5 && (
                <span className={"wline " + (i < step ? "done" : "")}></span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="solid wiz-body">
        {step === 0 && (
          <div className="wiz-upload">
            <div className="uploader" style={{ padding: 40 }}>
              <div className="u1">
                ⤓ Drop the PM head's BOQ spreadsheet (.xlsx)
              </div>
              <div className="u2">
                Never a silent auto-parse — you confirm every step before
                commit.
              </div>
            </div>
            <div className="wiz-file">
              <span>📄</span> NORECO2_BOQ_v3.xlsx · 84 KB{" "}
              <span
                className="chip chip-success"
                style={{ padding: "1px 7px" }}
              >
                ready
              </span>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="form-section-title">
              Select sheet{" "}
              <span className="muted">(default: first / largest)</span>
            </div>
            {["BOQ (used)", "Summary", "Notes"].map((s, i) => (
              <label key={s} className="radio-row">
                <input type="radio" name="sheet" defaultChecked={i === 0} /> {s}{" "}
                {i === 0 && (
                  <span
                    className="chip chip-info"
                    style={{ padding: "1px 7px" }}
                  >
                    325 rows
                  </span>
                )}
              </label>
            ))}
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="form-section-title">Confirm project header</div>
            <div className="form-grid">
              <L l="Project title" req>
                <input
                  className="field"
                  defaultValue="NORECO II — 13.2KV Distribution Line"
                />
              </L>
              <L l="Client / Cooperative" req>
                <input className="field" defaultValue="NORECO II" />
              </L>
              <L l="Location">
                <input className="field" defaultValue="Negros Oriental" />
              </L>
              <L l="SO / Contract No." req>
                <input className="field" defaultValue="26-05-378" />
              </L>
              <L l="Contract amount" computed>
                <div className="field is-computed">₱53,277,688.00</div>
              </L>
              <L l="Start date">
                <input
                  className="field"
                  type="date"
                  defaultValue="2026-03-15"
                />
              </L>
              <L l="Target date">
                <input
                  className="field"
                  type="date"
                  defaultValue="2026-12-20"
                />
              </L>
              <L l="DP recoupment %">
                <input className="field" defaultValue="15" />
              </L>
              <L l="Retention %">
                <input className="field" defaultValue="10" />
              </L>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="form-section-title">
              Column mapping{" "}
              <span className="muted">
                low-confidence mappings block commit until confirmed
              </span>
            </div>
            <div
              className="solid table-wrap"
              style={{ boxShadow: "none", border: "1px solid var(--jce-line)" }}
            >
              <table className="jtable">
                <thead>
                  <tr>
                    <th>Source column</th>
                    <th>→ System field</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["ITEM", "Item No.", "high"],
                    ["DESCRIPTION", "Description", "high"],
                    ["QTY.", "Quantity", "high"],
                    ["UNIT", "Unit", "high"],
                    ["UNIT PRICE", "Unit Price", "high"],
                    ["TOTAL", "Line Total", "low"],
                  ].map(([s, f, c], i) => (
                    <tr key={i}>
                      <td className="mono">{s}</td>
                      <td>
                        <select
                          className="cell-input"
                          defaultValue={f}
                          style={{ width: 140 }}
                        >
                          <option>{f}</option>
                          <option>(ignore)</option>
                        </select>
                      </td>
                      <td>
                        <span
                          className={
                            "chip chip-" +
                            (c === "high" ? "success" : "pending")
                          }
                        >
                          {c === "high" ? "high" : "low — confirm"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <label className="checkrow" style={{ marginTop: 12 }}>
              <input
                type="checkbox"
                checked={mapOk}
                onChange={(e) => setMapOk(e.target.checked)}
              />{" "}
              I've confirmed the low-confidence “TOTAL → Line Total” mapping
            </label>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="form-section-title">Row preview</div>
            <div className="wiz-summary">
              <div>
                <span className="ws-v">5</span>
                <span className="ws-k">lines</span>
              </div>
              <div>
                <span className="ws-v">3</span>
                <span className="ws-k">staged (P/D/I)</span>
              </div>
              <div>
                <span className="ws-v">₱53,277,688</span>
                <span className="ws-k">grand total</span>
              </div>
              <div>
                <span className="ws-v">PB1</span>
                <span className="ws-k">opening period</span>
              </div>
            </div>
            <div
              className="solid table-wrap"
              style={{ boxShadow: "none", border: "1px solid var(--jce-line)" }}
            >
              <table className="jtable">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th className="num">Amount</th>
                    <th className="num">Weight %</th>
                  </tr>
                </thead>
                <tbody>
                  {boqRows().map((r) => (
                    <tr key={r.key}>
                      <td className="mono">{r.no}</td>
                      <td>
                        {r.desc}
                        {r.stage && (
                          <span
                            className="stage-chip"
                            style={{ marginLeft: 6 }}
                          >
                            {r.stage}
                          </span>
                        )}
                      </td>
                      <td>{r.stage ? "Staged" : "Single"}</td>
                      <td className="num money">{A_pct(r.value)}</td>
                      <td className="num">
                        {A_pct((r.value / CONTRACT) * 100)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="wiz-anchor">
              Acceptance anchor — NORECO2 grand total reproduces{" "}
              <strong>₱53,277,688</strong> and per-line weights within rounding.
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="wiz-commit">
            <div className="commit-ic">
              <Icon name="check" size={32} color="var(--jce-green-700)" />
            </div>
            <div className="commit-t">Ready to commit</div>
            <div className="commit-d">
              Nothing has persisted until now. Committing creates the project,
              BOQ and opening period PB1.
            </div>
            <button className="btn btn-primary" onClick={onCommit}>
              Commit project
            </button>
          </div>
        )}
      </div>

      <div className="wiz-nav">
        <button className="btn btn-ghost" onClick={prev} disabled={step === 0}>
          ← Back
        </button>
        {step < 5 && (
          <button
            className="btn btn-primary"
            onClick={next}
            disabled={blockCommit}
          >
            {blockCommit ? "Confirm mapping to continue" : "Continue →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// P4 · clone / manual (light)
// ---------------------------------------------------------------------------
function P4ManualClone({ onBack }) {
  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Portfolio
      </button>
      <div className="page-head glass">
        <div>
          <div className="kicker">PMG · P4</div>
          <h2 className="ph-title">Clone &amp; manual builder</h2>
        </div>
      </div>
      <div className="chooser-grid">
        <div className="glass chooser-card">
          <div className="chooser-ic">
            <Icon name="pmg" size={22} color="var(--jce-green-700)" />
          </div>
          <div className="chooser-t">Clone existing project</div>
          <div className="chooser-d">
            Copy a BOQ structure → edit header / quantities / prices. The clone
            is independent of its source.
          </div>
          <div className="chooser-go">Pick source →</div>
        </div>
        <div className="glass chooser-card">
          <div className="chooser-ic">
            <Icon name="acc" size={22} color="var(--jce-green-700)" />
          </div>
          <div className="chooser-t">Manual builder</div>
          <div className="chooser-d">
            Header form → add category → add line. Staged lines need all three
            P/D/I amounts; weights recompute live, never typed.
          </div>
          <div className="chooser-go">Start blank →</div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// P6 · BOQ view/editor
// ---------------------------------------------------------------------------
function P6BOQ({ role }) {
  const canEdit = role === "pmhead" || role === "owner";
  return (
    <div className="screen wide">
      <div className="page-head glass" style={{ marginBottom: 12 }}>
        <div>
          <div className="kicker">PMG · P6</div>
          <h2 className="ph-title">Bill of Quantities</h2>
        </div>
        <div className="ph-actions">
          <span className="chip chip-success">Σ weights = 100.00%</span>
          {!canEdit && (
            <span className="ro-note">
              <Icon name="lock" size={13} /> read · changes go through VO (P7)
            </span>
          )}
        </div>
      </div>
      <div className="solid table-wrap grid-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th className="num">Qty</th>
              <th>Unit</th>
              <th className="num">Unit Price</th>
              <th className="num">Line Total</th>
              <th className="num">Weight %</th>
            </tr>
          </thead>
          <tbody>
            {BOQ.map((c) => (
              <React.Fragment key={c.cat}>
                <tr className="band-row">
                  <td colSpan="7">{c.cat}</td>
                </tr>
                {c.lines.map((l) => {
                  const total = l.staged
                    ? l.stages.reduce((a, s) => a + s[1], 0)
                    : l.value;
                  return (
                    <React.Fragment key={l.no}>
                      <tr>
                        <td className="mono" style={{ fontWeight: 600 }}>
                          {l.no}
                        </td>
                        <td>{l.desc}</td>
                        <td className="num">{l.qty}</td>
                        <td>{l.unit}</td>
                        <td className="num money">{A_pct(total / l.qty)}</td>
                        <td className="num money" style={{ fontWeight: 600 }}>
                          {A_pct(total)}
                        </td>
                        <td className="num computed">
                          {A_pct((total / CONTRACT) * 100)}
                        </td>
                      </tr>
                      {l.staged &&
                        l.stages.map(([st, v]) => (
                          <tr key={st} className="stage-sub">
                            <td></td>
                            <td className="stage-indent">
                              <span className="stage-chip">{st}</span>
                            </td>
                            <td colSpan="3"></td>
                            <td className="num money">{A_pct(v)}</td>
                            <td className="num computed">
                              {A_pct((v / CONTRACT) * 100)}
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr className="grid-tot">
              <td colSpan="5">Grand total · Σ weights</td>
              <td className="num money">{A_pct(CONTRACT)}</td>
              <td className="num">100.00</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Editing any amount recomputes line weight, stage weights, grand total
        atomically. Weights stored high-precision, never typed.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// P5 · header  ·  P7 · VO  ·  P9 · billing  ·  P10/P11 · MR  ·  P12 · timeline  ·  P13 · audit
// ---------------------------------------------------------------------------
function P5Header({ project }) {
  return (
    <div className="screen">
      <div className="glass rec-header">
        <div className="rec-av">
          <Icon name="pmg" size={22} color="#fff" />
        </div>
        <div className="rec-id">
          <div className="rec-name">{project.name}</div>
          <div className="rec-meta">
            <span className="docchip">{project.code}</span> · {project.type}{" "}
            {project.so && (
              <>
                · <span className="docchip sm">{project.so}</span>
              </>
            )}
          </div>
          <div className="rec-meta2">
            <span
              className={
                "chip chip-" +
                (project.status === "Active" ? "success" : "pending")
              }
            >
              {project.status}
            </span>
          </div>
        </div>
      </div>
      <div className="contract-strip solid">
        <div>
          <span className="ctx-k">Original contract value</span>
          <span className="ctx-v">₱{A_pct(project.origContract)}</span>
        </div>
        <div>
          <span className="ctx-k">Approved variations to date</span>
          <span className="ctx-v">
            {project.variations ? "₱" + A_pct(project.variations) : "—"}
          </span>
        </div>
        <div>
          <span className="ctx-k">Revised contract value</span>
          <span
            className="ctx-v"
            style={{ color: "var(--jce-green-900)", fontWeight: 700 }}
          >
            ₱{A_pct(project.contract)}
          </span>
        </div>
      </div>
      <div className="solid rec-panel">
        <div className="rec-grid">
          <Field label="Client / Cooperative" value={project.client} />
          <Field label="Location" value="Negros Oriental" />
          <Field label="Sales Order" value={project.so || "— (cost center)"} />
          <Field
            label="Contract amount"
            value={"₱" + A_pct(project.contract)}
          />
          <Field label="Start date" value={project.start} />
          <Field label="Target date" value={project.target} />
          <Field label="DP recoupment %" value={project.dp + "%"} />
          <Field label="Retention %" value={project.ret + "%"} />
        </div>
      </div>
    </div>
  );
}

function P7VO({ role }) {
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">PMG · P7</div>
          <h2 className="ph-title">Variation orders</h2>
        </div>
        {(role === "pmhead" || role === "owner") && (
          <div className="ph-actions">
            <button className="btn btn-primary btn-sm">+ New VO</button>
          </div>
        )}
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>VO No.</th>
              <th>Date</th>
              <th>Description</th>
              <th className="num">Grand-total impact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="docchip">VO-26-04-355-02</span>
              </td>
              <td className="mono" style={{ fontSize: 12 }}>
                2026-05-30
              </td>
              <td>Added transformer protection scheme</td>
              <td
                className="num money"
                style={{ color: "var(--jce-green-700)" }}
              >
                +2,400,000.00
              </td>
              <td>
                <span className="chip chip-success">Approved</span>
              </td>
            </tr>
            <tr>
              <td>
                <span className="docchip">VO-26-04-355-01</span>
              </td>
              <td className="mono" style={{ fontSize: 12 }}>
                2026-04-12
              </td>
              <td>Revised pole quantity</td>
              <td className="num money">+0.00</td>
              <td>
                <span className="chip chip-success">Approved</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Policy (A) prospective: locked periods keep their billed pesos;
        variation applies from the next open period against the revised contract
        value. Pre-change BOQ snapshot retained.
      </div>
    </div>
  );
}

function P9Billing() {
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">PMG · P9</div>
          <h2 className="ph-title">Progress billing &amp; ledgers</h2>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Period</th>
              <th>As of</th>
              <th className="num">% gain</th>
              <th className="num">PB amount</th>
              <th className="num">Recoupment</th>
              <th className="num">Retention</th>
              <th className="num">Net Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {BILLING_HISTORY.map((b, i) => (
              <tr key={i}>
                <td>
                  <span className="docchip">{b.pb}</span>
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {b.asof}
                </td>
                <td className="num">{A_pct(b.gain)}%</td>
                <td className="num money">{A_pct(b.amount)}</td>
                <td className="num money">({A_pct(b.recoup)})</td>
                <td className="num money">({A_pct(b.retention)})</td>
                <td className="num money" style={{ fontWeight: 700 }}>
                  {A_pct(b.net)}
                </td>
                <td>
                  <span className="chip chip-info">{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pay-cols" style={{ marginTop: 16 }}>
        <div className="solid charge-card">
          <div className="card-title">Recoupment ledger</div>
          <table className="jtable">
            <tbody>
              <tr>
                <td>Downpayment ({DP_PCT}% × contract)</td>
                <td className="num money">{A_pct(DP_AMOUNT)}</td>
              </tr>
              <tr>
                <td>PB1 recoupment</td>
                <td className="num money">({A_pct(905883.24)})</td>
              </tr>
              <tr style={{ fontWeight: 700 }}>
                <td>Downpayment remaining</td>
                <td className="num money">{A_pct(DP_AMOUNT - 905883.24)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="solid charge-card">
          <div className="card-title">Retention ledger</div>
          <table className="jtable">
            <tbody>
              <tr>
                <td>PB1 retention added</td>
                <td className="num money">{A_pct(603922.16)}</td>
              </tr>
              <tr>
                <td>Release events</td>
                <td className="num">—</td>
              </tr>
              <tr style={{ fontWeight: 700 }}>
                <td>Outstanding retention payable</td>
                <td className="num money">{A_pct(603922.16)}</td>
              </tr>
            </tbody>
          </table>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }}>
            Trigger retention release
          </button>
        </div>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        A release is its own billing line, never a negative deduction (PM Head,
        audited).
      </div>
    </div>
  );
}

function P10MR({ mr, onBack }) {
  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← MR register
      </button>
      <div className="page-head glass">
        <div>
          <div className="kicker">PMG · P10 · JCE-F-WMS02</div>
          <h2 className="ph-title">
            Material Request <span className="docchip">{mr.no}</span>
          </h2>
        </div>
        <div className="ph-actions">
          <span
            className={
              "chip chip-" +
              (mr.status === "Approved"
                ? "success"
                : mr.status === "Fulfilled"
                  ? "success"
                  : "pending")
            }
          >
            {mr.status}
          </span>
          <span
            className={
              "chip chip-" +
              (mr.verified === "Verified" ? "success" : "pending")
            }
          >
            WH: {mr.verified}
          </span>
        </div>
      </div>
      <div className="solid form-body">
        <div className="form-grid">
          <L l="Date">
            <div className="field is-computed">{mr.date}</div>
          </L>
          <L l="MR No. (global running)">
            <div className="field is-computed">{mr.no}</div>
          </L>
          <L l="Name of Project">
            <div className="field is-computed">{mr.project}</div>
          </L>
          <L l="SO No.">
            <div className="field is-computed">{mr.so}</div>
          </L>
        </div>
        <div className="form-section-title">
          Lines{" "}
          <span className="muted">
            inventory-first — only the unfulfillable remainder goes to
            Purchasing
          </span>
        </div>
        <div
          className="solid table-wrap"
          style={{ boxShadow: "none", border: "1px solid var(--jce-line)" }}
        >
          <table className="jtable">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Purpose</th>
                <th className="num grp-e">Requested</th>
                <th className="num grp-e">Available Stock</th>
                <th className="num grp-d">For Purchase</th>
                <th>Canvass</th>
              </tr>
            </thead>
            <tbody>
              {MR_LINES.map((l) => (
                <tr key={l.no}>
                  <td>{l.no}</td>
                  <td>{l.desc}</td>
                  <td style={{ color: "var(--jce-ink-2)" }}>{l.purpose}</td>
                  <td className="num grp-e">
                    {l.reqQty} {l.reqUnit}
                  </td>
                  <td className="num grp-e computed">
                    {l.availQty} {l.reqUnit}
                  </td>
                  <td
                    className="num grp-d"
                    style={{
                      fontWeight: 600,
                      color:
                        l.forQty > 0
                          ? "var(--jce-orange-600)"
                          : "var(--jce-ink-2)",
                    }}
                  >
                    {l.forQty} {l.forUnit}
                  </td>
                  <td>
                    {l.forQty > 0 ? (
                      <span
                        className="chip chip-pending"
                        style={{ padding: "1px 7px" }}
                      >
                        A·B·C
                      </span>
                    ) : (
                      <span className="muted">in stock</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="signer-zone">
          <div className="signer-head">
            Signatories{" "}
            <span className="print-only-tag">JCE-F-WMS02 · print-only</span>
          </div>
          <div
            className="signer-grid"
            style={{ gridTemplateColumns: "repeat(5,1fr)" }}
          >
            {[
              "Requested by",
              "Noted by",
              "Received by (Purchasing)",
              "Approved by (Dept Head)",
              "Verified by Warehouse",
            ].map((s, i) => (
              <div key={i} className="signer">
                <div className="sig-line"></div>
                <div className="sig-role">{s}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="autorow-note solid" style={{ marginTop: 16 }}>
          <Icon name="check" size={15} color="var(--st-success)" />
          <span>
            On approval: in-stock quantities reserved (StockReservation);
            For-Purchase lines flow to Purchasing with canvass quotes;
            fully-stocked lines produce zero For-Purchase and no hand-off.
          </span>
        </div>
      </div>
    </div>
  );
}

function P11MRRegister({ onOpen }) {
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">PMG · P11</div>
          <h2 className="ph-title">Material Request register</h2>
        </div>
        <div className="ph-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onOpen(MRS[0])}
          >
            + New MR
          </button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>MR No.</th>
              <th>Date</th>
              <th>Project</th>
              <th>SO No.</th>
              <th className="num">Lines</th>
              <th>Reserved / For-Purchase</th>
              <th>Status</th>
              <th>WH verified</th>
            </tr>
          </thead>
          <tbody>
            {MRS.map((m) => (
              <tr
                key={m.no}
                onClick={() => onOpen(m)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span className="docchip">{m.no}</span>
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {m.date}
                </td>
                <td>{m.project}</td>
                <td>
                  <span className="docchip sm">{m.so}</span>
                </td>
                <td className="num">{m.lines}</td>
                <td>
                  <span
                    className="chip chip-success"
                    style={{ padding: "1px 7px" }}
                  >
                    {m.reserved} res
                  </span>{" "}
                  {m.forPurchase > 0 && (
                    <span
                      className="chip chip-pending"
                      style={{ padding: "1px 7px" }}
                    >
                      {m.forPurchase} buy
                    </span>
                  )}
                </td>
                <td>
                  <span
                    className={
                      "chip chip-" +
                      (m.status === "Approved" || m.status === "Fulfilled"
                        ? "success"
                        : "pending")
                    }
                  >
                    {m.status}
                  </span>
                </td>
                <td>
                  <span
                    className={
                      "chip chip-" +
                      (m.verified === "Verified" ? "success" : "pending")
                    }
                  >
                    {m.verified}
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

function P12Timeline() {
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">PMG · P12</div>
          <h2 className="ph-title">Activity timeline</h2>
        </div>
      </div>
      <div className="glass home-panel">
        <div className="solid" style={{ padding: 16 }}>
          <div className="timeline">
            {PMG_TIMELINE.map((t, i) => (
              <div key={i} className="tl">
                <div className="trail">
                  <div
                    className="tdot"
                    style={{
                      background:
                        t.type === "po"
                          ? "var(--jce-orange-500)"
                          : t.type === "stock"
                            ? "var(--st-info)"
                            : "var(--jce-green-600)",
                    }}
                  ></div>
                  {i < PMG_TIMELINE.length - 1 && <div className="tline"></div>}
                </div>
                <div className="tc">
                  <div className="ev">{t.txt}</div>
                  <div className="tm">
                    {t.actor} · {t.ts} ·{" "}
                    <span className="docchip sm">{t.link}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function P13Audit() {
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">PMG · P13</div>
          <h2 className="ph-title">PMG audit log</h2>
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
              <th>Before → After (snapshot)</th>
            </tr>
          </thead>
          <tbody>
            {PMG_AUDIT.map((a, i) => (
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
  P1Dashboard,
  P2Portfolio,
  P3Wizard,
  P4ManualClone,
  P5Header,
  P6BOQ,
  P7VO,
  P9Billing,
  P10MR,
  P11MRRegister,
  P12Timeline,
  P13Audit,
  A_pct,
});
