// ============================================================================
// JCE SYSTEM — HR · H1 grouped list · H2 record · H3 add/edit · H4 archived
// ============================================================================

function EmpStatus({ s }) {
  return (
    <span className={"chip chip-" + (STATUS_TONE[s] || "neutral")}>{s}</span>
  );
}

function ExpiryFlag({ emp }) {
  if (!expiringFlag(emp)) return null;
  const m = monthsLeft(emp.contractEnd);
  return (
    <span
      className="chip chip-pending"
      title={"Contract ends " + emp.contractEnd}
    >
      ⚠ {m}mo left
    </span>
  );
}

// masked value — sensitive comp fields
function Comp({ role, children, prefix }) {
  if (CAN_SEE_COMP(role))
    return (
      <span className="tnum">
        {prefix || ""}
        {children}
      </span>
    );
  return (
    <span
      className="masked"
      title="Restricted — visible to Payroll Officer & Owner only"
    >
      ••••••
    </span>
  );
}

// ---------------------------------------------------------------------------
// H1 · Grouped employee list
// ---------------------------------------------------------------------------
function H1List({ role, onOpen, onAdd, onArchived }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const canEdit = role === "hrhead" || role === "owner";

  const match = (e) =>
    (q === "" ||
      (e.name + e.no + e.bio + e.pos + e.assign)
        .toLowerCase()
        .includes(q.toLowerCase())) &&
    (status === "All" || e.status === status) &&
    (type === "All" || e.type === type);

  const groups = ["Daily", "Weekly", "Monthly"];
  const filtered = EMPLOYEES.filter(match);

  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">HR · H1 · Employee Management</div>
          <h2 className="ph-title">Employees</h2>
        </div>
        <div className="ph-actions">
          <div className="top-search" style={{ maxWidth: 240 }}>
            <Icon name="search" size={15} />
            <input
              placeholder="Search name, BIO, position…"
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
            {["All", "Regular", "Probationary", "On Leave", "Suspended"].map(
              (s) => (
                <option key={s}>{s}</option>
              ),
            )}
          </select>
          <select
            className="field"
            style={{ width: "auto" }}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {["All", "Regular", "Contractual"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button className="btn btn-ghost btn-sm" onClick={onArchived}>
            Archived
          </button>
          {canEdit && (
            <button className="btn btn-primary btn-sm" onClick={onAdd}>
              + Add employee
            </button>
          )}
        </div>
      </div>

      {q && (
        <div className="search-note">
          Search ignores grouping — results show their section tag.
        </div>
      )}

      {groups.map((g) => {
        const rows = filtered.filter((e) => e.cat === g);
        if (rows.length === 0) return null;
        return (
          <div key={g} className="emp-group">
            <div className="group-band glass">
              <span className="group-title">{g}</span>
              <span className="group-sub">
                Salary Rate Category · {rows.length}{" "}
                {rows.length === 1 ? "employee" : "employees"}
              </span>
            </div>
            <div className="solid table-wrap">
              <table className="jtable">
                <thead>
                  <tr>
                    <th style={{ width: 44 }}>S/N</th>
                    <th>Name of Employee</th>
                    <th>BIO Nos</th>
                    <th>Position</th>
                    <th>Place of Assignment</th>
                    <th>Status</th>
                    <th>Date Hired</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((e) => (
                    <tr
                      key={e.id}
                      onClick={() => onOpen(e)}
                      style={{ cursor: "pointer" }}
                    >
                      <td
                        className="tnum"
                        style={{ color: "var(--jce-ink-2)" }}
                      >
                        {e.sn}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {e.name}
                        {q && <span className="sec-tag">{g}</span>}
                      </td>
                      <td className="mono" style={{ fontSize: 12 }}>
                        {e.bio}
                      </td>
                      <td>{e.pos}</td>
                      <td style={{ color: "var(--jce-ink-2)" }}>{e.assign}</td>
                      <td>
                        <EmpStatus s={e.status} />
                      </td>
                      <td className="mono" style={{ fontSize: 12 }}>
                        {e.hired}
                      </td>
                      <td>
                        <ExpiryFlag emp={e} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
      {filtered.length === 0 && (
        <div className="solid" style={{ padding: 48 }}>
          <div className="empty">
            <div className="ill">⌕</div>
            <div className="et">No employees match</div>
            <div className="ed">Adjust your search or filters.</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// H2 · Employee record — detail
// ---------------------------------------------------------------------------
const H2_TABS = [
  "Identification",
  "Compensation",
  "Government IDs",
  "Personal",
  "Emergency",
  "Other",
  "History",
];

function Field({ label, value, sensitive, computed }) {
  return (
    <div className="rec-field">
      <div className="rec-label">
        {label} {sensitive && <span className="sens-badge">sensitive</span>}{" "}
        {computed && <span className="comp-badge">computed</span>}
      </div>
      <div className={"rec-value" + (computed ? " is-computed" : "")}>
        {value}
      </div>
    </div>
  );
}

function H2Record({ role, emp, onBack, onEdit }) {
  const [tab, setTab] = useState("Identification");
  const canEdit = role === "hrhead" || role === "owner";
  const yos =
    (new Date("2026-06-03") - new Date(emp.hired)) /
    (1000 * 60 * 60 * 24 * 365.25);
  const age = Math.floor(
    (new Date("2026-06-03") - new Date(emp.birthday)) /
      (1000 * 60 * 60 * 24 * 365.25),
  );
  const c = emp.comp;
  const totalMonthly =
    CAN_SEE_COMP(role) && c.cat === "Monthly"
      ? Number(c.monthly) + Number(c.allowance) + Number(c.project)
      : null;

  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Employees
      </button>

      {expiringFlag(emp) && (
        <div className="solid contract-banner">
          <Icon name="bell" size={16} color="var(--st-pending-ink)" /> Contract
          expires <strong>{emp.contractEnd}</strong> —{" "}
          {monthsLeft(emp.contractEnd)} months remaining.{" "}
          <span className="oq">flag &lt; 6 months</span>
        </div>
      )}

      <div className="glass rec-header">
        <div className="rec-av">
          {emp.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="rec-id">
          <div className="rec-name">{emp.name}</div>
          <div className="rec-meta">
            {emp.pos} · <span className="docchip">{emp.no}</span> · BIO{" "}
            {emp.bio}
          </div>
          <div className="rec-meta2">
            <EmpStatus s={emp.status} /> <span className="rec-sep">·</span>{" "}
            {yos.toFixed(1)} yrs of service <span className="rec-sep">·</span>{" "}
            {emp.type}
          </div>
        </div>
        {canEdit && (
          <button className="btn btn-primary btn-sm" onClick={onEdit}>
            Edit
          </button>
        )}
        {canEdit && <button className="btn btn-ghost btn-sm">Archive</button>}
      </div>

      <div className="tabbar glass-nav rec-tabs">
        {H2_TABS.map((t) => (
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
        {tab === "Identification" && (
          <div className="rec-grid">
            <Field label="S/N" value={emp.sn} />
            <Field label="Name of Employee" value={emp.name} />
            <Field label="BIO Nos" value={emp.bio} />
            <Field label="Place of Assignment" value={emp.assign} />
            <Field label="Position" value={emp.pos} />
            <Field label="Date Hired" value={emp.hired} />
            <Field
              label="Years of Service"
              value={yos.toFixed(1) + " yrs"}
              computed
            />
            <Field label="Status" value={<EmpStatus s={emp.status} />} />
          </div>
        )}
        {tab === "Compensation" && (
          <React.Fragment>
            {!CAN_SEE_COMP(role) && (
              <div className="mask-banner">
                <Icon name="lock" size={15} color="var(--jce-ink-2)" />{" "}
                Compensation is restricted to{" "}
                <strong>Payroll Officer &amp; Owner</strong>. You are viewing as{" "}
                <strong>{ROLES[role].short}</strong>.
              </div>
            )}
            <div className="rec-grid">
              <Field label="Salary Rate Category" value={c.cat} />
              <Field
                label="Daily Rate (Basic)"
                sensitive
                value={
                  <Comp role={role} prefix="₱">
                    {c.daily === "—"
                      ? "—"
                      : Number(c.daily).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                  </Comp>
                }
              />
              <Field
                label="Equivalent Monthly Rate"
                sensitive
                value={
                  <Comp role={role} prefix="₱">
                    {c.monthly === "—"
                      ? "—"
                      : Number(c.monthly).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                  </Comp>
                }
              />
              <Field
                label="Monthly Allowance"
                sensitive
                value={
                  <Comp role={role} prefix="₱">
                    {Number(c.allowance).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </Comp>
                }
              />
              <Field
                label="Duty Meal Allowance"
                sensitive
                value={
                  <Comp role={role} prefix="₱">
                    {Number(c.dutyMeal).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </Comp>
                }
              />
              <Field
                label="Project Allowance"
                sensitive
                value={
                  <Comp role={role} prefix="₱">
                    {Number(c.project).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </Comp>
                }
              />
              <Field
                label="Total Monthly Compensation"
                computed
                sensitive
                value={
                  totalMonthly != null ? (
                    <span className="is-computed tnum">
                      ₱
                      {totalMonthly.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  ) : CAN_SEE_COMP(role) ? (
                    "—"
                  ) : (
                    <span className="masked">••••••</span>
                  )
                }
              />
              <Field
                label="Daily (Basic + Allowances)"
                computed
                sensitive
                value={
                  CAN_SEE_COMP(role) ? (
                    <span className="is-computed tnum">
                      {c.daily === "—"
                        ? "—"
                        : "₱" +
                          (
                            Number(c.daily) +
                            Number(c.dutyMeal) +
                            Number(c.project)
                          ).toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                    </span>
                  ) : (
                    <span className="masked">••••••</span>
                  )
                }
              />
            </div>
          </React.Fragment>
        )}
        {tab === "Government IDs" && (
          <div className="rec-grid">
            <Field label="SSS" sensitive value={emp.sss} />
            <Field label="Pag-IBIG" sensitive value={emp.pagibig} />
            <Field label="PhilHealth" sensitive value={emp.philhealth} />
            <Field label="TIN" sensitive value={emp.tin} />
          </div>
        )}
        {tab === "Personal" && (
          <div className="rec-grid">
            <Field label="Birthday" sensitive value={emp.birthday} />
            <Field label="Age" computed value={age + " yrs"} />
            <Field label="Gender" value={emp.gender} />
            <Field label="Address" sensitive value={emp.address} />
            <Field label="Contact Number" sensitive value={emp.contact} />
          </div>
        )}
        {tab === "Emergency" && (
          <div className="rec-grid">
            <Field label="Contact Person" value={emp.emName} />
            <Field label="Contact Number" value={emp.emNum} />
          </div>
        )}
        {tab === "Other" && (
          <div className="rec-grid">
            <Field label="Insurance" value={emp.insurance} />
            <Field label="Vaccinated" value={emp.vaccinated} />
            <Field
              label="ATM Account Number"
              sensitive
              value={
                CAN_SEE_COMP(role) ? (
                  emp.atm
                ) : (
                  <span className="masked">••••••••</span>
                )
              }
            />
            <Field label="Expiration Date" value={emp.atmExp} />
            <Field label="Remarks" value={emp.remarks} />
          </div>
        )}
        {tab === "History" && (
          <div className="rec-history">
            {HR_AUDIT.filter((a) => a.rec === emp.no).length === 0 && (
              <div className="muted">
                No recorded changes for this employee in the current log window.
              </div>
            )}
            {HR_AUDIT.filter((a) => a.rec === emp.no).map((a, i) => (
              <div key={i} className="hist-row">
                <span className="mono hist-ts">{a.ts}</span>
                <div>
                  <div className="hist-act">
                    {a.action} — {a.delta}
                  </div>
                  <div className="hist-actor">{a.actor}</div>
                </div>
              </div>
            ))}
            <div className="hist-row">
              <span className="mono hist-ts">{emp.hired}</span>
              <div>
                <div className="hist-act">Employee created — {emp.status}</div>
                <div className="hist-actor">HR Head</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// H3 · Add / edit (multi-section form + sticky section rail)
// ---------------------------------------------------------------------------
function H3Form({ role, emp, onCancel }) {
  const [sec, setSec] = useState("ident");
  const secs = [
    ["ident", "Identification & assignment"],
    ["comp", "Compensation"],
    ["gov", "Government IDs"],
    ["pers", "Personal"],
    ["emer", "Emergency contact"],
    ["other", "Other"],
  ];
  const seeComp = CAN_SEE_COMP(role);
  return (
    <div className="screen">
      <button className="back-link" onClick={onCancel}>
        ← Cancel
      </button>
      <div className="page-head glass">
        <div>
          <div className="kicker">HR · H3</div>
          <h2 className="ph-title">
            {emp ? "Edit employee — " + emp.name : "Add employee"}
          </h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary btn-sm" onClick={onCancel}>
            Save
          </button>
        </div>
      </div>
      <div className="form-split">
        <nav className="glass form-rail">
          {secs.map(([id, l]) => (
            <button
              key={id}
              className={"set-navitem" + (sec === id ? " on" : "")}
              onClick={() => setSec(id)}
            >
              {l}
            </button>
          ))}
        </nav>
        <div className="solid form-body">
          {sec === "ident" && (
            <div className="form-grid">
              <L l="Name of Employee" req>
                <input className="field" defaultValue={emp?.name} />
              </L>
              <L l="BIO Nos">
                <input className="field" defaultValue={emp?.bio} />
              </L>
              <L l="Place of Assignment">
                <select className="field" defaultValue={emp?.assign}>
                  {PROJECTS.map((p) => (
                    <option key={p.so}>
                      {p.so} · {p.label}
                    </option>
                  ))}
                  <option>Main Office</option>
                </select>
              </L>
              <L l="Position" req>
                <input className="field" defaultValue={emp?.pos} />
              </L>
              <L l="Date Hired">
                <input
                  className="field"
                  type="date"
                  defaultValue={emp?.hired}
                />
              </L>
              <L l="Years of Service" computed>
                <div className="field is-computed">auto from Date Hired</div>
              </L>
              <L l="Employee Number">
                <input
                  className="field"
                  defaultValue={emp?.no}
                  placeholder="system-assigned"
                />
              </L>
              <L l="Status">
                <select className="field" defaultValue={emp?.status}>
                  {[
                    "Probationary",
                    "Regular",
                    "On Leave",
                    "Suspended",
                    "Resigned",
                    "Terminated",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </L>
            </div>
          )}
          {sec === "comp" && (
            <React.Fragment>
              {!seeComp && (
                <div className="mask-banner">
                  <Icon name="lock" size={15} color="var(--jce-ink-2)" />{" "}
                  Compensation fields are restricted — editable only by Payroll
                  Officer &amp; Owner.
                </div>
              )}
              <div className="form-grid">
                <L l="Salary Rate Category" sensitive>
                  <select
                    className="field"
                    disabled={!seeComp}
                    defaultValue={emp?.comp.cat}
                  >
                    {["Daily", "Weekly", "Monthly"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </L>
                <L l="Daily Rate (Basic)" sensitive>
                  <input
                    className="field"
                    disabled={!seeComp}
                    defaultValue={seeComp ? emp?.comp.daily : ""}
                    placeholder={seeComp ? "" : "••••••"}
                  />
                </L>
                <L l="Equivalent Monthly Rate" sensitive>
                  <input
                    className="field"
                    disabled={!seeComp}
                    defaultValue={seeComp ? emp?.comp.monthly : ""}
                    placeholder={seeComp ? "" : "••••••"}
                  />
                </L>
                <L l="Monthly Allowance" sensitive>
                  <input
                    className="field"
                    disabled={!seeComp}
                    defaultValue={seeComp ? emp?.comp.allowance : ""}
                    placeholder={seeComp ? "" : "••••••"}
                  />
                </L>
                <L l="Total Monthly Compensation" computed>
                  <div className="field is-computed">auto-summed</div>
                </L>
              </div>
            </React.Fragment>
          )}
          {sec === "gov" && (
            <div className="form-grid">
              <L l="SSS" sensitive>
                <input className="field" defaultValue={emp?.sss} />
              </L>
              <L l="Pag-IBIG" sensitive>
                <input className="field" defaultValue={emp?.pagibig} />
              </L>
              <L l="PhilHealth" sensitive>
                <input className="field" defaultValue={emp?.philhealth} />
              </L>
              <L l="TIN" sensitive>
                <input className="field" defaultValue={emp?.tin} />
              </L>
            </div>
          )}
          {sec === "pers" && (
            <div className="form-grid">
              <L l="Birthday" sensitive>
                <input
                  className="field"
                  type="date"
                  defaultValue={emp?.birthday}
                />
              </L>
              <L l="Age" computed>
                <div className="field is-computed">auto from Birthday</div>
              </L>
              <L l="Gender">
                <select className="field" defaultValue={emp?.gender}>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </L>
              <L l="Address" sensitive>
                <input className="field" defaultValue={emp?.address} />
              </L>
              <L l="Contact Number" sensitive>
                <input className="field" defaultValue={emp?.contact} />
              </L>
            </div>
          )}
          {sec === "emer" && (
            <div className="form-grid">
              <L l="Contact Person">
                <input className="field" defaultValue={emp?.emName} />
              </L>
              <L l="Contact Number">
                <input className="field" defaultValue={emp?.emNum} />
              </L>
            </div>
          )}
          {sec === "other" && (
            <div className="form-grid">
              <L l="Insurance">
                <input className="field" defaultValue={emp?.insurance} />
              </L>
              <L l="Vaccinated">
                <select className="field" defaultValue={emp?.vaccinated}>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </L>
              <L l="ATM Account Number" sensitive>
                <input
                  className="field"
                  disabled={!seeComp}
                  defaultValue={seeComp ? emp?.atm : ""}
                  placeholder={seeComp ? "" : "••••••"}
                />
              </L>
              <L l="Expiration Date">
                <input className="field" defaultValue={emp?.atmExp} />
              </L>
              <L l="Remarks">
                <input className="field" defaultValue={emp?.remarks} />
              </L>
            </div>
          )}
          <div className="form-foot">
            Required identity fields validated on save · computed fields are
            read-only · sensitive groups visually badged.
          </div>
        </div>
      </div>
    </div>
  );
}
function L({ l, req, sensitive, computed, children }) {
  return (
    <div className="form-field">
      <label className="lbl">
        {l}
        {req && <span className="sens"> *</span>}
        {sensitive && <span className="sens-badge"> sensitive</span>}
        {computed && <span className="comp-badge"> computed</span>}
      </label>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// H4 · Archived
// ---------------------------------------------------------------------------
function H4Archived({ onBack }) {
  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Employees
      </button>
      <div className="page-head glass">
        <div>
          <div className="kicker">HR · H4</div>
          <h2 className="ph-title">Archived employees</h2>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>BIO</th>
              <th>Position</th>
              <th>Assignment</th>
              <th>Status</th>
              <th>Date Hired</th>
              <th>Archived</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ARCHIVED.map((e) => (
              <tr key={e.id}>
                <td className="tnum">{e.sn}</td>
                <td style={{ fontWeight: 600 }}>{e.name}</td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {e.bio}
                </td>
                <td>{e.pos}</td>
                <td style={{ color: "var(--jce-ink-2)" }}>{e.assign}</td>
                <td>
                  <EmpStatus s={e.status} />
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {e.hired}
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {e.archived}
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm">Restore</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, {
  H1List,
  H2Record,
  H3Form,
  H4Archived,
  EmpStatus,
  Field,
  L,
});
