import { JwtUtils } from "../../core/JwtUtils";
import { IssueRepository } from "./IssueRepository";
import { UserRepository } from "../auth/UserRepository";
import { AppError } from "../../core/AppError";
import { z } from "zod";
import { createSchema } from "./IssueValidator";
import { CustomJwtPayload } from "../../core/JwtUtils";
import { Issue } from "@/generated/prisma/client";
import { CreateIssueData, UpdateIssueData } from "./types";
import { EmailService } from "../../core/EmailService";

export class IssueService {
  private issueRepo: IssueRepository;
  private userRepo: UserRepository;
  private jwtUtils: JwtUtils;
  private emailService?: EmailService;

  constructor(
    issueRepo: IssueRepository,
    userRepo: UserRepository,
    jwtUtils: JwtUtils,
    emailService?: EmailService
  ) {
    this.issueRepo = issueRepo;
    this.userRepo = userRepo;
    this.jwtUtils = jwtUtils;
    this.emailService = emailService;
  }

  async create(data: CreateIssueData, token: string) {
    const decoded = this.jwtUtils.verify(token.replace("Bearer ", ""));
    const user = await this.userRepo.findById(decoded.userId);
    if (!user) throw new AppError("User not found", 404);

    const issue = await this.issueRepo.create({ ...data, userId: user.id });

    if (this.emailService && user.email) {
      this.emailService
        .sendIssueCreated(user.email, {
          type: issue.type,
          title: issue.title,
          description: issue.description || undefined,
        })
        .catch(console.error);
    }

    return issue;
  }

  async list(filters: { type?: string }, token: string) {
    const decoded = this.jwtUtils.verify(
      token.replace("Bearer ", "")
    ) as CustomJwtPayload;
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
    return;
  }
}
