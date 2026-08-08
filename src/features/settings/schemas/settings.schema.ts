import { z } from "zod"

export const notificationPreferencesSchema = z.object({
  water_reminders: z.boolean(),
  daily_reminders: z.boolean(),
  goal_completion_notifications: z.boolean(),
}).strict()

export const settingsSchema = z.object({
  weightUnit: z.enum(["kg", "lbs"]),
  heightUnit: z.enum(["cm", "ft/in"]),
  waterUnit: z.enum(["ml", "L", "oz"]),
  language: z.enum(["en", "sr"]),
  theme: z.enum(["system", "light", "dark"]),
  notificationPreferences: notificationPreferencesSchema,
}).strict()

export type ValidatedSettingsInput = z.output<typeof settingsSchema>
