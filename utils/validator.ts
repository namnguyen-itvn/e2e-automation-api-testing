import { ZodSchema } from 'zod';

export function validateSchema<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error('Schema validation failed: ' + JSON.stringify(result.error.issues));
  }
  return result.data;
}
