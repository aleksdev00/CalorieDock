import { z } from "zod"

const today = new Date()
const todayDate = new Date(
  Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
)

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Enter your full name.")
    .max(100, "Full name must contain at most 100 characters.")
    .regex(
      /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u,
      "Full name contains unsupported characters.",
    ),
  dateOfBirth: z
    .string()
    .refine(
      (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
      "Enter a valid date of birth.",
    )
    .refine((value) => {
      if (!value) return true

      const date = new Date(`${value}T00:00:00.000Z`)
      return !Number.isNaN(date.getTime()) && date <= todayDate
    }, "Date of birth cannot be in the future.")
    .refine(
      (value) => value === "" || value >= "1900-01-01",
      "Enter a realistic date of birth.",
    ),
  goal: z
    .enum(["", "weight_loss", "maintenance", "weight_gain"])
    .refine((value) => value !== "", "Choose a goal."),
  unitSystem: z.enum(["metric", "imperial"], {
    error: "Choose a unit system.",
  }),
})
