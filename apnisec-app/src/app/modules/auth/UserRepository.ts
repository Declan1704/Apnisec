import { PrismaClient, User } from "../../../generated/prisma/client";
import { BaseRepository } from "../../core/BaseRepository";
import { AppError } from "../../core/AppError";

export class UserRepository extends BaseRepository {
  async create(data: {
    email: string;
    name?: string;
    password: string;
  }): Promise<User> {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new AppError("User already exists", 409);
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }
}
