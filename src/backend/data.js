// Data hooks — Wix calls these automatically for the named collection/operation.
// Reference: https://dev.wix.com/docs/velo/apis/wix-data-hooks
//
// This only stamps a server-side timestamp and does light sanitation; the CallbackRequests
// insert itself always goes through src/backend/callbackRequests.web.js, which already
// validates input, so this hook is a safety net, not the primary validation path.

export function CallbackRequests_beforeInsert(item, context) {
    item.receivedAt = new Date();
    if (typeof item.message === 'string') {
        item.message = item.message.slice(0, 2000);
    }
    return item;
}
