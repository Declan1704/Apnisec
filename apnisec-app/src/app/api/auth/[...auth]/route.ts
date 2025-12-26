import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRepository } from "../../../modules/auth/UserRepository";
import { AuthService } from "../../../modules/auth/AuthService";
import { JwtUtils } from "../../../core/JwtUtils";
import { AuthHandler } from "../../../modules/auth/AuthHandler";

const userRepo = new UserRepository(prisma);
const jwtUtils = new JwtUtils(process.env.JWT_SECRET!);
const authService = new AuthService(userRepo, jwtUtils);
const authHandler = new AuthHandler(authService);

export async function POST(req: NextRequest) {
  return authHandler.handle(req);
}

export async function GET(req: NextRequest) {
  return authHandler.handle(req);
}
