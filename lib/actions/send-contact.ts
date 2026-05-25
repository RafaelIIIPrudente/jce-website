"use server";

import { z } from "zod";
import { Resend } from "resend";

import { env } from "@/env";
import { SITE } from "@/lib/content/site";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(120),
  email: z.string().email("Please enter a valid email."),
  phone: z
    .string()
    .min(5, "Please enter a phone number.")
    .max(40)
    .optional()
    .or(z.literal("")),
  projectType: z.enum([
    "solar",
    "substation",
    "transmission",
    "consulting",
    "industrial",
    "other",
  ]),
  message: z
    .string()
    .min(10, "Tell us a little more — at least ten characters.")
    .max(4000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

const PROJECT_LABEL: Record<ContactInput["projectType"], string> = {
  solar: "Solar farm / renewable EPC",
  substation: "Substation EPC",
  transmission: "Transmission / NGCP",
  consulting: "Pre-development consulting",
  industrial: "Industrial electrical",
  other: "Other",
};

export async function sendContact(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const data = parsed.data;
  const subject = `New project inquiry — ${PROJECT_LABEL[data.projectType]}`;
  const phoneLine = data.phone ? `Phone: ${data.phone}\n` : "";
  const body = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    phoneLine.trimEnd(),
    `Project: ${PROJECT_LABEL[data.projectType]}`,
    "",
    "Message:",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  if (!env.RESEND_API_KEY) {
    // Dev / preview without Resend configured — log and succeed so the
    // UI can still demonstrate the happy path.
    console.info("[contact-form] RESEND_API_KEY not set — logging inquiry:");
    console.info(subject);
    console.info(body);
    return { ok: true };
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "JCE Website <noreply@jcepower.com>",
      to: [SITE.email],
      replyTo: data.email,
      subject,
      text: body,
    });

    if (error) {
      console.error("[contact-form] resend error", error);
      return {
        ok: false,
        error: "We couldn’t send your message. Please email us directly.",
      };
    }

    return { ok: true };
  } catch (err) {
    console.error("[contact-form] unexpected error", err);
    return {
      ok: false,
      error: "Something went wrong. Please email us directly.",
    };
  }
}
