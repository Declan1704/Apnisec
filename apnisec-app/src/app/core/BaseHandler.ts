import { NextRequest, NextResponse } from "next/server";
import { AppError } from "./AppError";

export abstract class BaseHandler {
  abstract handle(req: NextRequest): Promise<NextResponse>;

  protected json(data: unknown, status: number = 200): NextResponse {
    return NextResponse.json(data, { status });
  }

  protected error(err: AppError | Error): NextResponse {
    const status = err instanceof AppError ? err.statusCode : 500;
    const message =
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message;
    return this.json({ error: message }, status);
  }
}
