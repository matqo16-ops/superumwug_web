import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  buildSystemPrompt,
  CHAT_MAX_TOKENS,
  CHAT_MODEL,
  chatRequestSchema,
  trimHistory,
} from "@/lib/chat";
import { getKnowledgeBase } from "@/lib/content";
import { saveConversation } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const ip = getClientIp(request);
  if (!checkRateLimit(`chat:${ip}`, { limit: 20, windowMs: 10 * 60_000 })) {
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

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation" },
      { status: 400 },
    );
  }
  const { sessionId, locale, page, messages } = parsed.data;
  if (messages[messages.length - 1].role !== "user") {
    return NextResponse.json(
      { ok: false, error: "validation" },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    // The widget shows its "assistant unavailable — request a callback" state.
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }

  const history = trimHistory(messages);
  const client = new Anthropic();
  const stream = client.messages.stream({
    model: CHAT_MODEL,
    max_tokens: CHAT_MAX_TOKENS,
    system: buildSystemPrompt(getKnowledgeBase(), locale),
    messages: history,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      let reply = "";
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            reply += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (error) {
        console.error("Chat stream failed:", error);
        controller.error(error);
        return;
      }

      // Persist the transcript before closing so the serverless function
      // isn't frozen mid-write. Logging failures never break the chat.
      try {
        await saveConversation(sessionId, locale, page, [
          ...history,
          { role: "assistant", content: reply },
        ]);
      } catch (error) {
        console.error("Chat logging failed:", error);
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
