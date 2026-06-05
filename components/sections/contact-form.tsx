"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { VoltageTag } from "@/components/sections/web-voltage-tag";
import { ElectrifiedDivider } from "@/components/sections/web-electrified-divider";
import { OmegaMark } from "@/components/sections/web-omega-mark";
import {
  INQ_BUDGET,
  INQ_HEARD,
  INQ_INDUSTRY,
  INQ_TIMELINE,
  INQ_TYPE,
} from "@/lib/content/website";
import { addInquiry, type Inquiry } from "@/lib/mock/inquiries";

// S8 Contact / Inquiry (FLAGSHIP) — web-pages-b.jsx:9-318. CLIENT MOCK: validate,
// honeypot-drop bot input, then write into the shared in-session inquiry store
// (lib/mock/inquiries.ts) that BDD B10 reads. No backend / real email.
// Required: name, company, email, phone, type, subject, message (trim) + email regex.

type FormState = {
  name: string;
  company: string;
  position: string;
  industry: string;
  email: string;
  phone: string;
  type: string;
  typeOther: string;
  projectLocation: string;
  timeline: string;
  subject: string;
  message: string;
  budget: string;
  heard: string;
  website: string; // honeypot
};

const EMPTY: FormState = {
  name: "",
  company: "",
  position: "",
  industry: "",
  email: "",
  phone: "",
  type: "",
  typeOther: "",
  projectLocation: "",
  timeline: "",
  subject: "",
  message: "",
  budget: "",
  heard: "",
  website: "",
};

const REQUIRED: (keyof FormState)[] = [
  "name",
  "company",
  "email",
  "phone",
  "type",
  "subject",
  "message",
];

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const FIELD = "field min-h-11";

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [sent, setSent] = useState<Inquiry | null>(null);

  const set = (k: keyof FormState, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Honeypot tripped — silently drop (a real user never fills a hidden field).
    if (form.website) return;

    const next: Partial<Record<keyof FormState, string>> = {};
    REQUIRED.forEach((k) => {
      if (!form[k].trim()) next[k] = "Required";
    });
    if (form.email && !EMAIL_RE.test(form.email))
      next.email = "Enter a valid email";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const created = addInquiry({
      name: form.name.trim(),
      company: form.company.trim(),
      position: form.position.trim() || undefined,
      industry: form.industry || undefined,
      email: form.email.trim(),
      phone: form.phone.trim(),
      type: form.type,
      typeOther:
        form.type === "Other" ? form.typeOther.trim() || undefined : undefined,
      projectLocation: form.projectLocation.trim() || undefined,
      timeline: form.timeline || undefined,
      subject: form.subject.trim(),
      message: form.message.trim(),
      budget: form.budget || undefined,
      heard: form.heard || undefined,
    });
    setSent(created);
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  }

  if (sent) {
    return (
      <div className="circuit-card glass relative isolate flex flex-col items-center rounded-(--r-glass) p-8 text-center">
        {/* Faint pulsing Ω — decorative, behind content, clipped; frozen under
            prefers-reduced-motion. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-(--r-glass)"
        >
          <OmegaMark
            pulse
            className="absolute -top-10 -right-10 size-44 text-jce-cyan/5"
          />
        </div>
        <span className="grid size-14 place-items-center rounded-full bg-jce-green-50 text-jce-green-700">
          <CheckIcon className="size-7" strokeWidth={2.25} aria-hidden />
        </span>
        <h2 className="mt-4 text-ui-22 font-bold tracking-tight text-jce-ink">
          Thank you — your inquiry is in.
        </h2>
        <p className="mt-2 max-w-[48ch] text-ui-14 text-pretty text-jce-ink-2">
          Our Business Development team has received your message and will
          respond shortly. A reference has been created in our system.
        </p>
        <dl className="mt-5 flex flex-col items-center gap-1">
          <dt className="kicker text-jce-ink-2">Inquiry type</dt>
          <dd className="text-ui-14 font-semibold text-jce-ink">
            {sent.type || "General"}
          </dd>
          <dd className="mt-1 font-mono text-ui-12 text-jce-green-700">
            {sent.id}
          </dd>
        </dl>
        <Button
          className="mt-6 h-11 px-5"
          onClick={() => {
            setSent(null);
            setForm(EMPTY);
            setErrors({});
          }}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="circuit-card solid flex flex-col gap-6 rounded-(--r-glass) p-6 sm:p-7"
    >
      {/* Contact */}
      <FormSection title="Contact" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" required error={errors.name}>
          <input
            className={FIELD}
            value={form.name}
            autoComplete="name"
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field label="Company / Organization" required error={errors.company}>
          <input
            className={FIELD}
            value={form.company}
            autoComplete="organization"
            onChange={(e) => set("company", e.target.value)}
          />
        </Field>
        <Field label="Position / Role">
          <input
            className={FIELD}
            value={form.position}
            autoComplete="organization-title"
            onChange={(e) => set("position", e.target.value)}
          />
        </Field>
        <Field label="Industry">
          <select
            className={FIELD}
            value={form.industry}
            onChange={(e) => set("industry", e.target.value)}
          >
            <option value="">Select…</option>
            {INQ_INDUSTRY.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Email" required error={errors.email}>
          <input
            className={FIELD}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field label="Phone" required error={errors.phone}>
          <input
            className={FIELD}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
      </div>

      {/* Inquiry details */}
      <FormSection title="Inquiry details" divider />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Inquiry Type" required error={errors.type} full>
          <select
            className={FIELD}
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
          >
            <option value="">Select…</option>
            {INQ_TYPE.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        {form.type === "Other" ? (
          <Field label="Please specify" full>
            <input
              className={FIELD}
              value={form.typeOther}
              onChange={(e) => set("typeOther", e.target.value)}
            />
          </Field>
        ) : null}
        <Field label="Project Location">
          <input
            className={FIELD}
            value={form.projectLocation}
            onChange={(e) => set("projectLocation", e.target.value)}
          />
        </Field>
        <Field label="Estimated Timeline">
          <select
            className={FIELD}
            value={form.timeline}
            onChange={(e) => set("timeline", e.target.value)}
          >
            <option value="">Select…</option>
            {INQ_TIMELINE.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Subject" required error={errors.subject} full>
          <input
            className={FIELD}
            value={form.subject}
            onChange={(e) => set("subject", e.target.value)}
          />
        </Field>
        <Field label="Message" required error={errors.message} full>
          <textarea
            className="field min-h-[120px]"
            rows={4}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
          />
        </Field>
      </div>

      {/* Qualifiers */}
      <FormSection title="Qualifiers" optional divider />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Budget Range (PHP)">
          <select
            className={FIELD}
            value={form.budget}
            onChange={(e) => set("budget", e.target.value)}
          >
            <option value="">Prefer not to say</option>
            {INQ_BUDGET.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="How did you hear about us?">
          <select
            className={FIELD}
            value={form.heard}
            onChange={(e) => set("heard", e.target.value)}
          >
            <option value="">Select…</option>
            {INQ_HEARD.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Honeypot — visually hidden, off the tab order */}
      <input
        className="sr-only"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={form.website}
        onChange={(e) => set("website", e.target.value)}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-jce-line pt-5">
        <p className="inline-flex items-center gap-2 text-ui-12 text-jce-ink-2">
          <span className="grid size-5 place-items-center rounded bg-jce-green-50 text-jce-green-700">
            <CheckIcon className="size-3.5" aria-hidden />
          </span>
          I&rsquo;m not a robot{" "}
          <span className="text-jce-ink-2/70">(CAPTCHA / honeypot active)</span>
        </p>
        <Button type="submit" className="h-12 px-6">
          Submit inquiry
        </Button>
      </div>
      {Object.keys(errors).length > 0 ? (
        <p className="text-ui-12 text-(--st-danger)">
          Please complete the required fields above.
        </p>
      ) : null}
    </form>
  );
}

function FormSection({
  title,
  optional,
  divider,
}: {
  title: string;
  optional?: boolean;
  divider?: boolean;
}) {
  return (
    <div>
      {divider ? <ElectrifiedDivider className="mb-6" /> : null}
      <div className="flex items-center gap-2">
        <VoltageTag>{title}</VoltageTag>
        {optional ? (
          <span className="text-ui-12 text-jce-ink-2">optional</span>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  full,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", full && "sm:col-span-2")}>
      <label className="text-ui-12 font-semibold text-jce-ink-2">
        {label}
        {required ? <span className="text-(--st-danger)"> *</span> : null}
      </label>
      {children}
      {error ? (
        <span className="text-ui-12 text-(--st-danger)">{error}</span>
      ) : null}
    </div>
  );
}
