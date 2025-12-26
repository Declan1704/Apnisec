// src/modules/auth/AuthHandler.ts
import { NextRequest, NextResponse } from "next/server";
import { BaseHandler } from "../../core/BaseHandler";
import { AuthService } from "./AuthService";
import { AuthValidator } from "./AuthValidator";
import { JwtUtils } from "../../core/JwtUtils";
import { AppError } from "../../core/AppError";
import { RateLimiter } from "../../core/RateLimiter";

interface JwtPayload {
  userId: string;
  email: string;
}

export class AuthHandler extends BaseHandler {
  private service: AuthService;
  private jwtUtils: JwtUtils;

  constructor(service: AuthService, limiter: RateLimiter) {
    super(limiter); // ← uses the injected one
    this.service = service;
    this.jwtUtils = new JwtUtils(process.env.JWT_SECRET!);
  }

  async handle(req: NextRequest): Promise<NextResponse> {
    const { pathname } = req.nextUrl;

    // Extract token early for user-based rate limiting
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    let userId: string | undefined;
    if (token) {
      try {
        const decoded = this.jwtUtils.verify(token) as JwtPayload;
        userId = decoded.userId;
      } catch {
        // Invalid token — rate limit by IP only
      }
    }

    // Rate limiting
    let rateHeaders: Headers;
    try {
      if (!this.limiter) {
        throw new AppError("Rate limiter not initialized", 500);
      }
      rateHeaders = this.limiter.checkAndIncrement(req, userId);
    } catch (err) {
      return this.error(err as AppError);
    }

    let body: any = {};
    if (req.method === "POST") {
      try {
        body = await req.json();
      } catch {
        throw new AppError("Invalid JSON", 400);
      }
    }

    try {
      if (pathname.endsWith("/register")) {
        const validator = AuthValidator.forRegister();
        const data = validator.validate(body);
        const result = await this.service.register(data);
        return this.json(
          { user: result.user, token: result.token },
          201,
          rateHeaders
        );
      }

      if (pathname.endsWith("/login")) {
        const validator = AuthValidator.forLogin();
        const data = validator.validate(body);
        const result = await this.service.login(data.email, data.password);
        return this.json(
          { user: result.user, token: result.token },
          200,
          rateHeaders
        );
      }

      if (pathname.endsWith("/logout")) {
        return this.json(
          { message: "Logged out successfully" },
          200,
          rateHeaders
        );
      }

      if (pathname.endsWith("/me")) {
        if (!token) throw new AppError("No token provided", 401);
        const decoded = this.jwtUtils.verify(token) as JwtPayload;
        const result = await this.service.getMe(decoded.userId);
        return this.json(result, 200, rateHeaders);
      }

      throw new AppError("Not found", 404);
    } catch (err) {
      return this.error(err as Error);
    }
  }
}
