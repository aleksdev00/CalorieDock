import { z } from "zod"

export const waterEntryIdSchema = z.uuid("Invalid water entry identifier.")
export const waterUnitSchema = z.enum(["ml", "L", "oz"], { error: "Select a valid water unit." })
export const localDateSchema = z.iso.date({ error: "Select a valid date." })
export const timeZoneSchema = z.string().trim().min(1, "A timezone is required.").max(100, "Timezone is invalid.").regex(/^[A-Za-z0-9_+./-]+$/, "Timezone is invalid.")

export const waterEntrySchema = z.object({
  amount: z.number({ error: "Enter a valid amount." }).finite().positive("Amount must be greater than zero."),
  consumedAt: z.iso.datetime({ local: true, error: "Enter a valid consumption date and time." }),
  timeZone: timeZoneSchema,
})

export const waterPageQuerySchema = z.object({
  date: localDateSchema,
  timeZone: timeZoneSchema,
})

export type ValidatedWaterEntryInput = z.output<typeof waterEntrySchema>
