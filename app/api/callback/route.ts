import { NextResponse } from "next/server";
import { callbackSchema } from "@/lib/callback-schema";
import { EmailNotConfiguredError, sendCallbackEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  const ip = getClientIp(request);
  if (!checkRateLimit(`callback:${ip}`, { limit: 5, windowMs: 10 * 60_000 })) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  // Honeypot: bots fill the hidden "website" field. Pretend success so they
  // don't learn anything; no email is sent.
  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    (body as Record<string, unknown>).website
  ) {
    return NextResponse.json({ ok: true });
  }

  const parsed = callbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    await sendCallbackEmail(parsed.data);
  } catch (error) {
    console.error("Callback email failed:", error);
    // Distinguish "the environment is not set up" from "the provider refused a
    // well-formed request" — the two need completely different fixes, and
    // collapsing them into one code makes the failure undiagnosable from
    // outside. Neither response body carries provider detail.
    if (error instanceof EmailNotConfiguredError) {
      return NextResponse.json(
        { ok: false, error: "email_not_configured" },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { ok: false, error: "email_rejected" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
