import { NextRequest, NextResponse } from "next/server";
import { BaseHandler } from "../../core/BaseHandler";
import { AuthService } from "./AuthService";
import { AuthValidator } from "./AuthValidator";
import { JwtUtils } from "../../core/JwtUtils";
import { AppError } from "@/app/core/AppError";
import { RateLimiter } from "../../core/RateLimiter";

export class AuthHandler extends BaseHandler {
  private service: AuthService;
  private rateLimiter: RateLimiter;
  constructor(service: AuthService) {
    super();
    this.service = service;
    this.rateLimiter = new RateLimiter();
  }

  async handle(req: NextRequest): Promise<NextResponse> {
    const { pathname } = req.nextUrl;
    let rateHeaders: HeadersInit = {};

    try {
      const rateInfo = await this.rateLimiter.check(req);
      rateHeaders = this.rateLimiter.getHeaders(rateInfo);
      if (pathname.includes("/register")) {
        const body = await req.json();
        const validator = AuthValidator.forRegister();
        const data = validator.validate(body) as {
          email: string;
          password: string;
          name?: string;
        };

        const result = await this.service.register(data);
        return this.json(result, 201, rateHeaders);
      }

      if (pathname.includes("/login")) {
        const body = await req.json();
        const validator = AuthValidator.forLogin();
        const data = validator.validate(body) as {
          email: string;
          password: string;
        };

        const result = await this.service.login(data.email, data.password);
        return this.json(result);
      }

      if (pathname.includes("/logout")) {
        await this.service.logout();
        return this.json({ message: "Logged out" });
      }

      if (pathname.includes("/me")) {
        const token = req.headers.get("Authorization")?.replace("Bearer ", "");

        if (!token) {
          throw new AppError("No token provided", 401);
        }

        const jwtUtils = new JwtUtils(process.env.JWT_SECRET!);
        const decoded = jwtUtils.verify(token);

        if (typeof decoded === "string") {
          throw new AppError("Invalid token payload", 401);
        }

        const result = await this.service.getMe(decoded.userId);
        return this.json(result);
      }

      throw new AppError("Route not found", 404);
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 429) {
        return NextResponse.json(
          { error: err.message },
          {
            status: 429,
            headers: {
              ...rateHeaders,
              ...this.rateLimiter.getHeaders({
                remaining: 0,
                reset: Math.floor(Date.now() / 1000 + 900),
                limit: 100,
              }),
            },
          }
        );
      }
      return this.error(err as Error);
    }
  }
}
