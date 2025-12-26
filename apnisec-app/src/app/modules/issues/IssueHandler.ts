import { NextRequest, NextResponse } from "next/server";
import { BaseHandler } from "../../core/BaseHandler"; // Adjust path if needed
import { IssueService } from "./IssueService";
import { IssueValidator } from "./IssueValidator"; // This should now resolve
import { AppError } from "../../core/AppError"; // Adjusted path for consistency (assuming core in src/core)
import { CreateIssueData, UpdateIssueData } from "./types";

export class IssueHandler extends BaseHandler {
  private service: IssueService;

  constructor(service: IssueService) {
    super();
    this.service = service;
  }

  async handle(req: NextRequest): Promise<NextResponse> {
    const { pathname, searchParams } = req.nextUrl;
    let body: unknown = {};
    try {
      body = await req.json();
    } catch {
      // Handle non-JSON (e.g., DELETE), keep as {}
    }
    const token = req.headers.get("Authorization") || "";
    if (!token) throw new AppError("Unauthorized", 401);

    try {
      const pathParts = pathname.split("/");
      const id = pathParts[pathParts.length - 1]; // Safer split/pop

      if (req.method === "POST" && pathname.includes("/issues")) {
        const validator = IssueValidator.forCreate();
        const data: CreateIssueData = validator.validate(body);
        const result = await this.service.create(data, token);
        return this.json(result, 201);
      }

      if (req.method === "GET" && pathname.includes("/issues")) {
        if (!id || id === "issues") {
          // Handle list case better
          // List
          const type = searchParams.get("type");
          const result = await this.service.list(
            { type: type || undefined },
            token
          );
          return this.json(result);
        } else {
          // Single
          const result = await this.service.getOne(id, token);
          return this.json(result);
        }
      }

      if (req.method === "PUT" && id) {
        const validator = IssueValidator.forUpdate();
        const data: UpdateIssueData = validator.validate(body);
        const result = await this.service.update(id, data, token);
        return this.json(result);
      }

      if (req.method === "DELETE" && id) {
        const result = await this.service.delete(id, token);
        return this.json(result, 204);
      }

      throw new AppError("Method not allowed", 405);
    } catch (err) {
      return this.error(err as Error);
    }
  }
}
