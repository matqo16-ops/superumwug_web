/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Note: state is per serverless instance, so on Vercel this is a best-effort
 * limit (each warm instance keeps its own window). That is acceptable here —
 * it stops naive spam loops; the honeypot and validation do the rest.
 */

interface Window {
  timestamps: number[];
}

const windows = new Map<string, Window>();

export interface RateLimitOptions {
  /** Max requests allowed within the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

/** Returns true when the request is allowed, false when rate-limited. */
export function checkRateLimit(key: string, options: RateLimitOptions): boolean {
  const now = Date.now();
  const window = windows.get(key) ?? { timestamps: [] };
  window.timestamps = window.timestamps.filter(
    (t) => now - t < options.windowMs,
  );
  if (window.timestamps.length >= options.limit) {
    windows.set(key, window);
    return false;
  }
  window.timestamps.push(now);
  windows.set(key, window);

  // Opportunistic cleanup so the map cannot grow unbounded.
  if (windows.size > 5000) {
    for (const [k, w] of windows) {
      if (w.timestamps.every((t) => now - t >= options.windowMs)) {
        windows.delete(k);
      }
    }
  }
  return true;
}

/** Test helper. */
export function resetRateLimits(): void {
  windows.clear();
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
