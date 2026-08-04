"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatWidgetContent } from "@/lib/content-types";
import {
  createRecognition,
  isSpeechRecognitionSupported,
  type SpeechRecognitionLike,
} from "@/lib/speech";

const BAR_COUNT = 5;

export type VoiceState =
  | "idle"
  | "requesting"
  | "listening"
  | "denied"
  | "unsupported"
  | "error";

/**
 * Push-to-talk control for the chat widget. While listening it renders live
 * bars driven by the real microphone amplitude (Web Audio AnalyserNode), which
 * makes it obvious the mic is actually open.
 */
export function VoiceButton({
  strings,
  locale,
  onInterim,
  onFinal,
  onStateChange,
  disabled,
}: {
  strings: ChatWidgetContent;
  locale: string;
  /** Live partial transcript, shown in the input as the visitor speaks. */
  onInterim: (text: string) => void;
  /** Completed utterance — the widget sends it. */
  onFinal: (text: string) => void;
  onStateChange?: (state: VoiceState) => void;
  disabled?: boolean;
}) {
  const [state, setState] = useState<VoiceState>("idle");
  const [levels, setLevels] = useState<number[]>(() =>
    new Array(BAR_COUNT).fill(0.15),
  );

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const finalRef = useRef("");

  const update = useCallback(
    (next: VoiceState) => {
      setState(next);
      onStateChange?.(next);
    },
    [onStateChange],
  );

  /** Tear down mic stream, audio graph and animation frame. */
  const cleanupAudio = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    setLevels(new Array(BAR_COUNT).fill(0.15));
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    cleanupAudio();
    update("idle");
  }, [cleanupAudio, update]);

  // Stop everything if the component unmounts mid-session.
  useEffect(
    () => () => {
      recognitionRef.current?.abort();
      cleanupAudio();
    },
    [cleanupAudio],
  );

  /** Sample the mic and map frequency bins onto the bars. */
  const startVisualizer = useCallback((stream: MediaStream) => {
    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtor) return;

    const ctx = new AudioCtor();
    audioCtxRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.75;
    source.connect(analyser);

    const bins = new Uint8Array(analyser.frequencyBinCount);
    const perBar = Math.floor(bins.length / BAR_COUNT);

    const tick = () => {
      analyser.getByteFrequencyData(bins);
      const next: number[] = [];
      for (let b = 0; b < BAR_COUNT; b++) {
        let sum = 0;
        for (let i = 0; i < perBar; i++) sum += bins[b * perBar + i];
        // Normalize to 0.15–1 so idle bars stay visible.
        next.push(Math.max(0.15, Math.min(1, sum / perBar / 160)));
      }
      setLevels(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startListening = useCallback(async () => {
    if (!isSpeechRecognitionSupported()) {
      update("unsupported");
      return;
    }

    update("requesting");
    finalRef.current = "";

    // Ask for the mic first so the visualizer has a stream and the browser
    // permission prompt appears before recognition starts.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      startVisualizer(stream);
    } catch {
      update("denied");
      return;
    }

    const recognition = createRecognition(locale);
    if (!recognition) {
      cleanupAudio();
      update("unsupported");
      return;
    }
    recognitionRef.current = recognition;

    recognition.onstart = () => update("listening");

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) finalRef.current += text;
        else interim += text;
      }
      onInterim((finalRef.current + interim).trim());
    };

    recognition.onerror = (event) => {
      cleanupAudio();
      recognitionRef.current = null;
      update(
        event.error === "not-allowed" || event.error === "service-not-allowed"
          ? "denied"
          : "error",
      );
    };

    recognition.onend = () => {
      cleanupAudio();
      recognitionRef.current = null;
      update("idle");
      const spoken = finalRef.current.trim();
      finalRef.current = "";
      if (spoken) onFinal(spoken);
    };

    try {
      recognition.start();
    } catch {
      cleanupAudio();
      update("error");
    }
  }, [locale, onFinal, onInterim, startVisualizer, cleanupAudio, update]);

  const active = state === "listening" || state === "requesting";

  return (
    <button
      type="button"
      onClick={() => (active ? stopListening() : void startListening())}
      disabled={disabled}
      aria-pressed={active}
      aria-label={active ? strings.voiceStop : strings.voiceStart}
      title={active ? strings.voiceStop : strings.voiceStart}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? "bg-error text-white"
          : "bg-navy text-gold hover:bg-gold hover:text-navy"
      }`}
    >
      {active ? (
        // Live microphone amplitude — five bars driven by the analyser.
        <span aria-hidden="true" className="flex h-5 items-center gap-[3px]">
          {levels.map((level, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-current"
              style={{ height: `${Math.round(level * 20)}px` }}
            />
          ))}
        </span>
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M10 3a2 2 0 0 1 2 2v5a2 2 0 1 1-4 0V5a2 2 0 0 1 2-2Z"
            fill="currentColor"
          />
          <path
            d="M5.5 9.5a4.5 4.5 0 0 0 9 0M10 14v3m-2.5 0h5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
