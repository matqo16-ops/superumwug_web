// Opens the third-party chatbot widget if its embed script (pasted in Settings > Custom Code,
// see README.md step 5) has loaded and exposes a known open() API. Falls back to scrolling to
// a callback form if no known widget API is found — this is the "fallback rule" from the spec.
//
// Usage from any page:
//   import { openChatbot } from 'public/chatbot';
//   $w('#buttonChatCta').onClick(() => openChatbot($w, '#sectionCallbackForm'));

export function openChatbot($w, fallbackAnchorId) {
    const win = typeof window !== 'undefined' ? window : undefined;

    if (win) {
        // SiteGPT
        if (win.$sitegpt && typeof win.$sitegpt.open === 'function') {
            win.$sitegpt.open();
            return;
        }
        // Chatbase
        if (win.chatbase && typeof win.chatbase === 'function') {
            win.chatbase('open');
            return;
        }
        // Generic convention some widgets use
        if (win.chatWidget && typeof win.chatWidget.open === 'function') {
            win.chatWidget.open();
            return;
        }
    }

    // Fallback: no chatbot widget detected (not yet installed, or provider has no open() API) —
    // scroll to the callback form so the visitor always has a next step.
    if (fallbackAnchorId && $w(fallbackAnchorId)) {
        $w(fallbackAnchorId).scrollTo();
    }
}
