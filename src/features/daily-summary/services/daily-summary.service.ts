import "server-only"

import { createClient } from "@/services/supabase/server"
import type { ActionResult, ApiError } from "@/types/api"
import type { ProfileGoal, UnitSystem, WaterUnit } from "@/types/database"
import { isValidTimeZone, selectedDayUtcRange } from "@/features/water-tracking"
import type { DailySummaryData, DailySummaryMeal, WeightUnit } from "../types"
import { aggregateMeals } from "../utils/daily-summary"

const AUTH_ERROR: ApiError = { code: "UNAUTHENTICATED", message: "Sign in to view your daily summary." }
const LOAD_ERROR: ApiError = { code: "DAILY_SUMMARY_LOAD_FAILED", message: "Unable to load your daily summary. Please try again." }
const MEAL_SELECT = "id, name, meal_type, consumed_at, meal_items(id, food_name, quantity_grams, calories, protein, carbohydrates, fat)"

export async function getDailySummary(selectedDate: string, timeZone: string): Promise<ActionResult<DailySummaryData>> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { success: false, error: AUTH_ERROR }
  if (!isValidTimeZone(timeZone)) return { success: false, error: { code: "VALIDATION_ERROR", message: "The browser timezone is invalid." } }

  let range: ReturnType<typeof selectedDayUtcRange>
  try {
    range = selectedDayUtcRange(selectedDate, timeZone)
  } catch {
    return { success: false, error: { code: "VALIDATION_ERROR", message: "The selected local day is invalid." } }
  }

  const [mealsResult, waterResult, weightResult, profileResult, preferencesResult] = await Promise.all([
    supabase.from("meals").select(MEAL_SELECT).eq("user_id", user.id).gte("consumed_at", range.startUtc).lt("consumed_at", range.endUtc).order("consumed_at", { ascending: true }),
    supabase.from("water_entries").select("amount_ml").eq("user_id", user.id).gte("consumed_at", range.startUtc).lt("consumed_at", range.endUtc),
    supabase.from("weight_entries").select("weight_kg, recorded_at").eq("user_id", user.id).lt("recorded_at", range.endUtc).order("recorded_at", { ascending: false }).order("id", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("profiles").select("unit_system, goal").eq("id", user.id).maybeSingle(),
    supabase.from("user_preferences").select("weight_unit, water_unit").eq("user_id", user.id).maybeSingle(),
  ])

  if (mealsResult.error || waterResult.error || weightResult.error || profileResult.error || preferencesResult.error || !profileResult.data) {
    return { success: false, error: LOAD_ERROR }
  }

  const meals = mealsResult.data as DailySummaryMeal[]
  const aggregated = aggregateMeals(meals)
  const hydrationMl = waterResult.data.reduce((total, entry) => total + Number(entry.amount_ml), 0)
  const unitSystem = profileResult.data.unit_system as UnitSystem
  const defaultWeightUnit: WeightUnit = unitSystem === "imperial" ? "lbs" : "kg"

  return {
    success: true,
    data: {
      selectedDate,
      timeZone,
      nutrition: aggregated.nutrition,
      mealCount: meals.length,
      meals: aggregated.meals,
      hydrationMl,
      waterUnit: (preferencesResult.data?.water_unit ?? "ml") as WaterUnit,
      weight: weightResult.data ? { weightKg: Number(weightResult.data.weight_kg), recordedAt: weightResult.data.recorded_at } : null,
      weightUnit: (preferencesResult.data?.weight_unit ?? defaultWeightUnit) as WeightUnit,
      unitSystem,
      goal: profileResult.data.goal as ProfileGoal | null,
    },
  }
}
