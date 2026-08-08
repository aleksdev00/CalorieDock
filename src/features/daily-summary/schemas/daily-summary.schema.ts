import { z } from "zod"

export const dailySummaryDateSchema = z.iso.date({ error: "Select a valid date." })
export const dailySummaryTimeZoneSchema = z
  .string()
  .trim()
  .min(1, "A timezone is required.")
  .max(100, "Timezone is invalid.")
  .regex(/^[A-Za-z0-9_+./-]+$/, "Timezone is invalid.")

export const dailySummaryQuerySchema = z.object({
  date: dailySummaryDateSchema,
  timeZone: dailySummaryTimeZoneSchema,
})
