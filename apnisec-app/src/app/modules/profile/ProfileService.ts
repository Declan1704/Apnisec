import { UserRepository } from "../auth/UserRepository";
import { JwtUtils } from "../../core/JwtUtils";
import { AppError } from "../../core/AppError";
import { CustomJwtPayload } from "../../core/JwtUtils";
import { UpdateProfileData } from "./ProfileValidator";

export class ProfileService {
  private userRepo: UserRepository;
  private jwtUtils: JwtUtils;

  constructor(userRepo: UserRepository, jwtUtils: JwtUtils) {
    this.userRepo = userRepo;
    this.jwtUtils = jwtUtils;
  }

  async getProfile(token: string) {
    const decoded = this.jwtUtils.verify(
      token.replace("Bearer ", "")
    ) as CustomJwtPayload;
    const user = await this.userRepo.findById(decoded.userId);
    if (!user) throw new AppError("User not found", 404);
    return { id: user.id, email: user.email, name: user.name };
  }

  async updateProfile(data: UpdateProfileData, token: string) {
    const decoded = this.jwtUtils.verify(
      token.replace("Bearer ", "")
    ) as CustomJwtPayload;
    const user = await this.userRepo.findById(decoded.userId);
    if (!user) throw new AppError("User not found", 404);

    const updatedUser = await this.userRepo.update(decoded.userId, {
      name: data.name ?? user.name,
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    };
  }
}
