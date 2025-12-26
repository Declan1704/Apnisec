import { z } from "zod";

export const createIssueSchema = z.object({
  type: z.enum(["cloud-security", "reteaming-assessment", "vapt"] as const, {
    error: "Invalid issue type",
  }),
  title: z.string().min(1, "Title required").max(255),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"] as const).optional(),
  status: z.enum(["open", "in-progress", "closed"] as const).optional(),
});

export const updateIssueSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["open", "in-progress", "closed"]).optional(),
});

// Export inferred types
export type CreateIssueData = z.infer<typeof createIssueSchema>;
export type UpdateIssueData = z.infer<typeof updateIssueSchema>;
export type IssueType = z.infer<typeof createIssueSchema.shape.type>; // 'cloud-security' | etc.
