import type { Database, FoodSource, MealType } from "@/types/database"

export type Meal = Database["public"]["Tables"]["meals"]["Row"]
export type MealItem = Database["public"]["Tables"]["meal_items"]["Row"]

export interface MealWithItems extends Meal { meal_items: MealItem[] }
export interface MealInput { name: string; mealType: MealType; consumedAt: string }
export interface MealItemInput { foodReference: string; quantityGrams: number }
export interface MealActionState { status: "idle" | "success" | "error"; message?: string; fieldErrors?: Record<string, string[]> }
export interface NutritionValues { calories: number; protein: number; carbohydrates: number; fat: number }
export interface FoodSnapshot extends NutritionValues { foodId: string | null; foodName: string; foodBrand: string | null; foodSource: FoodSource; externalId: string | null }
