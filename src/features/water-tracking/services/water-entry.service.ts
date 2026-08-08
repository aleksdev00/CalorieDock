import "server-only"

import { createClient } from "@/services/supabase/server"
import type { ActionResult, ApiError } from "@/types/api"
import type { WaterUnit } from "@/types/database"
import type { ValidatedWaterEntryInput } from "../schemas/water-entry.schema"
import type { WaterEntry, WaterPageData } from "../types"
import { isValidTimeZone, localDateTimeToUtc, selectedDayUtcRange } from "../utils/date-time"
import { displayToMillilitres } from "../utils/water"

const COLUMNS = "id, user_id, amount_ml, consumed_at, created_at"
const AUTH_ERROR: ApiError = { code: "UNAUTHENTICATED", message: "Sign in to manage water entries." }
const LOAD_ERROR: ApiError = { code: "WATER_LOAD_FAILED", message: "Unable to load your water history. Please try again." }
const SAVE_ERROR: ApiError = { code: "WATER_SAVE_FAILED", message: "Your water entry could not be saved. Please try again." }
const PREFERENCE_ERROR: ApiError = { code: "PREFERENCE_SAVE_FAILED", message: "Your water unit could not be saved. Please try again." }
const NOT_FOUND: ApiError = { code: "NOT_FOUND", message: "Water entry not found." }

function logDevelopmentDatabaseError(operation: string, error: { code?: string; message?: string; details?: string; hint?: string }) {
  if (process.env.NODE_ENV !== "development") return
  console.error(`[water-tracking] ${operation} failed`, { code: error.code, message: error.message, details: error.details, hint: error.hint })
}

async function authenticatedContext() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { supabase, user: error ? null : user }
}

async function getOrCreateWaterUnit(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<ActionResult<WaterUnit>> {
  const { data, error } = await supabase.from("user_preferences").select("water_unit").eq("user_id", userId).maybeSingle()
  if (error) return { success: false, error: LOAD_ERROR }
  if (data) return { success: true, data: data.water_unit }
  const { data: created, error: createError } = await supabase.from("user_preferences").insert({ user_id: userId }).select("water_unit").single()
  return createError ? { success: false, error: LOAD_ERROR } : { success: true, data: created.water_unit }
}

function canonicalWrite(input: ValidatedWaterEntryInput, unit: WaterUnit): ActionResult<{ amount_ml: number; consumed_at: string }> {
  if (!isValidTimeZone(input.timeZone)) return { success: false, error: { code: "VALIDATION_ERROR", message: "The selected timezone is invalid.", fieldErrors: { timeZone: ["Refresh the page and try again."] } } }
  const amountMl = displayToMillilitres(input.amount, unit)
  if (!Number.isFinite(amountMl) || amountMl <= 0) return { success: false, error: { code: "VALIDATION_ERROR", message: "Enter a valid water amount.", fieldErrors: { amount: ["Amount must be greater than zero."] } } }
  try { return { success: true, data: { amount_ml: amountMl, consumed_at: localDateTimeToUtc(input.consumedAt, input.timeZone) } } }
  catch { return { success: false, error: { code: "VALIDATION_ERROR", message: "Enter a valid local consumption time.", fieldErrors: { consumedAt: ["This local time is unavailable in the selected timezone."] } } } }
}

export async function getWaterPageData(selectedDate: string, timeZone: string): Promise<ActionResult<WaterPageData>> {
  const { supabase, user } = await authenticatedContext()
  if (!user) return { success: false, error: AUTH_ERROR }
  if (!isValidTimeZone(timeZone)) return { success: false, error: { code: "VALIDATION_ERROR", message: "The browser timezone is invalid." } }
  let range
  try { range = selectedDayUtcRange(selectedDate, timeZone) } catch { return { success: false, error: { code: "VALIDATION_ERROR", message: "The selected local day is invalid." } } }
  const preference = await getOrCreateWaterUnit(supabase, user.id)
  if (!preference.success) return preference
  const [historyResult, dayResult] = await Promise.all([
    supabase.from("water_entries").select(COLUMNS).eq("user_id", user.id).order("consumed_at", { ascending: false }).order("id", { ascending: false }),
    supabase.from("water_entries").select("amount_ml").eq("user_id", user.id).gte("consumed_at", range.startUtc).lt("consumed_at", range.endUtc),
  ])
  if (historyResult.error || dayResult.error) return { success: false, error: LOAD_ERROR }
  const dailyTotalMl = dayResult.data.reduce((total, entry) => total + Number(entry.amount_ml), 0)
  return { success: true, data: { entries: historyResult.data as WaterEntry[], dailyTotalMl, selectedDate, timeZone, waterUnit: preference.data } }
}

export async function getWaterEntry(id: string): Promise<ActionResult<{ entry: WaterEntry; waterUnit: WaterUnit }>> {
  const { supabase, user } = await authenticatedContext()
  if (!user) return { success: false, error: AUTH_ERROR }
  const preference = await getOrCreateWaterUnit(supabase, user.id)
  if (!preference.success) return preference
  const { data, error } = await supabase.from("water_entries").select(COLUMNS).eq("id", id).eq("user_id", user.id).maybeSingle()
  if (error) return { success: false, error: LOAD_ERROR }
  return data ? { success: true, data: { entry: data as WaterEntry, waterUnit: preference.data } } : { success: false, error: NOT_FOUND }
}

export async function createWaterEntry(input: ValidatedWaterEntryInput): Promise<ActionResult<WaterEntry>> {
  const { supabase, user } = await authenticatedContext()
  if (!user) return { success: false, error: AUTH_ERROR }
  const preference = await getOrCreateWaterUnit(supabase, user.id)
  if (!preference.success) return { success: false, error: SAVE_ERROR }
  const write = canonicalWrite(input, preference.data)
  if (!write.success) return write
  const { data, error } = await supabase.from("water_entries").insert({ user_id: user.id, ...write.data }).select(COLUMNS).single()
  return error ? { success: false, error: SAVE_ERROR } : { success: true, data: data as WaterEntry }
}

export async function updateWaterEntry(id: string, input: ValidatedWaterEntryInput): Promise<ActionResult<WaterEntry>> {
  const { supabase, user } = await authenticatedContext()
  if (!user) return { success: false, error: AUTH_ERROR }
  const preference = await getOrCreateWaterUnit(supabase, user.id)
  if (!preference.success) return { success: false, error: SAVE_ERROR }
  const write = canonicalWrite(input, preference.data)
  if (!write.success) return write
  const { data, error } = await supabase.from("water_entries").update(write.data).eq("id", id).eq("user_id", user.id).select(COLUMNS).maybeSingle()
  if (error) return { success: false, error: SAVE_ERROR }
  return data ? { success: true, data: data as WaterEntry } : { success: false, error: NOT_FOUND }
}

export async function deleteWaterEntry(id: string): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await authenticatedContext()
  if (!user) return { success: false, error: AUTH_ERROR }
  const { data, error } = await supabase.from("water_entries").delete().eq("id", id).eq("user_id", user.id).select("id").maybeSingle()
  if (error) return { success: false, error: SAVE_ERROR }
  return data ? { success: true, data } : { success: false, error: NOT_FOUND }
}

export async function updateWaterUnit(unit: WaterUnit): Promise<ActionResult<WaterUnit>> {
  const { supabase, user } = await authenticatedContext()
  if (!user) return { success: false, error: AUTH_ERROR }
  const { data, error } = await supabase.from("user_preferences").update({ water_unit: unit }).eq("user_id", user.id).select("water_unit").maybeSingle()
  if (error) {
    logDevelopmentDatabaseError("update water unit", error)
    return { success: false, error: PREFERENCE_ERROR }
  }
  return data ? { success: true, data: data.water_unit } : { success: false, error: PREFERENCE_ERROR }
}
