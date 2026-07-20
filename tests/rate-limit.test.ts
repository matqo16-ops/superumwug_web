import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit, resetRateLimits } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimits();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the limit and blocks beyond it", () => {
    const options = { limit: 3, windowMs: 60_000 };
    expect(checkRateLimit("ip-1", options)).toBe(true);
    expect(checkRateLimit("ip-1", options)).toBe(true);
    expect(checkRateLimit("ip-1", options)).toBe(true);
    expect(checkRateLimit("ip-1", options)).toBe(false);
  });

  it("tracks keys independently", () => {
    const options = { limit: 1, windowMs: 60_000 };
    expect(checkRateLimit("ip-1", options)).toBe(true);
    expect(checkRateLimit("ip-2", options)).toBe(true);
    expect(checkRateLimit("ip-1", options)).toBe(false);
  });

  it("allows again after the window expires", () => {
    const options = { limit: 1, windowMs: 60_000 };
    expect(checkRateLimit("ip-1", options)).toBe(true);
    expect(checkRateLimit("ip-1", options)).toBe(false);
    vi.advanceTimersByTime(61_000);
    expect(checkRateLimit("ip-1", options)).toBe(true);
  });
});
