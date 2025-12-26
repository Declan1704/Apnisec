import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRepository } from "../../modules/auth/UserRepository";
import { IssueRepository } from "../../modules/issues/IssueRepository";
import { JwtUtils } from "../../core/JwtUtils";
import { IssueService } from "../../modules/issues/IssueService";
import { IssueHandler } from "../../modules/issues/IssueHandler";
import { RateLimiter } from "../../core/RateLimiter";
import { EmailService } from "../../core/EmailService";

const rateLimiter = new RateLimiter();
const userRepo = new UserRepository(prisma);
const issueRepo = new IssueRepository(prisma);
const jwtUtils = new JwtUtils(process.env.JWT_SECRET!);
const emailService = new EmailService(
  process.env.RESEND_API_KEY!,
  process.env.RESEND_FROM_EMAIL || "noreply@apnisec.com"
);
const issueService = new IssueService(
  issueRepo,
  userRepo,
  jwtUtils,
  emailService
);
export const issueHandler = new IssueHandler(issueService, rateLimiter);

export async function GET(req: NextRequest) {
  return issueHandler.handle(req);
}

export async function POST(req: NextRequest) {
  return issueHandler.handle(req);
}
