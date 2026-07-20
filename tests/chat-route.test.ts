import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/chat/route";
import { MAX_HISTORY_MESSAGES } from "@/lib/chat";
import { resetRateLimits } from "@/lib/rate-limit";

const { streamMock, saveConversationMock } = vi.hoisted(() => ({
  streamMock: vi.fn(),
  saveConversationMock: vi.fn(),
}));

vi.mock("@anthropic-ai/sdk", () => ({
  default: class AnthropicMock {
    messages = { stream: streamMock };
  },
}));

vi.mock("@/lib/db", () => ({
  saveConversation: saveConversationMock,
}));

vi.mock("@/lib/content", () => ({
  getKnowledgeBase: () => "MOCK KNOWLEDGE BASE — Umzug München, [PRICE] tables.",
}));

function makeEventStream(chunks: string[]) {
  return (async function* () {
    for (const chunk of chunks) {
      yield {
        type: "content_block_delta",
        delta: { type: "text_delta", text: chunk },
      };
    }
  })();
}

function makeRequest(body: unknown, ip = "5.6.7.8"): Request {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

const validBody = {
  sessionId: "11111111-2222-3333-4444-555555555555",
  locale: "de",
  page: "/umzug",
  messages: [{ role: "user", content: "Was kostet ein Umzug?" }],
};

describe("POST /api/chat", () => {
  beforeEach(() => {
    resetRateLimits();
    streamMock.mockReset();
    saveConversationMock.mockReset();
    saveConversationMock.mockResolvedValue(undefined);
    process.env.ANTHROPIC_API_KEY = "test-key";
  });

  afterEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
    vi.restoreAllMocks();
  });

  it("returns 503 when ANTHROPIC_API_KEY is not configured", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(503);
    expect((await response.json()).error).toBe("not_configured");
    expect(streamMock).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid input", async () => {
    const response = await POST(
      makeRequest({ ...validBody, messages: [] }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 400 when the last message is not from the user", async () => {
    const response = await POST(
      makeRequest({
        ...validBody,
        messages: [{ role: "assistant", content: "Hallo" }],
      }),
    );
    expect(response.status).toBe(400);
  });

  it("streams the model reply as plain text and logs the conversation", async () => {
    streamMock.mockReturnValue(
      makeEventStream(["Grüß Gott! ", "Gerne helfe ich."]),
    );

    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("Grüß Gott! Gerne helfe ich.");

    expect(streamMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "claude-haiku-4-5",
        max_tokens: expect.any(Number),
        system: expect.stringContaining("MOCK KNOWLEDGE BASE"),
      }),
    );

    expect(saveConversationMock).toHaveBeenCalledWith(
      validBody.sessionId,
      "de",
      "/umzug",
      [
        { role: "user", content: "Was kostet ein Umzug?" },
        { role: "assistant", content: "Grüß Gott! Gerne helfe ich." },
      ],
    );
  });

  it("caps the history sent to the model", async () => {
    streamMock.mockReturnValue(makeEventStream(["ok"]));
    const longHistory = Array.from({ length: 39 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `Nachricht ${i}`,
    }));
    longHistory.push({ role: "user", content: "letzte Frage" });

    const response = await POST(
      makeRequest({ ...validBody, messages: longHistory }),
    );
    expect(response.status).toBe(200);
    await response.text();

    const sentMessages = streamMock.mock.calls[0][0].messages;
    expect(sentMessages).toHaveLength(MAX_HISTORY_MESSAGES);
    expect(sentMessages[sentMessages.length - 1].content).toBe("letzte Frage");
  });

  it("still answers when logging fails", async () => {
    streamMock.mockReturnValue(makeEventStream(["Antwort"]));
    saveConversationMock.mockRejectedValueOnce(new Error("db down"));
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await POST(makeRequest(validBody));
    expect(await response.text()).toBe("Antwort");
    expect(consoleError).toHaveBeenCalled();
  });

  it("rate-limits after 20 requests from the same IP", async () => {
    for (let i = 0; i < 20; i++) {
      streamMock.mockReturnValueOnce(makeEventStream(["ok"]));
      const response = await POST(makeRequest(validBody, "7.7.7.7"));
      expect(response.status).toBe(200);
      await response.text();
    }
    const blocked = await POST(makeRequest(validBody, "7.7.7.7"));
    expect(blocked.status).toBe(429);
  });
});
