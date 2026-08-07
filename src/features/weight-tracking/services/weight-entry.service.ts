import "server-only"

import { createClient } from "@/services/supabase/server"
import type { ActionResult, ApiError } from "@/types/api"
import type { ProfileGoal, UnitSystem } from "@/types/database"
import type { ValidatedWeightEntryInput } from "../schemas/weight-entry.schema"
import type { WeightEntry, WeightPageData } from "../types"
import { calculateWeightProgress, displayToKilograms } from "../utils/weight"

const COLUMNS = "id, user_id, weight_kg, recorded_at, note, created_at, updated_at"
const AUTH_ERROR: ApiError = { code: "UNAUTHENTICATED", message: "Sign in to manage weight entries." }
const LOAD_ERROR: ApiError = { code: "WEIGHT_LOAD_FAILED", message: "Unable to load your weight history. Please try again." }
const SAVE_ERROR: ApiError = { code: "WEIGHT_SAVE_FAILED", message: "Your weight entry could not be saved. Please try again." }
const NOT_FOUND: ApiError = { code: "NOT_FOUND", message: "Weight entry not found." }

async function context() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return { supabase, user: null, profile: null }
  const { data: profile } = await supabase.from("profiles").select("unit_system, goal").eq("id", user.id).maybeSingle()
  return { supabase, user, profile: profile as { unit_system: UnitSystem; goal: ProfileGoal | null } | null }
}

function canonicalWrite(input: ValidatedWeightEntryInput, unitSystem: UnitSystem): ActionResult<{ weight_kg: number; recorded_at: string; note: string | null }> {
  const weightKg = displayToKilograms(input.weight, unitSystem)
  if (weightKg < 20 || weightKg > 500) return { success: false, error: { code: "VALIDATION_ERROR", message: unitSystem === "imperial" ? "Weight must be between 44.1 and 1102.3 lb." : "Weight must be between 20 and 500 kg.", fieldErrors: { weight: [unitSystem === "imperial" ? "Enter a weight between 44.1 and 1102.3 lb." : "Enter a weight between 20 and 500 kg."] } } }
  return { success: true, data: { weight_kg: weightKg, recorded_at: new Date(input.recordedAt).toISOString(), note: input.note || null } }
}

export async function getWeightPageData(): Promise<ActionResult<WeightPageData>> {
  const { supabase, user, profile } = await context()
  if (!user) return { success: false, error: AUTH_ERROR }
  if (!profile) return { success: false, error: LOAD_ERROR }
  const { data, error } = await supabase.from("weight_entries").select(COLUMNS).eq("user_id", user.id).order("recorded_at", { ascending: false }).order("id", { ascending: false })
  if (error) return { success: false, error: LOAD_ERROR }
  const calculated = calculateWeightProgress(data as WeightEntry[], profile.goal)
  return { success: true, data: { entries: calculated.history, progress: calculated.progress, unitSystem: profile.unit_system, goal: profile.goal } }
}

export async function getWeightEntry(id: string): Promise<ActionResult<{ entry: WeightEntry; unitSystem: UnitSystem }>> {
  const { supabase, user, profile } = await context()
  if (!user) return { success: false, error: AUTH_ERROR }
  if (!profile) return { success: false, error: LOAD_ERROR }
  const { data, error } = await supabase.from("weight_entries").select(COLUMNS).eq("id", id).eq("user_id", user.id).maybeSingle()
  if (error) return { success: false, error: LOAD_ERROR }
  return data ? { success: true, data: { entry: data as WeightEntry, unitSystem: profile.unit_system } } : { success: false, error: NOT_FOUND }
}

export async function createWeightEntry(input: ValidatedWeightEntryInput): Promise<ActionResult<WeightEntry>> {
  const { supabase, user, profile } = await context()
  if (!user) return { success: false, error: AUTH_ERROR }
  if (!profile) return { success: false, error: SAVE_ERROR }
  const write = canonicalWrite(input, profile.unit_system)
  if (!write.success) return write
  const { data, error } = await supabase.from("weight_entries").insert({ user_id: user.id, ...write.data }).select(COLUMNS).single()
  return error ? { success: false, error: SAVE_ERROR } : { success: true, data: data as WeightEntry }
}

export async function updateWeightEntry(id: string, input: ValidatedWeightEntryInput): Promise<ActionResult<WeightEntry>> {
  const { supabase, user, profile } = await context()
  if (!user) return { success: false, error: AUTH_ERROR }
  if (!profile) return { success: false, error: SAVE_ERROR }
  const write = canonicalWrite(input, profile.unit_system)
  if (!write.success) return write
  const { data, error } = await supabase.from("weight_entries").update(write.data).eq("id", id).eq("user_id", user.id).select(COLUMNS).maybeSingle()
  if (error) return { success: false, error: SAVE_ERROR }
  return data ? { success: true, data: data as WeightEntry } : { success: false, error: NOT_FOUND }
}

export async function deleteWeightEntry(id: string): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await context()
  if (!user) return { success: false, error: AUTH_ERROR }
  const { data, error } = await supabase.from("weight_entries").delete().eq("id", id).eq("user_id", user.id).select("id").maybeSingle()
  if (error) return { success: false, error: SAVE_ERROR }
  return data ? { success: true, data } : { success: false, error: NOT_FOUND }
}
