import { PrismaClient, Issue } from "../../../generated/prisma/client";
import { BaseRepository } from "../../core/BaseRepository";
import { AppError } from "../../core/AppError";

export class IssueRepository extends BaseRepository {
  async create(data: {
    type: string;
    title: string;
    description?: string;
    priority?: string;
    status?: string;
    userId: string;
  }): Promise<Issue> {
    return this.prisma.issue.create({ data });
  }

  async findByUser(
    userId: string,
    filters?: { type?: string }
  ): Promise<Issue[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId };
    if (filters?.type) where.type = filters.type;
    return this.prisma.issue.findMany({ where });
  }

  async findById(id: string): Promise<Issue | null> {
    return this.prisma.issue.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<Issue>): Promise<Issue> {
    return this.prisma.issue.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    const issue = await this.prisma.issue.findUnique({ where: { id } });
    if (!issue) throw new AppError("Issue not found", 404);
    await this.prisma.issue.delete({ where: { id } });
  }

  // Helper: Check ownership
  async isOwnedBy(id: string, userId: string): Promise<boolean> {
    const issue = await this.findById(id);
    return issue?.userId === userId;
  }
}
