// ============================================================================
// JCE SYSTEM — Public website pages part B: S6 News · S7 Careers
//   S8 Contact/Inquiry (FLAGSHIP) · S9 FAQ
// ============================================================================

// ---------------------------------------------------------------------------
// S8 · Contact / Inquiry (FLAGSHIP) — feeds BDD B10
// ---------------------------------------------------------------------------
function S8Contact() {
  const [sent, setSent] = useState(false);
  const [errs, setErrs] = useState({});
  const [form, setForm] = useState({
    name: "",
    company: "",
    position: "",
    email: "",
    phone: "",
    industry: "",
    type: "",
    typeOther: "",
    projLoc: "",
    timeline: "",
    subject: "",
    message: "",
    budget: "",
    heard: "",
    website: "",
  }); // website = honeypot

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    if (form.website) return; // honeypot tripped — silently drop
    const req = [
      "name",
      "company",
      "email",
      "phone",
      "type",
      "subject",
      "message",
    ];
    const er = {};
    req.forEach((k) => {
      if (!form[k].trim()) er[k] = "Required";
    });
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      er.email = "Enter a valid email";
    setErrs(er);
    if (Object.keys(er).length === 0) {
      setSent(true);
      window.scrollTo && window.scrollTo(0, 0);
    }
  };

  if (sent) {
    return (
      <div className="web-page web-inner-page">
        <section className="web-section">
          <div className="glass thanks-card">
            <div className="thanks-ic">
              <WIcon name="check" size={34} color="var(--jce-green-700)" />
            </div>
            <h2>Thank you — your inquiry is in.</h2>
            <p>
              Our Business Development team has received your message and will
              respond shortly. A reference has been created in our system.
            </p>
            <div className="thanks-ref">
              <span className="om-k">Inquiry type</span>
              <span>{form.type || "General"}</span>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setSent(false);
                setForm({
                  name: "",
                  company: "",
                  position: "",
                  email: "",
                  phone: "",
                  industry: "",
                  type: "",
                  typeOther: "",
                  projLoc: "",
                  timeline: "",
                  subject: "",
                  message: "",
                  budget: "",
                  heard: "",
                  website: "",
                });
              }}
            >
              Send another
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="web-page web-inner-page">
      <PageHero
        eyebrow="Get in touch"
        title="Contact us"
        sub="Tell us about your power requirement. Required fields are marked with an asterisk."
      />
      <section className="web-section">
        <div className="contact-split">
          {/* contact info — glass */}
          <aside className="glass contact-info">
            <div className="ci-block">
              <div className="ci-k">Office</div>
              <div className="ci-v">
                2129 La Mesa Street, Ugong,
                <br />
                Valenzuela City, Metro Manila
              </div>
            </div>
            <div className="ci-block">
              <div className="ci-k">Phone</div>
              <div className="ci-v">(02) 8000-0000</div>
            </div>
            <div className="ci-block">
              <div className="ci-k">Email</div>
              <div className="ci-v">inquiries@jce.com.ph</div>
            </div>
            <div className="ci-block">
              <div className="ci-k">Hours</div>
              <div className="ci-v">Mon–Fri · 8:00 AM – 5:00 PM</div>
            </div>
            <div className="ci-map">
              <div className="pcard-ph">
                <WIcon name="home" size={24} color="var(--jce-ink-2)" />
                <span>Map embed</span>
              </div>
            </div>
          </aside>

          {/* form — solid */}
          <form className="solid inquiry-form" onSubmit={submit} noValidate>
            <div className="if-section">Contact</div>
            <div className="if-grid">
              <WField label="Name" req err={errs.name}>
                <input
                  className="field"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </WField>
              <WField label="Company / Organization" req err={errs.company}>
                <input
                  className="field"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                />
              </WField>
              <WField label="Position / Role">
                <input
                  className="field"
                  value={form.position}
                  onChange={(e) => set("position", e.target.value)}
                />
              </WField>
              <WField label="Industry">
                <select
                  className="field"
                  value={form.industry}
                  onChange={(e) => set("industry", e.target.value)}
                >
                  <option value="">Select…</option>
                  {INQ_INDUSTRY.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </WField>
              <WField label="Email" req err={errs.email}>
                <input
                  className="field"
                  type="email"
                  inputMode="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </WField>
              <WField label="Phone" req err={errs.phone}>
                <input
                  className="field"
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </WField>
            </div>

            <div className="if-section">Inquiry details</div>
            <div className="if-grid">
              <WField label="Inquiry Type" req err={errs.type} full>
                <select
                  className="field"
                  value={form.type}
                  onChange={(e) => set("type", e.target.value)}
                >
                  <option value="">Select…</option>
                  {INQ_TYPE.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </WField>
              {form.type === "Other" && (
                <WField label="Please specify" full>
                  <input
                    className="field"
                    value={form.typeOther}
                    onChange={(e) => set("typeOther", e.target.value)}
                  />
                </WField>
              )}
              <WField label="Project Location">
                <input
                  className="field"
                  value={form.projLoc}
                  onChange={(e) => set("projLoc", e.target.value)}
                />
              </WField>
              <WField label="Estimated Timeline">
                <select
                  className="field"
                  value={form.timeline}
                  onChange={(e) => set("timeline", e.target.value)}
                >
                  <option value="">Select…</option>
                  {INQ_TIMELINE.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </WField>
              <WField label="Subject" req err={errs.subject} full>
                <input
                  className="field"
                  value={form.subject}
                  onChange={(e) => set("subject", e.target.value)}
                />
              </WField>
              <WField label="Message" req err={errs.message} full>
                <textarea
                  className="field"
                  rows="4"
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                ></textarea>
              </WField>
            </div>

            <div className="if-section">
              Qualifiers <span className="if-opt">optional</span>
            </div>
            <div className="if-grid">
              <WField label="Budget Range (PHP)">
                <select
                  className="field"
                  value={form.budget}
                  onChange={(e) => set("budget", e.target.value)}
                >
                  <option value="">Prefer not to say</option>
                  {INQ_BUDGET.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </WField>
              <WField label="How did you hear about us?">
                <select
                  className="field"
                  value={form.heard}
                  onChange={(e) => set("heard", e.target.value)}
                >
                  <option value="">Select…</option>
                  {INQ_HEARD.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </WField>
            </div>

            {/* honeypot (visually hidden) */}
            <input
              className="hp-field"
              tabIndex="-1"
              autoComplete="off"
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
              aria-hidden="true"
            />

            <div className="if-foot">
              <div className="captcha-stub">
                <span className="cap-box">✓</span> I'm not a robot{" "}
                <span className="cap-note">(CAPTCHA / honeypot active)</span>
              </div>
              <button className="btn btn-primary" type="submit">
                Submit inquiry
              </button>
            </div>
            {Object.keys(errs).length > 0 && (
              <div className="form-err-note">
                Please complete the required fields above.
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

function WField({ label, req, err, full, children }) {
  return (
    <div className={"wfield" + (full ? " full" : "") + (err ? " has-err" : "")}>
      <label className="wlbl">
        {label}
        {req && <span className="wreq"> *</span>}
      </label>
      {children}
      {err && <div className="werr">{err}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// S6 · News / Blog
// ---------------------------------------------------------------------------
function S6News() {
  return (
    <div className="web-page web-inner-page">
      <PageHero
        eyebrow="Newsroom"
        title="News & insights"
        sub="Project milestones and perspectives on Philippine power infrastructure."
      />
      <section className="web-section">
        <div className="news-list">
          {NEWS.map((n, i) => (
            <article key={i} className="solid news-card">
              <div className="news-img">
                <div className="pcard-ph">
                  <WIcon name="bdd" size={24} color="var(--jce-ink-2)" />
                </div>
              </div>
              <div className="news-body">
                <div className="news-top">
                  <span className="wtag">{n.cat}</span>
                  <span className="news-date mono">{n.date}</span>
                </div>
                <div className="news-title">{n.title}</div>
                <div className="news-excerpt">{n.excerpt}</div>
                <span className="sec-link">Read more →</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// S7 · Careers
// ---------------------------------------------------------------------------
function S7Careers({ go }) {
  return (
    <div className="web-page web-inner-page">
      <PageHero
        eyebrow="Join us"
        title="Careers"
        sub="Build the infrastructure that powers the Philippines. Open roles below."
      />
      <section className="web-section">
        <div className="careers-list">
          {CAREERS.map((c, i) => (
            <div key={i} className="glass career-row">
              <div className="career-main">
                <div className="career-title">{c.title}</div>
                <div className="career-meta">
                  {c.dept} · {c.loc} · {c.type}
                </div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => go("contact")}
              >
                Apply
              </button>
            </div>
          ))}
        </div>
        <div
          className="muted-note"
          style={{ marginTop: 14, textAlign: "center" }}
        >
          Application mechanism (email vs form vs ATS) is pending confirmation —
          OPEN-Q #11.
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// S9 · FAQ (accordion, FAQPage-schema-friendly)
// ---------------------------------------------------------------------------
function S9FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="web-page web-inner-page">
      <PageHero
        eyebrow="Answers"
        title="Frequently asked questions"
        sub="The questions buyers ask most about JCE's power capabilities."
      />
      <section className="web-section">
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <div
              key={i}
              className={"solid faq-item" + (open === i ? " open" : "")}
            >
              <button
                className="faq-q"
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <span>{f.q}</span>
                <span className="faq-caret">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

window.S8Contact = S8Contact;
window.S6News = S6News;
window.S7Careers = S7Careers;
window.S9FAQ = S9FAQ;
