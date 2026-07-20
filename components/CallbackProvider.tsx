"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CallbackFormContent } from "@/lib/content-types";
import { CallbackForm } from "./CallbackForm";

interface CallbackModalApi {
  openModal: (topic?: string) => void;
}

const CallbackModalContext = createContext<CallbackModalApi>({
  openModal: () => {},
});

export function useCallbackModal(): CallbackModalApi {
  return useContext(CallbackModalContext);
}

export function CallbackProvider({
  form,
  children,
}: {
  form: CallbackFormContent;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState<string | undefined>(undefined);
  const dialogRef = useRef<HTMLDivElement>(null);

  const openModal = useCallback((preselectedTopic?: string) => {
    setTopic(preselectedTopic);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector("input")?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <CallbackModalContext.Provider value={{ openModal }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={form.title}
        >
          <button
            type="button"
            aria-label={form.close}
            className="absolute inset-0 cursor-default bg-navy-deep/70"
            onClick={close}
          />
          <div
            ref={dialogRef}
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-card sm:p-8"
          >
            <button
              type="button"
              onClick={close}
              aria-label={form.close}
              className="absolute right-4 top-4 rounded-md p-1 text-anthracite/60 hover:text-anthracite"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <h2 className="font-display text-2xl font-semibold text-navy">
              {form.title}
            </h2>
            <p className="mt-2 text-sm text-anthracite/80">{form.subtext}</p>
            <div className="mt-6">
              <CallbackForm form={form} initialTopic={topic} />
            </div>
          </div>
        </div>
      )}
    </CallbackModalContext.Provider>
  );
}
