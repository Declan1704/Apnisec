import { NextRequest, NextResponse } from "next/server";
import { BaseHandler } from "../../core/BaseHandler";
import { AuthService } from "./AuthService";
import { AuthValidator } from "./AuthValidator";
import { JwtUtils } from "../../core/JwtUtils";

export class AuthHandler extends BaseHandler {
  private service: AuthService;

  constructor(service: AuthService) {
    super();
    this.service = service;
  }

  async handle(req: NextRequest): Promise<NextResponse> {
    const { pathname } = req.nextUrl;
    const body = await req.json();

    try {
      if (pathname.includes("/register")) {
        const validator = AuthValidator.forRegister();
        const data = validator.validate(body);
        const result = await this.service.register(data);
        return this.json(result, 201);
      }

      if (pathname.includes("/login")) {
        const validator = AuthValidator.forLogin();
        const data = validator.validate(body);
        const result = await this.service.login(data.email, data.password);
        return this.json(result);
      }

      if (pathname.includes("/logout")) {
        await this.service.logout();
        return this.json({ message: "Logged out" });
      }

      if (pathname.includes("/me")) {
        const token = req.headers.get("Authorization")?.replace("Bearer ", "");
        if (!token) throw new AppError("No token provided", 401);
        const jwtUtils = new JwtUtils(process.env.JWT_SECRET!); // Temp; better inject
        const decoded = jwtUtils.verify(token);
        const result = await this.service.getMe(decoded.userId);
        return this.json(result);
      }

      throw new AppError("Route not found", 404);
    } catch (err) {
      return this.error(err as Error);
    }
  }
}
