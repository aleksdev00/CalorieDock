import type { Database, MealType, ProfileGoal, UnitSystem, WaterUnit } from "@/types/database"

export type WeightUnit = Database["public"]["Tables"]["user_preferences"]["Row"]["weight_unit"]

export interface DailySummaryMealItem {
  id: string
  food_name: string
  quantity_grams: number
  calories: number
  protein: number
  carbohydrates: number
  fat: number
}

export interface DailySummaryMeal {
  id: string
  name: string
  meal_type: MealType
  consumed_at: string
  meal_items: DailySummaryMealItem[]
}

export interface NutritionTotals {
  calories: number
  protein: number
  carbohydrates: number
  fat: number
}

export interface MealOverview extends DailySummaryMeal {
  totals: NutritionTotals
}

export interface SummaryWeight {
  weightKg: number
  recordedAt: string
}

export interface DailySummaryData {
  selectedDate: string
  timeZone: string
  nutrition: NutritionTotals
  mealCount: number
  meals: MealOverview[]
  hydrationMl: number
  waterUnit: WaterUnit
  weight: SummaryWeight | null
  weightUnit: WeightUnit
  unitSystem: UnitSystem
  goal: ProfileGoal | null
  profile: {
    fullName: string | null
    profileCompleted: boolean
  }
}
