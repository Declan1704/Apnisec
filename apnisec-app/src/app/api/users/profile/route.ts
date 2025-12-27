import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRepository } from "../../../modules/auth/UserRepository";
import { JwtUtils } from "../../../core/JwtUtils";
import { ProfileService } from "../../../modules/profile/ProfileService";
import { ProfileHandler } from "../../../modules/profile/ProfileHandler";
import { RateLimiter } from "@/app/core/RateLimiter";

const userRepo = new UserRepository(prisma);
const jwtUtils = new JwtUtils(process.env.JWT_SECRET!);
const profileService = new ProfileService(userRepo, jwtUtils);
const profileHandler = new ProfileHandler(profileService, new RateLimiter()); // 100 requests per minute

export async function GET(req: NextRequest) {
  return profileHandler.handle(req);
}

export async function PUT(req: NextRequest) {
  return profileHandler.handle(req);
}
