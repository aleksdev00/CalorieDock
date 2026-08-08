import "server-only"

import { createClient } from "@/services/supabase/server"
import type { ActionResult, ApiError } from "@/types/api"
import type { ValidatedSettingsInput } from "../schemas/settings.schema"
import type { NotificationPreferences, SettingsPageData, Theme } from "../types"

const COLUMNS = "weight_unit, height_unit, water_unit, language, theme, notification_preferences"
const AUTH_ERROR: ApiError = { code: "UNAUTHENTICATED", message: "Sign in to manage settings." }
const LOAD_ERROR: ApiError = { code: "SETTINGS_LOAD_FAILED", message: "Unable to load your settings. Please try again." }
const SAVE_ERROR: ApiError = { code: "SETTINGS_SAVE_FAILED", message: "Your settings could not be saved. Please try again." }
const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  water_reminders: false,
  daily_reminders: false,
  goal_completion_notifications: false,
}

function logDevelopmentDatabaseError(operation: string, error: { code?: string; message?: string; details?: string; hint?: string }) {
  if (process.env.NODE_ENV !== "development") return
  console.error(`[settings] ${operation} failed`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  })
}

function normalizeNotifications(value: unknown): NotificationPreferences {
  if (!value || typeof value !== "object" || Array.isArray(value)) return DEFAULT_NOTIFICATIONS
  const record = value as Record<string, unknown>
  return {
    water_reminders: typeof record.water_reminders === "boolean" ? record.water_reminders : false,
    daily_reminders: typeof record.daily_reminders === "boolean" ? record.daily_reminders : false,
    goal_completion_notifications: typeof record.goal_completion_notifications === "boolean" ? record.goal_completion_notifications : false,
  }
}

export async function getSettings(): Promise<ActionResult<SettingsPageData>> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { success: false, error: AUTH_ERROR }

  const { data, error } = await supabase.from("user_preferences").select(COLUMNS).eq("user_id", user.id).maybeSingle()
  if (error) return { success: false, error: LOAD_ERROR }

  let preferences = data
  if (!preferences) {
    const created = await supabase.from("user_preferences").insert({ user_id: user.id }).select(COLUMNS).single()
    if (created.error) return { success: false, error: LOAD_ERROR }
    preferences = created.data
  }

  return {
    success: true,
    data: {
      email: user.email ?? "",
      weightUnit: preferences.weight_unit,
      heightUnit: preferences.height_unit,
      waterUnit: preferences.water_unit,
      language: preferences.language,
      theme: preferences.theme,
      notificationPreferences: normalizeNotifications(preferences.notification_preferences),
    },
  }
}

export async function getThemePreference(): Promise<Theme> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return "system"
  const { data } = await supabase.from("user_preferences").select("theme").eq("user_id", user.id).maybeSingle()
  return data?.theme ?? "system"
}

export async function updateSettings(input: ValidatedSettingsInput): Promise<ActionResult<void>> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { success: false, error: AUTH_ERROR }

  const { error } = await supabase.from("user_preferences").update({
    weight_unit: input.weightUnit,
    height_unit: input.heightUnit,
    water_unit: input.waterUnit,
    language: input.language,
    theme: input.theme,
    notification_preferences: input.notificationPreferences,
  }).eq("user_id", user.id)

  if (error) {
    logDevelopmentDatabaseError("update preferences", error)
    return { success: false, error: SAVE_ERROR }
  }
  return { success: true, data: undefined }
}
