import { z } from "zod";

const VALID_RECURRENCES = ["none", "weekly", "monthly"] as const;
const VALID_UNITS = ["commits", "prs", "hours", "streak", "language"] as const;

export const createGoalSchema = z
  .object({
    title: z
      .string({
        message: "title must be a non-empty string",
      })
      .min(1, { message: "title must not be empty" })
      .max(100, { message: "title must be 100 characters or fewer" }),
    target: z
      .number({
        message: "target must be an integer between 1 and 10000",
      })
      .int({ message: "target must be an integer between 1 and 10000" })
      .min(1, { message: "target must be an integer between 1 and 10000" })
      .max(10000, { message: "target must be an integer between 1 and 10000" }),
    unit: z.any().optional(),
    recurrence: z
      .string({
        message: "recurrence must be 'none', 'weekly', or 'monthly'",
      })
      .optional()
      .refine((val) => val === undefined || VALID_RECURRENCES.includes(val as any), {
        message: "recurrence must be 'none', 'weekly', or 'monthly'",
      })
      .default("none"),
    deadline: z
      .string({
        message: "deadline must be a valid date string",
      })
      .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "deadline must be a valid date string",
      })
      .nullable()
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (val.unit === undefined || typeof val.unit !== "string" || !VALID_UNITS.includes(val.unit as any)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "unit must be commits, prs, hours, streak, or language",
        path: ["unit"],
      });
    }
  });

export const patchGoalSchema = z
  .object({
    title: z
      .string({
        message: "title must be a non-empty string",
      })
      .min(1, { message: "title must not be empty" })
      .max(100, { message: "title must be 100 characters or fewer" })
      .optional(),
    target: z
      .number({
        message: "target must be an integer between 1 and 10000",
      })
      .int({ message: "target must be an integer between 1 and 10000" })
      .min(1, { message: "target must be an integer between 1 and 10000" })
      .max(10000, { message: "target must be an integer between 1 and 10000" })
      .optional(),
    unit: z.any().optional(),
    recurrence: z
      .string({
        message: "recurrence must be 'none', 'weekly', or 'monthly'",
      })
      .optional()
      .refine((val) => val === undefined || VALID_RECURRENCES.includes(val as any), {
        message: "recurrence must be 'none', 'weekly', or 'monthly'",
      }),
    current: z
      .number({
        message: "current must be a non-negative integer",
      })
      .int({ message: "current must be a non-negative integer" })
      .min(0, { message: "current must be a non-negative integer" })
      .optional(),
    is_public: z
      .boolean({
        message: "is_public must be a boolean",
      })
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (val.unit !== undefined) {
      if (typeof val.unit !== "string" || !VALID_UNITS.includes(val.unit as any)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "unit must be commits, prs, hours, streak, or language",
          path: ["unit"],
        });
      }
    }
  });

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type PatchGoalInput = z.infer<typeof patchGoalSchema>;
