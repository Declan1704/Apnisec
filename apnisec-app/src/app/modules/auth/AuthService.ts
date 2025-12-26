import bcrypt from "bcryptjs";
import { JwtUtils } from "../../core/JwtUtils";
import { UserRepository } from "./UserRepository";
import { AppError } from "../../core/AppError";
import { CustomJwtPayload } from "../../core/JwtUtils";

export class AuthService {
  private userRepo: UserRepository;
  private jwtUtils: JwtUtils;
  private saltRounds = 12;

  constructor(userRepo: UserRepository, jwtUtils: JwtUtils) {
    this.userRepo = userRepo;
    this.jwtUtils = jwtUtils;
  }

  async register(data: { email: string; password: string; name?: string }) {
    const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);
    const user = await this.userRepo.create({
      ...data,
      password: hashedPassword,
    });
    const token = this.jwtUtils.sign({ userId: user.id, email: user.email });
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError("Invalid credentials", 401);
    }
    const token = this.jwtUtils.sign({ userId: user.id, email: user.email });
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }

  async getMe(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return { id: user.id, email: user.email, name: user.name };
  }

  async logout() {
    return { message: "Logged out successfully" };
  }
}
