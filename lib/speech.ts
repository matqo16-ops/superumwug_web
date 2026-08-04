/**
 * Thin, typed wrapper around the browser-native Web Speech API.
 *
 * Chosen deliberately over a paid TTS/STT vendor (ElevenLabs et al.): it ships
 * with the browser, costs nothing per request, needs no API key, and keeps the
 * audio on the user's machine/browser vendor rather than adding a processor.
 * Chrome, Edge and Safari support it; Firefox does not implement
 * SpeechRecognition, so callers must degrade gracefully via `isSpeechRecognitionSupported`.
 */

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultLike {
  readonly length: number;
  readonly isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultListLike {
  readonly length: number;
  [index: number]: SpeechRecognitionResultLike;
}

export interface SpeechRecognitionEventLike extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultListLike;
}

export interface SpeechRecognitionErrorEventLike extends Event {
  readonly error: string;
}

export interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getRecognitionCtor() !== null;
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** BCP-47 tag for the active site locale. */
export function speechLang(locale: string): string {
  return locale === "en" ? "en-GB" : "de-DE";
}

export function createRecognition(locale: string): SpeechRecognitionLike | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;
  const recognition = new Ctor();
  recognition.lang = speechLang(locale);
  // Single utterance per activation; interim results drive the live transcript.
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  return recognition;
}

/** Speaks `text` in the locale's voice, preferring a matching installed voice. */
export function speak(text: string, locale: string): void {
  if (!isSpeechSynthesisSupported() || !text.trim()) return;
  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const lang = speechLang(locale);
  utterance.lang = lang;
  utterance.rate = 1;
  utterance.pitch = 1;

  const prefix = lang.slice(0, 2);
  const voice =
    synth.getVoices().find((v) => v.lang === lang) ??
    synth.getVoices().find((v) => v.lang.startsWith(prefix));
  if (voice) utterance.voice = voice;

  synth.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel();
}
