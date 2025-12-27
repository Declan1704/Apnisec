import { NextRequest } from "next/server";
import { BaseHandler } from "../../core/BaseHandler";
import { ProfileService } from "./ProfileService";
import { ProfileValidator } from "./ProfileValidator";
import { AppError } from "../../core/AppError";

export class ProfileHandler extends BaseHandler {
  private service: ProfileService;

  constructor(service: ProfileService) {
    super();
    this.service = service;
  }

  async handle(req: NextRequest) {
    const token = req.headers.get("Authorization") || "";
    if (!token) throw new AppError("Unauthorized", 401);

    try {
      if (req.method === "GET") {
        const profile = await this.service.getProfile(token);
        return this.json(profile);
      }

      if (req.method === "PUT") {
        const body = await req.json().catch(() => ({}));
        const validator = ProfileValidator.forUpdate();
        const data = validator.validate(body);
        const updated = await this.service.updateProfile(data, token);
        return this.json(updated);
      }

      throw new AppError("Method not allowed", 405);
    } catch (err) {
      return this.error(err as Error);
    }
  }
}
