import { JwtUtils } from "../../core/JwtUtils";
import { IssueRepository } from "./IssueRepository";
import { UserRepository } from "../auth/UserRepository";
import { AppError } from "../../core/AppError";
import { z } from "zod";
import { createSchema } from "./IssueValidator";
import { CustomJwtPayload } from "../../core/JwtUtils";
import { Issue } from "@/generated/prisma/client";
import { CreateIssueData, UpdateIssueData } from "./types";

export class IssueService {
  private issueRepo: IssueRepository;
  private userRepo: UserRepository;
  private jwtUtils: JwtUtils;

  constructor(
    issueRepo: IssueRepository,
    userRepo: UserRepository,
    jwtUtils: JwtUtils
  ) {
    this.issueRepo = issueRepo;
    this.userRepo = userRepo;
    this.jwtUtils = jwtUtils;
  }

  async create(data: CreateIssueData, token: string) {
    const decoded: CustomJwtPayload = this.jwtUtils.verify(
      token.replace("Bearer ", "")
    );
    const user = await this.userRepo.findById(decoded.userId);
    if (!user) throw new AppError("User not found", 404);
    return this.issueRepo.create({ ...data, userId: user.id });
  }

  async list(filters: { type?: string }, token: string) {
    const decoded: CustomJwtPayload = this.jwtUtils.verify(
      token.replace("Bearer ", "")
    );
    return this.issueRepo.findByUser(decoded.userId, filters);
  }

  async getOne(id: string, token: string) {
    const issue = await this.issueRepo.findById(id);
    if (!issue) throw new AppError("Issue not found", 404);
    const decoded: CustomJwtPayload = this.jwtUtils.verify(
      token.replace("Bearer ", "")
    );
    if (issue.userId !== decoded.userId)
      throw new AppError("Unauthorized", 403);
    return issue;
  }

  async update(id: string, data: Partial<Issue>, token: string) {
    const issue = await this.issueRepo.findById(id);
    if (!issue) throw new AppError("Issue not found", 404);
    const decoded: CustomJwtPayload = this.jwtUtils.verify(
      token.replace("Bearer ", "")
    );
    if (issue.userId !== decoded.userId)
      throw new AppError("Unauthorized", 403);
    return this.issueRepo.update(id, data);
  }

  async delete(id: string, token: string) {
    const issue = await this.issueRepo.findById(id);
    if (!issue) throw new AppError("Issue not found", 404);
    const decoded: CustomJwtPayload = this.jwtUtils.verify(
      token.replace("Bearer ", "")
    );
    if (issue.userId !== decoded.userId)
      throw new AppError("Unauthorized", 403);
    await this.issueRepo.delete(id);
    return { message: "Issue deleted" };
  }
}
