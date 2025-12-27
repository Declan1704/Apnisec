import { z } from "zod";
import { BaseValidator } from "../../core/Validator"; // Adjust path

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).optional(),
});

export class ProfileValidator {
  static forUpdate(): BaseValidator<typeof updateProfileSchema> {
    return new BaseValidator(updateProfileSchema);
  }
}

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
