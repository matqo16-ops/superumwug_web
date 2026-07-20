"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { ChatWidgetContent } from "@/lib/content-types";
import { useCallbackModal } from "./CallbackProvider";
import { OPEN_CHAT_EVENT } from "./ChatCtaButton";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SESSION_KEY = "su-chat-session";
const MESSAGES_KEY = "su-chat-messages";
/** Client-side cap; the server trims again defensively. */
const MAX_HISTORY = 20;

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function ChatWidget({ strings }: { strings: ChatWidgetContent }) {
  const locale = useLocale();
  const pathname = usePathname();
  const { openModal } = useCallbackModal();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<
    "idle" | "streaming" | "unavailable" | "error"
  >("idle");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore the session transcript and register the global open event.
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(MESSAGES_KEY);
      if (stored) setMessages(JSON.parse(stored) as ChatMessage[]);
    } catch {
      // corrupted storage — start fresh
    }
    const onOpen = () => setIsOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isOpen, status]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const send = useCallback(async () => {
    const question = input.trim();
    if (!question || status === "streaming") return;
    setInput("");
    setStatus("streaming");

    const history = [...messages, { role: "user" as const, content: question }];
    setMessages(history);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getSessionId(),
          locale,
          page: pathname,
          messages: history.slice(-MAX_HISTORY),
        }),
      });

      if (!response.ok || !response.body) {
        setStatus(response.status === 503 ? "unavailable" : "error");
        return;
      }

      // Stream the assistant reply token by token into the last message.
      setMessages((current) => [...current, { role: "assistant", content: "" }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        const snapshot = reply;
        setMessages((current) => [
          ...current.slice(0, -1),
          { role: "assistant", content: snapshot },
        ]);
      }
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }, [input, status, messages, locale, pathname]);

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? strings.closeLabel : strings.openLabel}
        aria-expanded={isOpen}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gold text-navy shadow-card transition-transform hover:scale-105 hover:bg-gold-deep hover:text-white"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path
              d="M6 6l10 10M16 6L6 16"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <path
              d="M13 3C7.2 3 2.5 6.9 2.5 11.7c0 2.7 1.5 5.1 3.8 6.7-.14 1.2-.6 2.6-1.7 3.7 2.1-.15 3.8-.94 5-1.76 1.07.3 2.2.47 3.4.47 5.8 0 10.5-3.9 10.5-8.7S18.8 3 13 3Z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={strings.title}
          className="fixed bottom-24 right-5 z-[60] flex h-[560px] max-h-[calc(100vh-8rem)] w-[min(400px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border border-hairline bg-white shadow-card"
        >
          <div className="bg-navy px-5 py-4">
            <p className="font-display text-lg font-semibold text-white">
              {strings.title}
            </p>
            <p className="text-xs text-white/70">{strings.subtitle}</p>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-cream px-4 py-4"
          >
            <div className="max-w-[85%] rounded-xl rounded-bl-sm bg-white px-4 py-2.5 text-sm leading-relaxed text-ink shadow-sm">
              {strings.welcome}
            </div>
            {messages.map((message, index) =>
              message.role === "user" ? (
                <div
                  key={index}
                  className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-navy px-4 py-2.5 text-sm leading-relaxed text-white"
                >
                  {message.content}
                </div>
              ) : (
                <div
                  key={index}
                  className="max-w-[85%] whitespace-pre-wrap rounded-xl rounded-bl-sm bg-white px-4 py-2.5 text-sm leading-relaxed text-ink shadow-sm"
                >
                  {message.content}
                </div>
              ),
            )}
            {status === "streaming" &&
              messages[messages.length - 1]?.role !== "assistant" && (
                <p className="px-1 text-xs text-anthracite/60" role="status">
                  {strings.typing}
                </p>
              )}
            {(status === "unavailable" || status === "error") && (
              <div
                role="alert"
                className="max-w-[85%] rounded-xl border border-error/25 bg-error/5 px-4 py-2.5 text-sm leading-relaxed text-anthracite"
              >
                {status === "unavailable" ? strings.unavailable : strings.error}
                <button
                  type="button"
                  onClick={() => openModal()}
                  className="mt-2 block font-semibold text-navy underline decoration-gold decoration-2 underline-offset-2 hover:text-gold-deep"
                >
                  {strings.callbackLink}
                </button>
              </div>
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t border-hairline bg-white px-3 py-3"
            onSubmit={(event) => {
              event.preventDefault();
              void send();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={strings.placeholder}
              maxLength={1000}
              className="flex-1 rounded-lg border border-hairline px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
            <button
              type="submit"
              disabled={status === "streaming" || input.trim() === ""}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-deep hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {strings.send}
            </button>
          </form>

          <p className="border-t border-hairline bg-cream px-4 py-2 text-[11px] leading-snug text-anthracite/60">
            {strings.gdprNote}
            <Link
              href="/datenschutz"
              className="underline decoration-gold/60 underline-offset-2 hover:text-gold-deep"
            >
              {strings.gdprLinkLabel}
            </Link>
          </p>
        </div>
      )}
    </>
  );
}
