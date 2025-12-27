import { NextRequest, NextResponse } from "next/server";
import { BaseHandler } from "../../core/BaseHandler";
import { IssueService } from "./IssueService";
import { IssueValidator } from "./IssueValidator";
import { AppError } from "../../core/AppError";
import { JwtUtils } from "../../core/JwtUtils";
import { RateLimiter } from "../../core/RateLimiter";

type CreateIssueData = {
  type: "cloud-security" | "reteaming-assessment" | "vapt";
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: "open" | "in-progress" | "closed";
};

type UpdateIssueData = Partial<Omit<CreateIssueData, "type">>;

export class IssueHandler extends BaseHandler {
  private service: IssueService;
  private jwtUtils: JwtUtils;
  limiter: RateLimiter;

  constructor(service: IssueService, limiter: RateLimiter) {
    super(limiter);
    this.limiter = limiter;
    this.service = service;
    this.jwtUtils = new JwtUtils(process.env.JWT_SECRET!);
  }

  async handle(req: NextRequest): Promise<NextResponse> {
    const { pathname, searchParams } = req.nextUrl;
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      throw new AppError("Unauthorized: No token provided", 401);
    }

    // Verify token for userId (rate limiting by user)
    let userId: string;
    try {
      const decoded = this.jwtUtils.verify(token);
      userId = decoded.userId;
    } catch {
      throw new AppError("Unauthorized: Invalid token", 401);
    }

    // Rate limiting
    let rateHeaders: Headers;
    try {
      rateHeaders = this.limiter.checkAndIncrement(req, userId);
    } catch (err) {
      return this.error(err as AppError);
    }

    // Parse body only if needed
    let body: unknown = {};
    if (["POST", "PUT"].includes(req.method)) {
      try {
        body = await req.json();
      } catch {
        throw new AppError("Invalid JSON body", 400);
      }
    }

    try {
      // Extract segments after /api/
      const segments = pathname.split("/").filter(Boolean);
      const apiIndex = segments.indexOf("api");
      const pathAfterApi =
        apiIndex !== -1 ? segments.slice(apiIndex + 1) : segments;
      const id =
        pathAfterApi.length > 1 ? pathAfterApi[pathAfterApi.length - 1] : null;
      const isListOrCreate = pathAfterApi.join("/") === "issues";

      if (req.method === "POST") {
        if (!isListOrCreate) throw new AppError("Method not allowed", 405);
        const validator = IssueValidator.forCreate();
        const data = validator.validate(body) as CreateIssueData;
        const result = await this.service.create(data, `Bearer ${token}`);
        return this.json(result, 201, rateHeaders);
      }

      if (req.method === "GET") {
        if (isListOrCreate) {
          const type = searchParams.get("type") || undefined;
          const result = await this.service.list({ type }, `Bearer ${token}`);
          return this.json(result, 200, rateHeaders);
        } else {
          const result = await this.service.getOne(id!, `Bearer ${token}`);
          return this.json(result, 200, rateHeaders);
        }
      }

      if (req.method === "PUT") {
        if (!id || isListOrCreate) throw new AppError("ID required", 400);
        const validator = IssueValidator.forUpdate();
        const data = validator.validate(body) as UpdateIssueData;
        const result = await this.service.update(id, data, `Bearer ${token}`);
        return this.json(result, 200, rateHeaders);
      }

      if (req.method === "DELETE") {
        if (!id || isListOrCreate) throw new AppError("ID required", 400);
        await this.service.delete(id, `Bearer ${token}`); // Don't return message

        // 204 No Content — no body, but headers allowed
        const res = new NextResponse(null, { status: 204 });
        rateHeaders.forEach((value, key) => res.headers.set(key, value));
        return res;
      }

      throw new AppError("Method not allowed", 405);
    } catch (err) {
      return this.error(err as Error);
    }
  }
}
