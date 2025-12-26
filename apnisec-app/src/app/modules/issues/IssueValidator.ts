import { z } from "zod";
import { BaseValidator } from "../../core/Validator";

import { createIssueSchema, updateIssueSchema } from "./types";

export const createSchema = z.object({
  type: z.enum(["cloud-security", "reteaming-assessment", "vapt"] as const, {
    message: "Invalid issue type",
  }),
  title: z.string().min(1, "Title required").max(255),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["open", "in-progress", "closed"]).optional(),
});

const updateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["open", "in-progress", "closed"]).optional(),
});

export class IssueValidator extends BaseValidator {
  static forCreate() {
    return new IssueValidator(createIssueSchema);
  }

  static forUpdate() {
    return new IssueValidator(updateIssueSchema);
  }
}
