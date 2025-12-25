import { z } from "zod";
import { BaseValidator } from "../../core/Validator";

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 chars"),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

export class AuthValidator extends BaseValidator {
  static forRegister() {
    return new AuthValidator(registerSchema);
  }

  static forLogin() {
    return new AuthValidator(loginSchema);
  }
}
