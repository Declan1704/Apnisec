import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRepository } from "../../modules/auth/UserRepository";
import { IssueRepository } from "../../modules/issues/IssueRepository";
import { JwtUtils } from "../../core/JwtUtils";
import { IssueService } from "../../modules/issues/IssueService";
import { IssueHandler } from "../../modules/issues/IssueHandler";

const userRepo = new UserRepository(prisma);
const issueRepo = new IssueRepository(prisma);
const jwtUtils = new JwtUtils(process.env.JWT_SECRET!);
const issueService = new IssueService(issueRepo, userRepo, jwtUtils);
const issueHandler = new IssueHandler(issueService);

export async function GET(req: NextRequest) {
  return issueHandler.handle(req);
}

export async function POST(req: NextRequest) {
  return issueHandler.handle(req);
}
