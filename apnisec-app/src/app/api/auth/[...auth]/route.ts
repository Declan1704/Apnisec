import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRepository } from "../../../modules/auth/UserRepository";
import { AuthService } from "../../../modules/auth/AuthService";
import { JwtUtils } from "../../../core/JwtUtils";
import { AuthHandler } from "../../../modules/auth/AuthHandler";
import { EmailService } from "../../../core/EmailService";
import { RateLimiter } from "../../../core/RateLimiter";

const emailService = new EmailService(
  process.env.RESEND_API_KEY!,
  process.env.RESEND_FROM_EMAIL || "noreply@apnisec.local"
);
const userRepo = new UserRepository(prisma);
const jwtUtils = new JwtUtils(process.env.JWT_SECRET!);
const rateLimiter = new RateLimiter();
const authService = new AuthService(userRepo, jwtUtils, emailService);
const authHandler = new AuthHandler(authService, rateLimiter);

export async function POST(req: NextRequest) {
  return authHandler.handle(req);
}

export async function GET(req: NextRequest) {
  return authHandler.handle(req);
}
