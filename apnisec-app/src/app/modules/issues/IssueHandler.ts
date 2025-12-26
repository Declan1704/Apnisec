import { NextRequest, NextResponse } from "next/server";
import { BaseHandler } from "../../core/BaseHandler";
import { IssueService } from "./IssueService";
import { IssueValidator } from "./IssueValidator";
import { z } from "zod";
import { AppError } from "@/app/core/AppError";
import { CreateIssueData, UpdateIssueData } from "./types";

export class IssueHandler extends BaseHandler {
  private service: IssueService;

  constructor(service: IssueService) {
    super();
    this.service = service;
  }

  async handle(req: NextRequest): Promise<NextResponse> {
    const { pathname, searchParams } = req.nextUrl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = await req.json().catch(() => ({} as any));
    const token = req.headers.get("Authorization") || "";
    if (!token) throw new AppError("Unauthorized", 401);

    try {
      const id = pathname.split("/").pop(); // For /issues/[id]

      if (req.method === "POST" && pathname.includes("/issues")) {
        const validator = IssueValidator.forCreate();
        const data: CreateIssueData = validator.validate(body); // Now explicitly typed
        const result = await this.service.create(data, token);
        return this.json(result, 201);
      }

      if (req.method === "GET" && pathname.includes("/issues")) {
        if (id === "issues" || !id) {
          // List
          const type = searchParams.get("type");
          const result = await this.service.list(
            { type: type || undefined },
            token
          );
          return this.json(result);
        } else {
          // Single
          const result = await this.service.getOne(id!, token);
          return this.json(result);
        }
      }

      if (req.method === "PUT" && id) {
        const validator = IssueValidator.forUpdate();
        const data: UpdateIssueData = validator.validate(body); // Explicit
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
