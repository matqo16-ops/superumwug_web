"use client";

import type { ReactNode } from "react";
import { useCallbackModal } from "./CallbackProvider";

/** Button that opens the global callback modal, optionally preselecting a topic. */
export function CallbackButton({
  children,
  topic,
  className,
}: {
  children: ReactNode;
  topic?: string;
  className?: string;
}) {
  const { openModal } = useCallbackModal();
  return (
    <button type="button" className={className} onClick={() => openModal(topic)}>
      {children}
    </button>
  );
}
