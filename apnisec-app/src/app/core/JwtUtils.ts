import * as jwt from "jsonwebtoken";
import { AppError } from "./AppError";
import type { StringValue } from "ms";

export class JwtUtils {
  private secret: jwt.Secret;

  constructor(secret: string) {
    this.secret = secret;
  }

  sign(payload: object, expiresIn: StringValue | number = "15m"): string {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  verify(token: string): jwt.JwtPayload | string {
    try {
      return jwt.verify(token, this.secret);
    } catch {
      throw new AppError("Invalid token", 401);
    }
  }
}
