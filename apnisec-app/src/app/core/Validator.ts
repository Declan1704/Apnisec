import { z, ZodType } from "zod";

export class BaseValidator<T extends ZodType> {
  protected schema: T;

  constructor(schema: T) {
    this.schema = schema;
  }

  validate(data: unknown): z.infer<T> {
    // Now infers exact shape from T
    return this.schema.parse(data);
  }
}
