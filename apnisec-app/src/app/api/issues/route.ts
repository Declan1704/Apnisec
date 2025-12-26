import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRepository } from "../../modules/auth/UserRepository";
import { IssueRepository } from "../../modules/issues/IssueRepository";
import { JwtUtils } from "../../core/JwtUtils";
import { IssueService } from "../../modules/issues/IssueService";
import { IssueHandler } from "../../modules/issues/IssueHandler";
import { RateLimiter } from "../../core/RateLimiter"; // ← Add this import

// Create shared instances
const userRepo = new UserRepository(prisma);
const issueRepo = new IssueRepository(prisma);
const jwtUtils = new JwtUtils(process.env.JWT_SECRET!);
const issueService = new IssueService(issueRepo, userRepo, jwtUtils);

// ← Create ONE RateLimiter instance (100 requests / 15 minutes)
const limiter = new RateLimiter();

// ← Pass limiter to IssueHandler
const issueHandler = new IssueHandler(issueService, limiter);

export async function GET(req: NextRequest) {
  return issueHandler.handle(req);
}

export async function POST(req: NextRequest) {
  return issueHandler.handle(req);
}
