import { Context, MiddlewareHandler } from "hono";
import { Cache } from "../utils/cache";

interface RateLimitOptions {
  /**
   * Maximum number of requests allowed within the window
   */
  limit: number;

  /**
   * Time window in which the limit applies
   * Format: number + unit (s: seconds, m: minutes, h: hours)
   * e.g. "10s", "5m", "1h"
   */
  window: string;

  /**
   * Key function to determine the rate limit key (defaults to IP address)
   */
  keyGenerator?: (c: Context) => string;

  /**
   * Whether to include remaining limit headers in the response
   */
  includeHeaders?: boolean;
}

// Simple in-memory cache for rate limiting
// In production, use Redis or another distributed cache
const limiterCache = new Cache<{ count: number; resetTime: number }>(1000);

/**
 * Converts a time string to milliseconds
 */
function parseTimeWindow(window: string): number {
  const match = window.match(/^(\d+)([smh])$/);
  if (!match) {
    throw new Error(
      `Invalid time window format: ${window}. Expected format: number + unit (s, m, h)`
    );
  }

  const [, value, unit] = match;
  const valueNum = parseInt(value, 10);

  switch (unit) {
    case "s":
      return valueNum * 1000;
    case "m":
      return valueNum * 60 * 1000;
    case "h":
      return valueNum * 60 * 60 * 1000;
    default:
      throw new Error(`Invalid time unit: ${unit}`);
  }
}

/**
 * Rate limiting middleware for Hono
 */
export function rateLimit(options: RateLimitOptions): MiddlewareHandler {
  const {
    limit,
    window,
    keyGenerator = (c) =>
      c.req.header("x-forwarded-for") || c.env?.ip || "unknown",
    includeHeaders = true,
  } = options;

  const windowMs = parseTimeWindow(window);

  return async (c, next) => {
    const key = `ratelimit:${keyGenerator(c)}`;
    const now = Date.now();

    // Get current rate limit data or create new entry
    const current = limiterCache.get(key) || {
      count: 0,
      resetTime: now + windowMs,
    };

    // Reset if window has passed
    if (now > current.resetTime) {
      current.count = 0;
      current.resetTime = now + windowMs;
    }

    current.count++;
    limiterCache.set(key, current, windowMs);

    // Add rate limit headers if enabled
    if (includeHeaders) {
      c.header("X-RateLimit-Limit", limit.toString());
      c.header(
        "X-RateLimit-Remaining",
        Math.max(0, limit - current.count).toString()
      );
      c.header(
        "X-RateLimit-Reset",
        Math.ceil(current.resetTime / 1000).toString()
      );
    }

    // Check if rate limit is exceeded
    if (current.count > limit) {
      c.header(
        "Retry-After",
        Math.ceil((current.resetTime - now) / 1000).toString()
      );
      return c.json(
        {
          success: false,
          status: 429,
          message: "Too many requests, please try again later",
          retryAfter: Math.ceil((current.resetTime - now) / 1000),
        },
        429
      );
    }

    // Continue to the next middleware/handler
    await next();
  };
}
