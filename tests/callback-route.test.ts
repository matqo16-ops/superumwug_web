import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/callback/route";
import { EmailNotConfiguredError } from "@/lib/email";
import { resetRateLimits } from "@/lib/rate-limit";

const { sendCallbackEmailMock } = vi.hoisted(() => ({
  sendCallbackEmailMock: vi.fn(),
}));

// Only the send function is replaced. EmailNotConfiguredError has to be the
// real class, because the route tells 503 from 502 with `instanceof` — a
// stand-in defined here would never match and every failure would read as 502.
vi.mock("@/lib/email", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/email")>()),
  sendCallbackEmail: sendCallbackEmailMock,
}));

function makeRequest(body: unknown, ip = "1.2.3.4"): Request {
  return new Request("http://localhost/api/callback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

const validBody = {
  name: "Max Mustermann",
  phone: "+49 89 1234567",
  preferredTime: "vormittags",
  topic: "umzug",
  consent: true,
  locale: "de",
  sourcePage: "/kontakt",
  website: "",
};

describe("POST /api/callback", () => {
  beforeEach(() => {
    resetRateLimits();
    sendCallbackEmailMock.mockReset();
    sendCallbackEmailMock.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends the notification email and returns ok for a valid request", async () => {
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(sendCallbackEmailMock).toHaveBeenCalledTimes(1);
    expect(sendCallbackEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Max Mustermann", topic: "umzug" }),
    );
  });

  it("silently drops honeypot submissions without sending email", async () => {
    const response = await POST(
      makeRequest({ ...validBody, website: "http://spam.example" }),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(sendCallbackEmailMock).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid input", async () => {
    const response = await POST(
      makeRequest({ ...validBody, phone: "not-a-phone" }),
    );
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe("validation");
    expect(sendCallbackEmailMock).not.toHaveBeenCalled();
  });

  it("returns 400 for malformed JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/callback", {
        method: "POST",
        headers: { "x-forwarded-for": "1.2.3.4" },
        body: "not json",
      }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 502 when the email provider rejects the send", async () => {
    sendCallbackEmailMock.mockRejectedValueOnce(new Error("resend down"));
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      ok: false,
      error: "email_rejected",
    });
    expect(consoleError).toHaveBeenCalled();
  });

  it("returns 503 when email is not configured", async () => {
    sendCallbackEmailMock.mockRejectedValueOnce(
      new EmailNotConfiguredError(["RESEND_API_KEY"]),
    );
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      ok: false,
      error: "email_not_configured",
    });
    expect(consoleError).toHaveBeenCalled();
  });

  it("rate-limits after 5 requests from the same IP", async () => {
    for (let i = 0; i < 5; i++) {
      const response = await POST(makeRequest(validBody, "9.9.9.9"));
      expect(response.status).toBe(200);
    }
    const blocked = await POST(makeRequest(validBody, "9.9.9.9"));
    expect(blocked.status).toBe(429);
    expect(sendCallbackEmailMock).toHaveBeenCalledTimes(5);
  });
});
