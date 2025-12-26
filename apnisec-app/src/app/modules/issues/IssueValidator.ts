import { z } from "zod";
import { BaseValidator } from "../../core/Validator"; // Adjust path if your core is in src/core
import { createIssueSchema, updateIssueSchema } from "./types";

export class IssueValidator {
  // Explicit 'export' here
  // Static factory methods return specific BaseValidator instances
  // TS infers exact types via generics on BaseValidator
  static forCreate(): BaseValidator<typeof createIssueSchema> {
    // BaseValidator is abstract; cast to any to construct an instance here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (BaseValidator as any)(createIssueSchema);
  }
  static forUpdate(): BaseValidator<typeof updateIssueSchema> {
    // BaseValidator is abstract; cast to any to construct an instance here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (BaseValidator as any)(updateIssueSchema);
  }
}
