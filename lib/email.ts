import { Resend } from "resend";
import type { CallbackRequest } from "./callback-schema";

/**
 * Sends the callback-request notification email via Resend.
 * The email is the system of record — there is no database for requests.
 */
/**
 * Thrown when the environment is not set up, as opposed to the provider
 * rejecting a well-formed request. The two need different fixes, so the API
 * route reports them as different errors.
 */
export class EmailNotConfiguredError extends Error {
  constructor(missing: string[]) {
    super(`Email is not configured (missing: ${missing.join(", ")}).`);
    this.name = "EmailNotConfiguredError";
  }
}

export async function sendCallbackEmail(data: CallbackRequest): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CALLBACK_TO_EMAIL;
  const missing: string[] = [];
  if (!apiKey) missing.push("RESEND_API_KEY");
  if (!to) missing.push("CALLBACK_TO_EMAIL");
  if (!apiKey || !to) {
    throw new EmailNotConfiguredError(missing);
  }

  const resend = new Resend(apiKey);
  const lines = [
    `Name: ${data.name}`,
    `Telefon: ${data.phone}`,
    `Wunschzeit: ${data.preferredTime}`,
    `Thema: ${data.topic ?? "—"}`,
    data.partnerType ? `Partner-Typ: ${data.partnerType}` : null,
    data.companyName ? `Unternehmen/Branche: ${data.companyName}` : null,
    data.message ? `Nachricht: ${data.message}` : null,
    ``,
    `Sprache: ${data.locale}`,
    `Seite: ${data.sourcePage}`,
    `Eingegangen: ${new Date().toISOString()}`,
  ].filter((line): line is string => line !== null);

  const { error } = await resend.emails.send({
    // Works out of the box on the Resend free tier; switch to a verified
    // domain sender (e.g. website@mmoving.de) once DNS is set up.
    from: process.env.CALLBACK_FROM_EMAIL ?? "mmoving.de Website <onboarding@resend.dev>",
    to,
    subject: `Neue Rückrufanfrage: ${data.name}${data.topic ? ` (${data.topic})` : ""}`,
    text: lines.join("\n"),
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
