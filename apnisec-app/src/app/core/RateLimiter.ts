import { AppError } from "./AppError";

export class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> =
    new Map();
  private windowMs: number = 15 * 60 * 1000; // 15 mins
  private maxRequests: number = 100;

  constructor() {
    // Cleanup expired entries every 5 mins
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  private getKey(req: Request): string {
    return (
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "anonymous"
    ); // IP fallback
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now - entry.resetTime > this.windowMs) {
        this.requests.delete(key);
      }
    }
  }

  async check(
    req: Request
  ): Promise<{ remaining: number; reset: number; limit: number }> {
    const key = this.getKey(req);
    const now = Date.now();
    let entry = this.requests.get(key);

    if (!entry || now - entry.resetTime > this.windowMs) {
      entry = { count: 1, resetTime: now };
      this.requests.set(key, entry);
      return {
        remaining: this.maxRequests - 1,
        reset: Math.floor((now + this.windowMs) / 1000),
        limit: this.maxRequests,
      };
    }

    if (entry.count >= this.maxRequests) {
      throw new AppError("Rate limit exceeded. Try again later.", 429);
    }

    entry.count++;
    return {
      remaining: this.maxRequests - entry.count,
      reset: Math.floor((entry.resetTime + this.windowMs) / 1000),
      limit: this.maxRequests,
    };
  }

  // For headers
  getHeaders(stats: {
    remaining: number;
    reset: number;
    limit: number;
  }): HeadersInit {
    return {
      "X-RateLimit-Limit": stats.limit.toString(),
      "X-RateLimit-Remaining": stats.remaining.toString(),
      "X-RateLimit-Reset": stats.reset.toString(),
    };
  }
}
