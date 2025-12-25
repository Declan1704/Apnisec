import { z } from "zod";

export abstract class BaseValidator {
  protected schema: z.ZodSchema;

  constructor(schema: z.ZodSchema) {
    this.schema = schema;
  }

  validate(data: unknown): z.infer<typeof this.schema> {
    return this.schema.parse(data);
  }
}
