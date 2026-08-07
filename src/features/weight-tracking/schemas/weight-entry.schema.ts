import { z } from "zod"

export const weightEntryIdSchema = z.uuid("Invalid weight entry identifier.")

export const weightEntrySchema = z.object({
  weight: z.number({ error: "Enter a valid weight." }).finite().positive("Weight must be greater than zero.").max(2000, "Weight is too large."),
  recordedAt: z.iso.datetime({ local: true, error: "Enter a valid measurement date and time." }),
  note: z.string().trim().max(500, "Note must contain at most 500 characters.").refine((value) => !/[\u0000-\u001f\u007f]/.test(value), "Note contains unsupported characters."),
})

export type ValidatedWeightEntryInput = z.output<typeof weightEntrySchema>
