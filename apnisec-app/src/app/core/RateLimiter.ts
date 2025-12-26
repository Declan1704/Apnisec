// src/core/RateLimiter.ts
import { NextRequest } from "next/server";
import { AppError } from "./AppError";

interface RateEntry {
  count: number;
  resetTime: Date;
}

export class RateLimiter {
  private requests: Map<string, RateEntry> = new Map();
  private limit = 100;
  private windowMs = 15 * 60 * 1000; // 15 minutes

  private getKey(req: NextRequest, userId?: string): string {
    if (userId) return `user:${userId}`;
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    return `ip:${ip}`;
  }

  public checkAndIncrement(req: NextRequest, userId?: string): Headers {
    const key = this.getKey(req, userId);
    const now = Date.now();

    let entry = this.requests.get(key);

    if (!entry || now > entry.resetTime.getTime()) {
      entry = { count: 1, resetTime: new Date(now + this.windowMs) };
    } else {
      if (entry.count >= this.limit) {
        throw new AppError("Rate limit exceeded", 429);
      }
      entry.count++;
    }

    this.requests.set(key, entry);

    const headers = new Headers();
    headers.set("X-RateLimit-Limit", this.limit.toString());
    headers.set("X-RateLimit-Remaining", (this.limit - entry.count).toString());
    headers.set(
      "X-RateLimit-Reset",
      Math.floor(entry.resetTime.getTime() / 1000).toString()
    );

    return headers;
  }

  // Optional: helper for 429 response headers
  public getHeaders(remaining = 0, resetOffset = 900) {
    const reset = Math.floor(Date.now() / 1000 + resetOffset);
    return {
      "X-RateLimit-Limit": this.limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": reset.toString(),
    };
  }
}
