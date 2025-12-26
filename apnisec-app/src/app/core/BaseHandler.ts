// src/core/BaseHandler.ts
import { NextRequest, NextResponse } from "next/server";
import { AppError } from "./AppError";
import { RateLimiter } from "./RateLimiter";

export abstract class BaseHandler {
  protected limiter?: RateLimiter;

  constructor(limiter: RateLimiter) {
    this.limiter = limiter;
  }

  abstract handle(req: NextRequest): Promise<NextResponse>;

  protected json(
    data: unknown,
    status: number = 200,
    rateHeaders?: Headers
  ): NextResponse {
    const res = NextResponse.json(data, { status });

    if (rateHeaders) {
      rateHeaders.forEach((value, key) => {
        res.headers.set(key, value);
      });
    }

    return res;
  }

  protected error(err: AppError | Error): NextResponse {
    const status = err instanceof AppError ? err.statusCode : 500;
    const message =
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message;

    return NextResponse.json({ error: message }, { status });
  }
}
