"use client";

import type { ReactNode } from "react";

export const OPEN_CHAT_EVENT = "superumzug:open-chat";

/** Button that opens the floating chat widget from anywhere on the page. */
export function ChatCtaButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT))}
    >
      {children}
    </button>
  );
}
