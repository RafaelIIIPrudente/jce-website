// ============================================================================
// JCE SYSTEM — HR · H5 timekeeping weekly grid · H6 verification batches
// ============================================================================

const projLabel = (so) => {
  const p = PROJECTS.find((x) => x.so === so);
  return p ? p.so : so;
};

// ---------------------------------------------------------------------------
// H5 · Weekly entry grid  (dense, keyboard-first — mirrors the spreadsheet)
// ---------------------------------------------------------------------------
function H5Grid({ role }) {
  const [empId, setEmpId] = useState(9); // Noel Bautista
  const [locked, setLocked] = useState(false);
  const emp = EMPLOYEES.find((e) => e.id === empId);
  const canEdit = (role === "timekeeper" || role === "owner") && !locked;
  const sums = TIME_ROWS.reduce(
    (a, r) => ({
      reg: a.reg + r.reg,
      ot: a.ot + r.ot,
      nd: a.nd + r.nd,
      abs: a.abs + r.abs,
    }),
    { reg: 0, ot: 0, nd: 0, abs: 0 },
  );

  return (
    <div className="screen wide">
      {/* context bar */}
      <div className="page-head glass">
        <div>
          <div className="kicker">HR · H5 · Timekeeping</div>
          <h2 className="ph-title">Weekly entry grid</h2>
        </div>
        <div className="ph-actions">
          <div className="ctx-field">
            <label>Employee</label>
            <select
              className="field"
              value={empId}
              onChange={(e) => setEmpId(Number(e.target.value))}
            >
              {EMPLOYEES.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.no} · {e.name}
                </option>
              ))}
            </select>
          </div>
          <div className="ctx-field">
            <label>Week</label>
            <select className="field">
              <option>May 25 – 31, 2026 (Sun–Sat)</option>
              <option>Jun 1 – 7, 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* auto-fill context strip */}
      <div className="ctx-strip solid">
        <div>
          <span className="ctx-k">Employee Name</span>
          <span className="ctx-v">{emp.name}</span>
        </div>
        <div>
          <span className="ctx-k">Position</span>
          <span className="ctx-v">{emp.pos}</span>
        </div>
        <div>
          <span className="ctx-k">Place of Assignment</span>
          <span className="ctx-v">{emp.assign}</span>
        </div>
        <div>
          <span className="ctx-k">Pay Period</span>
          <span className="ctx-v">Daily 21–05</span>
        </div>
      </div>

      {locked ? (
        <div className="lockbar">
          <Icon name="lock" size={16} />
          <div>
            <div className="lt">Locked — batch verified</div>
            <div className="ld">
              Rows are read-only. Re-open from H6 (Timekeeper, with reason) to
              edit.
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginLeft: "auto" }}
            onClick={() => setLocked(false)}
          >
            Preview: unlock
          </button>
        </div>
      ) : (
        <div className="lockbar draft">
          <span style={{ fontSize: 15 }}>○</span>
          <div>
            <div className="lt">Open</div>
            <div className="ld">Editable by Timekeeper · recompute on save</div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginLeft: "auto" }}
            onClick={() => setLocked(true)}
          >
            Preview: locked state
          </button>
        </div>
      )}

      {/* the grid */}
      <div className="solid table-wrap grid-wrap">
        <table className="jtable timegrid">
          <thead>
            <tr>
              <th rowSpan="2" className="frz">
                Date
              </th>
              <th rowSpan="2">Day Type</th>
              <th rowSpan="2">Working Project</th>
              <th rowSpan="2" className="num">
                Time In
              </th>
              <th rowSpan="2" className="num">
                Time Out
              </th>
              <th colSpan="4" className="grp-head">
                Manhours Distribution{" "}
                <span className="computed-tag">computed</span>
              </th>
              <th rowSpan="2">Leave Status</th>
              <th rowSpan="2">Remarks</th>
            </tr>
            <tr>
              <th className="num sub">Regular</th>
              <th className="num sub">OT</th>
              <th className="num sub">Night Diff</th>
              <th className="num sub">Abs/UT</th>
            </tr>
          </thead>
          <tbody>
            {TIME_ROWS.map((r, i) => {
              const isAuto = r.autoLeave;
              const prevSameDate = i > 0 && TIME_ROWS[i - 1].date === r.date;
              return (
                <tr
                  key={r.id}
                  className={
                    (isAuto ? "row-auto" : "") + (r.multi ? " row-multi" : "")
                  }
                >
                  <td className="frz">
                    {!prevSameDate ? (
                      <span>
                        <strong>{r.day}</strong>{" "}
                        <span className="dnum">{r.date.slice(8)}</span>
                      </span>
                    ) : (
                      <span className="cont">↳ same day</span>
                    )}
                  </td>
                  <td>
                    {isAuto ? (
                      <span className="muted">{r.dayType}</span>
                    ) : (
                      <span className={canEdit ? "cell-edit" : ""}>
                        {r.dayType}
                      </span>
                    )}
                  </td>
                  <td>
                    {r.proj === "—" ? (
                      <span className="muted">—</span>
                    ) : (
                      <span className="docchip sm">{projLabel(r.proj)}</span>
                    )}
                    {r.multi && <span className="split-tag">½ split</span>}
                  </td>
                  <td className="num">
                    {r.in === "—" ? (
                      <span className="muted">—</span>
                    ) : (
                      <span className={canEdit && !isAuto ? "cell-edit" : ""}>
                        {r.in}
                      </span>
                    )}
                  </td>
                  <td className="num">
                    {r.out === "—" ? (
                      <span className="muted">—</span>
                    ) : (
                      <span className={canEdit && !isAuto ? "cell-edit" : ""}>
                        {r.out}
                      </span>
                    )}
                  </td>
                  <td className="num">
                    <span className="computed">{r.reg.toFixed(1)}</span>
                  </td>
                  <td className="num">
                    <span className="computed">{r.ot.toFixed(1)}</span>
                  </td>
                  <td className="num">
                    <span className="computed">{r.nd.toFixed(1)}</span>
                  </td>
                  <td className="num">
                    {r.abs ? (
                      <span className="computed neg">{r.abs.toFixed(1)}</span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>
                    {r.leave ? (
                      <span className="chip chip-success">
                        {r.leave}{" "}
                        <span className="docchip sm">{r.leaveRef}</span>
                      </span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td className="rmk">
                    {isAuto && <span className="lockmini">🔒</span>}
                    {r.remarks}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="grid-tot">
              <td colSpan="5">Week totals</td>
              <td className="num">{sums.reg.toFixed(1)}</td>
              <td className="num">{sums.ot.toFixed(1)}</td>
              <td className="num">{sums.nd.toFixed(1)}</td>
              <td className="num">{sums.abs.toFixed(1)}</td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {canEdit && (
        <div className="grid-actions">
          <button className="btn btn-ghost btn-sm">+ Add row</button>
          <button className="btn btn-ghost btn-sm">
            + Add project row (same date)
          </button>
          <button
            className="btn btn-primary btn-sm"
            style={{ marginLeft: "auto" }}
          >
            Recompute &amp; save
          </button>
        </div>
      )}

      <div className="rules-card glass">
        <div className="rules-title">Computation rules the grid honors</div>
        <ul className="rules-list">
          <li>
            Breaks deducted only when fully spanned — lunch 12–1 PM, OT meal
            10–11 PM, night meal 2–3 AM.
          </li>
          <li>
            <strong>Regular</strong> = min(net, 8) · <strong>OT</strong> =
            excess over 8 · <strong>Night Diff</strong> = 11 PM–6 AM overlap
            (separate, may overlap OT).
          </li>
          <li>
            Multi-project days share one Time In/Out and split the distribution{" "}
            <strong>evenly across project rows</strong> (fractional allowed,
            e.g. 1.5).
          </li>
          <li>
            Rows auto-created from approved leave (RFL/LOA) are{" "}
            <span className="lockmini">🔒</span> marked and read-only here.
          </li>
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// H6 · Verification batches
// ---------------------------------------------------------------------------
const BATCH_TONE = {
  Open: "neutral",
  Verified: "success",
  "Re-opened": "pending",
};

function H6Batches({ role }) {
  const [sel, setSel] = useState(null);
  const [reopen, setReopen] = useState(false);
  const canVerify = role === "timekeeper" || role === "owner";

  if (sel) {
    const b = sel;
    const verified = b.status === "Verified";
    return (
      <div className="screen wide">
        <button className="back-link" onClick={() => setSel(null)}>
          ← Verification batches
        </button>
        <div className="page-head glass">
          <div>
            <div className="kicker">HR · H6 · Batch detail</div>
            <h2 className="ph-title">
              {b.emp} <span className="docchip">{b.no}</span>
            </h2>
          </div>
          <div className="ph-actions">
            <span className={"chip chip-" + BATCH_TONE[b.status]}>
              {b.status === "Verified" ? "Verified · Locked" : b.status}
            </span>
            {canVerify && !verified && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSel({
                    ...b,
                    status: "Verified",
                    verifier: "R. Timekeeper",
                    at: "2026-06-03 10:15",
                  });
                }}
              >
                Mark as Verified
              </button>
            )}
            {canVerify && verified && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setReopen(true)}
              >
                Re-open…
              </button>
            )}
          </div>
        </div>

        <div className="ctx-strip solid">
          <div>
            <span className="ctx-k">Pay Period Type</span>
            <span className="ctx-v">{b.period}</span>
          </div>
          <div>
            <span className="ctx-k">Range</span>
            <span className="ctx-v">{b.range}</span>
          </div>
          <div>
            <span className="ctx-k">Rows</span>
            <span className="ctx-v">{b.rows}</span>
          </div>
          <div>
            <span className="ctx-k">Verifier</span>
            <span className="ctx-v">
              {b.verifier} {b.at !== "—" && "· " + b.at}
            </span>
          </div>
        </div>

        {verified ? (
          <div className="lockbar">
            <Icon name="lock" size={16} />
            <div>
              <div className="lt">Verified &amp; locked</div>
              <div className="ld">
                Read-through only. Re-open (with reason) to correct — audited.
              </div>
            </div>
          </div>
        ) : (
          <div className="lockbar check">
            <span style={{ fontSize: 15 }}>◔</span>
            <div>
              <div className="lt">Open — edit-in-place before verification</div>
              <div className="ld">
                Correct rows, then Mark as Verified to lock and hand off to
                payroll.
              </div>
            </div>
          </div>
        )}

        <div className="solid table-wrap grid-wrap">
          <table className="jtable timegrid">
            <thead>
              <tr>
                <th className="frz">Date</th>
                <th>Day Type</th>
                <th>Project</th>
                <th className="num">In</th>
                <th className="num">Out</th>
                <th className="num">Reg</th>
                <th className="num">OT</th>
                <th className="num">ND</th>
                <th className="num">Abs/UT</th>
                <th>Leave</th>
              </tr>
            </thead>
            <tbody>
              {TIME_ROWS.map((r) => (
                <tr key={r.id} className={r.autoLeave ? "row-auto" : ""}>
                  <td className="frz">
                    <strong>{r.day}</strong> {r.date.slice(8)}
                  </td>
                  <td>{r.dayType}</td>
                  <td>
                    {r.proj === "—" ? (
                      <span className="muted">—</span>
                    ) : (
                      <span className="docchip sm">{projLabel(r.proj)}</span>
                    )}
                  </td>
                  <td className="num">{r.in}</td>
                  <td className="num">{r.out}</td>
                  <td className="num">{r.reg.toFixed(1)}</td>
                  <td className="num">{r.ot.toFixed(1)}</td>
                  <td className="num">{r.nd.toFixed(1)}</td>
                  <td className="num">{r.abs ? r.abs.toFixed(1) : "—"}</td>
                  <td>
                    {r.leave ? (
                      <span className="chip chip-success">{r.leave}</span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reopen && (
          <div className="jce-scrim center">
            <div className="glass-modal idle-modal">
              <h3>Re-open verified batch?</h3>
              <p>
                Re-opening requires a reason and is recorded in the HR audit log
                (H14). Downstream payroll must re-consume the corrected batch.
              </p>
              <label className="lbl" style={{ marginTop: 8 }}>
                Reason (required)
              </label>
              <input
                className="field"
                placeholder="e.g. corrected OT on May 27"
                autoFocus
              />
              <div className="idle-acts">
                <button
                  className="btn btn-ghost"
                  onClick={() => setReopen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSel({ ...b, status: "Re-opened" });
                    setReopen(false);
                  }}
                >
                  Re-open &amp; audit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">HR · H6 · Timekeeping</div>
          <h2 className="ph-title">Verification batches</h2>
        </div>
        <div className="ph-actions">
          <span className="muted-note">
            End-of-period review → correct → verify → lock → hand off to payroll
          </span>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Pay Period Type</th>
              <th>Period range</th>
              <th className="num">Rows</th>
              <th>Status</th>
              <th>Verifier</th>
              <th>Verified at</th>
            </tr>
          </thead>
          <tbody>
            {BATCHES.map((b) => (
              <tr
                key={b.id}
                onClick={() => setSel(b)}
                style={{ cursor: "pointer" }}
              >
                <td style={{ fontWeight: 600 }}>
                  {b.emp}
                  <div className="mono sub-no">{b.no}</div>
                </td>
                <td>{b.period}</td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {b.range}
                </td>
                <td className="num">{b.rows}</td>
                <td>
                  <span className={"chip chip-" + BATCH_TONE[b.status]}>
                    {b.status === "Verified" ? "Verified · Locked" : b.status}
                  </span>
                </td>
                <td>{b.verifier}</td>
                <td
                  className="mono"
                  style={{ fontSize: 11, color: "var(--jce-ink-2)" }}
                >
                  {b.at}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { H5Grid, H6Batches });
