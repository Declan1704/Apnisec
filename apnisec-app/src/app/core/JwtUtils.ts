import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { AppError } from "./AppError";

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
}

export class JwtUtils {
  private secret: jwt.Secret;

  constructor(secret: string) {
    this.secret = secret;
  }

  sign(
    payload: { userId: string; email: string },
    expiresIn: SignOptions["expiresIn"] = "15m"
  ): string {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  verify(token: string): CustomJwtPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as CustomJwtPayload;

      if (typeof decoded === "string") {
        throw new AppError("Invalid token payload", 401);
      }

      return decoded;
    } catch {
      throw new AppError("Invalid token", 401);
    }
  }
}
