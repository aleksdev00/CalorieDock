import type { Database } from "@/types/database"

export type WeightUnit = Database["public"]["Tables"]["user_preferences"]["Row"]["weight_unit"]
export type HeightUnit = Database["public"]["Tables"]["user_preferences"]["Row"]["height_unit"]
export type Language = Database["public"]["Tables"]["user_preferences"]["Row"]["language"]
export type Theme = Database["public"]["Tables"]["user_preferences"]["Row"]["theme"]
export type WaterUnit = Database["public"]["Tables"]["user_preferences"]["Row"]["water_unit"]

export interface NotificationPreferences {
  water_reminders: boolean
  daily_reminders: boolean
  goal_completion_notifications: boolean
}

export interface SettingsInput {
  weightUnit: WeightUnit
  heightUnit: HeightUnit
  waterUnit: WaterUnit
  language: Language
  theme: Theme
  notificationPreferences: NotificationPreferences
}

export interface SettingsPageData extends SettingsInput {
  email: string
}

export interface SettingsActionState {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Record<string, string[]>
}
